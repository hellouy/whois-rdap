import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid3x3,
  Zap,
  FileText,
  BookOpen,
  Globe,
  History,
  Server,
  Database,
  Webhook,
  ChevronLeft,
  ExternalLink,
  Menu,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

// ─── Types ───────────────────────────────────────────────
interface NavItem {
  title: string;
  description: string;
  url?: string;
}

interface ToolSection {
  title: string;
  icon: any;
  items: NavItem[];
}

// ─── Quick nav entries (top-level grid) ──────────────────
interface QuickNavEntry {
  key: string;
  label: string;
  icon: any;
  action: "navigate" | "section";
  route?: string;
  sectionKey?: string;
}

const quickNav: QuickNavEntry[] = [
  { key: "whois", label: "查询", icon: Search, action: "navigate", route: "/" },
  { key: "tools", label: "域名工具", icon: Grid3x3, action: "section", sectionKey: "tools" },
  { key: "hack", label: "Hack", icon: Zap, action: "navigate", route: "/hack" },
  { key: "phrases", label: "短语", icon: FileText, action: "section", sectionKey: "phrases" },
  { key: "parking", label: "停放", icon: Database, action: "section", sectionKey: "parking" },
  { key: "register", label: "注册", icon: Globe, action: "section", sectionKey: "register" },
  { key: "grab", label: "抢注", icon: Webhook, action: "section", sectionKey: "grab" },
  { key: "history", label: "历史", icon: History, action: "navigate", route: "/#history" },
];

// ─── Tool sections ───────────────────────────────────────
const toolSections: Record<string, ToolSection> = {
  tools: {
    title: "域名工具",
    icon: Grid3x3,
    items: [
      { title: "Namebio", description: "国际域名交易行情", url: "https://namebio.com" },
      { title: "Dotdb", description: "域名关键字排名", url: "https://dotdb.com" },
      { title: "Dnpedia", description: "每日域名", url: "https://dnpedia.com" },
      { title: "domainnamestat", description: "后缀注册总量", url: "https://domainnamestat.com" },
      { title: "Ntldstats", description: "新顶级注册统计", url: "https://ntldstats.com" },
      { title: "Tld-list", description: "后缀注册比价", url: "https://tld-list.com" },
      { title: "ExpiredDomains", description: "过期域名查询", url: "https://expireddomains.net" },
      { title: "Alter", description: "销售额Top500", url: "https://alter.com" },
      { title: "Dnpric", description: "交易价格查询", url: "https://dnpric.com" },
      { title: "可备案后缀", description: "国内可备案后缀", url: "https://beian.miit.gov.cn" },
      { title: "Deepl", description: "翻译工具", url: "https://deepl.com" },
      { title: "玩米网", description: "域名综合工具", url: "https://wanmi.cc" },
      { title: "笨米网", description: "域名综合查询", url: "https://benmi.com" },
      { title: "Completedns", description: "注册历史查询", url: "https://completedns.com" },
      { title: "哪煮米", description: "比价工具", url: "https://www.nazhumi.com" },
      { title: "Securitytrails", description: "主机历史查询", url: "https://securitytrails.com" },
      { title: "Crunchbase", description: "终端信息查询", url: "https://crunchbase.com" },
      { title: "Domainhacks", description: "Hacks查询", url: "https://domainhacks.info" },
      { title: "Archive", description: "建站历史", url: "https://archive.org" },
      { title: "DomainR", description: "域名信息查询", url: "https://domainr.com" },
      { title: "Dnjournal", description: "域名行业资讯", url: "https://dnjournal.com" },
      { title: "Domaingang", description: "交易新闻", url: "https://domaingang.com" },
      { title: "Techcrunch", description: "科技融资新闻", url: "https://techcrunch.com" },
      { title: "dnspod", description: "免费智能DNS", url: "https://dnspod.cn" },
      { title: "Cloudflare", description: "CDN和DNS", url: "https://cloudflare.com" },
    ],
  },
  phrases: {
    title: "域名短语",
    icon: FileText,
    items: [
      { title: "doma.in", description: "domain 域名" },
      { title: "jo.in", description: "join 加入" },
      { title: "tra.in", description: "train 火车" },
      { title: "bra.in", description: "brain 大脑" },
      { title: "ga.me", description: "game 游戏" },
      { title: "na.me", description: "name 名字" },
      { title: "ho.me", description: "home 家" },
      { title: "ti.me", description: "time 时间" },
      { title: "bit.ly", description: "bitly 短链接" },
      { title: "dai.ly", description: "daily 每日" },
      { title: "love.ly", description: "lovely 可爱的" },
      { title: "stre.am", description: "stream 流媒体" },
      { title: "dre.am", description: "dream 梦想" },
      { title: "te.am", description: "team 团队" },
      { title: "th.is", description: "this 这个" },
      { title: "b.it", description: "bit 位" },
      { title: "ed.it", description: "edit 编辑" },
      { title: "foc.us", description: "focus 焦点" },
      { title: "stud.io", description: "studio 工作室" },
      { title: "aud.io", description: "audio 音频" },
      { title: "auth.or", description: "author 作者" },
      { title: "creat.or", description: "creator 创造者" },
      { title: "tu.be", description: "tube 管道" },
      { title: "glo.be", description: "globe 地球" },
      { title: "gam.es", description: "games 游戏" },
      { title: "not.es", description: "notes 笔记" },
      { title: "log.in", description: "login 登录" },
      { title: "w.in", description: "win 赢" },
    ],
  },
  parking: {
    title: "域名停放",
    icon: Database,
    items: [
      { title: "Dan", description: "国际停放销售平台", url: "https://dan.com" },
      { title: "Sedo", description: "国际停放销售平台", url: "https://sedo.com" },
      { title: "4.cn", description: "国内停放销售平台", url: "https://4.cn" },
      { title: "Flippa", description: "国际停放平台", url: "https://flippa.com" },
      { title: "Bodis", description: "国际停放平台", url: "https://bodis.com" },
      { title: "Afternic", description: "国际停放平台", url: "https://afternic.com" },
      { title: "Efty", description: "国际停放平台", url: "https://efty.com" },
      { title: "Parkingcrew", description: "停放平台", url: "https://parkingcrew.com" },
    ],
  },
  register: {
    title: "域名注册",
    icon: Globe,
    items: [
      { title: "阿里云", description: "国内终端注册+交易", url: "https://wanwang.aliyun.com" },
      { title: "Porkbun", description: "全球公认便宜注册商", url: "https://porkbun.com" },
      { title: "Dynadot", description: "国外热门注册商", url: "https://dynadot.com" },
      { title: "Hexonet", description: "德国著名注册商", url: "https://hexonet.net" },
      { title: "Namesilo", description: "支持支付宝的国外注册商", url: "https://namesilo.com" },
      { title: "Namecheap", description: "国际知名注册商", url: "https://namecheap.com" },
      { title: "Godaddy", description: "全球知名注册商", url: "https://godaddy.com" },
      { title: "101domain", description: "后缀最多的注册商", url: "https://101domain.com" },
      { title: "趣域网", description: "国内最全国别注册商", url: "https://quyu.net" },
      { title: "腾讯云", description: "优惠券多的注册商", url: "https://dnspod.cloud.tencent.com" },
      { title: "西部数码", description: "国内交易抢注平台", url: "https://west.cn" },
      { title: "易名网", description: "国内知名注册商", url: "https://ename.com" },
    ],
  },
  grab: {
    title: "域名抢注",
    icon: Webhook,
    items: [
      { title: "Hexonet", description: "德国新后缀抢注商", url: "https://hexonet.net" },
      { title: "西部数码", description: "国内抢注交易平台", url: "https://west.cn" },
      { title: "中资源", description: "新后缀成功率高", url: "https://zzy.cn" },
      { title: "Catched", description: "无需充值抢注", url: "https://catched.net" },
      { title: "Dynadot", description: "知名抢注服务商", url: "https://dynadot.com" },
      { title: "Sav", description: "新后缀注册便宜", url: "https://sav.com" },
      { title: "park.io", description: "国别域名抢注", url: "https://park.io" },
      { title: "聚名网", description: "国内主流后缀抢注", url: "https://juming.com" },
      { title: "Snapnames", description: "国际主流后缀抢注", url: "https://snapnames.com" },
      { title: "Namejet", description: "国际主流后缀抢注", url: "https://namejet.com" },
      { title: "Dropcatch", description: "国际主流后缀抢注", url: "https://dropcatch.com" },
    ],
  },
};

