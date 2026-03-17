/**
 * useWhois — thin React hook wrapper around the whois-client service.
 *
 * All parsing, caching, and fetching logic lives in src/services/whois-client.ts.
 * This hook only manages React lifecycle (useState, useEffect, abort).
 */

import { useEffect, useRef, useState } from "react";
import { fetchWhois, type WhoisData } from "@/services/whois-client";
import { getSupportedTldCount } from "@/utils/whois-servers";
import { toASCII } from "@/utils/tld-servers";

export type { WhoisData };

export function useWhois(domain: string) {
  const [data, setData] = useState<WhoisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const currentDomain = useRef("");

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const rawDomain = domain.trim().toLowerCase();
    if (!rawDomain) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    currentDomain.current = rawDomain;
    setIsLoading(true);
    setError(null);
    setData(null);

    const norm = toASCII(rawDomain);
    console.log(`[useWhois] querying: ${rawDomain}, supporting ${getSupportedTldCount()}+ TLDs`);

    fetchWhois(norm).then(({ data: result, error: err }) => {
      if (!mounted.current || currentDomain.current !== rawDomain) return;
      setData(result);
      setError(err);
      setIsLoading(false);
    });
  }, [domain]);

  return { data, isLoading, error };
}
