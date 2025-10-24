import { useState } from "react";

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
      
      // API返回的数据在data.data中，增强容错处理
      const apiData = data.data || data;
      
      // 增强价格解析的可靠性，支持多种数据格式
      const parsePrice = (value: any): number | undefined => {
        if (value === null || value === undefined || value === '') return undefined;
        const parsed = parseFloat(String(value));
        return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
      };
      
      // 适配API返回的数据结构，增强字段匹配
      const priceInfo: DomainPrice = {
        domain,
        isPremium: apiData.premium === "true" || apiData.premium === true || apiData.premium === 1 || apiData.isPremium === true,
        registrationPrice: parsePrice(apiData.register || apiData.price || apiData.registrationPrice || apiData.registerPrice),
        renewalPrice: parsePrice(apiData.renew || apiData.renewPrice || apiData.renewalPrice),
        transferPrice: parsePrice(apiData.transfer || apiData.transferPrice),
        currency: "CNY",
        exchangeRate: 1,
      };
      
      setPriceData(priceInfo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "查询失败";
      setError(errorMessage);
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
