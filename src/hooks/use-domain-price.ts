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
      // 使用 tian.hu API 查询价格
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时
      
      const response = await fetch(
        `https://api.tian.hu/pricing/${encodeURIComponent(domain)}`,
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
      
      const responseData = await response.json();
      
      // API返回格式: { code: 200, msg: "查询成功", data: {...} }
      if (responseData.code !== 200) {
        throw new Error(responseData.msg || "查询失败");
      }
      
      const data = responseData.data;
      if (!data) {
        throw new Error("返回数据格式错误");
      }
      
      // 增强价格解析的可靠性和精准度
      const parsePrice = (value: any): number | undefined => {
        if (value === null || value === undefined || value === '') return undefined;
        const str = String(value).trim();
        const parsed = parseFloat(str);
        return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
      };
      
      // 溢价状态判断
      const isPremium = Boolean(data.premium === true || data.premium === "true");
      
      // 按 API 返回结构解析
      const priceInfo: DomainPrice = {
        domain,
        isPremium,
        registrationPrice: parsePrice(data.register),
        renewalPrice: parsePrice(data.renew),
        transferPrice: parsePrice(data.transfer),
        currency: "CNY",
        exchangeRate: 1,
        meaning: data.meaning || undefined,
      };
      
      // 如果有美元价格但没有人民币价格，使用美元价格
      if (!priceInfo.registrationPrice && data.register_usd) {
        priceInfo.registrationPrice = parsePrice(data.register_usd);
        priceInfo.currency = "USD";
        priceInfo.exchangeRate = 7.2;
      }
      if (!priceInfo.renewalPrice && data.renew_usd) {
        priceInfo.renewalPrice = parsePrice(data.renew_usd);
        priceInfo.currency = "USD";
        priceInfo.exchangeRate = 7.2;
      }
      
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
