import { useEffect, useRef, useState } from "react";
import { getTLDServers } from "@/utils/tld-servers";

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
}

type AnyObj = Record<string, any>;

const safeParseJson = (text: string): any | null => {
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
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  try {
    return JSON.parse(text);
  } catch {}
  return null;
};

const fetchText = async (url: string, timeoutMs = 6000): Promise<string> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(id);
  }
};

function parseRegistrar(entity?: AnyObj) {
  if (!entity) return { name: undefined, ianaId: undefined, abuseEmail: undefined, abusePhone: undefined };
  const v = (k: string) => entity?.vcardArray?.[1]?.find((x: any) => x?.[0] === k)?.[3];
  const name = v("org") || v("fn") || entity.handle;
  const publicIds = Array.isArray(entity.publicIds) ? entity.publicIds : [];
  const ianaId = publicIds.find((p: any) => /iana/i.test(p?.type || ""))?.identifier;
  // Abuse contacts may be in a separate entity role; handled by parseEntities
  return { name, ianaId };
}

function parseEntities(entities: AnyObj[] = []) {
  const findByRole = (role: string) => entities.find((e: AnyObj) => Array.isArray(e?.roles) && e.roles.includes(role));
  const registrarEntity = findByRole("registrar");
  const abuseEntity = findByRole("abuse") || registrarEntity;
  const registrantEntity = findByRole("registrant") || findByRole("holder");

  const reg = parseRegistrar(registrarEntity);
  const v = (ent: AnyObj | undefined, k: string) => ent?.vcardArray?.[1]?.find((x: any) => x?.[0] === k)?.[3];

  const registrarAbuseEmail = v(abuseEntity, "email");
  const registrarAbusePhone = v(abuseEntity, "tel");
  const registrantOrg = v(registrantEntity, "org") || v(registrantEntity, "fn");
  // country can be in adr (structured) or country-name
  let registrantCountry: string | undefined = v(registrantEntity, "country-name");
  const adr = registrantEntity?.vcardArray?.[1]?.find((x: any) => x?.[0] === "adr")?.[3];
  if (!registrantCountry && Array.isArray(adr) && adr.length >= 7) {
    registrantCountry = adr[6];
  }

  return {
    registrar: reg.name,
    registrarIanaId: reg.ianaId,
    registrarAbuseEmail,
    registrarAbusePhone,
    registrantOrg,
    registrantCountry,
  };
}

function parseEvents(events: AnyObj[] = []) {
  const find = (keys: string[]) => {
    const e = events.find((ev) => keys.some((k) => String(ev.eventAction || "").toLowerCase().includes(k)));
    return e?.eventDate;
  };
  const c = find(["registration", "create"]);
  const e = find(["expiration", "expire"]);
  const u = find(["last changed", "update", "last update"]);
  return { c, e, u };
}

function formatDate(s?: string) {
  return s ? new Date(s).toLocaleDateString("zh-CN") : undefined;
}

function parseRdap(obj: AnyObj): WhoisData {
  const domainName = obj.ldhName || obj.unicodeName;
  const ns = (obj.nameservers || [])
    .map((n: AnyObj) => n.ldhName || n.unicodeName)
    .filter(Boolean);
  const status: string[] = Array.isArray(obj.status) ? obj.status : [];
  const dnssec = obj.secureDNS?.delegationSigned ? "已启用" : obj.secureDNS ? "未启用" : undefined;

  const ent = parseEntities(obj.entities || []);
  const ev = parseEvents(obj.events || []);

  return {
    domainName,
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
  };
}

export function useWhois(domain: string) {
  const [data, setData] = useState<WhoisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      const norm = domain.trim().toLowerCase();
      if (!norm) {
        setData(null);
        setIsLoading(false);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        // 使用新的API，增加超时时间以支持特殊TLD（如.ge等）
        const url = `https://whois.233333.best/api/?domain=${encodeURIComponent(norm)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 增加到20秒
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!mounted.current) return;
        
        // 新API返回 { code, msg, data: { whoisData, rdapData, ... } }
        const payload: AnyObj = result?.data ?? result ?? {};
        
        // 尝试从 RDAP 解析结构化信息
        const rdapObj = typeof payload.rdapData === "string" ? safeParseJson(payload.rdapData) : payload.rdapData;
        const fromRdap = rdapObj ? parseRdap(rdapObj) : ({} as WhoisData);
        
        // 从 whois 文本里兜底提取 NS
        let ns: string[] = fromRdap.nameServers || payload.nameServers || payload.name_servers || payload.nameservers || [];
        if ((!ns || ns.length === 0) && typeof payload.whoisData === "string") {
          const matches = payload.whoisData.match(/Name Server:\s*([^\r\n]+)/gi) || [];
          ns = matches.map((m: string) => m.split(":")[1].trim()).filter(Boolean);
        }
        
        // 兼容 status 为对象数组或字符串数组
        let status: string[] = Array.isArray(fromRdap.status) && fromRdap.status.length > 0
          ? fromRdap.status
          : Array.isArray(payload.status)
            ? (typeof payload.status[0] === "string" ? payload.status : (payload.status as AnyObj[]).map((s: AnyObj) => s.text).filter(Boolean))
            : payload.status ? [payload.status] : [];
        
        // 从IANA获取TLD权威服务器
        const tldServers = getTLDServers(norm);
        
        const whoisData: WhoisData = {
          domainName: fromRdap.domainName || payload.domain || payload.domain_name || payload.domainName || norm,
          registrar: fromRdap.registrar || payload.registrar || payload.registrar_name,
          registrarIanaId: fromRdap.registrarIanaId || payload.registrarIanaId || payload.registrar_iana_id || payload.registrar_id,
          registrarAbuseEmail: fromRdap.registrarAbuseEmail || payload.registrar_abuse_contact_email || payload.abuse_email,
          registrarAbusePhone: fromRdap.registrarAbusePhone || payload.registrar_abuse_contact_phone || payload.abuse_phone,
          registrantOrg: fromRdap.registrantOrg,
          registrantCountry: fromRdap.registrantCountry,
          creationDate: fromRdap.creationDate || formatDate(payload.creationDateISO8601 || payload.creationDate || payload.created_date || payload.creation_date),
          expirationDate: fromRdap.expirationDate || formatDate(payload.expirationDateISO8601 || payload.expirationDate || payload.expiry_date || payload.expiration_date),
          updatedDate: fromRdap.updatedDate || formatDate(payload.updatedDateISO8601 || payload.updatedDate || payload.last_updated || payload.updated_date),
          nameServers: ns,
          tldServers: tldServers || undefined,
          status,
          dnssec: fromRdap.dnssec || payload.dnssec,
          registered: payload.registered,
          raw: payload.whoisData || payload.raw || JSON.stringify(payload, null, 2),
        };
        
        setData(whoisData);
        setIsLoading(false);
      } catch (err) {
        if (!mounted.current) return;
        const msg = err instanceof Error ? err.message : "查询失败";
        // 针对特殊TLD提供更友好的错误提示
        const errorMessage = msg.includes("abort") || msg.includes("timeout")
          ? "查询超时，该域名后缀可能响应较慢或暂不支持"
          : msg;
        setError(errorMessage);
        setIsLoading(false);
        console.error("Whois查询错误:", msg);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  return { whois: data, isLoading, error };
}
