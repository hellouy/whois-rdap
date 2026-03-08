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

// 价格缓存
const priceCache = new Map<string, { data: DomainPrice; timestamp: number }>();
const PRICE_CACHE_TTL = 10 * 60 * 1000;

// 负面缓存
const noPriceCache = new Map<string, number>();
const NO_PRICE_CACHE_TTL = 30 * 60 * 1000;

const validatePriceData = (data: any): boolean => {
  return data && data.code === 100 && data.data?.price?.length > 0;
};

// Robust price fetching: try multiple sources with smart fallback
async function fetchPriceFromApi(tld: string, signal: AbortSignal): Promise<any> {
  const apiUrl = `https://www.nazhumi.com/api/v1?domain=${encodeURIComponent(tld)}`;
  
  const validate = (d: any) => {
    if (!validatePriceData(d)) throw new Error('invalid');
    return d;
  };

  // Helper: fetch with timeout and validation  
  const tryFetch = async (url: string, parseWrapper?: (d: any) => any): Promise<any> => {
    const resp = await fetch(url, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    
    // Check if response is actually JSON (not source code from dev server)
    const contentType = resp.headers.get('content-type') || '';
    const text = await resp.text();
    
    // Detect source code response (happens in dev/preview mode)
    if (text.startsWith('//') || text.startsWith('export ') || text.startsWith('import ') || text.includes('function handler')) {
      throw new Error('Got source code instead of API response');
    }
    
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Not JSON');
    }
    
    if (parseWrapper) data = parseWrapper(data);
    return validate(data);
  };

  // Strategy: try sources sequentially with short timeouts, fall back fast
  const sources = [
    // 1. Vercel Edge proxy (fastest when deployed)
    () => tryFetch(`/api/price?domain=${encodeURIComponent(tld)}`),
    
    // 2. Direct (works if no CORS issue)
    () => tryFetch(apiUrl),
    
    // 3. allorigins wrapper
    () => tryFetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`,
      (w) => {
        if (!w?.contents) throw new Error('empty');
        return typeof w.contents === 'string' ? JSON.parse(w.contents) : w.contents;
      }
    ),
    
    // 4. corsproxy.io
    () => tryFetch(`https://corsproxy.io/?${encodeURIComponent(apiUrl)}`),
    
    // 5. Alternative CORS proxy
    () => tryFetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`),
  ];

  // Race approach: start all, first valid wins
  return new Promise<any>((resolve, reject) => {
    let settled = false;
    let failCount = 0;
    const total = sources.length;

    for (const sourceFn of sources) {
      sourceFn()
        .then(result => {
          if (!settled) {
            settled = true;
            resolve(result);
          }
        })
        .catch(() => {
          failCount++;
          if (failCount === total && !settled) {
            settled = true;
            reject(new Error("全部代理失败"));
          }
        });
    }
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
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let res: any;
      try {
        res = await fetchPriceFromApi(tld, controller.signal);
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
    const symbols: Record<string, string> = { usd: '$', eur: '€', gbp: '£', jpy: '¥', krw: '₩', cny: '¥' };
    const symbol = symbols[original.currency] || '';
    return `${symbol}${original.price.toFixed(2)}`;
  };

  const resetPrice = useCallback(() => {
    setPriceData(null);
    setError(null);
  }, []);

  return { priceData, isLoading, error, fetchPrice, formatPrice, formatOriginalPrice, resetPrice };
};
