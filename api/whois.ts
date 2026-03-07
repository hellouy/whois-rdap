// Vercel Edge Function - WHOIS/RDAP 代理查询
// 部署在边缘节点，绕过浏览器 CORS 限制，加速查询

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
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain')?.trim().toLowerCase();

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

  // 1. 尝试 RDAP 直查（精确服务器）
  const rdapServer = RDAP_SERVERS[tld];
  if (rdapServer) {
    try {
      const rdapUrl = `${rdapServer}/domain/${domain}`;
      const resp = await fetch(rdapUrl, {
        headers: { Accept: 'application/rdap+json, application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (resp.ok) {
        const data = await resp.json();
        return new Response(JSON.stringify({ source: 'rdap', data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch {}
  }

  // 2. rdap.org 通用查询
  try {
    const resp = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { Accept: 'application/rdap+json, application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (resp.ok) {
      const ct = resp.headers.get('content-type') || '';
      if (ct.includes('json')) {
        const data = await resp.json();
        return new Response(JSON.stringify({ source: 'rdap', data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  } catch {}

  // 3. tian.hu API
  try {
    const resp = await fetch(`https://api.tian.hu/whois/${domain}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 200) {
        return new Response(JSON.stringify({ source: 'tianhu', data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  } catch {}

  // 4. who.is scraping via r.jina.ai
  try {
    const resp = await fetch(`https://r.jina.ai/https://www.who.is/whois/${domain}`, {
      headers: { Accept: 'text/plain' },
      signal: AbortSignal.timeout(12000),
    });
    if (resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ source: 'whois-proxy', data: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch {}

  // 5. DNS fallback - check if domain exists via Google DNS
  try {
    const resp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/dns-json' },
      signal: AbortSignal.timeout(5000),
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
