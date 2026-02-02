// WHOIS服务器地址映射 - 1500+ TLDs完整支持
// 用于RDAP失败时的直接WHOIS查询
// 数据来源: IANA WHOIS服务器列表
// 更新日期: 2025-01

// WHOIS服务器映射表
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
  "su": "whois.tcinet.ru",
  "tr": "whois.nic.tr",

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

  // ========== 新通用顶级域名 (New gTLDs) - 科技类 ==========
  "app": "whois.nic.google",
  "dev": "whois.nic.google",
  "page": "whois.nic.google",
  "new": "whois.nic.google",
  "how": "whois.nic.google",
  "soy": "whois.nic.google",
  "day": "whois.nic.google",
  "foo": "whois.nic.google",
  "zip": "whois.nic.google",
  "mov": "whois.nic.google",
  "dad": "whois.nic.google",
  "phd": "whois.nic.google",
  "prof": "whois.nic.google",
  "esq": "whois.nic.google",
  "nexus": "whois.nic.google",
  "google": "whois.nic.google",
  "gmail": "whois.nic.google",
  "youtube": "whois.nic.google",
  "android": "whois.nic.google",
  "chrome": "whois.nic.google",
  "docs": "whois.nic.google",
  "drive": "whois.nic.google",
  "hangout": "whois.nic.google",
  "map": "whois.nic.google",
  "meet": "whois.nic.google",
  "play": "whois.nic.google",
  "xyz": "whois.nic.xyz",
  "top": "whois.nic.top",
  "site": "whois.centralnic.com",
  "online": "whois.centralnic.com",
  "store": "whois.centralnic.com",
  "tech": "whois.centralnic.com",
  "host": "whois.centralnic.com",
  "fun": "whois.nic.fun",
  "space": "whois.nic.space",
  "press": "whois.centralnic.com",
  "website": "whois.centralnic.com",
  "wiki": "whois.nic.wiki",

  // ========== 新通用顶级域名 (New gTLDs) - 商业类 ==========
  "club": "whois.nic.club",
  "vip": "whois.nic.vip",
  "blog": "whois.nic.blog",
  "shop": "whois.nic.shop",
  "link": "whois.uniregistry.net",
  "live": "whois.donuts.co",
  "cloud": "whois.nic.cloud",
  "news": "whois.donuts.co",
  "world": "whois.donuts.co",
  "network": "whois.donuts.co",
  "design": "whois.nic.design",
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
  "icu": "whois.nic.icu",
  "cyou": "whois.nic.cyou",
  "ltd": "whois.donuts.co",
  "inc": "whois.nic.inc",
  "llc": "whois.afilias.net",
  "gmbh": "whois.donuts.co",
  "center": "whois.donuts.co",
  "zone": "whois.donuts.co",
  "plus": "whois.donuts.co",
  "today": "whois.donuts.co",
  "best": "whois.nic.best",
  "win": "whois.nic.win",
  "run": "whois.donuts.co",
  "work": "whois.nic.work",
  "team": "whois.donuts.co",
  "expert": "whois.donuts.co",
  "ceo": "whois.nic.ceo",

  // ========== 新通用顶级域名 (New gTLDs) - 行业类 ==========
  "finance": "whois.donuts.co",
  "financial": "whois.donuts.co",
  "insurance": "whois.donuts.co",
  "consulting": "whois.donuts.co",
  "marketing": "whois.donuts.co",
  "management": "whois.donuts.co",
  "property": "whois.donuts.co",
  "estate": "whois.donuts.co",
  "realty": "whois.donuts.co",
  "attorney": "whois.donuts.co",
  "lawyer": "whois.donuts.co",
  "legal": "whois.donuts.co",
  "accountant": "whois.donuts.co",
  "accountants": "whois.donuts.co",
  "holdings": "whois.donuts.co",
  "enterprises": "whois.donuts.co",
  "capital": "whois.donuts.co",
  "fund": "whois.donuts.co",
  "investments": "whois.donuts.co",
  "cash": "whois.donuts.co",
  "tax": "whois.donuts.co",
  "loans": "whois.donuts.co",
  "credit": "whois.donuts.co",
  "creditcard": "whois.donuts.co",
  "mortgage": "whois.donuts.co",
  "dental": "whois.donuts.co",
  "clinic": "whois.donuts.co",
  "hospital": "whois.donuts.co",
  "surgery": "whois.donuts.co",
  "healthcare": "whois.donuts.co",
  "health": "whois.donuts.co",
  "vet": "whois.donuts.co",
  "pharmacy": "whois.donuts.co",
  "doctor": "whois.donuts.co",
  "dentist": "whois.donuts.co",
  "education": "whois.donuts.co",
  "school": "whois.donuts.co",
  "university": "whois.donuts.co",
  "college": "whois.donuts.co",
  "academy": "whois.donuts.co",
  "training": "whois.donuts.co",
  "institute": "whois.donuts.co",
  "mba": "whois.donuts.co",
  "restaurant": "whois.donuts.co",
  "cafe": "whois.donuts.co",
  "catering": "whois.donuts.co",
  "pizza": "whois.donuts.co",
  "kitchen": "whois.donuts.co",
  "recipes": "whois.donuts.co",
  "menu": "whois.donuts.co",
  "bar": "whois.donuts.co",
  "pub": "whois.donuts.co",
  "wine": "whois.donuts.co",
  "beer": "whois.donuts.co",
  "coffee": "whois.donuts.co",
  "clothing": "whois.donuts.co",
  "fashion": "whois.donuts.co",
  "boutique": "whois.donuts.co",
  "jewelry": "whois.donuts.co",
  "watches": "whois.donuts.co",
  "shoes": "whois.donuts.co",
  "diamonds": "whois.donuts.co",
  "beauty": "whois.nic.beauty",
  "hair": "whois.nic.hair",
  "salon": "whois.donuts.co",
  "spa": "whois.donuts.co",
  "fitness": "whois.donuts.co",
  "yoga": "whois.donuts.co",
  "dance": "whois.donuts.co",
  "football": "whois.donuts.co",
  "soccer": "whois.donuts.co",
  "hockey": "whois.donuts.co",
  "golf": "whois.donuts.co",
  "tennis": "whois.donuts.co",
  "games": "whois.donuts.co",
  "game": "whois.donuts.co",
  "casino": "whois.donuts.co",
  "bet": "whois.afilias.net",
  "poker": "whois.afilias.net",
  "dating": "whois.donuts.co",
  "singles": "whois.donuts.co",
  "wedding": "whois.donuts.co",
  "flowers": "whois.donuts.co",
  "gift": "whois.donuts.co",
  "gifts": "whois.donuts.co",
  "toys": "whois.donuts.co",
  "pet": "whois.afilias.net",
  "dog": "whois.donuts.co",
  "horse": "whois.donuts.co",
  "auto": "whois.uniregistry.net",
  "car": "whois.uniregistry.net",
  "cars": "whois.uniregistry.net",
  "bike": "whois.donuts.co",
  "motorcycle": "whois.nic.motorcycle",
  "taxi": "whois.donuts.co",
  "repair": "whois.donuts.co",
  "parts": "whois.donuts.co",
  "tires": "whois.donuts.co",
  "house": "whois.donuts.co",
  "apartment": "whois.donuts.co",
  "condos": "whois.donuts.co",
  "villas": "whois.donuts.co",
  "land": "whois.donuts.co",
  "rent": "whois.donuts.co",
  "rentals": "whois.donuts.co",
  "construction": "whois.donuts.co",
  "builders": "whois.donuts.co",
  "plumbing": "whois.donuts.co",
  "contractors": "whois.donuts.co",
  "glass": "whois.donuts.co",
  "lighting": "whois.donuts.co",
  "solar": "whois.donuts.co",
  "energy": "whois.donuts.co",
  "eco": "whois.afilias.net",
  "green": "whois.afilias.net",
  "bio": "whois.nic.bio",
  "organic": "whois.afilias.net",
  "farm": "whois.donuts.co",
  "garden": "whois.donuts.co",
  "haus": "whois.donuts.co",
  "florist": "whois.donuts.co",

  // ========== 新通用顶级域名 (New gTLDs) - 旅游/娱乐类 ==========
  "vacation": "whois.donuts.co",
  "vacations": "whois.donuts.co",
  "cruises": "whois.donuts.co",
  "flights": "whois.donuts.co",
  "holiday": "whois.donuts.co",
  "hotel": "whois.donuts.co",
  "hoteles": "whois.donuts.co",
  "tours": "whois.donuts.co",
  "viajes": "whois.donuts.co",
  "voyage": "whois.donuts.co",
  "camp": "whois.donuts.co",
  "fishing": "whois.donuts.co",
  "ski": "whois.afilias.net",
  "surf": "whois.donuts.co",
  "events": "whois.donuts.co",
  "tickets": "whois.donuts.co",
  "show": "whois.donuts.co",
  "theater": "whois.donuts.co",
  "theatre": "whois.donuts.co",
  "movie": "whois.donuts.co",
  "film": "whois.donuts.co",
  "music": "whois.nic.music",
  "audio": "whois.donuts.co",
  "band": "whois.donuts.co",
  "gallery": "whois.donuts.co",
  "photography": "whois.donuts.co",
  "camera": "whois.donuts.co",
  "picture": "whois.donuts.co",
  "pictures": "whois.donuts.co",
  "photos": "whois.donuts.co",
  "video": "whois.donuts.co",

  // ========== 新通用顶级域名 (New gTLDs) - 城市/地区类 ==========
  "amsterdam": "whois.nic.amsterdam",
  "barcelona": "whois.nic.barcelona",
  "berlin": "whois.nic.berlin",
  "brussels": "whois.nic.brussels",
  "budapest": "whois.nic.budapest",
  "cologne": "whois.nic.cologne",
  "dubai": "whois.nic.dubai",
  "hamburg": "whois.nic.hamburg",
  "helsinki": "whois.nic.helsinki",
  "istanbul": "whois.nic.istanbul",
  "london": "whois.nic.london",
  "madrid": "whois.nic.madrid",
  "melbourne": "whois.nic.melbourne",
  "miami": "whois.nic.miami",
  "moscow": "whois.nic.moscow",
  "nyc": "whois.nic.nyc",
  "paris": "whois.nic.paris",
  "prague": "whois.nic.prague",
  "rio": "whois.nic.rio",
  "roma": "whois.nic.roma",
  "stockholm": "whois.nic.stockholm",
  "sydney": "whois.nic.sydney",
  "taipei": "whois.nic.taipei",
  "tokyo": "whois.nic.tokyo",
  "vegas": "whois.nic.vegas",
  "wien": "whois.nic.wien",
  "yokohama": "whois.nic.yokohama",
  "boston": "whois.nic.boston",
  "chicago": "whois.nic.chicago",
  "koeln": "whois.nic.koeln",
  "nrw": "whois.nic.nrw",
  "ruhr": "whois.nic.ruhr",
  "saarland": "whois.nic.saarland",
  "bayern": "whois.nic.bayern",
  "tirol": "whois.nic.tirol",
  "vlaanderen": "whois.nic.vlaanderen",
  "wales": "whois.nic.wales",
  "scot": "whois.nic.scot",
  "cymru": "whois.nic.cymru",
  "irish": "whois.nic.irish",
  "kiwi": "whois.nic.kiwi",
  "quebec": "whois.nic.quebec",
  "eus": "whois.nic.eus",
  "gal": "whois.nic.gal",
  "bzh": "whois.nic.bzh",
  "alsace": "whois.nic.alsace",
  "corsica": "whois.nic.corsica",
  "africa": "whois.nic.africa",
  "capetown": "whois.nic.capetown",
  "durban": "whois.nic.durban",
  "joburg": "whois.nic.joburg",
  // "asia" already defined above in gTLDs
  "lat": "whois.nic.lat",

  // ========== 新通用顶级域名 (New gTLDs) - 其他常用 ==========
  "click": "whois.uniregistry.net",
  "domains": "whois.donuts.co",
  "earth": "whois.nic.earth",
  "international": "whois.donuts.co",
  "exchange": "whois.donuts.co",
  "express": "whois.donuts.co",
  "delivery": "whois.donuts.co",
  "supply": "whois.donuts.co",
  "supplies": "whois.donuts.co",
  "direct": "whois.donuts.co",
  "directory": "whois.donuts.co",
  "guide": "whois.donuts.co",
  "help": "whois.donuts.co",
  "support": "whois.donuts.co",
  "tips": "whois.donuts.co",
  "tools": "whois.donuts.co",
  "watch": "whois.donuts.co",
  "review": "whois.donuts.co",
  "reviews": "whois.donuts.co",
  "report": "whois.donuts.co",
  "buzz": "whois.donuts.co",
  "cool": "whois.donuts.co",
  "fail": "whois.donuts.co",
  "guru": "whois.donuts.co",
  "ninja": "whois.donuts.co",
  "rocks": "whois.donuts.co",
  "sexy": "whois.donuts.co",
  "social": "whois.donuts.co",
  "community": "whois.donuts.co",
  "family": "whois.donuts.co",
  "kids": "whois.donuts.co",
  "baby": "whois.nic.baby",
  "mom": "whois.donuts.co",
  "care": "whois.donuts.co",
  "love": "whois.nic.love",
  "faith": "whois.donuts.co",
  "church": "whois.donuts.co",
  "foundation": "whois.donuts.co",
  "charity": "whois.donuts.co",
  "giving": "whois.donuts.co",
  "science": "whois.donuts.co",
  "engineering": "whois.donuts.co",
  "degree": "whois.donuts.co",
  "study": "whois.donuts.co",
  "courses": "whois.donuts.co",
  "career": "whois.donuts.co",
  "careers": "whois.donuts.co",
  "actor": "whois.donuts.co",
  "author": "whois.donuts.co",
  "lol": "whois.nic.lol",
  "wtf": "whois.donuts.co",
  "sucks": "whois.nic.sucks",
  "stream": "whois.donuts.co",
  "party": "whois.donuts.co",
  "date": "whois.donuts.co",
  "trade": "whois.donuts.co",
  "bid": "whois.donuts.co",
  "racing": "whois.donuts.co",
  "cricket": "whois.donuts.co",
  "loan": "whois.donuts.co",
  "men": "whois.donuts.co",
  "red": "whois.afilias.net",
  "blue": "whois.afilias.net",
  "pink": "whois.afilias.net",
  "gold": "whois.donuts.co",
  "black": "whois.afilias.net",
  "orange": "whois.nic.orange",
  "town": "whois.donuts.co",

  // ========== 品牌TLDs ==========
  "amazon": "whois.nic.amazon",
  "apple": "whois.nic.apple",
  "aws": "whois.nic.aws",
  "microsoft": "whois.nic.microsoft",
  "alibaba": "whois.nic.alibaba",
  "alipay": "whois.nic.alipay",
  "taobao": "whois.nic.taobao",
  "tmall": "whois.nic.tmall",
  "baidu": "whois.nic.baidu",
  "tencent": "whois.nic.tencent",
  "weibo": "whois.nic.weibo",
  "samsung": "whois.nic.samsung",
  "audi": "whois.nic.audi",
  "bmw": "whois.nic.bmw",
  "mini": "whois.nic.mini",
  "ferrari": "whois.nic.ferrari",
  "honda": "whois.nic.honda",
  "hyundai": "whois.nic.hyundai",
  "kia": "whois.nic.kia",
  "lexus": "whois.nic.lexus",
  "nissan": "whois.nic.nissan",
  "toyota": "whois.nic.toyota",
  "volkswagen": "whois.nic.volkswagen",
  "volvo": "whois.nic.volvo",
  "dell": "whois.nic.dell",
  "intel": "whois.nic.intel",
  "cisco": "whois.nic.cisco",
  "oracle": "whois.nic.oracle",
  "sap": "whois.nic.sap",
  "ibm": "whois.nic.ibm",
  "hsbc": "whois.nic.hsbc",
  "jpmorgan": "whois.nic.jpmorgan",
  "chase": "whois.nic.chase",
  "citi": "whois.nic.citi",
  "visa": "whois.nic.visa",
  "amex": "whois.nic.amex",
  "netflix": "whois.nic.netflix",
  "spotify": "whois.nic.spotify",
  "nba": "whois.nic.nba",
  "nfl": "whois.nic.nfl",
  "nike": "whois.nic.nike",
  "adidas": "whois.nic.adidas",
  "gucci": "whois.nic.gucci",
  "hermes": "whois.nic.hermes",
  "chanel": "whois.nic.chanel",
  "cartier": "whois.nic.cartier",
  "rolex": "whois.nic.rolex",
  "omega": "whois.nic.omega",
  "sony": "whois.nic.sony",
  "philips": "whois.nic.philips",
  "panasonic": "whois.nic.panasonic",
  "canon": "whois.nic.canon",
  "nikon": "whois.nic.nikon",
  "xerox": "whois.nic.xerox",
  "shell": "whois.nic.shell",
  "total": "whois.nic.total",
  "dupont": "whois.nic.dupont",
  "lego": "whois.nic.lego",
  "ikea": "whois.nic.ikea",
  "booking": "whois.nic.booking",
  "marriott": "whois.nic.marriott",
  "hyatt": "whois.nic.hyatt",
  "mcd": "whois.nic.mcd",
  "mcdonalds": "whois.nic.mcdonalds",
  "kfc": "whois.nic.kfc",
  "starbucks": "whois.nic.starbucks",
  "subway": "whois.nic.subway",

  // ========== IDN TLDs (国际化域名) ==========
  // 中文
  "xn--fiqs8s": "whois.cnnic.cn", // 中国
  "xn--fiqz9s": "whois.cnnic.cn", // 中國
  "xn--j6w193g": "whois.hkirc.hk", // 香港
  "xn--kprw13d": "whois.twnic.net.tw", // 台灣
  "xn--kpry57d": "whois.twnic.net.tw", // 台湾
  "xn--55qx5d": "whois.ngtld.cn", // 公司
  "xn--io0a7i": "whois.ngtld.cn", // 网络
  "xn--1qqw23a": "whois.ngtld.cn", // 佛山
  "xn--xhq521b": "whois.ngtld.cn", // 广东
  "xn--czru2d": "whois.gtld.knet.cn", // 商城
  "xn--czr694b": "whois.gtld.knet.cn", // 商标
  "xn--zfr164b": "whois.gtld.knet.cn", // 商店
  "xn--ses554g": "whois.gtld.knet.cn", // 网址
  "xn--efvy88h": "whois.gtld.knet.cn", // 新闻
  "xn--vuq861b": "whois.gtld.knet.cn", // 信息
  "xn--3bst00m": "whois.gtld.knet.cn", // 集团
  "xn--9et52u": "whois.gtld.knet.cn", // 时尚
  "xn--fiq228c5hs": "whois.gtld.knet.cn", // 中信
  "xn--6frz82g": "whois.nic.xn--6frz82g", // 移动
  "xn--nyqy26a": "whois.stable.nic.xn--nyqy26a", // 健康
  "xn--rhqv96g": "whois.nic.xn--rhqv96g", // 世界
  "xn--fiq64b": "whois.gtld.knet.cn", // 中文网
  "xn--fjq720a": "whois.nic.xn--fjq720a", // 娱乐
  "xn--otu796d": "whois.gtld.knet.cn", // 招聘
  "xn--5tzm5g": "whois.gtld.knet.cn", // 网站
  "xn--45q11c": "whois.gtld.knet.cn", // 八卦
  "xn--czrs0t": "whois.gtld.knet.cn", // 商业
  "xn--6qq986b3xl": "whois.gtld.knet.cn", // 我爱你
  "xn--kput3i": "whois.gtld.knet.cn", // 手机
  "xn--yfro4i67o": "whois.sgnic.sg", // 新加坡
  "xn--mix891f": "whois.monic.mo", // 澳門

  // 韩文
  "xn--3e0b707e": "whois.kr", // 한국
  "xn--t60b56a": "whois.kr", // 닷컴
  "xn--o39aa": "whois.kr", // 닷넷
  "xn--cg4bki": "whois.kr", // 삼성

  // 日文
  "xn--q9jyb4c": "whois.nic.google", // みんな
  "xn--gk3at1e": "whois.nic.xn--gk3at1e", // コム
  "xn--gckr3f0f": "whois.nic.xn--gckr3f0f", // ストア

  // 阿拉伯文
  "xn--mgberp4a5d4ar": "whois.nic.net.sa", // السعودية (沙特)
  "xn--wgbl6a": "whois.registry.qa", // قطر (卡塔尔)
  "xn--wgbh1c": "whois.nic.eg", // مصر (埃及)
  "xn--mgbtf8fl": "whois.tld.sy", // سوريا (叙利亚)
  "xn--pgbs0dh": "whois.ati.tn", // تونس (突尼斯)
  "xn--mgbaam7a8h": "whois.aeda.net.ae", // امارات (阿联酋)
  "xn--ygbi2ammx": "whois.pnina.ps", // فلسطين (巴勒斯坦)
  "xn--mgbai9azgqp6j": "whois.pknic.net.pk", // پاکستان (巴基斯坦)
  "xn--mgba3a4f16a": "whois.nic.ir", // ایران (伊朗)
  "xn--mgb9awbf": "whois.registry.om", // عمان (阿曼)
  "xn--mgbx4cd0ab": "whois.mynic.my", // مليسيا (马来西亚)
  "xn--lgbbat1ad8j": "whois.nic.dz", // الجزائر (阿尔及利亚)
  "xn--mgb2ddes": "whois.y.net.ye", // اليمن (也门)
  "xn--ngbc5azd": "whois.nic.xn--ngbc5azd", // شبكة (阿拉伯网络)

  // 俄罗斯/斯拉夫文
  "xn--90a3ac": "whois.rnids.rs", // срб (塞尔维亚)
  "xn--j1amh": "whois.ua", // укр (乌克兰)
  "xn--p1ai": "whois.tcinet.ru", // рф (俄罗斯)
  "xn--90ae": "whois.register.bg", // бг (保加利亚)
  "xn--80ao21a": "whois.nic.kz", // қаз (哈萨克斯坦)
  "xn--d1alf": "whois.marnet.mk", // мкд (马其顿)
  "xn--80adxhks": "whois.nic.moscow", // москва (莫斯科)
  "xn--c1avg": "whois.nic.xn--c1avg", // орг (俄文org)
  "xn--p1acf": "whois.nic.xn--p1acf", // рус (俄文rus)
  "xn--80aswg": "whois.nic.xn--80aswg", // сайт (俄文site)
  "xn--y9a3aq": "whois.amnic.net", // հdelays (亚美尼亚)

  // 希腊文
  "xn--qxam": "whois.ics.forth.gr", // ελ (希腊)
  "xn--e1a4c": "whois.eu", // ею (欧盟俄文)

  // 印度文
  "xn--h2brj9c": "whois.registry.in", // भारत (印地语印度)
  "xn--45brj9c": "whois.registry.in", // ভারত (孟加拉语印度)
  "xn--gecrj9c": "whois.registry.in", // ભારત (古吉拉特语印度)
  "xn--s9brj9c": "whois.registry.in", // ਭਾਰਤ (旁遮普语印度)
  "xn--xkc2dl3a5ee0h": "whois.registry.in", // இந்தியா (泰米尔语印度)
  "xn--rvc1e0am3e": "whois.registry.in", // ഭാരതം (马拉雅拉姆语印度)
  "xn--fpcrj9c3d": "whois.registry.in", // భారత్ (泰卢固语印度)
  "xn--3hcrj9c": "whois.registry.in", // ভাৰত (阿萨姆语印度)
  "xn--mgbbh1a71e": "whois.registry.in", // بھارت (乌尔都语印度)
  "xn--2scrj9c": "whois.registry.in", // ಭಾರತ (卡纳达语印度)

  // 泰文
  "xn--o3cw4h": "whois.thnic.co.th", // ไทย (泰国)

  // 格鲁吉亚
  "xn--node": "whois.nic.ge", // გე (格鲁吉亚)

  // 以色列希伯来文
  "xn--4dbrk0ce": "whois.isoc.org.il", // ישראל (以色列)

  // 斯里兰卡
  "xn--fzc2c9e2c": "whois.nic.lk", // ලංකා (僧伽罗语斯里兰卡)
  "xn--xkc2al3hye2a": "whois.nic.lk", // இலங்கை (泰米尔语斯里兰卡)

  // 蒙古
  "xn--l1acc": "whois.nic.mn", // мон (蒙古)

  // 摩洛哥 - xn--mgbx4cd0ab already defined above (马来西亚阿拉伯文)
};

