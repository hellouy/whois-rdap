/**
 * Whois Client — API middleware layer
 *
 * Centralises all WHOIS/RDAP fetching, parsing, retry and in-memory caching.
 * Components call `fetchWhois(domain)` and never touch fetch() directly.
 */

import { getRdapServer } from "@/utils/whois-servers";
import { toASCII, isIDN } from "@/utils/tld-servers";
import { looksLikeNotFoundWhois, inferRegisteredFromWhois } from "@/utils/whois-heuristics";
import { ccTLDParserFactory } from "@/utils/cctld-parsers";

// ── Public types ──────────────────────────────────────────────────────────────

export enum DataSource {
  RDAP            = "RDAP",
  RDAP_DIRECT     = "RDAP_DIRECT",
  RDAP_ORG        = "RDAP_ORG",
  WHOIS_FALLBACK  = "WHOIS_FALLBACK",
  TIANHU          = "TIANHU",
  DNS_FALLBACK    = "DNS_FALLBACK",
  UNKNOWN         = "UNKNOWN",
}

export interface ResultEnvelope<T> {
  data: T | null;
  error: string | null;
  source: DataSource;
  reliabilityScore: number;
  dataProvenance: string;
}

/** Calculate 0–1 completeness score for a WhoisData object. */
export function calculateReliabilityScore(d: WhoisData | null): number {
  if (!d) return 0;
  let score = 0;
  if (d.domainName)                              score += 0.10;
  if (d.registrar)                               score += 0.15;
  if (d.creationDate)                            score += 0.15;
  if (d.expirationDate)                          score += 0.15;
  if (d.nameServers && d.nameServers.length > 0) score += 0.15;
  if (d.status      && d.status.length > 0)      score += 0.10;
  if (d.registrantOrg || d.registrantCountry)    score += 0.10;
  if (d.updatedDate)                             score += 0.10;
  return Math.min(1, parseFloat(score.toFixed(2)));
}

function provenanceLabel(source: DataSource, score: number): string {
  const pct = Math.round(score * 100);
  switch (source) {
    case DataSource.RDAP:         return `RDAP via proxy (${pct}% complete)`;
    case DataSource.RDAP_DIRECT:  return `RDAP direct registry (${pct}% complete)`;
    case DataSource.RDAP_ORG:     return `RDAP via rdap.org (${pct}% complete)`;
    case DataSource.WHOIS_FALLBACK: return `WHOIS text fallback (${pct}% complete)`;
    case DataSource.TIANHU:       return `tian.hu WHOIS API (${pct}% complete)`;
    case DataSource.DNS_FALLBACK: return `DNS existence check (${pct}% complete)`;
    default:                      return `Unknown source (${pct}% complete)`;
  }
}

export interface WhoisData {
  domainName?: string;
  registrar?: string;
  registrarIanaId?: string;
  registrarAbuseEmail?: string;
  registrarAbusePhone?: string;
  creationDate?: string;
  expirationDate?: string;
  updatedDate?: string;
  nameServers?: string[];
  tldServers?: string[];
  status?: string[];
  registrantOrg?: string;
  registrantCountry?: string;
  dnssec?: string;
  registered?: boolean;
  raw?: string;
  rdapRaw?: unknown;
}

type AnyObj = Record<string, unknown>;

// ── In-memory cache ───────────────────────────────────────────────────────────

const whoisCache = new Map<string, { data: WhoisData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export function getCachedWhois(domain: string): WhoisData | null {
  const cached = whoisCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
  if (cached) whoisCache.delete(domain);
  return null;
}

export function setCachedWhois(domain: string, data: WhoisData): void {
  whoisCache.set(domain, { data, timestamp: Date.now() });
  if (whoisCache.size > 100) {
    const oldest = whoisCache.keys().next().value;
    if (oldest) whoisCache.delete(oldest);
  }
}

export function clearWhoisCache(): void {
  whoisCache.clear();
}

// ── Parsing helpers (pure functions) ─────────────────────────────────────────

export function safeParseJson(text: string): unknown | null {
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let start = -1;
  let end = -1;
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    start = firstBracket;
    end = text.lastIndexOf("]");
  } else {
    start = firstBrace;
    end = text.lastIndexOf("}");
  }
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  try { return JSON.parse(text); } catch {}
  return null;
}

