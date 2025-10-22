import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface DomainPrice {
  domain: string;
  isPremium: boolean;
  registrationPrice?: number;
  renewalPrice?: number;
  transferPrice?: number;
  currency: string;
  exchangeRate?: number;
}

export const useDomainPrice = () => {
  const [priceData, setPriceData] = useState<DomainPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.tian.hu/whois.php?domain=${encodeURIComponent(domain)}&action=checkPrice`
      );
      
      if (!response.ok) {
        throw new Error("获取价格信息失败");
      }
      
      const data = await response.json();
      
      // 适配API返回的数据结构
      const priceInfo: DomainPrice = {
        domain,
        isPremium: data.premium === true || data.isPremium === true || data.premium === 1,
        registrationPrice: parseFloat(data.price || data.registrationPrice || data.register) || undefined,
        renewalPrice: parseFloat(data.renewPrice || data.renewalPrice || data.renew) || undefined,
        transferPrice: parseFloat(data.transferPrice || data.transfer) || undefined,
        currency: data.currency || "CNY",
        exchangeRate: data.currency === "CNY" ? 1 : 7.2,
      };
      
      setPriceData(priceInfo);
      toast({
        title: "价格查询成功",
        description: `已获取 ${domain} 的价格信息`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "查询失败";
      setError(errorMessage);
      toast({
        title: "查询失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price?: number): string => {
    if (!price) return "暂无";
    if (priceData?.currency === "CNY") {
      return `${price.toFixed(0)}元`;
    }
    const cnyPrice = price * (priceData?.exchangeRate || 7.2);
    return `${cnyPrice.toFixed(0)}元`;
  };

  return {
    priceData,
    isLoading,
    error,
    fetchPrice,
    formatPrice,
  };
};
