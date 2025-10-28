import { useState } from "react";

export interface DomainPrice {
  domain: string;
  isPremium: boolean;
  registrationPrice?: number;
  renewalPrice?: number;
  transferPrice?: number;
  currency: string;
  exchangeRate?: number;
  meaning?: string; // 域名含义
}

export const useDomainPrice = () => {
  const [priceData, setPriceData] = useState<DomainPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用新的API v2
      const response = await fetch(
        `https://api-v2.tian.hu/domains/pricing/${encodeURIComponent(domain)}`
      );
      
      if (!response.ok) {
        throw new Error("获取价格信息失败");
      }
      
      const result = await response.json();
      
      // 新API返回的数据结构
      const data = result.data || result;
      
      // 增强价格解析的可靠性
      const parsePrice = (value: any): number | undefined => {
        if (value === null || value === undefined || value === '') return undefined;
        const parsed = parseFloat(String(value));
        return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
      };
      
      // 适配新API返回的数据结构
      const priceInfo: DomainPrice = {
        domain,
        isPremium: data.premium === "true" || data.premium === true || data.premium === 1 || data.isPremium === true,
        registrationPrice: parsePrice(data.register || data.price || data.registrationPrice || data.registerPrice),
        renewalPrice: parsePrice(data.renew || data.renewPrice || data.renewalPrice),
        transferPrice: parsePrice(data.transfer || data.transferPrice),
        currency: data.currency || "CNY",
        exchangeRate: parseFloat(data.exchangeRate || "1") || 1,
        meaning: data.meaning || data.description || undefined, // 域名含义
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

  const resetPrice = () => {
    setPriceData(null);
    setError(null);
  };

  return {
    priceData,
    isLoading,
    error,
    fetchPrice,
    formatPrice,
    resetPrice,
  };
};
