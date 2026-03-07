import { useEffect, useRef, useState } from "react";
import { getTLDServers, toASCII, isIDN } from "@/utils/tld-servers";
import { getRdapServer, getWhoisServer, WHOIS_SERVERS, getSupportedTldCount } from "@/utils/whois-servers";
import { looksLikeNotFoundWhois, inferRegisteredFromWhois } from "@/utils/whois-heuristics";

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

  const registrarAbuseEmail = v(abuseEntity, "email");
  const registrarAbusePhone = v(abuseEntity, "tel");
  
  let registrantOrg = v(registrantEntity, "org") || v(registrantEntity, "fn");
  
  if (!registrantOrg && registrantEntity) {
    registrantOrg = registrantEntity.org || registrantEntity.organization || registrantEntity.name;
  }
  
  let registrantCountry: string | undefined = v(registrantEntity, "country-name") || v(registrantEntity, "country-code");
  
  const adr = registrantEntity?.vcardArray?.[1]?.find((x: any) => x?.[0] === "adr")?.[3];
  if (!registrantCountry && Array.isArray(adr) && adr.length >= 7) {
    registrantCountry = adr[6];
  }
  
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
  if (!s) return undefined;
  const dateStr = String(s).trim();
  
  // 尝试解析 DD.MM.YYYY 格式
  const dotMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  let date: Date;
  if (dotMatch) {
    const [, day, month, year] = dotMatch;
    date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }
  // DD/MM/YYYY 格式
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
    const m = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) date = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    else date = new Date(dateStr);
  }
  // YYYY/MM/DD 格式
  else if (/^\d{4}\/\d{1,2}\/\d{1,2}/.test(dateStr)) {
    date = new Date(dateStr.replace(/\//g, '-'));
  }
  // DD-Mon-YYYY 格式 (如 05-Feb-2025)
  else if (/^\d{1,2}-[A-Za-z]{3}-\d{4}/.test(dateStr)) {
    date = new Date(dateStr);
  }
  // YYYYMMDD 纯数字格式
  else if (/^\d{8}$/.test(dateStr)) {
    date = new Date(`${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`);
  }
  // 日语格式: 2025/02/05
  else {
    date = new Date(dateStr);
  }
  
  if (isNaN(date.getTime())) return dateStr;
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`;
}

function parseRdap(obj: AnyObj): WhoisData {
  const domainName = obj.ldhName || obj.unicodeName || obj.domain || obj.domainName;
  
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
  
  let status: string[] = [];
  if (Array.isArray(obj.status)) {
    status = obj.status.map((s: any) => typeof s === 'string' ? s : (s.status || s.text || s.value)).filter(Boolean);
  } else if (obj.status) {
    status = [String(obj.status)];
  }
  
  const dnssec = obj.secureDNS?.delegationSigned ? "已启用" : 
                 obj.secureDNS ? "未启用" : 
                 obj.dnssec ? (obj.dnssec === true || obj.dnssec === "signed" ? "已启用" : "未启用") :
                 undefined;

  const ent = parseEntities(obj.entities || []);
  const ev = parseEvents(obj.events || []);

  return {
    domainName,
    // RDAP 200 响应本身就表示该对象存在（即已注册），即便部分 ccTLD 不返回创建时间/注册商等字段。
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
  };
}

// 解析原始Whois文本
function parseWhoisText(text: string, domain: string): WhoisData {
  const lines = text.split(/\r?\n/);
  // 先判断是否明确"未注册/无数据"
  if (looksLikeNotFoundWhois(text)) {
    return {
      domainName: domain,
      registered: false,
      status: ["available"],
      raw: text,
    };
  }

  const data: WhoisData = { domainName: domain };
  
  const getValue = (patterns: RegExp[]): string | undefined => {
    for (const pattern of patterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match && match[1]?.trim()) {
          return match[1].trim();
        }
      }
    }
    return undefined;
  };
  
  const getValues = (patterns: RegExp[]): string[] => {
    const results: string[] = [];
    for (const pattern of patterns) {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match && match[1]?.trim()) {
          results.push(match[1].trim());
        }
      }
    }
    return [...new Set(results)];
  };
  
  // 域名
  data.domainName = getValue([
    /Domain Name:\s*(.+)/i,
    /domain:\s*(.+)/i,
    /Domain\s*:\s*(.+)/i,
    /nom de domaine:\s*(.+)/i,
    /nombre de dominio:\s*(.+)/i,
    /domainname:\s*(.+)/i,
    /ドメイン名:\s*(.+)/i,
  ]) || domain;
  
  // 注册商 - 增强多语言/多格式匹配
  data.registrar = getValue([
    /Registrar:\s*(.+)/i,
    /Registrar Name:\s*(.+)/i,
    /registrar:\s*(.+)/i,
    /Sponsoring Registrar:\s*(.+)/i,
    /Sponsoring Registrar Organization:\s*(.+)/i,
    /registrar_name:\s*(.+)/i,
    /Registrar Organisation:\s*(.+)/i,
    /registrant_registrar:\s*(.+)/i,
    /Register:\s*(.+)/i,
    /Registrar\s*:\s*(.+)/i,
    /注册商:\s*(.+)/i,
    /Registrar ID:\s*(.+)/i,
  ]);
  
  // 注册商IANA ID
  data.registrarIanaId = getValue([
    /Registrar IANA ID:\s*(.+)/i,
    /Registrar IANA:\s*(.+)/i,
  ]);
  
  // 滥用联系
  data.registrarAbuseEmail = getValue([
    /Registrar Abuse Contact Email:\s*(.+)/i,
    /abuse.*email:\s*(.+)/i,
    /Abuse Email:\s*(.+)/i,
  ]);
  
  data.registrarAbusePhone = getValue([
    /Registrar Abuse Contact Phone:\s*(.+)/i,
    /abuse.*phone:\s*(.+)/i,
    /Abuse Phone:\s*(.+)/i,
  ]);
  
  // 日期 - 增强 ccTLD 各类格式支持
  data.creationDate = formatDate(getValue([
    /Creation Date:\s*(.+)/i,
    /Created Date:\s*(.+)/i,
    /created:\s*(.+)/i,
    /registered:\s*(.+)/i,
    /Registration Date:\s*(.+)/i,
    /Created On:\s*(.+)/i,
    /Created:\s*(.+)/i,
    /Creation date:\s*(.+)/i,
    /Domain Registration Date:\s*(.+)/i,
    /registered on:\s*(.+)/i,
    /Registered:\s*(.+)/i,
    /Date de création:\s*(.+)/i,
    /Fecha de creación:\s*(.+)/i,
    /登録年月日:\s*(.+)/i,
    /Registered Date:\s*(.+)/i,
    /first-registration-date:\s*(.+)/i,
    /create:\s*(.+)/i,
    /Activation:\s*(.+)/i,
    /Domain Create Date:\s*(.+)/i,
  ]));
  
  data.expirationDate = formatDate(getValue([
    /Expir(?:y|ation) Date:\s*(.+)/i,
    /expire:\s*(.+)/i,
    /Expiration:\s*(.+)/i,
    /Registry Expiry Date:\s*(.+)/i,
    /paid-till:\s*(.+)/i,
    /Expires:\s*(.+)/i,
    /Expires On:\s*(.+)/i,
    /Expiration Date:\s*(.+)/i,
    /Expiry:\s*(.+)/i,
    /Renewal Date:\s*(.+)/i,
    /Date d'expiration:\s*(.+)/i,
    /Fecha de expiración:\s*(.+)/i,
    /有効期限:\s*(.+)/i,
    /free-date:\s*(.+)/i,
    /Domain Expiration Date:\s*(.+)/i,
    /Expire Date:\s*(.+)/i,
    /validity:\s*(.+)/i,
  ]));
  
  data.updatedDate = formatDate(getValue([
    /Updated Date:\s*(.+)/i,
    /changed:\s*(.+)/i,
    /Last Updated:\s*(.+)/i,
    /Last Modified:\s*(.+)/i,
    /Modified:\s*(.+)/i,
    /Last Update:\s*(.+)/i,
    /last-update:\s*(.+)/i,
    /modification date:\s*(.+)/i,
    /Date de modification:\s*(.+)/i,
    /Ultima Atualização:\s*(.+)/i,
    /最終更新:\s*(.+)/i,
    /Domain Last Updated Date:\s*(.+)/i,
  ]));
  
  // NS - 增强多格式支持（含非洲/法语 ccTLD）
  data.nameServers = getValues([
    /Name Server:\s*(.+)/i,
    /nserver:\s*(.+)/i,
    /Nameserver:\s*(.+)/i,
    /NS:\s*([^\s]+)/i,
    /Name servers?:\s*(.+)/i,
    /Hostname:\s*(.+)/i,
    /DNS:\s*(.+)/i,
    /Nameservers:\s*(.+)/i,
    /host:\s*([^\s]+\.[\w.]+)/i,
    /Serveur DNS:\s*(.+)/i,
    /Servidor DNS:\s*(.+)/i,
    /ネームサーバ:\s*(.+)/i,
  ]).map(ns => {
    // 清理NS值：移除尾部IP地址和多余空白
    return ns.split(/\s+/)[0].toLowerCase().replace(/\.+$/, '');
  }).filter(ns => ns.includes('.'));
  
  // 状态 - 增强多格式（含非洲/法语 ccTLD）
  data.status = getValues([
    /Domain Status:\s*(.+)/i,
    /Status:\s*(.+)/i,
    /state:\s*(.+)/i,
    /Domain status:\s*(.+)/i,
    /状態:\s*(.+)/i,
    /Statut:\s*(.+)/i,
    /query_status:\s*(.+)/i,
    /registration status:\s*(.+)/i,
    /Situação:\s*(.+)/i,
  ]);
  
  // 注册人 - 增强 ccTLD 格式（含非洲/冷门后缀）
  data.registrantOrg = getValue([
    /Registrant Organization:\s*(.+)/i,
    /Registrant:\s*(.+)/i,
    /org:\s*(.+)/i,
    /Organization:\s*(.+)/i,
    /registrant:\s*(.+)/i,
    /Registrant Name:\s*(.+)/i,
    /Registrant Organisation:\s*(.+)/i,
    /Owner:\s*(.+)/i,
    /Holder:\s*(.+)/i,
    /owner-organization:\s*(.+)/i,
    /owner-name:\s*(.+)/i,
    /Titular:\s*(.+)/i,
    /holder-c:\s*(.+)/i,
    /Admin Name:\s*(.+)/i,
    /contact-name:\s*(.+)/i,
    /person:\s*(.+)/i,
    /org-name:\s*(.+)/i,
    /Titulaire:\s*(.+)/i,
    /Propriétaire:\s*(.+)/i,
    /descr:\s*(.+)/i,
  ]);
  
  data.registrantCountry = getValue([
    /Registrant Country:\s*(.+)/i,
    /Country:\s*(.+)/i,
    /Registrant Country Code:\s*(.+)/i,
    /owner-country:\s*(.+)/i,
    /country:\s*(.+)/i,
    /Country Code:\s*(.+)/i,
    /Registrant State\/Province:\s*(.+)/i,
    /address:\s*([A-Z]{2})\s*$/i,
    /Pays:\s*(.+)/i,
    /País:\s*(.+)/i,
  ]);
  
  // DNSSEC
  const dnssecValue = getValue([
    /DNSSEC:\s*(.+)/i,
    /dnssec:\s*(.+)/i,
    /DNSSEC delegated:\s*(.+)/i,
  ]);
  if (dnssecValue) {
    data.dnssec = /sign|true|yes|active|delegated/i.test(dnssecValue) ? "已启用" : "未启用";
  }
  
  data.raw = text;
  
  // 使用启发式判断注册状态
  const inferred = inferRegisteredFromWhois(text);
  if (inferred !== null) {
    data.registered = inferred;
  } else {
    // 如果有任何有效数据，默认视为已注册
    data.registered = !!(data.registrar || data.creationDate || (data.nameServers && data.nameServers.length > 0));
  }
  
  return data;
}

// WHOIS 查询结果缓存（内存级别，避免重复查询）
const whoisCache = new Map<string, { data: WhoisData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

function getCachedWhois(domain: string): WhoisData | null {
  const cached = whoisCache.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[WHOIS] 命中缓存: ${domain}`);
    return cached.data;
  }
  if (cached) whoisCache.delete(domain);
  return null;
}

