import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Calendar, User, Building, Server, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useWhois } from "@/hooks/use-whois";
import { useState } from "react";
import { toUnicode, isIDN } from "@/utils/tld-servers";

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
}

// 国家代码映射到中文名称
const getCountryName = (countryCode: string): string => {
  const countryMap: Record<string, string> = {
    'GY': '圭亚那',
    'CN': '中国',
    'US': '美国',
    'UK': '英国',
    'GB': '英国',
    'JP': '日本',
    'KR': '韩国',
    'DE': '德国',
    'FR': '法国',
    'CA': '加拿大',
    'AU': '澳大利亚',
    'NZ': '新西兰',
    'SG': '新加坡',
    'HK': '中国香港',
    'TW': '中国台湾',
    'MO': '中国澳门',
    'IN': '印度',
    'RU': '俄罗斯',
    'BR': '巴西',
    'MX': '墨西哥',
    'AR': '阿根廷',
    'CL': '智利',
    'CO': '哥伦比亚',
    'PE': '秘鲁',
    'VE': '委内瑞拉',
    'IT': '意大利',
    'ES': '西班牙',
    'PT': '葡萄牙',
    'NL': '荷兰',
    'BE': '比利时',
    'CH': '瑞士',
    'AT': '奥地利',
    'SE': '瑞典',
    'NO': '挪威',
    'DK': '丹麦',
    'FI': '芬兰',
    'PL': '波兰',
    'CZ': '捷克',
    'GR': '希腊',
    'TR': '土耳其',
    'IL': '以色列',
    'SA': '沙特阿拉伯',
    'AE': '阿联酋',
    'EG': '埃及',
    'ZA': '南非',
    'NG': '尼日利亚',
    'KE': '肯尼亚',
    'TH': '泰国',
    'VN': '越南',
    'ID': '印度尼西亚',
    'MY': '马来西亚',
    'PH': '菲律宾',
    'PK': '巴基斯坦',
    'BD': '孟加拉国',
  };
  
  const code = countryCode.toUpperCase();
  return countryMap[code] || countryCode;
};

