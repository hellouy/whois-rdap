import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Lock, Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useSslCertificate } from "@/hooks/use-ssl-certificate";

interface SslCertQueryProps {
  domain: string;
}

export const SslCertQuery = ({ domain }: SslCertQueryProps) => {
  const { certData, isLoading } = useSslCertificate(domain);

  // 计算证书剩余天数
  const getDaysRemaining = (validTo: string): number => {
    const expiryDate = new Date(validTo);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Shield className="h-7 w-7 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">SSL证书</h2>
        </div>
        {certData && !isLoading && (
          <Badge 
            variant={certData.isValid ? "default" : "destructive"} 
            className="text-sm px-4 py-1.5 shadow-md"
          >
            {certData.isValid ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                有效证书
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                证书异常
              </span>
            )}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : certData ? (
        <div className="space-y-4">
          {certData.isValid && certData.validTo && (
            <div className="p-5 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/30 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-sm font-bold text-foreground">证书有效期</p>
              </div>
              <div className="pl-8">
                <p className="text-2xl font-bold text-primary mb-1">
                  {getDaysRemaining(certData.validTo)} 天
                </p>
                <p className="text-xs text-muted-foreground">
                  距离过期还有 {getDaysRemaining(certData.validTo)} 天
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <Shield className="h-6 w-6 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground mb-2">颁发者</p>
              <p className="font-mono text-sm text-foreground leading-relaxed break-all">{certData.issuer}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">生效日期</p>
                </div>
                <p className="font-mono text-sm text-foreground">{certData.validFrom}</p>
              </div>
            </div>

            <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm font-bold text-foreground">过期日期</p>
                </div>
                <p className="font-mono text-sm text-foreground">{certData.validTo}</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <p className="text-sm font-bold text-foreground mb-3">主题</p>
            <p className="font-mono text-sm text-foreground leading-relaxed break-all">{certData.subject}</p>
          </div>

          <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <p className="text-sm font-bold text-foreground mb-3">算法</p>
            <p className="font-mono text-sm text-foreground">{certData.algorithm}</p>
          </div>

          <div className="p-5 bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <p className="text-sm font-bold text-foreground mb-3">指纹</p>
            <p className="font-mono text-xs text-foreground break-all leading-relaxed">{certData.fingerprint}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>暂无证书信息</p>
        </div>
      )}
    </Card>
  );
};
