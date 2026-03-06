import { useState, useCallback } from "react";

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

// 负面缓存
const noPriceCache = new Map<string, number>();
const NO_PRICE_CACHE_TTL = 30 * 60 * 1000;

const validatePriceData = (data: any): boolean => {
  return data && data.code === 100 && data.data?.price?.length > 0;
};

// 通过边缘代理或多个CORS代理竞速获取价格数据
async function fetchPriceFromApi(apiUrl: string, tld: string, signal: AbortSignal): Promise<any> {
  const validate = (d: any) => {
    if (!validatePriceData(d)) throw new Error('invalid');
    return d;
  };

  const directFetch = (proxyUrl: string) =>
    fetch(proxyUrl, { signal, headers: { Accept: 'application/json' } })
      .then(r => { if (!r.ok) throw new Error('fail'); return r.json(); })
      .then(validate)
      .catch(() => null);

  const fetchers = [
    // 0. Vercel Edge 代理（部署时最快）
    directFetch(`/api/price?domain=${encodeURIComponent(tld)}`),
    
    // 1. 直连
    directFetch(apiUrl),
    
    // 2. allorigins
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, { signal })
      .then(r => { if (!r.ok) throw new Error('fail'); return r.json(); })
      .then(w => {
        if (!w?.contents) throw new Error('empty');
        return validate(typeof w.contents === 'string' ? JSON.parse(w.contents) : w.contents);
      })
      .catch(() => null),
    
    // 3. corsproxy.io
    directFetch(`https://corsproxy.io/?${encodeURIComponent(apiUrl)}`),
  ];

  return new Promise<any>((resolve, reject) => {
    let settled = false;
    let doneCount = 0;
    const total = fetchers.length;
    
    fetchers.forEach(p => {
      p.then(result => {
        doneCount++;
        if (result && !settled) {
          settled = true;
          resolve(result);
        } else if (doneCount === total && !settled) {
          settled = true;
          reject(new Error("全部代理失败"));
        }
      });
    });
  });
}

export const useDomainPrice = () => {
  const [priceData, setPriceData] = useState<DomainPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async (domain: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parts = domain.split('.');
      if (parts.length < 2) throw new Error("无效域名");
      const tld = '.' + parts.slice(1).join('.');
      
      // 检查正常缓存
      const cached = priceCache.get(tld);
      if (cached && Date.now() - cached.timestamp < PRICE_CACHE_TTL) {
        setPriceData({ ...cached.data, domain });
        setIsLoading(false);
        return;
      }
      
      // 检查负面缓存
      const noPrice = noPriceCache.get(tld);
      if (noPrice && Date.now() - noPrice < NO_PRICE_CACHE_TTL) {
        throw new Error("暂无价格数据");
      }
      
      const apiUrl = `https://www.nazhumi.com/api/v1?domain=${encodeURIComponent(tld)}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      let res: any;
      try {
        res = await fetchPriceFromApi(apiUrl, tld, controller.signal);
      } catch {
        clearTimeout(timeoutId);
        noPriceCache.set(tld, Date.now());
        throw new Error("暂无价格数据");
      }
      
      clearTimeout(timeoutId);
      
      const prices = res.data.price as any[];
      
      const toCNY = (val: any, currency: string): number | null => {
        const n = parseFloat(val);
        if (isNaN(n) || n <= 0) return null;
        const rate = EXCHANGE_RATES[currency.toLowerCase()] || 1;
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
        noPriceCache.set(tld, Date.now());
        throw new Error("暂无价格数据");
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
  }, []);

  const formatPrice = (price?: number): string => {
    if (!price) return "暂无";
    return `¥${price}`;
  };

  const formatOriginalPrice = (original?: { price: number; currency: string }): string | null => {
    if (!original) return null;
    const symbol = CURRENCY_SYMBOLS[original.currency] || '';
    return `${symbol}${original.price.toFixed(2)}`;
  };

  const resetPrice = useCallback(() => {
    setPriceData(null);
    setError(null);
  }, []);

  return { priceData, isLoading, error, fetchPrice, formatPrice, formatOriginalPrice, resetPrice };
};
