import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WhoisData } from "@/services/whois-client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AvailabilityMap = Record<string, boolean | null>;

export interface HistoryEntry {
  domain: string;
  displayDomain: string;
  status: "available" | "registered" | "unknown" | "querying";
  ts: number;
}

// ── Store shape ───────────────────────────────────────────────────────────────

interface QueryState {
  currentDomain: string;
  displayDomain: string;
  isQuerying: boolean;

  whoisData: WhoisData | null;
  whoisLoading: boolean;
  whoisError: string | null;

  availability: AvailabilityMap;

  history: HistoryEntry[];
}

interface QueryActions {
  setQuery: (domain: string, display: string) => void;
  setQuerying: (v: boolean) => void;

  setWhoisData: (data: WhoisData | null) => void;
  setWhoisLoading: (v: boolean) => void;
  setWhoisError: (err: string | null) => void;

  updateAvailability: (partial: AvailabilityMap) => void;
  resetAvailability: () => void;

  addToHistory: (entry: Omit<HistoryEntry, "ts">) => void;
  updateHistoryStatus: (domain: string, status: HistoryEntry["status"]) => void;
  clearHistory: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

const HISTORY_MAX = 200;

export const useQueryStore = create<QueryState & QueryActions>()(
  persist(
    (set) => ({
      currentDomain: "",
      displayDomain: "",
      isQuerying: false,

      whoisData: null,
      whoisLoading: false,
      whoisError: null,

      availability: {},

      history: [],

      setQuery: (domain, display) =>
        set({ currentDomain: domain, displayDomain: display }),

      setQuerying: (v) => set({ isQuerying: v }),

      setWhoisData: (data) => set({ whoisData: data }),
      setWhoisLoading: (v) => set({ whoisLoading: v }),
      setWhoisError: (err) => set({ whoisError: err }),

      updateAvailability: (partial) =>
        set((s) => ({ availability: { ...s.availability, ...partial } })),

      resetAvailability: () => set({ availability: {} }),

      addToHistory: (entry) =>
        set((s) => {
          const filtered = s.history.filter((h) => h.domain !== entry.domain);
          const next: HistoryEntry[] = [
            { ...entry, ts: Date.now() },
            ...filtered,
          ].slice(0, HISTORY_MAX);
          return { history: next };
        }),

      updateHistoryStatus: (domain, status) =>
        set((s) => ({
          history: s.history.map((h) =>
            h.domain === domain ? { ...h, status } : h
          ),
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "domain-query-store",
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);

// ── Convenience selectors ─────────────────────────────────────────────────────

export const selectCurrentDomain = (s: QueryState) => s.currentDomain;
export const selectHistory = (s: QueryState) => s.history;
export const selectAvailability = (s: QueryState) => s.availability;
export const selectWhoisState = (s: QueryState & QueryActions) => ({
  data: s.whoisData,
  loading: s.whoisLoading,
  error: s.whoisError,
  setData: s.setWhoisData,
  setLoading: s.setWhoisLoading,
  setError: s.setWhoisError,
});
