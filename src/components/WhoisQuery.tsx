import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Building, Server, CheckCircle2, ChevronDown, ChevronUp, DollarSign, RefreshCw, Globe, ExternalLink, Code2, ShieldAlert, Database } from "lucide-react";
import { useWhois, DataSource } from "@/hooks/use-whois";
import { useDomainPrice } from "@/hooks/use-domain-price";
import { WhoisSkeleton } from "@/components/WhoisSkeleton";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { toUnicode, toASCII, isIDN } from "@/utils/tld-servers";
import { getRdapServer, getWhoisServer } from "@/utils/whois-servers";
import { categorizeStatuses, getSeverityVariant, translateStatus, getStatusInfo, isActionRequired } from "@/utils/domain-status-mapping";
import { getRegistrarWebsite, getFaviconUrl } from "@/utils/registrar-data";
import { getDnsProvider } from "@/utils/dns-provider-data";
import { getCountryName } from "@/utils/country-data";
import { useDomainMeaning } from "@/hooks/use-domain-meaning";
import { getDomainLabels } from "@/lib/domain-label-manager";

// ── Raw Data Section ──────────────────────────────────────────────────────────

function RawDataSection({ rawText, rdapData }: { rawText?: string; rdapData?: any }) {
  const [open, setOpen] = useState(false);
  const hasText = !!rawText;
  const hasJson = !!rdapData;
  const [viewMode, setViewMode] = useState<"text" | "json">(hasText ? "text" : "json");

  if (!hasText && !hasJson) return null;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <Code2 className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium">原始数据</span>
        {open ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
      </button>
      {open && (
        <div className="border-t border-border">
          {hasText && hasJson && (
            <div className="flex border-b border-border">
              <button
                onClick={() => setViewMode("text")}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors ${viewMode === "text" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                WHOIS 文本
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`flex-1 py-1.5 text-xs font-medium transition-colors ${viewMode === "json" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                RDAP JSON
              </button>
            </div>
          )}
          <div className="relative">
            <pre className="text-[11px] font-mono leading-relaxed text-muted-foreground bg-muted/30 p-3 overflow-x-auto max-h-96 whitespace-pre-wrap break-all">
              {viewMode === "json" && hasJson
                ? JSON.stringify(rdapData, null, 2)
                : rawText || ""}
            </pre>
            <button
              onClick={async () => {
                try {
                  const text = viewMode === "json" && hasJson
                    ? JSON.stringify(rdapData, null, 2)
                    : rawText || "";
                  await navigator.clipboard.writeText(text);
                } catch {}
              }}
              className="absolute top-2 right-2 px-2 py-1 text-[10px] rounded bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              复制
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 检查是否为隐私保护或空信息
const isPrivacyRedacted = (value: string | undefined): boolean => {
  if (!value) return false;
  const privacyPatterns = [
    /redacted/i,
    /privacy/i,
    /protected/i,
    /withheld/i,
    /not disclosed/i,
    /data protected/i,
    /gdpr/i,
    /private/i,
    /contact privacy/i,
    /whoisguard/i,
    /domains by proxy/i,
    /perfect privacy/i,
    /proxy/i,
    /masked/i,
    /hidden/i,
    /confidential/i,
    /n\/a/i,
    /not available/i,
    /not shown/i,
    /registry customer/i,
    /domain administrator/i,
  ];
  return privacyPatterns.some(pattern => pattern.test(value));
};

// 格式化显示值，处理隐私保护
const formatDisplayValue = (value: string | undefined, defaultText: string = "所有者选择隐藏信息"): string => {
  if (!value || isPrivacyRedacted(value)) {
    return defaultText;
  }
  return value;
};

interface WhoisQueryProps {
  domain: string;
  displayDomain?: string;
  onLoadComplete?: () => void;
  onStatusDetected?: (status: string) => void;
  showPrice?: boolean;
}






export const WhoisQuery = ({ domain, displayDomain: propDisplayDomain, onLoadComplete, onStatusDetected, showPrice = true }: WhoisQueryProps) => {
  const { whois: whoisData, envelope, isLoading, error } = useWhois(domain);
  const { priceData, isLoading: isPriceLoading, error: priceError, fetchPrice, formatPrice, resetPrice } = useDomainPrice();
  const [expandedRegistrar, setExpandedRegistrar] = useState(false);
  const domainMeaning = useDomainMeaning(domain);
  
  // 使用传入的displayDomain或使用toUnicode转换
  const displayDomain = propDisplayDomain || (isIDN(domain) ? toUnicode(domain) : domain);
  
  // 计算Punycode版本（用于IDN域名显示）
  const punycodeDomain = toASCII(domain);
  const showDualForm = isIDN(domain) && punycodeDomain !== displayDomain;
  
  // 获取服务器诊断信息
  const rdapServer = getRdapServer(domain);
  const whoisServer = getWhoisServer(domain);
  const hasRdapSupport = !!rdapServer;
  const hasWhoisSupport = !!whoisServer;

  // 当加载完成时调用回调
  const onLoadCompleteRef = useRef(onLoadComplete);
  onLoadCompleteRef.current = onLoadComplete;
  const onStatusDetectedRef = useRef(onStatusDetected);
  onStatusDetectedRef.current = onStatusDetected;
  
  useEffect(() => {
    if (!isLoading) {
      onLoadCompleteRef.current?.();
      if (whoisData && onStatusDetectedRef.current) {
        const status = getDomainStatus();
        onStatusDetectedRef.current(status.label);
      }
    }
  }, [isLoading]);
  
  // 当域名变化时自动查询价格 (仅在 showPrice 启用时)
  const prevDomainRef = useRef('');
  useEffect(() => {
    if (!showPrice) return;
    if (domain) {
      if (domain !== prevDomainRef.current) {
        prevDomainRef.current = domain;
        resetPrice();
      }
      fetchPrice(domain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, showPrice]);

  // Domain labels (i18n smart labels based on timestamps)
  const domainLabels = useMemo(() => {
    if (!whoisData) return null;
    const result = getDomainLabels({
      creationDate:   whoisData.creationDate,
      expirationDate: whoisData.expirationDate,
      updatedDate:    whoisData.updatedDate,
    });
    return result.labels.length > 0 ? result : null;
  }, [whoisData?.creationDate, whoisData?.expirationDate, whoisData?.updatedDate]);

  // Data source display helper
  const getSourceLabel = (src: DataSource): string => {
    switch (src) {
      case DataSource.RDAP:         return "RDAP";
      case DataSource.RDAP_DIRECT:  return "RDAP";
      case DataSource.RDAP_ORG:     return "RDAP";
      case DataSource.WHOIS_FALLBACK: return "WHOIS";
      case DataSource.DNS_FALLBACK: return "DNS";
      default:                      return "Unknown";
    }
  };

  // 获取分类后的状态信息（用于增强状态徽标）
  const getCategorizedStatuses = () => {
    if (!whoisData?.status) return null;
    return categorizeStatuses(whoisData.status);
  };
  const getDomainStatus = (): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    if (!whoisData) return { label: "查询中", variant: "outline" };
    
    // 1. 最高优先级：明确的未注册状态
    if (whoisData.registered === false) {
      return { label: "未注册", variant: "outline" };
    }
    
    // 2. 检查域名状态字符串（必须在检查registered之前）
    const statusString = whoisData.status?.join(' ').toLowerCase() || '';
    const rawStatusString = whoisData.status?.join(' ') || '';
    
    // 2.0 申请待审核状态（优先级最高）
    if (statusString.includes('application') && statusString.includes('pending')) {
      return { label: "申请待审核", variant: "secondary" };
    }
    if (statusString.includes('pending') && !statusString.includes('delete') && !statusString.includes('transfer')) {
      // 如果只是pending，且没有创建日期，可能是申请中
      if (!whoisData.creationDate) {
        return { label: "待处理", variant: "secondary" };
      }
    }
    
    // 2.1 赎回期（即将删除，但还可以恢复）
    if (statusString.includes('redemption')) {
      return { label: "赎回期", variant: "destructive" };
    }
    
    // 2.2 待删除状态
    if (statusString.includes('pendingdelete') || statusString.includes('pending delete')) {
      return { label: "待删除", variant: "destructive" };
    }
    
    // 2.3 被保留（通常是注册局保留的域名）
    if (statusString.includes('reserved')) {
      return { label: "注册局保留", variant: "secondary" };
    }
    
    // 2.4 隔离、冻结、屏蔽状态
    if (statusString.includes('quarantine')) {
      return { label: "隔离期", variant: "destructive" };
    }
    if (statusString.includes('frozen')) {
      return { label: "已冻结", variant: "destructive" };
    }
    if (statusString.includes('blocked')) {
      return { label: "已屏蔽", variant: "destructive" };
    }
    
    // 2.5 暂停状态（各种 hold）
    if (statusString.includes('hold')) {
      if (statusString.includes('registrar')) {
        return { label: "注册商暂停", variant: "destructive" };
      }
      if (statusString.includes('registry')) {
        return { label: "注册局暂停", variant: "destructive" };
      }
      if (statusString.includes('legal')) {
        return { label: "法律暂停", variant: "destructive" };
      }
      if (statusString.includes('dispute')) {
        return { label: "争议暂停", variant: "destructive" };
      }
      if (statusString.includes('fraud')) {
        return { label: "欺诈暂停", variant: "destructive" };
      }
      if (statusString.includes('abuse')) {
        return { label: "滥用暂停", variant: "destructive" };
      }
      return { label: "域名暂停", variant: "destructive" };
    }
    
    // 2.6 转移中状态
    if (statusString.includes('pendingtransfer') || (statusString.includes('transfer') && statusString.includes('pending'))) {
      return { label: "转移处理中", variant: "secondary" };
    }
    if (statusString.includes('transferstarted')) {
      return { label: "转移已启动", variant: "secondary" };
    }
    
    // 2.7 已暂停、已终止
    if (statusString.includes('suspended')) {
      return { label: "已暂停", variant: "destructive" };
    }
    if (statusString.includes('terminated')) {
      return { label: "已终止", variant: "destructive" };
    }
    
    // 3. 检查过期日期
    if (whoisData.expirationDate) {
      try {
        const expDate = parseChineseDate(whoisData.expirationDate);
        const now = new Date();
        
        // 3.1 已过期
        if (expDate < now) {
          return { label: "已过期", variant: "destructive" };
        }
        
        // 3.2 即将过期（30天内）
        const daysUntilExpiry = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          return { label: "即将过期", variant: "destructive" };
        }
      } catch (e) {
        console.error('日期解析错误:', e);
      }
    }
    
    // 4. 有创建日期，说明已正常注册
    if (whoisData.creationDate) {
      // 检查是否有 "ok" 状态
      if (statusString.includes('ok') || statusString === '') {
        return { label: "正常", variant: "default" };
      }
      return { label: "已注册", variant: "default" };
    }
    
    // 5. registered === true 但没有创建日期（可能是特殊状态）
    if (whoisData.registered === true) {
      // ccTLD 很常见：不返回 creationDate/registrar/status，但会给 nameserver / dnssec 等；
      // 这里统一兜底为“已注册”，避免大量显示“状态未知”。
      return { label: "已注册", variant: "default" };
    }
    
    // 6. 如果有注册商信息，大概率是已注册
    if (whoisData.registrar) {
      return { label: "已注册", variant: "default" };
    }

    // 6.1 如果存在 NS，也可视为已注册（很多 ccTLD 仅返回 NS）
    if (whoisData.nameServers && whoisData.nameServers.length > 0) {
      return { label: "已注册", variant: "default" };
    }

    // 6.2 RDAP 结果可能只有 DNSSEC/少量字段，若有 raw 或 dnssec 信息，也倾向于已注册
    if (whoisData.dnssec || (whoisData.raw && whoisData.raw.length > 50)) {
      return { label: "已注册", variant: "default" };
    }
    
    // 7. 都没有，返回未知
    return { label: "状态未知", variant: "outline" };
  };

  // 获取额外的状态标签（用于DNSSEC右侧显示）
  const getExtraStatusBadges = (): Array<{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }> => {
    const badges: Array<{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = [];
    if (!whoisData) return badges;
    
    const statusString = whoisData.status?.join(' ').toLowerCase() || '';
    
    // 1. 检查过期相关状态
    if (whoisData.expirationDate) {
      try {
        const expDate = parseChineseDate(whoisData.expirationDate);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (expDate < now) {
          badges.push({ label: "已过期", variant: "destructive" });
        } else if (daysUntilExpiry <= 7) {
          badges.push({ label: "马上过期", variant: "destructive" });
        } else if (daysUntilExpiry <= 30) {
          badges.push({ label: "即将过期", variant: "destructive" });
        }
      } catch (e) {
        // 忽略日期解析错误
      }
    }
    
    // 2. 检查续费相关状态
    if (statusString.includes('autorenew') || statusString.includes('renewperiod')) {
      badges.push({ label: "近期续费", variant: "secondary" });
    }
    
    // 3. 检查转移相关状态
    if (statusString.includes('pendingtransfer') || (statusString.includes('transfer') && statusString.includes('pending'))) {
      badges.push({ label: "正在转移", variant: "secondary" });
    } else if (statusString.includes('transferperiod')) {
      badges.push({ label: "近期转移", variant: "secondary" });
    } else if (statusString.includes('transferstarted')) {
      badges.push({ label: "转移中", variant: "secondary" });
    }
    
    // 4. 检查暂停/Hold状态
    if (statusString.includes('hold')) {
      if (!badges.some(b => b.label.includes('暂停'))) {
        badges.push({ label: "域名暂停", variant: "destructive" });
      }
    }
    
    // 5. 检查赎回期
    if (statusString.includes('redemption')) {
      badges.push({ label: "赎回期", variant: "destructive" });
    }
    
    // 6. 检查待删除
    if (statusString.includes('pendingdelete')) {
      badges.push({ label: "待删除", variant: "destructive" });
    }
    
    // 7. 检查隔离期
    if (statusString.includes('quarantine')) {
      badges.push({ label: "隔离期", variant: "destructive" });
    }
    
    // 8. 检查冻结状态
    if (statusString.includes('frozen')) {
      badges.push({ label: "已冻结", variant: "destructive" });
    }
    
    // 9. 新注册宽限期
    if (statusString.includes('addperiod')) {
      badges.push({ label: "新注册", variant: "default" });
    }
    
    return badges;
  };

  // 解析年月日格式的日期字符串
  const parseChineseDate = (dateString: string): Date => {
    // 匹配 "2026年2月5日 08:00:00" 格式
    const match = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      return new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6]);
    }
    // 匹配 "2026年2月5日" 无时间
    const match2 = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (match2) {
      return new Date(+match2[1], +match2[2] - 1, +match2[3]);
    }
    return new Date(dateString);
  };

  // 计算时间差 - 使用精确的日期计算
  const getTimeDifference = (startDate: string, endDate?: Date): string => {
    const start = parseChineseDate(startDate);
    const end = endDate || new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    
    // 如果少于1天，显示时分秒
    if (diffTime < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      return `${hours} 时 ${minutes} 分 ${seconds} 秒`;
    }
    
    // 使用精确的年月日计算
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    
    // 如果天数为负，从月份借位
    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // 如果月份为负，从年份借位
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // 格式化输出
    if (years > 0 && months > 0) {
      return `${years} 年 ${months} 个月`;
    }
    if (years > 0) {
      return `${years} 年`;
    }
    if (months > 0 && days > 0) {
      return `${months} 个月 ${days} 天`;
    }
    if (months > 0) {
      return `${months} 个月`;
    }
    return `${days} 天`;
  };

  // 计算域名已注册时间
  const getRegisteredTime = (creationDate: string): string => {
    return getTimeDifference(creationDate);
  };

  // 计算距离过期时间
  const getTimeUntilExpiry = (expirationDate: string): string => {
    const expDate = parseChineseDate(expirationDate);
    const now = new Date();
    
    if (expDate < now) {
      return '已过期';
    }
    
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 如果少于30天，显示剩余的天、时、分、秒
    if (diffDays < 30) {
      const days = diffDays;
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      if (days > 0) {
        return `${days} 天 ${hours} 时 ${minutes} 分`;
      }
      return `${hours} 时 ${minutes} 分 ${seconds} 秒`;
    }
    
    // 大于30天，使用年月日计算
    let years = expDate.getFullYear() - now.getFullYear();
    let months = expDate.getMonth() - now.getMonth();
    let days = expDate.getDate() - now.getDate();
    
    // 如果天数为负，从月份借位
    if (days < 0) {
      months--;
      const prevMonth = new Date(expDate.getFullYear(), expDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // 如果月份为负，从年份借位
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // 格式化输出
    if (years > 0 && months > 0) {
      return `${years} 年 ${months} 个月`;
    }
    if (years > 0) {
      return `${years} 年`;
    }
    if (months > 0 && days > 0) {
      return `${months} 个月 ${days} 天`;
    }
    if (months > 0) {
      return `${months} 个月`;
    }
    return `${days} 天`;
  };

  // 格式化日期为 年月日 时:分:秒
  const formatDateTime = (dateString: string): string => {
    try {
      // 如果已经是 年月日 格式，直接返回
      if (/\d{4}年\d{1,2}月\d{1,2}日/.test(dateString)) return dateString;
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateString;
    }
  };

  // 判断注册商名称是否过长
  const isRegistrarLong = (registrar: string): boolean => {
    return registrar.length > 30;
  };

  // 未注册域名的增强检测：通过DNS和SSL交叉验证
  const [dnsCheck, setDnsCheck] = useState<{ hasDns: boolean; hasSsl: boolean; checked: boolean }>({ hasDns: false, hasSsl: false, checked: false });
  
  useEffect(() => {
    if (!whoisData || whoisData.registered !== false || !domain) return;
    // When WHOIS says unregistered, cross-check with DNS + SSL
    let cancelled = false;
    const check = async () => {
      let hasDns = false;
      let hasSsl = false;
      try {
        const dnsResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
          signal: AbortSignal.timeout(5000),
          headers: { Accept: 'application/dns-json' },
        });
        if (dnsResp.ok) {
          const d = await dnsResp.json();
          hasDns = d.Status === 0 && d.Answer && d.Answer.length > 0;
        }
      } catch {}
      // Quick SSL check via HTTPS probe
      try {
        const sslResp = await fetch(`https://${domain}`, { signal: AbortSignal.timeout(4000), mode: 'no-cors' });
        hasSsl = true; // If no error thrown, SSL likely exists
      } catch (e: any) {
        // TypeError with 'failed to fetch' could mean DNS fail or SSL fail
        // but if we already know DNS exists, SSL might just be blocked by CORS
        if (hasDns) hasSsl = false; // uncertain
      }
      if (!cancelled) setDnsCheck({ hasDns, hasSsl, checked: true });
    };
    check();
    return () => { cancelled = true; };
  }, [whoisData, domain]);

  // Override registered status if DNS cross-check reveals the domain exists
  const effectiveRegistered = useMemo(() => {
    if (!whoisData) return undefined;
    if (whoisData.registered === false && dnsCheck.checked && dnsCheck.hasDns) {
      return true; // DNS records exist, domain is likely registered
    }
    return whoisData.registered;
  }, [whoisData, dnsCheck]);

  return (
    <Card className="p-3 sm:p-6 md:p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      {isLoading ? (
        <WhoisSkeleton />
      ) : whoisData ? (
        effectiveRegistered === false ? (
          /* ===== 未注册域名增强卡片 ===== */
          <div className="space-y-4">
            {/* Price section at top even for unregistered */}
            {showPrice && (
            <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                {isPriceLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                    <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    <span className="text-xs sm:text-sm">正在查询价格...</span>
                  </div>
                )}
                {priceError && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">{priceError}</span>
                    <Button variant="outline" size="sm" onClick={() => fetchPrice(domain)} className="h-6 px-2 text-xs gap-1">
                      <RefreshCw className="h-3 w-3" />重试
                    </Button>
                  </div>
                )}
                {priceData && !isPriceLoading && !priceError && (
                  <div className="flex items-center gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-left-2 duration-300 flex-wrap flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">注册:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{formatPrice(priceData.registrationPrice)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">续费:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{formatPrice(priceData.renewalPrice)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
            
            {/* Unregistered status card */}
            <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="text-lg sm:text-xl font-bold text-foreground">{displayDomain}</span>
                {domainMeaning && (
                  <span className="text-sm sm:text-base text-muted-foreground">— {domainMeaning}</span>
                )}
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1 mb-3 border-primary/40 text-primary">
                🎉 该域名尚未注册
              </Badge>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                该域名目前可以注册，快去抢注吧！
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {[
                  { label: "Porkbun", url: `https://porkbun.com/checkout/search?q=${encodeURIComponent(domain)}`, primary: true },
                  { label: "Cloudflare", url: `https://www.cloudflare.com/products/registrar/` },
                  { label: "NameSilo", url: `https://www.namesilo.com/domain/search-domains?query=${encodeURIComponent(domain)}` },
                  { label: "Namecheap", url: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}` },
                  { label: "Dynadot", url: `https://www.dynadot.com/domain/search?domain=${encodeURIComponent(domain)}` },
                  { label: "GoDaddy", url: `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(domain)}` },
                  { label: "Name.com", url: `https://www.name.com/domain/search/${encodeURIComponent(domain)}` },
                  { label: "Spaceship", url: `https://www.spaceship.com/domain/?domain=${encodeURIComponent(domain)}` },
                ].map(({ label, url, primary }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors inline-flex items-center gap-1 ${
                      primary
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <ExternalLink className="h-3 w-3" />{label}
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-[11px] text-muted-foreground/70 mb-2 font-medium uppercase tracking-wider">抢注 / 退款保护</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { label: "SnapNames", url: `https://www.snapnames.com/domain_search.html?domain=${encodeURIComponent(domain)}` },
                    { label: "DropCatch", url: `https://www.dropcatch.com/domain/${encodeURIComponent(domain)}` },
                    { label: "GoDaddy Auctions", url: `https://auctions.godaddy.com/trpItemListing.aspx?miid=${encodeURIComponent(domain)}` },
                    { label: "Sedo", url: `https://sedo.com/search/searchresult.php4?keyword=${encodeURIComponent(domain)}&language=e` },
                  ].map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-[11px] rounded border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-2.5 w-2.5" />{label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="space-y-2.5 sm:space-y-4 md:space-y-6">
          {/* 0. 域名价格 - 放在最上方 */}
          {showPrice && (
          <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              
              {isPriceLoading && (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                  <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  <span className="text-xs sm:text-sm">正在查询价格...</span>
                </div>
              )}
              
              {priceError && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">{priceError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPrice(domain)}
                    className="h-6 px-2 text-xs gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    重试
                  </Button>
                </div>
              )}
              
              {priceData && !isPriceLoading && !priceError && (
                <div className="flex items-center gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-left-2 duration-300 flex-wrap flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">注册:</span>
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {formatPrice(priceData.registrationPrice)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">续费:</span>
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {formatPrice(priceData.renewalPrice)}
                    </span>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">议价:</span>
                    <span className={`text-xs sm:text-sm font-bold ${priceData.isNegotiable ? 'text-destructive' : 'text-foreground'}`}>
                      {priceData.isNegotiable ? '是' : '否'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          {/* 1. 域名信息 */}
          <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
            <div className="space-y-3">
              {/* 域名和状态标签 */}
              <div className="flex items-start gap-2 sm:gap-3">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0 mt-0.5 w-[4.5rem] sm:w-[5.5rem] text-right">域名:</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-foreground break-all">
                      {displayDomain}
                    </span>
                    {domainMeaning && (
                      <span className="text-xs sm:text-sm text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
                        {domainMeaning}
                      </span>
                    )}
                  </div>
                  {showDualForm && (
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        ({punycodeDomain})
                      </span>
                    </div>
                  )}
                  {/* i18n Smart Labels */}
                  {domainLabels && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {domainLabels.labels.map((lbl) => (
                        <span
                          key={lbl.key}
                          title={`${lbl.en} / ${lbl.zh}`}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            lbl.severity === "error"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : lbl.severity === "warning"
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                              : "bg-primary/8 text-primary border-primary/20"
                          }`}
                        >
                          {lbl.zh}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Badge 
                  variant={getDomainStatus().variant} 
                  className="text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 flex-shrink-0"
                >
                  {getDomainStatus().label}
                </Badge>
              </div>
              
              {/* DNSSEC */}
              <div className="flex items-center gap-2 sm:gap-3">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">DNSSEC:</span>
                <span className="text-xs sm:text-sm text-foreground">{whoisData.dnssec || "未启用"}</span>
              </div>
            </div>
          </div>

          {/* 2. 注册商信息 */}
          {whoisData.registrar && (
              <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getRegistrarWebsite(whoisData.registrar) && (
                      <img 
                        src={getFaviconUrl(getRegistrarWebsite(whoisData.registrar)!)} 
                        alt="" 
                        className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 rounded-sm"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    {!getRegistrarWebsite(whoisData.registrar) && (
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">注册商:</span>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      {isRegistrarLong(whoisData.registrar) && !expandedRegistrar ? (
                        <>
                          <span className="font-bold text-sm sm:text-base text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {whoisData.registrar.slice(0, 25)}...
                          </span>
                          <button 
                            onClick={() => setExpandedRegistrar(true)}
                            className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                            展开
                          </button>
                        </>
                      ) : isRegistrarLong(whoisData.registrar) && expandedRegistrar ? (
                        <>
                          <span className="font-bold text-sm sm:text-base text-foreground break-all">{whoisData.registrar}</span>
                          <button 
                            onClick={() => setExpandedRegistrar(false)}
                            className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                          >
                            <ChevronUp className="h-3 w-3" />
                            收起
                          </button>
                        </>
                      ) : (
                        <span className="font-bold text-sm sm:text-base text-foreground break-all">{whoisData.registrar}</span>
                      )}
                    </div>
                    {getRegistrarWebsite(whoisData.registrar) && (
                      <a
                        href={getRegistrarWebsite(whoisData.registrar)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors flex-shrink-0"
                        title="访问注册商官网"
                      >
                        <Globe className="h-3 w-3" />
                        <span className="hidden sm:inline">官网</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {whoisData.registrarIanaId && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">IANA ID:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{whoisData.registrarIanaId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 3. 时间信息 */}
          {whoisData.creationDate && (
            <div className="relative p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md pb-7 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">注册时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.creationDate)}</span>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-muted-foreground">
                已注册 {getRegisteredTime(whoisData.creationDate)}
              </p>
            </div>
          )}

          {whoisData.expirationDate && (
            <div className="relative p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md pb-7 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">过期时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.expirationDate)}</span>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-muted-foreground">
                距离过期 {getTimeUntilExpiry(whoisData.expirationDate)}
              </p>
            </div>
          )}

          {whoisData.updatedDate && (
            <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">更新时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.updatedDate)}</span>
              </div>
            </div>
          )}

          {/* 4. 注册人信息 */}
          {(whoisData.registrantOrg || whoisData.registrantCountry) && (
              <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  {whoisData.registrantOrg && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">注册主体:</span>
                      <span className={`font-bold text-sm sm:text-base break-all ${isPrivacyRedacted(whoisData.registrantOrg) ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                        {formatDisplayValue(whoisData.registrantOrg)}
                      </span>
                    </div>
                  )}
                  {whoisData.registrantCountry && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">国家/地区:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{getCountryName(whoisData.registrantCountry)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 5. 域名NS */}
          {whoisData.nameServers && whoisData.nameServers.length > 0 && (
              <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
                <div className="space-y-2">
                  {/* 标题行：名称服务器 + DNS提供商标识 */}
                   <div className="flex items-center gap-2 sm:gap-3">
                    <Server className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">名称服务器:</span>
                    <div className="flex-1" />
                    {/* DNS 提供商识别 */}
                    {getDnsProvider(whoisData.nameServers) && (
                      <a
                        href={getDnsProvider(whoisData.nameServers)!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors flex-shrink-0"
                        title={`DNS 提供商: ${getDnsProvider(whoisData.nameServers)!.name}`}
                      >
                        <img 
                          src={getFaviconUrl(getDnsProvider(whoisData.nameServers)!.url)} 
                          alt="" 
                          className="h-3 w-3 rounded-sm"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span>{getDnsProvider(whoisData.nameServers)!.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {/* NS 列表：NS1, NS2, NS3... */}
                  <div className="ml-[6.5rem] sm:ml-[8rem] space-y-1.5">
                    {whoisData.nameServers.map((ns, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap flex-shrink-0">NS{index + 1}:</span>
                        <span className="font-mono text-sm sm:text-base font-bold text-foreground break-all">{ns}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* 6. 域名状态 */}
          {whoisData.status && whoisData.status.length > 0 && (
              <div className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0 w-[4.5rem] sm:w-[5.5rem] text-right">域名状态:</span>
                  </div>
                  <div className="ml-[6.5rem] sm:ml-[8rem] flex flex-wrap gap-1.5 sm:gap-2">
                    {whoisData.status.map((status, index) => {
                      const statusInfo = getStatusInfo(status);
                      const severity = statusInfo?.severity || "info";
                      const actionReq = isActionRequired(status);
                      const badgeClass = actionReq
                        ? "bg-destructive text-destructive-foreground ring-2 ring-destructive/40"
                        : severity === "error"
                        ? "bg-destructive text-destructive-foreground"
                        : severity === "warning"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground";
                      return (
                        <span
                          key={index}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg shadow-sm ${badgeClass}`}
                          title={`${typeof status === "string" ? status : ""}${actionReq ? " ⚠ 需要处理" : ""}`}
                        >
                          {actionReq && <ShieldAlert className="inline h-3 w-3 mr-1 -mt-0.5" />}
                          {translateStatus(status)}
                        </span>
                      );
                    })}
                    {getExtraStatusBadges().map((badge, index) => (
                      <span
                        key={`extra-${index}`}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg shadow-sm ${
                          badge.variant === "destructive"
                            ? "bg-destructive text-destructive-foreground"
                            : badge.variant === "secondary"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* 7. 数据来源 (Data Source Badge) */}
          {envelope.source !== "UNKNOWN" && (
            <div className="flex items-center gap-2 px-1">
              <Database className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-[10px] text-muted-foreground">数据来源:</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  envelope.source === DataSource.RDAP || envelope.source === DataSource.RDAP_DIRECT || envelope.source === DataSource.RDAP_ORG
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
                    : envelope.source === DataSource.DNS_FALLBACK
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                    : "bg-muted text-muted-foreground border-border"
                }`}
                title={envelope.dataProvenance}
              >
                {getSourceLabel(envelope.source)}
              </span>
              {/* Reliability score pill */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  envelope.reliabilityScore >= 0.7
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                    : envelope.reliabilityScore >= 0.4
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                    : "bg-muted text-muted-foreground border-border"
                }`}
                title={envelope.dataProvenance}
              >
                完整度 {Math.round(envelope.reliabilityScore * 100)}%
              </span>
            </div>
          )}

          {/* 8. 原始数据 */}
          {whoisData && (whoisData.raw || whoisData.rdapRaw) && (
            <RawDataSection rawText={whoisData.raw} rdapData={whoisData.rdapRaw} />
          )}
        </div>
        )
      ) : error ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-3 text-destructive opacity-50" />
          <p className="text-destructive font-medium mb-2">查询失败</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>暂无Whois信息</p>
        </div>
      )}
    </Card>
  );
};
