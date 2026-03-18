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

// ── ccTLD date normalisation helpers ─────────────────────────────────────────

const MONTH_ABBR: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  // Spanish
  ene: "01", abr: "04", ago: "08", sep2: "09", oct2: "10", nov2: "11", dic: "12",
  // French
  janv: "01", févr: "02", mars: "03", avr: "04", juin: "06", juil: "07",
  août: "08", sept: "09", déc: "12",
  // German
  jan2: "01", feb2: "02", mär: "03", mai: "05", jun2: "06", jul2: "07",
  aug: "08", okt: "10", dez: "12",
  // Dutch
  mrt: "03", mei: "05", okt2: "10",
  // Korean month numbers (already numeric so handled separately)
};

/**
 * Normalise irregular ccTLD date strings to ISO yyyy-mm-dd or RFC3339 form.
 * Returns the input unchanged if no pattern matches.
 */
export function normaliseCcDate(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const s = raw.trim();

  // "before 2017-01-01" → strip "before"
  const beforeMatch = s.match(/before\s+(\d{4}-\d{2}-\d{2})/i);
  if (beforeMatch) return beforeMatch[1];

  // dd-Mon-yyyy  e.g. "15-Jan-2024", "02-jan-2001"
  const dmyAlpha = s.match(/^(\d{1,2})[.\-/]([a-záéíóúàèìòùäöüñçêâîôûæøå]{2,5})[.\-/](\d{4})/i);
  if (dmyAlpha) {
    const [, d, mon, y] = dmyAlpha;
    const mm = MONTH_ABBR[mon.toLowerCase().replace(/[^a-z]/g, "")] || mon;
    return `${y}-${mm}-${d.padStart(2, "0")}`;
  }

  // Mon-dd-yyyy  e.g. "Jan-15-2024"
  const mdyAlpha = s.match(/^([a-záéíóú]{2,5})[.\-/](\d{1,2})[.\-/](\d{4})/i);
  if (mdyAlpha) {
    const [, mon, d, y] = mdyAlpha;
    const mm = MONTH_ABBR[mon.toLowerCase()] || mon;
    return `${y}-${mm}-${d.padStart(2, "0")}`;
  }

  // dd.mm.yyyy  e.g. "15.01.2024"
  const dotDmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dotDmy) {
    const [, d, m, y] = dotDmy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // yyyy.mm.dd  e.g. "2024.01.15" (Korean)
  const dotYmd = s.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})/);
  if (dotYmd) {
    const [, y, m, d] = dotYmd;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // yyyymmdd
  const compact = s.match(/^(\d{4})(\d{2})(\d{2})(?:\D|$)/);
  if (compact) {
    const [, y, m, d] = compact;
    return `${y}-${m}-${d}`;
  }

  // Chinese "2020년 01월 15일" (Korean with 년/월/일)
  const korean = s.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (korean) {
    const [, y, m, d] = korean;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return s;
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

const CN_PARSER: CcTLDParser = {
  tld: ".cn",
  label: "CNNIC (.cn)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /注册商:\s*(.+)/i,
        /Sponsoring Registrar:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Registration Time:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
        /created:\s*(.+)/i,
        /注册日期:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiration Time:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /过期日期:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Update Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
        /更新日期:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "CN",
      registrantOrg: extract(raw, [
        /Registrant:\s*(.+)/i,
        /Registrant Organization:\s*(.+)/i,
        /注册人:\s*(.+)/i,
      ]),
    };
  },
};

const TW_PARSER: CcTLDParser = {
  tld: ".tw",
  label: "TWNIC (.tw)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registration Service Provider:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Record created on\s+(.+)/i,
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Record expires on\s+(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Record last updated on\s+(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "TW",
    };
  },
};

const KR_PARSER: CcTLDParser = {
  tld: ".kr",
  label: "KISA (.kr)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Authorized Agency:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
        /등록기관:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Host Name:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Registered Date\s*:\s*(.+)/i,
        /등록일\s*:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiration Date\s*:\s*(.+)/i,
        /만료일\s*:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Last Updated Date\s*:\s*(.+)/i,
        /최종수정일\s*:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Domain Status\s*:\s*(.+)/i, /상태\s*:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "KR",
      registrantOrg: extract(raw, [
        /Registrant\s*:\s*(.+)/i,
        /등록인\s*:\s*(.+)/i,
      ]),
    };
  },
};

const FR_PARSER: CcTLDParser = {
  tld: ".fr",
  label: "AFNIC (.fr)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiry Date:\s*(.+)/i,
        /expires:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /last-update:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/status:\s*(.+)/i, /Domain Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "FR",
      registrarAbuseEmail: extract(raw, [/e-mail:\s*(.+)/i, /Registrar Abuse Contact Email:\s*(.+)/i]),
    };
  },
};

