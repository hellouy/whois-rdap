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
        // 使用增强的 RDAP 查询，支持多个 RDAP 服务器
        const tld = norm.split('.').pop() || '';
        const rdapServers = [
          `https://rdap.org/domain/${encodeURIComponent(norm)}`,
          `https://rdap.iana.org/domain/${encodeURIComponent(norm)}`,
          `https://rdap-bootstrap.arin.net/bootstrap/domain/${encodeURIComponent(norm)}`,
        ];

        let rdapData: AnyObj | null = null;
        let lastError: Error | null = null;

        // 尝试多个 RDAP 服务器
        for (const serverUrl of rdapServers) {
          try {
            const text = await fetchText(serverUrl, 10000);
            const parsed = safeParseJson(text);
            if (parsed && typeof parsed === 'object') {
              rdapData = parsed;
              break;
            }
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            continue;
          }
        }

        if (!mounted.current) return;

        if (!rdapData) {
          throw lastError || new Error('无法从 RDAP 服务器获取数据');
        }

        // 解析 RDAP 数据
        const fromRdap = parseRdap(rdapData);
        
        // 从 IANA 获取 TLD 权威服务器
        const tldServers = getTLDServers(norm);
        
        const whoisData: WhoisData = {
          ...fromRdap,
          tldServers: tldServers || undefined,
          raw: JSON.stringify(rdapData, null, 2),
        };
        
        setData(whoisData);
        setIsLoading(false);
      } catch (err) {
        if (!mounted.current) return;
        const msg = err instanceof Error ? err.message : "查询失败";
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
