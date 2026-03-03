// DNS 提供商识别 - 本地维护，方便添加新提供商

export interface DnsProviderInfo {
  name: string;
  url: string;
}

export const DNS_PROVIDERS: Record<string, DnsProviderInfo> = {
  // 国际主流
  'cloudflare': { name: 'Cloudflare', url: 'https://www.cloudflare.com' },
  'awsdns': { name: 'AWS Route53', url: 'https://aws.amazon.com/route53' },
  'azure-dns': { name: 'Azure DNS', url: 'https://azure.microsoft.com' },
  'google': { name: 'Google Cloud DNS', url: 'https://cloud.google.com/dns' },
  'ns.google': { name: 'Google Cloud DNS', url: 'https://cloud.google.com/dns' },
  'dnsimple': { name: 'DNSimple', url: 'https://dnsimple.com' },
  'dynect': { name: 'Dyn (Oracle)', url: 'https://www.oracle.com/cloud/networking/dns' },
  'dyn': { name: 'Dyn (Oracle)', url: 'https://www.oracle.com/cloud/networking/dns' },
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
  'wordpress': { name: 'WordPress.com', url: 'https://wordpress.com' },
  'wpengine': { name: 'WP Engine', url: 'https://wpengine.com' },
  'shopify': { name: 'Shopify', url: 'https://www.shopify.com' },
  'bunny': { name: 'Bunny DNS', url: 'https://bunny.net' },
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

  // 中国
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
  'zdns': { name: 'ZDNS', url: 'https://www.zdns.cn' },
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

  // 其他中小型/新兴
  'cloudns': { name: 'ClouDNS', url: 'https://www.cloudns.net' },
  'dnsmadeeasy': { name: 'DNS Made Easy', url: 'https://dnsmadeeasy.com' },
  'easydns': { name: 'easyDNS', url: 'https://easydns.com' },
  'constellix': { name: 'Constellix', url: 'https://constellix.com' },
  'no-ip': { name: 'No-IP', url: 'https://www.noip.com' },
  'afraid': { name: 'FreeDNS.afraid.org', url: 'https://freedns.afraid.org' },
  'freedns': { name: 'FreeDNS.afraid.org', url: 'https://freedns.afraid.org' },
  'rage4': { name: 'Rage4', url: 'https://rage4.com' },
  'luadns': { name: 'LuaDNS', url: 'https://luadns.com' },
  'desec': { name: 'deSEC', url: 'https://desec.io' },
  'zilore': { name: 'Zilore', url: 'https://zilore.com' },
  'nextdns': { name: 'NextDNS', url: 'https://nextdns.io' },
  'controld': { name: 'Control D', url: 'https://controld.com' },
  'adguard': { name: 'AdGuard DNS', url: 'https://adguard-dns.io' },
  'cleanbrowsing': { name: 'CleanBrowsing', url: 'https://cleanbrowsing.org' },
  '1984': { name: '1984 Hosting', url: 'https://www.1984.is' },
  'buddyns': { name: 'BuddyNS', url: 'https://www.buddyns.com' },
  'zoneedit': { name: 'ZoneEdit', url: 'https://www.zoneedit.com' },
  'gcore': { name: 'Gcore', url: 'https://gcore.com' },
};

/**
 * 识别 DNS 提供商（基于第一个NS的子串匹配）
 */
export const getDnsProvider = (nameServers: string[]): DnsProviderInfo | null => {
  if (!nameServers || nameServers.length === 0) return null;
  
  const firstNs = nameServers[0].toLowerCase();
  
  for (const [key, provider] of Object.entries(DNS_PROVIDERS)) {
    if (firstNs.includes(key.toLowerCase())) {
      return provider;
    }
  }
  return null;
};
