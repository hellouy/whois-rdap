import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Network, MapPin, Globe2, AlertTriangle } from "lucide-react";
import { toASCII, toUnicode, isIDN } from "@/utils/tld-servers";

interface DnsMapProps {
  domain: string;
}

interface DnsNode {
  name: string;
  type: string;
  ip?: string;
  location?: string;
}

export const DnsMap = ({ domain }: DnsMapProps) => {
  const [nodes, setNodes] = useState<DnsNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayDomain, setDisplayDomain] = useState<string>("");

  const queryDnsMap = async () => {
    setIsLoading(true);
    setError(null);
    const newNodes: DnsNode[] = [];
    
    try {
      const normalizedDomain = domain.trim().toLowerCase();
      if (!normalizedDomain) {
        setNodes([]);
        setIsLoading(false);
        return;
      }

      // IDN域名转换为Punycode
      const asciiDomain = toASCII(normalizedDomain);
      const unicodeDomain = isIDN(normalizedDomain) ? toUnicode(asciiDomain) : normalizedDomain;
      setDisplayDomain(unicodeDomain !== asciiDomain ? `${unicodeDomain} (${asciiDomain})` : normalizedDomain);

      // 查询多种DNS记录类型，增强准确性
      const types = ['A', 'AAAA', 'MX', 'NS', 'CNAME'];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      let hasServerError = false;
      let serverErrorMsg = "";
      
      // 并行查询所有记录类型
      const queries = types.map(async (type) => {
        try {
          const response = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(asciiDomain)}&type=${type}&do=1`,
            { 
              signal: controller.signal,
              headers: {
                'Accept': 'application/dns-json'
              }
            }
          );
          
          if (!response.ok) return;
          
          const data = await response.json();

          // 检查DNS服务器错误
          if (data.Status === 2) {
            hasServerError = true;
            if (data.Comment) {
              serverErrorMsg = data.Comment;
            }
            return;
          }
          
          if (data.Answer) {
            // 批量处理以减少API调用
            const ipRecords = data.Answer.filter((record: any) => 
              (type === 'A' || type === 'AAAA') && 
              record.data && 
              !record.data.includes('@')
            );
            
            // 为A和AAAA记录获取位置信息
            for (const record of ipRecords) {
              // 将Punycode域名转回Unicode显示
              let displayName = record.name;
              if (displayName && displayName.includes('xn--')) {
                try {
                  displayName = toUnicode(displayName.replace(/\.$/, ''));
                } catch {}
              }

              const exists = newNodes.some(
                node => node.name === displayName && 
                        node.type === type && 
                        node.ip === record.data
              );
              
              if (!exists) {
                const location = await fetchIpLocation(record.data);
                newNodes.push({
                  name: displayName,
                  type: type,
                  ip: record.data,
                  location: location,
                });
              }
            }
            
            // 处理非IP记录
            data.Answer.forEach((record: any) => {
              if (type !== 'A' && type !== 'AAAA') {
                // 将Punycode域名转回Unicode显示
                let displayName = record.name;
                let displayIp = record.data;
                if (displayName && displayName.includes('xn--')) {
                  try {
                    displayName = toUnicode(displayName.replace(/\.$/, ''));
                  } catch {}
                }
                if (displayIp && typeof displayIp === 'string' && displayIp.includes('xn--')) {
                  try {
                    displayIp = toUnicode(displayIp.replace(/\.$/, ''));
                  } catch {}
                }

                const exists = newNodes.some(
                  node => node.name === displayName && 
                          node.type === type && 
                          node.ip === displayIp
                );
                
                if (!exists) {
                  newNodes.push({
                    name: displayName,
                    type: type,
                    ip: displayIp,
                    location: type === 'MX' || type === 'CNAME' ? '邮件/别名记录' : undefined,
                  });
                }
              }
            });
          }
        } catch (err) {
          console.error(`Error querying ${type} records:`, err);
        }
      });
      
      await Promise.allSettled(queries);
      clearTimeout(timeoutId);

      if (newNodes.length === 0 && hasServerError) {
        setError(`DNS服务器未响应: ${serverErrorMsg || '域名服务器可能无法访问'}`);
      }
      
      setNodes(newNodes);
    } catch (error) {
      console.error("DNS映射查询错误:", error);
      setError("DNS映射查询失败");
      setNodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 使用API查询IP详细信息，增强准确性
  const fetchIpLocation = async (ip: string): Promise<string> => {
    if (!ip || ip.includes('@')) return "未知";
    
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!response.ok) return getLocationFallback(ip);
      
      const data = await response.json();
      const locationParts = [data.city, data.region, data.country_name].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(', ') : undefined;
      const provider = data.org || data.asn || undefined;
      
      if (location && provider) {
        return `${location} - ${provider}`;
      } else if (location) {
        return location;
      } else if (provider) {
        return provider;
      }
    } catch (err) {
      console.error('IP位置查询失败:', err);
    }
    
    return getLocationFallback(ip);
  };

  // 备用的本地IP识别
  const getLocationFallback = (ip: string): string => {
    // IPv6 识别
    if (ip.includes(':')) {
      if (ip.startsWith('2001:4860')) return "Google CDN (IPv6)";
      if (ip.startsWith('2606:4700')) return "Cloudflare CDN (IPv6)";
      if (ip.startsWith('2400:')) return "亚太地区 (IPv6)";
      if (ip.startsWith('2001:67c')) return "欧洲地区 (IPv6)";
      if (ip.startsWith('2a00:')) return "欧洲地区 (IPv6)";
      return "IPv6 全球网络";
    }
    
    // IPv4 判断
    const parts = ip.split('.');
    if (parts.length !== 4) return "未知";
    
    const first = parseInt(parts[0]);
    const second = parseInt(parts[1]);
    
    // 常见CDN和云服务商
    if (first === 104 && (second === 16 || second === 17 || second === 18)) return "Cloudflare CDN";
    if (first === 172 && second >= 64 && second <= 127) return "Cloudflare CDN";
    if (first === 108 && second === 162) return "Google Cloud";
    if (first === 34 || first === 35) return "Google Cloud";
    if (first === 52 || first === 54) return "Amazon AWS";
    if (first === 13 || first === 18) return "Amazon AWS";
    if (first === 40 || first === 52) return "Microsoft Azure";
    if (first === 170 && second === 33) return "阿里云 CDN";
    if (first === 47 && second === 89) return "阿里云";
    if (first === 120 || first === 121) return "阿里云";
    if (first === 203 && second === 107) return "腾讯云";
    if (first === 182 && second === 254) return "腾讯云";
    if (first === 43 && second === 240) return "百度云";
    if (first === 180 && second === 76) return "百度云";
    
    // 地区判断
    if (first >= 1 && first <= 2) return "亚太 APNIC";
    if (first >= 58 && first <= 61) return "亚太 APNIC";
    if (first >= 106 && first <= 125) return "中国网络";
    if (first >= 175 && first <= 180) return "中国网络";
    if (first >= 183 && first <= 223) return "亚太地区";
    if (first >= 128 && first <= 191) return "北美/欧洲";
    if (first >= 192 && first <= 223) return "全球网络";
    
    return "全球网络";
  };

  useEffect(() => {
    queryDnsMap();
  }, [domain]);

  const getNodeColor = (type: string) => {
    const colors: Record<string, string> = {
      "主域名": "border-primary bg-primary/20",
      "CNAME": "border-secondary bg-secondary/20",
      "MX": "border-accent bg-accent/20",
      "NS": "border-primary/70 bg-primary/10",
    };
    return colors[type] || "border-muted bg-muted/20";
  };

  return (
    <Card className="p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Network className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">DNS映射</h2>
        </div>
        {nodes.length > 0 && !isLoading && (
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            共 {nodes.length} 个节点
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : nodes.length > 0 ? (
        <div className="space-y-4">
          {displayDomain && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border mb-4">
              <p className="text-sm text-muted-foreground">
                查询域名: <span className="font-mono text-foreground">{displayDomain}</span>
              </p>
            </div>
          )}
          {nodes.map((node, index) => (
            <div
              key={index}
              className="flex items-start gap-5 p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-md transition-all hover:shadow-lg hover:border-primary/40"
            >
              <div className="flex-shrink-0">
                <Badge className="min-w-[75px] justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-bold shadow-md">
                  {node.type}
                </Badge>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="mb-3">
                  <span className="font-mono text-sm font-semibold text-foreground break-all leading-relaxed">
                    {node.name}
                  </span>
                </div>
                <div className="space-y-2">
                  {node.ip && (
                    <div className="flex items-start gap-2">
                      <Globe2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">解析地址</p>
                        <p className="font-mono text-sm text-foreground break-all">{node.ip}</p>
                      </div>
                    </div>
                  )}
                  {node.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">位置/服务商</p>
                        <p className="font-medium text-sm text-foreground">{node.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-yellow-500 opacity-70" />
          <p className="text-muted-foreground mb-2">DNS映射查询异常</p>
          <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">{error}</p>
          {displayDomain && (
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono">{displayDomain}</p>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>暂无DNS映射</p>
          {displayDomain && (
            <p className="text-xs text-muted-foreground/50 mt-2 font-mono">{displayDomain}</p>
          )}
        </div>
      )}
    </Card>
  );
};
