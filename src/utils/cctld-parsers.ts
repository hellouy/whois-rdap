/**
 * ccTLD Parser Factory — Strategy Pattern
 *
 * Each ccTLD parser provides TLD-specific regex patterns for Registrar,
 * NameServers, dates and status extraction from raw WHOIS text.
 * Fall back to DEFAULT_PARSER when no specific parser is found.
 *
 * Pure functions only. No UI, no React, no fetch.
 */

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface ParsedFields {
  registrar?: string;
  nameServers: string[];
  creationDate?: string;
  expirationDate?: string;
  updatedDate?: string;
  status: string[];
  registrantOrg?: string;
  registrantCountry?: string;
  registrarAbuseEmail?: string;
}

export interface CcTLDParser {
  tld: string;
  label: string;
  parse(rawWhois: string, domain: string): ParsedFields;
}

// ── Helper utilities ──────────────────────────────────────────────────────────

function extract(text: string, patterns: RegExp[]): string | undefined {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]?.trim()) return m[1].trim();
  }
  return undefined;
}

function extractAll(text: string, patterns: RegExp[]): string[] {
  const results: string[] = [];
  for (const re of patterns) {
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(re);
      if (m?.[1]?.trim()) results.push(m[1].trim().split(/\s+/)[0].toLowerCase().replace(/\.+$/, ""));
    }
  }
  return [...new Set(results.filter((ns) => ns.includes(".")))];
}

// ── TLD-specific parsers ───────────────────────────────────────────────────────

const JP_PARSER: CcTLDParser = {
  tld: ".jp",
  label: "JPRS (.jp)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /\[Registrant\]\s*(.+)/i,
        /Registrant Organization:\s*(.+)/i,
        /\[登録者\]\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /\[Name Server\]\s*(.+)/i,
        /p\s*\.\s*dns\s*:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /\[登録年月日\]\s*(.+)/i,
        /\[Created on\]\s*(.+)/i,
        /Created Date:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /\[有効期限\]\s*(.+)/i,
        /\[Expires on\]\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /\[最終更新\]\s*(.+)/i,
        /\[Last Updated\]\s*(.+)/i,
      ]),
      status: (extract(raw, [/\[状態\]\s*(.+)/i, /State:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "JP",
    };
  },
};

const DE_PARSER: CcTLDParser = {
  tld: ".de",
  label: "DENIC (.de)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /organisation:\s*(.+)/i,
        /registrar:\s*(.+)/i,
        /\[Registrar\]\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /expires:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /changed:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
      ]),
      status: (extract(raw, [/status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "DE",
    };
  },
};

const UK_PARSER: CcTLDParser = {
  tld: ".uk",
  label: "Nominet (.uk)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
        /Tag:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name servers?:\s*(.+)/i,
        /\s{4}(.+\..+)/,
      ]),
      creationDate: extract(raw, [
        /Registered on:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /Expiry date:\s*(.+)/i,
        /Renewal date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /Last updated:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ]),
      status: (extract(raw, [/Registration status:\s*(.+)/i, /Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "GB",
      registrarAbuseEmail: extract(raw, [/Registrar Abuse Contact Email:\s*(.+)/i]),
    };
  },
};

const IN_PARSER: CcTLDParser = {
  tld: ".in",
  label: "NIXI (.in)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
        /Sponsoring Registrar:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /paid-till:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ]),
      status: raw.match(/Domain Status:\s*(.+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "").split(/\s+/)[0]) || [],
      registrantCountry: "IN",
    };
  },
};

const BR_PARSER: CcTLDParser = {
  tld: ".br",
  label: "NIC.br (.br)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /owner:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
        /provider:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /created:\s*(.+)/i,
        /Created:\s*(.+)/i,
        /creation date:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /expires:\s*(.+)/i,
        /expiration date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /changed:\s*(.+)/i,
        /last modified:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ]),
      status: (extract(raw, [/status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "BR",
    };
  },
};

const RU_PARSER: CcTLDParser = {
  tld: ".ru",
  label: "RIPN (.ru)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /registrar:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /paid-till:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /changed:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ]),
      status: (extract(raw, [/state:\s*(.+)/i, /Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "RU",
    };
  },
};

const AU_PARSER: CcTLDParser = {
  tld: ".au",
  label: "auDA (.au)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar Name:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
        /Registrant Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /Last Modified:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ]),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "AU",
    };
  },
};

