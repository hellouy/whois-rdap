// WHOIS服务器地址映射
// 用于RDAP失败时的直接WHOIS查询
// 数据来源: IANA WHOIS服务器列表

export const WHOIS_SERVERS: Record<string, string> = {
  // ========== 通用顶级域名 (gTLDs) ==========
  "com": "whois.verisign-grs.com",
  "net": "whois.verisign-grs.com",
  "org": "whois.pir.org",
  "info": "whois.afilias.net",
  "biz": "whois.nic.biz",
  "edu": "whois.educause.edu",
  "gov": "whois.dotgov.gov",
  "mil": "whois.nic.mil",
  "int": "whois.iana.org",
  "arpa": "whois.iana.org",
  "aero": "whois.aero",
  "asia": "whois.nic.asia",
  "coop": "whois.nic.coop",
  "jobs": "whois.nic.jobs",
  "mobi": "whois.afilias.net",
  "museum": "whois.nic.museum",
  "name": "whois.nic.name",
  "post": "whois.dotpostregistry.net",
  "tel": "whois.nic.tel",
  "travel": "whois.nic.travel",
  "xxx": "whois.nic.xxx",
  "cat": "whois.nic.cat",
  "pro": "whois.registrypro.pro",

  // ========== 国家代码顶级域名 (ccTLDs) - 亚洲 ==========
  "cn": "whois.cnnic.cn",
  "jp": "whois.jprs.jp",
  "kr": "whois.kr",
  "in": "whois.registry.in",
  "tw": "whois.twnic.net.tw",
  "hk": "whois.hkirc.hk",
  "sg": "whois.sgnic.sg",
  "my": "whois.mynic.my",
  "th": "whois.thnic.co.th",
  "vn": "whois.vnnic.vn",
  "id": "whois.id",
  "ph": "whois.dot.ph",
  "pk": "whois.pknic.net.pk",
  "bd": "whois.nic.bd",
  "np": "whois.nic.np",
  "lk": "whois.nic.lk",
  "mm": "whois.registry.gov.mm",
  "kh": "whois.nic.kh",
  "la": "whois.nic.la",
  "mn": "whois.nic.mn",
  "kz": "whois.nic.kz",
  "uz": "whois.cctld.uz",
  "kg": "whois.kg",
  "am": "whois.amnic.net",
  "ge": "whois.nic.ge",
  "az": "whois.nic.az",
  "af": "whois.nic.af",
  "mo": "whois.monic.mo",
  "bn": "whois.bnnic.bn",
  "bt": "whois.nic.bt",
  "mv": "whois.nic.mv",
  "tl": "whois.nic.tl",
  "tj": "whois.nic.tj",
  "tm": "whois.nic.tm",

  // ========== 国家代码顶级域名 (ccTLDs) - 中东 ==========
  "ae": "whois.aeda.net.ae",
  "sa": "whois.nic.net.sa",
  "eg": "whois.nic.eg",
  "il": "whois.isoc.org.il",
  "qa": "whois.registry.qa",
  "kw": "whois.nic.kw",
  "om": "whois.registry.om",
  "jo": "whois.dns.jo",
  "lb": "whois.lbdr.org.lb",
  "ps": "whois.pnina.ps",
  "sy": "whois.tld.sy",
  "iq": "whois.cmc.iq",
  "ye": "whois.y.net.ye",
  "bh": "whois.nic.bh",
  "cy": "whois.nic.cy",
  "ir": "whois.nic.ir",

  // ========== 国家代码顶级域名 (ccTLDs) - 欧洲 ==========
  "uk": "whois.nic.uk",
  "de": "whois.denic.de",
  "fr": "whois.nic.fr",
  "it": "whois.nic.it",
  "es": "whois.nic.es",
  "nl": "whois.domain-registry.nl",
  "se": "whois.iis.se",
  "ch": "whois.nic.ch",
  "ru": "whois.tcinet.ru",
  "pl": "whois.dns.pl",
  "gr": "whois.ics.forth.gr",
  "cz": "whois.nic.cz",
  "be": "whois.dns.be",
  "at": "whois.nic.at",
  "dk": "whois.dk-hostmaster.dk",
  "no": "whois.norid.no",
  "fi": "whois.fi",
  "ie": "whois.iedr.ie",
  "pt": "whois.dns.pt",
  "hu": "whois.nic.hu",
  "ro": "whois.rotld.ro",
  "ua": "whois.ua",
  "is": "whois.isnic.is",
  "lu": "whois.dns.lu",
  "mt": "whois.nic.mt",
  "ee": "whois.tld.ee",
  "lv": "whois.nic.lv",
  "lt": "whois.domreg.lt",
  "si": "whois.register.si",
  "sk": "whois.sk-nic.sk",
  "hr": "whois.dns.hr",
  "bg": "whois.register.bg",
  "rs": "whois.rnids.rs",
  "al": "whois.nic.al",
  "ad": "whois.nic.ad",
  "ba": "whois.nic.ba",
  "by": "whois.cctld.by",
  "va": "whois.nic.va",
  "mc": "whois.nic.mc",
  "sm": "whois.nic.sm",
  "li": "whois.nic.li",
  "fo": "whois.nic.fo",
  "gl": "whois.nic.gl",
  "ax": "whois.ax",
  "gg": "whois.gg",
  "je": "whois.je",
  "im": "whois.nic.im",
  "mk": "whois.marnet.mk",
  "me": "whois.nic.me",
  "md": "whois.nic.md",
  "eu": "whois.eu",

  // ========== 国家代码顶级域名 (ccTLDs) - 大洋洲 ==========
  "au": "whois.auda.org.au",
  "nz": "whois.irs.net.nz",
  "as": "whois.nic.as",
  "ck": "whois.nic.ck",
  "fj": "whois.nic.fj",
  "fm": "whois.nic.fm",
  "ki": "whois.nic.ki",
  "mh": "whois.nic.mh",
  "mp": "whois.nic.mp",
  "nc": "whois.nc",
  "nf": "whois.nic.nf",
  "nr": "whois.cenpac.net.nr",
  "nu": "whois.iis.nu",
  "pf": "whois.nic.pf",
  "pg": "whois.nic.pg",
  "pn": "whois.nic.pn",
  "pw": "whois.nic.pw",
  "sb": "whois.nic.sb",
  "tk": "whois.dot.tk",
  "to": "whois.tonic.to",
  "tv": "whois.nic.tv",
  "vu": "whois.nic.vu",
  "wf": "whois.nic.wf",
  "ws": "whois.website.ws",
  "gu": "whois.nic.gu",
  "cc": "ccwhois.verisign-grs.com",
  "cx": "whois.nic.cx",
  "hm": "whois.registry.hm",
  "io": "whois.nic.io",

  // ========== 国家代码顶级域名 (ccTLDs) - 美洲 ==========
  "us": "whois.nic.us",
  "ca": "whois.cira.ca",
  "br": "whois.registro.br",
  "mx": "whois.mx",
  "ar": "whois.nic.ar",
  "cl": "whois.nic.cl",
  "co": "whois.nic.co",
  "pe": "kero.yachay.pe",
  "ve": "whois.nic.ve",
  "uy": "whois.nic.org.uy",
  "ec": "whois.nic.ec",
  "ai": "whois.nic.ai",
  "aw": "whois.nic.aw",
  "bb": "whois.nic.bb",
  "bm": "whois.nic.bm",
  "bo": "whois.nic.bo",
  "bs": "whois.nic.bs",
  "cr": "whois.nic.cr",
  "cu": "whois.nic.cu",
  "cw": "whois.nic.cw",
  "dm": "whois.nic.dm",
  "do": "whois.nic.do",
  "gp": "whois.nic.gp",
  "gt": "whois.nic.gt",
  "gy": "whois.registry.gy",
  "hn": "whois.nic.hn",
  "ht": "whois.nic.ht",
  "jm": "whois.nic.jm",
  "ky": "whois.kyregistry.ky",
  "mq": "whois.nic.mq",
  "ms": "whois.nic.ms",
  "ni": "whois.nic.ni",
  "pa": "whois.nic.pa",
  "pr": "whois.nic.pr",
  "py": "whois.nic.py",
  "sr": "whois.nic.sr",
  "sv": "whois.nic.sv",
  "tc": "whois.nic.tc",
  "tt": "whois.nic.tt",
  "vc": "whois.nic.vc",
  "vg": "whois.nic.vg",
  "vi": "whois.nic.vi",
  "bz": "whois.afilias-grs.info",
  "lc": "whois.afilias-grs.info",
  "ag": "whois.nic.ag",
  "gd": "whois.nic.gd",
  "kn": "whois.nic.kn",
  "sx": "whois.sx",
  "pm": "whois.nic.pm",
  "fk": "whois.nic.fk",
  "gs": "whois.nic.gs",

  // ========== 国家代码顶级域名 (ccTLDs) - 非洲 ==========
  "za": "whois.registry.net.za",
  "ng": "whois.nic.net.ng",
  "ke": "whois.kenic.or.ke",
  "gh": "whois.nic.gh",
  "tn": "whois.ati.tn",
  "ma": "whois.registre.ma",
  "ao": "whois.nic.ao",
  "bf": "whois.nic.bf",
  "bi": "whois.nic.bi",
  "bj": "whois.nic.bj",
  "cd": "whois.nic.cd",
  "cf": "whois.nic.cf",
  "cg": "whois.nic.cg",
  "ci": "whois.nic.ci",
  "cm": "whois.nic.cm",
  "cv": "whois.nic.cv",
  "dj": "whois.nic.dj",
  "dz": "whois.nic.dz",
  "er": "whois.nic.er",
  "et": "whois.nic.et",
  "ga": "whois.nic.ga",
  "gm": "whois.nic.gm",
  "gn": "whois.nic.gn",
  "gq": "whois.nic.gq",
  "gw": "whois.nic.gw",
  "lr": "whois.nic.lr",
  "ls": "whois.nic.ls",
  "ly": "whois.nic.ly",
  "ml": "whois.nic.ml",
  "mr": "whois.nic.mr",
  "mz": "whois.nic.mz",
  "ne": "whois.nic.ne",
  "rw": "whois.ricta.org.rw",
  "sc": "whois.nic.sc",
  "sd": "whois.nic.sd",
  "sl": "whois.nic.sl",
  "sn": "whois.nic.sn",
  "so": "whois.nic.so",
  "ss": "whois.nic.ss",
  "st": "whois.nic.st",
  "sz": "whois.nic.sz",
  "td": "whois.nic.td",
  "tg": "whois.nic.tg",
  "tz": "whois.nic.tz",
  "ug": "whois.nic.ug",
  "zw": "whois.nic.zw",
  "zm": "whois.nic.zm",
  "mw": "whois.nic.mw",
  "mu": "whois.nic.mu",
  "mg": "whois.nic.mg",
  "na": "whois.nic.na",
  "bw": "whois.nic.bw",
  "sh": "whois.nic.sh",
  "ac": "whois.nic.ac",
  "re": "whois.nic.re",
  "yt": "whois.nic.yt",

  // ========== 新通用顶级域名 (New gTLDs) ==========
  "app": "whois.nic.google",
  "dev": "whois.nic.google",
  "page": "whois.nic.google",
  "new": "whois.nic.google",
  "how": "whois.nic.google",
  "soy": "whois.nic.google",
  "day": "whois.nic.google",
  "foo": "whois.nic.google",
  "xyz": "whois.nic.xyz",
  "top": "whois.nic.top",
  "site": "whois.centralnic.com",
  "online": "whois.centralnic.com",
  "store": "whois.centralnic.com",
  "tech": "whois.centralnic.com",
  "club": "whois.nic.club",
  "vip": "whois.nic.vip",
  "blog": "whois.nic.blog",
  "shop": "whois.nic.shop",
  "link": "whois.uniregistry.net",
  "live": "whois.donuts.co",
  // "pro" already defined above
  "wiki": "whois.nic.wiki",
  "cloud": "whois.nic.cloud",
  "news": "whois.donuts.co",
  "world": "whois.donuts.co",
  "network": "whois.donuts.co",
  "design": "whois.nic.design",
  "space": "whois.nic.space",
  "works": "whois.donuts.co",
  "email": "whois.donuts.co",
  "media": "whois.donuts.co",
  "digital": "whois.donuts.co",
  "agency": "whois.donuts.co",
  "studio": "whois.donuts.co",
  "solutions": "whois.donuts.co",
  "group": "whois.donuts.co",
  "company": "whois.donuts.co",
  "global": "whois.nic.global",
  "money": "whois.donuts.co",
  "city": "whois.donuts.co",
  "life": "whois.donuts.co",
  "one": "whois.nic.one",
  "art": "whois.nic.art",
  "fun": "whois.nic.fun",
  "icu": "whois.nic.icu",
  "cyou": "whois.nic.cyou",
  "ltd": "whois.donuts.co",
  "inc": "whois.nic.inc",
  "llc": "whois.afilias.net",

  // ========== IDN TLDs ==========
  "xn--fiqs8s": "whois.cnnic.cn", // 中国
  "xn--fiqz9s": "whois.cnnic.cn", // 中國
  "xn--j6w193g": "whois.hkirc.hk", // 香港
  "xn--kprw13d": "whois.twnic.net.tw", // 台灣
  "xn--kpry57d": "whois.twnic.net.tw", // 台湾
  "xn--wgbh1c": "whois.nic.eg", // مصر
  "xn--80ao21a": "whois.nic.kz", // қаз
  "xn--p1ai": "whois.tcinet.ru", // рф
  "xn--90a3ac": "whois.rnids.rs", // срб
  "xn--y9a3aq": "whois.amnic.net", // հայ
  "xn--mgbx4cd0ab": "whois.mynic.my", // مليسيا
  "xn--mgba3a4f16a": "whois.nic.ir", // ایران
  "xn--mgbtx2b": "whois.cmc.iq", // عراق
  "xn--lgbbat1ad8j": "whois.nic.dz", // الجزائر
  "xn--mgbaam7a8h": "whois.aeda.net.ae", // امارات
  "xn--mgberp4a5d4ar": "whois.nic.net.sa", // السعودية
  "xn--ygbi2ammx": "whois.pnina.ps", // فلسطين
  "xn--wgbl6a": "whois.registry.qa", // قطر
  "xn--mgb9awbf": "whois.registry.om", // عمان
  "xn--mgbai9azgqp6j": "whois.pknic.net.pk", // پاکستان
  "xn--o3cw4h": "whois.thnic.co.th", // ไทย
  "xn--pgbs0dh": "whois.ati.tn", // تونس
  "xn--j1amh": "whois.ua", // укр
  "xn--3e0b707e": "whois.kr", // 한국
  "xn--45brj9c": "whois.registry.in", // ভারত (Bengali)
  "xn--s9brj9c": "whois.registry.in", // ਭਾਰਤ (Gurmukhi)
  "xn--gecrj9c": "whois.registry.in", // ભારત (Gujarati)
  "xn--h2brj9c": "whois.registry.in", // भारत (Devanagari)
  "xn--mgbbh1a71e": "whois.registry.in", // بھارت (Urdu)
  "xn--rvc1e0am3e": "whois.registry.in", // ഭാരതം (Malayalam)
  "xn--fpcrj9c3d": "whois.registry.in", // భారత్ (Telugu)
  "xn--xkc2dl3a5ee0h": "whois.registry.in", // இந்தியா (Tamil)
  "xn--xkc2al3hye2a": "whois.nic.lk", // இலங்கை (Tamil - Sri Lanka)
  "xn--mgbpl2fh": "whois.nic.sd", // سودان
  "xn--mix891f": "whois.monic.mo", // 澳門
  "xn--node": "whois.nic.ge", // გე (Georgia)
  "xn--qxam": "whois.ics.forth.gr", // ελ (Greece)
  "xn--e1a4c": "whois.eu", // ею (EU Cyrillic)
};

