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
      // 使用优化的API v2，增强准确性和可靠性
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
      
      const response = await fetch(
        `https://api-v2.tian.hu/domains/pricing/${encodeURIComponent(domain)}`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`获取价格信息失败 (HTTP ${response.status})`);
      }
      
      const result = await response.json();
      
      // 处理API返回的数据结构，增强容错性
      const data = result.data || result;
      
      // 增强价格解析的可靠性和精准度
      const parsePrice = (value: any): number | undefined => {
        if (value === null || value === undefined || value === '') return undefined;
        // 处理字符串和数字
        const str = String(value).trim();
        const parsed = parseFloat(str);
        return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
      };
      
      // 增强溢价状态判断
      const isPremium = Boolean(
        data.premium === "true" || 
        data.premium === true || 
        data.premium === 1 || 
        data.isPremium === true ||
        data.is_premium === true
      );
      
      // 适配新API返回的多种数据结构
      const priceInfo: DomainPrice = {
        domain,
        isPremium,
        registrationPrice: parsePrice(
          data.register || 
          data.price || 
          data.registrationPrice || 
          data.registerPrice ||
          data.registration_price
        ),
        renewalPrice: parsePrice(
          data.renew || 
          data.renewPrice || 
          data.renewalPrice ||
          data.renewal_price
        ),
        transferPrice: parsePrice(
          data.transfer || 
          data.transferPrice ||
          data.transfer_price
        ),
        currency: data.currency || data.curr || "CNY",
        exchangeRate: parseFloat(data.exchangeRate || data.exchange_rate || "1") || 1,
        meaning: data.meaning || data.description || data.desc || undefined,
      };
      
      // 验证至少有一个价格信息
      if (!priceInfo.registrationPrice && !priceInfo.renewalPrice) {
        throw new Error("未找到有效的价格信息");
      }
      
      setPriceData(priceInfo);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? (err.name === 'AbortError' ? "查询超时，请重试" : err.message)
        : "查询失败";
      setError(errorMessage);
      console.error('域名价格查询错误:', err);
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
