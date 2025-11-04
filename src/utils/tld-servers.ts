// IANA TLD权威服务器数据
// 数据来源: https://www.iana.org/domains/root/db

interface TLDServer {
  tld: string;
  servers: string[];
}

// 常见TLD的权威服务器列表
export const TLD_SERVERS: Record<string, string[]> = {
  // 通用顶级域名 (gTLDs)
  "com": [
    "a.gtld-servers.net",
    "b.gtld-servers.net",
    "c.gtld-servers.net",
    "d.gtld-servers.net",
    "e.gtld-servers.net",
    "f.gtld-servers.net",
    "g.gtld-servers.net",
    "h.gtld-servers.net",
    "i.gtld-servers.net",
    "j.gtld-servers.net",
    "k.gtld-servers.net",
    "l.gtld-servers.net",
    "m.gtld-servers.net"
  ],
  "net": [
    "a.gtld-servers.net",
    "b.gtld-servers.net",
    "c.gtld-servers.net",
    "d.gtld-servers.net",
    "e.gtld-servers.net",
    "f.gtld-servers.net",
    "g.gtld-servers.net",
    "h.gtld-servers.net",
    "i.gtld-servers.net",
    "j.gtld-servers.net",
    "k.gtld-servers.net",
    "l.gtld-servers.net",
    "m.gtld-servers.net"
  ],
  "org": [
    "a0.org.afilias-nst.info",
    "a2.org.afilias-nst.info",
    "b0.org.afilias-nst.org",
    "b2.org.afilias-nst.org",
    "c0.org.afilias-nst.info",
    "d0.org.afilias-nst.org"
  ],
  "info": [
    "a0.info.afilias-nst.info",
    "a2.info.afilias-nst.info",
    "b0.info.afilias-nst.org",
    "b2.info.afilias-nst.org",
    "c0.info.afilias-nst.info",
    "d0.info.afilias-nst.info"
  ],
  "biz": [
    "a.gtld.biz",
    "b.gtld.biz",
    "c.gtld.biz",
    "d.gtld.biz",
    "e.gtld.biz",
    "f.gtld.biz"
  ],
  "edu": [
    "a.edu-servers.net",
    "b.edu-servers.net",
    "c.edu-servers.net",
    "d.edu-servers.net",
    "e.edu-servers.net",
    "f.edu-servers.net",
    "g.edu-servers.net"
  ],
  "gov": [
    "a.gov-servers.net",
    "b.gov-servers.net",
    "c.gov-servers.net",
    "d.gov-servers.net"
  ],
  "mil": [
    "a.nic.mil",
    "b.nic.mil"
  ],
  
  // 国家代码顶级域名 (ccTLDs)
  "cn": [
    "a.dns.cn",
    "b.dns.cn",
    "c.dns.cn",
    "d.dns.cn",
    "e.dns.cn",
    "f.dns.cn",
    "g.dns.cn",
    "ns.cnic.cn"
  ],
  "uk": [
    "dns1.nic.uk",
    "dns2.nic.uk",
    "dns3.nic.uk",
    "dns4.nic.uk",
    "nsa.nic.uk",
    "nsb.nic.uk",
    "nsc.nic.uk",
    "nsd.nic.uk"
  ],
  "de": [
    "a.nic.de",
    "f.nic.de",
    "l.de.net",
    "n.de.net",
    "s.de.net",
    "z.nic.de"
  ],
  "jp": [
    "a.dns.jp",
    "b.dns.jp",
    "c.dns.jp",
    "d.dns.jp",
    "e.dns.jp",
    "f.dns.jp",
    "g.dns.jp"
  ],
  "fr": [
    "d.nic.fr",
    "e.ext.nic.fr",
    "f.ext.nic.fr",
    "g.ext.nic.fr"
  ],
  "au": [
    "a.au",
    "b.au",
    "c.au",
    "d.au",
    "u.au",
    "v.au",
    "w.au",
    "x.au",
    "y.au",
    "z.au"
  ],
  "ca": [
    "a.ca-servers.ca",
    "c.ca-servers.ca",
    "j.ca-servers.ca",
    "x.ca-servers.ca",
    "any.ca-servers.ca"
  ],
  "br": [
    "a.dns.br",
    "b.dns.br",
    "c.dns.br",
    "d.dns.br",
    "e.dns.br",
    "f.dns.br"
  ],
  "ru": [
    "a.dns.ripn.net",
    "b.dns.ripn.net",
    "d.dns.ripn.net",
    "e.dns.ripn.net",
    "f.dns.ripn.net"
  ],
  "in": [
    "ns1.registry.in",
    "ns2.registry.in",
    "ns3.registry.in",
    "ns4.registry.in",
    "ns5.registry.in",
    "ns6.registry.in"
  ],
  "kr": [
    "b.dns.kr",
    "c.dns.kr",
    "d.dns.kr",
    "e.dns.kr",
    "f.dns.kr",
    "g.dns.kr"
  ],
  "it": [
    "a.dns.it",
    "m.dns.it",
    "nameserver.cnr.it",
    "r.dns.it",
    "s.dns.it"
  ],
  "es": [
    "a.nic.es",
    "c.nic.es",
    "d.nic.es",
    "g.nic.es",
    "h.nic.es"
  ],
  "nl": [
    "ns1.dns.nl",
    "ns2.dns.nl",
    "ns3.dns.nl",
    "ns4.dns.nl",
    "ns5.dns.nl"
  ],
  "se": [
    "a.ns.se",
    "b.ns.se",
    "c.ns.se",
    "d.ns.se",
    "e.ns.se",
    "f.ns.se",
    "g.ns.se"
  ],
  "ch": [
    "a.nic.ch",
    "b.nic.ch",
    "d.nic.ch",
    "e.nic.ch",
    "f.nic.ch"
  ],
  "tw": [
    "a.dns.tw",
    "b.dns.tw",
    "c.dns.tw",
    "d.dns.tw",
    "e.dns.tw",
    "f.dns.tw",
    "g.dns.tw",
    "h.dns.tw"
  ],
  "hk": [
    "a.hkirc.net.hk",
    "b.hkirc.net.hk",
    "c.hkirc.net.hk",
    "d.hkirc.net.hk",
    "e.hkirc.net.hk",
    "f.hkirc.net.hk",
    "g.hkirc.net.hk",
    "h.hkirc.net.hk"
  ],
  "sg": [
    "dsany.sgnic.sg",
    "dsb.sgnic.sg",
    "dsc.sgnic.sg",
    "ns2.cuhk.edu.hk",
    "ns4.apnic.net",
    "pch.sgnic.sg",
    "sec3.apnic.net"
  ],
  "my": [
    "ns.mynic.my",
    "ns2.mynic.my"
  ],
  "th": [
    "a.thains.co.th",
    "b.thains.co.th",
    "p.thains.co.th"
  ],
  "vn": [
    "a.vnnic-servers.vn",
    "b.vnnic-servers.vn",
    "c.vnnic-servers.vn",
    "d.vnnic-servers.vn",
    "e.vnnic-servers.vn",
    "f.vnnic-servers.vn"
  ],
  "id": [
    "a.dns.id",
    "b.dns.id",
    "c.dns.id",
    "d.dns.id"
  ],
  "ph": [
    "a.phtld.ph",
    "b.phtld.ph",
    "c.phtld.ph",
    "d.phtld.ph"
  ],
  "nz": [
    "ns1.dns.net.nz",
    "ns2.dns.net.nz",
    "ns3.dns.net.nz",
    "ns4.dns.net.nz",
    "ns5.dns.net.nz",
    "ns6.dns.net.nz",
    "ns7.dns.net.nz"
  ],
  "mx": [
    "a.mx-ns.mx",
    "c.mx-ns.mx",
    "e.mx-ns.mx",
    "m.mx-ns.mx",
    "o.mx-ns.mx"
  ],
  "ar": [
    "a.lactld.org",
    "ar.cctld.authdns.ripe.net",
    "athena.nic.ar",
    "ns-ar.rcom.ar",
    "ns1.nic.ar",
    "ns2.nic.ar",
    "ns3.nic.ar"
  ],
  "cl": [
    "a.nic.cl",
    "b.nic.cl",
    "c.nic.cl"
  ],
  "co": [
    "a.nic.co",
    "b.nic.co",
    "c.nic.co",
    "e.nic.co",
    "ns1.nic.co",
    "ns2.nic.co",
    "ns3.nic.co",
    "ns4.nic.co"
  ],
  "pl": [
    "a-dns.pl",
    "b-dns.pl",
    "d-dns.pl",
    "f-dns.pl",
    "g-dns.pl",
    "h-dns.pl",
    "i-dns.pl"
  ],
  "za": [
    "auth01.ns.uu.net",
    "auth02.ns.uu.net",
    "coza1.dnsnode.net",
    "ns1.coza.net.za",
    "ns2.coza.net.za"
  ],
  "tr": [
    "ns1.nic.tr",
    "ns2.nic.tr",
    "ns3.nic.tr",
    "ns4.nic.tr",
    "ns5.nic.tr",
    "ns6.nic.tr"
  ],
  "gr": [
    "gr-at.ics.forth.gr",
    "gr-br.ics.forth.gr",
    "gr-m.ics.forth.gr",
    "grdns-de.denic.de",
    "grdns.ics.forth.gr"
  ],
  "cz": [
    "a.ns.nic.cz",
    "b.ns.nic.cz",
    "c.ns.nic.cz",
    "d.ns.nic.cz"
  ],
  "be": [
    "a.ns.dns.be",
    "b.ns.dns.be",
    "d.ns.dns.be",
    "n.ns.dns.be",
    "x.ns.dns.be",
    "y.ns.dns.be"
  ],
  "at": [
    "a.nic.at",
    "b.nic.at",
    "c.nic.at",
    "d.nic.at"
  ],
  "dk": [
    "a.nic.dk",
    "b.nic.dk",
    "c.nic.dk",
    "d.nic.dk",
    "e.nic.dk",
    "p.nic.dk",
    "s.nic.dk"
  ],
  "no": [
    "a.nic.no",
    "b.nic.no",
    "c.nic.no",
    "d.nic.no",
    "e.nic.no",
    "f.nic.no"
  ],
  "fi": [
    "a.fi",
    "b.fi",
    "c.fi",
    "d.fi",
    "e.fi",
    "f.fi",
    "g.fi"
  ],
  "ie": [
    "a.iedr.ie",
    "b.iedr.ie",
    "c.iedr.ie",
    "d.iedr.ie"
  ],
  "pt": [
    "a.dns.pt",
    "c.dns.pt",
    "d.dns.pt",
    "g.dns.pt",
    "h.dns.pt",
    "i.dns.pt"
  ],
  "hu": [
    "a.hu",
    "b.hu",
    "c.hu",
    "d.hu",
    "e.hu",
    "f.hu"
  ],
  "ro": [
    "a.rotld.ro",
    "b.rotld.ro",
    "c.rotld.ro",
    "d.rotld.ro",
    "e.rotld.ro"
  ],
  "ua": [
    "a.dns.ua",
    "b.dns.ua",
    "c.dns.ua",
    "d.dns.ua",
    "e.dns.ua",
    "f.dns.ua"
  ],
  "il": [
    "ns1.isoc.org.il",
    "ns2.isoc.org.il",
    "ns3.isoc.org.il",
    "ns4.isoc.org.il"
  ],
  "ae": [
    "ns1.aedns.ae",
    "ns2.aedns.ae",
    "ns3.aedns.ae",
    "ns4.aedns.ae"
  ],
  "sa": [
    "a.nic.sa",
    "b.nic.sa",
    "c.nic.sa",
    "d.nic.sa",
    "e.nic.sa",
    "f.nic.sa"
  ],
  "eg": [
    "ns1.frcu.eun.eg",
    "ns2.frcu.eun.eg"
  ],
  
  // 新通用顶级域名 (New gTLDs)
  "app": [
    "ns1.dns.nic.google",
    "ns2.dns.nic.google",
    "ns3.dns.nic.google",
    "ns4.dns.nic.google"
  ],
  "dev": [
    "ns1.dns.nic.google",
    "ns2.dns.nic.google",
    "ns3.dns.nic.google",
    "ns4.dns.nic.google"
  ],
  "xyz": [
    "a.nic.xyz",
    "b.nic.xyz",
    "c.nic.xyz",
    "d.nic.xyz"
  ],
  "top": [
    "a.nic.top",
    "b.nic.top",
    "c.nic.top",
    "d.nic.top",
    "e.nic.top"
  ],
  "site": [
    "a.nic.site",
    "b.nic.site",
    "c.nic.site",
    "d.nic.site"
  ],
  "online": [
    "a.nic.online",
    "b.nic.online",
    "c.nic.online",
    "d.nic.online"
  ],
  "store": [
    "a.nic.store",
    "b.nic.store",
    "c.nic.store",
    "d.nic.store"
  ],
  "tech": [
    "a.nic.tech",
    "b.nic.tech",
    "c.nic.tech",
    "d.nic.tech"
  ],
  "io": [
    "a0.nic.io",
    "a2.nic.io",
    "b0.nic.io",
    "c0.nic.io"
  ],
  "ai": [
    "a0.nic.ai",
    "a2.nic.ai",
    "b0.nic.ai",
    "c0.nic.ai"
  ],
  "me": [
    "a.nic.me",
    "b.nic.me",
    "c.nic.me",
    "d.nic.me"
  ],
  "cc": [
    "a.nic.cc",
    "b.nic.cc",
    "c.nic.cc",
    "d.nic.cc"
  ],
  "tv": [
    "a.nic.tv",
    "b.nic.tv",
    "c.nic.tv",
    "d.nic.tv"
  ],
  "club": [
    "a.nic.club",
    "b.nic.club",
    "c.nic.club",
    "d.nic.club"
  ],
  "vip": [
    "a.nic.vip",
    "b.nic.vip",
    "c.nic.vip",
    "d.nic.vip"
  ],
  "blog": [
    "a.nic.blog",
    "b.nic.blog",
    "c.nic.blog",
    "d.nic.blog"
  ],
  "shop": [
    "a.nic.shop",
    "b.nic.shop",
    "c.nic.shop",
    "d.nic.shop"
  ],
  "link": [
    "a.nic.link",
    "b.nic.link",
    "c.nic.link",
    "d.nic.link"
  ],
  "live": [
    "a.nic.live",
    "b.nic.live",
    "c.nic.live",
    "d.nic.live"
  ],
  "pro": [
    "a.nic.pro",
    "b.nic.pro",
    "c.nic.pro",
    "d.nic.pro"
  ],
  "wiki": [
    "ns1.dns.nic.wiki",
    "ns2.dns.nic.wiki",
    "ns3.dns.nic.wiki",
    "ns4.dns.nic.wiki"
  ],
  "cloud": [
    "a.nic.cloud",
    "b.nic.cloud",
    "c.nic.cloud",
    "d.nic.cloud"
  ],
  "news": [
    "a.nic.news",
    "b.nic.news",
    "c.nic.news",
    "d.nic.news"
  ],
  "world": [
    "a.nic.world",
    "b.nic.world",
    "c.nic.world",
    "d.nic.world"
  ],
  "network": [
    "a.nic.network",
    "b.nic.network",
    "c.nic.network",
    "d.nic.network"
  ],
  "design": [
    "a.nic.design",
    "b.nic.design",
    "c.nic.design",
    "d.nic.design"
  ],
  "space": [
    "a.nic.space",
    "b.nic.space",
    "c.nic.space",
    "d.nic.space"
  ],
  "works": [
    "a.nic.works",
    "b.nic.works",
    "c.nic.works",
    "d.nic.works"
  ],
  "page": [
    "ns1.dns.nic.google",
    "ns2.dns.nic.google",
    "ns3.dns.nic.google",
    "ns4.dns.nic.google"
  ],
  
  // 更多亚洲国家域名
  "pk": [
    "ns1.pknic.net.pk",
    "ns2.pknic.net.pk",
    "ns3.pknic.net.pk"
  ],
  "bd": [
    "jamuna.btcl.net.bd",
    "surma.btcl.net.bd"
  ],
  "np": [
    "ns1.mos.com.np",
    "ns2.mos.com.np"
  ],
  "lk": [
    "ns1.ac.lk",
    "ns2.ac.lk",
    "pentha.nic.lk",
    "rip.psg.com"
  ],
  "mm": [
    "ns1.registry.gov.mm",
    "ns2.registry.gov.mm"
  ],
  "kh": [
    "ns1.dns.net.kh",
    "ns2.dns.net.kh"
  ],
  "la": [
    "ns1.nic.la",
    "ns2.nic.la"
  ],
  "mn": [
    "a.nic.mn",
    "b.nic.mn",
    "c.nic.mn"
  ],
  
  // 更多欧洲国家域名
  "is": [
    "a.isnic.is",
    "b.isnic.is",
    "c.isnic.is"
  ],
  "lu": [
    "a.dns.lu",
    "b.dns.lu",
    "c.dns.lu",
    "d.dns.lu"
  ],
  "mt": [
    "a.nic.mt",
    "b.nic.mt",
    "c.nic.mt"
  ],
  "cy": [
    "ns1.nic.cy",
    "ns2.nic.cy",
    "ns3.nic.cy"
  ],
  "ee": [
    "a.tld.ee",
    "b.tld.ee",
    "c.tld.ee",
    "d.tld.ee"
  ],
  "lv": [
    "a.nic.lv",
    "b.nic.lv",
    "c.nic.lv"
  ],
  "lt": [
    "a.tld.lt",
    "b.tld.lt",
    "c.tld.lt"
  ],
  "si": [
    "a.ns.si",
    "b.ns.si",
    "c.ns.si"
  ],
  "sk": [
    "a.ns.sk",
    "b.ns.sk",
    "c.ns.sk",
    "d.ns.sk"
  ],
  "hr": [
    "a.dns.hr",
    "b.dns.hr",
    "c.dns.hr"
  ],
  "bg": [
    "a.dns.bg",
    "b.dns.bg",
    "c.dns.bg",
    "d.dns.bg"
  ],
  "rs": [
    "a.nic.rs",
    "b.nic.rs",
    "c.nic.rs",
    "d.nic.rs"
  ],
  
  // 更多美洲国家域名
  "us": [
    "a.cctld.us",
    "b.cctld.us",
    "c.cctld.us",
    "d.cctld.us",
    "e.cctld.us",
    "f.cctld.us"
  ],
  "pe": [
    "a.lactld.org",
    "kero.yachay.pe",
    "ns1.nic.pe",
    "ns2.nic.pe"
  ],
  "ve": [
    "a.lactld.org",
    "ns1.nic.ve",
    "ns2.nic.ve"
  ],
  "uy": [
    "a.lactld.org",
    "ns.dns.br",
    "ns.uy",
    "seciu.edu.uy"
  ],
  "ec": [
    "a.lactld.org",
    "ns.ecuadortelecom.net",
    "ns1.nic.ec"
  ],
  
  // 更多非洲和中东国家域名
  "ng": [
    "ns1.nic.net.ng",
    "ns2.nic.net.ng"
  ],
  "ke": [
    "ns1.kenic.or.ke",
    "ns2.kenic.or.ke"
  ],
  "gh": [
    "ns1.nic.gh",
    "ns2.nic.gh"
  ],
  "tn": [
    "ns1.ati.tn",
    "ns2.ati.tn"
  ],
  "ma": [
    "ns1.registre.ma",
    "ns2.registre.ma"
  ],
  "qa": [
    "ns1.registry.qa",
    "ns2.registry.qa"
  ],
  "kw": [
    "ns1.kw",
    "ns2.kw"
  ],
  "om": [
    "a.nic.om",
    "b.nic.om"
  ],
  "jo": [
    "ns1.dns.jo",
    "ns2.dns.jo"
  ],
  "lb": [
    "ns1.aub.edu.lb",
    "ns2.aub.edu.lb"
  ],
  
  // 新增gTLD - 更多通用顶级域
  "web": [
    "a.nic.web",
    "b.nic.web",
    "c.nic.web"
  ],
  "email": [
    "a.nic.email",
    "b.nic.email",
    "c.nic.email",
    "d.nic.email"
  ],
  "media": [
    "a.nic.media",
    "b.nic.media",
    "c.nic.media",
    "d.nic.media"
  ],
  "video": [
    "a.nic.video",
    "b.nic.video",
    "c.nic.video",
    "d.nic.video"
  ],
  "photos": [
    "a.nic.photos",
    "b.nic.photos",
    "c.nic.photos",
    "d.nic.photos"
  ],
  "today": [
    "a.nic.today",
    "b.nic.today",
    "c.nic.today",
    "d.nic.today"
  ],
  "best": [
    "a.nic.best",
    "b.nic.best",
    "c.nic.best",
    "d.nic.best"
  ],
  "win": [
    "a.nic.win",
    "b.nic.win",
    "c.nic.win",
    "d.nic.win"
  ],
  "fun": [
    "a.nic.fun",
    "b.nic.fun",
    "c.nic.fun",
    "d.nic.fun"
  ],
  "life": [
    "a.nic.life",
    "b.nic.life",
    "c.nic.life",
    "d.nic.life"
  ],
  "plus": [
    "a.nic.plus",
    "b.nic.plus",
    "c.nic.plus",
    "d.nic.plus"
  ],
  "work": [
    "a.nic.work",
    "b.nic.work",
    "c.nic.work",
    "d.nic.work"
  ],
  
  // 更多ccTLD
  "ws": [
    "a.nic.ws",
    "b.nic.ws",
    "c.nic.ws",
    "d.nic.ws"
  ],
  "to": [
    "a.nic.to",
    "b.nic.to",
    "c.nic.to"
  ],
  "sc": [
    "a.nic.sc",
    "b.nic.sc",
    "c.nic.sc",
    "d.nic.sc"
  ],
  "tk": [
    "a.nic.tk",
    "b.nic.tk",
    "c.nic.tk",
    "d.nic.tk"
  ],
  "pw": [
    "a.nic.pw",
    "b.nic.pw",
    "c.nic.pw",
    "d.nic.pw"
  ],
  "gd": [
    "a.nic.gd",
    "b.nic.gd",
    "c.nic.gd"
  ],
  "im": [
    "a.nic.im",
    "b.nic.im",
    "c.nic.im"
  ],
  "gg": [
    "a.nic.gg",
    "b.nic.gg",
    "c.nic.gg"
  ],
  "je": [
    "a.nic.je",
    "b.nic.je",
    "c.nic.je"
  ],
  "md": [
    "a.nic.md",
    "b.nic.md",
    "c.nic.md"
  ],
  "sh": [
    "a.nic.sh",
    "b.nic.sh",
    "c.nic.sh"
  ],
  "ac": [
    "a.nic.ac",
    "b.nic.ac",
    "c.nic.ac"
  ],
  "bz": [
    "ns.nic.bz",
    "ns2.nic.bz"
  ],
  "vc": [
    "a.nic.vc",
    "b.nic.vc",
    "c.nic.vc"
  ],
  "ag": [
    "a.nic.ag",
    "b.nic.ag"
  ],
  "lc": [
    "a.nic.lc",
    "b.nic.lc"
  ],
  
  // 更多亚洲ccTLD
  "kz": [
    "a.ns.kz",
    "b.ns.kz",
    "c.ns.kz"
  ],
  "uz": [
    "ns.uz",
    "ns2.uz"
  ],
  "kg": [
    "ns.kg",
    "ns2.kg"
  ],
  "am": [
    "a.nic.am",
    "b.nic.am"
  ],
  "ge": [
    "a.nic.ge",
    "b.nic.ge"
  ],
  "az": [
    "a.nic.az",
    "b.nic.az"
  ],
  "af": [
    "a.nic.af",
    "b.nic.af"
  ],
  "mo": [
    "a.nic.mo",
    "b.nic.mo"
  ],
  
  // 更多非洲ccTLD
  "tz": [
    "a.nic.tz",
    "b.nic.tz"
  ],
  "ug": [
    "a.nic.ug",
    "b.nic.ug"
  ],
  "zw": [
    "a.nic.zw",
    "b.nic.zw"
  ],
  "zm": [
    "a.nic.zm",
    "b.nic.zm"
  ],
  "mw": [
    "a.nic.mw",
    "b.nic.mw"
  ],
  "mu": [
    "a.nic.mu",
    "b.nic.mu"
  ],
  "mg": [
    "a.nic.mg",
    "b.nic.mg"
  ],
  "na": [
    "a.nic.na",
    "b.nic.na"
  ],
  "bw": [
    "a.nic.bw",
    "b.nic.bw"
  ],
  
  // 商业/品牌TLD
  "company": [
    "a.nic.company",
    "b.nic.company",
    "c.nic.company"
  ],
  "business": [
    "a.nic.business",
    "b.nic.business",
    "c.nic.business"
  ],
  "group": [
    "a.nic.group",
    "b.nic.group",
    "c.nic.group"
  ],
  "ventures": [
    "a.nic.ventures",
    "b.nic.ventures",
    "c.nic.ventures"
  ],
  "solutions": [
    "a.nic.solutions",
    "b.nic.solutions",
    "c.nic.solutions"
  ],
  "services": [
    "a.nic.services",
    "b.nic.services",
    "c.nic.services"
  ],
  "digital": [
    "a.nic.digital",
    "b.nic.digital",
    "c.nic.digital"
  ],
  "agency": [
    "a.nic.agency",
    "b.nic.agency",
    "c.nic.agency"
  ],
  "studio": [
    "a.nic.studio",
    "b.nic.studio",
    "c.nic.studio"
  ],
  "center": [
    "a.nic.center",
    "b.nic.center",
    "c.nic.center"
  ],
  "systems": [
    "a.nic.systems",
    "b.nic.systems",
    "c.nic.systems"
  ],
  "technology": [
    "a.nic.technology",
    "b.nic.technology",
    "c.nic.technology"
  ],
  
  // 中文TLD (Punycode形式)
  "xn--fiqs8s": [ // .中国
    "a.dns.cn",
    "b.dns.cn",
    "c.dns.cn",
    "d.dns.cn",
    "e.dns.cn",
    "f.dns.cn",
    "g.dns.cn"
  ],
  "xn--fiqz9s": [ // .中國
    "a.dns.cn",
    "b.dns.cn",
    "c.dns.cn",
    "d.dns.cn",
    "e.dns.cn",
    "f.dns.cn",
    "g.dns.cn"
  ],
  "xn--55qx5d": [ // .公司
    "a.dns.cn",
    "b.dns.cn",
    "c.dns.cn",
    "d.dns.cn"
  ],
  "xn--io0a7i": [ // .网络
    "a.dns.cn",
    "b.dns.cn",
    "c.dns.cn",
    "d.dns.cn"
  ],
  "xn--1qqw23a": [ // .佛山
    "a.dns.cn",
    "b.dns.cn"
  ],
  "xn--j6w193g": [ // .香港
    "a.hkirc.net.hk",
    "b.hkirc.net.hk",
    "c.hkirc.net.hk"
  ],
  "xn--t60b56a": [ // .닷컴 (韩文)
    "b.dns.kr",
    "c.dns.kr"
  ],
  "xn--mgberp4a5d4ar": [ // .السعودية (沙特阿拉伯)
    "a.nic.sa",
    "b.nic.sa"
  ],
  "xn--90a3ac": [ // .срб (塞尔维亚)
    "a.nic.rs",
    "b.nic.rs"
  ],
  "xn--j1amh": [ // .укр (乌克兰)
    "a.ns.ua",
    "b.ns.ua"
  ],
  "xn--p1ai": [ // .рф (俄罗斯)
    "a.dns.ripn.net",
    "b.dns.ripn.net"
  ],
  "xn--wgbh1c": [ // .مصر (埃及)
    "a.nic.eg",
    "b.nic.eg"
  ],
  "xn--node": [ // .გე (格鲁吉亚)
    "a.nic.ge",
    "b.nic.ge"
  ],
  "xn--h2brj9c": [ // .भारत (印度)
    "ns1.registry.in",
    "ns2.registry.in"
  ],
};

