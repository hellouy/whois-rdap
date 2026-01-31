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
  const name = v("org") || v("fn") || entity.handle || entity.name;
  const publicIds = Array.isArray(entity.publicIds) ? entity.publicIds : [];
  const ianaId = publicIds.find((p: any) => /iana/i.test(p?.type || ""))?.identifier;
  return { name, ianaId };
}

function parseEntities(entities: AnyObj[] = []) {
  const findByRole = (role: string) => entities.find((e: AnyObj) => Array.isArray(e?.roles) && e.roles.includes(role));
  const registrarEntity = findByRole("registrar");
  const abuseEntity = findByRole("abuse") || registrarEntity;
  const registrantEntity = findByRole("registrant") || findByRole("holder") || findByRole("owner");

  const reg = parseRegistrar(registrarEntity);
  const v = (ent: AnyObj | undefined, k: string) => {
    if (!ent?.vcardArray?.[1]) return undefined;
    const entry = ent.vcardArray[1].find((x: any) => x?.[0] === k);
    return entry?.[3];
  };

  // 提取滥用联系信息
  const registrarAbuseEmail = v(abuseEntity, "email");
  const registrarAbusePhone = v(abuseEntity, "tel");
  
  // 提取注册主体信息 - 增强对国别域名的支持
  let registrantOrg = v(registrantEntity, "org") || v(registrantEntity, "fn");
  
  // 尝试从其他可能的字段提取组织名称
  if (!registrantOrg && registrantEntity) {
    registrantOrg = registrantEntity.org || registrantEntity.organization || registrantEntity.name;
  }
  
  // 提取国家信息 - 增强多种格式支持
  let registrantCountry: string | undefined = v(registrantEntity, "country-name") || v(registrantEntity, "country-code");
  
  // 从adr结构化地址中提取国家
  const adr = registrantEntity?.vcardArray?.[1]?.find((x: any) => x?.[0] === "adr")?.[3];
  if (!registrantCountry && Array.isArray(adr) && adr.length >= 7) {
    registrantCountry = adr[6]; // 国家通常在第7个位置
  }
  
  // 从实体对象直接字段提取国家
  if (!registrantCountry && registrantEntity) {
    registrantCountry = registrantEntity.country || registrantEntity.countryCode || registrantEntity.cc;
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
    const e = events.find((ev) => 
      keys.some((k) => {
        const action = String(ev.eventAction || ev.action || "").toLowerCase();
        return action.includes(k);
      })
    );
    return e?.eventDate || e?.date;
  };
  const c = find(["registration", "create", "registered"]);
  const e = find(["expiration", "expire", "expiry"]);
  const u = find(["last changed", "update", "last update", "modified"]);
  return { c, e, u };
}

function formatDate(s?: string) {
  return s ? new Date(s).toLocaleDateString("zh-CN") : undefined;
}

