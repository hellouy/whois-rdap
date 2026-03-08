// Vercel Edge Function - WHOIS/RDAP 代理查询
// 部署在边缘节点，绕过浏览器 CORS 限制，加速查询
// 优化：RDAP + tian.hu 竞速，谁先返回用谁

export const config = {
  runtime: 'edge',
};

const RDAP_SERVERS: Record<string, string> = {
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
  ke: 'https://rdap.kenic.or.ke',
  rw: 'https://rdap.ricta.org.rw',
  gg: 'https://rdap.nic.gg',
  je: 'https://rdap.nic.je',
  im: 'https://rdap.nic.im',
  sh: 'https://rdap.nic.sh',
  ac: 'https://rdap.nic.ac',
  sc: 'https://rdap.nic.sc',
  so: 'https://rdap.nic.so',
  la: 'https://rdap.nic.la',
  sg: 'https://rdap.sgnic.sg/rdap',
  in: 'https://rdap.nixiregistry.in/rdap',
  be: 'https://rdap.dns.be',
  ch: 'https://rdap.nic.ch',
  at: 'https://rdap.nic.at',
  ie: 'https://rdap.iedr.ie',
  ua: 'https://rdap.hostmaster.ua',
  hr: 'https://rdap.dns.hr',
  rs: 'https://rdap.rnids.rs',
  nu: 'https://rdap.iis.nu',
  mu: 'https://rdap.identitydigital.services/rdap',
  ng: 'http://rdap.nic.net.ng',
  ly: 'https://rdap.nic.ly',
  // Additional TLDs
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
};

// Helper: race multiple promises, return first successful non-null
async function raceSuccessful<T>(promises: Promise<T | null>[]): Promise<T | null> {
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

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain')?.trim().toLowerCase();

  // Support batch DNS check mode
  const mode = url.searchParams.get('mode');
  if (mode === 'dns-batch') {
    return handleDnsBatch(url, req);
  }

  if (!domain) {
    return new Response(JSON.stringify({ error: 'Missing domain parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=300',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const parts = domain.split('.');
  const tld = parts[parts.length - 1];

  // === PHASE 1: Race RDAP (direct + rdap.org) + tian.hu simultaneously ===
  const phase1Promises: Promise<{ source: string; data: any } | null>[] = [];

  // 1a. Direct RDAP server
  const rdapServer = RDAP_SERVERS[tld];
  if (rdapServer) {
    phase1Promises.push(
      (async () => {
        try {
          const resp = await fetch(`${rdapServer}/domain/${domain}`, {
            headers: { Accept: 'application/rdap+json, application/json' },
            signal: AbortSignal.timeout(5000),
          });
          if (resp.ok) {
            const data = await resp.json();
            return { source: 'rdap', data };
          }
        } catch {}
        return null;
      })()
    );
  }

  // 1b. rdap.org universal
  phase1Promises.push(
    (async () => {
      try {
        const resp = await fetch(`https://rdap.org/domain/${domain}`, {
          headers: { Accept: 'application/rdap+json, application/json' },
          signal: AbortSignal.timeout(6000),
        });
        if (resp.ok) {
          const ct = resp.headers.get('content-type') || '';
          if (ct.includes('json')) {
            const data = await resp.json();
            return { source: 'rdap', data };
          }
        }
      } catch {}
      return null;
    })()
  );

  // 1c. tian.hu WHOIS API
  phase1Promises.push(
    (async () => {
      try {
        const resp = await fetch(`https://api.tian.hu/whois/${domain}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.code === 200) {
            return { source: 'tianhu', data };
          }
        }
      } catch {}
      return null;
    })()
  );

  // Race phase 1
  const phase1Result = await raceSuccessful(phase1Promises);
  if (phase1Result) {
    return new Response(JSON.stringify(phase1Result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // === PHASE 2: Slower fallbacks (who.is proxy) ===
  try {
    const resp = await fetch(`https://r.jina.ai/https://www.who.is/whois/${domain}`, {
      headers: { Accept: 'text/plain' },
      signal: AbortSignal.timeout(10000),
    });
    if (resp.ok) {
      const text = await resp.text();
      if (text.length > 100) {
        return new Response(JSON.stringify({ source: 'whois-proxy', data: text }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  } catch {}

  // === PHASE 3: DNS fallback ===
  try {
    const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      signal: AbortSignal.timeout(4000),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        return new Response(JSON.stringify({ source: 'dns-fallback', data: { exists: true, answers: data.Answer } }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (data.Status === 3) {
        return new Response(JSON.stringify({ source: 'dns-fallback', data: { exists: false } }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  } catch {}

  return new Response(JSON.stringify({ error: 'All sources failed' }), {
    status: 502,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Batch DNS check for domain hack generator
async function handleDnsBatch(url: URL, req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=60',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const domains = url.searchParams.get('domains')?.split(',').filter(Boolean).slice(0, 20) || [];
  if (domains.length === 0) {
    return new Response(JSON.stringify({ error: 'No domains' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results: Record<string, boolean | null> = {};

  await Promise.allSettled(
    domains.map(async (domain) => {
      try {
        const resp = await fetch(
          `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
          { headers: { Accept: 'application/dns-json' }, signal: AbortSignal.timeout(4000) }
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
            results[domain] = true; // registered (has DNS)
          } else if (data.Status === 3) {
            results[domain] = false; // NXDOMAIN = likely available
          } else {
            results[domain] = null; // uncertain
          }
        } else {
          results[domain] = null;
        }
      } catch {
        results[domain] = null;
      }
    })
  );

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