const IT_PARSER: CcTLDParser = {
  tld: ".it",
  label: "NIC.it (.it)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar\s*\n\s*Name:\s*(.+)/im,
        /Registrar:\s*(.+)/i,
        /Organisation:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Nameservers\s*\n(?:\s+.+\n)*?\s+(.+)/im,
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expire Date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Last Update:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "IT",
    };
  },
};

const ES_PARSER: CcTLDParser = {
  tld: ".es",
  label: "Red.es (.es)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar Name:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
        /Nombre del Registrador:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Servidor de Nombres:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Fecha de Alta:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiration Date:\s*(.+)/i,
        /Fecha de Expiración:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Fecha de Modificación:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "ES",
    };
  },
};

const PL_PARSER: CcTLDParser = {
  tld: ".pl",
  label: "NASK (.pl)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /REGISTRAR:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /nameservers:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
        /registration date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /option expiration date:\s*(.+)/i,
        /renewal date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /last modified:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "PL",
    };
  },
};

const NL_PARSER: CcTLDParser = {
  tld: ".nl",
  label: "SIDN (.nl)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Domain nameservers:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "NL",
    };
  },
};

const SE_PARSER: CcTLDParser = {
  tld: ".se",
  label: "IIS (.se)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /expires:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /modified:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: (extract(raw, [/state:\s*(.+)/i, /Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "SE",
    };
  },
};

const CH_PARSER: CcTLDParser = {
  tld: ".ch",
  label: "SWITCH (.ch)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /First registration date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "CH",
    };
  },
};

const CA_PARSER: CcTLDParser = {
  tld: ".ca",
  label: "CIRA (.ca)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Domain registered:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry date:\s*(.+)/i,
        /Domain expires:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Domain last updated:\s*(.+)/i,
        /Last modified:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "CA",
    };
  },
};

const HK_PARSER: CcTLDParser = {
  tld: ".hk",
  label: "HKIRC (.hk)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar Name:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Servers Information:\s*\n(?:\s+(.+)\n)/im,
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Domain Name Commencement Date:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiry Date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Last Updated Date:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "HK",
    };
  },
};

const SG_PARSER: CcTLDParser = {
  tld: ".sg",
  label: "SGNIC (.sg)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Activation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiration Date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Modified Date:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map((l) => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "SG",
    };
  },
};

// ── Additional ccTLD parsers (BN, MY, VN, TH, ID, etc.) ─────────────────────

const BN_PARSER: CcTLDParser = {
  tld: ".bn",
  label: "BNNIC (.bn)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Sponsoring Registrar:\s*(.+)/i,
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Nameserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Created Date:\s*(.+)/i,
        /Registration Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Expiration Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map(l => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "BN",
      registrantOrg: extract(raw, [
        /Registrant Organization:\s*(.+)/i,
        /Registrant:\s*(.+)/i,
        /Owner:\s*(.+)/i,
      ]),
    };
  },
};

const MY_PARSER: CcTLDParser = {
  tld: ".my",
  label: "MYNIC (.my)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Domain registered:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Domain expires:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map(l => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "MY",
    };
  },
};

const VN_PARSER: CcTLDParser = {
  tld: ".vn",
  label: "VNNIC (.vn)",
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
        /DNS:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /Registered:\s*(\d{4}[-/. ]\d{1,2}[-/. ]\d{1,2}.*)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Expiration Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map(l => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "VN",
    };
  },
};

const TH_PARSER: CcTLDParser = {
  tld: ".th",
  label: "THNIC (.th)",
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
        /DNS:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
        /Registered:\s*(\d{4}[-/. ]\d{1,2}[-/. ]\d{1,2}.*)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Expiration Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Domain Status:\s*(.+)/i, /Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "TH",
    };
  },
};

const ID_PARSER: CcTLDParser = {
  tld: ".id",
  label: "PANDI (.id)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
        /Registered:\s*(\d{4}[-/. ]\d{1,2}[-/. ]\d{1,2}.*)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Expiration Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map(l => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "ID",
    };
  },
};

const PH_PARSER: CcTLDParser = {
  tld: ".ph",
  label: "DOT.PH (.ph)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registration Authority:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /DNS:\s*(.+)/i,
        /nserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Registered:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiration Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Updated:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /Last Modified:\s*(.+)/i,
      ])),
      status: raw.match(/Domain Status:\s*(\S+)/gi)?.map(l => l.replace(/Domain Status:\s*/i, "")) || [],
      registrantCountry: "PH",
    };
  },
};

const TR_PARSER: CcTLDParser = {
  tld: ".tr",
  label: "NIC.TR (.tr)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Name Server:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Nameserver:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Created Date:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiry Date:\s*(.+)/i,
        /Expires:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Last Updated:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "TR",
    };
  },
};

const UA_PARSER: CcTLDParser = {
  tld: ".ua",
  label: "Hostmaster (.ua)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /expiry-date:\s*(.+)/i,
        /expires:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /modified:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "UA",
    };
  },
};

