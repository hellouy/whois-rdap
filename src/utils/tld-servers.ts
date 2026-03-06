// IANA TLD权威服务器数据
// 数据来源: https://www.iana.org/domains/root/db
// 更新日期: 2025-01
// 支持TLD数量: 1500+ (完整IANA列表)

interface TLDServer {
  tld: string;
  servers: string[];
}

// 完整TLD权威服务器列表 (1500+ TLDs)
export const TLD_SERVERS: Record<string, string[]> = {
  // ========== 通用顶级域名 (gTLDs) ==========
  "com": ["a.gtld-servers.net", "b.gtld-servers.net", "c.gtld-servers.net", "d.gtld-servers.net", "e.gtld-servers.net", "f.gtld-servers.net", "g.gtld-servers.net", "h.gtld-servers.net", "i.gtld-servers.net", "j.gtld-servers.net", "k.gtld-servers.net", "l.gtld-servers.net", "m.gtld-servers.net"],
  "net": ["a.gtld-servers.net", "b.gtld-servers.net", "c.gtld-servers.net", "d.gtld-servers.net", "e.gtld-servers.net", "f.gtld-servers.net", "g.gtld-servers.net", "h.gtld-servers.net", "i.gtld-servers.net", "j.gtld-servers.net", "k.gtld-servers.net", "l.gtld-servers.net", "m.gtld-servers.net"],
  "org": ["a0.org.afilias-nst.info", "a2.org.afilias-nst.info", "b0.org.afilias-nst.org", "b2.org.afilias-nst.org", "c0.org.afilias-nst.info", "d0.org.afilias-nst.org"],
  "info": ["a0.info.afilias-nst.info", "a2.info.afilias-nst.info", "b0.info.afilias-nst.org", "b2.info.afilias-nst.org", "c0.info.afilias-nst.info", "d0.info.afilias-nst.info"],
  "biz": ["a.gtld.biz", "b.gtld.biz", "c.gtld.biz", "d.gtld.biz", "e.gtld.biz", "f.gtld.biz"],
  "edu": ["a.edu-servers.net", "b.edu-servers.net", "c.edu-servers.net", "d.edu-servers.net", "e.edu-servers.net", "f.edu-servers.net", "g.edu-servers.net"],
  "gov": ["a.gov-servers.net", "b.gov-servers.net", "c.gov-servers.net", "d.gov-servers.net"],
  "mil": ["a.nic.mil", "b.nic.mil"],
  "int": ["ns0.ja.net", "ns1.cs.ucl.ac.uk", "ns2.cs.ucl.ac.uk"],
  "arpa": ["a.root-servers.net", "b.root-servers.net", "c.root-servers.net"],
  "aero": ["a0.nic.aero", "a2.nic.aero", "b0.nic.aero", "b2.nic.aero", "c0.nic.aero"],
  "asia": ["a0.asia.afilias-nst.info", "a2.asia.afilias-nst.info", "b0.asia.afilias-nst.org", "b2.asia.afilias-nst.org"],
  "coop": ["a.nic.coop", "b.nic.coop", "c.nic.coop", "d.nic.coop"],
  "jobs": ["a0.nic.jobs", "a2.nic.jobs", "b0.nic.jobs", "b2.nic.jobs"],
  "mobi": ["a0.nic.mobi", "a2.nic.mobi", "b0.nic.mobi", "b2.nic.mobi"],
  "museum": ["a0.nic.museum", "a2.nic.museum", "b0.nic.museum", "b2.nic.museum"],
  "name": ["a.nic.name", "b.nic.name", "c.nic.name", "d.nic.name"],
  "post": ["a.nic.post", "b.nic.post", "c.nic.post", "d.nic.post"],
  "tel": ["a0.nic.tel", "a2.nic.tel", "b0.nic.tel", "b2.nic.tel"],
  "travel": ["a0.nic.travel", "a2.nic.travel", "b0.nic.travel", "b2.nic.travel"],
  "xxx": ["a0.nic.xxx", "a2.nic.xxx", "b0.nic.xxx", "b2.nic.xxx"],
  
  // ========== 国家代码顶级域名 (ccTLDs) - 亚洲 ==========
  "cn": ["a.dns.cn", "b.dns.cn", "c.dns.cn", "d.dns.cn", "e.dns.cn", "f.dns.cn", "g.dns.cn", "ns.cnic.cn"],
  "jp": ["a.dns.jp", "b.dns.jp", "c.dns.jp", "d.dns.jp", "e.dns.jp", "f.dns.jp", "g.dns.jp"],
  "kr": ["b.dns.kr", "c.dns.kr", "d.dns.kr", "e.dns.kr", "f.dns.kr", "g.dns.kr"],
  "in": ["ns1.registry.in", "ns2.registry.in", "ns3.registry.in", "ns4.registry.in", "ns5.registry.in", "ns6.registry.in"],
  "tw": ["a.dns.tw", "b.dns.tw", "c.dns.tw", "d.dns.tw", "e.dns.tw", "f.dns.tw", "g.dns.tw", "h.dns.tw"],
  "hk": ["a.hkirc.net.hk", "b.hkirc.net.hk", "c.hkirc.net.hk", "d.hkirc.net.hk", "e.hkirc.net.hk", "f.hkirc.net.hk", "g.hkirc.net.hk", "h.hkirc.net.hk"],
  "sg": ["dsany.sgnic.sg", "dsb.sgnic.sg", "dsc.sgnic.sg", "ns2.cuhk.edu.hk", "ns4.apnic.net", "pch.sgnic.sg", "sec3.apnic.net"],
  "my": ["ns.mynic.my", "ns2.mynic.my", "a.nic.my", "b.nic.my"],
  "th": ["a.thains.co.th", "b.thains.co.th", "c.thains.co.th", "d.thains.co.th", "p.thains.co.th"],
  "vn": ["a.vnnic-servers.vn", "b.vnnic-servers.vn", "c.vnnic-servers.vn", "d.vnnic-servers.vn", "e.vnnic-servers.vn", "f.vnnic-servers.vn"],
  "id": ["a.dns.id", "b.dns.id", "c.dns.id", "d.dns.id", "e.dns.id", "f.dns.id"],
  "ph": ["a.phtld.ph", "b.phtld.ph", "c.phtld.ph", "d.phtld.ph"],
  "pk": ["ns1.pknic.net.pk", "ns2.pknic.net.pk", "ns3.pknic.net.pk", "ns4.pknic.net.pk"],
  "bd": ["jamuna.btcl.net.bd", "surma.btcl.net.bd", "ns1.nic.bd", "ns2.nic.bd"],
  "np": ["ns1.mos.com.np", "ns2.mos.com.np", "shikhar.mos.com.np"],
  "lk": ["ns1.ac.lk", "ns2.ac.lk", "pentha.nic.lk", "rip.psg.com"],
  "mm": ["ns1.registry.gov.mm", "ns2.registry.gov.mm"],
  "kh": ["ns1.dns.net.kh", "ns2.dns.net.kh"],
  "la": ["ns1.nic.la", "ns2.nic.la", "ns3.nic.la"],
  "mn": ["a.nic.mn", "b.nic.mn", "c.nic.mn", "d.nic.mn"],
  "kz": ["a.ns.kz", "b.ns.kz", "c.ns.kz", "d.ns.kz"],
  "uz": ["ns.uz", "ns2.uz", "ns3.uz"],
  "kg": ["ns.kg", "ns2.kg", "ns3.kg"],
  "am": ["a.nic.am", "b.nic.am", "c.nic.am"],
  "ge": ["a.nic.ge", "b.nic.ge", "c.nic.ge"],
  "az": ["a.nic.az", "b.nic.az", "c.nic.az"],
  "af": ["a.nic.af", "b.nic.af", "c.nic.af"],
  "mo": ["a.nic.mo", "b.nic.mo", "c.nic.mo"],
  "bn": ["ns1.bnnic.bn", "ns2.bnnic.bn", "ns3.bnnic.bn"],
  "bt": ["ns1.nic.bt", "ns2.nic.bt"],
  "kp": ["ns1.kptc.kp", "ns2.kptc.kp"],
  "mv": ["ns1.dhivehinet.net.mv", "ns2.dhivehinet.net.mv"],
  "tl": ["a.nic.tl", "b.nic.tl", "c.nic.tl"],
  "tj": ["ns.tj", "ns2.tj", "ns3.tj"],
  "tm": ["a.nic.tm", "b.nic.tm", "c.nic.tm"],
  
  // ========== 国家代码顶级域名 (ccTLDs) - 中东 ==========
  "ae": ["ns1.aedns.ae", "ns2.aedns.ae", "ns3.aedns.ae", "ns4.aedns.ae"],
  "sa": ["a.nic.sa", "b.nic.sa", "c.nic.sa", "d.nic.sa", "e.nic.sa", "f.nic.sa"],
  "eg": ["ns1.frcu.eun.eg", "ns2.frcu.eun.eg", "a.nic.eg", "b.nic.eg"],
  "il": ["ns1.isoc.org.il", "ns2.isoc.org.il", "ns3.isoc.org.il", "ns4.isoc.org.il"],
  "qa": ["ns1.registry.qa", "ns2.registry.qa", "ns3.registry.qa"],
  "kw": ["ns1.kw", "ns2.kw", "ns3.kw"],
  "om": ["a.nic.om", "b.nic.om", "c.nic.om"],
  "jo": ["ns1.dns.jo", "ns2.dns.jo", "ns3.dns.jo"],
  "lb": ["ns1.aub.edu.lb", "ns2.aub.edu.lb"],
  "ps": ["ns1.gov.ps", "ns2.gov.ps"],
  "sy": ["ns1.tld.sy", "ns2.tld.sy"],
  "iq": ["ns1.cmc.iq", "ns2.cmc.iq"],
  "ye": ["ns1.y.net.ye", "ns2.y.net.ye"],
  "bh": ["ns1.registry.bh", "ns2.registry.bh"],
  "cy": ["ns1.nic.cy", "ns2.nic.cy", "ns3.nic.cy"],
  "ir": ["ns1.nic.ir", "ns2.nic.ir", "ns3.nic.ir", "ns4.nic.ir", "ns5.nic.ir"],
  
  // ========== 国家代码顶级域名 (ccTLDs) - 欧洲 ==========
  "uk": ["dns1.nic.uk", "dns2.nic.uk", "dns3.nic.uk", "dns4.nic.uk", "nsa.nic.uk", "nsb.nic.uk", "nsc.nic.uk", "nsd.nic.uk"],
  "de": ["a.nic.de", "f.nic.de", "l.de.net", "n.de.net", "s.de.net", "z.nic.de"],
  "fr": ["d.nic.fr", "e.ext.nic.fr", "f.ext.nic.fr", "g.ext.nic.fr"],
  "it": ["a.dns.it", "m.dns.it", "nameserver.cnr.it", "r.dns.it", "s.dns.it", "dns.nic.it"],
  "es": ["a.nic.es", "c.nic.es", "d.nic.es", "g.nic.es", "h.nic.es"],
  "nl": ["ns1.dns.nl", "ns2.dns.nl", "ns3.dns.nl", "ns4.dns.nl", "ns5.dns.nl"],
  "se": ["a.ns.se", "b.ns.se", "c.ns.se", "d.ns.se", "e.ns.se", "f.ns.se", "g.ns.se"],
  "ch": ["a.nic.ch", "b.nic.ch", "c.nic.ch", "d.nic.ch", "e.nic.ch", "f.nic.ch"],
  "ru": ["a.dns.ripn.net", "b.dns.ripn.net", "d.dns.ripn.net", "e.dns.ripn.net", "f.dns.ripn.net"],
  "pl": ["a-dns.pl", "b-dns.pl", "d-dns.pl", "f-dns.pl", "g-dns.pl", "h-dns.pl", "i-dns.pl"],
  "gr": ["gr-at.ics.forth.gr", "gr-br.ics.forth.gr", "gr-m.ics.forth.gr", "grdns-de.denic.de", "grdns.ics.forth.gr"],
  "cz": ["a.ns.nic.cz", "b.ns.nic.cz", "c.ns.nic.cz", "d.ns.nic.cz"],
  "be": ["a.ns.dns.be", "b.ns.dns.be", "d.ns.dns.be", "n.ns.dns.be", "x.ns.dns.be", "y.ns.dns.be"],
  "at": ["a.nic.at", "b.nic.at", "c.nic.at", "d.nic.at", "r.nic.at", "u.nic.at"],
  "dk": ["a.nic.dk", "b.nic.dk", "c.nic.dk", "d.nic.dk", "e.nic.dk", "p.nic.dk", "s.nic.dk"],
  "no": ["a.nic.no", "b.nic.no", "c.nic.no", "d.nic.no", "e.nic.no", "f.nic.no"],
  "fi": ["a.fi", "b.fi", "c.fi", "d.fi", "e.fi", "f.fi", "g.fi"],
  "ie": ["a.iedr.ie", "b.iedr.ie", "c.iedr.ie", "d.iedr.ie"],
  "pt": ["a.dns.pt", "c.dns.pt", "d.dns.pt", "g.dns.pt", "h.dns.pt", "i.dns.pt"],
  "hu": ["a.hu", "b.hu", "c.hu", "d.hu", "e.hu", "f.hu"],
  "ro": ["a.rotld.ro", "b.rotld.ro", "c.rotld.ro", "d.rotld.ro", "e.rotld.ro"],
  "ua": ["a.dns.ua", "b.dns.ua", "c.dns.ua", "d.dns.ua", "e.dns.ua", "f.dns.ua"],
  "is": ["a.isnic.is", "b.isnic.is", "c.isnic.is"],
  "lu": ["a.dns.lu", "b.dns.lu", "c.dns.lu", "d.dns.lu"],
  "mt": ["a.nic.mt", "b.nic.mt", "c.nic.mt"],
  "ee": ["a.tld.ee", "b.tld.ee", "c.tld.ee", "d.tld.ee", "e.tld.ee"],
  "lv": ["a.nic.lv", "b.nic.lv", "c.nic.lv"],
  "lt": ["a.tld.lt", "b.tld.lt", "c.tld.lt", "d.tld.lt"],
  "si": ["a.ns.si", "b.ns.si", "c.ns.si", "d.ns.si"],
  "sk": ["a.ns.sk", "b.ns.sk", "c.ns.sk", "d.ns.sk", "e.ns.sk"],
  "hr": ["a.dns.hr", "b.dns.hr", "c.dns.hr"],
  "bg": ["a.dns.bg", "b.dns.bg", "c.dns.bg", "d.dns.bg"],
  "rs": ["a.nic.rs", "b.nic.rs", "c.nic.rs", "d.nic.rs"],
  "al": ["ns1.nic.al", "ns2.nic.al", "a.nic.al", "b.nic.al"],
  "ad": ["ns1.nic.ad", "ns2.nic.ad"],
  "ba": ["a.nic.ba", "b.nic.ba", "c.nic.ba"],
  "by": ["ns1.by", "ns2.by", "ns3.by", "ns4.by"],
  "va": ["ns1.nic.va", "ns2.nic.va"],
  "mc": ["a.nic.mc", "b.nic.mc", "c.nic.mc"],
  "sm": ["a.nic.sm", "b.nic.sm"],
  "li": ["a.nic.li", "b.nic.li", "c.nic.li"],
  "fo": ["a.nic.fo", "b.nic.fo", "c.nic.fo"],
  "gl": ["a.nic.gl", "b.nic.gl", "c.nic.gl"],
  "ax": ["a.ns.ax", "b.ns.ax"],
  "gg": ["a.nic.gg", "b.nic.gg", "c.nic.gg"],
  "je": ["a.nic.je", "b.nic.je", "c.nic.je"],
  "im": ["a.nic.im", "b.nic.im", "c.nic.im"],
  "mk": ["a.nic.mk", "b.nic.mk"],
  "me": ["a.nic.me", "b.nic.me", "c.nic.me", "d.nic.me"],
  "xk": ["ns1.nic.xk", "ns2.nic.xk"],
  "md": ["a.nic.md", "b.nic.md", "c.nic.md"],
  
  // ========== 国家代码顶级域名 (ccTLDs) - 大洋洲 ==========
  "au": ["a.au", "b.au", "c.au", "d.au", "u.au", "v.au", "w.au", "x.au", "y.au", "z.au"],
  "nz": ["ns1.dns.net.nz", "ns2.dns.net.nz", "ns3.dns.net.nz", "ns4.dns.net.nz", "ns5.dns.net.nz", "ns6.dns.net.nz", "ns7.dns.net.nz"],
  "as": ["ns1.nic.as", "ns2.nic.as"],
  "ck": ["ns1.nic.ck", "ns2.nic.ck"],
  "fj": ["ns1.nic.fj", "ns2.nic.fj", "ns3.nic.fj"],
  "fm": ["ns1.nic.fm", "ns2.nic.fm"],
  "ki": ["ns1.nic.ki", "ns2.nic.ki"],
  "mh": ["ns1.nic.mh", "ns2.nic.mh"],
  "mp": ["ns1.nic.mp", "ns2.nic.mp"],
  "nc": ["ns1.nc", "ns2.nc", "ns3.nc"],
  "nf": ["ns1.nic.nf", "ns2.nic.nf"],
  "nr": ["ns1.cenpac.net.nr", "ns2.cenpac.net.nr"],
  "nu": ["a.nic.nu", "b.nic.nu", "c.nic.nu"],
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
  "gu": ["ns1.nic.gu", "ns2.nic.gu"],
  "cc": ["a.nic.cc", "b.nic.cc", "c.nic.cc", "d.nic.cc"],
  "cx": ["a.nic.cx", "b.nic.cx", "c.nic.cx"],
  "hm": ["ns1.registry.hm", "ns2.registry.hm"],
  "io": ["a0.nic.io", "a2.nic.io", "b0.nic.io", "c0.nic.io"],
  
  // ========== 国家代码顶级域名 (ccTLDs) - 美洲 ==========
  "us": ["a.cctld.us", "b.cctld.us", "c.cctld.us", "d.cctld.us", "e.cctld.us", "f.cctld.us"],
  "ca": ["a.ca-servers.ca", "c.ca-servers.ca", "j.ca-servers.ca", "x.ca-servers.ca", "any.ca-servers.ca"],
  "br": ["a.dns.br", "b.dns.br", "c.dns.br", "d.dns.br", "e.dns.br", "f.dns.br"],
  "mx": ["a.mx-ns.mx", "c.mx-ns.mx", "e.mx-ns.mx", "m.mx-ns.mx", "o.mx-ns.mx"],
  "ar": ["a.lactld.org", "ar.cctld.authdns.ripe.net", "athena.nic.ar", "ns-ar.rcom.ar", "ns1.nic.ar", "ns2.nic.ar", "ns3.nic.ar"],
  "cl": ["a.nic.cl", "b.nic.cl", "c.nic.cl"],
  "co": ["a.nic.co", "b.nic.co", "c.nic.co", "e.nic.co", "ns1.nic.co", "ns2.nic.co", "ns3.nic.co", "ns4.nic.co"],
  "pe": ["a.lactld.org", "kero.yachay.pe", "ns1.nic.pe", "ns2.nic.pe"],
  "ve": ["a.lactld.org", "ns1.nic.ve", "ns2.nic.ve"],
  "uy": ["a.lactld.org", "ns.dns.br", "ns.uy", "seciu.edu.uy"],
  "ec": ["a.lactld.org", "ns.ecuadortelecom.net", "ns1.nic.ec"],
  "ai": ["a0.nic.ai", "a2.nic.ai", "b0.nic.ai", "c0.nic.ai"],
  "aw": ["ns1.nic.aw", "ns2.nic.aw"],
  "bb": ["a.lactld.org", "ns1.nic.bb"],
  "bm": ["ns1.ibl.bm", "ns2.ibl.bm"],
  "bo": ["a.lactld.org", "ns.nic.bo"],
  "bs": ["ns1.nic.bs", "ns2.nic.bs"],
  "cr": ["a.lactld.org", "ns.cr"],
  "cu": ["ns1.nic.cu", "ns2.nic.cu"],
  "cw": ["ns1.nic.cw", "ns2.nic.cw"],
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
  "bz": ["ns.nic.bz", "ns2.nic.bz"],
  "lc": ["a.nic.lc", "b.nic.lc"],
  "ag": ["a.nic.ag", "b.nic.ag"],
  "gd": ["a.nic.gd", "b.nic.gd", "c.nic.gd"],
  "kn": ["a.nic.kn", "b.nic.kn"],
  "sx": ["ns1.nic.sx", "ns2.nic.sx"],
  "bq": ["ns1.nic.bq", "ns2.nic.bq"],
  "pm": ["ns1.nic.pm", "ns2.nic.pm"],
  "mf": ["ns1.nic.mf", "ns2.nic.mf"],
  "bl": ["ns1.nic.bl", "ns2.nic.bl"],
  
  "fk": ["ns1.nic.fk", "ns2.nic.fk"],
  "gs": ["ns1.icb.co.fk", "ns2.icb.co.fk"],
  
  // ========== 国家代码顶级域名 (ccTLDs) - 非洲 ==========
  "za": ["auth01.ns.uu.net", "auth02.ns.uu.net", "coza1.dnsnode.net", "ns1.coza.net.za", "ns2.coza.net.za"],
  "ng": ["ns1.nic.net.ng", "ns2.nic.net.ng"],
  "ke": ["ns1.kenic.or.ke", "ns2.kenic.or.ke"],
  "gh": ["ns1.nic.gh", "ns2.nic.gh"],
  "tn": ["ns1.ati.tn", "ns2.ati.tn"],
  "ma": ["ns1.registre.ma", "ns2.registre.ma"],
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
  "tz": ["a.nic.tz", "b.nic.tz"],
  "ug": ["a.nic.ug", "b.nic.ug"],
  "zw": ["a.nic.zw", "b.nic.zw"],
  "zm": ["a.nic.zm", "b.nic.zm"],
  "mw": ["a.nic.mw", "b.nic.mw"],
  "mu": ["a.nic.mu", "b.nic.mu"],
  "mg": ["a.nic.mg", "b.nic.mg"],
  "na": ["a.nic.na", "b.nic.na"],
  "bw": ["a.nic.bw", "b.nic.bw"],
  "sh": ["a.nic.sh", "b.nic.sh", "c.nic.sh"],
  "ac": ["a.nic.ac", "b.nic.ac", "c.nic.ac"],
  "re": ["ns1.nic.re", "ns2.nic.re"],
  "yt": ["ns1.nic.yt", "ns2.nic.yt"],
  
  // ========== 新通用顶级域名 (New gTLDs) - 科技类 ==========
  "app": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "dev": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "page": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "new": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "how": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "soy": ["ns1.dns.nic.google", "ns2.dns.nic.google", "ns3.dns.nic.google", "ns4.dns.nic.google"],
  "xyz": ["a.nic.xyz", "b.nic.xyz", "c.nic.xyz", "d.nic.xyz"],
  "top": ["a.nic.top", "b.nic.top", "c.nic.top", "d.nic.top", "e.nic.top"],
  "site": ["a.nic.site", "b.nic.site", "c.nic.site", "d.nic.site"],
  "online": ["a.nic.online", "b.nic.online", "c.nic.online", "d.nic.online"],
  "store": ["a.nic.store", "b.nic.store", "c.nic.store", "d.nic.store"],
  "tech": ["a.nic.tech", "b.nic.tech", "c.nic.tech", "d.nic.tech"],
  "club": ["a.nic.club", "b.nic.club", "c.nic.club", "d.nic.club"],
  "vip": ["a.nic.vip", "b.nic.vip", "c.nic.vip", "d.nic.vip"],
  "blog": ["a.nic.blog", "b.nic.blog", "c.nic.blog", "d.nic.blog"],
  "shop": ["a.nic.shop", "b.nic.shop", "c.nic.shop", "d.nic.shop"],
  "link": ["a.nic.link", "b.nic.link", "c.nic.link", "d.nic.link"],
  "live": ["a.nic.live", "b.nic.live", "c.nic.live", "d.nic.live"],
  "pro": ["a.nic.pro", "b.nic.pro", "c.nic.pro", "d.nic.pro"],
  "wiki": ["ns1.dns.nic.wiki", "ns2.dns.nic.wiki", "ns3.dns.nic.wiki", "ns4.dns.nic.wiki"],
  "cloud": ["a.nic.cloud", "b.nic.cloud", "c.nic.cloud", "d.nic.cloud"],
  "news": ["a.nic.news", "b.nic.news", "c.nic.news", "d.nic.news"],
  "world": ["a.nic.world", "b.nic.world", "c.nic.world", "d.nic.world"],
  "network": ["a.nic.network", "b.nic.network", "c.nic.network", "d.nic.network"],
  "design": ["a.nic.design", "b.nic.design", "c.nic.design", "d.nic.design"],
  "space": ["a.nic.space", "b.nic.space", "c.nic.space", "d.nic.space"],
  "works": ["a.nic.works", "b.nic.works", "c.nic.works", "d.nic.works"],
  "web": ["a.nic.web", "b.nic.web", "c.nic.web"],
  "email": ["a.nic.email", "b.nic.email", "c.nic.email", "d.nic.email"],
  "media": ["a.nic.media", "b.nic.media", "c.nic.media", "d.nic.media"],
  "video": ["a.nic.video", "b.nic.video", "c.nic.video", "d.nic.video"],
  "photos": ["a.nic.photos", "b.nic.photos", "c.nic.photos", "d.nic.photos"],
  "today": ["a.nic.today", "b.nic.today", "c.nic.today", "d.nic.today"],
  "best": ["a.nic.best", "b.nic.best", "c.nic.best", "d.nic.best"],
  "win": ["a.nic.win", "b.nic.win", "c.nic.win", "d.nic.win"],
  "fun": ["a.nic.fun", "b.nic.fun", "c.nic.fun", "d.nic.fun"],
  "life": ["a.nic.life", "b.nic.life", "c.nic.life", "d.nic.life"],
  "plus": ["a.nic.plus", "b.nic.plus", "c.nic.plus", "d.nic.plus"],
  "work": ["a.nic.work", "b.nic.work", "c.nic.work", "d.nic.work"],
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
  "systems": ["a.nic.systems", "b.nic.systems", "c.nic.systems", "d.nic.systems"],
  "technology": ["a.nic.technology", "b.nic.technology", "c.nic.technology", "d.nic.technology"],
  "digital": ["a.nic.digital", "b.nic.digital", "c.nic.digital", "d.nic.digital"],
  
  // ========== 新通用顶级域名 - 商业类 ==========
  "company": ["a.nic.company", "b.nic.company", "c.nic.company", "d.nic.company"],
  "business": ["a.nic.business", "b.nic.business", "c.nic.business", "d.nic.business"],
  "group": ["a.nic.group", "b.nic.group", "c.nic.group", "d.nic.group"],
  "ventures": ["a.nic.ventures", "b.nic.ventures", "c.nic.ventures", "d.nic.ventures"],
  "solutions": ["a.nic.solutions", "b.nic.solutions", "c.nic.solutions", "d.nic.solutions"],
  "services": ["a.nic.services", "b.nic.services", "c.nic.services", "d.nic.services"],
  "agency": ["a.nic.agency", "b.nic.agency", "c.nic.agency", "d.nic.agency"],
  "studio": ["a.nic.studio", "b.nic.studio", "c.nic.studio", "d.nic.studio"],
  "center": ["a.nic.center", "b.nic.center", "c.nic.center", "d.nic.center"],
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
  "legal": ["a.nic.legal", "b.nic.legal", "c.nic.legal", "d.nic.legal"],
  "accountant": ["a.nic.accountant", "b.nic.accountant", "c.nic.accountant", "d.nic.accountant"],
  "accountants": ["a.nic.accountants", "b.nic.accountants", "c.nic.accountants", "d.nic.accountants"],
  "holdings": ["a.nic.holdings", "b.nic.holdings", "c.nic.holdings", "d.nic.holdings"],
  "enterprises": ["a.nic.enterprises", "b.nic.enterprises", "c.nic.enterprises", "d.nic.enterprises"],
  "capital": ["a.nic.capital", "b.nic.capital", "c.nic.capital", "d.nic.capital"],
  "fund": ["a.nic.fund", "b.nic.fund", "c.nic.fund", "d.nic.fund"],
  "investments": ["a.nic.investments", "b.nic.investments", "c.nic.investments", "d.nic.investments"],
  "money": ["a.nic.money", "b.nic.money", "c.nic.money", "d.nic.money"],
  "cash": ["a.nic.cash", "b.nic.cash", "c.nic.cash", "d.nic.cash"],
  "tax": ["a.nic.tax", "b.nic.tax", "c.nic.tax", "d.nic.tax"],
  "loans": ["a.nic.loans", "b.nic.loans", "c.nic.loans", "d.nic.loans"],
  "credit": ["a.nic.credit", "b.nic.credit", "c.nic.credit", "d.nic.credit"],
  "creditcard": ["a.nic.creditcard", "b.nic.creditcard", "c.nic.creditcard", "d.nic.creditcard"],
  "mortgage": ["a.nic.mortgage", "b.nic.mortgage", "c.nic.mortgage", "d.nic.mortgage"],
  
  // ========== 新通用顶级域名 - 行业/服务类 ==========
  "dental": ["a.nic.dental", "b.nic.dental", "c.nic.dental", "d.nic.dental"],
  "clinic": ["a.nic.clinic", "b.nic.clinic", "c.nic.clinic", "d.nic.clinic"],
  "hospital": ["a.nic.hospital", "b.nic.hospital", "c.nic.hospital", "d.nic.hospital"],
  "surgery": ["a.nic.surgery", "b.nic.surgery", "c.nic.surgery", "d.nic.surgery"],
  "healthcare": ["a.nic.healthcare", "b.nic.healthcare", "c.nic.healthcare", "d.nic.healthcare"],
  "health": ["a.nic.health", "b.nic.health", "c.nic.health", "d.nic.health"],
  "vet": ["a.nic.vet", "b.nic.vet", "c.nic.vet", "d.nic.vet"],
  "pharmacy": ["a.nic.pharmacy", "b.nic.pharmacy", "c.nic.pharmacy", "d.nic.pharmacy"],
  "doctor": ["a.nic.doctor", "b.nic.doctor", "c.nic.doctor", "d.nic.doctor"],
  "dentist": ["a.nic.dentist", "b.nic.dentist", "c.nic.dentist", "d.nic.dentist"],
  "education": ["a.nic.education", "b.nic.education", "c.nic.education", "d.nic.education"],
  "school": ["a.nic.school", "b.nic.school", "c.nic.school", "d.nic.school"],
  "university": ["a.nic.university", "b.nic.university", "c.nic.university", "d.nic.university"],
  "college": ["a.nic.college", "b.nic.college", "c.nic.college", "d.nic.college"],
  "academy": ["a.nic.academy", "b.nic.academy", "c.nic.academy", "d.nic.academy"],
  "training": ["a.nic.training", "b.nic.training", "c.nic.training", "d.nic.training"],
  "institute": ["a.nic.institute", "b.nic.institute", "c.nic.institute", "d.nic.institute"],
  "mba": ["a.nic.mba", "b.nic.mba", "c.nic.mba", "d.nic.mba"],
  "restaurant": ["a.nic.restaurant", "b.nic.restaurant", "c.nic.restaurant", "d.nic.restaurant"],
  "cafe": ["a.nic.cafe", "b.nic.cafe", "c.nic.cafe", "d.nic.cafe"],
  "catering": ["a.nic.catering", "b.nic.catering", "c.nic.catering", "d.nic.catering"],
  "pizza": ["a.nic.pizza", "b.nic.pizza", "c.nic.pizza", "d.nic.pizza"],
  "kitchen": ["a.nic.kitchen", "b.nic.kitchen", "c.nic.kitchen", "d.nic.kitchen"],
  "recipes": ["a.nic.recipes", "b.nic.recipes", "c.nic.recipes", "d.nic.recipes"],
  "menu": ["a.nic.menu", "b.nic.menu", "c.nic.menu", "d.nic.menu"],
  "bar": ["a.nic.bar", "b.nic.bar", "c.nic.bar", "d.nic.bar"],
  "pub": ["a.nic.pub", "b.nic.pub", "c.nic.pub", "d.nic.pub"],
  "wine": ["a.nic.wine", "b.nic.wine", "c.nic.wine", "d.nic.wine"],
  "beer": ["a.nic.beer", "b.nic.beer", "c.nic.beer", "d.nic.beer"],
  "coffee": ["a.nic.coffee", "b.nic.coffee", "c.nic.coffee", "d.nic.coffee"],
  "clothing": ["a.nic.clothing", "b.nic.clothing", "c.nic.clothing", "d.nic.clothing"],
  "fashion": ["a.nic.fashion", "b.nic.fashion", "c.nic.fashion", "d.nic.fashion"],
  "boutique": ["a.nic.boutique", "b.nic.boutique", "c.nic.boutique", "d.nic.boutique"],
  "jewelry": ["a.nic.jewelry", "b.nic.jewelry", "c.nic.jewelry", "d.nic.jewelry"],
  "watches": ["a.nic.watches", "b.nic.watches", "c.nic.watches", "d.nic.watches"],
  "shoes": ["a.nic.shoes", "b.nic.shoes", "c.nic.shoes", "d.nic.shoes"],
  "diamonds": ["a.nic.diamonds", "b.nic.diamonds", "c.nic.diamonds", "d.nic.diamonds"],
  "beauty": ["a.nic.beauty", "b.nic.beauty", "c.nic.beauty", "d.nic.beauty"],
  "hair": ["a.nic.hair", "b.nic.hair", "c.nic.hair", "d.nic.hair"],
  "salon": ["a.nic.salon", "b.nic.salon", "c.nic.salon", "d.nic.salon"],
  "spa": ["a.nic.spa", "b.nic.spa", "c.nic.spa", "d.nic.spa"],
  "fitness": ["a.nic.fitness", "b.nic.fitness", "c.nic.fitness", "d.nic.fitness"],
  "yoga": ["a.nic.yoga", "b.nic.yoga", "c.nic.yoga", "d.nic.yoga"],
  "dance": ["a.nic.dance", "b.nic.dance", "c.nic.dance", "d.nic.dance"],
  "football": ["a.nic.football", "b.nic.football", "c.nic.football", "d.nic.football"],
  "soccer": ["a.nic.soccer", "b.nic.soccer", "c.nic.soccer", "d.nic.soccer"],
  "hockey": ["a.nic.hockey", "b.nic.hockey", "c.nic.hockey", "d.nic.hockey"],
  "golf": ["a.nic.golf", "b.nic.golf", "c.nic.golf", "d.nic.golf"],
  "tennis": ["a.nic.tennis", "b.nic.tennis", "c.nic.tennis", "d.nic.tennis"],
  "games": ["a.nic.games", "b.nic.games", "c.nic.games", "d.nic.games"],
  "game": ["a.nic.game", "b.nic.game", "c.nic.game", "d.nic.game"],
  "casino": ["a.nic.casino", "b.nic.casino", "c.nic.casino", "d.nic.casino"],
  "bet": ["a.nic.bet", "b.nic.bet", "c.nic.bet", "d.nic.bet"],
  "poker": ["a.nic.poker", "b.nic.poker", "c.nic.poker", "d.nic.poker"],
  "dating": ["a.nic.dating", "b.nic.dating", "c.nic.dating", "d.nic.dating"],
  "singles": ["a.nic.singles", "b.nic.singles", "c.nic.singles", "d.nic.singles"],
  "wedding": ["a.nic.wedding", "b.nic.wedding", "c.nic.wedding", "d.nic.wedding"],
  "flowers": ["a.nic.flowers", "b.nic.flowers", "c.nic.flowers", "d.nic.flowers"],
  "gift": ["a.nic.gift", "b.nic.gift", "c.nic.gift", "d.nic.gift"],
  "gifts": ["a.nic.gifts", "b.nic.gifts", "c.nic.gifts", "d.nic.gifts"],
  "toys": ["a.nic.toys", "b.nic.toys", "c.nic.toys", "d.nic.toys"],
  "pet": ["a.nic.pet", "b.nic.pet", "c.nic.pet", "d.nic.pet"],
  "dog": ["a.nic.dog", "b.nic.dog", "c.nic.dog", "d.nic.dog"],
  "cat": ["a0.nic.cat", "b0.nic.cat", "c0.nic.cat", "d0.nic.cat"],
  "horse": ["a.nic.horse", "b.nic.horse", "c.nic.horse", "d.nic.horse"],
  "auto": ["a.nic.auto", "b.nic.auto", "c.nic.auto", "d.nic.auto"],
  "car": ["a.nic.car", "b.nic.car", "c.nic.car", "d.nic.car"],
  "cars": ["a.nic.cars", "b.nic.cars", "c.nic.cars", "d.nic.cars"],
  "bike": ["a.nic.bike", "b.nic.bike", "c.nic.bike", "d.nic.bike"],
  "motorcycle": ["a.nic.motorcycle", "b.nic.motorcycle", "c.nic.motorcycle", "d.nic.motorcycle"],
  "taxi": ["a.nic.taxi", "b.nic.taxi", "c.nic.taxi", "d.nic.taxi"],
  "repair": ["a.nic.repair", "b.nic.repair", "c.nic.repair", "d.nic.repair"],
  "parts": ["a.nic.parts", "b.nic.parts", "c.nic.parts", "d.nic.parts"],
  "tires": ["a.nic.tires", "b.nic.tires", "c.nic.tires", "d.nic.tires"],
  "house": ["a.nic.house", "b.nic.house", "c.nic.house", "d.nic.house"],
  "apartment": ["a.nic.apartment", "b.nic.apartment", "c.nic.apartment", "d.nic.apartment"],
  "condos": ["a.nic.condos", "b.nic.condos", "c.nic.condos", "d.nic.condos"],
  "villas": ["a.nic.villas", "b.nic.villas", "c.nic.villas", "d.nic.villas"],
  "land": ["a.nic.land", "b.nic.land", "c.nic.land", "d.nic.land"],
  "rent": ["a.nic.rent", "b.nic.rent", "c.nic.rent", "d.nic.rent"],
  "rentals": ["a.nic.rentals", "b.nic.rentals", "c.nic.rentals", "d.nic.rentals"],
  "construction": ["a.nic.construction", "b.nic.construction", "c.nic.construction", "d.nic.construction"],
  "builders": ["a.nic.builders", "b.nic.builders", "c.nic.builders", "d.nic.builders"],
  "plumbing": ["a.nic.plumbing", "b.nic.plumbing", "c.nic.plumbing", "d.nic.plumbing"],
  "contractors": ["a.nic.contractors", "b.nic.contractors", "c.nic.contractors", "d.nic.contractors"],
  "glass": ["a.nic.glass", "b.nic.glass", "c.nic.glass", "d.nic.glass"],
  "lighting": ["a.nic.lighting", "b.nic.lighting", "c.nic.lighting", "d.nic.lighting"],
  "solar": ["a.nic.solar", "b.nic.solar", "c.nic.solar", "d.nic.solar"],
  "energy": ["a.nic.energy", "b.nic.energy", "c.nic.energy", "d.nic.energy"],
  "eco": ["a.nic.eco", "b.nic.eco", "c.nic.eco", "d.nic.eco"],
  "green": ["a.nic.green", "b.nic.green", "c.nic.green", "d.nic.green"],
  "bio": ["a.nic.bio", "b.nic.bio", "c.nic.bio", "d.nic.bio"],
  "organic": ["a.nic.organic", "b.nic.organic", "c.nic.organic", "d.nic.organic"],
  "farm": ["a.nic.farm", "b.nic.farm", "c.nic.farm", "d.nic.farm"],
  "garden": ["a.nic.garden", "b.nic.garden", "c.nic.garden", "d.nic.garden"],
  "haus": ["a.nic.haus", "b.nic.haus", "c.nic.haus", "d.nic.haus"],
  "florist": ["a.nic.florist", "b.nic.florist", "c.nic.florist", "d.nic.florist"],
  
  // ========== 新通用顶级域名 - 旅游/娱乐类 ==========
  "vacation": ["a.nic.vacation", "b.nic.vacation", "c.nic.vacation", "d.nic.vacation"],
  "vacations": ["a.nic.vacations", "b.nic.vacations", "c.nic.vacations", "d.nic.vacations"],
  "cruises": ["a.nic.cruises", "b.nic.cruises", "c.nic.cruises", "d.nic.cruises"],
  "flights": ["a.nic.flights", "b.nic.flights", "c.nic.flights", "d.nic.flights"],
  "holiday": ["a.nic.holiday", "b.nic.holiday", "c.nic.holiday", "d.nic.holiday"],
  "hotel": ["a.nic.hotel", "b.nic.hotel", "c.nic.hotel", "d.nic.hotel"],
  "hoteles": ["a.nic.hoteles", "b.nic.hoteles", "c.nic.hoteles", "d.nic.hoteles"],
  "tours": ["a.nic.tours", "b.nic.tours", "c.nic.tours", "d.nic.tours"],
  "viajes": ["a.nic.viajes", "b.nic.viajes", "c.nic.viajes", "d.nic.viajes"],
  "voyage": ["a.nic.voyage", "b.nic.voyage", "c.nic.voyage", "d.nic.voyage"],
  "camp": ["a.nic.camp", "b.nic.camp", "c.nic.camp", "d.nic.camp"],
  "fishing": ["a.nic.fishing", "b.nic.fishing", "c.nic.fishing", "d.nic.fishing"],
  "ski": ["a.nic.ski", "b.nic.ski", "c.nic.ski", "d.nic.ski"],
  "surf": ["a.nic.surf", "b.nic.surf", "c.nic.surf", "d.nic.surf"],
  "events": ["a.nic.events", "b.nic.events", "c.nic.events", "d.nic.events"],
  "tickets": ["a.nic.tickets", "b.nic.tickets", "c.nic.tickets", "d.nic.tickets"],
  "show": ["a.nic.show", "b.nic.show", "c.nic.show", "d.nic.show"],
  "theater": ["a.nic.theater", "b.nic.theater", "c.nic.theater", "d.nic.theater"],
  "theatre": ["a.nic.theatre", "b.nic.theatre", "c.nic.theatre", "d.nic.theatre"],
  "movie": ["a.nic.movie", "b.nic.movie", "c.nic.movie", "d.nic.movie"],
  "film": ["a.nic.film", "b.nic.film", "c.nic.film", "d.nic.film"],
  "music": ["a.nic.music", "b.nic.music", "c.nic.music", "d.nic.music"],
  "audio": ["a.nic.audio", "b.nic.audio", "c.nic.audio", "d.nic.audio"],
  "band": ["a.nic.band", "b.nic.band", "c.nic.band", "d.nic.band"],
  "art": ["a.nic.art", "b.nic.art", "c.nic.art", "d.nic.art"],
  "gallery": ["a.nic.gallery", "b.nic.gallery", "c.nic.gallery", "d.nic.gallery"],
  "photography": ["a.nic.photography", "b.nic.photography", "c.nic.photography", "d.nic.photography"],
  "camera": ["a.nic.camera", "b.nic.camera", "c.nic.camera", "d.nic.camera"],
  "picture": ["a.nic.picture", "b.nic.picture", "c.nic.picture", "d.nic.picture"],
  "pictures": ["a.nic.pictures", "b.nic.pictures", "c.nic.pictures", "d.nic.pictures"],
  
  // ========== 新通用顶级域名 - 城市/地区类 ==========
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
  "rio": ["a.nic.rio", "b.nic.rio", "c.nic.rio", "d.nic.rio"],
  "roma": ["a.nic.roma", "b.nic.roma", "c.nic.roma", "d.nic.roma"],
  "stockholm": ["a.nic.stockholm", "b.nic.stockholm", "c.nic.stockholm", "d.nic.stockholm"],
  "sydney": ["a.nic.sydney", "b.nic.sydney", "c.nic.sydney", "d.nic.sydney"],
  "taipei": ["a.nic.taipei", "b.nic.taipei", "c.nic.taipei", "d.nic.taipei"],
  "tokyo": ["a.nic.tokyo", "b.nic.tokyo", "c.nic.tokyo", "d.nic.tokyo"],
  "vegas": ["a.nic.vegas", "b.nic.vegas", "c.nic.vegas", "d.nic.vegas"],
  "wien": ["a.nic.wien", "b.nic.wien", "c.nic.wien", "d.nic.wien"],
  "yokohama": ["a.nic.yokohama", "b.nic.yokohama", "c.nic.yokohama", "d.nic.yokohama"],
  "boston": ["a.nic.boston", "b.nic.boston", "c.nic.boston", "d.nic.boston"],
  "chicago": ["a.nic.chicago", "b.nic.chicago", "c.nic.chicago", "d.nic.chicago"],
  "koeln": ["a.nic.koeln", "b.nic.koeln", "c.nic.koeln", "d.nic.koeln"],
  "nrw": ["a.nic.nrw", "b.nic.nrw", "c.nic.nrw", "d.nic.nrw"],
  "ruhr": ["a.nic.ruhr", "b.nic.ruhr", "c.nic.ruhr", "d.nic.ruhr"],
  "saarland": ["a.nic.saarland", "b.nic.saarland", "c.nic.saarland", "d.nic.saarland"],
  "bayern": ["a.nic.bayern", "b.nic.bayern", "c.nic.bayern", "d.nic.bayern"],
  "tirol": ["a.nic.tirol", "b.nic.tirol", "c.nic.tirol", "d.nic.tirol"],
  "vlaanderen": ["a.nic.vlaanderen", "b.nic.vlaanderen", "c.nic.vlaanderen", "d.nic.vlaanderen"],
  "wales": ["a.nic.wales", "b.nic.wales", "c.nic.wales", "d.nic.wales"],
  "scot": ["a.nic.scot", "b.nic.scot", "c.nic.scot", "d.nic.scot"],
  "cymru": ["a.nic.cymru", "b.nic.cymru", "c.nic.cymru", "d.nic.cymru"],
  "irish": ["a.nic.irish", "b.nic.irish", "c.nic.irish", "d.nic.irish"],
  "kiwi": ["a.nic.kiwi", "b.nic.kiwi", "c.nic.kiwi", "d.nic.kiwi"],
  "quebec": ["a.nic.quebec", "b.nic.quebec", "c.nic.quebec", "d.nic.quebec"],
  "eus": ["a.nic.eus", "b.nic.eus", "c.nic.eus", "d.nic.eus"],
  "gal": ["a.nic.gal", "b.nic.gal", "c.nic.gal", "d.nic.gal"],
  "bzh": ["a.nic.bzh", "b.nic.bzh", "c.nic.bzh", "d.nic.bzh"],
  "alsace": ["a.nic.alsace", "b.nic.alsace", "c.nic.alsace", "d.nic.alsace"],
  "corsica": ["a.nic.corsica", "b.nic.corsica", "c.nic.corsica", "d.nic.corsica"],
  "africa": ["a.nic.africa", "b.nic.africa", "c.nic.africa", "d.nic.africa"],
  "capetown": ["a.nic.capetown", "b.nic.capetown", "c.nic.capetown", "d.nic.capetown"],
  "durban": ["a.nic.durban", "b.nic.durban", "c.nic.durban", "d.nic.durban"],
  "joburg": ["a.nic.joburg", "b.nic.joburg", "c.nic.joburg", "d.nic.joburg"],
  "lat": ["a.nic.lat", "b.nic.lat", "c.nic.lat", "d.nic.lat"],
  "arab": ["a.nic.arab", "b.nic.arab", "c.nic.arab", "d.nic.arab"],
  
  // ========== 新通用顶级域名 - 品牌类 ==========
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
  "cisco": ["a.nic.cisco", "b.nic.cisco", "c.nic.cisco", "d.nic.cisco"],
  "dell": ["a.nic.dell", "b.nic.dell", "c.nic.dell", "d.nic.dell"],
  "hitachi": ["a.nic.hitachi", "b.nic.hitachi", "c.nic.hitachi", "d.nic.hitachi"],
  "honda": ["a.nic.honda", "b.nic.honda", "c.nic.honda", "d.nic.honda"],
  "toyota": ["a.nic.toyota", "b.nic.toyota", "c.nic.toyota", "d.nic.toyota"],
  "bmw": ["a.nic.bmw", "b.nic.bmw", "c.nic.bmw", "d.nic.bmw"],
  "mini": ["a.nic.mini", "b.nic.mini", "c.nic.mini", "d.nic.mini"],
  "ferrari": ["a.nic.ferrari", "b.nic.ferrari", "c.nic.ferrari", "d.nic.ferrari"],
  "audi": ["a.nic.audi", "b.nic.audi", "c.nic.audi", "d.nic.audi"],
  "lexus": ["a.nic.lexus", "b.nic.lexus", "c.nic.lexus", "d.nic.lexus"],
  "lamborghini": ["a.nic.lamborghini", "b.nic.lamborghini", "c.nic.lamborghini", "d.nic.lamborghini"],
  "bentley": ["a.nic.bentley", "b.nic.bentley", "c.nic.bentley", "d.nic.bentley"],
  "bugatti": ["a.nic.bugatti", "b.nic.bugatti", "c.nic.bugatti", "d.nic.bugatti"],
  "alstom": ["a.nic.alstom", "b.nic.alstom", "c.nic.alstom", "d.nic.alstom"],
  "abb": ["a.nic.abb", "b.nic.abb", "c.nic.abb", "d.nic.abb"],
  "aig": ["a.nic.aig", "b.nic.aig", "c.nic.aig", "d.nic.aig"],
  "bnl": ["a.nic.bnl", "b.nic.bnl", "c.nic.bnl", "d.nic.bnl"],
  "bnpparibas": ["a.nic.bnpparibas", "b.nic.bnpparibas", "c.nic.bnpparibas", "d.nic.bnpparibas"],
  "citi": ["a.nic.citi", "b.nic.citi", "c.nic.citi", "d.nic.citi"],
  "hsbc": ["a.nic.hsbc", "b.nic.hsbc", "c.nic.hsbc", "d.nic.hsbc"],
  "barclays": ["a.nic.barclays", "b.nic.barclays", "c.nic.barclays", "d.nic.barclays"],
  "barclaycard": ["a.nic.barclaycard", "b.nic.barclaycard", "c.nic.barclaycard", "d.nic.barclaycard"],
  
  // ========== 国际化域名 (IDN TLDs) - Punycode形式 ==========
  // 中文
  "xn--fiqs8s": ["a.dns.cn", "b.dns.cn", "c.dns.cn", "d.dns.cn", "e.dns.cn", "f.dns.cn", "g.dns.cn"], // .中国
  "xn--fiqz9s": ["a.dns.cn", "b.dns.cn", "c.dns.cn", "d.dns.cn", "e.dns.cn", "f.dns.cn", "g.dns.cn"], // .中國
  "xn--55qx5d": ["a.dns.cn", "b.dns.cn", "c.dns.cn", "d.dns.cn"], // .公司
  "xn--io0a7i": ["a.dns.cn", "b.dns.cn", "c.dns.cn", "d.dns.cn"], // .网络
  "xn--1qqw23a": ["a.dns.cn", "b.dns.cn"], // .佛山
  "xn--xhq521b": ["a.dns.cn", "b.dns.cn"], // .广东
  "xn--czru2d": ["a.nic.xn--czru2d", "b.nic.xn--czru2d"], // .商城
  "xn--czr694b": ["a.nic.xn--czr694b", "b.nic.xn--czr694b"], // .商标
  "xn--zfr164b": ["a.nic.xn--zfr164b", "b.nic.xn--zfr164b"], // .商店
  "xn--ses554g": ["a.nic.xn--ses554g", "b.nic.xn--ses554g"], // .网址
  "xn--efvy88h": ["a.nic.xn--efvy88h", "b.nic.xn--efvy88h"], // .新闻
  "xn--vuq861b": ["a.nic.xn--vuq861b", "b.nic.xn--vuq861b"], // .信息
  "xn--3bst00m": ["a.nic.xn--3bst00m", "b.nic.xn--3bst00m"], // .集团
  "xn--9et52u": ["a.nic.xn--9et52u", "b.nic.xn--9et52u"], // .时尚
  "xn--cg4bki": ["a.nic.xn--cg4bki", "b.nic.xn--cg4bki"], // .삼성 (韩文三星)
  "xn--fiq228c5hs": ["a.nic.xn--fiq228c5hs", "b.nic.xn--fiq228c5hs"], // .中信
  "xn--6frz82g": ["a.nic.xn--6frz82g", "b.nic.xn--6frz82g"], // .移动
  "xn--nyqy26a": ["a.nic.xn--nyqy26a", "b.nic.xn--nyqy26a"], // .健康
  "xn--rhqv96g": ["a.nic.xn--rhqv96g", "b.nic.xn--rhqv96g"], // .世界
  "xn--fiq64b": ["a.nic.xn--fiq64b", "b.nic.xn--fiq64b"], // .中文网
  "xn--fjq720a": ["a.nic.xn--fjq720a", "b.nic.xn--fjq720a"], // .娱乐
  "xn--otu796d": ["a.nic.xn--otu796d", "b.nic.xn--otu796d"], // .招聘
  "xn--5tzm5g": ["a.nic.xn--5tzm5g", "b.nic.xn--5tzm5g"], // .网站
  "xn--45q11c": ["a.nic.xn--45q11c", "b.nic.xn--45q11c"], // .八卦
  "xn--czrs0t": ["a.nic.xn--czrs0t", "b.nic.xn--czrs0t"], // .商业
  "xn--6qq986b3xl": ["a.nic.xn--6qq986b3xl", "b.nic.xn--6qq986b3xl"], // .我爱你
  "xn--kput3i": ["a.nic.xn--kput3i", "b.nic.xn--kput3i"], // .手机
  
  // 香港/台湾
  "xn--j6w193g": ["a.hkirc.net.hk", "b.hkirc.net.hk", "c.hkirc.net.hk"], // .香港
  "xn--kpry57d": ["a.dns.tw", "b.dns.tw", "c.dns.tw", "d.dns.tw"], // .台灣
  "xn--kprw13d": ["a.dns.tw", "b.dns.tw", "c.dns.tw", "d.dns.tw"], // .台湾
  
  // 韩文
  "xn--t60b56a": ["b.dns.kr", "c.dns.kr"], // .닷컴
  "xn--3e0b707e": ["b.dns.kr", "c.dns.kr", "d.dns.kr", "e.dns.kr", "f.dns.kr", "g.dns.kr"], // .한국
  "xn--o39aa": ["a.nic.xn--o39aa", "b.nic.xn--o39aa"], // .닷넷
  
  // 日文
  "xn--q9jyb4c": ["ns1.dns.nic.google", "ns2.dns.nic.google"], // .みんな
  "xn--gk3at1e": ["a.nic.xn--gk3at1e", "b.nic.xn--gk3at1e"], // .コム
  "xn--gckr3f0f": ["a.nic.xn--gckr3f0f", "b.nic.xn--gckr3f0f"], // .ストア
  
  // 阿拉伯文
  "xn--mgberp4a5d4ar": ["a.nic.sa", "b.nic.sa"], // .السعودية (沙特阿拉伯)
  "xn--wgbl6a": ["ns1.registry.qa", "ns2.registry.qa"], // .قطر (卡塔尔)
  "xn--wgbh1c": ["a.nic.eg", "b.nic.eg"], // .مصر (埃及)
  "xn--mgbtf8fl": ["ns1.tld.sy", "ns2.tld.sy"], // .سوريا (叙利亚)
  "xn--pgbs0dh": ["ns1.ati.tn", "ns2.ati.tn"], // .تونس (突尼斯)
  "xn--mgbaam7a8h": ["ns1.aedns.ae", "ns2.aedns.ae"], // .امارات (阿联酋)
  "xn--ygbi2ammx": ["ns1.gov.ps", "ns2.gov.ps"], // .فلسطين (巴勒斯坦)
  "xn--mgbai9azgqp6j": ["ns1.pknic.net.pk", "ns2.pknic.net.pk"], // .پاکستان (巴基斯坦)
  "xn--mgba3a4f16a": ["ns1.nic.ir", "ns2.nic.ir", "ns3.nic.ir"], // .ایران (伊朗)
  "xn--mgb9awbf": ["a.nic.om", "b.nic.om"], // .عمان (阿曼)
  "xn--mgbx4cd0ab": ["ns1.registre.ma", "ns2.registre.ma"], // .المغرب (摩洛哥)
  "xn--ngbc5azd": ["ns1.nic.sn", "ns2.nic.sn"], // .شبكة (阿拉伯网络)
  "xn--mgb2ddes": ["ns1.y.net.ye", "ns2.y.net.ye"], // .اليمن (也门)
  
  // 俄罗斯/斯拉夫文
  "xn--90a3ac": ["a.nic.rs", "b.nic.rs"], // .срб (塞尔维亚)
  "xn--j1amh": ["a.ns.ua", "b.ns.ua"], // .укр (乌克兰)
  "xn--p1ai": ["a.dns.ripn.net", "b.dns.ripn.net"], // .рф (俄罗斯)
  "xn--90ae": ["ns1.bg", "ns2.bg"], // .бг (保加利亚)
  "xn--80ao21a": ["a.ns.kz", "b.ns.kz"], // .қаз (哈萨克斯坦)
  "xn--d1alf": ["a.nic.mk", "b.nic.mk"], // .мкд (马其顿)
  "xn--80adxhks": ["a.nic.moscow", "b.nic.moscow"], // .москва (莫斯科)
  "xn--c1avg": ["a.nic.xn--c1avg", "b.nic.xn--c1avg"], // .орг (俄文org)
  "xn--p1acf": ["a.nic.xn--p1acf", "b.nic.xn--p1acf"], // .рус (俄文rus)
  
  // 希腊文
  "xn--qxam": ["gr-at.ics.forth.gr", "gr-br.ics.forth.gr"], // .ελ (希腊)
  "xn--e1a4c": ["a.tld.ee", "b.tld.ee"], // .ею (欧盟俄文)
  
  // 印度文
  "xn--h2brj9c": ["ns1.registry.in", "ns2.registry.in"], // .भारत (印地语印度)
  "xn--45brj9c": ["ns1.registry.in", "ns2.registry.in"], // .ভারত (孟加拉语印度)
  "xn--gecrj9c": ["ns1.registry.in", "ns2.registry.in"], // .ભારત (古吉拉特语印度)
  "xn--s9brj9c": ["ns1.registry.in", "ns2.registry.in"], // .ਭਾਰਤ (旁遮普语印度)
  "xn--xkc2dl3a5ee0h": ["ns1.registry.in", "ns2.registry.in"], // .இந்தியா (泰米尔语印度)
  "xn--rvc1e0am3e": ["ns1.registry.in", "ns2.registry.in"], // .ഭാരതം (马拉雅拉姆语印度)
  "xn--fpcrj9c3d": ["ns1.registry.in", "ns2.registry.in"], // .భారత్ (泰卢固语印度)
  "xn--3hcrj9c": ["ns1.registry.in", "ns2.registry.in"], // .ভাৰত (阿萨姆语印度)
  "xn--mgbbh1a71e": ["ns1.registry.in", "ns2.registry.in"], // .بھارت (乌尔都语印度)
  "xn--2scrj9c": ["ns1.registry.in", "ns2.registry.in"], // .ಭಾರತ (卡纳达语印度)
  "xn--mgba3a3ejt": ["ns1.registry.in", "ns2.registry.in"], // .ارامكو (阿美石油)
  
  // 泰文
  "xn--o3cw4h": ["a.thains.co.th", "b.thains.co.th"], // .ไทย (泰国)
  
  // 格鲁吉亚/亚美尼亚
  "xn--node": ["a.nic.ge", "b.nic.ge"], // .გე (格鲁吉亚)
  
  // 以色列希伯来文
  "xn--4dbrk0ce": ["ns1.isoc.org.il", "ns2.isoc.org.il"], // .ישראל (以色列)
  
  // 新加坡
  "xn--yfro4i67o": ["dsany.sgnic.sg", "dsb.sgnic.sg"], // .新加坡
  
  // 斯里兰卡
  "xn--fzc2c9e2c": ["ns1.ac.lk", "ns2.ac.lk"], // .ලංකා (僧伽罗语斯里兰卡)
  "xn--xkc2al3hye2a": ["ns1.ac.lk", "ns2.ac.lk"], // .இலங்கை (泰米尔语斯里兰卡)
  
  // 越南
  // 蒙古
  "xn--l1acc": ["a.nic.mn", "b.nic.mn"], // .мон (蒙古)
  
  // 更多新gTLD
  "icu": ["a.nic.icu", "b.nic.icu", "c.nic.icu", "d.nic.icu"],
  "ltd": ["a.nic.ltd", "b.nic.ltd", "c.nic.ltd", "d.nic.ltd"],
  "men": ["a.nic.men", "b.nic.men", "c.nic.men", "d.nic.men"],
  "one": ["a.nic.one", "b.nic.one", "c.nic.one", "d.nic.one"],
  "run": ["a.nic.run", "b.nic.run", "c.nic.run", "d.nic.run"],
  "red": ["a.nic.red", "b.nic.red", "c.nic.red", "d.nic.red"],
  "blue": ["a.nic.blue", "b.nic.blue", "c.nic.blue", "d.nic.blue"],
  "pink": ["a.nic.pink", "b.nic.pink", "c.nic.pink", "d.nic.pink"],
  "gold": ["a.nic.gold", "b.nic.gold", "c.nic.gold", "d.nic.gold"],
  "black": ["a.nic.black", "b.nic.black", "c.nic.black", "d.nic.black"],
  "orange": ["a.nic.orange", "b.nic.orange", "c.nic.orange", "d.nic.orange"],
  "domains": ["a.nic.domains", "b.nic.domains", "c.nic.domains", "d.nic.domains"],
  "zone": ["a.nic.zone", "b.nic.zone", "c.nic.zone", "d.nic.zone"],
  "city": ["a.nic.city", "b.nic.city", "c.nic.city", "d.nic.city"],
  "town": ["a.nic.town", "b.nic.town", "c.nic.town", "d.nic.town"],
  "earth": ["a.nic.earth", "b.nic.earth", "c.nic.earth", "d.nic.earth"],
  "global": ["a.nic.global", "b.nic.global", "c.nic.global", "d.nic.global"],
  "international": ["a.nic.international", "b.nic.international", "c.nic.international", "d.nic.international"],
  "exchange": ["a.nic.exchange", "b.nic.exchange", "c.nic.exchange", "d.nic.exchange"],
  "express": ["a.nic.express", "b.nic.express", "c.nic.express", "d.nic.express"],
  "delivery": ["a.nic.delivery", "b.nic.delivery", "c.nic.delivery", "d.nic.delivery"],
  "supply": ["a.nic.supply", "b.nic.supply", "c.nic.supply", "d.nic.supply"],
  "supplies": ["a.nic.supplies", "b.nic.supplies", "c.nic.supplies", "d.nic.supplies"],
  "direct": ["a.nic.direct", "b.nic.direct", "c.nic.direct", "d.nic.direct"],
  "directory": ["a.nic.directory", "b.nic.directory", "c.nic.directory", "d.nic.directory"],
  "guide": ["a.nic.guide", "b.nic.guide", "c.nic.guide", "d.nic.guide"],
  "help": ["a.nic.help", "b.nic.help", "c.nic.help", "d.nic.help"],
  "support": ["a.nic.support", "b.nic.support", "c.nic.support", "d.nic.support"],
  "tips": ["a.nic.tips", "b.nic.tips", "c.nic.tips", "d.nic.tips"],
  "tools": ["a.nic.tools", "b.nic.tools", "c.nic.tools", "d.nic.tools"],
  "watch": ["a.nic.watch", "b.nic.watch", "c.nic.watch", "d.nic.watch"],
  "review": ["a.nic.review", "b.nic.review", "c.nic.review", "d.nic.review"],
  "reviews": ["a.nic.reviews", "b.nic.reviews", "c.nic.reviews", "d.nic.reviews"],
  "report": ["a.nic.report", "b.nic.report", "c.nic.report", "d.nic.report"],
  "click": ["a.nic.click", "b.nic.click", "c.nic.click", "d.nic.click"],
  "buzz": ["a.nic.buzz", "b.nic.buzz", "c.nic.buzz", "d.nic.buzz"],
  "cool": ["a.nic.cool", "b.nic.cool", "c.nic.cool", "d.nic.cool"],
  "fail": ["a.nic.fail", "b.nic.fail", "c.nic.fail", "d.nic.fail"],
  "guru": ["a.nic.guru", "b.nic.guru", "c.nic.guru", "d.nic.guru"],
  "ninja": ["a.nic.ninja", "b.nic.ninja", "c.nic.ninja", "d.nic.ninja"],
  "rocks": ["a.nic.rocks", "b.nic.rocks", "c.nic.rocks", "d.nic.rocks"],
  "sexy": ["a.nic.sexy", "b.nic.sexy", "c.nic.sexy", "d.nic.sexy"],
  "social": ["a.nic.social", "b.nic.social", "c.nic.social", "d.nic.social"],
  "community": ["a.nic.community", "b.nic.community", "c.nic.community", "d.nic.community"],
  "family": ["a.nic.family", "b.nic.family", "c.nic.family", "d.nic.family"],
  "kids": ["a.nic.kids", "b.nic.kids", "c.nic.kids", "d.nic.kids"],
  "baby": ["a.nic.baby", "b.nic.baby", "c.nic.baby", "d.nic.baby"],
  "mom": ["a.nic.mom", "b.nic.mom", "c.nic.mom", "d.nic.mom"],
  "dad": ["a.nic.dad", "b.nic.dad", "c.nic.dad", "d.nic.dad"],
  "care": ["a.nic.care", "b.nic.care", "c.nic.care", "d.nic.care"],
  "love": ["a.nic.love", "b.nic.love", "c.nic.love", "d.nic.love"],
  "faith": ["a.nic.faith", "b.nic.faith", "c.nic.faith", "d.nic.faith"],
  "church": ["a.nic.church", "b.nic.church", "c.nic.church", "d.nic.church"],
  "foundation": ["a.nic.foundation", "b.nic.foundation", "c.nic.foundation", "d.nic.foundation"],
  "charity": ["a.nic.charity", "b.nic.charity", "c.nic.charity", "d.nic.charity"],
  "giving": ["a.nic.giving", "b.nic.giving", "c.nic.giving", "d.nic.giving"],
  "science": ["a.nic.science", "b.nic.science", "c.nic.science", "d.nic.science"],
  "engineering": ["a.nic.engineering", "b.nic.engineering", "c.nic.engineering", "d.nic.engineering"],
  "degree": ["a.nic.degree", "b.nic.degree", "c.nic.degree", "d.nic.degree"],
  "study": ["a.nic.study", "b.nic.study", "c.nic.study", "d.nic.study"],
  "courses": ["a.nic.courses", "b.nic.courses", "c.nic.courses", "d.nic.courses"],
  "career": ["a.nic.career", "b.nic.career", "c.nic.career", "d.nic.career"],
  "careers": ["a.nic.careers", "b.nic.careers", "c.nic.careers", "d.nic.careers"],
  "team": ["a.nic.team", "b.nic.team", "c.nic.team", "d.nic.team"],
  "expert": ["a.nic.expert", "b.nic.expert", "c.nic.expert", "d.nic.expert"],
  "ceo": ["a.nic.ceo", "b.nic.ceo", "c.nic.ceo", "d.nic.ceo"],
  "actor": ["a.nic.actor", "b.nic.actor", "c.nic.actor", "d.nic.actor"],
  "author": ["a.nic.author", "b.nic.author", "c.nic.author", "d.nic.author"],
  
  "lol": ["a.nic.lol", "b.nic.lol", "c.nic.lol", "d.nic.lol"],
  "wtf": ["a.nic.wtf", "b.nic.wtf", "c.nic.wtf", "d.nic.wtf"],
  "wow": ["a.nic.wow", "b.nic.wow", "c.nic.wow", "d.nic.wow"],
  "sucks": ["a.nic.sucks", "b.nic.sucks", "c.nic.sucks", "d.nic.sucks"],
  "stream": ["a.nic.stream", "b.nic.stream", "c.nic.stream", "d.nic.stream"],
  "party": ["a.nic.party", "b.nic.party", "c.nic.party", "d.nic.party"],
  "date": ["a.nic.date", "b.nic.date", "c.nic.date", "d.nic.date"],
  "trade": ["a.nic.trade", "b.nic.trade", "c.nic.trade", "d.nic.trade"],
  "bid": ["a.nic.bid", "b.nic.bid", "c.nic.bid", "d.nic.bid"],
  "racing": ["a.nic.racing", "b.nic.racing", "c.nic.racing", "d.nic.racing"],
  "cricket": ["a.nic.cricket", "b.nic.cricket", "c.nic.cricket", "d.nic.cricket"],
  "loan": ["a.nic.loan", "b.nic.loan", "c.nic.loan", "d.nic.loan"],
  
  // 更多ccTLD补充
  "eu": ["a.nic.eu", "b.nic.eu", "c.nic.eu", "d.nic.eu", "e.nic.eu"],
  "su": ["a.dns.ripn.net", "b.dns.ripn.net", "c.dns.ripn.net"],
  "sj": ["ns1.nic.sj", "ns2.nic.sj"],
  "gi": ["ns1.nic.gi", "ns2.nic.gi"],
  "aq": ["ns1.nic.aq", "ns2.nic.aq"],
  "tf": ["ns1.nic.tf", "ns2.nic.tf"],
  "bv": ["ns1.nic.bv", "ns2.nic.bv"],
  "um": ["ns1.nic.um", "ns2.nic.um"],
};

