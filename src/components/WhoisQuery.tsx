import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Calendar, User, Building, Server, CheckCircle2, ChevronDown, ChevronUp, DollarSign, RefreshCw, Globe, ExternalLink } from "lucide-react";
import { useWhois } from "@/hooks/use-whois";
import { useDomainPrice } from "@/hooks/use-domain-price";
import { useState, useEffect } from "react";
import { toUnicode, toASCII, isIDN } from "@/utils/tld-servers";
import { getRdapServer, getWhoisServer } from "@/utils/whois-servers";
import { categorizeStatuses, getSeverityVariant, translateStatus, getStatusInfo } from "@/utils/domain-status-mapping";

// 检查是否为隐私保护或空信息
const isPrivacyRedacted = (value: string | undefined): boolean => {
  if (!value) return false;
  const privacyPatterns = [
    /redacted/i,
    /privacy/i,
    /protected/i,
    /withheld/i,
    /not disclosed/i,
    /data protected/i,
    /gdpr/i,
    /private/i,
    /contact privacy/i,
    /whoisguard/i,
    /domains by proxy/i,
    /perfect privacy/i,
    /proxy/i,
    /masked/i,
    /hidden/i,
    /confidential/i,
    /n\/a/i,
    /not available/i,
    /not shown/i,
    /registry customer/i,
    /domain administrator/i,
  ];
  return privacyPatterns.some(pattern => pattern.test(value));
};

// 格式化显示值，处理隐私保护
const formatDisplayValue = (value: string | undefined, defaultText: string = "所有者选择隐藏信息"): string => {
  if (!value || isPrivacyRedacted(value)) {
    return defaultText;
  }
  return value;
};

interface WhoisQueryProps {
  domain: string;
  displayDomain?: string;
  onLoadComplete?: () => void;
}

// 国家代码映射到中文名称
const getCountryName = (countryCode: string): string => {
  const countryMap: Record<string, string> = {
    'GY': '圭亚那',
    'CN': '中国',
    'US': '美国',
    'UK': '英国',
    'GB': '英国',
    'JP': '日本',
    'KR': '韩国',
    'DE': '德国',
    'FR': '法国',
    'CA': '加拿大',
    'AU': '澳大利亚',
    'NZ': '新西兰',
    'SG': '新加坡',
    'HK': '中国香港',
    'TW': '中国台湾',
    'MO': '中国澳门',
    'IN': '印度',
    'RU': '俄罗斯',
    'BR': '巴西',
    'MX': '墨西哥',
    'AR': '阿根廷',
    'CL': '智利',
    'CO': '哥伦比亚',
    'PE': '秘鲁',
    'VE': '委内瑞拉',
    'IT': '意大利',
    'ES': '西班牙',
    'PT': '葡萄牙',
    'NL': '荷兰',
    'BE': '比利时',
    'CH': '瑞士',
    'AT': '奥地利',
    'SE': '瑞典',
    'NO': '挪威',
    'DK': '丹麦',
    'FI': '芬兰',
    'PL': '波兰',
    'CZ': '捷克',
    'GR': '希腊',
    'TR': '土耳其',
    'IL': '以色列',
    'SA': '沙特阿拉伯',
    'AE': '阿联酋',
    'EG': '埃及',
    'ZA': '南非',
    'NG': '尼日利亚',
    'KE': '肯尼亚',
    'TH': '泰国',
    'VN': '越南',
    'ID': '印度尼西亚',
    'MY': '马来西亚',
    'PH': '菲律宾',
    'PK': '巴基斯坦',
    'BD': '孟加拉国',
  };
  
  const code = countryCode.toUpperCase();
  return countryMap[code] || countryCode;
};