function parseRdap(obj: AnyObj): WhoisData {
  const domainName = obj.ldhName || obj.unicodeName || obj.domain || obj.domainName;
  
  // 增强NS解析，支持多种格式
  let ns: string[] = [];
  if (Array.isArray(obj.nameservers)) {
    ns = obj.nameservers
      .map((n: AnyObj) => n.ldhName || n.unicodeName || n.name || n.hostName)
      .filter(Boolean);
  } else if (Array.isArray(obj.nameServers)) {
    ns = obj.nameServers
      .map((n: AnyObj | string) => typeof n === 'string' ? n : (n.ldhName || n.unicodeName || n.name))
      .filter(Boolean);
  }
  
  // 状态解析，支持多种格式
  let status: string[] = [];
  if (Array.isArray(obj.status)) {
    status = obj.status.map((s: any) => typeof s === 'string' ? s : (s.status || s.text || s.value)).filter(Boolean);
  } else if (obj.status) {
    status = [String(obj.status)];
  }
  
  // DNSSEC状态
  const dnssec = obj.secureDNS?.delegationSigned ? "已启用" : 
                 obj.secureDNS ? "未启用" : 
                 obj.dnssec ? (obj.dnssec === true || obj.dnssec === "signed" ? "已启用" : "未启用") :
                 undefined;

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
        // 获取TLD以确定使用哪个RDAP服务器
        const parts = norm.split('.');
        const tld = parts[parts.length - 1];
        
        // 常用TLD的RDAP服务器映射
        const rdapServers: Record<string, string> = {
          'com': 'https://rdap.verisign.com/com/v1',
          'net': 'https://rdap.verisign.com/net/v1',
          'org': 'https://rdap.publicinterestregistry.org/rdap',
          'io': 'https://rdap.nic.io',
          'co': 'https://rdap.nic.co',
          'me': 'https://rdap.nic.me',
          'info': 'https://rdap.afilias.net/rdap/info',
          'biz': 'https://rdap.nic.biz',
          'dev': 'https://rdap.nic.google',
          'app': 'https://rdap.nic.google',
          'ai': 'https://rdap.nic.ai',
          'cc': 'https://rdap.verisign.com/cc/v1',
          'tv': 'https://rdap.verisign.com/tv/v1',
          'name': 'https://rdap.verisign.com/name/v1',
          'xyz': 'https://rdap.nic.xyz',
          'online': 'https://rdap.centralnic.com/online',
          'site': 'https://rdap.centralnic.com/site',
          'store': 'https://rdap.centralnic.com/store',
          'tech': 'https://rdap.centralnic.com/tech',
          'cn': 'https://rdap.cnnic.cn',
          'uk': 'https://rdap.nominet.uk/uk',
          'de': 'https://rdap.denic.de',
          'fr': 'https://rdap.nic.fr',
          'eu': 'https://rdap.eurid.eu',
          'nl': 'https://rdap.sidn.nl',
          'be': 'https://rdap.dns.be',
          'ch': 'https://rdap.nic.ch',
          'at': 'https://rdap.nic.at',
          'se': 'https://rdap.iis.se',
          'no': 'https://rdap.norid.no',
          'dk': 'https://rdap.dk-hostmaster.dk',
          'fi': 'https://rdap.traficom.fi',
          'pl': 'https://rdap.dns.pl',
          'cz': 'https://rdap.nic.cz',
          'ru': 'https://rdap.tcinet.ru',
          'jp': 'https://rdap.jprs.jp',
          'kr': 'https://rdap.kisa.or.kr',
          'au': 'https://rdap.auda.org.au',
          'nz': 'https://rdap.nzrs.nz',
          'ca': 'https://rdap.ca.fury.ca',
          'br': 'https://rdap.registro.br',
          'mx': 'https://rdap.mx',
          'in': 'https://rdap.registry.in',
          'sg': 'https://rdap.sgnic.sg',
          'hk': 'https://rdap.hkirc.hk',
          'tw': 'https://rdap.twnic.net.tw',
          'th': 'https://rdap.thnic.co.th',
          'vn': 'https://rdap.vnnic.vn',
          'id': 'https://rdap.pandi.id',
          'my': 'https://rdap.mynic.my',
          'ph': 'https://rdap.dot.ph',
        };
        
        let result: any = null;
        let lastError: string = "";
        
        // 构建API源列表
        const apiSources: Array<{
          name: string;
          url: string;
          parseResponse: (res: Response) => Promise<any>;
        }> = [];
        
        // 1. 首先尝试TLD特定的RDAP服务器
        if (rdapServers[tld]) {
          apiSources.push({
            name: `RDAP (${tld})`,
            url: `${rdapServers[tld]}/domain/${encodeURIComponent(norm)}`,
            parseResponse: async (res: Response) => {
              const data = await res.json();
              return { data: { rdapData: data }, source: `rdap-${tld}` };
            }
          });
        }
        
        // 2. 尝试通用RDAP引导（通过代理避免CORS）
        apiSources.push({
          name: "RDAP Bootstrap",
          url: `https://rdap-bootstrap.arin.net/bootstrap/domain/${encodeURIComponent(norm)}`,
          parseResponse: async (res: Response) => {
            const data = await res.json();
            return { data: { rdapData: data }, source: "rdap-bootstrap" };
          }
        });
        
        for (const source of apiSources) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            
            const response = await fetch(source.url, { 
              signal: controller.signal,
              headers: { 'Accept': 'application/rdap+json, application/json' }
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              lastError = `${source.name}: HTTP ${response.status}`;
              continue;
            }
            
            // 检查响应类型是否为JSON
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json') && !contentType.includes('application/rdap+json')) {
              lastError = `${source.name}: 非JSON响应`;
              continue;
            }
            
            result = await source.parseResponse(response);
            console.log(`Whois查询成功: ${source.name}`);
            break; // 成功获取数据，跳出循环
          } catch (err) {
            const msg = err instanceof Error ? err.message : "未知错误";
            lastError = `${source.name}: ${msg}`;
            console.warn(`API源 ${source.name} 查询失败:`, msg);
            continue;
          }
        }
        
        if (!result) {
          throw new Error(lastError || "暂不支持该域名后缀的Whois查询");
        }
        
        if (!mounted.current) return;
        
        // 新API返回 { code, msg, data: { whoisData, rdapData, ... } }
        const payload: AnyObj = result?.data ?? result ?? {};
        
        // 尝试从 RDAP 解析结构化信息 - 增强解析
        const rdapObj = typeof payload.rdapData === "string" ? safeParseJson(payload.rdapData) : payload.rdapData;
        const fromRdap = rdapObj ? parseRdap(rdapObj) : ({} as WhoisData);
        
        // 从 whois 文本里兜底提取信息 - 增强对国别域名的支持
        let ns: string[] = fromRdap.nameServers || payload.nameServers || payload.name_servers || payload.nameservers || [];
        let registrar = fromRdap.registrar || payload.registrar || payload.registrar_name;
        let registrantOrg = fromRdap.registrantOrg;
        let registrantCountry = fromRdap.registrantCountry;
        
        // 如果RDAP没有提取到NS，从whois文本中提取
        if ((!ns || ns.length === 0) && typeof payload.whoisData === "string") {
          const whoisText = payload.whoisData;
          
          // 提取NS - 支持多种格式
          const nsPatterns = [
            /Name Server:\s*([^\r\n]+)/gi,
            /nserver:\s*([^\r\n]+)/gi,
            /Nameserver:\s*([^\r\n]+)/gi,
            /NS:\s*([^\r\n]+)/gi,
            /Name Servers:\s*([^\r\n]+)/gi,
          ];
          
          for (const pattern of nsPatterns) {
            const matches = whoisText.match(pattern) || [];
            if (matches.length > 0) {
              ns = matches.map((m: string) => m.split(/[:：]/)[1]?.trim()).filter(Boolean);
              break;
            }
          }
          
          // 提取注册商 - 支持多种格式
          if (!registrar) {
            const registrarPatterns = [
              /Registrar:\s*([^\r\n]+)/i,
              /Registrar Name:\s*([^\r\n]+)/i,
              /注册商:\s*([^\r\n]+)/i,
            ];
            for (const pattern of registrarPatterns) {
              const match = whoisText.match(pattern);
              if (match && match[1]) {
                registrar = match[1].trim();
                break;
              }
            }
          }
          
          // 提取注册主体 - 支持多种格式
          if (!registrantOrg) {
            const orgPatterns = [
              /Registrant Organization:\s*([^\r\n]+)/i,
              /Registrant:\s*([^\r\n]+)/i,
              /Organization:\s*([^\r\n]+)/i,
              /注册人:\s*([^\r\n]+)/i,
              /注册组织:\s*([^\r\n]+)/i,
            ];
            for (const pattern of orgPatterns) {
              const match = whoisText.match(pattern);
              if (match && match[1] && match[1].trim() !== 'REDACTED FOR PRIVACY') {
                registrantOrg = match[1].trim();
                break;
              }
            }
          }
          
          // 提取国家 - 支持多种格式
          if (!registrantCountry) {
            const countryPatterns = [
              /Registrant Country:\s*([^\r\n]+)/i,
              /Country:\s*([^\r\n]+)/i,
              /国家:\s*([^\r\n]+)/i,
              /国家\/地区:\s*([^\r\n]+)/i,
            ];
            for (const pattern of countryPatterns) {
              const match = whoisText.match(pattern);
              if (match && match[1]) {
                registrantCountry = match[1].trim();
                break;
              }
            }
          }
        }
        
        // 兼容 status 为对象数组或字符串数组
        let status: string[] = Array.isArray(fromRdap.status) && fromRdap.status.length > 0
          ? fromRdap.status
          : Array.isArray(payload.status)
            ? (typeof payload.status[0] === "string" ? payload.status : (payload.status as AnyObj[]).map((s: AnyObj) => s.text || s.status || s.value).filter(Boolean))
            : payload.status ? [payload.status] : [];
        
        // 从IANA获取TLD权威服务器
        const tldServers = getTLDServers(norm);
        
        const whoisData: WhoisData = {
          domainName: fromRdap.domainName || payload.domain || payload.domain_name || payload.domainName || norm,
          registrar: registrar,
          registrarIanaId: fromRdap.registrarIanaId || payload.registrarIanaId || payload.registrar_iana_id || payload.registrar_id,
          registrarAbuseEmail: fromRdap.registrarAbuseEmail || payload.registrar_abuse_contact_email || payload.abuse_email,
          registrarAbusePhone: fromRdap.registrarAbusePhone || payload.registrar_abuse_contact_phone || payload.abuse_phone,
          registrantOrg: registrantOrg,
          registrantCountry: registrantCountry,
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