const BE_PARSER: CcTLDParser = {
  tld: ".be",
  label: "DNS.be (.be)",
  parse(raw) {
    return {
      registrar: extract(raw, [
        /Registrar:\s*(.+)/i,
        /Registrar Name:\s*(.+)/i,
      ]),
      nameServers: extractAll(raw, [
        /Nameserver:\s*(.+)/i,
        /nserver:\s*(.+)/i,
        /Name Server:\s*(.+)/i,
      ]),
      creationDate: normaliseCcDate(extract(raw, [
        /Registered:\s*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}.*)/i,
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /Expiry Date:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /Last Updated:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
        /changed:\s*(.+)/i,
      ])),
      status: (extract(raw, [/Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "BE",
    };
  },
};

const AT_PARSER: CcTLDParser = {
  tld: ".at",
  label: "NIC.at (.at)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /registered:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
        /created:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /expires:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /changed:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: (extract(raw, [/rstatus:\s*(.+)/i, /Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "AT",
    };
  },
};

const RU_PARSER_ALT: CcTLDParser = {
  tld: ".ru",
  label: "TCINET (.ru)",
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
      creationDate: normaliseCcDate(extract(raw, [
        /created:\s*(.+)/i,
        /Creation Date:\s*(.+)/i,
      ])),
      expirationDate: normaliseCcDate(extract(raw, [
        /paid-till:\s*(.+)/i,
        /Registry Expiry Date:\s*(.+)/i,
        /Expiry Date:\s*(.+)/i,
      ])),
      updatedDate: normaliseCcDate(extract(raw, [
        /changed:\s*(.+)/i,
        /Updated Date:\s*(.+)/i,
      ])),
      status: (extract(raw, [/state:\s*(.+)/i, /Status:\s*(.+)/i]) || "").split(/[\s,]+/).filter(Boolean),
      registrantCountry: "RU",
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
  // ── East Asia ──
  [".jp", JP_PARSER],
  [".co.jp", JP_PARSER],
  [".ne.jp", JP_PARSER],
  [".or.jp", JP_PARSER],
  [".cn", CN_PARSER],
  [".com.cn", CN_PARSER],
  [".net.cn", CN_PARSER],
  [".org.cn", CN_PARSER],
  [".tw", TW_PARSER],
  [".com.tw", TW_PARSER],
  [".net.tw", TW_PARSER],
  [".org.tw", TW_PARSER],
  [".kr", KR_PARSER],
  [".co.kr", KR_PARSER],
  [".or.kr", KR_PARSER],
  [".hk", HK_PARSER],
  [".com.hk", HK_PARSER],
  [".net.hk", HK_PARSER],
  [".org.hk", HK_PARSER],

  // ── Southeast Asia ──
  [".sg", SG_PARSER],
  [".com.sg", SG_PARSER],
  [".net.sg", SG_PARSER],
  [".org.sg", SG_PARSER],
  [".bn", BN_PARSER],
  [".com.bn", BN_PARSER],
  [".my", MY_PARSER],
  [".com.my", MY_PARSER],
  [".net.my", MY_PARSER],
  [".vn", VN_PARSER],
  [".com.vn", VN_PARSER],
  [".net.vn", VN_PARSER],
  [".th", TH_PARSER],
  [".co.th", TH_PARSER],
  [".in.th", TH_PARSER],
  [".id", ID_PARSER],
  [".co.id", ID_PARSER],
  [".net.id", ID_PARSER],
  [".ph", PH_PARSER],
  [".com.ph", PH_PARSER],

  // ── South Asia ──
  [".in", IN_PARSER],
  [".co.in", IN_PARSER],
  [".net.in", IN_PARSER],

  // ── Oceania ──
  [".au", AU_PARSER],
  [".com.au", AU_PARSER],
  [".net.au", AU_PARSER],

  // ── UK / Ireland ──
  [".uk", UK_PARSER],
  [".co.uk", UK_PARSER],
  [".org.uk", UK_PARSER],
  [".me.uk", UK_PARSER],
  [".ie", DEFAULT_PARSER],

  // ── Western Europe ──
  [".de", DE_PARSER],
  [".fr", FR_PARSER],
  [".it", IT_PARSER],
  [".es", ES_PARSER],
  [".nl", NL_PARSER],
  [".se", SE_PARSER],
  [".nu", SE_PARSER],
  [".ch", CH_PARSER],
  [".li", CH_PARSER],
  [".be", BE_PARSER],
  [".at", AT_PARSER],

  // ── Central / Eastern Europe ──
  [".pl", PL_PARSER],

  // ── Eastern Europe / CIS ──
  [".ru", RU_PARSER_ALT],
  [".рф", RU_PARSER_ALT],
  [".ua", UA_PARSER],

  // ── Middle East / Turkey ──
  [".tr", TR_PARSER],
  [".com.tr", TR_PARSER],
  [".net.tr", TR_PARSER],

  // ── Americas ──
  [".br", BR_PARSER],
  [".com.br", BR_PARSER],
  [".net.br", BR_PARSER],
  [".ca", CA_PARSER],

  // ── Generic popular TLDs ──
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
