import { useState, useCallback, useRef } from "react";

// Batch check domain availability via DNS (Google DNS API)
// true = registered (DNS exists), false = available (NXDOMAIN), null = unknown

type AvailabilityMap = Record<string, boolean | null>;

const BATCH_SIZE = 10; // domains per batch
const BATCH_DELAY = 300; // ms between batches

export function useDomainAvailability() {
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [isChecking, setIsChecking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const checkedRef = useRef<Set<string>>(new Set());

  const checkDomains = useCallback(async (domains: string[]) => {
    // Filter out already checked
    const toCheck = domains.filter(d => !checkedRef.current.has(d));
    if (toCheck.length === 0) return;

    // Abort previous
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    
    setIsChecking(true);

    // Try Edge batch API first, fallback to direct Google DNS
    for (let i = 0; i < toCheck.length; i += BATCH_SIZE) {
      if (controller.signal.aborted) break;
      
      const batch = toCheck.slice(i, i + BATCH_SIZE);
      const batchResults: AvailabilityMap = {};

      // Try Edge batch endpoint
      try {
        const resp = await fetch(`/api/whois?mode=dns-batch&domains=${batch.join(',')}`, {
          signal: AbortSignal.timeout(6000),
          headers: { Accept: 'application/json' },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.results) {
            for (const [domain, exists] of Object.entries(data.results)) {
              batchResults[domain] = exists as boolean | null;
              checkedRef.current.add(domain);
            }
          }
        }
      } catch {
        // Edge not available, fall back to direct Google DNS per-domain
        await Promise.allSettled(
          batch.map(async (domain) => {
            try {
              const resp = await fetch(
                `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
                { signal: AbortSignal.timeout(4000), headers: { Accept: 'application/dns-json' } }
              );
              if (resp.ok) {
                const data = await resp.json();
                if (data.Status === 0 && data.Answer?.length > 0) {
                  batchResults[domain] = true;
                } else if (data.Status === 3) {
                  batchResults[domain] = false;
                } else {
                  batchResults[domain] = null;
                }
              } else {
                batchResults[domain] = null;
              }
            } catch {
              batchResults[domain] = null;
            }
            checkedRef.current.add(domain);
          })
        );
      }

      if (controller.signal.aborted) break;
      
      setAvailability(prev => ({ ...prev, ...batchResults }));

      // Delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < toCheck.length) {
        await new Promise(r => setTimeout(r, BATCH_DELAY));
      }
    }

    if (!controller.signal.aborted) {
      setIsChecking(false);
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setAvailability({});
    setIsChecking(false);
    checkedRef.current.clear();
  }, []);

  return { availability, isChecking, checkDomains, reset };
}
