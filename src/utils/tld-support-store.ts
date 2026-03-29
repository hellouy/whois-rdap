/**
 * TLD Support Store — database-backed via /api/tld-support
 * Falls back to localStorage cache so the UI stays snappy.
 */

const CACHE_KEY = "tld_support_cache_v2";

export type TldStatus = "supported" | "third_party" | "unsupported";

export interface TldSupportEntry {
  tld: string;
  status: TldStatus;
  source: string;
  errorMsg?: string;
  lastQueried: number;
  queryCount: number;
}

// ── Local cache helpers ────────────────────────────────────────────────────────

function loadCache(): Record<string, TldSupportEntry> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCache(data: Record<string, TldSupportEntry>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // storage quota exceeded — ignore
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Write or update a TLD entry — fire-and-forget from the call site. */
export async function recordTldResult(
  tld: string,
  status: TldStatus,
  source: string,
  errorMsg?: string
): Promise<void> {
  // Optimistic local cache update
  const cache = loadCache();
  const prev = cache[tld];
  const entry: TldSupportEntry = {
    tld,
    status,
    source,
    errorMsg: errorMsg ?? prev?.errorMsg,
    lastQueried: Date.now(),
    queryCount: (prev?.queryCount ?? 0) + 1,
  };
  cache[tld] = entry;
  saveCache(cache);

  // Persist to database
  try {
    await fetch("/api/tld-support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // network error — local cache is the fallback
  }
}

/** Fetch the full list from the database (with local cache as fallback). */
export async function getTldSupportList(): Promise<TldSupportEntry[]> {
  try {
    const r = await fetch("/api/tld-support");
    if (r.ok) {
      const list: TldSupportEntry[] = await r.json();
      // Refresh local cache from server response
      const cache: Record<string, TldSupportEntry> = {};
      list.forEach((e) => (cache[e.tld] = e));
      saveCache(cache);
      return list;
    }
  } catch {
    // fall through to local cache
  }
  // Fallback: local cache sorted by lastQueried desc
  return Object.values(loadCache()).sort((a, b) => b.lastQueried - a.lastQueried);
}

/** Delete a single TLD entry. */
export async function removeTldEntry(tld: string): Promise<void> {
  const cache = loadCache();
  delete cache[tld];
  saveCache(cache);
  try {
    await fetch(`/api/tld-support/${encodeURIComponent(tld)}`, { method: "DELETE" });
  } catch {
    // ignore
  }
}

/** Delete all entries. */
export async function clearTldSupportList(): Promise<void> {
  saveCache({});
  try {
    await fetch("/api/tld-support", { method: "DELETE" });
  } catch {
    // ignore
  }
}