/**
 * 将IDN域名转换为ASCII (Punycode)
 */
export function toASCII(domain: string): string {
  try {
    // 使用URL API进行IDN转换
    const url = new URL(`http://${domain}`);
    return url.hostname;
  } catch {
    // 如果URL构造失败，尝试使用Intl API
    try {
      return domain.split('.').map(part => {
        // 检测是否包含非ASCII字符
        if (/[^\x00-\x7F]/.test(part)) {
          // 使用简单的punycode转换
          return 'xn--' + punyEncode(part);
        }
        return part;
      }).join('.');
    } catch {
      return domain;
    }
  }
}

/**
 * 简单的Punycode编码实现
 */
function punyEncode(input: string): string {
  try {
    // 使用浏览器原生的TextEncoder进行简单转换
    // 这是一个简化版本，实际应用中应使用完整的punycode库
    const encoded = encodeURIComponent(input).replace(/%/g, '');
    return encoded.toLowerCase();
  } catch {
    return input;
  }
}

/**
 * 标准化域名（支持中文域名/IDN）
 */
export function normalizeDomain(domain: string): string {
  const trimmed = domain.trim().toLowerCase();
  // 移除协议前缀
  const withoutProtocol = trimmed.replace(/^https?:\/\//, '').replace(/^\/\//, '');
  // 移除路径和查询参数
  const withoutPath = withoutProtocol.split('/')[0].split('?')[0];
  // 转换IDN到ASCII
  return toASCII(withoutPath);
}

/**
 * 提取域名的顶级域名(TLD)
 */
export function extractTLD(domain: string): string | null {
  // 先标准化域名
  const normalized = normalizeDomain(domain);
  const parts = normalized.split('.');
  if (parts.length < 2) return null;
  
  // 处理二级域名，如 .co.uk, .com.cn 等
  if (parts.length >= 3) {
    const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    // 常见的二级域名
    const secondLevelTLDs = [
      'co.uk', 'ac.uk', 'gov.uk', 'org.uk',
      'com.cn', 'net.cn', 'org.cn', 'gov.cn',
      'com.au', 'net.au', 'org.au', 'gov.au',
      'co.jp', 'ne.jp', 'or.jp', 'ac.jp',
      'co.in', 'net.in', 'org.in', 'ac.in',
      'co.nz', 'net.nz', 'org.nz', 'ac.nz',
      'co.za', 'net.za', 'org.za', 'gov.za',
      'com.br', 'net.br', 'org.br', 'gov.br',
    ];
    if (secondLevelTLDs.includes(lastTwo)) {
      return lastTwo;
    }
  }
  
  return parts[parts.length - 1];
}

/**
 * 根据域名获取IANA官方TLD权威服务器
 */
export function getTLDServers(domain: string): string[] | null {
  const tld = extractTLD(domain);
  if (!tld) return null;
  
  return TLD_SERVERS[tld] || null;
}

/**
 * 检查域名的nameservers是否包含TLD权威服务器
 */
export function hasTLDServers(domain: string, nameServers: string[]): boolean {
  const tldServers = getTLDServers(domain);
  if (!tldServers) return false;
  
  const nsLower = nameServers.map(ns => ns.toLowerCase());
  return tldServers.some(tldServer => 
    nsLower.some(ns => ns.includes(tldServer.toLowerCase()))
  );
}
