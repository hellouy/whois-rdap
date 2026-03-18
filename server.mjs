import express from 'express';
import { createServer } from 'http';
import net from 'net';

// ── TCP WHOIS server map (port 43) for TLDs that lack reliable RDAP ──────────
const WHOIS_SERVERS = {
  // Caribbean / Atlantic
  bb: 'whois.co.bb', ag: 'whois.nic.ag', vc: 'whois.nic.vc', lc: 'whois2.afilias-grs.info',
  dm: 'whois2.afilias-grs.info', gd: 'whois2.afilias-grs.info', kn: 'whois2.afilias-grs.info',
  // Pacific
  fj: 'whois.domains.fj', pg: 'whois.nic.pg', ws: 'whois.website.ws', to: 'whois.tonic.to',
  sb: 'whois.nic.net.sb', vu: 'vunic.vu',
  // Africa
  mw: 'whois.nic.mw', tg: 'whois.nic.tg', td: 'whois.nic.td', rw: 'whois.ricta.org.rw',
  ke: 'whois.kenic.or.ke', ug: 'whois.registry.co.ug', gh: 'whois.nic.gh',
  ng: 'whois.nic.net.ng', sn: 'whois.nic.sn', ci: 'whois.nic.ci',
  cm: 'whois.netcom.cm', ao: 'whois.nic.ao', zw: 'whois.co.zw',
  bw: 'whois.nic.net.bw', mz: 'whois.nic.mz', tz: 'whois.tznic.or.tz',
  // Asia / Middle East
  af: 'whois.nic.af', bn: 'whois.bnnic.bn', kh: 'whois.nic.kh',
  // South America
  py: 'whois.nic.py', bo: 'whois.nic.bo', uy: 'whois.nic.org.uy',
  // Europe (missing RDAP)
  sm: 'whois.nic.sm', mc: 'whois.ripe.net',
};

async function tcpWhoisQuery(host, domain, timeoutMs = 7000) {
  return new Promise((resolve, reject) => {
    let data = '';
    const socket = net.createConnection({ host, port: 43 });
    socket.setEncoding('utf8');
    socket.setTimeout(timeoutMs);
    socket.on('connect', () => socket.write(`${domain}\r\n`));
    socket.on('data', chunk => { data += chunk; });
    socket.on('end', () => resolve(data));
    socket.on('error', reject);
    socket.on('timeout', () => { socket.destroy(); reject(new Error(`TCP WHOIS timeout: ${host}`)); });
  });
}

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

    // Check a single domain: NS is the most reliable registration signal
    async function checkDomainAvailability(d) {
      try {
        // Step 1: Query NS + A in parallel (NS = primary, A = secondary)
        const [nsData, aData] = await Promise.all([
          dnsQuery(d, 'NS').catch(() => null),
          dnsQuery(d, 'A').catch(() => null),
        ]);

        // NS records present → domain is definitely registered
        if (nsData?.Status === 0 && nsData?.Answer?.length > 0) return true;

        // A records present → domain is registered (has web hosting)
        if (aData?.Status === 0 && aData?.Answer?.length > 0) return true;

        // Both NS and A return NXDOMAIN → very high confidence it's available
        if (nsData?.Status === 3 && aData?.Status === 3) return false;

        // NS is NXDOMAIN but A is ambiguous → check MX to confirm
        if (nsData?.Status === 3) {
          const mxData = await dnsQuery(d, 'MX').catch(() => null);
          if (mxData?.Status === 3) return false; // all NXDOMAIN → available
          if (mxData?.Status === 0 && mxData?.Answer?.length > 0) return true; // has MX
        }

        // Step 2: SOA check for remaining ambiguity
        // SOA NXDOMAIN → available; SOA with records → registered/reserved
        const soaData = await dnsQuery(d, 'SOA').catch(() => null);
        if (soaData?.Status === 3) return false; // NXDOMAIN → available
        if (soaData?.Status === 0 && soaData?.Answer?.length > 0) return true; // SOA exists
        // NODATA on SOA (status 0, no Answer) + has Authority → zone exists, domain reserved
        if (soaData?.Status === 0 && soaData?.Authority?.length > 0) return null; // reserved
        if (soaData?.Status === 0) return null; // ambiguous zone state

        return null; // truly ambiguous / all queries failed
      } catch {
        return null;
      }
    }

    // Quick reserved-domain heuristic: single-char SLDs, exact registry names
    function isLikelyReserved(domain) {
      const sld = domain.split('.')[0];
      if (!sld) return false;
      // Single character SLDs are almost always reserved
      if (sld.length === 1) return true;
      // IANA / registry reserved names
      const reservedNames = new Set(['nic','whois','rdap','registry','registrar',
        'dns','ns','ns1','ns2','ns3','mail','smtp','ftp','www','ww','admin',
        'hostmaster','postmaster','abuse','noreply','support','test','example']);
      if (reservedNames.has(sld.toLowerCase())) return true;
      return false;
    }

    const results = {};
    await Promise.allSettled(
      domains.map(async (d) => {
        if (isLikelyReserved(d)) {
          results[d] = null; // reserved — can't determine via DNS
        } else {
          results[d] = await checkDomainAvailability(d);
        }
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

  // TCP WHOIS (port 43) for TLDs with a known WHOIS server
  const whoisHost = WHOIS_SERVERS[tld];
  if (whoisHost) {
    phase1.push((async () => {
      try {
        const raw = await tcpWhoisQuery(whoisHost, domain);
        if (raw && raw.trim().length > 20) return { source: 'whois-tcp', data: raw };
      } catch {}
      return null;
    })());
  }

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
