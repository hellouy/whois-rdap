/**
 * Whois Client — API middleware layer
 *
 * Centralises all WHOIS/RDAP fetching, parsing, retry and in-memory caching.
 * Components call `fetchWhois(domain)` and never touch fetch() directly.
 */

import { getRdapServer } from "@/utils/whois-servers";
import { toASCII, isIDN } from "@/utils/tld-servers";
import { looksLikeNotFoundWhois, inferRegisteredFromWhois } from "@/utils/whois-heuristics";

// ── Public types ──────────────────────────────────────────────────────────────

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

export function formatDate(s?: string): string | undefined {
  if (!s) return undefined;
  const dateStr = String(s).trim();
  let date: Date;

  const dotMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dotMatch) {
    const [, day, month, year] = dotMatch;
    date = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
    const m = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    date = m ? new Date(`${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`) : new Date(dateStr);
  } else if (/^\d{4}\/\d{1,2}\/\d{1,2}/.test(dateStr)) {
    date = new Date(dateStr.replace(/\//g, "-"));
  } else if (/^\d{8}$/.test(dateStr)) {
    date = new Date(`${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`);
  } else {
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) return dateStr;
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
    status = (obj.status as unknown[]).map((s) => typeof s === "string" ? s : (s as AnyObj).status || (s as AnyObj).text || (s as AnyObj).value).filter(Boolean) as string[];
  } else if (obj.status) {
    status = [String(obj.status)];
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

export function parseWhoisText(text: string, domain: string): WhoisData {
  const lines = text.split(/\r?\n/);
  if (looksLikeNotFoundWhois(text)) {
    return { domainName: domain, registered: false, status: ["available"], raw: text };
  }

  const data: WhoisData = { domainName: domain };

  const getValue = (patterns: RegExp[]): string | undefined => {
    for (const pattern of patterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match && match[1]?.trim()) return match[1].trim();
      }
    }
    return undefined;
  };

  const getValues = (patterns: RegExp[]): string[] => {
    const results: string[] = [];
    for (const pattern of patterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match && match[1]?.trim()) results.push(match[1].trim());
      }
    }
    return [...new Set(results)];
  };

  data.domainName = getValue([/Domain Name:\s*(.+)/i, /domain:\s*(.+)/i, /Domain\s*:\s*(.+)/i]) || domain;
  data.registrar = getValue([/Registrar:\s*(.+)/i, /Registrar Name:\s*(.+)/i, /Sponsoring Registrar:\s*(.+)/i, /Register:\s*(.+)/i, /注册商:\s*(.+)/i]);
  data.registrarIanaId = getValue([/Registrar IANA ID:\s*(.+)/i]);
  data.registrarAbuseEmail = getValue([/Registrar Abuse Contact Email:\s*(.+)/i, /Abuse Email:\s*(.+)/i]);
  data.registrarAbusePhone = getValue([/Registrar Abuse Contact Phone:\s*(.+)/i, /Abuse Phone:\s*(.+)/i]);
  data.creationDate = formatDate(getValue([/Creation Date:\s*(.+)/i, /Created Date:\s*(.+)/i, /created:\s*(.+)/i, /Registered:\s*(.+)/i, /登録年月日:\s*(.+)/i]));
  data.expirationDate = formatDate(getValue([/Expir(?:y|ation) Date:\s*(.+)/i, /expire:\s*(.+)/i, /Registry Expiry Date:\s*(.+)/i, /paid-till:\s*(.+)/i, /有効期限:\s*(.+)/i]));
  data.updatedDate = formatDate(getValue([/Updated Date:\s*(.+)/i, /changed:\s*(.+)/i, /Last Modified:\s*(.+)/i, /最終更新:\s*(.+)/i]));
  data.nameServers = getValues([/Name Server:\s*(.+)/i, /nserver:\s*(.+)/i, /Nameserver:\s*(.+)/i, /DNS:\s*(.+)/i])
    .map((ns) => ns.split(/\s+/)[0].toLowerCase().replace(/\.+$/, ""))
    .filter((ns) => ns.includes("."));
  data.status = getValues([/Domain Status:\s*(.+)/i, /Status:\s*(.+)/i, /state:\s*(.+)/i]);
  data.registrantOrg = getValue([/Registrant Organization:\s*(.+)/i, /Registrant:\s*(.+)/i, /Organization:\s*(.+)/i, /Owner:\s*(.+)/i, /Holder:\s*(.+)/i]);
  data.registrantCountry = getValue([/Registrant Country:\s*(.+)/i, /Country:\s*(.+)/i, /country:\s*(.+)/i]);

  const dnssecValue = getValue([/DNSSEC:\s*(.+)/i]);
  if (dnssecValue) {
    data.dnssec = /sign|true|yes|active|delegated/i.test(dnssecValue) ? "已启用" : "未启用";
  }

  data.raw = text;
  const inferred = inferRegisteredFromWhois(text);
  if (inferred !== null) {
    data.registered = inferred;
  } else {
    data.registered = !!(data.registrar || data.creationDate || (data.nameServers && data.nameServers.length > 0));
  }

  return data;
}

// ── Main fetch function ───────────────────────────────────────────────────────