function setCachedWhois(domain: string, data: WhoisData) {
  whoisCache.set(domain, { data, timestamp: Date.now() });
  // 限制缓存大小
  if (whoisCache.size > 100) {
    const oldest = whoisCache.keys().next().value;
    if (oldest) whoisCache.delete(oldest);
  }
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
      const rawDomain = domain.trim().toLowerCase();
      if (!rawDomain) {
        setData(null);
        setIsLoading(false);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const norm = toASCII(rawDomain);
        const isIdnDomain = isIDN(rawDomain);
        
        // 检查缓存
        const cached = getCachedWhois(norm);
        if (cached) {
          if (!mounted.current) return;
          setData(cached);
          setIsLoading(false);
          return;
        }
        
        console.log(`[WHOIS] 查询域名: ${rawDomain}${isIdnDomain ? ` (Punycode: ${norm})` : ''}`);
        console.log(`[WHOIS] 支持 ${getSupportedTldCount()}+ TLDs`);
        
        const parts = norm.split('.');
        const tld = parts[parts.length - 1];
        
        let result: WhoisData | null = null;
        let lastError = "";
        
        // === 0. 优先尝试 Vercel Edge 代理（部署在 Vercel 时可用） ===
        try {
          const edgeUrl = `/api/whois?domain=${encodeURIComponent(norm)}`;
          const controller0 = new AbortController();
          const t0 = setTimeout(() => controller0.abort(), 6000);
          const edgeResp = await fetch(edgeUrl, {
            signal: controller0.signal,
            headers: { Accept: 'application/json' },
          });
          clearTimeout(t0);
          if (edgeResp.ok) {
            const edgeData = await edgeResp.json();
            if (edgeData.source === 'rdap' && edgeData.data) {
              result = parseRdap(edgeData.data);
              result.raw = JSON.stringify(edgeData.data, null, 2);
              console.log(`[WHOIS] Edge RDAP 查询成功`);
            } else if (edgeData.source === 'tianhu' && edgeData.data?.code === 200) {
              const payload = edgeData.data.data;
              const formatted = payload?.formatted;
              let ns: string[] = [];
              let creationDate: string | undefined;
              let expirationDate: string | undefined;
              let status: string[] = [];
              if (formatted?.domain) {
                ns = formatted.domain.name_servers || [];
                status = Array.isArray(formatted.domain.status) ? formatted.domain.status : [];
                creationDate = formatDate(formatted.domain.created_date || formatted.domain.created_date_utc);
                expirationDate = formatDate(formatted.domain.expired_date || formatted.domain.expired_date_utc);
              }
              result = {
                domainName: payload?.domain || norm,
                registrar: formatted?.registrar?.registrar_name,
                registrantOrg: formatted?.registrant?.registrant_organization || formatted?.registrant?.name,
                creationDate,
                expirationDate,
                nameServers: ns,
                status,
                registered: payload?.status === 1,
                raw: payload?.result,
              };
              console.log(`[WHOIS] Edge tian.hu 查询成功`);
            } else if (edgeData.source === 'whois-proxy' && edgeData.data) {
              const text = edgeData.data;
              if (!looksLikeNotFoundWhois(text)) {
                const rawWhoisMatch = text.match(/```\s*([\s\S]*?Domain Name[\s\S]*?)```/i)
                  || text.match(/Raw Whois Data[\s\S]*?```\s*([\s\S]*?)```/i)
                  || text.match(/Whois Data[\s\S]*?\n([\s\S]*)/i);
                if (rawWhoisMatch) {
                  const parsed = parseWhoisText(rawWhoisMatch[1] || text, norm);
                  if (parsed.registrar || parsed.creationDate || (parsed.nameServers && parsed.nameServers.length > 0)) {
                    result = parsed;
                    console.log(`[WHOIS] Edge WHOIS代理查询成功`);
                  }
                }
              }
            }
          }
        } catch (err) {
          console.log(`[WHOIS] Edge 代理不可用，回退到直查`);
        }
        
        if (result) {
          // Edge 成功，跳过后续
        }
        // === 1. 优先尝试RDAP查询 ===
        else {
        const rdapServer = getRdapServer(norm);
        if (rdapServer) {
          try {
            console.log(`[WHOIS] 尝试RDAP: ${rdapServer}/domain/${norm}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            
            const response = await fetch(`${rdapServer}/domain/${encodeURIComponent(norm)}`, {
              signal: controller.signal,
              headers: { 'Accept': 'application/rdap+json, application/json' }
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const rdapData = await response.json();
              result = parseRdap(rdapData);
              result.raw = JSON.stringify(rdapData, null, 2);
              console.log(`[WHOIS] RDAP查询成功`);
            } else {
              lastError = `RDAP: HTTP ${response.status}`;
              console.warn(`[WHOIS] RDAP失败: ${response.status}`);
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : "未知错误";
            lastError = `RDAP: ${msg}`;
            console.warn(`[WHOIS] RDAP异常: ${msg}`);
          }
        }
        
        // === 2. RDAP失败，同时尝试 rdap.org 和 whois代理（竞速） ===
        if (!result) {
          const whoisServer = getWhoisServer(norm);
          
          // 创建并发请求数组
          const fallbackPromises: Promise<WhoisData | null>[] = [];
          
          // 2a. rdap.org（通常比 jina.ai 代理快很多）
          fallbackPromises.push(
            (async (): Promise<WhoisData | null> => {
              try {
                console.log(`[WHOIS] 尝试 rdap.org`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(norm)}`, {
                  signal: controller.signal,
                  headers: { 'Accept': 'application/rdap+json, application/json' }
                });
                clearTimeout(timeoutId);
                
                if (response.ok) {
                  const contentType = response.headers.get('content-type') || '';
                  if (contentType.includes('json')) {
                    const rdapData = await response.json();
                    const parsed = parseRdap(rdapData);
                    parsed.raw = JSON.stringify(rdapData, null, 2);
                    console.log(`[WHOIS] rdap.org 查询成功`);
                    return parsed;
                  }
                  // 如果不是JSON，尝试解析文本中的JSON
                  const text = await response.text();
                  const parsed = safeParseJson(text);
                  if (parsed) {
                    const rdapResult = parseRdap(parsed);
                    rdapResult.raw = JSON.stringify(parsed, null, 2);
                    return rdapResult;
                  }
                }
              } catch (err) {
                console.warn(`[WHOIS] rdap.org 异常:`, err);
              }
              return null;
            })()
          );
          
          // 2b. tian.hu API（通常也比jina代理快）
          fallbackPromises.push(
            (async (): Promise<WhoisData | null> => {
              try {
                console.log(`[WHOIS] 尝试 tian.hu API`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(`https://api.tian.hu/whois/${encodeURIComponent(norm)}`, {
                  signal: controller.signal,
                  headers: { 'Accept': 'application/json' }
                });
                clearTimeout(timeoutId);
                
                if (response.ok) {
                  const data = await response.json();
                  if (data.code === 200 && data.data) {
                    const payload = data.data;
                    const formatted = payload.formatted;
                    
                    let ns: string[] = [];
                    let creationDate: string | undefined;
                    let expirationDate: string | undefined;
                    let status: string[] = [];
                    
                    if (formatted?.domain) {
                      ns = formatted.domain.name_servers || [];
                      status = Array.isArray(formatted.domain.status) ? formatted.domain.status : [];
                      creationDate = formatDate(formatted.domain.created_date || formatted.domain.created_date_utc);
                      expirationDate = formatDate(formatted.domain.expired_date || formatted.domain.expired_date_utc);
                    }
                    
                    if (ns.length === 0 && payload.result) {
                      const nsMatches = payload.result.match(/nserver:\s*([^\s<\r\n]+)/gi) || [];
                      ns = nsMatches.map((m: string) => {
                        const parts = m.split(/:\s*/);
                        return parts[1]?.trim();
                      }).filter(Boolean);
                    }
                    
                    console.log(`[WHOIS] tian.hu API 查询成功`);
                    return {
                      domainName: payload.domain || norm,
                      registrar: formatted?.registrar?.registrar_name,
                      registrantOrg: formatted?.registrant?.registrant_organization || formatted?.registrant?.name,
                      registrantCountry: formatted?.registrant?.registrant_street?.split(',').pop()?.trim(),
                      creationDate,
                      expirationDate,
                      nameServers: ns,
                      status,
                      registered: payload.status === 1,
                      raw: payload.result,
                    };
                  }
                }
              } catch (err) {
                console.warn(`[WHOIS] tian.hu 异常:`, err);
              }
              return null;
            })()
          );
          
          // 2c. jina.ai 代理 who.is（最慢，作为最后手段）
          if (whoisServer) {
            fallbackPromises.push(
              (async (): Promise<WhoisData | null> => {
                try {
                  console.log(`[WHOIS] 尝试WHOIS代理: ${whoisServer} -> ${norm}`);
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 12000);
                  
                  const proxyUrl = `https://r.jina.ai/https://www.who.is/whois/${encodeURIComponent(norm)}`;
                  
                  const response = await fetch(proxyUrl, {
                    signal: controller.signal,
                    headers: { 'Accept': 'text/plain' }
                  });
                  clearTimeout(timeoutId);
                  
                  if (response.ok) {
                    const text = await response.text();
                    
                    const noDataPatterns = [
                      /No WHOIS data was found/i,
                      /No match for/i,
                      /NOT FOUND/i,
                      /No entries found/i,
                      /Domain not found/i,
                      /No information available/i,
                      /Status:\s*AVAILABLE/i,
                    ];
                    
                    const hasNoData = noDataPatterns.some(pattern => pattern.test(text));
                    
                    if (!hasNoData) {
                      const rawWhoisMatch = text.match(/```\s*([\s\S]*?Domain Name[\s\S]*?)```/i) 
                        || text.match(/Raw Whois Data[\s\S]*?```\s*([\s\S]*?)```/i)
                        || text.match(/Whois Data[\s\S]*?\n([\s\S]*)/i);
                      
                      if (rawWhoisMatch) {
                        const parsed = parseWhoisText(rawWhoisMatch[1] || text, norm);
                        if (parsed.registrar || parsed.creationDate || (parsed.nameServers && parsed.nameServers.length > 0)) {
                          console.log(`[WHOIS] WHOIS代理查询成功 (who.is)`);
                          return parsed;
                        }
                      }
                    }
                  }
                } catch (err) {
                  console.warn(`[WHOIS] WHOIS代理异常:`, err);
                }
                return null;
              })()
            );
          }
          
          // 竞速：手动实现 Promise.any 取第一个成功的结果
          try {
            result = await new Promise<WhoisData>((resolve, reject) => {
              let rejectedCount = 0;
              const total = fallbackPromises.length;
              fallbackPromises.forEach(p => {
                p.then(r => {
                  if (r) resolve(r);
                  else throw new Error('empty');
                }).catch(() => {
                  rejectedCount++;
                  if (rejectedCount === total) reject(new Error("全部失败"));
                });
              });
            });
          } catch {
            // 全部失败
          }
          
          if (!result) {
            lastError = "所有备选查询源均未返回有效数据";
          }
        }
        } // end else (Edge not available)
        
        
        if (!mounted.current) return;
        
        if (!result) {
          // Before giving up, try a quick DNS check to see if domain is registered
          try {
            const dnsResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(norm)}&type=A`, {
              signal: AbortSignal.timeout(5000),
              headers: { Accept: 'application/dns-json' },
            });
            if (dnsResp.ok) {
              const dnsData = await dnsResp.json();
              // Status 0 = NOERROR means domain exists in DNS
              if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
                const ns: string[] = [];
                // Also try to get NS records
                try {
                  const nsResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(norm)}&type=NS`, {
                    signal: AbortSignal.timeout(3000),
                    headers: { Accept: 'application/dns-json' },
                  });
                  if (nsResp.ok) {
                    const nsData = await nsResp.json();
                    if (nsData.Answer) {
                      for (const ans of nsData.Answer) {
                        if (ans.type === 2 && ans.data) {
                          ns.push(ans.data.replace(/\.$/, '').toLowerCase());
                        }
                      }
                    }
                  }
                } catch {}
                
                result = {
                  domainName: rawDomain,
                  registered: true,
                  nameServers: ns.length > 0 ? ns : undefined,
                  raw: `DNS 记录存在 (A/AAAA)，WHOIS 数据暂不可用`,
                };
                console.log(`[WHOIS] DNS 回退：域名存在于 DNS 中，判定为已注册`);
              } else if (dnsData.Status === 3) {
                // NXDOMAIN - domain does not exist
                result = {
                  domainName: rawDomain,
                  registered: false,
                  status: ['available'],
                };
                console.log(`[WHOIS] DNS 回退：NXDOMAIN，域名未注册`);
              }
            }
          } catch (err) {
            console.warn(`[WHOIS] DNS 回退查询失败:`, err);
          }
        }

        if (!mounted.current) return;

        if (!result) {
          const whoisServer = WHOIS_SERVERS[tld];
          const supportMsg = whoisServer 
            ? `该后缀的WHOIS服务器(${whoisServer})暂时无法访问`
            : `暂不支持该域名后缀(.${tld})的查询`;
          throw new Error(lastError || supportMsg);
        }
        
        // 添加TLD权威服务器信息
        const tldServers = getTLDServers(norm);
        result.tldServers = tldServers || undefined;
        
        // 对于IDN域名，保留原始Unicode域名用于显示
        if (isIdnDomain && result.domainName === norm) {
          result.domainName = rawDomain;
        }
        
        setCachedWhois(norm, result);
        setData(result);
        setIsLoading(false);
      } catch (err) {
        if (!mounted.current) return;
        const msg = err instanceof Error ? err.message : "查询失败";
        const errorMessage = msg.includes("abort") || msg.includes("timeout")
          ? "查询超时，请稍后重试"
          : msg;
        setError(errorMessage);
        setIsLoading(false);
        console.error("[WHOIS] 查询错误:", msg);
      }
    };

    run();
  }, [domain]);

  return { whois: data, isLoading, error };
}
