// Vercel Edge Function - WHOIS/RDAP 代理查询
// 部署在边缘节点，绕过浏览器 CORS 限制，加速查询

export const config = {
  runtime: 'edge',
};

const RDAP_SERVERS: Record<string, string> = {
  com: 'https://rdap.verisign.com/com/v1',
  net: 'https://rdap.verisign.com/net/v1',
  org: 'https://rdap.org',
  info: 'https://rdap.org',
  io: 'https://rdap.org',
  dev: 'https://rdap.org',
  app: 'https://rdap.org',
  xyz: 'https://rdap.org',
  top: 'https://rdap.org',
  me: 'https://rdap.org',
  cc: 'https://rdap.verisign.com/cc/v1',
  tv: 'https://rdap.org',
};

const WHOIS_PROXIES = [
  (domain: string) => `https://rdap.org/domain/${domain}`,
  (domain: string) => `https://api.tian.hu/whois/${domain}`,
];

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

  // 1. 尝试 RDAP 直查
  const rdapServer = RDAP_SERVERS[tld];
  if (rdapServer) {
    try {
      const rdapUrl = rdapServer.includes('rdap.org')
        ? `https://rdap.org/domain/${domain}`
        : `${rdapServer}/domain/${domain}`;
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

  return new Response(JSON.stringify({ error: 'All sources failed' }), {
    status: 502,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
