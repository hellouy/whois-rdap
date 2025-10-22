import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Server, Globe, Clock } from "lucide-react";

interface DnsRecord {
  type: string;
  value: string;
  ttl?: number;
}

interface DnsQueryProps {
  domain: string;
}

export const DnsQuery = ({ domain }: DnsQueryProps) => {
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
            data.Answer.forEach((answer: any) => {
              allRecords.push({
                type: type,
                value: answer.data,
                ttl: answer.TTL,
              });
            });
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
              className="flex items-start gap-5 p-6 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-md transition-all hover:shadow-lg hover:border-primary/40"
            >
              <div className="flex-shrink-0">
                <Badge className="min-w-[75px] justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-bold shadow-md">
                  {record.type}
                </Badge>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-mono text-sm break-all text-foreground mb-2 leading-relaxed">{record.value}</p>
                {record.ttl && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span>TTL: {record.ttl}s</span>
                  </div>
                )}
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