function parseRegistrar(entity?: AnyObj) {
  if (!entity) return { name: undefined, ianaId: undefined };
  const vcard = entity?.vcardArray as unknown[][];
  const v = (k: string) => vcard?.[1]?.find((x: unknown) => (x as unknown[])?.[0] === k)?.[3];
  const name = v("org") || v("fn") || entity.handle || entity.name;
  const publicIds = Array.isArray(entity.publicIds) ? entity.publicIds : [];
  const ianaId = (publicIds as AnyObj[]).find((p) => /iana/i.test(String(p?.type || "")))?.identifier;
  return { name, ianaId };
}

function parseEntities(entities: AnyObj[] = []) {
  const findByRole = (role: string) =>
    entities.find((e) => Array.isArray(e?.roles) && (e.roles as string[]).includes(role));

  const registrarEntity = findByRole("registrar");
  const abuseEntity = findByRole("abuse") || registrarEntity;
  const registrantEntity = findByRole("registrant") || findByRole("holder") || findByRole("owner");

  const reg = parseRegistrar(registrarEntity);
  const v = (ent: AnyObj | undefined, k: string) => {
    if (!ent?.vcardArray) return undefined;
    const vcard = ent.vcardArray as unknown[][];
    const entry = vcard?.[1]?.find((x: unknown) => (x as unknown[])?.[0] === k);
    return (entry as unknown[])?.[3];
  };

  const registrarAbuseEmail = v(abuseEntity, "email") as string | undefined;
  const registrarAbusePhone = v(abuseEntity, "tel") as string | undefined;

  let registrantOrg = (v(registrantEntity, "org") || v(registrantEntity, "fn")) as string | undefined;
  if (!registrantOrg && registrantEntity) {
    registrantOrg = (registrantEntity.org || registrantEntity.organization || registrantEntity.name) as string | undefined;
  }

  let registrantCountry = (v(registrantEntity, "country-name") || v(registrantEntity, "country-code")) as string | undefined;
  const adr = registrantEntity?.vcardArray
    ? ((registrantEntity.vcardArray as unknown[][])?.[1]?.find((x: unknown) => (x as unknown[])?.[0] === "adr") as unknown[])?.[3]
    : undefined;
  if (!registrantCountry && Array.isArray(adr) && adr.length >= 7) registrantCountry = adr[6] as string;
  if (!registrantCountry && registrantEntity) {
    registrantCountry = (registrantEntity.country || registrantEntity.countryCode || registrantEntity.cc) as string | undefined;
  }

  return { registrar: reg.name as string | undefined, registrarIanaId: reg.ianaId as string | undefined, registrarAbuseEmail, registrarAbusePhone, registrantOrg, registrantCountry };
}

function parseEvents(events: AnyObj[] = []) {
  const find = (keys: string[]) => {
    const e = events.find((ev) =>
      keys.some((k) => String(ev.eventAction || ev.action || "").toLowerCase().includes(k))
    );
    return (e?.eventDate || e?.date) as string | undefined;
  };
  return {
    c: find(["registration", "create", "registered"]),
    e: find(["expiration", "expire", "expiry"]),
    u: find(["last changed", "update", "last update", "modified"]),
  };
}

