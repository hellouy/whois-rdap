/**
 * useWhois — thin React hook wrapper around the whois-client service.
 *
 * All parsing, caching, and fetching logic lives in src/services/whois-client.ts.
 * This hook only manages React lifecycle (useState, useEffect).
 */

import { useEffect, useRef, useState } from "react";
import { fetchWhois, type WhoisData, type ResultEnvelope, DataSource, calculateReliabilityScore } from "@/services/whois-client";
import { getSupportedTldCount } from "@/utils/whois-servers";
import { toASCII } from "@/utils/tld-servers";
import { recordTldResult, type TldStatus } from "@/utils/tld-support-store";

export type { WhoisData, ResultEnvelope };
export { DataSource, calculateReliabilityScore };

const EMPTY_ENVELOPE: ResultEnvelope<WhoisData> = {
  data: null,
  error: null,
  source: DataSource.UNKNOWN,
  reliabilityScore: 0,
  dataProvenance: "No data",
};

export function useWhois(domain: string) {
  const [whois, setWhois]       = useState<WhoisData | null>(null);
  const [envelope, setEnvelope] = useState<ResultEnvelope<WhoisData>>(EMPTY_ENVELOPE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const mounted = useRef(true);
  const currentDomain = useRef("");

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const rawDomain = domain.trim().toLowerCase();
    if (!rawDomain) {
      setWhois(null);
      setEnvelope(EMPTY_ENVELOPE);
      setIsLoading(false);
      setError(null);
      return;
    }

    currentDomain.current = rawDomain;
    setIsLoading(true);
    setError(null);
    setWhois(null);

    const norm = toASCII(rawDomain);
    console.log(`[useWhois] querying: ${rawDomain}, supporting ${getSupportedTldCount()}+ TLDs`);

    fetchWhois(norm).then((env) => {
      if (!mounted.current || currentDomain.current !== rawDomain) return;
      setWhois(env.data);
      setEnvelope(env);
      setError(env.error);
      setIsLoading(false);

      // Record TLD support status
      const tld = norm.includes(".") ? norm.split(".").slice(1).join(".") : "";
      if (tld) {
        let status: TldStatus;
        if (env.source === DataSource.TIANHU) {
          status = "third_party";
        } else if (env.source === DataSource.UNKNOWN || (env.data === null && env.error !== null)) {
          status = "unsupported";
        } else {
          status = "supported";
        }
        recordTldResult(tld, status, env.source, env.error ?? undefined);
      }
    });
  }, [domain]);

  return { whois, envelope, isLoading, error };
}
