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
      { title: "RDAP查询", description: "新一代Whois协议" },
      { title: "传统Whois", description: "经典域名查询" },
    ]
  },
  {
    title: "域名工具",
    icon: Grid3x3,
    items: [
      { title: "Namebio", description: "国际市场域名交易行情" },
      { title: "Dotdb", description: "域名关键字排名" },
      { title: "Dnpedia", description: "每日域名" },
      { title: "domainnamestat", description: "后缀注册总量统计" },
      { title: "Ntldstats", description: "新顶级注册统计" },
      { title: "Tld-list", description: "后缀注册比价" },
      { title: "ExpiredDomains", description: "过期域名查询" },
      { title: "Alter", description: "域名销售额前500名" },
      { title: "Dnpric", description: "交易价格查询" },
      { title: "可备案后缀", description: "国内可备案后缀查询" },
      { title: "Deepl", description: "翻译" },
    ]
  },
  {
    title: "域名停放",
    icon: Database,
    items: [
      { title: "Dan", description: "国际域名停放销售平台" },
      { title: "Sedo", description: "国际域名停放销售平台" },
      { title: "4.cn", description: "国内域名停放销售平台" },
      { title: "Flippa", description: "国际域名停放销售平台" },
      { title: "Bodis", description: "国际域名停放销售平台" },
      { title: "Escrow", description: "国际域名停放销售平台" },
      { title: "Parklogic", description: "国际域名停放销售平台" },
      { title: "Parkingcrew", description: "国际域名停放销售平台" },
      { title: "Afternic", description: "国际域名停放销售平台" },
      { title: "Efty", description: "国际域名停放销售平台" },
      { title: "Oneword", description: "推荐可注册的好域名" },
    ]
  },
  {
    title: "域名抢注平台",
    icon: Webhook,
    items: [
      { title: "Hexonet", description: "德国知名新后缀域名抢注商" },
      { title: "西部数码", description: "国内米农喜欢的注册&交易平台" },
    ]
  },
  {
    title: "域名资讯平台",
    icon: FileText,
    items: [
      { title: "Dnjournal", description: "域名行业资讯以及交易新闻" },
      { title: "Domaingang", description: "域名行业资讯以及交易新闻" },
      { title: "Techcrunch", description: "高科技终端融资新闻" },
      { title: "Techstars", description: "高科技终端融资新闻" },
      { title: "500", description: "高科技终端融资新闻" },
      { title: "Domainnamewire", description: "域名行业资讯以及交易新闻" },
      { title: "Domaining", description: "https://www.domaining.com/" },
    ]
  },
  {
    title: "域名解析",
    icon: Server,
    items: [
      { title: "dnspod", description: "免费智能DNS解析服务" },
      { title: "帝恩思", description: "高防DNS域名解析服务商" },
      { title: "华为云DNS", description: "华为云DNS" },
      { title: "阿里云DNS", description: "阿里云DNS" },
      { title: "DNS.LA", description: "免费智能DNS的解析" },
      { title: "ZoneEdit", description: "美国著名的老牌免费域名DNS解析服务" },
      { title: "HE.NET", description: "美国老牌IDC" },
      { title: "FreeDNS", description: "美国的老牌DNS网站" },
    ]
  },
  {
    title: "域名注册平台",
    icon: Globe,
    items: [
      { title: "阿里云", description: "国内终端最喜欢的域名注册+交易平台" },
      { title: "中资源", description: "国内抢注新后缀域名成功率高" },
      { title: "Porkbun", description: "全球米农公认的便宜注册商" },
      { title: "Dynadot", description: "很受欢迎的国外域名注册商" },
      { title: "Hexonet", description: "德国著名域名注册商" },
      { title: "趣域网", description: "国内最全国别域名注册商" },
      { title: "网维互联", description: "国内国别较全域名注册商" },
      { title: "易名网", description: "国内知名主流后缀域名注册商" },
      { title: "腾讯云", description: "国内优惠券最多的域名注册商" },
      { title: "Godaddy", description: "历史悠久全球知名的域名注册商" },
      { title: "Afriregister", description: "比较大的非洲国家后缀注册商" },
      { title: "101domain", description: "全世界支持域名后缀最多的注册商" },
      { title: "netim", description: "全世界支持域名后缀最多的注册商" },
      { title: "Sav", description: "新后缀注册价格比较便宜的注册商" },
      { title: "Namesilo", description: "去掉支付宝的国外知名域名注册商" },
      { title: "Namecheap", description: "支持支付宝的国外知名域名注册商" },
    ]
  },
  {
    title: "短语",
    icon: MessageSquare,
    items: [
      { title: "常用短语", description: "域名相关常用短语" },
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
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-md hover:scale-105 group"
                      >
                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-center">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSection.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-md cursor-pointer group"
                    >
                      <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
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
