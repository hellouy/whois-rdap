import { useState } from "react";
import { Menu, Search, Grid3x3, Shield, MessageSquare, BookOpen, Coffee, FileText, Server, Database, Webhook, Globe, Mail } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  description: string;
  url?: string;
}

interface NavSection {
  title: string;
  icon: any;
  items: NavItem[];
}

const navigationData: NavSection[] = [
  {
    title: "Whois",
    icon: Search,
    items: [
      { title: "whois.ls", description: "推荐Whois查询", url: "https://whois.ls" },
      { title: "tian.hu", description: "推荐Whois查询", url: "https://tian.hu" },
      { title: "who.cx", description: "推荐Whois查询", url: "https://who.cx" },
      { title: "rdapis.com", description: "推荐Whois查询", url: "https://rdapis.com" },
      { title: "w.is", description: "推荐Whois查询", url: "https://w.is" },
    ]
  },
  {
    title: "域名工具",
    icon: Grid3x3,
    items: [
      { title: "Namebio", description: "国际市场域名交易行情", url: "https://namebio.com" },
      { title: "Dotdb", description: "域名关键字排名", url: "https://dotdb.com" },
      { title: "Dnpedia", description: "每日域名", url: "https://dnpedia.com" },
      { title: "domainnamestat", description: "后缀注册总量统计", url: "https://domainnamestat.com" },
      { title: "Ntldstats", description: "新顶级注册统计", url: "https://ntldstats.com" },
      { title: "Tld-list", description: "后缀注册比价", url: "https://tld-list.com" },
      { title: "ExpiredDomains", description: "过期域名查询", url: "https://expireddomains.net" },
      { title: "Alter", description: "域名销售额前500名", url: "https://alter.com" },
      { title: "Dnpric", description: "交易价格查询", url: "https://dnpric.com" },
      { title: "可备案后缀", description: "国内可备案后缀查询", url: "https://beian.miit.gov.cn" },
      { title: "Deepl", description: "翻译", url: "https://deepl.com" },
      { title: "玩米网", description: "玩米网", url: "https://wanmi.cc" },
      { title: "笨米网", description: "笨米网域名综合查询工具", url: "https://benmi.com" },
      { title: "Completedns", description: "域名注册历史查询", url: "https://completedns.com" },
      { title: "哪煮米", description: "哪里煮米便宜", url: "https://www.nazhumi.com" },
      { title: "Securitytrails", description: "域名绑定主机历史查询", url: "https://securitytrails.com" },
      { title: "Crunchbase", description: "终端相关信息查询", url: "https://crunchbase.com" },
      { title: "Snovio", description: "终端联系方式查询", url: "https://snov.io" },
      { title: "Rocketreach", description: "终端联系方式查询", url: "https://rocketreach.co" },
      { title: "GGCX", description: "域名综合信息查询", url: "https://ggcx.com" },
      { title: "Iana", description: "域名注册局联系方式", url: "https://iana.org" },
      { title: "Domcomp", description: "注册续费转入价格比价", url: "https://domcomp.com" },
      { title: "Trademarkia", description: "域名商标查询", url: "https://trademarkia.com" },
      { title: "WIPO", description: "域名仲裁查询", url: "https://wipo.int" },
      { title: "UDRP", description: "域名仲裁查询", url: "https://udrp.com" },
      { title: "WHTOP", description: "国别域名注册商查询", url: "https://whtop.com" },
      { title: "Domainhacks", description: "hacks查询", url: "https://domainhacks.info" },
      { title: "Morewords", description: "创意单词组合域名挖掘", url: "https://morewords.com" },
      { title: "Hunter", description: "查看终端的联系方式", url: "https://hunter.io" },
      { title: "Archive", description: "查询域名的建站历史", url: "https://archive.org" },
      { title: "DomainR", description: "域名注册信息查询", url: "https://domainr.com" },
      { title: "Domainbasics", description: "域名基础知识", url: "https://domainbasics.com" },
      { title: "Domainleads", description: "域名匹配终端", url: "https://domainleads.com" },
      { title: "Oneword", description: "推荐可注册的好域名", url: "https://oneword.domains" },
    ]
  },
  {
    title: "域名停放",
    icon: Database,
    items: [
      { title: "Dan", description: "国际域名停放销售平台", url: "https://dan.com" },
      { title: "Sedo", description: "国际域名停放销售平台", url: "https://sedo.com" },
      { title: "4.cn", description: "国内域名停放销售平台", url: "https://4.cn" },
      { title: "Flippa", description: "国际域名停放销售平台", url: "https://flippa.com" },
      { title: "Bodis", description: "国际域名停放销售平台", url: "https://bodis.com" },
      { title: "Escrow", description: "国际域名停放销售平台", url: "https://escrow.com" },
      { title: "Parklogic", description: "国际域名停放销售平台", url: "https://parklogic.com" },
      { title: "Parkingcrew", description: "国际域名停放销售平台", url: "https://parkingcrew.com" },
      { title: "Afternic", description: "国际域名停放销售平台", url: "https://afternic.com" },
      { title: "Efty", description: "国际域名停放销售平台", url: "https://efty.com" },
    ]
  },
  {
    title: "域名抢注平台",
    icon: Webhook,
    items: [
      { title: "Hexonet", description: "德国知名新后缀域名抢注商", url: "https://hexonet.net" },
      { title: "西部数码", description: "国内米农喜欢的注册交易抢注平台", url: "https://west.cn" },
      { title: "中资源", description: "国内抢注新后缀域名成功率高", url: "https://zzy.cn" },
      { title: "Catched", description: "无需充值就可以抢注域名的注册商", url: "https://catched.net" },
      { title: "Dynadot", description: "知名域名抢注服务商", url: "https://dynadot.com" },
      { title: "Sav", description: "新后缀注册价格比较便宜的注册商", url: "https://sav.com" },
      { title: "Rrpproxy", description: "无需竞价的域名抢注服务", url: "https://rrpproxy.com" },
      { title: "Istanco", description: ".ax .rs 域名抢注先到先得", url: "https://istanco.com" },
      { title: "park", description: "抢注国别域名比较厉害的注册商", url: "https://park.io" },
      { title: "聚名网", description: "国内知名主流后缀域名抢注商", url: "https://juming.com" },
      { title: "Nicsell", description: ".de .li .se .eu 域名抢注服务", url: "https://nicsell.com" },
      { title: "AI注册局", description: "ai后缀域名抢注商", url: "https://nic.ai" },
      { title: "CatchClub", description: "域名抢注服务商", url: "https://catchclub.com" },
      { title: "Snapnames", description: "国际知名主流后缀域名抢注商", url: "https://snapnames.com" },
      { title: "Namejet", description: "国际知名主流后缀域名抢注商", url: "https://namejet.com" },
      { title: "Dropcatch", description: "国际知名主流后缀域名抢注商", url: "https://dropcatch.com" },
      { title: "EE注册局", description: ".ee后缀域名抢注商", url: "https://internet.ee" },
      { title: "RU注册局", description: ".ru后缀域名抢注商", url: "https://nic.ru" },
      { title: "Docky", description: "小众国别域名抢注商", url: "https://docky.com" },
      { title: "Expireddomains", description: ".nz后缀域名抢注商", url: "https://expireddomains.co.nz" },
      { title: "Rymdweb", description: ".se.nu后缀域名抢注商", url: "https://rymdweb.se" },
      { title: "Nidoma", description: ".it后缀域名抢注商", url: "https://nidoma.com" },
      { title: "Catchtiger", description: ".li后缀域名抢注商", url: "https://catchtiger.com" },
      { title: "Namecase", description: ".it后缀域名抢注商", url: "https://namecase.com" },
    ]
  },
  {
    title: "域名资讯平台",
    icon: FileText,
    items: [
      { title: "Dnjournal", description: "域名行业资讯以及交易新闻", url: "https://dnjournal.com" },
      { title: "Domaingang", description: "域名行业资讯以及交易新闻", url: "https://domaingang.com" },
      { title: "Techcrunch", description: "高科技终端融资新闻", url: "https://techcrunch.com" },
      { title: "Techstars", description: "高科技终端融资新闻", url: "https://techstars.com" },
      { title: "500", description: "高科技终端融资新闻", url: "https://500.co" },
      { title: "Domainnamewire", description: "域名行业资讯以及交易新闻", url: "https://domainnamewire.com" },
      { title: "Domaining", description: "域名行业综合资讯", url: "https://domaining.com" },
    ]
  },
  {
    title: "域名解析",
    icon: Server,
    items: [
      { title: "dnspod", description: "免费智能DNS解析服务", url: "https://dnspod.cn" },
      { title: "帝恩思", description: "高防DNS域名解析服务商", url: "https://dns.com" },
      { title: "华为云DNS", description: "华为云DNS", url: "https://huaweicloud.com/product/dns.html" },
      { title: "阿里云DNS", description: "阿里云DNS", url: "https://dns.aliyun.com" },
      { title: "DNS.LA", description: "免费智能DNS的解析", url: "https://dns.la" },
      { title: "ZoneEdit", description: "美国著名的老牌免费域名DNS解析服务", url: "https://zoneedit.com" },
      { title: "HE.NET", description: "美国老牌IDC", url: "https://he.net" },
      { title: "FreeDNS", description: "美国的老牌DNS网站", url: "https://freedns.afraid.org" },
      { title: "Cloudflare", description: "强大的国外免费CDN和DNS服务", url: "https://cloudflare.com" },
      { title: "coudns", description: "coudns", url: "https://coudns.net" },
    ]
  },
  {
    title: "域名注册平台",
    icon: Globe,
    items: [
      { title: "阿里云", description: "国内终端最喜欢的域名注册+交易平台", url: "https://wanwang.aliyun.com" },
      { title: "中资源", description: "国内抢注新后缀域名成功率高", url: "https://zzy.cn" },
      { title: "Porkbun", description: "全球米农公认的便宜注册商", url: "https://porkbun.com" },
      { title: "Dynadot", description: "很受欢迎的国外域名注册商", url: "https://dynadot.com" },
      { title: "Hexonet", description: "德国著名域名注册商", url: "https://hexonet.net" },
      { title: "趣域网", description: "国内最全国别域名注册商", url: "https://quyu.net" },
      { title: "网维互联", description: "国内国别较全域名注册商", url: "https://www.nwidc.com" },
      { title: "易名网", description: "国内知名主流后缀域名注册商", url: "https://ename.com" },
      { title: "腾讯云", description: "国内优惠券最多的域名注册商", url: "https://dnspod.cloud.tencent.com" },
      { title: "Godaddy", description: "历史悠久全球知名的域名注册商", url: "https://godaddy.com" },
      { title: "Afriregister", description: "比较大的非洲国家后缀注册商", url: "https://afriregister.co.za" },
      { title: "101domain", description: "全世界支持域名后缀最多的注册商", url: "https://101domain.com" },
      { title: "netim", description: "全世界支持域名后缀最多的注册商", url: "https://netim.com" },
      { title: "Sav", description: "新后缀注册价格比较便宜的注册商", url: "https://sav.com" },
      { title: "Namesilo", description: "支持支付宝的国外知名域名注册商", url: "https://namesilo.com" },
      { title: "Namecheap", description: "国际知名服务优秀的域名注册商", url: "https://namecheap.com" },
      { title: "Uniregistry", description: "方便批量查询新后缀域名的注册商", url: "https://uniregistry.com" },
    ]
  },
  {
    title: "短语",
    icon: MessageSquare,
    items: [
      { title: "常用短语", description: "域名相关常用短语", url: "#" },
    ]
  },
];

export const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<NavSection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = navigationData.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 bg-primary text-primary-foreground"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl font-bold">
              {selectedSection ? selectedSection.title : "域名导航"}
            </SheetTitle>
            {selectedSection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSection(null)}
                className="w-fit mt-2"
              >
                ← 返回
              </Button>
            )}
          </SheetHeader>

          <div className="px-6 py-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-6 py-4">
              {!selectedSection ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSection(section)}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                      >
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-center">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {selectedSection.items.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
                    >
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};
