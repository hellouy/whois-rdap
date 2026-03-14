import { useState, useCallback, useEffect } from "react";

export interface QueryHistoryItem {
  domain: string;
  displayDomain: string;
  timestamp: number;
  status?: string; // "已注册" | "未注册" | "查询中"
}

const STORAGE_KEY = "domain-query-history";
const MAX_HISTORY = 100;

function loadHistory(): QueryHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueryHistoryItem[];
  } catch {
    return [];
  }
}

function saveHistory(items: QueryHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
  } catch {
    // storage full — try pruning old entries and retry
    try {
      const pruned = items.slice(0, Math.floor(MAX_HISTORY / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
    } catch {}
  }
}

export function useQueryHistory() {
  const [history, setHistory] = useState<QueryHistoryItem[]>(loadHistory);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setHistory(loadHistory());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const refresh = useCallback(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback((domain: string, displayDomain: string, status?: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.domain !== domain);
      const next = [{ domain, displayDomain, timestamp: Date.now(), status }, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const updateStatus = useCallback((domain: string, status: string) => {
    setHistory(prev => {
      const next = prev.map(h => h.domain === domain ? { ...h, status } : h);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeItem = useCallback((domain: string) => {
    setHistory(prev => {
      const next = prev.filter(h => h.domain !== domain);
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, addToHistory, updateStatus, clearHistory, removeItem, refresh };
}