/** Decode HTML entities in a string (handles &eacute; &#233; etc.) */
export function decodeHtmlEntities(s: string): string {
  if (!s || !s.includes("&")) return s;
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&eacute;/g, "é").replace(/&Eacute;/g, "É")
    .replace(/&egrave;/g, "è").replace(/&Egrave;/g, "È")
    .replace(/&ecirc;/g, "ê").replace(/&Ecirc;/g, "Ê")
    .replace(/&oacute;/g, "ó").replace(/&Oacute;/g, "Ó")
    .replace(/&ouml;/g, "ö").replace(/&Ouml;/g, "Ö")
    .replace(/&uuml;/g, "ü").replace(/&Uuml;/g, "Ü")
    .replace(/&auml;/g, "ä").replace(/&Auml;/g, "Ä")
    .replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ")
    .replace(/&aacute;/g, "á").replace(/&Aacute;/g, "Á")
    .replace(/&iacute;/g, "í").replace(/&Iacute;/g, "Í")
    .replace(/&uacute;/g, "ú").replace(/&Uacute;/g, "Ú")
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c))
    .replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCharCode(parseInt(c, 16)));
}

/** Strip HTML tags and collapse whitespace in WHOIS raw text from tian.hu */
export function stripHtmlTags(s: string): string {
  if (!s || !s.includes("<")) return s;
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .split("\n").map(l => l.trim()).join("\n");
}

const _MONTH_MAP: Record<string, string> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