async function raceToFirst<T>(promises: Promise<T | null>[]): Promise<T | null> {
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
 * Uses in-memory cache; queries Edge proxy, direct RDAP, rdap.org, and tian.hu in parallel.
 */
export async function fetchWhois(domainInput: string): Promise<{ data: WhoisData | null; error: string | null }> {
  const rawDomain = domainInput.trim().toLowerCase();
  if (!rawDomain) return { data: null, error: null };

  const norm = toASCII(rawDomain);
  const isIdnDomain = isIDN(rawDomain);

  const cached = getCachedWhois(norm);
  if (cached) return { data: cached, error: null };

  console.log(`[whois-client] querying: ${rawDomain}${isIdnDomain ? ` (punycode: ${norm})` : ""}`);

  const allPromises: Promise<WhoisData | null>[] = [];

  // 1. Edge proxy (aggregates RDAP + tian.hu)
  allPromises.push((async (): Promise<WhoisData | null> => {
    try {
      const resp = await fetch(`/api/whois?domain=${encodeURIComponent(norm)}`, {
        signal: AbortSignal.timeout(6000),
        headers: { Accept: "application/json" },
      });
      if (!resp.ok) return null;
      const edgeData = await resp.json() as AnyObj;
      if (edgeData.source === "rdap" && edgeData.data) {
        const r = parseRdap(edgeData.data as AnyObj);
        r.raw = JSON.stringify(edgeData.data, null, 2);
        return r;
      }
      if (edgeData.source === "tianhu") {
        const payload = (edgeData.data as AnyObj)?.data as AnyObj;
        const formatted = payload?.formatted as AnyObj | undefined;
        const domainInfo = formatted?.domain as AnyObj | undefined;
        return {
          domainName: (payload?.domain as string) || norm,
          registrar: (formatted?.registrar as AnyObj)?.registrar_name as string | undefined,
          registrantOrg: ((formatted?.registrant as AnyObj)?.registrant_organization || (formatted?.registrant as AnyObj)?.name) as string | undefined,
          creationDate: formatDate((domainInfo?.created_date || domainInfo?.created_date_utc) as string | undefined),
          expirationDate: formatDate((domainInfo?.expired_date || domainInfo?.expired_date_utc) as string | undefined),
          nameServers: (domainInfo?.name_servers as string[]) || [],
          status: Array.isArray(domainInfo?.status) ? domainInfo.status as string[] : [],
          registered: payload?.status === 1,
          raw: payload?.result as string | undefined,
        };
      }
      if (edgeData.source === "dns-fallback") {
        const d = edgeData.data as AnyObj;
        if (d.exists === true) return { domainName: rawDomain, registered: true, raw: "DNS 记录存在，WHOIS 数据暂不可用" };
        if (d.exists === false) return { domainName: rawDomain, registered: false, status: ["available"] };
      }
    } catch {}
    return null;
  })());

  // 2. Direct RDAP lookup
  const rdapServer = getRdapServer(norm);
  if (rdapServer) {
    allPromises.push((async (): Promise<WhoisData | null> => {
      try {
        const resp = await fetch(`${rdapServer}/domain/${encodeURIComponent(norm)}`, {
          signal: AbortSignal.timeout(5000),
          headers: { Accept: "application/rdap+json, application/json" },
        });
        if (resp.ok) {
          const rdapData = await resp.json() as AnyObj;
          const r = parseRdap(rdapData);
          r.raw = JSON.stringify(rdapData, null, 2);
          return r;
        }
      } catch {}
      return null;
    })());
  }

  // 3. rdap.org universal fallback
  allPromises.push((async (): Promise<WhoisData | null> => {
    try {
      const resp = await fetch(`https://rdap.org/domain/${encodeURIComponent(norm)}`, {
        signal: AbortSignal.timeout(7000),
        headers: { Accept: "application/rdap+json, application/json" },
      });
      if (resp.ok) {
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("json")) {
          const rdapData = await resp.json() as AnyObj;
          const parsed = parseRdap(rdapData);
          parsed.raw = JSON.stringify(rdapData, null, 2);
          return parsed;
        }
        const text = await resp.text();
        const jsonParsed = safeParseJson(text) as AnyObj | null;
        if (jsonParsed) {
          const result = parseRdap(jsonParsed);
          result.raw = JSON.stringify(jsonParsed, null, 2);
          return result;
        }
      }
    } catch {}
    return null;
  })());

  // 4. tian.hu WHOIS API
  allPromises.push((async (): Promise<WhoisData | null> => {
    try {
      const resp = await fetch(`https://api.tian.hu/whois/${encodeURIComponent(norm)}`, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: "application/json" },
      });
      if (resp.ok) {
        const body = await resp.json() as AnyObj;
        if (body.code === 200 && body.data) {
          const payload = body.data as AnyObj;
          const formatted = payload.formatted as AnyObj | undefined;
          const domainInfo = (formatted?.domain) as AnyObj | undefined;
          return {
            domainName: (payload.domain as string) || norm,
            registrar: (formatted?.registrar as AnyObj)?.registrar_name as string | undefined,
            registrantOrg: ((formatted?.registrant as AnyObj)?.registrant_organization || (formatted?.registrant as AnyObj)?.name) as string | undefined,
            creationDate: formatDate((domainInfo?.created_date || domainInfo?.created_date_utc) as string | undefined),
            expirationDate: formatDate((domainInfo?.expired_date || domainInfo?.expired_date_utc) as string | undefined),
            nameServers: (domainInfo?.name_servers as string[]) || [],
            status: Array.isArray(domainInfo?.status) ? domainInfo.status as string[] : [],
            registered: payload.status === 1,
            raw: payload.result as string | undefined,
          };
        }
      }
    } catch {}
    return null;
  })());

  const result = await raceToFirst(allPromises);

  if (result) {
    setCachedWhois(norm, result);
    return { data: result, error: null };
  }

  return { data: null, error: "所有数据源查询失败，请稍后重试" };
}
