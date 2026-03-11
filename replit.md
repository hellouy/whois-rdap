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
