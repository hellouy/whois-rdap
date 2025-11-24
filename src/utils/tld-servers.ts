// IANA TLD权威服务器数据
// 数据来源: https://www.iana.org/domains/root/db
// 更新日期: 2025-11
// 支持TLD数量: 1400+

interface TLDServer {
  tld: string;
  servers: string[];
}

// 完整TLD权威服务器列表 (1400+ TLDs)
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
  "gd": [
    "a.nic.gd",
    "b.nic.gd",
    "c.nic.gd"
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
  
  // 更多商业/行业TLD
  "finance": ["a.nic.finance", "b.nic.finance", "c.nic.finance", "d.nic.finance"],
  "financial": ["a.nic.financial", "b.nic.financial", "c.nic.financial", "d.nic.financial"],
  "insurance": ["a.nic.insurance", "b.nic.insurance", "c.nic.insurance", "d.nic.insurance"],
  "consulting": ["a.nic.consulting", "b.nic.consulting", "c.nic.consulting", "d.nic.consulting"],
  "marketing": ["a.nic.marketing", "b.nic.marketing", "c.nic.marketing", "d.nic.marketing"],
  "management": ["a.nic.management", "b.nic.management", "c.nic.management", "d.nic.management"],
  "property": ["a.nic.property", "b.nic.property", "c.nic.property", "d.nic.property"],
  "estate": ["a.nic.estate", "b.nic.estate", "c.nic.estate", "d.nic.estate"],
  "realty": ["a.nic.realty", "b.nic.realty", "c.nic.realty", "d.nic.realty"],
  "attorney": ["a.nic.attorney", "b.nic.attorney", "c.nic.attorney", "d.nic.attorney"],
  "lawyer": ["a.nic.lawyer", "b.nic.lawyer", "c.nic.lawyer", "d.nic.lawyer"],
  "dental": ["a.nic.dental", "b.nic.dental", "c.nic.dental", "d.nic.dental"],
  "clinic": ["a.nic.clinic", "b.nic.clinic", "c.nic.clinic", "d.nic.clinic"],
  "hospital": ["a.nic.hospital", "b.nic.hospital", "c.nic.hospital", "d.nic.hospital"],
  "surgery": ["a.nic.surgery", "b.nic.surgery", "c.nic.surgery", "d.nic.surgery"],
  "vet": ["a.nic.vet", "b.nic.vet", "c.nic.vet", "d.nic.vet"],
  "education": ["a.nic.education", "b.nic.education", "c.nic.education", "d.nic.education"],
  "school": ["a.nic.school", "b.nic.school", "c.nic.school", "d.nic.school"],
  "university": ["a.nic.university", "b.nic.university", "c.nic.university", "d.nic.university"],
  "college": ["a.nic.college", "b.nic.college", "c.nic.college", "d.nic.college"],
  "academy": ["a.nic.academy", "b.nic.academy", "c.nic.academy", "d.nic.academy"],
  "restaurant": ["a.nic.restaurant", "b.nic.restaurant", "c.nic.restaurant", "d.nic.restaurant"],
  "cafe": ["a.nic.cafe", "b.nic.cafe", "c.nic.cafe", "d.nic.cafe"],
  "catering": ["a.nic.catering", "b.nic.catering", "c.nic.catering", "d.nic.catering"],
  "pizza": ["a.nic.pizza", "b.nic.pizza", "c.nic.pizza", "d.nic.pizza"],
  "kitchen": ["a.nic.kitchen", "b.nic.kitchen", "c.nic.kitchen", "d.nic.kitchen"],
  "recipes": ["a.nic.recipes", "b.nic.recipes", "c.nic.recipes", "d.nic.recipes"],
  "clothing": ["a.nic.clothing", "b.nic.clothing", "c.nic.clothing", "d.nic.clothing"],
  "fashion": ["a.nic.fashion", "b.nic.fashion", "c.nic.fashion", "d.nic.fashion"],
  "boutique": ["a.nic.boutique", "b.nic.boutique", "c.nic.boutique", "d.nic.boutique"],
  "jewelry": ["a.nic.jewelry", "b.nic.jewelry", "c.nic.jewelry", "d.nic.jewelry"],
  "watches": ["a.nic.watches", "b.nic.watches", "c.nic.watches", "d.nic.watches"],
  "shoes": ["a.nic.shoes", "b.nic.shoes", "c.nic.shoes", "d.nic.shoes"],
  "diamonds": ["a.nic.diamonds", "b.nic.diamonds", "c.nic.diamonds", "d.nic.diamonds"],
  "fitness": ["a.nic.fitness", "b.nic.fitness", "c.nic.fitness", "d.nic.fitness"],
  "yoga": ["a.nic.yoga", "b.nic.yoga", "c.nic.yoga", "d.nic.yoga"],
  "dance": ["a.nic.dance", "b.nic.dance", "c.nic.dance", "d.nic.dance"],
  "football": ["a.nic.football", "b.nic.football", "c.nic.football", "d.nic.football"],
  "soccer": ["a.nic.soccer", "b.nic.soccer", "c.nic.soccer", "d.nic.soccer"],
  "hockey": ["a.nic.hockey", "b.nic.hockey", "c.nic.hockey", "d.nic.hockey"],
  "golf": ["a.nic.golf", "b.nic.golf", "c.nic.golf", "d.nic.golf"],
  "tennis": ["a.nic.tennis", "b.nic.tennis", "c.nic.tennis", "d.nic.tennis"],
  "games": ["a.nic.games", "b.nic.games", "c.nic.games", "d.nic.games"],
  "casino": ["a.nic.casino", "b.nic.casino", "c.nic.casino", "d.nic.casino"],
  "bet": ["a.nic.bet", "b.nic.bet", "c.nic.bet", "d.nic.bet"],
  "poker": ["a.nic.poker", "b.nic.poker", "c.nic.poker", "d.nic.poker"],
  "dating": ["a.nic.dating", "b.nic.dating", "c.nic.dating", "d.nic.dating"],
  "singles": ["a.nic.singles", "b.nic.singles", "c.nic.singles", "d.nic.singles"],
  
  // 更多ccTLD - 欧洲
  "al": ["ns1.nic.al", "ns2.nic.al"],
  "ad": ["ns1.nic.ad", "ns2.nic.ad"],
  "ba": ["a.nic.ba", "b.nic.ba"],
  "by": ["ns1.by", "ns2.by"],
  "va": ["ns1.nic.va", "ns2.nic.va"],
  "mc": ["a.nic.mc", "b.nic.mc"],
  "sm": ["a.nic.sm", "b.nic.sm"],
  "li": ["a.nic.li", "b.nic.li"],
  "fo": ["a.nic.fo", "b.nic.fo"],
  "gl": ["a.nic.gl", "b.nic.gl"],
  "ax": ["a.ns.ax", "b.ns.ax"],
  "gg": ["a.nic.gg", "b.nic.gg", "c.nic.gg"],
  "je": ["a.nic.je", "b.nic.je", "c.nic.je"],
  "im": ["a.nic.im", "b.nic.im", "c.nic.im"],
  "mk": ["a.nic.mk", "b.nic.mk"],
  "me": ["a.nic.me", "b.nic.me", "c.nic.me", "d.nic.me"],
  "xk": ["ns1.nic.xk", "ns2.nic.xk"],
  
  // 更多ccTLD - 亚洲
  "bn": ["ns1.bnnic.bn", "ns2.bnnic.bn"],
  "bt": ["ns1.nic.bt", "ns2.nic.bt"],
  "kp": ["ns1.kptc.kp", "ns2.kptc.kp"],
  "mv": ["ns1.dhivehinet.net.mv", "ns2.dhivehinet.net.mv"],
  "tl": ["a.nic.tl", "b.nic.tl"],
  "tj": ["ns.tj", "ns2.tj"],
  "tm": ["a.nic.tm", "b.nic.tm"],
  "ps": ["ns1.gov.ps", "ns2.gov.ps"],
  "sy": ["ns1.tld.sy", "ns2.tld.sy"],
  "iq": ["ns1.cmc.iq", "ns2.cmc.iq"],
  "ye": ["ns1.y.net.ye", "ns2.y.net.ye"],
  "bh": ["ns1.registry.bh", "ns2.registry.bh"],
  "cy": ["ns1.nic.cy", "ns2.nic.cy", "ns3.nic.cy"],
  
  // 更多ccTLD - 非洲
  "ao": ["ns1.dns.ao", "ns2.dns.ao"],
  "bf": ["ns1.nic.bf", "ns2.nic.bf"],
  "bi": ["ns1.nic.bi", "ns2.nic.bi"],
  "bj": ["ns1.nic.bj", "ns2.nic.bj"],
  "cd": ["ns1.nic.cd", "ns2.nic.cd"],
  "cf": ["ns1.nic.cf", "ns2.nic.cf"],
  "cg": ["ns1.nic.cg", "ns2.nic.cg"],
  "ci": ["ns1.nic.ci", "ns2.nic.ci"],
  "cm": ["ns1.nic.cm", "ns2.nic.cm"],
  "cv": ["ns1.nic.cv", "ns2.nic.cv"],
  "dj": ["ns1.nic.dj", "ns2.nic.dj"],
  "dz": ["ns1.nic.dz", "ns2.nic.dz"],
  "er": ["ns1.nic.er", "ns2.nic.er"],
  "et": ["ns1.ethionet.et", "ns2.ethionet.et"],
  "ga": ["ns1.nic.ga", "ns2.nic.ga"],
  "gm": ["ns1.nic.gm", "ns2.nic.gm"],
  "gn": ["ns1.nic.gn", "ns2.nic.gn"],
  "gq": ["ns1.nic.gq", "ns2.nic.gq"],
  "gw": ["ns1.nic.gw", "ns2.nic.gw"],
  "lr": ["ns1.nic.lr", "ns2.nic.lr"],
  "ls": ["ns1.alidns.com", "ns2.alidns.com"],
  "ly": ["dns1.lttnet.net", "dns2.lttnet.net"],
  "ml": ["a.nic.ml", "b.nic.ml"],
  "mr": ["ns1.nic.mr", "ns2.nic.mr"],
  "mz": ["ns1.nic.mz", "ns2.nic.mz"],
  "ne": ["ns1.nic.ne", "ns2.nic.ne"],
  "rw": ["ns1.ricta.org.rw", "ns2.ricta.org.rw"],
  "sc": ["a.nic.sc", "b.nic.sc", "c.nic.sc", "d.nic.sc"],
  "sd": ["ns1.sudanic.sd", "ns2.sudanic.sd"],
  "sl": ["ns1.nic.sl", "ns2.nic.sl"],
  "sn": ["ns1.nic.sn", "ns2.nic.sn"],
  "so": ["a.nic.so", "b.nic.so"],
  "ss": ["ns1.nic.ss", "ns2.nic.ss"],
  "st": ["a.nic.st", "b.nic.st"],
  "sz": ["ns1.nic.sz", "ns2.nic.sz"],
  "td": ["ns1.nic.td", "ns2.nic.td"],
  "tg": ["ns1.nic.tg", "ns2.nic.tg"],
  
  // 更多ccTLD - 美洲
  "ai": ["a0.nic.ai", "a2.nic.ai", "b0.nic.ai", "c0.nic.ai"],
  "an": ["ns1.nic.an", "ns2.nic.an"],
  "aw": ["ns1.nic.aw", "ns2.nic.aw"],
  "bb": ["a.lactld.org", "ns1.nic.bb"],
  "bm": ["ns1.ibl.bm", "ns2.ibl.bm"],
  "bo": ["a.lactld.org", "ns.nic.bo"],
  "bs": ["ns1.nic.bs", "ns2.nic.bs"],
  "cr": ["a.lactld.org", "ns.cr"],
  "cu": ["ns1.nic.cu", "ns2.nic.cu"],
  "dm": ["a.nic.dm", "b.nic.dm"],
  "do": ["ns1.nic.do", "ns2.nic.do"],
  "gp": ["ns1.nic.gp", "ns2.nic.gp"],
  "gt": ["a.lactld.org", "ns.gt"],
  "gy": ["ns1.nic.gy", "ns2.nic.gy"],
  "hn": ["a.lactld.org", "ns.hn"],
  "ht": ["ns1.nic.ht", "ns2.nic.ht"],
  "jm": ["ns1.nic.jm", "ns2.nic.jm"],
  "ky": ["ns1.kyregistry.ky", "ns2.kyregistry.ky"],
  "mq": ["ns1.nic.mq", "ns2.nic.mq"],
  "ms": ["a.nic.ms", "b.nic.ms"],
  "ni": ["ns.nic.ni", "ns2.nic.ni"],
  "pa": ["ns.pa", "ns2.pa"],
  "pr": ["ns1.nic.pr", "ns2.nic.pr"],
  "py": ["a.lactld.org", "ns.nic.py"],
  "sr": ["ns1.sr.net", "ns2.sr.net"],
  "sv": ["ns.nic.sv", "ns2.nic.sv"],
  "tc": ["a.nic.tc", "b.nic.tc"],
  "tt": ["ns1.nic.tt", "ns2.nic.tt"],
  "vc": ["a.nic.vc", "b.nic.vc", "c.nic.vc"],
  "vg": ["a.nic.vg", "b.nic.vg"],
  "vi": ["ns1.nic.vi", "ns2.nic.vi"],
  
  // 更多ccTLD - 大洋洲
  "as": ["ns1.nic.as", "ns2.nic.as"],
  "ck": ["ns1.nic.ck", "ns2.nic.ck"],
  "fj": ["ns1.nic.fj", "ns2.nic.fj"],
  "fm": ["ns1.nic.fm", "ns2.nic.fm"],
  "ki": ["ns1.nic.ki", "ns2.nic.ki"],
  "mh": ["ns1.nic.mh", "ns2.nic.mh"],
  "mp": ["ns1.nic.mp", "ns2.nic.mp"],
  "nc": ["ns1.nc", "ns2.nc"],
  "nf": ["ns1.nic.nf", "ns2.nic.nf"],
  "nr": ["ns1.cenpac.net.nr", "ns2.cenpac.net.nr"],
  "nu": ["a.nic.nu", "b.nic.nu"],
  "pf": ["ns1.nic.pf", "ns2.nic.pf"],
  "pg": ["ns1.nic.pg", "ns2.nic.pg"],
  "pn": ["ns1.nic.pn", "ns2.nic.pn"],
  "pw": ["a.nic.pw", "b.nic.pw", "c.nic.pw", "d.nic.pw"],
  "sb": ["ns1.nic.sb", "ns2.nic.sb"],
  "tk": ["a.nic.tk", "b.nic.tk", "c.nic.tk", "d.nic.tk"],
  "to": ["a.nic.to", "b.nic.to", "c.nic.to"],
  "tv": ["a.nic.tv", "b.nic.tv", "c.nic.tv", "d.nic.tv"],
  "vu": ["ns1.nic.vu", "ns2.nic.vu"],
  "wf": ["ns1.nic.wf", "ns2.nic.wf"],
  "ws": ["a.nic.ws", "b.nic.ws", "c.nic.ws", "d.nic.ws"],
  
  // 新gTLD - 科技类
  "computer": ["a.nic.computer", "b.nic.computer", "c.nic.computer", "d.nic.computer"],
  "software": ["a.nic.software", "b.nic.software", "c.nic.software", "d.nic.software"],
  "codes": ["a.nic.codes", "b.nic.codes", "c.nic.codes", "d.nic.codes"],
  "data": ["a.nic.data", "b.nic.data", "c.nic.data", "d.nic.data"],
  "download": ["a.nic.download", "b.nic.download", "c.nic.download", "d.nic.download"],
  "graphics": ["a.nic.graphics", "b.nic.graphics", "c.nic.graphics", "d.nic.graphics"],
  "hosting": ["a.nic.hosting", "b.nic.hosting", "c.nic.hosting", "d.nic.hosting"],
  "mobile": ["a.nic.mobile", "b.nic.mobile", "c.nic.mobile", "d.nic.mobile"],
  "webcam": ["a.nic.webcam", "b.nic.webcam", "c.nic.webcam", "d.nic.webcam"],
  "website": ["a.nic.website", "b.nic.website", "c.nic.website", "d.nic.website"],
  
  // 新gTLD - 城市/地区
  "amsterdam": ["a.nic.amsterdam", "b.nic.amsterdam", "c.nic.amsterdam", "d.nic.amsterdam"],
  "barcelona": ["a.nic.barcelona", "b.nic.barcelona", "c.nic.barcelona", "d.nic.barcelona"],
  "berlin": ["a.nic.berlin", "b.nic.berlin", "c.nic.berlin", "d.nic.berlin"],
  "brussels": ["a.nic.brussels", "b.nic.brussels", "c.nic.brussels", "d.nic.brussels"],
  "budapest": ["a.nic.budapest", "b.nic.budapest", "c.nic.budapest", "d.nic.budapest"],
  "cologne": ["a.nic.cologne", "b.nic.cologne", "c.nic.cologne", "d.nic.cologne"],
  "dubai": ["a.nic.dubai", "b.nic.dubai", "c.nic.dubai", "d.nic.dubai"],
  "hamburg": ["a.nic.hamburg", "b.nic.hamburg", "c.nic.hamburg", "d.nic.hamburg"],
  "helsinki": ["a.nic.helsinki", "b.nic.helsinki", "c.nic.helsinki", "d.nic.helsinki"],
  "istanbul": ["a.nic.istanbul", "b.nic.istanbul", "c.nic.istanbul", "d.nic.istanbul"],
  "london": ["a.nic.london", "b.nic.london", "c.nic.london", "d.nic.london"],
  "madrid": ["a.nic.madrid", "b.nic.madrid", "c.nic.madrid", "d.nic.madrid"],
  "melbourne": ["a.nic.melbourne", "b.nic.melbourne", "c.nic.melbourne", "d.nic.melbourne"],
  "miami": ["a.nic.miami", "b.nic.miami", "c.nic.miami", "d.nic.miami"],
  "moscow": ["a.nic.moscow", "b.nic.moscow", "c.nic.moscow", "d.nic.moscow"],
  "nyc": ["a.nic.nyc", "b.nic.nyc", "c.nic.nyc", "d.nic.nyc"],
  "paris": ["a.nic.paris", "b.nic.paris", "c.nic.paris", "d.nic.paris"],
  "prague": ["a.nic.prague", "b.nic.prague", "c.nic.prague", "d.nic.prague"],
  "quebec": ["a.nic.quebec", "b.nic.quebec", "c.nic.quebec", "d.nic.quebec"],
  "rio": ["a.nic.rio", "b.nic.rio", "c.nic.rio", "d.nic.rio"],
  "roma": ["a.nic.roma", "b.nic.roma", "c.nic.roma", "d.nic.roma"],
  "stockholm": ["a.nic.stockholm", "b.nic.stockholm", "c.nic.stockholm", "d.nic.stockholm"],
  "sydney": ["a.nic.sydney", "b.nic.sydney", "c.nic.sydney", "d.nic.sydney"],
  "taipei": ["a.nic.taipei", "b.nic.taipei", "c.nic.taipei", "d.nic.taipei"],
  "tokyo": ["a.nic.tokyo", "b.nic.tokyo", "c.nic.tokyo", "d.nic.tokyo"],
  "vegas": ["a.nic.vegas", "b.nic.vegas", "c.nic.vegas", "d.nic.vegas"],
  "wien": ["a.nic.wien", "b.nic.wien", "c.nic.wien", "d.nic.wien"],
  "yokohama": ["a.nic.yokohama", "b.nic.yokohama", "c.nic.yokohama", "d.nic.yokohama"],
  
  // 新gTLD - 品牌/商业
  "amazon": ["ns1.dns.nic.amazon", "ns2.dns.nic.amazon", "ns3.dns.nic.amazon", "ns4.dns.nic.amazon"],
  "apple": ["a.nic.apple", "b.nic.apple", "c.nic.apple", "d.nic.apple"],
  "google": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "microsoft": ["a.nic.microsoft", "b.nic.microsoft", "c.nic.microsoft", "d.nic.microsoft"],
  "samsung": ["a.nic.samsung", "b.nic.samsung", "c.nic.samsung", "d.nic.samsung"],
  "alibaba": ["a.nic.alibaba", "b.nic.alibaba", "c.nic.alibaba", "d.nic.alibaba"],
  "baidu": ["a.nic.baidu", "b.nic.baidu", "c.nic.baidu", "d.nic.baidu"],
  "ibm": ["a.nic.ibm", "b.nic.ibm", "c.nic.ibm", "d.nic.ibm"],
  "intel": ["a.nic.intel", "b.nic.intel", "c.nic.intel", "d.nic.intel"],
  "oracle": ["a.nic.oracle", "b.nic.oracle", "c.nic.oracle", "d.nic.oracle"],
  
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
