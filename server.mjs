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
  pro: 'whois.afilias.net', mobi: 'whois.afilias.net', name: 'whois.nic.name',
  tel: 'whois.nic.tel', travel: 'whois.nic.travel', jobs: 'whois.nic.jobs',
  cat: 'whois.nic.cat', post: 'whois.dotpostregistry.net', xxx: 'whois.nic.xxx',
  aero: 'whois.aero', museum: 'whois.museum', coop: 'whois.nic.coop',
  int: 'whois.iana.org', arpa: 'whois.iana.org',

  // ── New gTLDs – Google Registry ──
  dev: 'whois.nic.google', app: 'whois.nic.google', page: 'whois.nic.google',
  zip: 'whois.nic.google', meme: 'whois.nic.google', nexus: 'whois.nic.google',
  phd: 'whois.nic.google', prof: 'whois.nic.google', esq: 'whois.nic.google',
  foo: 'whois.nic.google', dad: 'whois.nic.google', day: 'whois.nic.google',
  ing: 'whois.nic.google', mov: 'whois.nic.google', how: 'whois.nic.google',
  soy: 'whois.nic.google', eat: 'whois.nic.google', here: 'whois.nic.google',

  // ── New gTLDs – CentralNic ──
  xyz: 'whois.nic.xyz', online: 'whois.centralnic.com', site: 'whois.centralnic.com',
  store: 'whois.centralnic.com', tech: 'whois.centralnic.com', space: 'whois.centralnic.com',
  fun: 'whois.centralnic.com', blog: 'whois.centralnic.com', art: 'whois.nic.art',
  website: 'whois.centralnic.com', press: 'whois.centralnic.com', host: 'whois.centralnic.com',
  uno: 'whois.centralnic.com', pw: 'whois.centralnic.com', ink: 'whois.centralnic.com',
  bar: 'whois.centralnic.com', ceo: 'whois.centralnic.com', fans: 'whois.centralnic.com',

  // ── New gTLDs – Identity Digital (Donuts) ──
  academy: 'whois.donuts.co', accountants: 'whois.donuts.co', adult: 'whois.donuts.co',
  agency: 'whois.donuts.co', apartments: 'whois.donuts.co', associates: 'whois.donuts.co',
  auction: 'whois.donuts.co', band: 'whois.donuts.co', bargains: 'whois.donuts.co',
  boutique: 'whois.donuts.co', builders: 'whois.donuts.co', business: 'whois.donuts.co',
  cab: 'whois.donuts.co', camera: 'whois.donuts.co', camp: 'whois.donuts.co',
  capital: 'whois.donuts.co', cards: 'whois.donuts.co', care: 'whois.donuts.co',
  careers: 'whois.donuts.co', cash: 'whois.donuts.co', catering: 'whois.donuts.co',
  center: 'whois.donuts.co', cheap: 'whois.donuts.co', church: 'whois.donuts.co',
  city: 'whois.donuts.co', claims: 'whois.donuts.co', cleaning: 'whois.donuts.co',
  clinic: 'whois.donuts.co', clothing: 'whois.donuts.co', coach: 'whois.donuts.co',
  codes: 'whois.donuts.co', coffee: 'whois.donuts.co', college: 'whois.donuts.co',
  community: 'whois.donuts.co', company: 'whois.donuts.co', computer: 'whois.donuts.co',
  condos: 'whois.donuts.co', construction: 'whois.donuts.co', consulting: 'whois.donuts.co',
  contractors: 'whois.donuts.co', cool: 'whois.donuts.co', coupons: 'whois.donuts.co',
  credit: 'whois.donuts.co', dating: 'whois.donuts.co', deals: 'whois.donuts.co',
  degree: 'whois.donuts.co', delivery: 'whois.donuts.co', democrat: 'whois.donuts.co',
  dental: 'whois.donuts.co', diamonds: 'whois.donuts.co', digital: 'whois.donuts.co',
  directory: 'whois.donuts.co', discount: 'whois.donuts.co', dog: 'whois.donuts.co',
  domains: 'whois.donuts.co', education: 'whois.donuts.co', email: 'whois.donuts.co',
  energy: 'whois.donuts.co', engineering: 'whois.donuts.co', enterprises: 'whois.donuts.co',
  equipment: 'whois.donuts.co', estate: 'whois.donuts.co', events: 'whois.donuts.co',
  exchange: 'whois.donuts.co', expert: 'whois.donuts.co', exposed: 'whois.donuts.co',
  express: 'whois.donuts.co', fail: 'whois.donuts.co', farm: 'whois.donuts.co',
  finance: 'whois.donuts.co', financial: 'whois.donuts.co', fitness: 'whois.donuts.co',
  florist: 'whois.donuts.co', flights: 'whois.donuts.co', football: 'whois.donuts.co',
  foundation: 'whois.donuts.co', fund: 'whois.donuts.co', furniture: 'whois.donuts.co',
  gallery: 'whois.donuts.co', gifts: 'whois.donuts.co', golf: 'whois.donuts.co',
  graphics: 'whois.donuts.co', gratis: 'whois.donuts.co', group: 'whois.donuts.co',
  guide: 'whois.donuts.co', guru: 'whois.donuts.co', healthcare: 'whois.donuts.co',
  holdings: 'whois.donuts.co', holiday: 'whois.donuts.co', homes: 'whois.donuts.co',
  house: 'whois.donuts.co', industries: 'whois.donuts.co', institute: 'whois.donuts.co',
  insure: 'whois.donuts.co', international: 'whois.donuts.co', investments: 'whois.donuts.co',
  jewelry: 'whois.donuts.co', kitchen: 'whois.donuts.co', land: 'whois.donuts.co',
  lease: 'whois.donuts.co', legal: 'whois.donuts.co', lighting: 'whois.donuts.co',
  limited: 'whois.donuts.co', limo: 'whois.donuts.co', loans: 'whois.donuts.co',
  management: 'whois.donuts.co', marketing: 'whois.donuts.co',
  media: 'whois.donuts.co', memorial: 'whois.donuts.co', money: 'whois.donuts.co',
  mortgage: 'whois.donuts.co', movers: 'whois.donuts.co', network: 'whois.donuts.co',
  ninja: 'whois.donuts.co', partners: 'whois.donuts.co', parts: 'whois.donuts.co',
  photography: 'whois.donuts.co', photos: 'whois.donuts.co', pictures: 'whois.donuts.co',
  plumbing: 'whois.donuts.co', plus: 'whois.donuts.co', productions: 'whois.donuts.co',
  properties: 'whois.donuts.co', recipes: 'whois.donuts.co', rentals: 'whois.donuts.co',
  repair: 'whois.donuts.co', report: 'whois.donuts.co', republican: 'whois.donuts.co',
  restaurant: 'whois.donuts.co', reviews: 'whois.donuts.co', rip: 'whois.donuts.co',
  rocks: 'whois.donuts.co', schule: 'whois.donuts.co', services: 'whois.donuts.co',
  shoes: 'whois.donuts.co', soccer: 'whois.donuts.co', solar: 'whois.donuts.co',
  solutions: 'whois.donuts.co', studio: 'whois.donuts.co', supplies: 'whois.donuts.co',
  supply: 'whois.donuts.co', support: 'whois.donuts.co', surgery: 'whois.donuts.co',
  systems: 'whois.donuts.co', tattoo: 'whois.donuts.co', tax: 'whois.donuts.co',
  technology: 'whois.donuts.co', theater: 'whois.donuts.co', tienda: 'whois.donuts.co',
  tips: 'whois.donuts.co', tires: 'whois.donuts.co', today: 'whois.donuts.co',
  tools: 'whois.donuts.co', town: 'whois.donuts.co', toys: 'whois.donuts.co',
  training: 'whois.donuts.co', university: 'whois.donuts.co', vacations: 'whois.donuts.co',
  ventures: 'whois.donuts.co', video: 'whois.donuts.co', villas: 'whois.donuts.co',
  vision: 'whois.donuts.co', watch: 'whois.donuts.co', wine: 'whois.donuts.co',
  works: 'whois.donuts.co', world: 'whois.donuts.co', wtf: 'whois.donuts.co',
  zone: 'whois.donuts.co', life: 'whois.donuts.co', live: 'whois.donuts.co',
  cloud: 'whois.donuts.co', club: 'whois.nic.club',

  // ── New gTLDs – Verisign ──
  tv: 'whois.nic.tv', cc: 'ccwhois.verisign-grs.com',

  // ── New gTLDs – Various registries ──
  top: 'whois.nic.top', vip: 'whois.nic.vip', shop: 'whois.nic.shop',
  red: 'whois.afilias.net', kim: 'whois.afilias.net', pink: 'whois.afilias.net',
  sex: 'whois.afilias.net', shiksha: 'whois.afilias.net', black: 'whois.afilias.net',
  blue: 'whois.afilias.net', poker: 'whois.afilias.net', diet: 'whois.afilias.net',
  gift: 'whois.afilias.net', guitars: 'whois.afilias.net', vote: 'whois.afilias.net',
  voto: 'whois.afilias.net',
  juegos: 'whois.uniregistry.net', photo: 'whois.uniregistry.net', sexy: 'whois.uniregistry.net',
  audio: 'whois.uniregistry.net', cars: 'whois.uniregistry.net',
  click: 'whois.uniregistry.net', hiphop: 'whois.uniregistry.net',
  blackfriday: 'whois.uniregistry.net',
  link: 'whois.centralnic.com', design: 'whois.centralnic.com',
  work: 'whois.centralnic.com', wiki: 'whois.centralnic.com', global: 'whois.centralnic.com',
  game: 'whois.nic.game', games: 'whois.donuts.co',
  wang: 'whois.gtld.knet.cn', xin: 'whois.gtld.knet.cn',
  ren: 'whois.nic.ren', pub: 'whois.unitedtld.com', kaufen: 'whois.unitedtld.com',
  feed: 'whois.unitedtld.com',
  fit: 'whois.nic.fit', gym: 'whois.nic.gym', bio: 'whois.nic.bio',
  eco: 'whois.nic.eco', green: 'whois.nic.green', organic: 'whois.nic.organic',
  ski: 'whois.nic.ski', surf: 'whois.nic.surf', yoga: 'whois.nic.yoga',
  baby: 'whois.nic.baby', chat: 'whois.nic.chat', help: 'whois.nic.help',
  social: 'whois.nic.social', news: 'whois.nic.news', style: 'whois.nic.style',
  luxury: 'whois.nic.luxury',
  miami: 'whois.nic.miami', nyc: 'whois.nic.nyc', boston: 'whois.nic.boston',
  vegas: 'whois.nic.vegas', tokyo: 'whois.nic.tokyo', osaka: 'whois.nic.osaka',
  nagoya: 'whois.nic.nagoya', yokohama: 'whois.nic.yokohama', berlin: 'whois.nic.berlin',
  paris: 'whois.nic.paris', amsterdam: 'whois.nic.amsterdam', barcelona: 'whois.nic.barcelona',
  stockholm: 'whois.nic.stockholm', brussels: 'whois.nic.brussels',
  radio: 'whois.nic.radio', music: 'whois.nic.music', movie: 'whois.nic.movie',
  film: 'whois.nic.film', sport: 'whois.nic.sport', tennis: 'whois.nic.tennis',
  run: 'whois.donuts.co', bike: 'whois.donuts.co', health: 'whois.donuts.co',
  pharmacy: 'whois.nic.pharmacy', hospital: 'whois.nic.hospital', doctor: 'whois.nic.doctor',
  lawyer: 'whois.nic.lawyer', accountant: 'whois.nic.accountant',
  sucks: 'whois.nic.sucks', porn: 'whois.nic.porn', adult: 'whois.nic.adult',
  lol: 'whois.nic.lol', mba: 'whois.donuts.co', markets: 'whois.donuts.co',

  // ── Asia new gTLDs ──
  网络: 'whois.gtld.knet.cn', 公司: 'whois.gtld.knet.cn', 中文网: 'whois.gtld.knet.cn',

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

  // ── Google Registry gTLDs ──
  meme:  'https://pubapi.registry.google/rdap',
  nexus: 'https://pubapi.registry.google/rdap',
  phd:   'https://pubapi.registry.google/rdap',
  prof:  'https://pubapi.registry.google/rdap',
  esq:   'https://pubapi.registry.google/rdap',
  foo:   'https://pubapi.registry.google/rdap',
  dad:   'https://pubapi.registry.google/rdap',
  day:   'https://pubapi.registry.google/rdap',
  ing:   'https://pubapi.registry.google/rdap',
  mov:   'https://pubapi.registry.google/rdap',
  how:   'https://pubapi.registry.google/rdap',
  soy:   'https://pubapi.registry.google/rdap',
  eat:   'https://pubapi.registry.google/rdap',
  here:  'https://pubapi.registry.google/rdap',

  // ── CentralNic gTLDs ──
  xyz:     'https://rdap.centralnic.com/xyz',
  online:  'https://rdap.centralnic.com/online',
  site:    'https://rdap.centralnic.com/site',
  store:   'https://rdap.centralnic.com/store',
  tech:    'https://rdap.centralnic.com/tech',
  space:   'https://rdap.centralnic.com/space',
  fun:     'https://rdap.centralnic.com/fun',
  art:     'https://rdap.centralnic.com/art',
  shop:    'https://rdap.centralnic.com/shop',
  link:    'https://rdap.centralnic.com/link',
  global:  'https://rdap.centralnic.com/global',
  website: 'https://rdap.centralnic.com/website',
  press:   'https://rdap.centralnic.com/press',
  host:    'https://rdap.centralnic.com/host',
  uno:     'https://rdap.centralnic.com/uno',
  bar:     'https://rdap.centralnic.com/bar',
  ceo:     'https://rdap.centralnic.com/ceo',
  fans:    'https://rdap.centralnic.com/fans',

  // ── Identity Digital (Donuts) gTLDs ──
  digital:      'https://rdap.identitydigital.services/rdap',
  world:        'https://rdap.identitydigital.services/rdap',
  life:         'https://rdap.identitydigital.services/rdap',
  live:         'https://rdap.identitydigital.services/rdap',
  media:        'https://rdap.identitydigital.services/rdap',
  network:      'https://rdap.identitydigital.services/rdap',
  systems:      'https://rdap.identitydigital.services/rdap',
  academy:      'https://rdap.identitydigital.services/rdap',
  agency:       'https://rdap.identitydigital.services/rdap',
  club:         'https://rdap.identitydigital.services/rdap',
  accountants:  'https://rdap.identitydigital.services/rdap',
  adult:        'https://rdap.identitydigital.services/rdap',
  apartments:   'https://rdap.identitydigital.services/rdap',
  associates:   'https://rdap.identitydigital.services/rdap',
  auction:      'https://rdap.identitydigital.services/rdap',
  band:         'https://rdap.identitydigital.services/rdap',
  bargains:     'https://rdap.identitydigital.services/rdap',
  boutique:     'https://rdap.identitydigital.services/rdap',
  builders:     'https://rdap.identitydigital.services/rdap',
  business:     'https://rdap.identitydigital.services/rdap',
  cab:          'https://rdap.identitydigital.services/rdap',
  camera:       'https://rdap.identitydigital.services/rdap',
  camp:         'https://rdap.identitydigital.services/rdap',
  capital:      'https://rdap.identitydigital.services/rdap',
  cards:        'https://rdap.identitydigital.services/rdap',
  care:         'https://rdap.identitydigital.services/rdap',
  careers:      'https://rdap.identitydigital.services/rdap',
  cash:         'https://rdap.identitydigital.services/rdap',
  catering:     'https://rdap.identitydigital.services/rdap',
  center:       'https://rdap.identitydigital.services/rdap',
  cheap:        'https://rdap.identitydigital.services/rdap',
  church:       'https://rdap.identitydigital.services/rdap',
  city:         'https://rdap.identitydigital.services/rdap',
  claims:       'https://rdap.identitydigital.services/rdap',
  cleaning:     'https://rdap.identitydigital.services/rdap',
  clinic:       'https://rdap.identitydigital.services/rdap',
  clothing:     'https://rdap.identitydigital.services/rdap',
  coach:        'https://rdap.identitydigital.services/rdap',
  codes:        'https://rdap.identitydigital.services/rdap',
  coffee:       'https://rdap.identitydigital.services/rdap',
  college:      'https://rdap.identitydigital.services/rdap',
  community:    'https://rdap.identitydigital.services/rdap',
  company:      'https://rdap.identitydigital.services/rdap',
  computer:     'https://rdap.identitydigital.services/rdap',
  condos:       'https://rdap.identitydigital.services/rdap',
  construction: 'https://rdap.identitydigital.services/rdap',
  consulting:   'https://rdap.identitydigital.services/rdap',
  contractors:  'https://rdap.identitydigital.services/rdap',
  cool:         'https://rdap.identitydigital.services/rdap',
  coupons:      'https://rdap.identitydigital.services/rdap',
  credit:       'https://rdap.identitydigital.services/rdap',
  dating:       'https://rdap.identitydigital.services/rdap',
  deals:        'https://rdap.identitydigital.services/rdap',
  degree:       'https://rdap.identitydigital.services/rdap',
  delivery:     'https://rdap.identitydigital.services/rdap',
  democrat:     'https://rdap.identitydigital.services/rdap',
  dental:       'https://rdap.identitydigital.services/rdap',
  diamonds:     'https://rdap.identitydigital.services/rdap',
  directory:    'https://rdap.identitydigital.services/rdap',
  discount:     'https://rdap.identitydigital.services/rdap',
  dog:          'https://rdap.identitydigital.services/rdap',
  domains:      'https://rdap.identitydigital.services/rdap',
  education:    'https://rdap.identitydigital.services/rdap',
  email:        'https://rdap.identitydigital.services/rdap',
  energy:       'https://rdap.identitydigital.services/rdap',
  engineering:  'https://rdap.identitydigital.services/rdap',
  enterprises:  'https://rdap.identitydigital.services/rdap',
  equipment:    'https://rdap.identitydigital.services/rdap',
  estate:       'https://rdap.identitydigital.services/rdap',
  events:       'https://rdap.identitydigital.services/rdap',
  exchange:     'https://rdap.identitydigital.services/rdap',
  expert:       'https://rdap.identitydigital.services/rdap',
  exposed:      'https://rdap.identitydigital.services/rdap',
  express:      'https://rdap.identitydigital.services/rdap',
  fail:         'https://rdap.identitydigital.services/rdap',
  farm:         'https://rdap.identitydigital.services/rdap',
  finance:      'https://rdap.identitydigital.services/rdap',
  financial:    'https://rdap.identitydigital.services/rdap',
  fitness:      'https://rdap.identitydigital.services/rdap',
  florist:      'https://rdap.identitydigital.services/rdap',
  flights:      'https://rdap.identitydigital.services/rdap',
  football:     'https://rdap.identitydigital.services/rdap',
  foundation:   'https://rdap.identitydigital.services/rdap',
  fund:         'https://rdap.identitydigital.services/rdap',
  furniture:    'https://rdap.identitydigital.services/rdap',
  gallery:      'https://rdap.identitydigital.services/rdap',
  gifts:        'https://rdap.identitydigital.services/rdap',
  golf:         'https://rdap.identitydigital.services/rdap',
  graphics:     'https://rdap.identitydigital.services/rdap',
  gratis:       'https://rdap.identitydigital.services/rdap',
  group:        'https://rdap.identitydigital.services/rdap',
  guide:        'https://rdap.identitydigital.services/rdap',
  guru:         'https://rdap.identitydigital.services/rdap',
  healthcare:   'https://rdap.identitydigital.services/rdap',
  holdings:     'https://rdap.identitydigital.services/rdap',
  holiday:      'https://rdap.identitydigital.services/rdap',
  homes:        'https://rdap.identitydigital.services/rdap',
  house:        'https://rdap.identitydigital.services/rdap',
  industries:   'https://rdap.identitydigital.services/rdap',
  institute:    'https://rdap.identitydigital.services/rdap',
  insure:       'https://rdap.identitydigital.services/rdap',
  international:'https://rdap.identitydigital.services/rdap',
  investments:  'https://rdap.identitydigital.services/rdap',
  jewelry:      'https://rdap.identitydigital.services/rdap',
  kitchen:      'https://rdap.identitydigital.services/rdap',
  land:         'https://rdap.identitydigital.services/rdap',
  lease:        'https://rdap.identitydigital.services/rdap',
  legal:        'https://rdap.identitydigital.services/rdap',
  lighting:     'https://rdap.identitydigital.services/rdap',
  limited:      'https://rdap.identitydigital.services/rdap',
  limo:         'https://rdap.identitydigital.services/rdap',
  loans:        'https://rdap.identitydigital.services/rdap',
  management:   'https://rdap.identitydigital.services/rdap',
  marketing:    'https://rdap.identitydigital.services/rdap',
  memorial:     'https://rdap.identitydigital.services/rdap',
  money:        'https://rdap.identitydigital.services/rdap',
  mortgage:     'https://rdap.identitydigital.services/rdap',
  movers:       'https://rdap.identitydigital.services/rdap',
  ninja:        'https://rdap.identitydigital.services/rdap',
  partners:     'https://rdap.identitydigital.services/rdap',
  parts:        'https://rdap.identitydigital.services/rdap',
  photography:  'https://rdap.identitydigital.services/rdap',
  photos:       'https://rdap.identitydigital.services/rdap',
  pictures:     'https://rdap.identitydigital.services/rdap',
  plumbing:     'https://rdap.identitydigital.services/rdap',
  plus:         'https://rdap.identitydigital.services/rdap',
  productions:  'https://rdap.identitydigital.services/rdap',
  properties:   'https://rdap.identitydigital.services/rdap',
  recipes:      'https://rdap.identitydigital.services/rdap',
  rentals:      'https://rdap.identitydigital.services/rdap',
  repair:       'https://rdap.identitydigital.services/rdap',
  report:       'https://rdap.identitydigital.services/rdap',
  republican:   'https://rdap.identitydigital.services/rdap',
  restaurant:   'https://rdap.identitydigital.services/rdap',
  reviews:      'https://rdap.identitydigital.services/rdap',
  rip:          'https://rdap.identitydigital.services/rdap',
  rocks:        'https://rdap.identitydigital.services/rdap',
  schule:       'https://rdap.identitydigital.services/rdap',
  services:     'https://rdap.identitydigital.services/rdap',
  shoes:        'https://rdap.identitydigital.services/rdap',
  soccer:       'https://rdap.identitydigital.services/rdap',
  solar:        'https://rdap.identitydigital.services/rdap',
  solutions:    'https://rdap.identitydigital.services/rdap',
  studio:       'https://rdap.identitydigital.services/rdap',
  supplies:     'https://rdap.identitydigital.services/rdap',
  supply:       'https://rdap.identitydigital.services/rdap',
  support:      'https://rdap.identitydigital.services/rdap',
  surgery:      'https://rdap.identitydigital.services/rdap',
  tattoo:       'https://rdap.identitydigital.services/rdap',
  tax:          'https://rdap.identitydigital.services/rdap',
  technology:   'https://rdap.identitydigital.services/rdap',
  theater:      'https://rdap.identitydigital.services/rdap',
  tienda:       'https://rdap.identitydigital.services/rdap',
  tips:         'https://rdap.identitydigital.services/rdap',
  tires:        'https://rdap.identitydigital.services/rdap',
  today:        'https://rdap.identitydigital.services/rdap',
  tools:        'https://rdap.identitydigital.services/rdap',
  town:         'https://rdap.identitydigital.services/rdap',
  toys:         'https://rdap.identitydigital.services/rdap',
  training:     'https://rdap.identitydigital.services/rdap',
  university:   'https://rdap.identitydigital.services/rdap',
  vacations:    'https://rdap.identitydigital.services/rdap',
  ventures:     'https://rdap.identitydigital.services/rdap',
  video:        'https://rdap.identitydigital.services/rdap',
  villas:       'https://rdap.identitydigital.services/rdap',
  vision:       'https://rdap.identitydigital.services/rdap',
  watch:        'https://rdap.identitydigital.services/rdap',
  wine:         'https://rdap.identitydigital.services/rdap',
  works:        'https://rdap.identitydigital.services/rdap',
  wtf:          'https://rdap.identitydigital.services/rdap',
  zone:         'https://rdap.identitydigital.services/rdap',
  run:          'https://rdap.identitydigital.services/rdap',
  bike:         'https://rdap.identitydigital.services/rdap',
  health:       'https://rdap.identitydigital.services/rdap',
  mba:          'https://rdap.identitydigital.services/rdap',
  markets:      'https://rdap.identitydigital.services/rdap',
  games:        'https://rdap.identitydigital.services/rdap',

  // ── Verisign ccTLDs ──
  io: 'https://rdap.nic.io',
  cc: 'https://tld-rdap.verisign.com/cc/v1',
  tv: 'https://rdap.nic.tv',

  // ── Other popular new gTLDs / ccTLDs ──
  me:   'https://rdap.nic.me',
  co:   'https://rdap.nic.co',
  ai:   'https://rdap.identitydigital.services/rdap',
  gg:   'https://rdap.nic.gg',
  je:   'https://rdap.nic.je',
  im:   'https://rdap.nic.im',
  la:   'https://rdap.nic.la',
  ws:   'https://rdap.website.ws',
  so:   'https://rdap.nic.so',
  sh:   'https://rdap.nic.sh',
  ac:   'https://rdap.nic.ac',
  sc:   'https://rdap.nic.sc',
  as:   'https://rdap.nic.as',
  tc:   'https://rdap.nic.tc',
  vc:   'https://rdap.nic.vc',
  dm:   'https://rdap.nic.dm',
  ag:   'https://rdap.nic.ag',
  bm:   'https://rdap.identitydigital.services/rdap',
  mu:   'https://rdap.identitydigital.services/rdap',
  wf:   'https://rdap.nic.wf',
  yt:   'https://rdap.nic.yt',
  tf:   'https://rdap.nic.tf',
  pn:   'https://rdap.nominet.uk/pn',
  ms:   'https://rdap.nic.ms',
  gs:   'https://rdap.nic.gs',
  cx:   'https://rdap.nic.cx',
  ky:   'https://whois.kyregistry.ky/rdap',
  vip:  'https://rdap.nic.vip',
  red:  'https://rdap.identitydigital.services/rdap',
  kim:  'https://rdap.identitydigital.services/rdap',
  pink: 'https://rdap.identitydigital.services/rdap',
  sex:  'https://rdap.nic.sex',
  black:'https://rdap.identitydigital.services/rdap',
  blue: 'https://rdap.identitydigital.services/rdap',
  wang: 'https://rdap.zdnsgtld.com/wang',
  xin:  'https://rdap.gtld.knet.cn',
  ren:  'https://rdap.zdnsgtld.com/ren',
  tokyo:     'https://rdap.nic.tokyo',
  osaka:     'https://rdap.nic.osaka',
  nagoya:    'https://rdap.nic.nagoya',
  yokohama:  'https://rdap.nic.yokohama',
  berlin:    'https://rdap.nic.berlin/v1',
  amsterdam: 'https://rdap.nic.amsterdam',
  paris:     'https://rdap.nic.paris',
  barcelona: 'https://rdap.nic.barcelona',
  stockholm: 'https://rdap.identitydigital.services/rdap',
  brussels:  'https://rdap.nic.brussels',
  hamburg:   'https://rdap.nic.hamburg/v1',
  miami:     'https://rdap.nic.miami',
  nyc:       'https://rdap.nic.nyc',
  vegas:     'https://rdap.nic.vegas',
  boston:    'https://rdap.nic.boston',
  sydney:    'https://rdap.nic.sydney',
  melbourne: 'https://rdap.nic.melbourne',
  taipei:    'https://rdap.nic.taipei',
  eco:       'https://rdap.eco.fury.ca/rdap',
  bio:       'https://rdap.nic.bio',
  luxury:    'https://rdap.nic.luxury',
  sucks:     'https://rdap.nic.sucks',
  porn:      'https://rdap.nic.porn',
  lol:       'https://rdap.nic.lol',
  pharmacy:  'https://rdap.nic.pharmacy',
  doctor:    'https://rdap.nic.doctor',
  lawyer:    'https://rdap.nic.lawyer',
  accountant:'https://rdap.nic.accountant',
  hospital:  'https://rdap.nic.hospital',

  // ── GMO Registry gTLDs ──
  bridgestone:'https://rdap.gmoregistry.net/rdap',
  brother:    'https://rdap.gmoregistry.net/rdap',
  canon:      'https://rdap.gmoregistry.net/rdap',
  datsun:     'https://rdap.gmoregistry.net/rdap',
  dnp:        'https://rdap.gmoregistry.net/rdap',
  epson:      'https://rdap.gmoregistry.net/rdap',
  fujitsu:    'https://rdap.gmoregistry.net/rdap',
  hitachi:    'https://rdap.gmoregistry.net/rdap',
  jcb:        'https://rdap.gmoregistry.net/rdap',
  kddi:       'https://rdap.gmoregistry.net/rdap',
  komatsu:    'https://rdap.gmoregistry.net/rdap',
  lotte:      'https://rdap.gmoregistry.net/rdap',
  mitsubishi: 'https://rdap.gmoregistry.net/rdap',
  nec:        'https://rdap.gmoregistry.net/rdap',
  nhk:        'https://rdap.gmoregistry.net/rdap',
  nico:       'https://rdap.gmoregistry.net/rdap',
  otsuka:     'https://rdap.gmoregistry.net/rdap',
  playstation:'https://rdap.gmoregistry.net/rdap',
  ricoh:      'https://rdap.gmoregistry.net/rdap',
  sharp:      'https://rdap.gmoregistry.net/rdap',
  softbank:   'https://rdap.gmoregistry.net/rdap',
  toray:      'https://rdap.gmoregistry.net/rdap',
  toshiba:    'https://rdap.gmoregistry.net/rdap',
  yodobashi:  'https://rdap.gmoregistry.net/rdap',

  // ── Nominet gTLDs ──
  abbvie:    'https://rdap.nominet.uk/abbvie',
  amazon:    'https://rdap.nominet.uk/amazon',
  audible:   'https://rdap.nominet.uk/audible',
  author:    'https://rdap.nominet.uk/author',
  aws:       'https://rdap.nominet.uk/aws',
  azure:     'https://rdap.nominet.uk/azure',
  bbc:       'https://rdap.nominet.uk/bbc',
  bbva:      'https://rdap.nominet.uk/bbva',
  bing:      'https://rdap.nominet.uk/bing',
  book:      'https://rdap.nominet.uk/book',
  bot:       'https://rdap.nominet.uk/bot',
  broadway:  'https://rdap.nominet.uk/broadway',
  buy:       'https://rdap.nominet.uk/buy',
  call:      'https://rdap.nominet.uk/call',
  career:    'https://rdap.nominet.uk/career',
  circle:    'https://rdap.nominet.uk/circle',
  cymru:     'https://rdap.nominet.uk/cymru',
  deal:      'https://rdap.nominet.uk/deal',
  desi:      'https://rdap.nominet.uk/desi',
  fast:      'https://rdap.nominet.uk/fast',
  fire:      'https://rdap.nominet.uk/fire',
  free:      'https://rdap.nominet.uk/free',
  gop:       'https://rdap.nominet.uk/gop',
  got:       'https://rdap.nominet.uk/got',
  gucci:     'https://rdap.nominet.uk/gucci',
  hot:       'https://rdap.nominet.uk/hot',
  hotmail:   'https://rdap.nominet.uk/hotmail',
  ieee:      'https://rdap.nominet.uk/ieee',
  imdb:      'https://rdap.nominet.uk/imdb',
  jot:       'https://rdap.nominet.uk/jot',
  joy:       'https://rdap.nominet.uk/joy',
  kindle:    'https://rdap.nominet.uk/kindle',
  like:      'https://rdap.nominet.uk/like',
  locus:     'https://rdap.nominet.uk/locus',
  med:       'https://rdap.nominet.uk/med',
  microsoft: 'https://rdap.nominet.uk/microsoft',
  moi:       'https://rdap.nominet.uk/moi',
  mtn:       'https://rdap.nominet.uk/mtn',
  now:       'https://rdap.nominet.uk/now',
  nowruz:    'https://rdap.nominet.uk/nowruz',
  office:    'https://rdap.nominet.uk/office',
  omega:     'https://rdap.nominet.uk/omega',
  pars:      'https://rdap.nominet.uk/pars',
  pay:       'https://rdap.nominet.uk/pay',
  pin:       'https://rdap.nominet.uk/pin',
  pioneer:   'https://rdap.nominet.uk/pioneer',
  prime:     'https://rdap.nominet.uk/prime',
  read:      'https://rdap.nominet.uk/read',
  realestate:'https://rdap.nominet.uk/realestate',
  realtor:   'https://rdap.nominet.uk/realtor',
  room:      'https://rdap.nominet.uk/room',
  safe:      'https://rdap.nominet.uk/safe',
  save:      'https://rdap.nominet.uk/save',
  secure:    'https://rdap.nominet.uk/secure',
  shell:     'https://rdap.nominet.uk/shell',
  shia:      'https://rdap.nominet.uk/shia',
  silk:      'https://rdap.nominet.uk/silk',
  sky:       'https://rdap.nominet.uk/sky',
  skype:     'https://rdap.nominet.uk/skype',
  smile:     'https://rdap.nominet.uk/smile',
  spot:      'https://rdap.nominet.uk/spot',
  swatch:    'https://rdap.nominet.uk/swatch',
  talk:      'https://rdap.nominet.uk/talk',
  tunes:     'https://rdap.nominet.uk/tunes',
  tushu:     'https://rdap.nominet.uk/tushu',
  virgin:    'https://rdap.nominet.uk/virgin',
  wales:     'https://rdap.nominet.uk/wales',
  wanggou:   'https://rdap.nominet.uk/wanggou',
  wed:       'https://rdap.nominet.uk/wed',
  windows:   'https://rdap.nominet.uk/windows',
  wow:       'https://rdap.nominet.uk/wow',
  xbox:      'https://rdap.nominet.uk/xbox',
  you:       'https://rdap.nominet.uk/you',
  zappos:    'https://rdap.nominet.uk/zappos',
  yamaxun:   'https://rdap.nominet.uk/yamaxun',

  // ── Tucows Registry gTLDs ──
  click:     'https://rdap.tucowsregistry.net/rdap',
  country:   'https://rdap.tucowsregistry.net/rdap',
  diy:       'https://rdap.tucowsregistry.net/rdap',
  food:      'https://rdap.tucowsregistry.net/rdap',
  gift:      'https://rdap.tucowsregistry.net/rdap',
  hiv:       'https://rdap.tucowsregistry.net/rdap',
  lifestyle: 'https://rdap.tucowsregistry.net/rdap',
  living:    'https://rdap.tucowsregistry.net/rdap',
  property:  'https://rdap.tucowsregistry.net/rdap',
  sexy:      'https://rdap.tucowsregistry.net/rdap',
  trust:     'https://rdap.tucowsregistry.net/rdap',
  vana:      'https://rdap.tucowsregistry.net/rdap',

  // ── PIR (Public Interest Registry) gTLDs ──
  charity:   'https://rdap.publicinterestregistry.org/rdap',
  gives:     'https://rdap.publicinterestregistry.org/rdap',
  giving:    'https://rdap.publicinterestregistry.org/rdap',
  ngo:       'https://rdap.publicinterestregistry.org/rdap',
  ong:       'https://rdap.publicinterestregistry.org/rdap',

  // ── Registry.bar ──
  rest:      'https://rdap.registry.bar/rdap',

  // ── Registry.click ──
  feedback:  'https://rdap.registry.click/rdap',
  forum:     'https://rdap.registry.click/rdap',
  observer:  'https://rdap.registry.click/rdap',
  pid:       'https://rdap.registry.click/rdap',
  realty:    'https://rdap.registry.click/rdap',

  // ── Registry.hiphop ──
  hiphop:    'https://rdap.registry.hiphop/rdap',

  // ── RYCE-RSP ──
  cologne:   'https://rdap.ryce-rsp.com/rdap',
  koeln:     'https://rdap.ryce-rsp.com/rdap',
  tirol:     'https://rdap.ryce-rsp.com/rdap',
  wien:      'https://rdap.ryce-rsp.com/rdap',

  // ── Mobile Registry ──
  blockbuster:'https://rdap.mobile-registry.com/rdap',
  data:       'https://rdap.mobile-registry.com/rdap',
  dish:       'https://rdap.mobile-registry.com/rdap',
  dot:        'https://rdap.mobile-registry.com/rdap',
  dtv:        'https://rdap.mobile-registry.com/rdap',
  dvr:        'https://rdap.mobile-registry.com/rdap',
  latino:     'https://rdap.mobile-registry.com/rdap',
  mobile:     'https://rdap.mobile-registry.com/rdap',
  ollo:       'https://rdap.mobile-registry.com/rdap',
  ott:        'https://rdap.mobile-registry.com/rdap',
  phone:      'https://rdap.mobile-registry.com/rdap',
  sling:      'https://rdap.mobile-registry.com/rdap',

  // ── ZDNS gTLDs (中国) ──
  baidu:  'https://rdap.zdnsgtld.com/baidu',
  citic:  'https://rdap.zdnsgtld.com/citic',
  icbc:   'https://rdap.zdnsgtld.com/icbc',
  sohu:   'https://rdap.zdnsgtld.com/sohu',
  unicom: 'https://rdap.zdnsgtld.com/unicom',

  // ── Various other gTLDs ──
  aaa:         'https://rdap.nic.aaa',
  aarp:        'https://rdap.nic.aarp',
  abogado:     'https://rdap.nic.abogado',
  abudhabi:    'https://rdap.nic.abudhabi',
  africa:      'https://rdap.nic.africa/rdap',
  alsace:      'https://rdap.nic.alsace',
  arab:        'https://rdap.nic.arab',
  bank:        'https://rdap.nic.bank',
  baseball:    'https://rdap.nic.baseball',
  basketball:  'https://rdap.nic.basketball',
  bayern:      'https://rdap.nic.bayern',
  beer:        'https://rdap.nic.beer',
  bible:       'https://rdap.nic.bible',
  bid:         'https://rdap.nic.bid',
  blackfriday: 'https://rdap.nic.blackfriday',
  blog:        'https://rdap.blog.fury.ca/rdap',
  booking:     'https://rdap.nic.booking',
  buzz:        'https://rdap.nic.buzz',
  bzh:         'https://rdap.nic.bzh',
  capetown:    'https://rdap.nic.capetown/rdap',
  casa:        'https://rdap.nic.casa',
  catholic:    'https://rdap.nic.catholic',
  chase:       'https://rdap.nic.chase',
  cisco:       'https://rdap.nic.cisco',
  citi:        'https://rdap.nic.citi',
  cloud:       'https://rdap.registry.cloud/rdap',
  cooking:     'https://rdap.nic.cooking',
  corsica:     'https://rdap.nic.corsica',
  courses:     'https://rdap.nic.courses',
  cpa:         'https://rdap.nic.cpa',
  cricket:     'https://rdap.nic.cricket',
  date:        'https://rdap.nic.date',
  dell:        'https://rdap.nic.dell',
  design:      'https://rdap.nic.design',
  download:    'https://rdap.nic.download',
  dubai:       'https://rdap.nic.dubai',
  dupont:      'https://rdap.nic.dupont',
  durban:      'https://rdap.nic.durban/rdap',
  earth:       'https://rdap.nic.earth',
  eus:         'https://rdap.nic.eus',
  faith:       'https://rdap.nic.faith',
  fashion:     'https://rdap.nic.fashion',
  film:        'https://rdap.nic.film',
  fishing:     'https://rdap.nic.fishing',
  fit:         'https://rdap.nic.fit',
  ford:        'https://rdap.nic.ford',
  fox:         'https://rdap.nic.fox',
  gal:         'https://rdap.nic.gal',
  garden:      'https://rdap.nic.garden',
  gay:         'https://rdap.nic.gay',
  gdn:         'https://rdap.nic.gdn',
  gmx:         'https://rdap.nic.gmx',
  godaddy:     'https://rdap.nic.godaddy',
  hbo:         'https://rdap.nic.hbo',
  horse:       'https://rdap.nic.horse',
  hotels:      'https://rdap.nic.hotels',
  hsbc:        'https://rdap.nic.hsbc',
  hyatt:       'https://rdap.nic.hyatt',
  ibm:         'https://rdap.nic.ibm',
  ink:         'https://rdap.nic.ink',
  insurance:   'https://rdap.nic.insurance',
  joburg:      'https://rdap.nic.joburg/rdap',
  jpmorgan:    'https://rdap.nic.jpmorgan',
  kiwi:        'https://rdap.kiwi.fury.ca/rdap',
  kpmg:        'https://rdap.nic.kpmg',
  krd:         'https://rdap.nic.krd',
  law:         'https://rdap.nic.law',
  lincoln:     'https://rdap.nic.lincoln',
  loan:        'https://rdap.nic.loan',
  love:        'https://rdap.registry.love/rdap',
  luxe:        'https://rdap.nic.luxe',
  madrid:      'https://rdap.nic.madrid',
  men:         'https://rdap.nic.men',
  menu:        'https://rdap.nic.menu',
  mlb:         'https://rdap.nic.mlb',
  mls:         'https://rdap.mls.fury.ca/rdap',
  moe:         'https://rdap.nic.moe',
  moscow:      'https://rdap.flexireg.net',
  music:       'https://rdap.registryservices.music/rdap',
  nba:         'https://rdap.nic.nba',
  netflix:     'https://rdap.nic.netflix',
  one:         'https://rdap.nic.one',
  party:       'https://rdap.nic.party',
  quebec:      'https://rdap.nic.quebec',
  racing:      'https://rdap.nic.racing',
  review:      'https://rdap.nic.review',
  rio:         'https://rdap.gtlds.nic.br',
  roma:        'https://rdap.nic.roma',
  samsung:     'https://nic.samsung/rdap',
  science:     'https://rdap.nic.science',
  scot:        'https://rdap.nic.scot',
  sport:       'https://rdap.nic.sport',
  stream:      'https://rdap.nic.stream',
  study:       'https://rdap.nic.study',
  surf:        'https://rdap.nic.surf',
  swiss:       'https://rdap.nic.swiss',
  target:      'https://rdap.nic.target',
  top:         'https://rdap.zdnsgtld.com/top',
  trade:       'https://rdap.nic.trade',
  tube:        'https://rdap.nic.tube',
  versicherung:'https://rdap.nic.versicherung/v1',
  vlaanderen:  'https://rdap.nic.vlaanderen',
  vodka:       'https://rdap.nic.vodka',
  voting:      'https://rdap.nic.voting',
  walmart:     'https://rdap.nic.walmart',
  weather:     'https://rdap.nic.weather',
  webcam:      'https://rdap.nic.webcam',
  wedding:     'https://rdap.nic.wedding',
  wiki:        'https://rdap.nic.wiki',
  win:         'https://rdap.nic.win',
  work:        'https://rdap.nic.work',
  xerox:       'https://rdap.nic.xerox',
  yandex:      'https://rdap.nic.yandex/rdap',
  yoga:        'https://rdap.nic.yoga',
  creditunion: 'https://rdap.registry.coop/rdap',
  tatar:       'https://whois.nic.tatar/rdap',
  mtr:         'https://whois.nic.mtr/rdap',

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
  al: 'https://rdap.nic.al',
  mk: 'https://rdap.marnet.mk',
  ee: 'https://rdap.tld.ee',
  lv: 'https://rdap.nic.lv',
  lt: 'https://rdap.domreg.lt',
  ua: 'https://rdap.hostmaster.ua',
  ad: 'https://rdap.nic.ad',
  fo: 'https://rdap.centralnic.com/fo',

  // ── Eastern Europe / CIS ──
  ru: 'https://rdap.tcinet.ru/EPP/rdap',
  by: 'https://rdap.cctld.by',

  // ── Mediterranean / Middle East ──
  gr: 'https://rdap.ics.forth.gr',
  cy: 'https://rdap.nic.cy',
  tr: 'https://rdap.nic.tr',
  il: 'https://rdap.isoc.org.il',
  ae: 'https://rdap.aeda.net.ae',
  sa: 'https://rdap.nic.net.sa',
  qa: 'https://rdap.registry.qa',
  lb: 'https://rdap.lbdr.org.lb',

  // ── Asia-Pacific ──
  jp: 'https://rdap.jprs.jp',
  kr: 'https://rdap.kisa.or.kr',
  cn: 'https://rdap.cnnic.cn',
  tw: 'https://ccrdap.twnic.tw/tw',
  hk: 'https://rdap.hkirc.hk',
  sg: 'https://rdap.sgnic.sg/rdap',
  th: 'https://rdap.thains.co.th',
  vn: 'https://rdap.vnnic.vn',
  id: 'https://rdap.pandi.id/rdap',
  my: 'https://rdap.mynic.my',
  ph: 'https://rdap.dot.ph',
  in: 'https://rdap.nixiregistry.in/rdap',
  kg: 'http://rdap.cctld.kg',
  uz: 'https://rdap.cctld.uz',
  au: 'https://rdap.auda.org.au',
  nz: 'https://rdap.nzrs.nz',
  fj: 'https://www.rdap.fj',
  to: 'https://rdap.tonicregistry.to/rdap',
  fm: 'https://rdap.centralnic.com/fm',
  pw: 'https://rdap.centralnic.com/pw',

  // ── Americas ──
  br: 'https://rdap.registro.br',
  ca: 'https://rdap.ca.fury.ca/rdap',
  us: 'https://rdap.nic.us',
  ar: 'https://rdap.nic.ar',
  cl: 'https://rdap.nic.cl',
  mx: 'https://rdap.mx',
  ec: 'https://rdap.registry.ec',
  cr: 'https://rdap.nic.cr',
  gy: 'https://rdap.registry.gy',
  hn: 'https://rdap.nic.hn',
  ht: 'https://rdap.nic.ht',
  sr: 'https://whois.sr/rdap',
  cv: 'https://rdap.nic.cv',
  vi: 'https://rdap.nic.vi',
  vg: 'https://rdap.centralnic.com/vg',
  gd: 'https://rdap.centralnic.com/gd',

  // ── Africa ──
  za: 'https://rdap.registry.net.za',
  ke: 'https://rdap.kenic.or.ke',
  ng: 'http://rdap.nic.net.ng',
  mg: 'http://rdap.nic.mg',
  tz: 'https://whois.tznic.or.tz/rdap',
  rw: 'https://rdap.ricta.org.rw',
  zm: 'https://rdap.nic.zm',
  ly: 'https://rdap.nic.ly',
  ml: 'https://rdap.nic.ml',
  cm: 'https://rdap.nic.cm',
  ss: 'https://rdap.nic.ss',
  ye: 'https://rdap.y.net.ye',

  // ── IDN TLDs (国际化域名) ──
  'xn--fiqs8s': 'https://rdap.cnnic.cn',
  'xn--fiqz9s': 'https://rdap.cnnic.cn',
  'xn--j6w193g': 'https://rdap.hkirc.hk',
  'xn--kprw13d': 'https://ccrdap.twnic.tw/taiwan',
  'xn--kpry57d': 'https://ccrdap.twnic.tw/taiwan',
  'xn--55qx5d': 'https://restwhois.ngtld.cn',
  'xn--io0a7i': 'https://restwhois.ngtld.cn',
  'xn--1qqw23a': 'https://restwhois.ngtld.cn',
  'xn--xhq521b': 'https://restwhois.ngtld.cn',
  'xn--3bst00m': 'https://rdap.zdnsgtld.com/xn--3bst00m',
  'xn--6qq986b3xl': 'https://rdap.zdnsgtld.com/xn--6qq986b3xl',
  'xn--9et52u': 'https://rdap.zdnsgtld.com/xn--9et52u',
  'xn--czr694b': 'https://rdap.zdnsgtld.com/xn--czr694b',
  'xn--czru2d': 'https://rdap.zdnsgtld.com/xn--czru2d',
  'xn--fiq64b': 'https://rdap.zdnsgtld.com/xn--fiq64b',
  'xn--otu796d': 'https://rdap.zdnsgtld.com/xn--otu796d',
  'xn--ses554g': 'https://rdap.zdnsgtld.com/xn--ses554g',
  'xn--45q11c': 'https://rdap.zdnsgtld.com/XN--45Q11C',
  'xn--efvy88h': 'https://rdap.zdnsgtld.com/XN--EFVY88H',
  'xn--fiq228c5hs': 'https://rdap.teleinfo.cn/xn--fiq228c5hs',
  'xn--kput3i': 'https://rdap.teleinfo.cn/xn--kput3i',
  'xn--nyqy26a': 'https://rdap.teleinfo.cn/xn--nyqy26a',
  'xn--rhqv96g': 'https://rdap.teleinfo.cn/xn--rhqv96g',
  'xn--vuq861b': 'https://rdap.teleinfo.cn',
  'xn--3e0b707e': 'https://rdap.kisa.or.kr',
  'xn--cg4bki': 'https://nic.samsung/rdap',
  'xn--p1ai': 'https://rdap.tcinet.ru',
  'xn--80adxhks': 'https://rdap.flexireg.net',
  'xn--c1avg': 'https://rdap.publicinterestregistry.org/rdap',
  'xn--p1acf': 'https://rdap.nic.xn--p1acf',
  'xn--80aswg': 'https://rdap.nic.xn--80aswg',
  'xn--o3cw4h': 'https://rdap.thains.co.th',
  'xn--q9jyb4c': 'https://pubapi.registry.google/rdap',
  'xn--qcka1pmc': 'https://pubapi.registry.google/rdap',
  'xn--flw351e': 'https://pubapi.registry.google/rdap',
  'xn--30rr7y': 'https://rdap.zdnsgtld.com/xn--30rr7y',
  'xn--hxt814e': 'https://rdap.zdnsgtld.com/xn--hxt814e',
  'xn--imr513n': 'https://rdap.zdnsgtld.com/xn--imr513n',
  'xn--8y0a063a': 'https://rdap.zdnsgtld.com/xn--8y0a063a',
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
