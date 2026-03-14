import express from 'express';
import { createServer } from 'http';

const app = express();
const PORT = 3001;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function sendJson(res, data, status = 200, extra = {}) {
  res.set({ ...corsHeaders, 'Content-Type': 'application/json', ...extra });
  res.status(status).json(data);
}

// ── WHOIS / RDAP proxy ──────────────────────────────────────────────────────

const RDAP_SERVERS = {
  com: 'https://rdap.verisign.com/com/v1',
  net: 'https://rdap.verisign.com/net/v1',
  org: 'https://rdap.publicinterestregistry.org/rdap',
  info: 'https://rdap.identitydigital.services/rdap',
  io: 'https://rdap.nic.io',
  dev: 'https://pubapi.registry.google/rdap',
  app: 'https://pubapi.registry.google/rdap',
  page: 'https://pubapi.registry.google/rdap',
  xyz: 'https://rdap.centralnic.com/xyz',
  top: 'https://rdap.nic.top',
  me: 'https://rdap.nic.me',
  cc: 'https://tld-rdap.verisign.com/cc/v1',
  tv: 'https://rdap.nic.tv',
  co: 'https://rdap.nic.co',
  ai: 'https://rdap.identitydigital.services/rdap',
  uk: 'https://rdap.nominet.uk/uk',
  de: 'https://rdap.denic.de',
  fr: 'https://rdap.nic.fr',
  eu: 'https://rdap.eurid.eu',
  nl: 'https://rdap.sidn.nl',
  se: 'https://rdap.iis.se',
  no: 'https://rdap.norid.no',
  dk: 'https://rdap.dk-hostmaster.dk',
  fi: 'https://rdap.fi/rdap/rdap',
  pl: 'https://rdap.dns.pl',
  cz: 'https://rdap.nic.cz',
  it: 'https://rdap.nic.it',
  es: 'https://rdap.nic.es',
  jp: 'https://rdap.jprs.jp',
  kr: 'https://rdap.kisa.or.kr',
  cn: 'https://rdap.cnnic.cn',
  tw: 'https://ccrdap.twnic.tw/tw',
  hk: 'https://rdap.hkirc.hk',
  au: 'https://rdap.auda.org.au',
  nz: 'https://rdap.nzrs.nz',
  br: 'https://rdap.registro.br',
  ca: 'https://rdap.ca.fury.ca/rdap',
  us: 'https://rdap.nic.us',
  za: 'https://rdap.registry.net.za',
  club: 'https://rdap.identitydigital.services/rdap',
  online: 'https://rdap.centralnic.com/online',
  site: 'https://rdap.centralnic.com/site',
  store: 'https://rdap.centralnic.com/store',
  tech: 'https://rdap.centralnic.com/tech',
  space: 'https://rdap.centralnic.com/space',
  fun: 'https://rdap.centralnic.com/fun',
  pro: 'https://rdap.identitydigital.services/rdap',
  biz: 'https://rdap.identitydigital.services/rdap',
  mobi: 'https://rdap.identitydigital.services/rdap',
  name: 'https://rdap.verisign.com/name/v1',
  cloud: 'https://rdap.identitydigital.services/rdap',
  blog: 'https://rdap.centralnic.com/blog',
  art: 'https://rdap.centralnic.com/art',
  design: 'https://rdap.centralnic.com/design',
  digital: 'https://rdap.identitydigital.services/rdap',
  world: 'https://rdap.identitydigital.services/rdap',
  life: 'https://rdap.identitydigital.services/rdap',
  live: 'https://rdap.identitydigital.services/rdap',
  work: 'https://rdap.centralnic.com/work',
  shop: 'https://rdap.centralnic.com/shop',
  link: 'https://rdap.centralnic.com/link',
  media: 'https://rdap.identitydigital.services/rdap',
  network: 'https://rdap.identitydigital.services/rdap',
  systems: 'https://rdap.identitydigital.services/rdap',
  academy: 'https://rdap.identitydigital.services/rdap',
  agency: 'https://rdap.identitydigital.services/rdap',
  global: 'https://rdap.centralnic.com/global',
};

async function raceSuccessful(promises) {
  return new Promise((resolve) => {
    let pending = promises.length;
    if (pending === 0) { resolve(null); return; }
    for (const p of promises) {
      p.then((val) => {
        if (val !== null) resolve(val);
        else { pending--; if (pending === 0) resolve(null); }
      }).catch(() => {
        pending--;
        if (pending === 0) resolve(null);
      });
    }
  });
}