export function formatDate(s?: string): string | undefined {
  if (!s) return undefined;
  const dateStr = String(s).trim();

  // Strip "before " prefix used by some ccTLD WHOIS servers
  const noBefore = dateStr.replace(/^before\s+/i, "");

  // Strip trailing timezone abbreviations like CLST, AEST, NZST, GMT, UTC, etc.
  // and UTC offset strings like +05:30, -03:00
  const cleaned = noBefore
    .replace(/\s+[A-Z]{2,6}(\s*[+-]\d{2}:?\d{2})?$/, "")
    .replace(/\s+[+-]\d{2}:?\d{2}$/, "")
    .trim();

  let date: Date;

  // dd-Mon-yyyy or dd/Mon/yyyy  e.g. "15-Jan-2024", "02-jan-2001 00:00:00"
  const dmyAlpha = cleaned.match(/^(\d{1,2})[-/]([a-z]{3})[-/](\d{4})/i);
  if (dmyAlpha) {
    const [, d, mon, y] = dmyAlpha;
    const mm = _MONTH_MAP[mon.toLowerCase()] || "01";
    date = new Date(`${y}-${mm}-${d.padStart(2, "0")}`);
  // yyyy.mm.dd Korean-style
  } else if (/^\d{4}\.\d{1,2}\.\d{1,2}/.test(cleaned)) {
    const m = cleaned.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})/);
    date = m ? new Date(`${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`) : new Date(cleaned);
  // Korean 년/월/일
  } else if (/\d{4}년/.test(cleaned)) {
    const m = cleaned.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    date = m ? new Date(`${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`) : new Date(cleaned);
  // dd.mm.yyyy
  } else if (/^\d{1,2}\.\d{1,2}\.\d{4}/.test(cleaned)) {
    const dotMatch = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (dotMatch) {
      const [, day, month, year] = dotMatch;
      date = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    } else {
      date = new Date(cleaned);
    }
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleaned)) {
    const m = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    date = m ? new Date(`${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`) : new Date(cleaned);
  } else if (/^\d{4}\/\d{1,2}\/\d{1,2}/.test(cleaned)) {
    date = new Date(cleaned.replace(/\//g, "-"));
  } else if (/^\d{8}$/.test(cleaned)) {
    date = new Date(`${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`);
  } else {
    date = new Date(cleaned);
  }

  if (isNaN(date.getTime())) {
    const fallback = new Date(dateStr);
    if (!isNaN(fallback.getTime())) date = fallback;
    else return dateStr;
  }
  const y = date.getFullYear();
  const mo = date.getMonth() + 1;
  const d = date.getDate();
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return `${y}年${mo}月${d}日 ${hh}:${mm}:${ss}`;
}

export function parseRdap(obj: AnyObj): WhoisData {
  const domainName = (obj.ldhName || obj.unicodeName || obj.domain || obj.domainName) as string | undefined;

  let ns: string[] = [];
  if (Array.isArray(obj.nameservers)) {
    ns = (obj.nameservers as AnyObj[]).map((n) => (n.ldhName || n.unicodeName || n.name || n.hostName) as string).filter(Boolean);
  } else if (Array.isArray(obj.nameServers)) {
    ns = (obj.nameServers as (AnyObj | string)[]).map((n) => typeof n === "string" ? n : (n.ldhName || n.unicodeName || n.name) as string).filter(Boolean);
  }

  let status: string[] = [];
  if (Array.isArray(obj.status)) {
    status = (obj.status as unknown[]).map((s) => {
      const raw = typeof s === "string" ? s : (s as AnyObj).status || (s as AnyObj).text || (s as AnyObj).value;
      return decodeHtmlEntities(String(raw || "")).replace(/\s+https?:\/\/\S+/g, "").trim();
    }).filter(Boolean) as string[];
  } else if (obj.status) {
    status = [decodeHtmlEntities(String(obj.status)).trim()];
  }

  const secureDNS = obj.secureDNS as AnyObj | undefined;
  const dnssec = secureDNS?.delegationSigned ? "已启用"
    : secureDNS ? "未启用"
    : obj.dnssec ? (obj.dnssec === true || obj.dnssec === "signed" ? "已启用" : "未启用")
    : undefined;

  const ent = parseEntities((obj.entities as AnyObj[]) || []);
  const ev = parseEvents((obj.events as AnyObj[]) || []);

  return {
    domainName,
    registered: true,
    registrar: ent.registrar,
    registrarIanaId: ent.registrarIanaId,
    registrarAbuseEmail: ent.registrarAbuseEmail,
    registrarAbusePhone: ent.registrarAbusePhone,
    registrantOrg: ent.registrantOrg,
    registrantCountry: ent.registrantCountry,
    creationDate: formatDate(ev.c),
    expirationDate: formatDate(ev.e),
    updatedDate: formatDate(ev.u),
    nameServers: ns,
    status,
    dnssec,
    rdapRaw: obj,
  };
}

export function parseWhoisText(rawInput: string, domain: string): WhoisData {
  // Decode HTML entities and strip HTML tags (tian.hu sometimes returns HTML-encoded WHOIS)
  const text = stripHtmlTags(decodeHtmlEntities(rawInput));

  if (looksLikeNotFoundWhois(text)) {
    return { domainName: domain, registered: false, status: ["available"], raw: rawInput };
  }

  // Use ccTLD-specific parser for richer field extraction
  const ccParser = ccTLDParserFactory(domain);
  const cc = ccParser.parse(text, domain);

  const lines = text.split(/\r?\n/);
  const getValue = (patterns: RegExp[]): string | undefined => {
    for (const p of patterns) {
      for (const line of lines) {
        const m = line.match(p);
        if (m?.[1]?.trim()) return m[1].trim();
      }
    }
    return undefined;
  };
  const getValues = (patterns: RegExp[]): string[] => {
    const results: string[] = [];
    for (const p of patterns) {
      for (const line of lines) {
        const m = line.match(p);
        if (m?.[1]?.trim()) results.push(m[1].trim());
      }
    }
    return [...new Set(results)];
  };

  // ── Generic fallback field extraction ────────────────────────────────────
  const genericRegistrar = getValue([
    /Registrar:\s*(.+)/i,
    /Registrar Name:\s*(.+)/i,
    /Sponsoring Registrar:\s*(.+)/i,
    /Registration Service Provider:\s*(.+)/i,
    /Authorized Agency:\s*(.+)/i,        // KR
    /Register:\s*(.+)/i,
    /注册商:\s*(.+)/i,
    /등록기관:\s*(.+)/i,                 // Korean
    /organisation:\s*(.+)/i,
    /provider:\s*(.+)/i,                 // BR NIC.br
    /owner:\s*(.+)/i,                    // BR (domain owner)
  ]);

  // Nameservers: handle both "Name Server: ns1.example.com" style
  // and indented block-format (e.g., NIC.br, DENIC, JPRS)
  const genericNS: string[] = [];
  const nsPatterns = [
    /Name Server:\s*(.+)/i,
    /nserver:\s*(.+)/i,
    /Nameserver:\s*(.+)/i,
    /DNS:\s*(\S+\.\S+)/i,
    /\[Name Server\]\s*(.+)/i,           // JP
    /Host Name:\s*(.+)/i,                // KR
    /Domain nameservers:\s*\n\s*(.+)/im,
  ];
  for (const line of lines) {
    for (const p of nsPatterns) {
      const m = line.match(p);
      if (m?.[1]?.trim()) {
        const raw_ns = m[1].trim().split(/\s+/)[0].toLowerCase().replace(/\.+$/, "");
        if (raw_ns.includes(".")) genericNS.push(raw_ns);
      }
    }
  }
  // Also capture indented lines that look like hostnames (after a "Name servers:" label line)
  let inNsBlock = false;
  for (const line of lines) {
    if (/name\s*servers?\s*:/i.test(line)) { inNsBlock = true; continue; }
    if (inNsBlock) {
      const trimmed = line.trim();
      if (!trimmed || /^\S.*:/.test(trimmed)) { inNsBlock = false; continue; }
      const candidate = trimmed.split(/\s+/)[0].toLowerCase().replace(/\.+$/, "");
      if (candidate.includes(".") && /^[a-z0-9]/.test(candidate)) genericNS.push(candidate);
    }
  }
  const dedupeNS = [...new Set(genericNS)];

  // ── Build the WhoisData object (ccTLD parser values take priority) ────────
  const data: WhoisData = {
    domainName: getValue([
      /Domain Name:\s*(.+)/i,
      /domain:\s*(.+)/i,
      /Domain\s*:\s*(.+)/i,
      /\[Domain Name\]\s*(.+)/i,         // JP
      /도메인이름\s*:\s*(.+)/i,           // KR
    ]) || domain,

    registrar: cc.registrar || genericRegistrar,

    registrarIanaId: getValue([/Registrar IANA ID:\s*(.+)/i, /Registrar IANA-ID:\s*(.+)/i]),

    registrarAbuseEmail: cc.registrarAbuseEmail || getValue([
      /Registrar Abuse Contact Email:\s*(.+)/i,
      /Abuse Email:\s*(.+)/i,
      /Abuse Contact Email:\s*(.+)/i,
      /e-mail:\s*(.+)/i,
    ]),

    registrarAbusePhone: getValue([
      /Registrar Abuse Contact Phone:\s*(.+)/i,
      /Abuse Phone:\s*(.+)/i,
      /Abuse Contact Phone:\s*(.+)/i,
    ]),

    creationDate: formatDate(cc.creationDate || getValue([
      /Creation Date:\s*(.+)/i,
      /Created Date:\s*(.+)/i,
      /created:\s*(.+)/i,
      /Registered:\s*(\d{4}[-/.]\d{2}[-/.]\d{1,2}.*)/i,   // avoid matching "Registered: yes"
      /Registration Time:\s*(.+)/i,                          // CN
      /Registration Date:\s*(.+)/i,
      /Domain registered:\s*(.+)/i,                          // CA
      /Domain Name Commencement Date:\s*(.+)/i,              // HK
      /Registered on:\s*(.+)/i,                              // UK
      /Record created on\s+(.+)/i,                           // TW
      /Registered Date\s*:\s*(.+)/i,                         // KR
      /등록일\s*:\s*(.+)/i,                                   // KR
      /First registration date:\s*(.+)/i,                    // CH
      /\[登録年月日\]\s*(.+)/i,                               // JP
      /\[Created on\]\s*(.+)/i,                              // JP
      /registration date:\s*(.+)/i,                          // PL
      /Fecha de Alta:\s*(.+)/i,                              // ES
    ])),

    expirationDate: formatDate(cc.expirationDate || getValue([
      /Expir(?:y|ation) Date:\s*(.+)/i,
      /expire:\s*(.+)/i,
      /Registry Expiry Date:\s*(.+)/i,
      /Expiration Time:\s*(.+)/i,                            // CN
      /paid-till:\s*(.+)/i,                                  // RU
      /valid-till:\s*(.+)/i,
      /Valid Until:\s*(.+)/i,
      /Renewal Date:\s*(.+)/i,
      /Domain expires:\s*(.+)/i,                             // CA
      /Expiry date:\s*(.+)/i,                                // UK
      /Record expires on\s+(.+)/i,                           // TW
      /Expiration Date\s*:\s*(.+)/i,                         // KR
      /만료일\s*:\s*(.+)/i,                                   // KR
      /Expire Date:\s*(.+)/i,                                // IT
      /option expiration date:\s*(.+)/i,                     // PL
      /renewal date:\s*(.+)/i,                               // PL
      /\[有効期限\]\s*(.+)/i,                                 // JP
      /\[Expires on\]\s*(.+)/i,                              // JP
      /Fecha de Expiración:\s*(.+)/i,                        // ES
    ])),

    updatedDate: formatDate(cc.updatedDate || getValue([
      /Updated Date:\s*(.+)/i,
      /changed:\s*(.+)/i,
      /Last Modified:\s*(.+)/i,
      /Update Date:\s*(.+)/i,                                // CN
      /last-update:\s*(.+)/i,                                // FR
      /Last Updated Date\s*:\s*(.+)/i,                       // KR
      /최종수정일\s*:\s*(.+)/i,                               // KR
      /last modified:\s*(.+)/i,                              // PL
      /Domain last updated:\s*(.+)/i,                        // CA
      /Last Updated:\s*(.+)/i,
      /Record last updated on\s+(.+)/i,                      // TW
      /\[最終更新\]\s*(.+)/i,                                 // JP
      /\[Last Updated\]\s*(.+)/i,                            // JP
      /modified:\s*(.+)/i,                                   // SE
      /Fecha de Modificación:\s*(.+)/i,                      // ES
    ])),

    nameServers: cc.nameServers.length > 0 ? cc.nameServers : dedupeNS,

    status: (cc.status.length > 0 ? cc.status : getValues([
      /Domain Status:\s*(.+)/i,
      /Status:\s*(.+)/i,
      /state:\s*(.+)/i,
      /Registration status:\s*(.+)/i,    // UK
      /\[状態\]\s*(.+)/i,                // JP
    ])).map(s => decodeHtmlEntities(s).replace(/\s+https?:\/\/\S+/g, "").trim())
       .flatMap(s => s.split(/[,;]\s*/))
       .filter(Boolean),

    registrantOrg: cc.registrantOrg || getValue([
      /Registrant Organization:\s*(.+)/i,
      /Registrant\s*:\s*(.+)/i,
      /Organization:\s*(.+)/i,
      /Owner:\s*(.+)/i,
      /Holder:\s*(.+)/i,
      /Titulaire:\s*(.+)/i,              // FR
      /Inhaber:\s*(.+)/i,                // DE
      /\[Registrant\]\s*(.+)/i,          // JP
      /\[登録者\]\s*(.+)/i,              // JP
      /등록인\s*:\s*(.+)/i,              // KR
    ]),

    registrantCountry: cc.registrantCountry || getValue([
      /Registrant Country:\s*(.+)/i,
      /Country:\s*(.+)/i,
      /country:\s*(.+)/i,
      /Registrant Country Code:\s*(.+)/i,
    ]),

    raw: text,
  };

  // DNSSEC
  const dnssecValue = getValue([/DNSSEC:\s*(.+)/i, /dnssec:\s*(.+)/i, /secureDNS:\s*(.+)/i]);
  if (dnssecValue) data.dnssec = /sign|true|yes|active|delegated/i.test(dnssecValue) ? "已启用" : "未启用";

  const inferred = inferRegisteredFromWhois(text);
  data.registered = inferred !== null
    ? inferred
    : !!(data.registrar || data.creationDate || (data.nameServers && data.nameServers.length > 0));

  return data;
}

// ── Main fetch function ───────────────────────────────────────────────────────

type SourcedResult = { data: WhoisData; source: DataSource };

async function raceToFirst(promises: Promise<SourcedResult | null>[]): Promise<SourcedResult | null> {
  return new Promise((resolve) => {
    let pending = promises.length;
    if (pending === 0) { resolve(null); return; }
    for (const p of promises) {
      p.then((val) => {
        if (val !== null) resolve(val);
        else { pending--; if (pending === 0) resolve(null); }
      }).catch(() => {
        pending--;
        if (pending === 0) resolve(null);
      });
    }
  });
}

/**
 * Fetch WHOIS data for a domain.
 * Returns a ResultEnvelope with data, source, reliabilityScore and provenance.
 */
export async function fetchWhois(domainInput: string): Promise<ResultEnvelope<WhoisData>> {
  const empty = (error: string | null = null): ResultEnvelope<WhoisData> => ({
    data: null, error, source: DataSource.UNKNOWN, reliabilityScore: 0, dataProvenance: "No data",
  });

  const rawDomain = domainInput.trim().toLowerCase();
  if (!rawDomain) return empty();

  const norm = toASCII(rawDomain);
  const isIdnDomain = isIDN(rawDomain);

  const cached = getCachedWhois(norm);
  if (cached) {
    const score = calculateReliabilityScore(cached);
    return { data: cached, error: null, source: DataSource.RDAP, reliabilityScore: score, dataProvenance: provenanceLabel(DataSource.RDAP, score) };
  }

  console.log(`[whois-client] querying: ${rawDomain}${isIdnDomain ? ` (punycode: ${norm})` : ""}`);

  const allPromises: Promise<SourcedResult | null>[] = [];

  // 1. Edge proxy (RDAP + tian.hu)
  allPromises.push((async (): Promise<SourcedResult | null> => {
    try {
      const resp = await fetch(`/api/whois?domain=${encodeURIComponent(norm)}`, {
        signal: AbortSignal.timeout(6000), headers: { Accept: "application/json" },
      });
      if (!resp.ok) return null;
      const edgeData = await resp.json() as AnyObj;
      if (edgeData.source === "rdap" && edgeData.data) {
        const r = parseRdap(edgeData.data as AnyObj);
        r.raw = JSON.stringify(edgeData.data, null, 2);
        return { data: r, source: DataSource.RDAP };
      }
      if (edgeData.source === "tianhu") {
        const payload = (edgeData.data as AnyObj)?.data as AnyObj;
        const formatted = payload?.formatted as AnyObj | undefined;
        const domainInfo = formatted?.domain as AnyObj | undefined;
        const rawResult = payload?.result as string | undefined;
        // tian.hu status: 1=registered, 0=unregistered, -1=unknown (WHOIS unavailable/undetermined)
        const tianStatus = payload?.status as number | undefined;
        const rawStatuses = (Array.isArray(domainInfo?.status) ? domainInfo.status as string[] : [])
          .map((s: string) => decodeHtmlEntities(s).replace(/\s+https?:\/\/\S+/g, "").trim()).filter(Boolean);
        // Prefer UTC dates (ISO format) for reliable parsing; fall back to local format
        const parsedRaw = tianStatus === -1 && rawResult ? parseWhoisText(rawResult, norm) : null;
        return {
          data: {
            domainName: (payload?.domain as string) || norm,
            registrar: (formatted?.registrar as AnyObj)?.registrar_name as string | undefined,
            registrantOrg: ((formatted?.registrant as AnyObj)?.registrant_organization || (formatted?.registrant as AnyObj)?.name) as string | undefined,
            creationDate: formatDate((domainInfo?.created_date_utc || domainInfo?.created_date) as string | undefined) || parsedRaw?.creationDate,
            expirationDate: formatDate((domainInfo?.expired_date_utc || domainInfo?.expired_date) as string | undefined) || parsedRaw?.expirationDate,
            updatedDate: formatDate((domainInfo?.updated_date_utc || domainInfo?.updated_date) as string | undefined) || parsedRaw?.updatedDate,
            nameServers: (domainInfo?.name_servers as string[])?.length ? (domainInfo.name_servers as string[]) : (parsedRaw?.nameServers || []),
            status: rawStatuses.length ? rawStatuses : (parsedRaw?.status || []),
            registered: tianStatus === 1 ? true : tianStatus === 0 ? false : parsedRaw?.registered,
            raw: rawResult,
          },
          source: DataSource.TIANHU,
        };
      }
      if (edgeData.source === "whois-tcp") {
        const rawText = edgeData.data as string;
        if (rawText && rawText.trim().length > 20) {
          const parsed = parseWhoisText(rawText, norm);
          return { data: parsed, source: DataSource.WHOIS_FALLBACK };
        }
        return null;
      }
      if (edgeData.source === "dns-fallback") {
        const d = edgeData.data as AnyObj;
        if (d.exists === true)  return { data: { domainName: rawDomain, registered: true, raw: "DNS 记录存在，WHOIS 数据暂不可用" }, source: DataSource.DNS_FALLBACK };
        if (d.exists === false) return { data: { domainName: rawDomain, registered: false, status: ["available"] }, source: DataSource.DNS_FALLBACK };
      }
    } catch {}
    return null;
  })());

  // 2. Direct RDAP lookup
  const rdapServer = getRdapServer(norm);
  if (rdapServer) {
    allPromises.push((async (): Promise<SourcedResult | null> => {
      try {
        const resp = await fetch(`${rdapServer}/domain/${encodeURIComponent(norm)}`, {
          signal: AbortSignal.timeout(5000), headers: { Accept: "application/rdap+json, application/json" },
        });
        if (resp.ok) {
          const rdapData = await resp.json() as AnyObj;
          const r = parseRdap(rdapData);
          r.raw = JSON.stringify(rdapData, null, 2);
          return { data: r, source: DataSource.RDAP_DIRECT };
        }
      } catch {}
      return null;
    })());
  }

  // 3. rdap.org universal fallback
  allPromises.push((async (): Promise<SourcedResult | null> => {
    try {
      const resp = await fetch(`https://rdap.org/domain/${encodeURIComponent(norm)}`, {
        signal: AbortSignal.timeout(7000), headers: { Accept: "application/rdap+json, application/json" },
      });
      if (resp.ok) {
        const contentType = resp.headers.get("content-type") || "";
        let rdapData: AnyObj | null = null;
        if (contentType.includes("json")) {
          rdapData = await resp.json() as AnyObj;
        } else {
          const text = await resp.text();
          rdapData = safeParseJson(text) as AnyObj | null;
        }
        if (rdapData) {
          const r = parseRdap(rdapData);
          r.raw = JSON.stringify(rdapData, null, 2);
          return { data: r, source: DataSource.RDAP_ORG };
        }
      }
    } catch {}
    return null;
  })());

  // Note: tian.hu is NOT called here — the backend proxy already uses it as
  // Phase 3 fallback (after RDAP + TCP WHOIS + rdap.org all fail). Calling it
  // directly from the browser would bypass that priority cascade and make the
  // app unnecessarily dependent on the third-party API.

  const result = await raceToFirst(allPromises);

  if (result) {
    setCachedWhois(norm, result.data);
    const score = calculateReliabilityScore(result.data);
    return { data: result.data, error: null, source: result.source, reliabilityScore: score, dataProvenance: provenanceLabel(result.source, score) };
  }

  return empty("所有数据源查询失败，请稍后重试");
}
