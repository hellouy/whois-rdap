import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Lock, Calendar, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { useSslCertificate } from "@/hooks/use-ssl-certificate";
import { toUnicode, isIDN } from "@/utils/tld-servers";

interface SslCertQueryProps {
  domain: string;
  displayDomain?: string;
  onLoadComplete?: () => void;
}

export const SslCertQuery = ({ domain, displayDomain: propDisplayDomain, onLoadComplete }: SslCertQueryProps) => {
  const { certData, isLoading } = useSslCertificate(domain);
  const displayDomain = propDisplayDomain || (isIDN(domain) ? toUnicode(domain) : domain);

  // 加载完成时调用回调
  useEffect(() => {
    if (!isLoading && onLoadComplete) {
      onLoadComplete();
    }
  }, [isLoading, onLoadComplete]);

  const getDaysRemaining = (validTo: string): number => {
    const expiryDate = new Date(validTo);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">SSL证书</h2>
        </div>
        {certData && !isLoading && (
          <Badge 
            variant={certData.isValid ? "default" : "destructive"} 
            className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 shadow-md self-start sm:self-auto"
          >
            {certData.isValid ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                有效证书
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
        <div className="space-y-3 sm:space-y-4">
          {certData.isValid && certData.validTo && (
            <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">证书有效期:</span>
                <span className="font-bold text-sm sm:text-base text-foreground">
                  {getDaysRemaining(certData.validTo)} 天
                </span>
              </div>
            </div>
          )}

          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">颁发者:</span>
              <span className="font-mono font-bold text-sm sm:text-base text-foreground leading-relaxed break-all">{certData.issuer}</span>
            </div>
          </div>

          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">生效日期:</span>
              <span className="font-mono font-bold text-sm sm:text-base text-foreground">{certData.validFrom}</span>
            </div>
          </div>

          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">过期日期:</span>
              <span className="font-mono font-bold text-sm sm:text-base text-foreground">{certData.validTo}</span>
            </div>
          </div>

          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">证书域名:</span>
              <span className="font-mono font-bold text-sm sm:text-base text-foreground leading-relaxed break-all">{certData.subject || '未知'}</span>
            </div>
          </div>

          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">签名算法:</span>
              <span className="font-mono font-bold text-sm sm:text-base text-foreground leading-relaxed">{certData.algorithm || '未知'}</span>
            </div>
          </div>

          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-start gap-2 sm:gap-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">证书指纹:</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-foreground break-all leading-relaxed">{certData.fingerprint}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm sm:text-base">暂无证书信息</p>
        </div>
      )}
    </Card>
  );
};