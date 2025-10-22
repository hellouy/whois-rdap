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
      
      // 假设API返回的数据结构，根据实际API调整
      const priceInfo: DomainPrice = {
        domain,
        isPremium: data.isPremium || false,
        registrationPrice: data.registrationPrice,
        renewalPrice: data.renewalPrice,
        transferPrice: data.transferPrice,
        currency: data.currency || "USD",
        exchangeRate: data.exchangeRate || 7.2, // 默认汇率
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

  const convertToCNY = (price?: number): string => {
    if (!price || !priceData?.exchangeRate) return "N/A";
    return `¥${(price * priceData.exchangeRate).toFixed(2)}`;
  };

  return {
    priceData,
    isLoading,
    error,
    fetchPrice,
    convertToCNY,
  };
};
