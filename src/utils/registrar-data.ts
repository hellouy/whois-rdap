// 注册商官网映射 - 本地维护，方便添加新注册商

export const REGISTRAR_WEBSITES: Record<string, string> = {
  // 国际知名注册商
  'godaddy': 'https://www.godaddy.com',
  'namecheap': 'https://www.namecheap.com',
  'cloudflare': 'https://www.cloudflare.com',
  'google': 'https://domains.google',
  'name.com': 'https://www.name.com',
  'namesilo': 'https://www.namesilo.com',
  'dynadot': 'https://www.dynadot.com',
  'porkbun': 'https://porkbun.com',
  'gandi': 'https://www.gandi.net',
  'hover': 'https://www.hover.com',
  'enom': 'https://www.enom.com',
  'tucows': 'https://www.tucows.com',
  'network solutions': 'https://www.networksolutions.com',
  'register.com': 'https://www.register.com',
  '1&1': 'https://www.ionos.com',
  'ionos': 'https://www.ionos.com',
  'hostinger': 'https://www.hostinger.com',
  'bluehost': 'https://www.bluehost.com',
  'dreamhost': 'https://www.dreamhost.com',
  'hostgator': 'https://www.hostgator.com',
  'namebright': 'https://www.namebright.com',
  'epik': 'https://www.epik.com',
  'sav': 'https://www.sav.com',
  'squarespace': 'https://www.squarespace.com',
  'wix': 'https://www.wix.com',
  'shopify': 'https://www.shopify.com',
  'automattic': 'https://automattic.com',
  'wordpress': 'https://wordpress.com',
  'key-systems': 'https://www.key-systems.net',
  'ascio': 'https://www.ascio.com',
  'centralnic': 'https://www.centralnic.com',
  'publicdomainregistry': 'https://www.publicdomainregistry.com',
  'pdr': 'https://www.publicdomainregistry.com',
  'rebel': 'https://www.rebel.com',
  'domain.com': 'https://www.domain.com',
  'markmonitor': 'https://www.markmonitor.com',
  'csc': 'https://www.cscglobal.com',
  'safenames': 'https://www.safenames.net',
  'netim': 'https://www.netim.com',
  'ovh': 'https://www.ovh.com',
  'gmo': 'https://www.gmo.jp',
  'onamae': 'https://www.onamae.com',
  'webnic': 'https://www.webnic.cc',
  'directi': 'https://www.directi.com',
  'resellerclub': 'https://www.resellerclub.com',
  'bigrock': 'https://www.bigrock.in',
  'hostwinds': 'https://www.hostwinds.com',
  'fasthosts': 'https://www.fasthosts.co.uk',
  '123-reg': 'https://www.123-reg.co.uk',
  'united domains': 'https://www.united-domains.de',
  'strato': 'https://www.strato.de',
  'infomaniak': 'https://www.infomaniak.com',
  'afriregister': 'https://www.afriregister.com',
  'namejot': 'https://www.namejot.com',
  'domaindiscount24': 'https://www.domaindiscount24.com',
  'inwx': 'https://www.inwx.com',
  'nicsell': 'https://www.nicsell.com',
  'gkg': 'https://www.gkg.net',
  'dotster': 'https://www.dotster.com',
  'above.com': 'https://www.above.com',
  'moniker': 'https://www.moniker.com',
  'fabulous': 'https://www.fabulous.com',
  'uniregistrar': 'https://uniregistrar.com',
  'internet.bs': 'https://www.internetbs.net',
  'hexonet': 'https://www.hexonet.net',
  'domain-it': 'https://www.domainit.com',
  'whois': 'https://www.whois.com',
  'sedo': 'https://www.sedo.com',
  'dan.com': 'https://dan.com',
  'afternic': 'https://www.afternic.com',
  'cosmotown': 'https://cosmotown.com',
  'launchpad': 'https://www.launchpad.com',
  'blacknight': 'https://www.blacknight.com',
  'comlaude': 'https://www.comlaude.com',
  'nom-iq': 'https://www.nom-iq.net',
  'netfirms': 'https://www.netfirms.com',
  'ipage': 'https://www.ipage.com',
  'fatcow': 'https://www.fatcow.com',
  'domain international': 'https://www.yourdomaininternational.com',
  'easyspace': 'https://www.easyspace.com',
  'webfusion': 'https://www.webfusion.com',
  'heart internet': 'https://www.heartinternet.uk',
  'mesh digital': 'https://www.meshdigital.com',
  'crazy domains': 'https://www.crazydomains.com',
  'netregistry': 'https://www.netregistry.com.au',
  'melbourne it': 'https://www.melbourneit.com.au',
  'synergy wholesale': 'https://synergywholesale.com',
  'domainname sales': 'https://www.domainname.shop',
  'markmonitor inc': 'https://www.markmonitor.com',
  'corporation service': 'https://www.cscglobal.com',
  'brandshield': 'https://www.brandshield.com',
  'valideus': 'https://www.valideus.com',
  'openprovider': 'https://www.openprovider.com',
  'transip': 'https://www.transip.nl',
  'combell': 'https://www.combell.com',
  'one.com': 'https://www.one.com',
  'versio': 'https://www.versio.nl',
  'active24': 'https://www.active24.com',
  'zone media': 'https://www.zone.eu',
  'loopia': 'https://www.loopia.se',
  'binero': 'https://www.binero.se',
  'simply.com': 'https://www.simply.com',
  'domainnameshop': 'https://www.domainnameshop.com',
  // 中国注册商
  '阿里云': 'https://wanwang.aliyun.com',
  'alibaba': 'https://wanwang.aliyun.com',
  'aliyun': 'https://wanwang.aliyun.com',
  '万网': 'https://wanwang.aliyun.com',
  'hichina': 'https://wanwang.aliyun.com',
  '腾讯云': 'https://dnspod.cloud.tencent.com',
  'dnspod': 'https://www.dnspod.cn',
  'tencent': 'https://dnspod.cloud.tencent.com',
  '西部数码': 'https://www.west.cn',
  'west.cn': 'https://www.west.cn',
  'west digital': 'https://www.west.cn',
  '新网': 'https://www.xinnet.com',
  'xinnet': 'https://www.xinnet.com',
  '易名': 'https://www.ename.net',
  'ename': 'https://www.ename.net',
  '爱名网': 'https://www.22.cn',
  '22.cn': 'https://www.22.cn',
  '纳点网': 'https://www.nadin.cn',
  '商务中国': 'https://www.bizcn.com',
  'bizcn': 'https://www.bizcn.com',
  '中国数据': 'https://www.chinadata.com',
  '时代互联': 'https://www.now.cn',
  'now.cn': 'https://www.now.cn',
  '美橙互联': 'https://www.cndns.com',
  'cndns': 'https://www.cndns.com',
  '华为云': 'https://www.huaweicloud.com',
  'huawei': 'https://www.huaweicloud.com',
  '百度云': 'https://cloud.baidu.com',
  'baidu': 'https://cloud.baidu.com',
  '京东云': 'https://www.jdcloud.com',
  'jdcloud': 'https://www.jdcloud.com',
  '三五互联': 'https://www.35.com',
  '35.com': 'https://www.35.com',
  '中资源': 'https://www.zzy.cn',
  '耐思': 'https://www.nice.cn',
  'nice.cn': 'https://www.nice.cn',
  '聚名网': 'https://www.juming.com',
  'juming': 'https://www.juming.com',
  '域名城': 'https://www.domain.cn',
  '金名网': 'https://www.4.cn',
  '4.cn': 'https://www.4.cn',
  '景安': 'https://www.zzidc.com',
  '上海有孚': 'https://www.yovole.com',
  '码云': 'https://www.maoyun.com',
  '中万网络': 'https://www.zw.cn',
  '新网互联': 'https://www.dns.com.cn',
  // 韩国注册商
  'gabia': 'https://www.gabia.com',
  'megazone': 'https://www.megazone.com',
  'cafe24': 'https://www.cafe24.com',
  'hosting.kr': 'https://www.hosting.kr',
  // 日本注册商
  'gmo internet': 'https://www.gmo.jp',
  'xserver': 'https://www.xserver.ne.jp',
  'sakura': 'https://www.sakura.ad.jp',
  'value-domain': 'https://www.value-domain.com',
  'muumuu-domain': 'https://muumuu-domain.com',
  // 印度注册商
  'nixi': 'https://www.nixi.in',
  'mitsu': 'https://www.mitsu.in',
  'net4india': 'https://www.net4.in',
  'znetlive': 'https://www.znetlive.com',
  // 俄罗斯注册商
  'reg.ru': 'https://www.reg.ru',
  'nic.ru': 'https://www.nic.ru',
  'r01': 'https://www.r01.ru',
  'regtime': 'https://www.regtime.net',
  'beget': 'https://beget.com',
  // 巴西注册商
  'registro.br': 'https://registro.br',
  'locaweb': 'https://www.locaweb.com.br',
  'hostgator brasil': 'https://www.hostgator.com.br',
  // 其他
  'netearth': 'https://www.netearth.com',
  'enomcentral': 'https://www.enomcentral.com',
  'name.co': 'https://www.name.co',
  'payrope': 'https://www.payrope.com',
  'sarek oy': 'https://www.sarek.fi',
  'binero group': 'https://www.binero.se',
  'aruba': 'https://www.aruba.it',
  'domainpeople': 'https://www.domainpeople.com',
  'webnames': 'https://www.webnames.ca',
  'joker': 'https://joker.com',
  'eurodns': 'https://www.eurodns.com',
  'nicenic': 'https://www.nicenic.net',
  'domainz': 'https://www.domainz.net',
  'udag': 'https://www.udag.com',
  'register.it': 'https://www.register.it',
  'netsi': 'https://www.netsi.com',
  'afilias': 'https://www.afilias.info',
  'rrpproxy': 'https://www.rrpproxy.net',
  'hostpoint': 'https://www.hostpoint.ch',
  'cPanel': 'https://cpanel.net',
  'planet hoster': 'https://www.planethoster.com',
  'web4africa': 'https://web4africa.net',
  'liqd': 'https://www.liqd.com',
  'domainking': 'https://www.domainking.ng',
  'onlinenic': 'https://www.onlinenic.com',
  'nettigritty': 'https://www.nettigritty.com',
  'domain the net': 'https://www.domainthe.net',
  'ilovewww': 'https://www.ilovewww.com',
  'gal communication': 'https://www.gal.co.il',
  'psi-usa': 'https://www.psi-usa.info',
  'domreg': 'https://www.domreg.lt',
  'dot.tk': 'https://www.dot.tk',
  'freenom': 'https://www.freenom.com',
  'register.eu': 'https://www.register.eu',
  'visesh': 'https://www.visesh.com',
  'todaynic': 'https://www.todaynic.com',
  'domaininfo': 'https://www.domaininfo.com',
};

