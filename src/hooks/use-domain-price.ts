import { useState } from "react";

export interface DomainPrice {
  domain: string;
  isPremium: boolean;
  registrationPrice?: number;
  renewalPrice?: number;
  currency: string;
  registrarName?: string;
  renewRegistrarName?: string;
  isNegotiable?: boolean; // 是否议价
}

const USD_TO_CNY = 7.2;

// 价格缓存
const priceCache = new Map<string, { data: DomainPrice; timestamp: number }>();
const PRICE_CACHE_TTL = 10 * 60 * 1000; // 10分钟

export const useDomainPrice = () => {
  const [priceData, setPriceData] = useState<DomainPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parts = domain.split('.');
      if (parts.length < 2) throw new Error("无效域名");
      const tld = '.' + parts.slice(1).join('.');
      
      // 检查缓存
      const cached = priceCache.get(tld);
      if (cached && Date.now() - cached.timestamp < PRICE_CACHE_TTL) {
        setPriceData({ ...cached.data, domain });
        setIsLoading(false);
        return;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      // 使用 CORS 代理访问 nazhumi API
      const apiUrl = `https://www.nazhumi.com/api/v1?domain=${encodeURIComponent(tld)}`;
      
      let res: any = null;
      
      // 尝试直接请求
      try {
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          res = await response.json();
        }
      } catch {
        // 直接请求失败(CORS)，尝试代理
        console.log('[Price] 直接请求失败，尝试代理...');
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
          const proxyResponse = await fetch(proxyUrl, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          });
          if (proxyResponse.ok) {
            res = await proxyResponse.json();
          }
        } catch {
          // 代理也失败，尝试另一个代理
          try {
            const proxy2Url = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
            const proxy2Response = await fetch(proxy2Url, {
              signal: controller.signal,
              headers: { 'Accept': 'application/json' }
            });
            if (proxy2Response.ok) {
              res = await proxy2Response.json();
            }
          } catch {
            console.warn('[Price] 所有代理均失败');
          }
        }
      }
      
      clearTimeout(timeoutId);
      
      if (!res || res.code !== 100 || !res.data?.price?.length) {
        throw new Error("暂无价格数据");
      }
      
      const prices = res.data.price as any[];
      
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

      // 判断是否议价：注册价和续费价差距大于5倍，或注册价非常高（>500元）
      const isNegotiable = (minReg !== null && minReg > 500) || 
        (minReg !== null && minRenew !== null && minReg > minRenew * 5);

      const result: DomainPrice = {
        domain,
        isPremium: false,
        registrationPrice: minReg ?? undefined,
        renewalPrice: minRenew ?? undefined,
        currency: 'CNY',
        registrarName: minRegName,
        renewRegistrarName: minRenewName,
        isNegotiable,
      };
      
      // 缓存结果
      priceCache.set(tld, { data: result, timestamp: Date.now() });
      
      setPriceData(result);
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
