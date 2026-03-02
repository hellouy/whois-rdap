import { useState } from "react";

export interface DomainPrice {
  domain: string;
  isPremium: boolean;
  registrationPrice?: number;
  renewalPrice?: number;
  currency: string;
  registrarName?: string;
  renewRegistrarName?: string;
}

const USD_TO_CNY = 7.2;

export const useDomainPrice = () => {
  const [priceData, setPriceData] = useState<DomainPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 提取 TLD
      const parts = domain.split('.');
      if (parts.length < 2) throw new Error("无效域名");
      const tld = '.' + parts.slice(1).join('.');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(
        `https://www.nazhumi.com/api/v1?domain=${encodeURIComponent(tld)}`,
        { signal: controller.signal, headers: { 'Accept': 'application/json' } }
      );
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const res = await response.json();
      if (res.code !== 100 || !res.data?.price?.length) {
        throw new Error("查询失败");
      }
      
      const prices = res.data.price as any[];
      
      // 统一转换为 CNY 并找最低注册价和最低续费价
      const toCNY = (val: any, currency: string): number | null => {
        const n = parseFloat(val);
        if (isNaN(n) || n <= 0) return null;
        return currency === 'usd' ? Math.round(n * USD_TO_CNY) : Math.round(n);
      };

      let minReg: number | null = null;
      let minRegName = '';
      let minRenew: number | null = null;
      let minRenewName = '';

      for (const p of prices) {
        const reg = toCNY(p.new, p.currency);
        if (reg !== null && (minReg === null || reg < minReg)) {
          minReg = reg;
          minRegName = p.registrarname || p.registrar || '';
        }
        const ren = toCNY(p.renew, p.currency);
        if (ren !== null && (minRenew === null || ren < minRenew)) {
          minRenew = ren;
          minRenewName = p.registrarname || p.registrar || '';
        }
      }

      if (minReg === null && minRenew === null) {
        throw new Error("未找到有效的价格信息");
      }

      setPriceData({
        domain,
        isPremium: false,
        registrationPrice: minReg ?? undefined,
        renewalPrice: minRenew ?? undefined,
        currency: 'CNY',
        registrarName: minRegName,
        renewRegistrarName: minRenewName,
      });
    } catch (err) {
      const msg = err instanceof Error
        ? (err.name === 'AbortError' ? "查询超时，请重试" : err.message)
        : "查询失败";
      setError(msg);
      console.error('域名价格查询错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price?: number): string => {
    if (!price) return "暂无";
    return `${price}元`;
  };

  const resetPrice = () => {
    setPriceData(null);
    setError(null);
  };

  return { priceData, isLoading, error, fetchPrice, formatPrice, resetPrice };
};
