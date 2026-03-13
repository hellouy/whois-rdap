// LocalStorage-based cache for DNS availability results
// Key: domain name, Value: { result: boolean | null, ts: number }

const CACHE_KEY = "dns_cache_v1";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = { result: boolean | null; ts: number };
type CacheStore = Record<string, CacheEntry>;

function load(): CacheStore {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function save(store: CacheStore) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // Storage quota exceeded — clear and retry
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_KEY, JSON.stringify(store));
    } catch {}
  }
}

/** Get cached result for a domain. Returns undefined if not cached or expired. */
export function getCached(domain: string): boolean | null | undefined {
  const store = load();
  const entry = store[domain];
  if (!entry) return undefined;
  if (Date.now() - entry.ts > TTL_MS) return undefined;
  return entry.result;
}

/** Bulk get from cache. Returns a map of domain → result for those found. */
export function getBulkCached(domains: string[]): Record<string, boolean | null> {
  const store = load();
  const now = Date.now();
  const hits: Record<string, boolean | null> = {};
  for (const d of domains) {
    const entry = store[d];
    if (entry && now - entry.ts <= TTL_MS) {
      hits[d] = entry.result;
    }
  }
  return hits;
}

/** Store results in cache. */
export function putBulkCached(results: Record<string, boolean | null>) {
  const store = load();
  const now = Date.now();
  for (const [d, result] of Object.entries(results)) {
    store[d] = { result, ts: now };
  }
  // Prune expired entries
  for (const [d, entry] of Object.entries(store)) {
    if (now - entry.ts > TTL_MS) delete store[d];
  }
  save(store);
}

/** Clear the entire cache. */
export function clearDnsCache() {
  localStorage.removeItem(CACHE_KEY);
}