app.options('/api/whois', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

app.get('/api/whois', async (req, res) => {
  const domain = req.query.domain?.trim().toLowerCase();
  const mode = req.query.mode;

  if (mode === 'dns-batch') {
    const domains = (req.query.domains || '').split(',').filter(Boolean).slice(0, 20);
    if (!domains.length) return sendJson(res, { error: 'No domains' }, 400);

    // Helper: query a single record type via Google DNS-over-HTTPS
    async function dnsQuery(name, type) {
      const r = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
        { headers: { Accept: 'application/dns-json' }, signal: AbortSignal.timeout(4000) }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }

    // Check a single domain using multiple DNS record types in parallel
    async function checkDomainAvailability(d) {
      try {
        // Query A, AAAA, NS, MX in parallel for speed
        const [aData, nsData, mxData] = await Promise.all([
          dnsQuery(d, 'A').catch(() => null),
          dnsQuery(d, 'NS').catch(() => null),
          dnsQuery(d, 'MX').catch(() => null),
        ]);

        // NXDOMAIN from ANY authoritative query → likely available
        // But only if ALL say NXDOMAIN
        const statuses = [aData, nsData, mxData].filter(Boolean).map(data => data.Status);
        const hasNxDomain = statuses.some(s => s === 3);
        const hasRecords = [aData, nsData, mxData].some(data =>
          data && data.Status === 0 && data.Answer && data.Answer.length > 0
        );

        if (hasRecords) return true; // registered

        // All returned NXDOMAIN
        if (statuses.every(s => s === 3)) return false; // available

        // Mixed results - check SOA as final arbiter
        try {
          const soaData = await dnsQuery(d, 'SOA');
          if (soaData.Status === 3) return false; // NXDOMAIN on SOA → available
          if (soaData.Status === 0 && soaData.Answer && soaData.Answer.length > 0) return true;
          // NODATA (status 0 but no answer) on SOA means zone exists but no SOA record
          // This is unusual - domain might be reserved/delegated but no SOA
          if (soaData.Status === 0) return true; // treat as registered (zone exists)
        } catch {}

        return null; // ambiguous
      } catch {
        return null;
      }
    }

    const results = {};
    await Promise.allSettled(
      domains.map(async (d) => {
        results[d] = await checkDomainAvailability(d);
      })
    );

    return sendJson(res, { results }, 200, { 'Cache-Control': 'public, max-age=60' });
  }

  if (!domain) return sendJson(res, { error: 'Missing domain parameter' }, 400);

  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  const cache = { 'Cache-Control': 'public, max-age=300' };

  const phase1 = [];
  const rdapServer = RDAP_SERVERS[tld];
  if (rdapServer) {
    phase1.push((async () => {
      try {
        const r = await fetch(`${rdapServer}/domain/${domain}`, {
          headers: { Accept: 'application/rdap+json, application/json' },
          signal: AbortSignal.timeout(5000),
        });
        if (r.ok) return { source: 'rdap', data: await r.json() };
      } catch {}
      return null;
    })());
  }

  phase1.push((async () => {
    try {
      const r = await fetch(`https://rdap.org/domain/${domain}`, {
        headers: { Accept: 'application/rdap+json, application/json' },
        signal: AbortSignal.timeout(6000),
      });
      if (r.ok && (r.headers.get('content-type') || '').includes('json')) {
        return { source: 'rdap', data: await r.json() };
      }
    } catch {}
    return null;
  })());

  phase1.push((async () => {
    try {
      const r = await fetch(`https://api.tian.hu/whois/${domain}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok) {
        const data = await r.json();
        if (data.code === 200) return { source: 'tianhu', data };
      }
    } catch {}
    return null;
  })());

  const result = await raceSuccessful(phase1);
  if (result) return sendJson(res, result, 200, cache);

  // Phase 2: tian.hu retry
  try {
    const r = await fetch(`https://api.tian.hu/whois/${domain}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    });
    if (r.ok) {
      const data = await r.json();
      if (data.code === 200) return sendJson(res, { source: 'tianhu', data }, 200, cache);
    }
  } catch {}

  // Phase 3: DNS fallback (check multiple record types)
  try {
    const dnsChecks = await Promise.allSettled([
      fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(4000),
      }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`, {
        headers: { Accept: 'application/dns-json' },
        signal: AbortSignal.timeout(4000),
      }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]);
    
    const results = dnsChecks.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
    const hasRecords = results.some(d => d.Status === 0 && d.Answer && d.Answer.length > 0);
    const allNxDomain = results.length > 0 && results.every(d => d.Status === 3);
    
    if (hasRecords) {
      return sendJson(res, { source: 'dns-fallback', data: { exists: true, answers: results[0]?.Answer || [] } }, 200, cache);
    }
    if (allNxDomain) {
      return sendJson(res, { source: 'dns-fallback', data: { exists: false } }, 200, cache);
    }
  } catch {}

  sendJson(res, { error: 'All sources failed' }, 502, cache);
});

// ── Price proxy ─────────────────────────────────────────────────────────────

app.options('/api/price', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

app.get('/api/price', async (req, res) => {
  const domain = req.query.domain?.trim();
  if (!domain) return sendJson(res, { error: 'Missing domain parameter' }, 400);

  try {
    const r = await fetch(`https://www.nazhumi.com/api/v1?domain=${encodeURIComponent(domain)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`API returned ${r.status}`);
    const data = await r.json();
    sendJson(res, data, 200, { 'Cache-Control': 'public, max-age=600' });
  } catch {
    sendJson(res, { error: 'Price API failed' }, 502, { 'Cache-Control': 'public, max-age=600' });
  }
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
});
