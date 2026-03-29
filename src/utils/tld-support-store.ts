/**
 * TLD Support Store
 * Persists per-TLD query outcomes to localStorage so users can see
 * which extensions can be queried natively vs. fall through to a third-party.
 */

const STORAGE_KEY = "tld_support_list_v1";

export type TldStatus = "supported" | "third_party" | "unsupported";

export interface TldSupportEntry {
  tld: string;
  status: TldStatus;
  source: string;
  errorMsg?: string;
  lastQueried: number;
  queryCount: number;
}

function load(): Record<string, TldSupportEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data: Record<string, TldSupportEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full — ignore
  }
}

export function recordTldResult(
  tld: string,
  status: TldStatus,
  source: string,
  errorMsg?: string
) {
  const store = load();
  const existing = store[tld];
  store[tld] = {
    tld,
    status,
    source,
    errorMsg: errorMsg ?? existing?.errorMsg,
    lastQueried: Date.now(),
    queryCount: (existing?.queryCount ?? 0) + 1,
  };
  save(store);
}

export function getTldSupportList(): TldSupportEntry[] {
  return Object.values(load()).sort((a, b) => b.lastQueried - a.lastQueried);
}

export function clearTldSupportList() {
  localStorage.removeItem(STORAGE_KEY);
}

export function removeTldEntry(tld: string) {
  const store = load();
  delete store[tld];
  save(store);
}