// 域名状态映射到中文 - 增强版
const translateDomainStatus = (status: string): string => {
  // 移除 IANA URL、多余空格和特殊字符
  const cleanStatus = status
    .replace(/\s*https?:\/\/[^\s]+/gi, '')
    .replace(/[\(\)]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
  
  const statusMap: Record<string, string> = {
    // 申请和审核状态
    'applicationpending': '申请待审核',
    'pending': '待处理',
    'pendingapplication': '申请待审核',
    'underevaluation': '评估中',
    'underreview': '审核中',
    'awaitingapproval': '等待批准',
    
    // EPP 客户端禁止操作状态
    'clientdeleteprohibited': '禁止删除 (客户端)',
    'clienttransferprohibited': '禁止转移 (客户端)',
    'clientupdateprohibited': '禁止更新 (客户端)',
    'clientrenewprohibited': '禁止续费 (客户端)',
    'clienthold': '暂停解析 (客户端)',
    
    // EPP 服务器端禁止操作状态
    'serverdeleteprohibited': '禁止删除 (服务器)',
    'servertransferprohibited': '禁止转移 (服务器)',
    'serverupdateprohibited': '禁止更新 (服务器)',
    'serverrenewprohibited': '禁止续费 (服务器)',
    'serverhold': '暂停解析 (服务器)',
    
    // 待处理状态
    'pendingcreate': '等待创建',
    'pendingdelete': '等待删除',
    'pendingrenew': '等待续费',
    'pendingrestore': '等待恢复',
    'pendingtransfer': '转移处理中',
    'pendingupdate': '等待更新',
    'pendingverification': '等待验证',
    
    // 宽限期和赎回期
    'addperiod': '新注册宽限期 (AGP)',
    'autorenewperiod': '自动续费宽限期',
    'renewperiod': '续费宽限期 (RGP)',
    'transferperiod': '转移宽限期 (TGP)',
    'redemptionperiod': '赎回期 (RGP)',
    'pendingdeleterestorable': '删除待恢复期',
    'pendingdeletescheduled': '删除待执行期',
    
    // Hold 状态
    'Live': '正常',
    'hold': '域名暂停',
    'registrarhold': '注册商暂停',
    'registryhold': '注册局暂停',
    'clientholdprohibited': '禁止暂停 (客户端)',
    'serverholdprohibited': '禁止暂停 (服务器)',
    
    // 转移相关状态
    'transferprohibited': '禁止转移',
    'transferstarted': '转移已启动',
    'transfercompleted': '转移已完成',
    'transferrejected': '转移已拒绝',
    'transfercancelled': '转移已取消',
    'transferapproved': '转移已批准',
    'transferpending': '转移待处理',
    'transferrequested': '转移已请求',
    
    // 基本状态
    'ok': '正常状态',
    'active': '活跃',
    'inactive': '非活跃',
    'locked': '已锁定',
    'reserved': '注册局保留',
    'expired': '已过期',
    'suspended': '已暂停',
    'terminated': '已终止',
    'available': '可注册',
    'unavailable': '不可注册',
    'notfound': '未找到',
    
    // 删除相关
    'deleteprohibited': '禁止删除',
    'pendingdeletion': '待删除',
    'scheduledfordeletion': '计划删除',
    
    // 更新相关
    'updateprohibited': '禁止更新',
    'pendingupdates': '待更新',
    
    // 续费相关
    'renewprohibited': '禁止续费',
    'autorenew': '自动续费',
    'noautorenew': '未设置自动续费',
    
    // 验证和锁定状态
    'registrantverificationlocked': '注册人验证锁定',
    'verificationrequired': '需要验证',
    'verificationpending': '验证待处理',
    'emailverificationpending': '邮箱验证待处理',
    'identityverificationpending': '身份验证待处理',
    
    // DNSSEC 相关
    'adddsrecordprohibited': '禁止添加DS记录',
    'removedsrecordprohibited': '禁止移除DS记录',
    
    // 其他特殊状态
    'internalhold': '内部暂停',
    'disputehold': '争议暂停',
    'legalhold': '法律暂停',
    'fraudhold': '欺诈暂停',
    'abusehold': '滥用暂停',
    'privacyprotect': '隐私保护',
    'proxy': '代理注册',
    'quarantine': '隔离期',
    'blocked': '已屏蔽',
    'frozen': '已冻结',
  };
  
  // 如果找到精确匹配，返回映射值
  if (statusMap[cleanStatus]) {
    return statusMap[cleanStatus];
  }
  
  // 如果没有精确匹配，尝试部分匹配
  for (const [key, value] of Object.entries(statusMap)) {
    if (cleanStatus.includes(key) || key.includes(cleanStatus)) {
      return value;
    }
  }
  
  // 如果都没匹配，返回原始状态但格式化一下
  return status.replace(/\s*https?:\/\/[^\s]+/gi, '').trim();
};

export const WhoisQuery = ({ domain, displayDomain: propDisplayDomain }: WhoisQueryProps) => {
  const { whois: whoisData, isLoading } = useWhois(domain);
  const [expandedRegistrar, setExpandedRegistrar] = useState(false);
  
  // 使用传入的displayDomain或使用toUnicode转换
  const displayDomain = propDisplayDomain || (isIDN(domain) ? toUnicode(domain) : domain);

  // 获取域名状态 - 增强判断逻辑
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
        const expDate = new Date(whoisData.expirationDate);
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
      // 如果有状态信息，显示为已注册
      if (whoisData.status && whoisData.status.length > 0) {
        return { label: "已注册", variant: "default" };
      }
    }
    
    // 6. 如果有注册商信息，大概率是已注册
    if (whoisData.registrar) {
      return { label: "已注册", variant: "default" };
    }
    
    // 7. 都没有，返回未知
    return { label: "状态未知", variant: "outline" };
  };

  // 计算时间差 - 使用精确的日期计算
  const getTimeDifference = (startDate: string, endDate?: Date): string => {
    const start = new Date(startDate);
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
    const expDate = new Date(expirationDate);
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

  // 格式化日期为 年/月/日 时:分:秒
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateString;
    }
  };

  // 判断注册商名称是否过长
  const isRegistrarLong = (registrar: string): boolean => {
    return registrar.length > 30;
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : whoisData ? (
        <div className="space-y-4 sm:space-y-6">
          {/* 1. 域名信息 */}
          {(whoisData.domainName || whoisData.dnssec) && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  {(whoisData.domainName || domain) && (
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">域名:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground break-all">
                        {displayDomain}
                      </span>
                      <Badge 
                        variant={getDomainStatus().variant} 
                        className="text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 flex-shrink-0"
                      >
                        {getDomainStatus().label}
                      </Badge>
                    </div>
                  )}
                  {whoisData.dnssec && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground">DNSSEC:</span>
                      <span className="text-xs sm:text-sm text-foreground">{whoisData.dnssec}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 2. 注册商信息 */}
          {whoisData.registrar && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">注册商:</span>
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
                  {whoisData.registrarIanaId && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">IANA ID:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{whoisData.registrarIanaId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 3. 时间信息 */}
          {whoisData.creationDate && (
            <div className="relative p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md pb-8 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">注册时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.creationDate)}</span>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-muted-foreground">
                已注册 {getRegisteredTime(whoisData.creationDate)}
              </p>
            </div>
          )}

          {whoisData.expirationDate && (
            <div className="relative p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md pb-8 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">过期时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.expirationDate)}</span>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-muted-foreground">
                距离过期 {getTimeUntilExpiry(whoisData.expirationDate)}
              </p>
            </div>
          )}

          {whoisData.updatedDate && (
            <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">更新时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.updatedDate)}</span>
              </div>
            </div>
          )}

          {/* 4. 注册人信息 */}
          {(whoisData.registrantOrg || whoisData.registrantCountry) && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  {whoisData.registrantOrg && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">注册主体:</span>
                      <span className={`font-bold text-sm sm:text-base break-all ${isPrivacyRedacted(whoisData.registrantOrg) ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                        {formatDisplayValue(whoisData.registrantOrg)}
                      </span>
                    </div>
                  )}
                  {whoisData.registrantCountry && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">国家/地区:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{getCountryName(whoisData.registrantCountry)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 5. 域名NS */}
          {whoisData.nameServers && whoisData.nameServers.length > 0 && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Server className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">名称服务器:</span>
                  <div className="flex-1 min-w-0 space-y-1">
                    {whoisData.nameServers.map((ns, index) => (
                      <p key={index} className="font-mono text-sm sm:text-base font-bold text-foreground break-all">{ns}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* 6. 域名状态 */}
          {whoisData.status && whoisData.status.length > 0 && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">域名状态:</span>
                  <div className="flex-1 min-w-0 flex flex-wrap gap-1.5 sm:gap-2.5">
                    {whoisData.status.map((status, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-4 py-1 sm:py-1.5 bg-primary text-primary-foreground text-xs font-mono rounded-lg shadow-md"
                      >
                        {translateDomainStatus(status)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