// ─── Component ───────────────────────────────────────────
export const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const currentSection = activeSection ? toolSections[activeSection] : null;

  const filteredItems = useMemo(() => {
    if (!currentSection) return [];
    if (!search.trim()) return currentSection.items;
    const q = search.toLowerCase();
    return currentSection.items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }, [currentSection, search]);

  const handleQuickNav = (entry: QuickNavEntry) => {
    if (entry.action === "navigate") {
      setOpen(false);
      if (entry.route) navigate(entry.route);
    } else if (entry.sectionKey) {
      setActiveSection(entry.sectionKey);
      setSearch("");
    }
  };

  const handleBack = () => {
    setActiveSection(null);
    setSearch("");
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setActiveSection(null);
      setSearch("");
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button
          className="fixed right-5 bottom-5 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 bg-foreground text-background flex items-center justify-center"
          aria-label="导航菜单"
        >
          <Menu className="h-5 w-5" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh] focus:outline-none">
        {/* Handle bar */}
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-muted-foreground/20" />

        {!activeSection ? (
          /* ───── Main grid ───── */
          <div className="px-5 pb-6 pt-2">
            <p className="text-base font-bold tracking-wide mb-4">TIAN.HU</p>
            <div className="grid grid-cols-4 gap-3">
              {quickNav.map((entry) => (
                <button
                  key={entry.key}
                  onClick={() => handleQuickNav(entry)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 active:scale-95 group"
                >
                  <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                    <entry.icon className="h-[18px] w-[18px] text-foreground/80" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                    {entry.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ───── Section detail ───── */
          <div className="flex flex-col max-h-[75vh]">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 pt-1 pb-3">
              <button
                onClick={handleBack}
                className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">{currentSection?.title}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {filteredItems.length} 项
              </span>
            </div>

            {/* Search */}
            <div className="px-5 pb-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            {/* Items grid */}
            <ScrollArea className="flex-1 px-5 pb-6">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredItems.map((item, i) =>
                  item.url ? (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/50 flex-shrink-0" />
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div
                      key={i}
                      className="p-3 rounded-xl border bg-card"
                    >
                      <span className="text-xs font-semibold">{item.title}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};
