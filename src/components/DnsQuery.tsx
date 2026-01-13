import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Server, Globe, Clock, AlertTriangle } from "lucide-react";
import { toASCII, toUnicode, isIDN } from "@/utils/tld-servers";

interface DnsRecord {
  type: string;
  value: string;
  ttl?: number;
  location?: string;
  provider?: string;
}

interface DnsQueryProps {
  domain: string;
  displayDomain?: string;
}

export const DnsQuery = ({ domain, displayDomain: propDisplayDomain }: DnsQueryProps) => {
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayDomain = propDisplayDomain || (isIDN(domain) ? toUnicode(domain) : domain);

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
    setError(null);
    try {
      const normalizedDomain = domain.trim().toLowerCase();
      if (!normalizedDomain) {
        setRecords([]);
        setIsLoading(false);
        return;
      }

      const asciiDomain = toASCII(normalizedDomain);
      const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA'];
      const allRecords: DnsRecord[] = [];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      let hasServerError = false;
      let serverErrorMsg = "";

      const queries = recordTypes.map(async (type) => {
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

          if (data.Status === 2) {
            hasServerError = true;
            if (data.Comment) {
              serverErrorMsg = data.Comment;
            }
            return;
          }

          if (data.Answer) {
            for (const answer of data.Answer) {
              let displayValue = answer.data;
              if (displayValue && typeof displayValue === 'string' && displayValue.includes('xn--')) {
                try {
                  displayValue = toUnicode(displayValue);
                } catch {}
              }

              const record: DnsRecord = {
                type: type,
                value: displayValue,
                ttl: answer.TTL,
              };

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

      if (allRecords.length === 0 && hasServerError) {
        setError(`DNS服务器未响应: ${serverErrorMsg || '域名服务器可能无法访问'}`);
      }

      setRecords(allRecords);
    } catch (error) {
      console.error("DNS查询错误:", error);
      setError("DNS查询失败");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    <Card className="p-4 sm:p-6 md:p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Server className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">DNS记录</h2>
        </div>
        {records.length > 0 && !isLoading && (
          <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 self-start sm:self-auto">
            共 {records.length} 条记录
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {displayDomain && (
            <div className="p-2 sm:p-3 bg-muted/50 rounded-lg border border-border mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">查询域名:</span>
                <span className="font-mono font-bold text-sm sm:text-base text-foreground break-all">{displayDomain}</span>
              </div>
            </div>
          )}
          {records.map((record, index) => (
            <div
              key={index}
              className="p-3 sm:p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-md transition-all hover:shadow-lg hover:border-primary/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                <div className="flex-shrink-0">
                  <Badge className="min-w-[60px] sm:min-w-[75px] justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md">
                    {record.type}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">解析地址:</span>
                    <span className="font-mono font-bold text-sm sm:text-base text-foreground break-all leading-relaxed">{record.value}</span>
                  </div>
                  
                  {record.location && (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">位置:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{record.location}</span>
                    </div>
                  )}
                  
                  {record.provider && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Server className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">服务商:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground break-all">{record.provider}</span>
                    </div>
                  )}
                  
                  {record.ttl && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">TTL:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{record.ttl}秒</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 sm:py-12">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-yellow-500 opacity-70" />
          <p className="text-sm sm:text-base text-muted-foreground mb-2">DNS查询异常</p>
          <p className="text-xs sm:text-sm text-muted-foreground/70 max-w-md mx-auto px-4">{error}</p>
          {displayDomain && (
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono break-all px-4">{displayDomain}</p>
          )}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <Globe className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm sm:text-base">暂无DNS记录</p>
          {displayDomain && (
            <p className="text-xs text-muted-foreground/50 mt-2 font-mono break-all px-4">{displayDomain}</p>
          )}
        </div>
      )}
    </Card>
  );
};