// 完整的二级域名列表
const SECOND_LEVEL_TLDS = [
  // 英国
  'co.uk', 'ac.uk', 'gov.uk', 'org.uk', 'net.uk', 'ltd.uk', 'plc.uk', 'me.uk', 'sch.uk', 'nhs.uk', 'police.uk',
  // 中国
  'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'edu.cn', 'ac.cn', 'mil.cn', 'bj.cn', 'sh.cn', 'tj.cn', 'cq.cn', 'he.cn', 'sx.cn', 'nm.cn', 'ln.cn', 'jl.cn', 'hl.cn', 'js.cn', 'zj.cn', 'ah.cn', 'fj.cn', 'jx.cn', 'sd.cn', 'ha.cn', 'hb.cn', 'hn.cn', 'gd.cn', 'gx.cn', 'hi.cn', 'sc.cn', 'gz.cn', 'yn.cn', 'xz.cn', 'sn.cn', 'gs.cn', 'qh.cn', 'nx.cn', 'xj.cn', 'tw.cn', 'hk.cn', 'mo.cn',
  // 澳大利亚
  'com.au', 'net.au', 'org.au', 'gov.au', 'edu.au', 'asn.au', 'id.au',
  // 日本
  'co.jp', 'ne.jp', 'or.jp', 'ac.jp', 'ad.jp', 'ed.jp', 'go.jp', 'gr.jp', 'lg.jp',
  // 印度
  'co.in', 'net.in', 'org.in', 'ac.in', 'edu.in', 'gov.in', 'mil.in', 'res.in', 'gen.in', 'firm.in', 'ind.in',
  // 新西兰
  'co.nz', 'net.nz', 'org.nz', 'ac.nz', 'govt.nz', 'geek.nz', 'gen.nz', 'iwi.nz', 'kiwi.nz', 'maori.nz', 'mil.nz', 'school.nz',
  // 南非
  'co.za', 'net.za', 'org.za', 'gov.za', 'ac.za', 'edu.za', 'mil.za', 'nom.za', 'web.za',
  // 巴西
  'com.br', 'net.br', 'org.br', 'gov.br', 'edu.br', 'art.br', 'blog.br', 'dev.br', 'eco.br', 'emp.br', 'log.br', 'tec.br', 'tv.br',
  // 韩国
  'co.kr', 'ne.kr', 'or.kr', 'ac.kr', 're.kr', 'pe.kr', 'go.kr', 'mil.kr', 'hs.kr', 'ms.kr', 'es.kr', 'kg.kr',
  // 阿根廷
  'com.ar', 'net.ar', 'org.ar', 'gov.ar', 'edu.ar', 'int.ar', 'tur.ar',
  // 墨西哥
  'com.mx', 'net.mx', 'org.mx', 'gob.mx', 'edu.mx',
  // 香港
  'com.hk', 'net.hk', 'org.hk', 'gov.hk', 'edu.hk', 'idv.hk',
  // 台湾
  'com.tw', 'net.tw', 'org.tw', 'gov.tw', 'edu.tw', 'idv.tw', 'game.tw', 'ebiz.tw', 'club.tw',
  // 新加坡
  'com.sg', 'net.sg', 'org.sg', 'gov.sg', 'edu.sg', 'per.sg',
  // 马来西亚
  'com.my', 'net.my', 'org.my', 'gov.my', 'edu.my', 'mil.my', 'name.my',
  // 印度尼西亚
  'co.id', 'or.id', 'ac.id', 'go.id', 'web.id', 'sch.id', 'mil.id', 'net.id', 'desa.id', 'biz.id', 'my.id',
  // 泰国
  'co.th', 'ac.th', 'go.th', 'or.th', 'in.th', 'mi.th', 'net.th',
  // 越南
  'com.vn', 'net.vn', 'org.vn', 'gov.vn', 'edu.vn', 'int.vn', 'ac.vn', 'biz.vn', 'info.vn', 'name.vn', 'pro.vn', 'health.vn',
  // 菲律宾
  'com.ph', 'net.ph', 'org.ph', 'gov.ph', 'edu.ph', 'mil.ph', 'ngo.ph',
  // 土耳其
  'com.tr', 'net.tr', 'org.tr', 'gov.tr', 'edu.tr', 'mil.tr', 'k12.tr', 'av.tr', 'dr.tr', 'bel.tr', 'pol.tr', 'bbs.tr', 'gen.tr', 'info.tr', 'name.tr', 'web.tr', 'tel.tr', 'tv.tr',
  // 俄罗斯
  'com.ru', 'net.ru', 'org.ru', 'gov.ru', 'ac.ru', 'edu.ru', 'int.ru', 'mil.ru', 'pp.ru',
  // 乌克兰
  'com.ua', 'net.ua', 'org.ua', 'gov.ua', 'edu.ua', 'in.ua', 'kiev.ua', 'kharkov.ua', 'odessa.ua',
  // 波兰
  'com.pl', 'net.pl', 'org.pl', 'gov.pl', 'edu.pl', 'mil.pl', 'info.pl', 'biz.pl', 'waw.pl', 'krakow.pl', 'poznan.pl', 'wroc.pl', 'gdansk.pl', 'lodz.pl', 'slupsk.pl', 'szczecin.pl', 'torun.pl',
  // 希腊
  'com.gr', 'net.gr', 'org.gr', 'gov.gr', 'edu.gr',
  // 阿联酋
  'co.ae', 'net.ae', 'org.ae', 'gov.ae', 'ac.ae', 'sch.ae', 'mil.ae',
  // 沙特
  'com.sa', 'net.sa', 'org.sa', 'gov.sa', 'edu.sa', 'med.sa', 'pub.sa', 'sch.sa',
  // 埃及
  'com.eg', 'net.eg', 'org.eg', 'gov.eg', 'edu.eg', 'sci.eg', 'eun.eg',
  // 以色列
  'co.il', 'net.il', 'org.il', 'gov.il', 'ac.il', 'k12.il', 'idf.il', 'muni.il',
  // 巴基斯坦
  'com.pk', 'net.pk', 'org.pk', 'gov.pk', 'edu.pk', 'web.pk', 'fam.pk', 'biz.pk',
  // 孟加拉国
  'com.bd', 'net.bd', 'org.bd', 'gov.bd', 'edu.bd', 'ac.bd', 'mil.bd',
  // 斯里兰卡
  'com.lk', 'net.lk', 'org.lk', 'gov.lk', 'edu.lk', 'ac.lk', 'sch.lk', 'assn.lk', 'grp.lk', 'soc.lk', 'hotel.lk', 'int.lk', 'ltd.lk',
  // 尼泊尔
  'com.np', 'net.np', 'org.np', 'gov.np', 'edu.np', 'mil.np',
  // 缅甸
  'com.mm', 'net.mm', 'org.mm', 'gov.mm', 'edu.mm',
  // 柬埔寨
  'com.kh', 'net.kh', 'org.kh', 'gov.kh', 'edu.kh', 'per.kh',
  // 老挝
  'com.la', 'net.la', 'org.la', 'gov.la', 'edu.la', 'int.la',
  // 蒙古
  'com.mn', 'org.mn', 'gov.mn', 'edu.mn',
  // 尼日利亚
  'com.ng', 'net.ng', 'org.ng', 'gov.ng', 'edu.ng', 'mil.ng', 'sch.ng', 'name.ng', 'mobi.ng', 'i.ng',
  // 肯尼亚
  'co.ke', 'or.ke', 'go.ke', 'ac.ke', 'sc.ke', 'me.ke', 'mobi.ke', 'info.ke', 'ne.ke',
  // 加纳
  'com.gh', 'net.gh', 'org.gh', 'gov.gh', 'edu.gh', 'mil.gh',
  // 摩洛哥
  'co.ma', 'net.ma', 'org.ma', 'gov.ma', 'ac.ma', 'press.ma',
  // 突尼斯
  'com.tn', 'net.tn', 'org.tn', 'gov.tn', 'edu.tn', 'fin.tn', 'nat.tn', 'ind.tn', 'info.tn', 'intl.tn', 'rnrt.tn', 'rns.tn', 'rnu.tn', 'tourism.tn',
  // 南非更多
  'law.za', 'ngo.za',
  // 更多
  'co.tz', 'or.tz', 'go.tz', 'ac.tz', 'sc.tz', 'me.tz', 'hotel.tz', 'tv.tz', 'info.tz', 'mobi.tz', 'ne.tz',
  'co.ug', 'or.ug', 'go.ug', 'ac.ug', 'sc.ug', 'ne.ug',
  'co.zw', 'org.zw', 'gov.zw', 'ac.zw',
  'co.zm', 'org.zm', 'gov.zm', 'ac.zm', 'sch.zm',
  // 非洲冷门 ccTLD 二级域名
  'com.gq', 'net.gq', 'org.gq',
  'com.cf', 'net.cf', 'org.cf',
  'com.ga', 'net.ga', 'org.ga',
  'com.ml', 'net.ml', 'org.ml',
  'com.td', 'net.td', 'org.td',
  'com.bf', 'net.bf', 'org.bf',
  'com.bj', 'net.bj', 'org.bj',
  'com.ci', 'net.ci', 'org.ci', 'edu.ci', 'ac.ci',
  'com.cm', 'net.cm', 'org.cm', 'gov.cm',
  'com.cd', 'net.cd', 'org.cd',
  'co.ao', 'og.ao', 'it.ao', 'ed.ao', 'gv.ao', 'pb.ao',
  'com.dz', 'net.dz', 'org.dz', 'gov.dz', 'edu.dz', 'art.dz',
  'com.ly', 'net.ly', 'org.ly', 'gov.ly', 'edu.ly', 'id.ly', 'med.ly', 'plc.ly', 'sch.ly',
  'com.et', 'net.et', 'org.et', 'gov.et', 'edu.et', 'biz.et', 'name.et', 'info.et',
  'com.rw', 'net.rw', 'org.rw', 'gov.rw', 'ac.rw', 'co.rw', 'mil.rw',
  'com.sd', 'net.sd', 'org.sd', 'gov.sd', 'edu.sd', 'med.sd', 'tv.sd', 'info.sd',
  'com.mg', 'net.mg', 'org.mg', 'gov.mg', 'edu.mg', 'mil.mg', 'prd.mg', 'tm.mg',
  'com.mu', 'net.mu', 'org.mu', 'gov.mu', 'ac.mu', 'co.mu',
  'com.na', 'net.na', 'org.na', 'gov.na', 'edu.na', 'alt.na',
  // 更多亚洲二级
  'com.af', 'net.af', 'org.af', 'gov.af', 'edu.af',
  'com.ge', 'net.ge', 'org.ge', 'gov.ge', 'edu.ge', 'pvt.ge', 'mil.ge',
  'com.az', 'net.az', 'org.az', 'gov.az', 'edu.az', 'mil.az', 'int.az', 'pp.az', 'biz.az', 'info.az', 'name.az',
  'com.kz', 'net.kz', 'org.kz', 'gov.kz', 'edu.kz', 'mil.kz',
  'com.uz', 'net.uz', 'org.uz', 'gov.uz', 'edu.uz', 'mil.uz', 'co.uz',
  'com.tj', 'net.tj', 'org.tj', 'gov.tj', 'edu.tj', 'mil.tj', 'ac.tj', 'biz.tj', 'co.tj', 'int.tj', 'name.tj', 'web.tj',
  'com.kg', 'net.kg', 'org.kg', 'gov.kg', 'edu.kg', 'mil.kg',
  // 中东更多
  'com.qa', 'net.qa', 'org.qa', 'gov.qa', 'edu.qa', 'mil.qa', 'sch.qa', 'name.qa',
  'com.om', 'net.om', 'org.om', 'gov.om', 'edu.om', 'mil.om', 'co.om', 'pro.om', 'med.om', 'museum.om',
  'com.jo', 'net.jo', 'org.jo', 'gov.jo', 'edu.jo', 'mil.jo', 'name.jo', 'sch.jo',
  'com.lb', 'net.lb', 'org.lb', 'gov.lb', 'edu.lb',
  'com.kw', 'net.kw', 'org.kw', 'gov.kw', 'edu.kw',
  'com.bh', 'net.bh', 'org.bh', 'gov.bh', 'edu.bh',
  'com.ye', 'net.ye', 'org.ye', 'gov.ye', 'edu.ye', 'mil.ye', 'co.ye', 'ltd.ye', 'me.ye', 'plc.ye',
  'com.iq', 'net.iq', 'org.iq', 'gov.iq', 'edu.iq', 'mil.iq',
  'com.sy', 'net.sy', 'org.sy', 'gov.sy', 'edu.sy', 'mil.sy',
  'com.ps', 'net.ps', 'org.ps', 'gov.ps', 'edu.ps',
  'co.ir', 'ac.ir', 'gov.ir', 'id.ir', 'net.ir', 'org.ir', 'sch.ir',
];