// 注册商官网映射
const REGISTRAR_WEBSITES: Record<string, string> = {
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
  // 更多国际注册商
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
  // 其他地区
  'netearth': 'https://www.netearth.com',
  'enomcentral': 'https://www.enomcentral.com',
  'name.co': 'https://www.name.co',
  // 更多注册商
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

// 识别注册商官网
const getRegistrarWebsite = (registrar: string): string | null => {
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

// 获取 favicon URL
const getFaviconUrl = (websiteUrl: string): string => {
  try {
    const domain = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
};

// DNS 提供商识别
const DNS_PROVIDERS: Record<string, { name: string; url: string }> = {
  // 国际 DNS 提供商
  'cloudflare': { name: 'Cloudflare', url: 'https://www.cloudflare.com' },
  'awsdns': { name: 'AWS Route53', url: 'https://aws.amazon.com/route53' },
  'azure-dns': { name: 'Azure DNS', url: 'https://azure.microsoft.com' },
  'googledomains': { name: 'Google Domains', url: 'https://domains.google' },
  'google': { name: 'Google Cloud DNS', url: 'https://cloud.google.com/dns' },
  'ns.google': { name: 'Google Cloud DNS', url: 'https://cloud.google.com/dns' },
  'dnsimple': { name: 'DNSimple', url: 'https://dnsimple.com' },
  'dynect': { name: 'Dyn', url: 'https://www.oracle.com/cloud/networking/dns' },
  'ultradns': { name: 'UltraDNS', url: 'https://www.ultradns.com' },
  'ns1': { name: 'NS1 (IBM)', url: 'https://ns1.com' },
  'akamai': { name: 'Akamai', url: 'https://www.akamai.com' },
  'akadns': { name: 'Akamai', url: 'https://www.akamai.com' },
  'fastly': { name: 'Fastly', url: 'https://www.fastly.com' },
  'vercel-dns': { name: 'Vercel', url: 'https://vercel.com' },
  'netlify': { name: 'Netlify', url: 'https://www.netlify.com' },
  'digitalocean': { name: 'DigitalOcean', url: 'https://www.digitalocean.com' },
  'linode': { name: 'Linode', url: 'https://www.linode.com' },
  'vultr': { name: 'Vultr', url: 'https://www.vultr.com' },
  'godaddy': { name: 'GoDaddy', url: 'https://www.godaddy.com' },
  'domaincontrol': { name: 'GoDaddy', url: 'https://www.godaddy.com' },
  'namecheap': { name: 'Namecheap', url: 'https://www.namecheap.com' },
  'registrar-servers': { name: 'Namecheap', url: 'https://www.namecheap.com' },
  'namesilo': { name: 'NameSilo', url: 'https://www.namesilo.com' },
  'porkbun': { name: 'Porkbun', url: 'https://porkbun.com' },
  'he.net': { name: 'Hurricane Electric', url: 'https://dns.he.net' },
  'hostinger': { name: 'Hostinger', url: 'https://www.hostinger.com' },
  'bluehost': { name: 'Bluehost', url: 'https://www.bluehost.com' },
  'hostgator': { name: 'HostGator', url: 'https://www.hostgator.com' },
  'dreamhost': { name: 'DreamHost', url: 'https://www.dreamhost.com' },
  'siteground': { name: 'SiteGround', url: 'https://www.siteground.com' },
  'ovh': { name: 'OVH', url: 'https://www.ovh.com' },
  'hetzner': { name: 'Hetzner', url: 'https://www.hetzner.com' },
  'gandi': { name: 'Gandi', url: 'https://www.gandi.net' },
  'squarespace': { name: 'Squarespace', url: 'https://www.squarespace.com' },
  'wix': { name: 'Wix', url: 'https://www.wix.com' },
  'wordpress': { name: 'WordPress', url: 'https://wordpress.com' },
  'wpengine': { name: 'WP Engine', url: 'https://wpengine.com' },
  'shopify': { name: 'Shopify', url: 'https://www.shopify.com' },
  // 更多国际 DNS 提供商
  'bunny': { name: 'BunnyDNS', url: 'https://bunny.net' },
  'quad9': { name: 'Quad9', url: 'https://www.quad9.net' },
  'stackpath': { name: 'StackPath', url: 'https://www.stackpath.com' },
  'incapsula': { name: 'Imperva', url: 'https://www.imperva.com' },
  'sucuri': { name: 'Sucuri', url: 'https://sucuri.net' },
  'edgecast': { name: 'Edgecast (Edgio)', url: 'https://edg.io' },
  'lumen': { name: 'Lumen', url: 'https://www.lumen.com' },
  'oracle': { name: 'Oracle DNS', url: 'https://www.oracle.com' },
  'rackspace': { name: 'Rackspace', url: 'https://www.rackspace.com' },
  'scaleway': { name: 'Scaleway', url: 'https://www.scaleway.com' },
  'inwx': { name: 'INWX', url: 'https://www.inwx.com' },
  'transip': { name: 'TransIP', url: 'https://www.transip.nl' },
  'ionos': { name: 'IONOS', url: 'https://www.ionos.com' },
  'strato': { name: 'STRATO', url: 'https://www.strato.de' },
  'hover': { name: 'Hover', url: 'https://www.hover.com' },
  'epik': { name: 'Epik', url: 'https://www.epik.com' },
  'dynadot': { name: 'Dynadot', url: 'https://www.dynadot.com' },
  'name.com': { name: 'Name.com', url: 'https://www.name.com' },
  // 中国 DNS 提供商
  'dnspod': { name: 'DNSPod (腾讯云)', url: 'https://www.dnspod.cn' },
  'tencentyun': { name: '腾讯云 DNS', url: 'https://cloud.tencent.com' },
  'tencentdns': { name: '腾讯云 DNS', url: 'https://cloud.tencent.com' },
  'aliyun': { name: '阿里云 DNS', url: 'https://www.aliyun.com' },
  'alidns': { name: '阿里云 DNS', url: 'https://www.aliyun.com' },
  'hichina': { name: '万网 (阿里云)', url: 'https://wanwang.aliyun.com' },
  'net.cn': { name: '万网 (阿里云)', url: 'https://wanwang.aliyun.com' },
  'huaweicloud': { name: '华为云 DNS', url: 'https://www.huaweicloud.com' },
  'hwclouds-dns': { name: '华为云 DNS', url: 'https://www.huaweicloud.com' },
  'baidubce': { name: '百度云 DNS', url: 'https://cloud.baidu.com' },
  'bdydns': { name: '百度云 DNS', url: 'https://cloud.baidu.com' },
  'jdcloud': { name: '京东云 DNS', url: 'https://www.jdcloud.com' },
  'west': { name: '西部数码', url: 'https://www.west.cn' },
  'xinnet': { name: '新网', url: 'https://www.xinnet.com' },
  'ename': { name: '易名', url: 'https://www.ename.net' },
  '51dns': { name: '51DNS', url: 'https://www.51dns.com' },
  'cloudxns': { name: 'CloudXNS', url: 'https://www.cloudxns.net' },
  'dns.com': { name: 'DNS.COM', url: 'https://www.dns.com' },
  'zdns': { name: 'ZDNS (互联网域名系统)', url: 'https://www.zdns.cn' },
  'cndns': { name: '美橙互联', url: 'https://www.cndns.com' },
  '35.com': { name: '三五互联', url: 'https://www.35.com' },
  'chinanet': { name: '中国电信', url: 'https://www.chinatelecom.com.cn' },
  // 日本
  'onamae': { name: 'お名前.com', url: 'https://www.onamae.com' },
  'gmondns': { name: 'GMO (お名前)', url: 'https://www.onamae.com' },
  'sakura': { name: 'さくらインターネット', url: 'https://www.sakura.ad.jp' },
  'xserver': { name: 'Xserver', url: 'https://www.xserver.ne.jp' },
  // 韩国
  'gabia': { name: 'Gabia', url: 'https://www.gabia.com' },
  'cafe24': { name: 'Cafe24', url: 'https://www.cafe24.com' },
  // 俄罗斯
  'yandex': { name: 'Yandex DNS', url: 'https://connect.yandex.com' },
  'selectel': { name: 'Selectel', url: 'https://selectel.ru' },
  'nic.ru': { name: 'RU-CENTER', url: 'https://www.nic.ru' },
  'reg.ru': { name: 'REG.RU', url: 'https://www.reg.ru' },
  // 其他
  'constellix': { name: 'Constellix', url: 'https://constellix.com' },
  'easydns': { name: 'easyDNS', url: 'https://easydns.com' },
  'dnsmadeeasy': { name: 'DNS Made Easy', url: 'https://dnsmadeeasy.com' },
  'zoneedit': { name: 'ZoneEdit', url: 'https://www.zoneedit.com' },
  'freedns': { name: 'FreeDNS', url: 'https://freedns.afraid.org' },
  'afraid': { name: 'FreeDNS', url: 'https://freedns.afraid.org' },
  'no-ip': { name: 'No-IP', url: 'https://www.noip.com' },
  'dyn': { name: 'Dyn', url: 'https://dyn.com' },
  'rage4': { name: 'Rage4', url: 'https://rage4.com' },
  'luadns': { name: 'LuaDNS', url: 'https://luadns.com' },
  'desec': { name: 'deSEC', url: 'https://desec.io' },
  'zilore': { name: 'Zilore', url: 'https://zilore.com' },
  'clouDNS': { name: 'ClouDNS', url: 'https://www.cloudns.net' },
};

// 识别 DNS 提供商
const getDnsProvider = (nameServers: string[]): { name: string; url: string } | null => {
  if (!nameServers || nameServers.length === 0) return null;
  
  const firstNs = nameServers[0].toLowerCase();
  
  for (const [key, provider] of Object.entries(DNS_PROVIDERS)) {
    if (firstNs.includes(key.toLowerCase())) {
      return provider;
    }
  }
  return null;
};

// 域名状态映射到中文 - 增强版
const translateDomainStatus = (status: string | number | object): string => {
  // 确保status是字符串
  if (typeof status !== 'string') {
    if (typeof status === 'number') return String(status);
    if (typeof status === 'object' && status !== null) {
      return (status as any).text || (status as any).desc || (status as any).value || JSON.stringify(status);
    }
    return '';
  }
  
  // 移除 IANA URL、多余空格和特殊字符
  const cleanStatus = status
    .replace(/\s*https?:\/\/[^\s]+/gi, '')
    .replace(/[\(\)]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
  
  const statusMap: Record<string, string> = {
    // 申请和审核状态
    'applicationpending': '申请待审核',
    'pending': '待处理',
    'pendingapplication': '申请待审核',
    'underevaluation': '评估中',
    'underreview': '审核中',
    'awaitingapproval': '等待批准',
    
    // EPP 客户端禁止操作状态
    'clientdeleteprohibited': '禁止删除 (客户端)',
    'clienttransferprohibited': '禁止转移 (客户端)',
    'clientupdateprohibited': '禁止更新 (客户端)',
    'clientrenewprohibited': '禁止续费 (客户端)',
    'clienthold': '暂停解析 (客户端)',
    
    // EPP 服务器端禁止操作状态
    'serverdeleteprohibited': '禁止删除 (服务器)',
    'servertransferprohibited': '禁止转移 (服务器)',
    'serverupdateprohibited': '禁止更新 (服务器)',
    'serverrenewprohibited': '禁止续费 (服务器)',
    'serverhold': '暂停解析 (服务器)',
    
    // 待处理状态
    'pendingcreate': '等待创建',
    'pendingdelete': '等待删除',
    'pendingrenew': '等待续费',
    'pendingrestore': '等待恢复',
    'pendingtransfer': '转移处理中',
    'pendingupdate': '等待更新',
    'pendingverification': '等待验证',
    
    // 宽限期和赎回期
    'addperiod': '新注册宽限期 (AGP)',
    'autorenewperiod': '自动续费宽限期',
    'renewperiod': '续费宽限期 (RGP)',
    'transferperiod': '转移宽限期 (TGP)',
    'redemptionperiod': '赎回期 (RGP)',
    'pendingdeleterestorable': '删除待恢复期',
    'pendingdeletescheduled': '删除待执行期',
    
    // Hold 状态
    'Live': '正常',
    'hold': '域名暂停',
    'registrarhold': '注册商暂停',
    'registryhold': '注册局暂停',
    'clientholdprohibited': '禁止暂停 (客户端)',
    'serverholdprohibited': '禁止暂停 (服务器)',
    
    // 转移相关状态
    'transferprohibited': '禁止转移',
    'transferstarted': '转移已启动',
    'transfercompleted': '转移已完成',
    'transferrejected': '转移已拒绝',
    'transfercancelled': '转移已取消',
    'transferapproved': '转移已批准',
    'transferpending': '转移待处理',
    'transferrequested': '转移已请求',
    
    // 基本状态
    'ok': '正常状态',
    'active': '活跃',
    'inactive': '非活跃',
    'locked': '已锁定',
    'reserved': '注册局保留',
    'expired': '已过期',
    'suspended': '已暂停',
    'terminated': '已终止',
    'available': '可注册',
    'unavailable': '不可注册',
    'notfound': '未找到',
    
    // 删除相关
    'deleteprohibited': '禁止删除',
    'pendingdeletion': '待删除',
    'scheduledfordeletion': '计划删除',
    
    // 更新相关
    'updateprohibited': '禁止更新',
    'pendingupdates': '待更新',
    
    // 续费相关
    'renewprohibited': '禁止续费',
    'autorenew': '自动续费',
    'noautorenew': '未设置自动续费',
    
    // 验证和锁定状态
    'registrantverificationlocked': '注册人验证锁定',
    'verificationrequired': '需要验证',
    'verificationpending': '验证待处理',
    'emailverificationpending': '邮箱验证待处理',
    'identityverificationpending': '身份验证待处理',
    
    // DNSSEC 相关
    'adddsrecordprohibited': '禁止添加DS记录',
    'removedsrecordprohibited': '禁止移除DS记录',
    
    // 其他特殊状态
    'internalhold': '内部暂停',
    'disputehold': '争议暂停',
    'legalhold': '法律暂停',
    'fraudhold': '欺诈暂停',
    'abusehold': '滥用暂停',
    'privacyprotect': '隐私保护',
    'proxy': '代理注册',
    'quarantine': '隔离期',
    'blocked': '已屏蔽',
    'frozen': '已冻结',
    
    // 不规则/ccTLD特殊状态
    'connect': '已连接',
    'linked': '已关联',
    'associated': '已关联',
    'registered': '已注册',
    'notassigned': '未分配',
    'assigned': '已分配',
    'published': '已发布',
    'verified': '已验证',
    'validated': '已验证',
    'delegated': '已委托',
    'notdelegated': '未委托',
    'undelegated': '未委托',
    'exempt': '豁免',
    'renewgrace': '续费宽限期',
    'pendingreview': '审核中',
    'pendingactivation': '待激活',
    'pendingsuspension': '待暂停',
    'pendingtransit': '待转移',
    'free': '空闲',
    'taken': '已被注册',
    'parked': '已停放',
    'outofservice': '停止服务',
    'disabled': '已禁用',
    'tobereleased': '待释放',
    'released': '已释放',
    'disputed': '争议中',
    'court': '法院限制',
    'renewal': '续费中',
    'grace': '宽限期',
    'tobepurged': '待清除',
    'purged': '已清除',
    'archived': '已归档',
    'notrenewed': '未续费',
    'nottransferrable': '不可转移',
    'notregistrable': '不可注册',
    'thedomainisn\'tgeneratedinthezone': '未生成DNS区域',
    'notgeneratedinthezone': '未生成DNS区域',
    'live': '正常',
  };
  
  // 如果找到精确匹配，返回映射值
  if (statusMap[cleanStatus]) {
    return statusMap[cleanStatus];
  }
  
  // 如果没有精确匹配，尝试部分匹配
  for (const [key, value] of Object.entries(statusMap)) {
    if (cleanStatus.includes(key) || key.includes(cleanStatus)) {
      return value;
    }
  }
  
  // 如果都没匹配，返回原始状态但格式化一下
  return status.replace(/\s*https?:\/\/[^\s]+/gi, '').trim();
};

export const WhoisQuery = ({ domain, displayDomain: propDisplayDomain, onLoadComplete }: WhoisQueryProps) => {
  const { whois: whoisData, isLoading } = useWhois(domain);
  const { priceData, isLoading: isPriceLoading, error: priceError, fetchPrice, formatPrice, resetPrice } = useDomainPrice();
  const [expandedRegistrar, setExpandedRegistrar] = useState(false);
  
  // 使用传入的displayDomain或使用toUnicode转换
  const displayDomain = propDisplayDomain || (isIDN(domain) ? toUnicode(domain) : domain);
  
  // 计算Punycode版本（用于IDN域名显示）
  const punycodeDomain = toASCII(domain);
  const showDualForm = isIDN(domain) && punycodeDomain !== displayDomain;
  
  // 获取服务器诊断信息
  const rdapServer = getRdapServer(domain);
  const whoisServer = getWhoisServer(domain);
  const hasRdapSupport = !!rdapServer;
  const hasWhoisSupport = !!whoisServer;

  // 当加载完成时调用回调
  useEffect(() => {
    if (!isLoading && onLoadComplete) {
      onLoadComplete();
    }
  }, [isLoading, onLoadComplete]);
  // 当域名变化时自动查询价格
  useEffect(() => {
    if (domain) {
      resetPrice();
      fetchPrice(domain);
    }
  }, [domain]);

  // 获取分类后的状态信息（用于增强状态徽标）
  const getCategorizedStatuses = () => {
    if (!whoisData?.status) return null;
    return categorizeStatuses(whoisData.status);
  };
  const getDomainStatus = (): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    if (!whoisData) return { label: "查询中", variant: "outline" };
    
    // 1. 最高优先级：明确的未注册状态
    if (whoisData.registered === false) {
      return { label: "未注册", variant: "outline" };
    }
    
    // 2. 检查域名状态字符串（必须在检查registered之前）
    const statusString = whoisData.status?.join(' ').toLowerCase() || '';
    const rawStatusString = whoisData.status?.join(' ') || '';
    
    // 2.0 申请待审核状态（优先级最高）
    if (statusString.includes('application') && statusString.includes('pending')) {
      return { label: "申请待审核", variant: "secondary" };
    }
    if (statusString.includes('pending') && !statusString.includes('delete') && !statusString.includes('transfer')) {
      // 如果只是pending，且没有创建日期，可能是申请中
      if (!whoisData.creationDate) {
        return { label: "待处理", variant: "secondary" };
      }
    }
    
    // 2.1 赎回期（即将删除，但还可以恢复）
    if (statusString.includes('redemption')) {
      return { label: "赎回期", variant: "destructive" };
    }
    
    // 2.2 待删除状态
    if (statusString.includes('pendingdelete') || statusString.includes('pending delete')) {
      return { label: "待删除", variant: "destructive" };
    }
    
    // 2.3 被保留（通常是注册局保留的域名）
    if (statusString.includes('reserved')) {
      return { label: "注册局保留", variant: "secondary" };
    }
    
    // 2.4 隔离、冻结、屏蔽状态
    if (statusString.includes('quarantine')) {
      return { label: "隔离期", variant: "destructive" };
    }
    if (statusString.includes('frozen')) {
      return { label: "已冻结", variant: "destructive" };
    }
    if (statusString.includes('blocked')) {
      return { label: "已屏蔽", variant: "destructive" };
    }
    
    // 2.5 暂停状态（各种 hold）
    if (statusString.includes('hold')) {
      if (statusString.includes('registrar')) {
        return { label: "注册商暂停", variant: "destructive" };
      }
      if (statusString.includes('registry')) {
        return { label: "注册局暂停", variant: "destructive" };
      }
      if (statusString.includes('legal')) {
        return { label: "法律暂停", variant: "destructive" };
      }
      if (statusString.includes('dispute')) {
        return { label: "争议暂停", variant: "destructive" };
      }
      if (statusString.includes('fraud')) {
        return { label: "欺诈暂停", variant: "destructive" };
      }
      if (statusString.includes('abuse')) {
        return { label: "滥用暂停", variant: "destructive" };
      }
      return { label: "域名暂停", variant: "destructive" };
    }
    
    // 2.6 转移中状态
    if (statusString.includes('pendingtransfer') || (statusString.includes('transfer') && statusString.includes('pending'))) {
      return { label: "转移处理中", variant: "secondary" };
    }
    if (statusString.includes('transferstarted')) {
      return { label: "转移已启动", variant: "secondary" };
    }
    
    // 2.7 已暂停、已终止
    if (statusString.includes('suspended')) {
      return { label: "已暂停", variant: "destructive" };
    }
    if (statusString.includes('terminated')) {
      return { label: "已终止", variant: "destructive" };
    }
    
    // 3. 检查过期日期
    if (whoisData.expirationDate) {
      try {
        const expDate = new Date(whoisData.expirationDate);
        const now = new Date();
        
        // 3.1 已过期
        if (expDate < now) {
          return { label: "已过期", variant: "destructive" };
        }
        
        // 3.2 即将过期（30天内）
        const daysUntilExpiry = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          return { label: "即将过期", variant: "destructive" };
        }
      } catch (e) {
        console.error('日期解析错误:', e);
      }
    }
    
    // 4. 有创建日期，说明已正常注册
    if (whoisData.creationDate) {
      // 检查是否有 "ok" 状态
      if (statusString.includes('ok') || statusString === '') {
        return { label: "正常", variant: "default" };
      }
      return { label: "已注册", variant: "default" };
    }
    
    // 5. registered === true 但没有创建日期（可能是特殊状态）
    if (whoisData.registered === true) {
      // ccTLD 很常见：不返回 creationDate/registrar/status，但会给 nameserver / dnssec 等；
      // 这里统一兜底为“已注册”，避免大量显示“状态未知”。
      return { label: "已注册", variant: "default" };
    }
    
    // 6. 如果有注册商信息，大概率是已注册
    if (whoisData.registrar) {
      return { label: "已注册", variant: "default" };
    }

    // 6.1 如果存在 NS，也可视为已注册（很多 ccTLD 仅返回 NS）
    if (whoisData.nameServers && whoisData.nameServers.length > 0) {
      return { label: "已注册", variant: "default" };
    }

    // 6.2 RDAP 结果可能只有 DNSSEC/少量字段，若有 raw 或 dnssec 信息，也倾向于已注册
    if (whoisData.dnssec || (whoisData.raw && whoisData.raw.length > 50)) {
      return { label: "已注册", variant: "default" };
    }
    
    // 7. 都没有，返回未知
    return { label: "状态未知", variant: "outline" };
  };

  // 获取额外的状态标签（用于DNSSEC右侧显示）
  const getExtraStatusBadges = (): Array<{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }> => {
    const badges: Array<{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = [];
    if (!whoisData) return badges;
    
    const statusString = whoisData.status?.join(' ').toLowerCase() || '';
    
    // 1. 检查过期相关状态
    if (whoisData.expirationDate) {
      try {
        const expDate = new Date(whoisData.expirationDate);
        const now = new Date();
        const daysUntilExpiry = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (expDate < now) {
          badges.push({ label: "已过期", variant: "destructive" });
        } else if (daysUntilExpiry <= 7) {
          badges.push({ label: "马上过期", variant: "destructive" });
        } else if (daysUntilExpiry <= 30) {
          badges.push({ label: "即将过期", variant: "destructive" });
        }
      } catch (e) {
        // 忽略日期解析错误
      }
    }
    
    // 2. 检查续费相关状态
    if (statusString.includes('autorenew') || statusString.includes('renewperiod')) {
      badges.push({ label: "近期续费", variant: "secondary" });
    }
    
    // 3. 检查转移相关状态
    if (statusString.includes('pendingtransfer') || (statusString.includes('transfer') && statusString.includes('pending'))) {
      badges.push({ label: "正在转移", variant: "secondary" });
    } else if (statusString.includes('transferperiod')) {
      badges.push({ label: "近期转移", variant: "secondary" });
    } else if (statusString.includes('transferstarted')) {
      badges.push({ label: "转移中", variant: "secondary" });
    }
    
    // 4. 检查暂停/Hold状态
    if (statusString.includes('hold')) {
      if (!badges.some(b => b.label.includes('暂停'))) {
        badges.push({ label: "域名暂停", variant: "destructive" });
      }
    }
    
    // 5. 检查赎回期
    if (statusString.includes('redemption')) {
      badges.push({ label: "赎回期", variant: "destructive" });
    }
    
    // 6. 检查待删除
    if (statusString.includes('pendingdelete')) {
      badges.push({ label: "待删除", variant: "destructive" });
    }
    
    // 7. 检查隔离期
    if (statusString.includes('quarantine')) {
      badges.push({ label: "隔离期", variant: "destructive" });
    }
    
    // 8. 检查冻结状态
    if (statusString.includes('frozen')) {
      badges.push({ label: "已冻结", variant: "destructive" });
    }
    
    // 9. 新注册宽限期
    if (statusString.includes('addperiod')) {
      badges.push({ label: "新注册", variant: "default" });
    }
    
    return badges;
  };

  // 计算时间差 - 使用精确的日期计算
  const getTimeDifference = (startDate: string, endDate?: Date): string => {
    const start = new Date(startDate);
    const end = endDate || new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    
    // 如果少于1天，显示时分秒
    if (diffTime < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      return `${hours} 时 ${minutes} 分 ${seconds} 秒`;
    }
    
    // 使用精确的年月日计算
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    
    // 如果天数为负，从月份借位
    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // 如果月份为负，从年份借位
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // 格式化输出
    if (years > 0 && months > 0) {
      return `${years} 年 ${months} 个月`;
    }
    if (years > 0) {
      return `${years} 年`;
    }
    if (months > 0 && days > 0) {
      return `${months} 个月 ${days} 天`;
    }
    if (months > 0) {
      return `${months} 个月`;
    }
    return `${days} 天`;
  };

  // 计算域名已注册时间
  const getRegisteredTime = (creationDate: string): string => {
    return getTimeDifference(creationDate);
  };

  // 计算距离过期时间
  const getTimeUntilExpiry = (expirationDate: string): string => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    
    if (expDate < now) {
      return '已过期';
    }
    
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 如果少于30天，显示剩余的天、时、分、秒
    if (diffDays < 30) {
      const days = diffDays;
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      if (days > 0) {
        return `${days} 天 ${hours} 时 ${minutes} 分`;
      }
      return `${hours} 时 ${minutes} 分 ${seconds} 秒`;
    }
    
    // 大于30天，使用年月日计算
    let years = expDate.getFullYear() - now.getFullYear();
    let months = expDate.getMonth() - now.getMonth();
    let days = expDate.getDate() - now.getDate();
    
    // 如果天数为负，从月份借位
    if (days < 0) {
      months--;
      const prevMonth = new Date(expDate.getFullYear(), expDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    
    // 如果月份为负，从年份借位
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // 格式化输出
    if (years > 0 && months > 0) {
      return `${years} 年 ${months} 个月`;
    }
    if (years > 0) {
      return `${years} 年`;
    }
    if (months > 0 && days > 0) {
      return `${months} 个月 ${days} 天`;
    }
    if (months > 0) {
      return `${months} 个月`;
    }
    return `${days} 天`;
  };

  // 格式化日期为 年月日 时:分:秒
  const formatDateTime = (dateString: string): string => {
    try {
      // 如果已经是 年月日 格式，直接返回
      if (/\d{4}年\d{1,2}月\d{1,2}日/.test(dateString)) return dateString;
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateString;
    }
  };

  // 判断注册商名称是否过长
  const isRegistrarLong = (registrar: string): boolean => {
    return registrar.length > 30;
  };

  return (
    <Card className="p-4 sm:p-6 md:p-8 bg-card/60 backdrop-blur-md border border-border shadow-md">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      ) : whoisData ? (
        <div className="space-y-4 sm:space-y-6">
          {/* 1. 域名价格信息 - 放在最顶部，单行显示 */}
          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              
              {isPriceLoading && (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs sm:text-sm">正在查询价格...</span>
                </div>
              )}
              
              {priceError && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-destructive">{priceError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPrice(domain)}
                    className="h-6 px-2 text-xs gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    重试
                  </Button>
                </div>
              )}
              
              {priceData && !isPriceLoading && !priceError && (
                <div className="flex items-center gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-left-2 duration-300 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">注册:</span>
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {formatPrice(priceData.registrationPrice)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">续费:</span>
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {formatPrice(priceData.renewalPrice)}
                    </span>
                  </div>
                  <Badge 
                    variant={priceData.isPremium ? "destructive" : "secondary"} 
                    className="text-xs font-semibold px-2 py-0.5 animate-in zoom-in-50 duration-300"
                  >
                    {priceData.isPremium ? "溢价域名" : "普通域名"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* 2. 域名信息 */}
          <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
            <div className="space-y-3">
              {/* 域名和状态标签 */}
              <div className="flex items-start gap-2 sm:gap-3">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0 mt-0.5">域名:</span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm sm:text-base text-foreground break-all">
                    {displayDomain}
                  </span>
                  {/* IDN 双形态显示 */}
                  {showDualForm && (
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        ({punycodeDomain})
                      </span>
                    </div>
                  )}
                </div>
                <Badge 
                  variant={getDomainStatus().variant} 
                  className="text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 flex-shrink-0"
                >
                  {getDomainStatus().label}
                </Badge>
              </div>
              
              {/* DNSSEC */}
              <div className="flex items-center gap-2 sm:gap-3">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">DNSSEC:</span>
                <span className="text-xs sm:text-sm text-foreground">{whoisData.dnssec || "未启用"}</span>
              </div>
            </div>
          </div>
          

          {/* 2. 注册商信息 */}
          {whoisData.registrar && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* 注册商 favicon */}
                    {getRegistrarWebsite(whoisData.registrar) && (
                      <img 
                        src={getFaviconUrl(getRegistrarWebsite(whoisData.registrar)!)} 
                        alt="" 
                        className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 rounded-sm"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    {!getRegistrarWebsite(whoisData.registrar) && (
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">注册商:</span>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      {isRegistrarLong(whoisData.registrar) && !expandedRegistrar ? (
                        <>
                          <span className="font-bold text-sm sm:text-base text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {whoisData.registrar.slice(0, 25)}...
                          </span>
                          <button 
                            onClick={() => setExpandedRegistrar(true)}
                            className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                            展开
                          </button>
                        </>
                      ) : isRegistrarLong(whoisData.registrar) && expandedRegistrar ? (
                        <>
                          <span className="font-bold text-sm sm:text-base text-foreground break-all">{whoisData.registrar}</span>
                          <button 
                            onClick={() => setExpandedRegistrar(false)}
                            className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                          >
                            <ChevronUp className="h-3 w-3" />
                            收起
                          </button>
                        </>
                      ) : (
                        <span className="font-bold text-sm sm:text-base text-foreground break-all">{whoisData.registrar}</span>
                      )}
                    </div>
                    {/* 注册商官网跳转 */}
                    {getRegistrarWebsite(whoisData.registrar) && (
                      <a
                        href={getRegistrarWebsite(whoisData.registrar)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors flex-shrink-0"
                        title="访问注册商官网"
                      >
                        <Globe className="h-3 w-3" />
                        <span className="hidden sm:inline">官网</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {whoisData.registrarIanaId && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">IANA ID:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{whoisData.registrarIanaId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 3. 时间信息 */}
          {whoisData.creationDate && (
            <div className="relative p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md pb-8 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">注册时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.creationDate)}</span>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-muted-foreground">
                已注册 {getRegisteredTime(whoisData.creationDate)}
              </p>
            </div>
          )}

          {whoisData.expirationDate && (
            <div className="relative p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md pb-8 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">过期时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.expirationDate)}</span>
              </div>
              <p className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-muted-foreground">
                距离过期 {getTimeUntilExpiry(whoisData.expirationDate)}
              </p>
            </div>
          )}

          {whoisData.updatedDate && (
            <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">更新时间:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-foreground">{formatDateTime(whoisData.updatedDate)}</span>
              </div>
            </div>
          )}

          {/* 4. 注册人信息 */}
          {(whoisData.registrantOrg || whoisData.registrantCountry) && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-3">
                  {whoisData.registrantOrg && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">注册主体:</span>
                      <span className={`font-bold text-sm sm:text-base break-all ${isPrivacyRedacted(whoisData.registrantOrg) ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                        {formatDisplayValue(whoisData.registrantOrg)}
                      </span>
                    </div>
                  )}
                  {whoisData.registrantCountry && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">国家/地区:</span>
                      <span className="font-bold text-sm sm:text-base text-foreground">{getCountryName(whoisData.registrantCountry)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 5. 域名NS */}
          {whoisData.nameServers && whoisData.nameServers.length > 0 && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-2">
                  {/* 标题行：名称服务器 + DNS提供商标识 */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Server className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">名称服务器:</span>
                    <div className="flex-1" />
                    {/* DNS 提供商识别 */}
                    {getDnsProvider(whoisData.nameServers) && (
                      <a
                        href={getDnsProvider(whoisData.nameServers)!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors flex-shrink-0"
                        title={`DNS 提供商: ${getDnsProvider(whoisData.nameServers)!.name}`}
                      >
                        <img 
                          src={getFaviconUrl(getDnsProvider(whoisData.nameServers)!.url)} 
                          alt="" 
                          className="h-3 w-3 rounded-sm"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span>{getDnsProvider(whoisData.nameServers)!.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {/* NS 列表：NS1, NS2, NS3... */}
                  <div className="ml-6 sm:ml-8 space-y-1.5">
                    {whoisData.nameServers.map((ns, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap flex-shrink-0">NS{index + 1}:</span>
                        <span className="font-mono text-sm sm:text-base font-bold text-foreground break-all">{ns}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {/* 6. 域名状态 */}
          {whoisData.status && whoisData.status.length > 0 && (
              <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">域名状态:</span>
                  </div>
                  <div className="ml-6 sm:ml-8 flex flex-wrap gap-1.5 sm:gap-2">
                    {whoisData.status.map((status, index) => {
                      const statusInfo = getStatusInfo(status);
                      const severity = statusInfo?.severity || 'info';
                      const badgeClass = severity === 'error' 
                        ? 'bg-destructive text-destructive-foreground' 
                        : severity === 'warning'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-primary text-primary-foreground';
                      return (
                        <span
                          key={index}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg shadow-sm ${badgeClass}`}
                          title={typeof status === 'string' ? status : ''}
                        >
                          {translateStatus(status)}
                        </span>
                      );
                    })}
                    {/* 额外状态标签（过期、转移等动态状态） */}
                    {getExtraStatusBadges().map((badge, index) => (
                      <span
                        key={`extra-${index}`}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg shadow-sm ${
                          badge.variant === 'destructive' 
                            ? 'bg-destructive text-destructive-foreground' 
                            : badge.variant === 'secondary'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>暂无Whois信息</p>
        </div>
      )}
    </Card>
  );
};
