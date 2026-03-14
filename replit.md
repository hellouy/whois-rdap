# Domain Query Tool

A domain lookup and analysis tool built with React + Vite + TypeScript. Supports WHOIS queries, RDAP lookups, DNS resolution, SSL certificate checks, domain pricing, and a domain hack generator.

## Architecture

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router v6
- **API Server**: Express (Node.js, `server.mjs`, port 3001) — proxies requests to external APIs to bypass browser CORS restrictions
- **Dev proxy**: Vite proxies `/api/*` → `http://localhost:3001`

## Key Files

- `src/` — React frontend source
  - `pages/` — Route-level pages (Index, DomainQuery, HackGenerator, NotFound)
  - `components/` — Reusable UI components (WhoisQuery, DnsQuery, SslCertQuery, etc.)
  - `hooks/` — Custom React hooks for data fetching
  - `lib/` — TLD data, word libraries, domain utilities
  - `utils/` — WHOIS servers, heuristics, country/registrar data
- `server.mjs` — Express API server (replaces Vercel Edge Functions)
  - `GET /api/whois?domain=` — WHOIS/RDAP proxy (races multiple sources)
  - `GET /api/whois?mode=dns-batch&domains=` — Batch DNS availability check
  - `GET /api/price?domain=` — Domain pricing proxy (nazhumi.com)
- `api/` — Original Vercel Edge Function source files (kept for reference, not used on Replit)

## Running the App

The workflow runs both services in parallel:
```
node server.mjs & npm run dev
```
- API server: port 3001
- Vite dev server: port 5000 (proxies /api/* to 3001)

## Migration Notes (Lovable → Replit)

- Removed `lovable-tagger` Vite plugin (Lovable-specific)
- Replaced Vercel Edge Functions (`api/`) with Express server (`server.mjs`)
- Updated `vite.config.ts`: host `0.0.0.0`, port `5000`, added `/api` proxy to `localhost:3001`
- Added `express` as a runtime dependency

## Recent Improvements

- **Input box**: Added URL decode in cleanRawInput (handles copy-pasted encoded URLs); unknown TLD shows warning (not error)
- **Batch DNS accuracy**: Improved server.mjs `dns-batch` endpoint — checks A+NS+MX in parallel; uses SOA as final arbiter for ambiguous results; no more false positives for registered domains with no A records
- **Popup dialogs**: HackGenerator rows now open a dialog with WhoisQuery instead of navigating to a new page; SingleCharQuery available domains now also open popup instead of linking to Porkbun
- **Raw data section**: WhoisQuery now has a collapsible "原始数据" section showing WHOIS text and/or RDAP JSON with copy button; rdapRaw stored in WhoisData from parseRdap()
- **WHOIS heuristics**: Enhanced whois-heuristics.ts with more "not found" patterns (Polish, Dutch, Finnish, Arabic, various registry formats) + reserved domain detection
- **History limit**: Increased from 20 to 100 items in use-query-history.ts
- **FloatingNav enrichment**: More tools in all sections (tools: 34 items, parking: 14 items, register: 16 items, grab: 14 items) with detailed descriptions