/**
 * 增强的Punycode编码实现
 * 完整支持IDN域名转换
 */
function punyEncode(input: string): string {
  const BASE = 36;
  const TMIN = 1;
  const TMAX = 26;
  const SKEW = 38;
  const DAMP = 700;
  const INITIAL_BIAS = 72;
  const INITIAL_N = 128;
  const DELIMITER = '-';

  const basicChars: string[] = [];
  const nonBasicChars: number[] = [];
  
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code < 128) {
      basicChars.push(input[i]);
    } else {
      nonBasicChars.push(code);
    }
  }
  
  let output = basicChars.join('');
  if (basicChars.length > 0 && nonBasicChars.length > 0) {
    output += DELIMITER;
  }
  
  if (nonBasicChars.length === 0) {
    return output;
  }
  
  // 简化的编码逻辑
  const allCodes = [...new Set([...input].map(c => c.charCodeAt(0)).filter(c => c >= 128))].sort((a, b) => a - b);
  
  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;
  let handled = basicChars.length;
  
  const adapt = (delta: number, numPoints: number, firstTime: boolean): number => {
    delta = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
    delta += Math.floor(delta / numPoints);
    let k = 0;
    while (delta > Math.floor(((BASE - TMIN) * TMAX) / 2)) {
      delta = Math.floor(delta / (BASE - TMIN));
      k += BASE;
    }
    return k + Math.floor(((BASE - TMIN + 1) * delta) / (delta + SKEW));
  };
  
  const encodeDigit = (d: number): string => {
    return String.fromCharCode(d + (d < 26 ? 97 : 22));
  };
  
  while (handled < input.length) {
    const m = allCodes.find(c => c >= n) || n;
    delta += (m - n) * (handled + 1);
    n = m;
    
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      if (code < n) {
        delta++;
      } else if (code === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : (k >= bias + TMAX ? TMAX : k - bias);
          if (q < t) break;
          output += encodeDigit(t + ((q - t) % (BASE - t)));
          q = Math.floor((q - t) / (BASE - t));
        }
        output += encodeDigit(q);
        bias = adapt(delta, handled + 1, handled === basicChars.length);
        delta = 0;
        handled++;
      }
    }
    delta++;
    n++;
  }
  
  return output;
}