// RDAP服务器映射 (优先使用)
export const RDAP_SERVERS: Record<string, string> = {
  // 主要gTLDs
  "com": "https://rdap.verisign.com/com/v1",
  "net": "https://rdap.verisign.com/net/v1",
  "org": "https://rdap.publicinterestregistry.org/rdap",
  "info": "https://rdap.afilias.net/rdap/info",
  "biz": "https://rdap.nic.biz",
  "name": "https://rdap.verisign.com/name/v1",

  // 热门ccTLDs
  "io": "https://rdap.nic.io",
  "co": "https://rdap.nic.co",
  "me": "https://rdap.nic.me",
  "cc": "https://rdap.verisign.com/cc/v1",
  "tv": "https://rdap.verisign.com/tv/v1",

  // 欧洲
  "uk": "https://rdap.nominet.uk/uk",
  "de": "https://rdap.denic.de",
  "fr": "https://rdap.nic.fr",
  "eu": "https://rdap.eurid.eu",
  "nl": "https://rdap.sidn.nl",
  "be": "https://rdap.dns.be",
  "ch": "https://rdap.nic.ch",
  "at": "https://rdap.nic.at",
  "se": "https://rdap.iis.se",
  "no": "https://rdap.norid.no",
  "dk": "https://rdap.dk-hostmaster.dk",
  "fi": "https://rdap.traficom.fi",
  "pl": "https://rdap.dns.pl",
  "cz": "https://rdap.nic.cz",
  "ru": "https://rdap.tcinet.ru",

  // 亚洲
  "jp": "https://rdap.jprs.jp",
  "kr": "https://rdap.kisa.or.kr",
  "cn": "https://rdap.cnnic.cn",
  "tw": "https://rdap.twnic.net.tw",
  "hk": "https://rdap.hkirc.hk",
  "sg": "https://rdap.sgnic.sg",
  "th": "https://rdap.thnic.co.th",
  "vn": "https://rdap.vnnic.vn",
  "id": "https://rdap.pandi.id",
  "my": "https://rdap.mynic.my",
  "ph": "https://rdap.dot.ph",
  "in": "https://rdap.registry.in",

  // 大洋洲
  "au": "https://rdap.auda.org.au",
  "nz": "https://rdap.nzrs.nz",

  // 美洲
  "ca": "https://rdap.ca.fury.ca",
  "br": "https://rdap.registro.br",
  "mx": "https://rdap.mx",
  "us": "https://rdap.nic.us",

  // 新gTLDs (Google)
  "app": "https://rdap.nic.google",
  "dev": "https://rdap.nic.google",
  "page": "https://rdap.nic.google",
  "new": "https://rdap.nic.google",
  "how": "https://rdap.nic.google",
  "soy": "https://rdap.nic.google",
  "day": "https://rdap.nic.google",
  "foo": "https://rdap.nic.google",

  // 新gTLDs (CentralNic)
  "xyz": "https://rdap.nic.xyz",
  "top": "https://rdap.nic.top",
  "site": "https://rdap.centralnic.com/site",
  "online": "https://rdap.centralnic.com/online",
  "store": "https://rdap.centralnic.com/store",
  "tech": "https://rdap.centralnic.com/tech",

  // 其他热门新gTLDs
  "club": "https://rdap.nic.club",
  "vip": "https://rdap.nic.vip",
  "shop": "https://rdap.nic.shop",
  "blog": "https://rdap.nic.blog",
  "pro": "https://rdap.afilias.net/rdap/pro",
  "link": "https://rdap.uniregistry.net/rdap",
  "click": "https://rdap.uniregistry.net/rdap",
  "live": "https://rdap.donuts.co/rdap",
  "cloud": "https://rdap.donuts.co/rdap",
  "icu": "https://rdap.nic.icu",
  "fun": "https://rdap.nic.fun",
  "art": "https://rdap.nic.art",
  "one": "https://rdap.nic.one",
  "ai": "https://rdap.nic.ai",
};

/**
 * 获取域名对应的RDAP服务器
 */
export function getRdapServer(domain: string): string | null {
  const parts = domain.toLowerCase().split('.');
  const tld = parts[parts.length - 1];
  return RDAP_SERVERS[tld] || null;
}

/**
 * 获取域名对应的WHOIS服务器
 */
export function getWhoisServer(domain: string): string | null {
  const parts = domain.toLowerCase().split('.');
  const tld = parts[parts.length - 1];
  return WHOIS_SERVERS[tld] || null;
}

/**
 * 检查TLD是否支持查询
 */
export function isTldSupported(tld: string): boolean {
  const normalizedTld = tld.toLowerCase().replace(/^\./, '');
  return RDAP_SERVERS[normalizedTld] !== undefined || WHOIS_SERVERS[normalizedTld] !== undefined;
}