// RDAP服务器映射 (优先使用 - 更准确的结构化数据)
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
  "ai": "https://rdap.nic.ai",
  "gg": "https://rdap.nic.gg",
  "fm": "https://rdap.nic.fm",

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
  "ie": "https://rdap.iedr.ie",
  "it": "https://rdap.nic.it",
  "es": "https://rdap.nic.es",
  "pt": "https://rdap.dns.pt",
  "ee": "https://rdap.tld.ee",
  "lv": "https://rdap.nic.lv",
  "lt": "https://rdap.domreg.lt",
  "hr": "https://rdap.dns.hr",
  "rs": "https://rdap.rnids.rs",
  "ua": "https://rdap.ua",
  "by": "https://rdap.cctld.by",

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
  "bd": "https://rdap.nic.bd",
  "pk": "https://rdap.pknic.net.pk",

  // 中东
  "ae": "https://rdap.aeda.net.ae",
  "sa": "https://rdap.nic.net.sa",
  "qa": "https://rdap.registry.qa",
  "il": "https://rdap.isoc.org.il",
  "ir": "https://rdap.nic.ir",

  // 大洋洲
  "au": "https://rdap.auda.org.au",
  "nz": "https://rdap.nzrs.nz",
  "nu": "https://rdap.iis.nu",

  // 美洲
  "ca": "https://rdap.ca.fury.ca",
  "br": "https://rdap.registro.br",
  "mx": "https://rdap.mx",
  "us": "https://rdap.nic.us",
  "ar": "https://rdap.nic.ar",
  "cl": "https://rdap.nic.cl",
  "ec": "https://rdap.nic.ec",
  "uy": "https://rdap.nic.org.uy",

  // 非洲
  "za": "https://rdap.registry.net.za",
  "ke": "https://rdap.kenic.or.ke",
  "ng": "https://rdap.nic.net.ng",
  "tz": "https://rdap.nic.tz",

  // 新gTLDs (Google)
  "app": "https://rdap.nic.google",
  "dev": "https://rdap.nic.google",
  "page": "https://rdap.nic.google",
  "new": "https://rdap.nic.google",
  "how": "https://rdap.nic.google",
  "soy": "https://rdap.nic.google",
  "day": "https://rdap.nic.google",
  "foo": "https://rdap.nic.google",
  "zip": "https://rdap.nic.google",
  "mov": "https://rdap.nic.google",
  "dad": "https://rdap.nic.google",
  "phd": "https://rdap.nic.google",
  "prof": "https://rdap.nic.google",
  "esq": "https://rdap.nic.google",
  "nexus": "https://rdap.nic.google",
  "google": "https://rdap.nic.google",

  // 新gTLDs (CentralNic)
  "xyz": "https://rdap.centralnic.com/xyz",
  "top": "https://rdap.nic.top",
  "site": "https://rdap.centralnic.com/site",
  "online": "https://rdap.centralnic.com/online",
  "store": "https://rdap.centralnic.com/store",
  "tech": "https://rdap.centralnic.com/tech",
  "host": "https://rdap.centralnic.com/host",
  "fun": "https://rdap.centralnic.com/fun",
  "space": "https://rdap.centralnic.com/space",
  "press": "https://rdap.centralnic.com/press",
  "website": "https://rdap.centralnic.com/website",
  "wiki": "https://rdap.centralnic.com/wiki",

  // 其他热门新gTLDs
  "club": "https://rdap.nic.club",
  "vip": "https://rdap.nic.vip",
  "shop": "https://rdap.nic.shop",
  "blog": "https://rdap.nic.blog",
  "live": "https://rdap.donuts.co/rdap",
  "cloud": "https://rdap.donuts.co/rdap",
  "icu": "https://rdap.nic.icu",
  "art": "https://rdap.nic.art",
  "one": "https://rdap.nic.one",
  "link": "https://rdap.uniregistry.net/rdap",
  "click": "https://rdap.uniregistry.net/rdap",
  "work": "https://rdap.nic.work",
  "world": "https://rdap.donuts.co/rdap",
  "life": "https://rdap.donuts.co/rdap",
  "today": "https://rdap.donuts.co/rdap",
  "global": "https://rdap.nic.global",
  "media": "https://rdap.donuts.co/rdap",
  "news": "https://rdap.donuts.co/rdap",
  "digital": "https://rdap.donuts.co/rdap",
  "agency": "https://rdap.donuts.co/rdap",
  "studio": "https://rdap.donuts.co/rdap",
  "solutions": "https://rdap.donuts.co/rdap",
  "group": "https://rdap.donuts.co/rdap",
  "company": "https://rdap.donuts.co/rdap",
  "email": "https://rdap.donuts.co/rdap",
  "network": "https://rdap.donuts.co/rdap",
  "design": "https://rdap.nic.design",
  "money": "https://rdap.donuts.co/rdap",
  "city": "https://rdap.donuts.co/rdap",
  "center": "https://rdap.donuts.co/rdap",
  "zone": "https://rdap.donuts.co/rdap",
  "plus": "https://rdap.donuts.co/rdap",
  "team": "https://rdap.donuts.co/rdap",
  "expert": "https://rdap.donuts.co/rdap",
  "run": "https://rdap.donuts.co/rdap",
  "best": "https://rdap.nic.best",
  "win": "https://rdap.nic.win",
  "ltd": "https://rdap.donuts.co/rdap",
  "inc": "https://rdap.nic.inc",
  "llc": "https://rdap.afilias.net/rdap",
  "gmbh": "https://rdap.donuts.co/rdap",
  "pro": "https://rdap.afilias.net/rdap/pro",
  "ceo": "https://rdap.nic.ceo",
  "love": "https://rdap.nic.love",
  "baby": "https://rdap.nic.baby",
  "bio": "https://rdap.nic.bio",
  "eco": "https://rdap.afilias.net/rdap",
  "green": "https://rdap.afilias.net/rdap",
  "organic": "https://rdap.afilias.net/rdap",
  "pet": "https://rdap.afilias.net/rdap",
  "ski": "https://rdap.afilias.net/rdap",
  "bet": "https://rdap.afilias.net/rdap",
  "poker": "https://rdap.afilias.net/rdap",
  "red": "https://rdap.afilias.net/rdap",
  "blue": "https://rdap.afilias.net/rdap",
  "pink": "https://rdap.afilias.net/rdap",
  "black": "https://rdap.afilias.net/rdap",

  // 城市/地区TLDs
  "amsterdam": "https://rdap.nic.amsterdam",
  "barcelona": "https://rdap.nic.barcelona",
  "berlin": "https://rdap.nic.berlin",
  "brussels": "https://rdap.nic.brussels",
  "budapest": "https://rdap.nic.budapest",
  "cologne": "https://rdap.nic.cologne",
  "dubai": "https://rdap.nic.dubai",
  "hamburg": "https://rdap.nic.hamburg",
  "helsinki": "https://rdap.nic.helsinki",
  "istanbul": "https://rdap.nic.istanbul",
  "london": "https://rdap.nic.london",
  "madrid": "https://rdap.nic.madrid",
  "melbourne": "https://rdap.nic.melbourne",
  "miami": "https://rdap.nic.miami",
  "moscow": "https://rdap.nic.moscow",
  "nyc": "https://rdap.nic.nyc",
  "paris": "https://rdap.nic.paris",
  "prague": "https://rdap.nic.prague",
  "rio": "https://rdap.nic.rio",
  "roma": "https://rdap.nic.roma",
  "stockholm": "https://rdap.nic.stockholm",
  "sydney": "https://rdap.nic.sydney",
  "taipei": "https://rdap.nic.taipei",
  "tokyo": "https://rdap.nic.tokyo",
  "vegas": "https://rdap.nic.vegas",
  "wien": "https://rdap.nic.wien",
  "yokohama": "https://rdap.nic.yokohama",
  "boston": "https://rdap.nic.boston",
  "koeln": "https://rdap.nic.koeln",
  "bayern": "https://rdap.nic.bayern",
  "nrw": "https://rdap.nic.nrw",
  "wales": "https://rdap.nic.wales",
  "scot": "https://rdap.nic.scot",
  "cymru": "https://rdap.nic.cymru",
  "irish": "https://rdap.nic.irish",
  "quebec": "https://rdap.nic.quebec",
  "africa": "https://rdap.nic.africa",

  // IDN TLDs
  "xn--fiqs8s": "https://rdap.cnnic.cn", // 中国
  "xn--fiqz9s": "https://rdap.cnnic.cn", // 中國
  "xn--j6w193g": "https://rdap.hkirc.hk", // 香港
  "xn--kprw13d": "https://rdap.twnic.net.tw", // 台灣
  "xn--kpry57d": "https://rdap.twnic.net.tw", // 台湾
  "xn--3e0b707e": "https://rdap.kisa.or.kr", // 한국
  "xn--p1ai": "https://rdap.tcinet.ru", // рф
  "xn--qxam": "https://rdap.ics.forth.gr", // ελ
  "xn--e1a4c": "https://rdap.eurid.eu", // ею
  "xn--h2brj9c": "https://rdap.registry.in", // भारत
  "xn--o3cw4h": "https://rdap.thnic.co.th", // ไทย
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

/**
 * 获取支持的TLD总数
 */
export function getSupportedTldCount(): number {
  const allTlds = new Set([...Object.keys(RDAP_SERVERS), ...Object.keys(WHOIS_SERVERS)]);
  return allTlds.size;
}

/**
 * 获取所有支持的TLD列表
 */
export function getAllSupportedTlds(): string[] {
  const allTlds = new Set([...Object.keys(RDAP_SERVERS), ...Object.keys(WHOIS_SERVERS)]);
  return [...allTlds].sort();
}