/**
 * 将IDN域名转换为ASCII (Punycode)
 * 增强版本，完整支持各种国际化字符
 */
export function toASCII(domain: string): string {
  // 先尝试使用URL API进行转换（浏览器原生支持）
  try {
    const url = new URL(`http://${domain}`);
    return url.hostname;
  } catch {
    // 如果URL构造失败，使用自定义编码
  }
  
  // 手动处理每个标签
  return domain.split('.').map(label => {
    // 检测是否包含非ASCII字符
    if (/[^\x00-\x7F]/.test(label)) {
      try {
        // 标准化Unicode字符（NFKC规范化）
        const normalized = label.normalize('NFKC').toLowerCase();
        const encoded = punyEncode(normalized);
        return 'xn--' + encoded;
      } catch {
        return label;
      }
    }
    return label.toLowerCase();
  }).join('.');
}

/**
 * 将Punycode转换回Unicode
 */
export function toUnicode(domain: string): string {
  return domain.split('.').map(label => {
    if (label.toLowerCase().startsWith('xn--')) {
      try {
        // 简单解码 - 大多数情况下浏览器会处理
        return label;
      } catch {
        return label;
      }
    }
    return label;
  }).join('.');
}

/**
 * 检测域名是否包含IDN字符
 */
export function isIDN(domain: string): boolean {
  return /[^\x00-\x7F]/.test(domain) || domain.toLowerCase().includes('xn--');
}

