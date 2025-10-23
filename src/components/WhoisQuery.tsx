import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Calendar, User, Building, Server, CheckCircle2, DollarSign } from "lucide-react";
import { useWhois } from "@/hooks/use-whois";
import { useDomainPrice } from "@/hooks/use-domain-price";

interface WhoisQueryProps {
  domain: string;
}

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

export const WhoisQuery = ({ domain }: WhoisQueryProps) => {
  const { whois: whoisData, isLoading } = useWhois(domain);
  const { priceData, isLoading: isPriceLoading, error, fetchPrice, formatPrice } = useDomainPrice();

  // 获取域名状态 - 增强判断逻辑
  const getDomainStatus = (): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    if (!whoisData) return { label: "查询中", variant: "outline" };
    
    // 1. 最高优先级：明确的未注册状态
    if (whoisData.registered === false) {
      return { label: "未注册", variant: "outline" };
    }
    
    // 2. 检查域名状态字符串
    const statusString = whoisData.status?.join(' ').toLowerCase() || '';
    
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
    
    // 2.4 暂停状态（各种 hold）
    if (statusString.includes('hold')) {
      if (statusString.includes('registrar')) {
        return { label: "注册商暂停", variant: "destructive" };
      }
      if (statusString.includes('registry')) {
        return { label: "注册局暂停", variant: "destructive" };
      }
      return { label: "域名暂停", variant: "destructive" };
    }
    
    // 2.5 转移中状态
    if (statusString.includes('pendingtransfer') || statusString.includes('transfer')) {
      if (statusString.includes('pending') || statusString.includes('started')) {
        return { label: "转移中", variant: "secondary" };
      }
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
    
    // 4. 有创建日期或明确注册状态，说明已正常注册
    if (whoisData.creationDate || whoisData.registered === true) {
      // 检查是否有 "ok" 状态
      if (statusString.includes('ok') || statusString === '') {
        return { label: "正常", variant: "default" };
      }
      return { label: "已注册", variant: "default" };
    }
    
    // 5. 如果有注册商信息，大概率是已注册
    if (whoisData.registrar) {
      return { label: "已注册", variant: "default" };
    }
    
    // 6. 都没有，返回未知
    return { label: "状态未知", variant: "outline" };
  };

  // 计算域名年龄
  const getDomainAge = (creationDate: string): string => {
    const created = new Date(creationDate);
    const today = new Date();
    const diffTime = today.getTime() - created.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} 年 ${months} 个月`;
    }
    return `${months} 个月`;
  };

  return (
    <Card className="p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <Button
          onClick={() => fetchPrice(domain)}
          disabled={isPriceLoading}
          size="lg"
          className="gap-2"
        >
          {isPriceLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              查询中...
            </>
          ) : error ? (
            <>
              <DollarSign className="h-5 w-5" />
              重新查询价格
            </>
          ) : (
            <>
              <DollarSign className="h-5 w-5" />
              查询域名价格
            </>
          )}
        </Button>
        
        {priceData && (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={priceData.isPremium ? "destructive" : "default"} className="text-sm px-4 py-2">
              {priceData.isPremium ? "溢价域名" : "普通域名"}
            </Badge>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">注册:</span>
              <span className="font-bold text-foreground">{formatPrice(priceData.registrationPrice)}</span>
              <span className="text-muted-foreground">续费:</span>
              <span className="font-bold text-foreground">{formatPrice(priceData.renewalPrice)}</span>
              <span className="text-muted-foreground">转移:</span>
              <span className="font-bold text-foreground">{formatPrice(priceData.transferPrice)}</span>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : whoisData ? (
        <div className="space-y-6">
          {/* 1. 域名信息 */}
          {(whoisData.domainName || whoisData.dnssec) && (
              <div className="relative flex items-start gap-4 p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <FileText className="h-6 w-6 text-primary mt-0.5" />
                <div className="flex-1 min-w-0 pr-20">
                  {whoisData.domainName && (
                    <p className="font-bold text-foreground mb-1 break-all">域名：{whoisData.domainName}</p>
                  )}
                  {whoisData.dnssec && (
                    <p className="text-sm text-muted-foreground mt-2">DNSSEC：{whoisData.dnssec}</p>
                  )}
                </div>
                <Badge 
                  variant={getDomainStatus().variant} 
                  className="absolute top-3 right-3 text-xs font-semibold px-3 py-1"
                >
                  {getDomainStatus().label}
                </Badge>
              </div>
            )}

          {/* 2. 注册商信息 */}
          {whoisData.registrar && (
              <div className="flex items-start gap-4 p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <Building className="h-6 w-6 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground mb-1 break-all">注册商：{whoisData.registrar}</p>
                  <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {whoisData.registrarIanaId && <p>IANA ID：{whoisData.registrarIanaId}</p>}
                    {(whoisData.registrarAbuseEmail || whoisData.registrarAbusePhone) && (
                      <p className="break-all">
                        Abuse：
                        {whoisData.registrarAbuseEmail && <span className="ml-1">{whoisData.registrarAbuseEmail}</span>}
                        {whoisData.registrarAbusePhone && <span className="ml-2">{whoisData.registrarAbusePhone}</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* 3. 时间信息 */}
          <div className="grid sm:grid-cols-3 gap-4">
            {whoisData.creationDate && (
              <div className="p-5 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/30 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">注册时间:</p>
                  <p className="font-mono text-sm text-foreground">{whoisData.creationDate}</p>
                </div>
                <p className="text-xs text-muted-foreground ml-7">
                  {getDomainAge(whoisData.creationDate)}
                </p>
              </div>
            )}

            {whoisData.expirationDate && (
              <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">过期时间:</p>
                  <p className="font-mono text-sm text-foreground">{whoisData.expirationDate}</p>
                </div>
              </div>
            )}

            {whoisData.updatedDate && (
              <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">更新时间:</p>
                  <p className="font-mono text-sm text-foreground">{whoisData.updatedDate}</p>
                </div>
              </div>
            )}
          </div>

          {/* 4. 注册人信息 */}
          {(whoisData.registrantOrg || whoisData.registrantCountry) && (
              <div className="flex items-start gap-4 p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <User className="h-6 w-6 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  {whoisData.registrantOrg && (
                    <p className="font-bold text-foreground mb-1 break-all">注册主体：{whoisData.registrantOrg}</p>
                  )}
                  {whoisData.registrantCountry && (
                    <p className="text-sm text-muted-foreground mt-2">国家/地区：{whoisData.registrantCountry}</p>
                  )}
                </div>
              </div>
            )}

          {/* 5. 域名NS */}
          {whoisData.nameServers && whoisData.nameServers.length > 0 && (
              <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">名称服务器</p>
                </div>
                <div className="space-y-2.5">
                  {whoisData.nameServers.map((ns, index) => (
                    <p key={index} className="font-mono text-sm text-muted-foreground break-all">{ns}</p>
                  ))}
                </div>
              </div>
            )}

          {/* 6. TLD权威服务器 */}
          {whoisData.tldServers && whoisData.tldServers.length > 0 && (
              <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">TLD权威服务器 (IANA)</p>
                </div>
                <div className="space-y-2.5">
                  {whoisData.tldServers.map((server, index) => (
                    <p key={index} className="font-mono text-sm text-muted-foreground break-all">{server}</p>
                  ))}
                </div>
              </div>
            )}

          {/* 7. 域名状态 */}
          {whoisData.status && whoisData.status.length > 0 && (
              <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="h-5 w-5 p-0 bg-transparent hover:bg-transparent">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </Badge>
                  <p className="text-sm font-bold text-foreground">域名状态</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {whoisData.status.map((status, index) => (
                    <span
                      key={index}
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-mono rounded-lg shadow-md"
                    >
                      {translateDomainStatus(status)}
                    </span>
                  ))}
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
