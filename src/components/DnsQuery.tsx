import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Server, Globe, Clock } from "lucide-react";

interface DnsRecord {
  type: string;
  value: string;
  ttl?: number;
  location?: string; // 位置信息
  provider?: string; // 服务商信息
}

interface DnsQueryProps {
  domain: string;
}

export const DnsQuery = ({ domain }: DnsQueryProps) => {
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 查询IP的地理位置和服务商信息
  const fetchIpInfo = async (ip: string): Promise<{ location?: string; provider?: string }> => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!response.ok) return {};
      const data = await response.json();
      
      const locationParts = [data.city, data.region, data.country_name].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(', ') : undefined;
      const provider = data.org || data.asn || undefined;
      
      return { location, provider };
    } catch (err) {
      console.error('IP信息查询失败:', err);
      return {};
    }
  };

  const queryDns = async () => {
    setIsLoading(true);
    try {
      const normalizedDomain = domain.trim().toLowerCase();
      if (!normalizedDomain) {
        setRecords([]);
        setIsLoading(false);
        return;
      }

      // 使用Google DNS over HTTPS API，增强安全性和准确性
      const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA'];
      const allRecords: DnsRecord[] = [];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // 并行查询所有记录类型
      const queries = recordTypes.map(async (type) => {
        try {
          const response = await fetch(
            `https://dns.google/resolve?name=${encodeURIComponent(normalizedDomain)}&type=${type}&do=1`,
            { 
              signal: controller.signal,
              headers: {
                'Accept': 'application/dns-json'
              }
            }
          );
          
          if (!response.ok) return;
          
          const data = await response.json();

          if (data.Answer) {
            for (const answer of data.Answer) {
              const record: DnsRecord = {
                type: type,
                value: answer.data,
                ttl: answer.TTL,
              };

              // 如果是A记录或AAAA记录，查询IP信息
              if ((type === 'A' || type === 'AAAA') && answer.data) {
                const ipInfo = await fetchIpInfo(answer.data);
                record.location = ipInfo.location;
                record.provider = ipInfo.provider;
              }

              allRecords.push(record);
            }
          }
        } catch (err) {
          console.error(`Error querying ${type}:`, err);
        }
      });

      await Promise.allSettled(queries);
      clearTimeout(timeoutId);

      setRecords(allRecords);
    } catch (error) {
      console.error("DNS查询错误:", error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 自动查询
  useEffect(() => {
    queryDns();
  }, [domain]);

  const getRecordColor = (type: string) => {
    const colors: Record<string, string> = {
      A: "bg-primary/20 text-primary border-primary/50",
      AAAA: "bg-secondary/20 text-secondary border-secondary/50",
      MX: "bg-accent/20 text-accent border-accent/50",
      TXT: "bg-muted text-muted-foreground border-muted-foreground/50",
      NS: "bg-primary/30 text-primary border-primary/50",
      CNAME: "bg-secondary/30 text-secondary border-secondary/50",
    };
    return colors[type] || "bg-muted text-muted-foreground border-muted-foreground/50";
  };

  return (
    <Card className="p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Server className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">DNS记录</h2>
        </div>
        {records.length > 0 && !isLoading && (
          <Badge variant="secondary" className="text-sm px-4 py-1.5">
            共 {records.length} 条记录
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-md transition-all hover:shadow-lg hover:border-primary/40"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <Badge className="min-w-[75px] justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-bold shadow-md">
                    {record.type}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium">解析地址:</p>
                    <p className="font-mono text-sm break-all text-foreground leading-relaxed">{record.value}</p>
                  </div>
                  
                  {record.location && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        位置/服务商:
                      </p>
                      <p className="text-sm text-foreground">{record.location}</p>
                      {record.provider && (
                        <p className="text-sm text-muted-foreground mt-0.5">{record.provider}</p>
                      )}
                    </div>
                  )}
                  
                  {record.ttl && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>TTL: {record.ttl}秒</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>暂无DNS记录</p>
        </div>
      )}
    </Card>
  );
};
