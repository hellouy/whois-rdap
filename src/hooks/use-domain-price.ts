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
      
      // API返回的数据在data.data中
      const apiData = data.data || data;
      
      // 适配API返回的数据结构
      const priceInfo: DomainPrice = {
        domain,
        isPremium: apiData.premium === "true" || apiData.premium === true || apiData.premium === 1,
        registrationPrice: parseFloat(apiData.register || apiData.price || apiData.registrationPrice) || undefined,
        renewalPrice: parseFloat(apiData.renew || apiData.renewPrice || apiData.renewalPrice) || undefined,
        transferPrice: parseFloat(apiData.transfer || apiData.transferPrice) || undefined,
        currency: "CNY",
        exchangeRate: 1,
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
