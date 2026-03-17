import { ALL_CCTLDS, NEW_GTLDS } from "@/lib/tld-list";
import { getBulkCached, putBulkCached } from "@/lib/dns-cache";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DomainStatus = "idle" | "checking" | "available" | "registered" | "unknown";
export type QueryMode = "suffix-to-prefix" | "prefix-to-suffix";

export interface DomainResult {
  domain: string;
  prefix: string;
  tld: string;
  status: DomainStatus;
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const CHARS_09 = ["0","1","2","3","4","5","6","7","8","9"] as const;
export const CHARS_AZ = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"] as const;
export const ALL_CHARS: string[] = [...CHARS_09, ...CHARS_AZ];

const CCTLD_SET = new Set(ALL_CCTLDS);
export const GTLDS_ONLY = NEW_GTLDS.filter((t) => !CCTLD_SET.has(t));

export const KNOWN_TLDS = new Set([
  ...ALL_CCTLDS.map((t) => t.replace(/^\./, "")),
  ...NEW_GTLDS.map((t) => t.replace(/^\./, "")),
  "com","net","org","edu","gov","mil","int","arpa",
]);

export const BATCH_SIZE = 20;
export const BATCH_DELAY = 200;

// ── Pure logic functions ──────────────────────────────────────────────────────

/**
 * Normalize and validate a raw suffix string entered by the user.
 * Returns the cleaned TLD string and any validation error.
 */
export function normalizeSuffix(raw: string): { tld: string; error: string | null } {
  const cleaned = raw.trim().toLowerCase().replace(/^\.+/, "").replace(/[^a-z0-9-]/g, "");
  if (!cleaned) return { tld: "", error: "请输入后缀" };
  if (cleaned.length < 2) return { tld: cleaned, error: "后缀至少需要 2 个字符" };
  if (!KNOWN_TLDS.has(cleaned)) {
    return {
      tld: cleaned,
      error: `"${cleaned}" 不在已知 TLD 列表中，结果可能不准确`,
    };
  }
  return { tld: cleaned, error: null };
}

/**
 * Build the initial DomainResult list for suffix-to-prefix mode.
 * All 36 single chars (0-9, a-z) are paired with the given TLD.
 */
export function buildS2pDomains(tld: string): DomainResult[] {
  const normalizedTld = tld.startsWith(".") ? tld : `.${tld}`;
  return ALL_CHARS.map((c) => ({
    domain: `${c}${normalizedTld}`,
    prefix: c,
    tld: normalizedTld,
    status: "checking" as DomainStatus,
  }));
}

/**
 * Build the initial DomainResult list for prefix-to-suffix mode.
 */
export function buildP2sDomains(
  prefix: string,
  useCcTld: boolean,
  useGTld: boolean
): DomainResult[] {
  let tlds: string[] = [];
  if (useCcTld) tlds = [...tlds, ...ALL_CCTLDS];
  if (useGTld) tlds = [...tlds, ...GTLDS_ONLY];
  tlds = [...new Set(tlds)];

  return tlds.map((tld) => ({
    domain: `${prefix}${tld}`,
    prefix,
    tld,
    status: "checking" as DomainStatus,
  }));
}

/**
 * Apply partial availability results back onto a DomainResult list.
 * Pure function — returns a new array.
 */
export function applyPartialResults(
  current: DomainResult[],
  partial: Record<string, boolean | null>
): DomainResult[] {
  return current.map((r) => {
    if (!(r.domain in partial)) return r;
    const v = partial[r.domain];
    return {
      ...r,
      status: v === true ? "registered" : v === false ? "available" : "unknown",
    };
  });
}

// ── API service function ──────────────────────────────────────────────────────

/**
 * Batch-check domain availability via the server's DNS proxy.
 * Reads/writes from the persistent DNS cache.
 * Calls onPartial with incremental results as they arrive.
 */
export async function batchCheckAvailability(
  domains: string[],
  signal: AbortSignal,
  onPartial: (results: Record<string, boolean | null>) => void
): Promise<void> {
  const cached = getBulkCached(domains);
  if (Object.keys(cached).length > 0) onPartial(cached);

  const toFetch = domains.filter((d) => !(d in cached));
  if (toFetch.length === 0) return;

  const freshResults: Record<string, boolean | null> = {};

  for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
    if (signal.aborted) break;
    const batch = toFetch.slice(i, i + BATCH_SIZE);
    try {
      const resp = await fetch(
        `/api/whois?mode=dns-batch&domains=${batch.join(",")}`,
        { signal: AbortSignal.timeout(10000), headers: { Accept: "application/json" } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data.results) {
          for (const [d, v] of Object.entries(data.results)) {
            freshResults[d] = v as boolean | null;
          }
          onPartial({ ...data.results });
        }
      }
    } catch {
      for (const d of batch) freshResults[d] = null;
      onPartial(Object.fromEntries(batch.map((d) => [d, null])));
    }
    if (i + BATCH_SIZE < toFetch.length && !signal.aborted) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY));
    }
  }

  if (Object.keys(freshResults).length > 0) {
    putBulkCached(freshResults);
  }
}