const IO_PARSER: CcTLDParser = {
  tld: ".io",
  label: "Afilias (.io)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
        /Sponsoring Registrar:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ]),
      expirationDate: extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Expiration Date:\s*(.+)/i,
      ]),
      updatedDate: extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Updated Date:\s*(.+)/i,
      ]),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: undefined,
    };
  },
};

const DEFAULT_PARSER: CcTLDParser = {
  tld: "*",
  label: "Generic WHOIS",
  parse(raw, domain) {
    const getValue = (patterns: RegExp[]): string | undefined => extract(raw, patterns);
    const getValues = (patterns: RegExp[]): string[] => extractAll(raw, patterns);

    return {
      registrar: getValue([
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
        /Sponsoring Registrar:\s*(.+)/i,
        /Register:\s*(.+)/i,
        /注册商:\s*(.+)/i,
      ]),
      nameServers: getValues([
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Nameserver:\s*(.+)/i,
        /DNS:\s*(.+)/i,
      ]),
      creationDate: getValue([
        /Creation Date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
        /created:\s*(.+)/i,
        /Registered:\s*(.+)/i,
        /登録年月日:\s*(.+)/i,
      ]),
      expirationDate: getValue([
        /Expir(?:y|ation) Date:\s*(.+)/i,
        /expire:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /paid-till:\s*(.+)/i,
        /有効期限:\s*(.+)/i,
      ]),
      updatedDate: getValue([
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
        /最終更新:\s*(.+)/i,
      ]),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) ||
               (getValue([/Status:\s*(.+)/i, /state:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantOrg: getValue([
        /Registrant Organization:\s*(.+)/i,
        /Registrant:\s*(.+)/i,
        /Organization:\s*(.+)/i,
        /Owner:\s*(.+)/i,
      ]),
      registrantCountry: getValue([
        /Registrant Country:\s*(.+)/i,
        /Country:\s*(.+)/i,
        /country:\s*(.+)/i,
      ]),
      registrarAbuseEmail: getValue([
        /Registrar Abuse Contact Email:\s*(.+)/i,
        /Abuse Email:\s*(.+)/i,
      ]),
    };
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────

const PARSER_REGISTRY: Map<string, CcTLDParser> = new Map([
  [".jp", JP_PARSER],
  [".de", DE_PARSER],
  [".uk", UK_PARSER],
  [".co.uk", UK_PARSER],
  [".org.uk", UK_PARSER],
  [".me.uk", UK_PARSER],
  [".in", IN_PARSER],
  [".co.in", IN_PARSER],
  [".net.in", IN_PARSER],
  [".br", BR_PARSER],
  [".com.br", BR_PARSER],
  [".net.br", BR_PARSER],
  [".ru", RU_PARSER],
  [".рф", RU_PARSER],
  [".au", AU_PARSER],
  [".com.au", AU_PARSER],
  [".net.au", AU_PARSER],
  [".io", IO_PARSER],
]);

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Returns the most specific parser for a given domain.
 * Never throws — falls back to DEFAULT_PARSER when no match is found.
 *
 * @example
 *   ccTLDParserFactory("google.co.uk") → UK_PARSER
 *   ccTLDParserFactory("example.xyz")  → DEFAULT_PARSER
 */
export function ccTLDParserFactory(domain: string): CcTLDParser {
  const lower = domain.trim().toLowerCase();

  // Try longest suffix first (e.g. ".co.uk" before ".uk")
  const parts = lower.split(".");
  for (let i = 1; i < parts.length; i++) {
    const suffix = "." + parts.slice(i).join(".");
    const parser = PARSER_REGISTRY.get(suffix);
    if (parser) return parser;
  }

  return DEFAULT_PARSER;
}

/**
 * Convenience: parse a raw WHOIS string for a given domain using the
 * appropriate ccTLD strategy.
 */
export function parseCcTLDWhois(rawWhois: string, domain: string): ParsedFields {
  const parser = ccTLDParserFactory(domain);
  return parser.parse(rawWhois, domain);
}

export { DEFAULT_PARSER };
