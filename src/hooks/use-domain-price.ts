import { useState } from "react";

export interface DomainPrice {
  domain: string;
  isPremium: boolean;
  registrationPrice?: number;
  renewalPrice?: number;
  registrationOriginal?: { price: number; currency: string };
  renewalOriginal?: { price: number; currency: string };
  currency: string;
  registrarName?: string;
  renewRegistrarName?: string;
  isNegotiable?: boolean;
}

const EXCHANGE_RATES: Record<string, number> = {
  usd: 7.2,
  eur: 7.8,
  gbp: 9.1,
  jpy: 0.048,
  krw: 0.0053,
  cny: 1,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥',
  krw: '₩',
  cny: '¥',
};

// 价格缓存
const priceCache = new Map<string, { data: DomainPrice; timestamp: number }>();
const PRICE_CACHE_TTL = 10 * 60 * 1000;

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
      
      const apiUrl = `https://www.nazhumi.com/api/v1?domain=${encodeURIComponent(tld)}`;
      
      let res: any = null;

      // 同时发起直接请求和代理请求，取最快的
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const tryFetch = async (url: string): Promise<any> => {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      };

      const promises = [
        tryFetch(apiUrl).catch(() => null),
        tryFetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`).catch(() => null),
      ];

      // Race: take whichever resolves first with valid data
      const results = await Promise.allSettled(promises);
      
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value && r.value.code === 100 && r.value.data?.price?.length) {
          res = r.value;
          break;
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
        const rate = EXCHANGE_RATES[currency.toLowerCase()] || (currency.toLowerCase() === 'usd' ? 7.2 : 1);
        return Math.round(n * rate);
      };

      let minReg: number | null = null;
      let minRegName = '';
      let minRegOriginal: { price: number; currency: string } | undefined;
      let minRenew: number | null = null;
      let minRenewName = '';
      let minRenewOriginal: { price: number; currency: string } | undefined;

      for (const p of prices) {
        const reg = toCNY(p.new, p.currency);
        if (reg !== null && (minReg === null || reg < minReg)) {
          minReg = reg;
          minRegName = p.registrarname || p.registrar || '';
          const origPrice = parseFloat(p.new);
          if (p.currency?.toLowerCase() !== 'cny') {
            minRegOriginal = { price: origPrice, currency: p.currency?.toLowerCase() || 'usd' };
          }
        }
        const ren = toCNY(p.renew, p.currency);
        if (ren !== null && (minRenew === null || ren < minRenew)) {
          minRenew = ren;
          minRenewName = p.registrarname || p.registrar || '';
          const origPrice = parseFloat(p.renew);
          if (p.currency?.toLowerCase() !== 'cny') {
            minRenewOriginal = { price: origPrice, currency: p.currency?.toLowerCase() || 'usd' };
          }
        }
      }

      if (minReg === null && minRenew === null) {
        throw new Error("未找到有效的价格信息");
      }

      const isNegotiable = (minReg !== null && minReg > 500) || 
        (minReg !== null && minRenew !== null && minReg > minRenew * 5);

      const result: DomainPrice = {
        domain,
        isPremium: false,
        registrationPrice: minReg ?? undefined,
        renewalPrice: minRenew ?? undefined,
        registrationOriginal: minRegOriginal,
        renewalOriginal: minRenewOriginal,
        currency: 'CNY',
        registrarName: minRegName,
        renewRegistrarName: minRenewName,
        isNegotiable,
      };
      
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
    return `¥${price}`;
  };

  const formatOriginalPrice = (original?: { price: number; currency: string }): string | null => {
    if (!original) return null;
    const symbol = CURRENCY_SYMBOLS[original.currency] || '';
    return `${symbol}${original.price.toFixed(2)}`;
  };

  const resetPrice = () => {
    setPriceData(null);
    setError(null);
  };

  return { priceData, isLoading, error, fetchPrice, formatPrice, formatOriginalPrice, resetPrice };
};
