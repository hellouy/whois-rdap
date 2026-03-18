import express from 'express';
import { createServer } from 'http';
import net from 'net';

// ── Per-TLD WHOIS query format overrides ──────────────────────────────────────
// Most servers accept: `domain.tld\r\n` (RFC 3912 default)
// Some require special prefixes / flags for correct / English output.
const WHOIS_QUERY_FORMATS = {
  jp:  (d) => `DOM ${d}/e\r\n`,          // JPRS: English-language output
  de:  (d) => `-T dn,ace ${d}\r\n`,      // DENIC: verbose ACE form
  it:  (d) => `dom ${d}\r\n`,            // NIC.it: dom-prefixed query
  br:  (d) => `${d}/noObject\r\n`,       // NIC.br: suppress contact objects
  lat: (d) => `${d}\r\n`,               // default fallback
};

// ── TCP WHOIS server map (port 43) ────────────────────────────────────────────
// Covers major gTLDs, all high-traffic ccTLDs, and regions without RDAP support
const WHOIS_SERVERS = {
  // ── Major gTLDs ──
  com: 'whois.verisign-grs.com', net: 'whois.verisign-grs.com',
  org: 'whois.pir.org', info: 'whois.afilias.net', biz: 'whois.nic.biz',

  // ── Asia-Pacific ──
  cn: 'whois.cnnic.cn', jp: 'whois.jprs.jp', kr: 'whois.kr',
  tw: 'whois.twnic.net.tw', hk: 'whois.hkirc.hk', sg: 'whois.sgnic.sg',
  my: 'whois.mynic.my', th: 'whois.thnic.co.th', vn: 'whois.vnnic.vn',
  id: 'whois.id', ph: 'whois.dot.ph', in: 'whois.registry.in',
  pk: 'whois.pknic.net.pk', lk: 'whois.nic.lk', mn: 'whois.nic.mn',
  kz: 'whois.nic.kz', uz: 'whois.cctld.uz', am: 'whois.amnic.net',
  ge: 'whois.nic.ge', az: 'whois.nic.az', kh: 'whois.nic.kh',
  bn: 'whois.bnnic.bn', mo: 'whois.monic.mo', af: 'whois.nic.af',
  la: 'whois.nic.la', mm: 'whois.registry.gov.mm',

  // ── Europe ──
  uk: 'whois.nic.uk', de: 'whois.denic.de', fr: 'whois.nic.fr',
  it: 'whois.nic.it', es: 'whois.nic.es', nl: 'whois.domain-registry.nl',
  se: 'whois.iis.se', ch: 'whois.nic.ch', ru: 'whois.tcinet.ru',
  pl: 'whois.dns.pl', gr: 'whois.ics.forth.gr', cz: 'whois.nic.cz',
  be: 'whois.dns.be', at: 'whois.nic.at', dk: 'whois.dk-hostmaster.dk',
  no: 'whois.norid.no', fi: 'whois.fi', ie: 'whois.iedr.ie',
  pt: 'whois.dns.pt', hu: 'whois.nic.hu', ro: 'whois.rotld.ro',
  ua: 'whois.ua', is: 'whois.isnic.is', lu: 'whois.dns.lu',
  ee: 'whois.tld.ee', lv: 'whois.nic.lv', lt: 'whois.domreg.lt',
  si: 'whois.register.si', sk: 'whois.sk-nic.sk', hr: 'whois.dns.hr',
  bg: 'whois.register.bg', rs: 'whois.rnids.rs', al: 'whois.nic.al',
  ba: 'whois.nic.ba', by: 'whois.cctld.by', mc: 'whois.ripe.net',
  sm: 'whois.nic.sm', li: 'whois.nic.li', fo: 'whois.nic.fo',
  gl: 'whois.nic.gl', gg: 'whois.gg', je: 'whois.je', im: 'whois.nic.im',
  mk: 'whois.marnet.mk', me: 'whois.nic.me', md: 'whois.nic.md',
  eu: 'whois.eu', su: 'whois.tcinet.ru', tr: 'whois.nic.tr',
  nu: 'whois.iis.nu', cy: 'whois.nic.cy', mt: 'whois.nic.mt',

  // ── Americas ──
  us: 'whois.nic.us', ca: 'whois.cira.ca', br: 'whois.registro.br',
  mx: 'whois.mx', ar: 'whois.nic.ar', cl: 'whois.nic.cl',
  co: 'whois.nic.co', pe: 'kero.yachay.pe', ve: 'whois.nic.ve',
  uy: 'whois.nic.org.uy', ec: 'whois.nic.ec', py: 'whois.nic.py',
  bo: 'whois.nic.bo', cr: 'whois.nic.cr', gt: 'whois.nic.gt',
  sv: 'whois.nic.sv', ni: 'whois.nic.ni', pa: 'whois.nic.pa',
  do: 'whois.nic.do', cu: 'whois.nic.cu', jm: 'whois.nic.jm',
  bb: 'whois.nic.bb', tt: 'whois.nic.tt', ag: 'whois.nic.ag',
  vc: 'whois.nic.vc', lc: 'whois2.afilias-grs.info',
  dm: 'whois2.afilias-grs.info', gd: 'whois2.afilias-grs.info',
  kn: 'whois2.afilias-grs.info', ai: 'whois.nic.ai', bm: 'whois.nic.bm',
  ky: 'whois.kyregistry.ky', tc: 'whois.nic.tc', vg: 'whois.nic.vg',
  aw: 'whois.nic.aw', bs: 'whois.nic.bs', bz: 'whois.afilias-grs.info',

  // ── Oceania ──
  au: 'whois.auda.org.au', nz: 'whois.irs.net.nz',
  fj: 'whois.domains.fj', pg: 'whois.nic.pg', ws: 'whois.website.ws',
  to: 'whois.tonic.to', sb: 'whois.nic.net.sb', vu: 'vunic.vu',
  ck: 'whois.nic.ck', fm: 'whois.nic.fm', cc: 'ccwhois.verisign-grs.com',
  cx: 'whois.nic.cx', io: 'whois.nic.io', tv: 'whois.nic.tv',
  tk: 'whois.dot.tk', as: 'whois.nic.as', nf: 'whois.nic.nf',

  // ── Middle East ──
  ae: 'whois.aeda.net.ae', sa: 'whois.nic.net.sa', eg: 'whois.nic.eg',
  il: 'whois.isoc.org.il', qa: 'whois.registry.qa', kw: 'whois.nic.kw',
  om: 'whois.registry.om', jo: 'whois.dns.jo', bh: 'whois.nic.bh',
  ir: 'whois.nic.ir', iq: 'whois.cmc.iq',

  // ── Africa ──
  za: 'whois.registry.net.za', ng: 'whois.nic.net.ng',
  ke: 'whois.kenic.or.ke', gh: 'whois.nic.gh', tn: 'whois.ati.tn',
  ma: 'whois.registre.ma', ao: 'whois.nic.ao', mz: 'whois.nic.mz',
  tz: 'whois.tznic.or.tz', rw: 'whois.ricta.org.rw', ug: 'whois.registry.co.ug',
  cm: 'whois.netcom.cm', sn: 'whois.nic.sn', ci: 'whois.nic.ci',
  tg: 'whois.nic.tg', td: 'whois.nic.td', mw: 'whois.nic.mw',
  bw: 'whois.nic.net.bw', zw: 'whois.co.zw', zm: 'whois.zicta.zm',
  na: 'whois.na-nic.com.na', mu: 'whois.nic.mu', mg: 'whois.nic.mg',
  sc: 'whois.nic.sc', dz: 'whois.nic.dz', ly: 'whois.nic.ly',
  ml: 'whois.nic.ml', bf: 'whois.nic.bf', gn: 'whois.nic.gn',
  sh: 'whois.nic.sh', re: 'whois.nic.re', ac: 'whois.nic.ac',
};