// 动态注册商记录（运行时学习）
const dynamicRegistrars = new Map<string, string>();

/**
 * 识别注册商官网
 */
export const getRegistrarWebsite = (registrar: string): string | null => {
  if (!registrar) return null;
  const lowerRegistrar = registrar.toLowerCase();
  
  for (const [key, url] of Object.entries(REGISTRAR_WEBSITES)) {
    if (lowerRegistrar.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // 检查动态记录
  for (const [key, url] of dynamicRegistrars.entries()) {
    if (lowerRegistrar.includes(key)) return url;
  }
  
  // 尝试从注册商名称推断官网
  const domainMatch = registrar.match(/([a-z0-9-]+\.[a-z]{2,})/i);
  if (domainMatch) {
    const guessedUrl = `https://www.${domainMatch[1].toLowerCase()}`;
    dynamicRegistrars.set(domainMatch[1].toLowerCase(), guessedUrl);
    return guessedUrl;
  }
  
  return null;
};

/**
 * 添加新注册商到动态记录
 */
export const addDynamicRegistrar = (name: string, url: string) => {
  dynamicRegistrars.set(name.toLowerCase(), url);
};

/**
 * 获取 favicon URL
 */
export const getFaviconUrl = (websiteUrl: string): string => {
  try {
    const domain = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
};
