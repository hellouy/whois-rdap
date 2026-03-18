# Domain Query Tool

A domain lookup and analysis tool built with React + Vite + TypeScript. Supports WHOIS queries, RDAP lookups, DNS resolution, SSL certificate checks, domain pricing, and a domain hack generator.

## Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router v6
- **API Server**: Express (Node.js, `server.mjs`, port 3001) — proxies requests to external APIs to bypass browser CORS restrictions
- **Dev proxy**: Vite proxies `/api/*` → `http://localhost:3001`
- **Global state**: Zustand (`src/store/query-store.ts`) — domain query state, loading, history
- **Unit tests**: Vitest — `npm test` runs 39 pure-function tests

## Layer Architecture

```
UI Components (pages/, components/)
    ↓ props only, no business logic
React Hooks (hooks/)  ←→  Zustand Store (store/)
    ↓
Service Layer (services/)
    ↓
API (server.mjs / external APIs)
```

## Key Files

- `src/` — React frontend source
  - `pages/` — Route-level pages (Index, DomainQuery, HackGenerator, SingleCharQuery, NotFound)
  - `components/` — Reusable UI components (WhoisQuery, DnsQuery, SslCertQuery, DnsMap, etc.)
  - `hooks/` — Thin React hooks (use-whois.ts delegates to services/whois-client.ts)
  - `lib/` — Pure business logic and TLD data
    - `hack-logic.ts` — Pure functions for domain hack generation (unit-tested)
    - `domain-hack.ts` — Orchestration: lazy library loading, corpus fetching
    - `dns-cache.ts` — LocalStorage-backed DNS result cache
    - `tld-list.ts`, `tld-categories.ts` — TLD data
    - `word-library*.ts`, `word-meanings*.ts`, `pinyin-library.ts` — Curated domain hack word lists
  - `services/` — API middleware layer
    - `whois-client.ts` — All WHOIS/RDAP fetching, parsing, caching (pure, no React)
    - `single-char-service.ts` — Business logic for batch domain availability checks
  - `store/` — Zustand global state
    - `query-store.ts` — currentDomain, displayDomain, isQuerying, availability, history
  - `utils/` — WHOIS servers, heuristics, country/registrar data
- `src/__tests__/` — Vitest unit tests (39 tests for hack-logic.ts)
- `public/data/` — JSON word corpus files (fetched at runtime, not bundled)
  - `word-corpus.json` — 3,479 words + meanings
  - `word-corpus-extra.json` — 2,607 words + meanings
- `server.mjs` — Express API server
  - `GET /api/whois?domain=` — WHOIS/RDAP proxy (races multiple sources)
  - `GET /api/whois?mode=dns-batch&domains=` — Batch DNS availability check
  - `GET /api/price?domain=` — Domain pricing proxy (nazhumi.com)
- `scripts/extract-corpus.mjs` — One-time script: converts word-corpus.ts → JSON
- `api/` — Original Vercel Edge Function source files (kept for reference, not used on Replit)

## Running the App

The workflow runs both services in parallel:
```
node server.mjs & npm run dev
```
- API server: port 3001
- Vite dev server: port 8080 (proxies /api/* to 3001)

## Running Tests

```
npm test           # run once
npm run test:watch # watch mode
npm run test:coverage # with coverage report
```

## Word Corpus Data Flow

Word corpus data is served as JSON from `public/data/` (static file, served by Vite).
`domain-hack.ts` fetches it at runtime via `fetch('/data/word-corpus.json')` instead of bundling it.
To update the corpus:
1. Edit `src/lib/word-corpus.ts` or `src/lib/word-corpus-extra.ts`
2. Run `node scripts/extract-corpus.mjs` to regenerate JSON

## Dependencies

- **Runtime**: express, zustand
- **Dev/Test**: vitest, @vitest/coverage-v8, jsdom

## Migration Notes (Lovable → Replit)

- Removed `lovable-tagger` Vite plugin (Lovable-specific)
- Replaced Vercel Edge Functions (`api/`) with Express server (`server.mjs`)
- Updated `vite.config.ts`: host `0.0.0.0`, port `8080`, added `/api` proxy

## Feature Modules (Task 1–4)

### Task 1 — i18n Smart Label System (`src/lib/domain-label-manager.ts`)
Pure functions that compute time-based domain labels from WHOIS timestamps:
- `isExpiringSoon()` — expires within 30 days → "即将过期 / Expiring Soon" (warning)
- `isLongTermInactive()` — no update for > 1 year → "长期未更新 / Long-term Inactive" (warning)
- `isFreshlyUpdated()` — updated within 7 days → "近期更新 / Freshly Updated" (info)
- `isLegacyDomain()` — registered > 10 years ago → "老牌域名 / Legacy Domain" (info)
- `isExpired()`, `isExpiringThisQuarter()` — additional predicates
- `getDomainLabels()` — returns all applicable bilingual labels with priority ordering
- Labels shown inline under the domain name in WhoisQuery with severity-coded colors

### Task 2 — Data Provenance & Reliability (`src/services/whois-client.ts`)
`fetchWhois()` now returns a `ResultEnvelope<WhoisData>` with:
- `source: DataSource` — enum (RDAP, RDAP_DIRECT, RDAP_ORG, WHOIS_FALLBACK, DNS_FALLBACK, UNKNOWN)
- `reliabilityScore: number` — 0–1 completeness score (counts populated fields)
- `dataProvenance: string` — human-readable description like "RDAP via proxy (85% complete)"
- Displayed in WhoisQuery as a small "数据来源" + "完整度" badge row below the status section

### Task 3 — ccTLD Strategy Pattern (`src/utils/cctld-parsers.ts`)
`ccTLDParserFactory(domain)` returns a TLD-specific parser for:
`.jp` (JPRS), `.de` (DENIC), `.uk/.co.uk` (Nominet), `.in` (NIXI), `.br/.com.br` (NIC.br), `.ru` (RIPN), `.au/.com.au` (auDA), `.io` (Afilias)
- Each parser provides optimized regexes for Registrar, NameServers, dates and status
- Falls back to `DEFAULT_PARSER` safely — never throws
- Integrated into `parseWhoisText()`: ccTLD results take priority, generic patterns fill gaps

### Task 4 — EPP Status Taxonomy (`src/utils/domain-status-mapping.ts`)
`StatusInfo` interface now includes:
- `english: string` — English label (e.g. "Redemption Period", "Client Hold")
- `isActionRequired: boolean` — true for hold/dispute/redemption/expired/delete states
- `isActionRequired()` / `hasActionRequired()` helper functions exported
- Status badges in WhoisQuery show a shield icon + ring highlight for action-required states

## Architecture Decisions

- **Services layer**: `services/whois-client.ts` centralises all WHOIS fetching (retry, parsing, caching). Hook `use-whois.ts` is now a 30-line thin wrapper.
- **Pure functions**: `lib/hack-logic.ts` contains only pure functions — no React, no fetch, fully unit-testable.
- **JSON corpus**: Word corpus moved out of the JS bundle to `public/data/*.json`, fetched lazily at first use. Updating words no longer requires a full rebuild.
- **Zustand store**: `store/query-store.ts` provides a single source of truth for current domain, loading state, and query history across all pages.