/**
 * Raw TCP WHOIS query on port 43.
 * Collects Buffer chunks, decodes as UTF-8 first; falls back to Latin-1 if
 * replacement characters appear (handles European ccTLD responses encoded in
 * ISO-8859-1).  Supports per-TLD query-string overrides.
 */
async function tcpWhoisQuery(host, domain, timeoutMs = 7000, tld = '') {
  const fmt = WHOIS_QUERY_FORMATS[tld] || ((d) => `${d}\r\n`);
  const query = fmt(domain);

  return new Promise((resolve, reject) => {
    const chunks = [];
    const socket = net.createConnection({ host, port: 43 });
    socket.setTimeout(timeoutMs);
    socket.on('connect', () => socket.write(query));
    socket.on('data', chunk => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    socket.on('end', () => {
      const raw = Buffer.concat(chunks);
      // Try UTF-8; if unicode replacement chars appear, decode as Latin-1
      let text = raw.toString('utf8');
      if (text.includes('\uFFFD')) text = raw.toString('latin1');
      resolve(text);
    });
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
  // ── Major gTLDs ──
  com: 'https://rdap.verisign.com/com/v1',
  net: 'https://rdap.verisign.com/net/v1',
  org: 'https://rdap.publicinterestregistry.org/rdap',
  info: 'https://rdap.identitydigital.services/rdap',
  biz: 'https://rdap.identitydigital.services/rdap',
  pro: 'https://rdap.identitydigital.services/rdap',
  mobi: 'https://rdap.identitydigital.services/rdap',
  name: 'https://rdap.verisign.com/name/v1',

  // ── Google registry ──
  dev:  'https://pubapi.registry.google/rdap',
  app:  'https://pubapi.registry.google/rdap',
  page: 'https://pubapi.registry.google/rdap',
  new:  'https://pubapi.registry.google/rdap',
  zip:  'https://pubapi.registry.google/rdap',

  // ── CentralNic / IdentityDigital new gTLDs ──
  xyz:     'https://rdap.centralnic.com/xyz',
  online:  'https://rdap.centralnic.com/online',
  site:    'https://rdap.centralnic.com/site',
  store:   'https://rdap.centralnic.com/store',
  tech:    'https://rdap.centralnic.com/tech',
  space:   'https://rdap.centralnic.com/space',
  fun:     'https://rdap.centralnic.com/fun',
  blog:    'https://rdap.centralnic.com/blog',
  art:     'https://rdap.centralnic.com/art',
  design:  'https://rdap.centralnic.com/design',
  work:    'https://rdap.centralnic.com/work',
  shop:    'https://rdap.centralnic.com/shop',
  link:    'https://rdap.centralnic.com/link',
  global:  'https://rdap.centralnic.com/global',
  wiki:    'https://rdap.centralnic.com/wiki',
  cloud:   'https://rdap.identitydigital.services/rdap',
  digital: 'https://rdap.identitydigital.services/rdap',
  world:   'https://rdap.identitydigital.services/rdap',
  life:    'https://rdap.identitydigital.services/rdap',
  live:    'https://rdap.identitydigital.services/rdap',
  media:   'https://rdap.identitydigital.services/rdap',
  network: 'https://rdap.identitydigital.services/rdap',
  systems: 'https://rdap.identitydigital.services/rdap',
  academy: 'https://rdap.identitydigital.services/rdap',
  agency:  'https://rdap.identitydigital.services/rdap',
  club:    'https://rdap.identitydigital.services/rdap',

  // ── Verisign ccTLDs ──
  io: 'https://rdap.nic.io',
  cc: 'https://tld-rdap.verisign.com/cc/v1',
  tv: 'https://rdap.nic.tv',

  // ── Other popular new gTLDs / ccTLDs ──
  top: 'https://rdap.nic.top',
  me:  'https://rdap.nic.me',
  co:  'https://rdap.nic.co',
  ai:  'https://rdap.identitydigital.services/rdap',
  gg:  'https://rdap.gg',
  je:  'https://rdap.je',
  im:  'https://rdap.nic.im',

  // ── Western Europe ──
  uk: 'https://rdap.nominet.uk/uk',
  de: 'https://rdap.denic.de',
  fr: 'https://rdap.nic.fr',
  it: 'https://rdap.nic.it',
  es: 'https://rdap.nic.es',
  nl: 'https://rdap.sidn.nl',
  se: 'https://rdap.iis.se',
  nu: 'https://rdap.iis.nu',
  ch: 'https://rdap.nic.ch',
  be: 'https://rdap.dns.be',
  at: 'https://rdap.nic.at',
  dk: 'https://rdap.dk-hostmaster.dk',
  no: 'https://rdap.norid.no',
  fi: 'https://rdap.fi/rdap',
  ie: 'https://rdap.iedr.ie',
  pt: 'https://rdap.dns.pt',
  lu: 'https://rdap.dns.lu',
  eu: 'https://rdap.eurid.eu',
  li: 'https://rdap.nic.li',
  is: 'https://rdap.isnic.is',

  // ── Central / Eastern Europe ──
  pl: 'https://rdap.dns.pl',
  cz: 'https://rdap.nic.cz',
  sk: 'https://rdap.sk-nic.sk',
  hu: 'https://rdap.nic.hu',
  ro: 'https://rdap.rotld.ro',
  bg: 'https://rdap.register.bg',
  hr: 'https://rdap.dns.hr',
  si: 'https://rdap.register.si',
  rs: 'https://rdap.rnids.rs',
  me2: 'https://rdap.nic.me',
  al: 'https://rdap.nic.al',
  mk: 'https://rdap.marnet.mk',
  ee: 'https://rdap.tld.ee',
  lv: 'https://rdap.nic.lv',
  lt: 'https://rdap.domreg.lt',
  ua: 'https://rdap.ua',

  // ── Eastern Europe / CIS ──
  ru: 'https://rdap.tcinet.ru/EPP/rdap',
  by: 'https://rdap.cctld.by',

  // ── Mediterranean / Middle East ──
  gr: 'https://rdap.ics.forth.gr',
  cy: 'https://rdap.nic.cy',
  tr: 'https://rdap.nic.tr',
  il: 'https://rdap.isoc.org.il',
  ae: 'https://rdap.aeda.net.ae',

  // ── Asia-Pacific ──
  jp: 'https://rdap.jprs.jp',
  kr: 'https://rdap.kisa.or.kr',
  cn: 'https://rdap.cnnic.cn',
  tw: 'https://ccrdap.twnic.tw/tw',
  hk: 'https://rdap.hkirc.hk',
  sg: 'https://rdap.sgnic.sg/rdap',
  id: 'https://rdap.pandi.or.id/rdap',
  in: 'https://rdap.registry.in/rdap',
  au: 'https://rdap.auda.org.au',
  nz: 'https://rdap.nzrs.nz',

  // ── Americas ──
  br: 'https://rdap.registro.br',
  ca: 'https://rdap.ca.fury.ca/rdap',
  us: 'https://rdap.nic.us',
  ar: 'https://rdap.nic.ar',
  cl: 'https://rdap.nic.cl',
  mx: 'https://rdap.mx',
  co2: 'https://rdap.nic.co',

  // ── Africa ──
  za: 'https://rdap.registry.net.za',
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

  // ── Phase 1: Concurrent race of all direct/local sources ────────────────────
  // RDAP direct, TCP WHOIS port 43, and rdap.org all race simultaneously.
  // rdap.org is included here because TCP WHOIS servers can be unreachable or
  // slow, and running rdap.org concurrently prevents multi-second stalls.
  // tian.hu is intentionally excluded and only used in Phase 2 as last resort.
  const phase1 = [];

  // 1a. TLD registry RDAP direct
  const rdapServer = RDAP_SERVERS[tld];
  if (rdapServer) {
    phase1.push((async () => {
      try {
        const r = await fetch(`${rdapServer}/domain/${domain}`, {
          headers: { Accept: 'application/rdap+json, application/json' },
          signal: AbortSignal.timeout(6000),
        });
        if (r.ok) return { source: 'rdap', data: await r.json() };
      } catch {}
      return null;
    })());
  }

  // 1b. TCP WHOIS port 43 (with per-TLD query format + encoding detection)
  const whoisHost = WHOIS_SERVERS[tld];
  if (whoisHost) {
    phase1.push((async () => {
      try {
        const raw = await tcpWhoisQuery(whoisHost, domain, 7000, tld);
        if (raw && raw.trim().length > 20) return { source: 'whois-tcp', data: raw };
      } catch {}
      return null;
    })());
  }

  // 1c. rdap.org public RDAP bootstrap — covers nearly all TLDs via IANA
  phase1.push((async () => {
    try {
      const r = await fetch(`https://rdap.org/domain/${domain}`, {
        headers: { Accept: 'application/rdap+json, application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (r.ok && (r.headers.get('content-type') || '').includes('json')) {
        return { source: 'rdap', data: await r.json() };
      }
    } catch {}
    return null;
  })());

  const phase1Result = await raceSuccessful(phase1);
  if (phase1Result) return sendJson(res, phase1Result, 200, cache);

  // ── Phase 2: tian.hu API — third-party, only when all direct sources fail ─
  try {
    const r = await fetch(`https://api.tian.hu/whois/${domain}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      const data = await r.json();
      if (data.code === 200) return sendJson(res, { source: 'tianhu', data }, 200, cache);
    }
  } catch {}

  // ── Phase 3: DNS existence check (absolute last resort) ──────────────────
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