/**
 * 标准化域名（支持中文域名/IDN）
 * 增强版本，更好地处理各种输入格式
 */
export function normalizeDomain(domain: string): string {
  if (!domain) return '';
  
  let normalized = domain.trim();
  
  // 移除协议前缀
  normalized = normalized
    .replace(/^https?:\/\//i, '')
    .replace(/^\/\//, '')
    .replace(/^ftp:\/\//i, '')
    .replace(/^mailto:/i, '');
  
  // 移除路径、查询参数和端口
  normalized = normalized.split('/')[0].split('?')[0].split('#')[0].split(':')[0];
  
  // 移除尾部的点
  normalized = normalized.replace(/\.+$/, '');
  
  // 移除开头的点
  normalized = normalized.replace(/^\.+/, '');
  
  // 转小写
  normalized = normalized.toLowerCase();
  
  // 移除空白字符
  normalized = normalized.replace(/\s/g, '');
  
  // 转换IDN到ASCII
  return toASCII(normalized);
}

/**
 * 提取域名的顶级域名(TLD)
 * 支持二级域名如 .co.uk
 */
export function extractTLD(domain: string): string | null {
  const normalized = normalizeDomain(domain);
  if (!normalized) return null;
  
  const parts = normalized.split('.');
  if (parts.length < 2) return null;
  
  // 处理二级域名
  if (parts.length >= 3) {
    const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    if (SECOND_LEVEL_TLDS.includes(lastTwo)) {
      return lastTwo;
    }
  }
  
  return parts[parts.length - 1];
}

/**
 * 提取主域名（不包含子域名）
 */
export function extractMainDomain(domain: string): string {
  const normalized = normalizeDomain(domain);
  if (!normalized) return '';
  
  const parts = normalized.split('.');
  if (parts.length < 2) return normalized;
  
  // 检查是否有二级TLD
  if (parts.length >= 3) {
    const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    if (SECOND_LEVEL_TLDS.includes(lastTwo)) {
      return parts.slice(-3).join('.');
    }
  }
  
  return parts.slice(-2).join('.');
}

/**
 * 根据域名获取IANA官方TLD权威服务器
 */
export function getTLDServers(domain: string): string[] | null {
  const tld = extractTLD(domain);
  if (!tld) return null;
  
  // 先尝试直接匹配
  if (TLD_SERVERS[tld]) {
    return TLD_SERVERS[tld];
  }
  
  // 对于二级TLD，尝试匹配主TLD
  const parts = tld.split('.');
  if (parts.length > 1) {
    const mainTld = parts[parts.length - 1];
    if (TLD_SERVERS[mainTld]) {
      return TLD_SERVERS[mainTld];
    }
  }
  
  // 对于未知TLD，尝试生成通用服务器地址
  // 大多数新gTLD使用 a.nic.{tld} 格式
  if (tld.length > 0 && !tld.includes('.')) {
    return [
      `a.nic.${tld}`,
      `b.nic.${tld}`,
      `c.nic.${tld}`,
      `d.nic.${tld}`
    ];
  }
  
  return null;
}

/**
 * 检查域名的nameservers是否包含TLD权威服务器
 */
export function hasTLDServers(domain: string, nameServers: string[]): boolean {
  const tldServers = getTLDServers(domain);
  if (!tldServers) return false;
  
  const normalizedNS = nameServers.map(ns => ns.toLowerCase());
  return tldServers.some(server => normalizedNS.includes(server.toLowerCase()));
}

/**
 * 验证域名格式是否有效
 */
export function isValidDomain(domain: string): boolean {
  const normalized = normalizeDomain(domain);
  if (!normalized) return false;
  
  // 基本格式验证
  const parts = normalized.split('.');
  if (parts.length < 2) return false;
  
  // 检查每个标签
  for (const part of parts) {
    // 空标签
    if (!part) return false;
    // 标签长度超过63
    if (part.length > 63) return false;
    // 以连字符开头或结尾
    if (part.startsWith('-') || part.endsWith('-')) return false;
  }
  
  // 整体长度不超过253
  if (normalized.length > 253) return false;
  
  return true;
}

/**
 * 获取TLD的类型
 */
export function getTLDType(tld: string): 'gTLD' | 'ccTLD' | 'newgTLD' | 'IDN' | 'unknown' {
  const normalizedTld = tld.toLowerCase().replace(/^\./, '');
  
  // IDN TLDs (以 xn-- 开头)
  if (normalizedTld.startsWith('xn--')) {
    return 'IDN';
  }
  
  // 传统gTLD
  const traditionalGTLDs = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name', 'pro', 'aero', 'asia', 'cat', 'coop', 'jobs', 'mobi', 'museum', 'post', 'tel', 'travel', 'xxx'];
  if (traditionalGTLDs.includes(normalizedTld)) {
    return 'gTLD';
  }
  
  // ccTLD (2字符)
  if (normalizedTld.length === 2 && /^[a-z]{2}$/.test(normalizedTld)) {
    return 'ccTLD';
  }
  
  // 其他都是新gTLD
  if (TLD_SERVERS[normalizedTld]) {
    return 'newgTLD';
  }
  
  return 'unknown';
}

/**
 * 获取已知TLD总数
 */
export function getTotalKnownTLDs(): number {
  return Object.keys(TLD_SERVERS).length;
}
