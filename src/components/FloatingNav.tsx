import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid3x3,
  Zap,
  Globe,
  History,
  Database,
  Webhook,
  ChevronLeft,
  ExternalLink,
  Menu,
  Clock,
  X,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQueryHistory, QueryHistoryItem } from "@/hooks/use-query-history";
import {
  getTldSupportList,
  clearTldSupportList,
  removeTldEntry,
  type TldSupportEntry,
  type TldStatus,
} from "@/utils/tld-support-store";

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

interface QuickNavEntry {
  key: string;
  label: string;
  icon: any;
  action: "navigate" | "section";
  route?: string;
  sectionKey?: string;
}

const quickNav: QuickNavEntry[] = [
  { key: "whois", label: "查询", icon: Search, action: "navigate", route: "/query" },
  { key: "tools", label: "域名工具", icon: Grid3x3, action: "section", sectionKey: "tools" },
  { key: "hack", label: "Hack", icon: Zap, action: "navigate", route: "/hack" },
  { key: "parking", label: "停放", icon: Database, action: "section", sectionKey: "parking" },
  { key: "register", label: "注册", icon: Globe, action: "section", sectionKey: "register" },
  { key: "grab", label: "抢注", icon: Webhook, action: "section", sectionKey: "grab" },
  { key: "history", label: "历史", icon: History, action: "section", sectionKey: "history" },
  { key: "support", label: "支持列表", icon: ShieldCheck, action: "section", sectionKey: "support" },
];

const toolSections: Record<string, ToolSection> = {
  tools: {
    title: "域名工具",
    icon: Grid3x3,
    items: [
      { title: "Namebio", description: "国际域名成交行情数据库", url: "https://namebio.com" },
      { title: "Dotdb", description: "域名关键字排名与历史查询", url: "https://dotdb.com" },
      { title: "Dnpedia", description: "每日新注册域名", url: "https://dnpedia.com" },
      { title: "domainnamestat", description: "各后缀注册总量统计", url: "https://domainnamestat.com" },
      { title: "Ntldstats", description: "新顶级域名注册统计", url: "https://ntldstats.com" },
      { title: "Tld-list", description: "后缀注册/续费比价", url: "https://tld-list.com" },
      { title: "ExpiredDomains", description: "过期域名查询与筛选", url: "https://expireddomains.net" },
      { title: "Alter", description: "域名成交额Top500", url: "https://alter.com" },
      { title: "Dnpric", description: "历史交易价格查询", url: "https://dnpric.com" },
      { title: "哪煮米", description: "注册商价格比较工具", url: "https://www.nazhumi.com" },
      { title: "玩米网", description: "域名综合查询工具", url: "https://wanmi.cc" },
      { title: "笨米网", description: "域名综合查询/白名单", url: "https://benmi.com" },
      { title: "Completedns", description: "域名注册历史查询", url: "https://completedns.com" },
      { title: "Securitytrails", description: "主机IP历史/DNS历史", url: "https://securitytrails.com" },
      { title: "Crunchbase", description: "公司/融资/终端信息", url: "https://crunchbase.com" },
      { title: "Domainhacks", description: "Domain Hack 查询", url: "https://domainhacks.info" },
      { title: "Archive", description: "Wayback Machine 建站历史", url: "https://archive.org" },
      { title: "DomainR", description: "域名快速查询/搜索", url: "https://domainr.com" },
      { title: "Whoxy", description: "Whois历史/反查注册人", url: "https://www.whoxy.com" },
      { title: "ViewDNS", description: "多维度域名信息查询", url: "https://viewdns.info" },
      { title: "Dnslytics", description: "域名/IP 情报分析", url: "https://dnslytics.com" },
      { title: "MXToolbox", description: "DNS/邮件记录诊断工具", url: "https://mxtoolbox.com" },
      { title: "Dnsjson", description: "在线DNS记录查询", url: "https://www.dnsjson.com" },
      { title: "可备案后缀", description: "国内工信部可备案后缀列表", url: "https://beian.miit.gov.cn" },
      { title: "Deepl", description: "AI高质量翻译工具", url: "https://deepl.com" },
      { title: "Dnjournal", description: "域名行业资讯", url: "https://dnjournal.com" },
      { title: "Domaingang", description: "域名行业新闻/交易", url: "https://domaingang.com" },
      { title: "Techcrunch", description: "科技/融资/创业新闻", url: "https://techcrunch.com" },
      { title: "Cloudflare DNS", description: "免费CDN和智能DNS", url: "https://cloudflare.com" },
      { title: "Dnspod", description: "腾讯云免费智能DNS", url: "https://dnspod.cn" },
      { title: "BuiltWith", description: "网站技术栈分析", url: "https://builtwith.com" },
      { title: "SimilarWeb", description: "网站流量与竞品分析", url: "https://similarweb.com" },
      { title: "Ahrefs", description: "域名权重/外链/SEO分析", url: "https://ahrefs.com" },
      { title: "Moz", description: "域名DA权重评估", url: "https://moz.com/domain-analysis" },
    ],
  },
  parking: {
    title: "域名停放",
    icon: Database,
    items: [
      { title: "Dan.com", description: "Godaddy旗下停放与销售平台，支持分期", url: "https://dan.com" },
      { title: "Sedo", description: "全球最大国际域名停放销售平台", url: "https://sedo.com" },
      { title: "Afternic", description: "Godaddy旗下，全球最大分销网络", url: "https://afternic.com" },
      { title: "4.cn", description: "国内头部停放销售平台，有国内流量", url: "https://4.cn" },
      { title: "Bodis", description: "停放变现+域名展示落地页", url: "https://bodis.com" },
      { title: "Flippa", description: "网站/域名/App综合交易平台", url: "https://flippa.com" },
      { title: "Efty", description: "专业域名展示销售平台", url: "https://efty.com" },
      { title: "Parkingcrew", description: "停放广告变现平台", url: "https://parkingcrew.com" },
      { title: "Undeveloped", description: "欧洲知名停放销售平台", url: "https://undeveloped.com" },
      { title: "BrandBucket", description: "品牌域名精选交易市场", url: "https://brandbucket.com" },
      { title: "Squadhelp", description: "企业命名+域名一站购买", url: "https://squadhelp.com" },
      { title: "Atom.com", description: "AI驱动品牌域名交易平台", url: "https://atom.com" },
      { title: "易名网", description: "国内中高端域名交易平台", url: "https://ename.com" },
      { title: "西部数码", description: "国内主流域名交易市场", url: "https://west.cn" },
    ],
  },
  register: {
    title: "域名注册",
    icon: Globe,
    items: [
      { title: "Porkbun", description: "全球公认最便宜注册商之一", url: "https://porkbun.com" },
      { title: "Cloudflare", description: "以成本价注册域名，无溢价", url: "https://cloudflare.com/products/registrar" },
      { title: "Namesilo", description: "支持支付宝，价格透明无涨价", url: "https://namesilo.com" },
      { title: "Dynadot", description: "国外热门注册商，支持中文", url: "https://dynadot.com" },
      { title: "Namecheap", description: "国际知名注册商，隐私保护免费", url: "https://namecheap.com" },
      { title: "Godaddy", description: "全球最大注册商，覆盖后缀最广", url: "https://godaddy.com" },
      { title: "Hexonet", description: "德国著名注册商，新后缀全", url: "https://hexonet.net" },
      { title: "101domain", description: "后缀数量最多的注册商", url: "https://101domain.com" },
      { title: "阿里云", description: "国内终端注册+域名交易市场", url: "https://wanwang.aliyun.com" },
      { title: "腾讯云", description: "优惠券多，有活动价", url: "https://dnspod.cloud.tencent.com" },
      { title: "西部数码", description: "国内主流，支持国别域名", url: "https://west.cn" },
      { title: "趣域网", description: "国内国别域名最全注册商", url: "https://quyu.net" },
      { title: "易名网", description: "国内知名注册商，有老用户价", url: "https://ename.com" },
      { title: "Sav.com", description: "新兴注册商，新后缀价格便宜", url: "https://sav.com" },
      { title: "Gandi", description: "法国注册商，注重隐私保护", url: "https://gandi.net" },
      { title: "Name.com", description: "Donuts旗下注册商", url: "https://name.com" },
    ],
  },
  grab: {
    title: "域名抢注",
    icon: Webhook,
    items: [
      { title: "Hexonet", description: "新后缀Pre-Order抢注首选", url: "https://hexonet.net" },
      { title: "西部数码", description: "国内过期抢注+Drop服务", url: "https://west.cn" },
      { title: "中资源", description: "新后缀抢注成功率较高", url: "https://zzy.cn" },
      { title: "Catched", description: "无需预充值，按成功付费", url: "https://catched.net" },
      { title: "Dynadot", description: "支持Backorder，成功再收费", url: "https://dynadot.com" },
      { title: "Snapnames", description: "国际主流后缀抢注平台", url: "https://snapnames.com" },
      { title: "Namejet", description: "国际主流后缀，支持竞拍", url: "https://namejet.com" },
      { title: "Dropcatch", description: "国际主流后缀，免费竞价", url: "https://dropcatch.com" },
      { title: "park.io", description: "国别域名ccTLD专业抢注", url: "https://park.io" },
      { title: "聚名网", description: "国内主流后缀过期竞价", url: "https://juming.com" },
      { title: "Sav.com", description: "Backorder价格便宜", url: "https://sav.com" },
      { title: "GoDaddy Auctions", description: "Godaddy过期域名竞价", url: "https://auctions.godaddy.com" },
      { title: "NamePros", description: "域名论坛，可找抢注合作", url: "https://namepros.com" },
      { title: "ExpiredDomains", description: "过期域名监控与筛选", url: "https://expireddomains.net" },
    ],
  },
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString("zh-CN");
}

function getDateGroup(timestamp: number): string {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  if (timestamp >= todayStart) return "今天";
  if (timestamp >= yesterdayStart) return "昨天";
  return "更早";
}

interface HistoryGroup {
  label: string;
  items: QueryHistoryItem[];
}

function groupHistory(items: QueryHistoryItem[]): HistoryGroup[] {
  const groups: Record<string, QueryHistoryItem[]> = {};
  const order = ["今天", "昨天", "更早"];
  for (const item of items) {
    const label = getDateGroup(item.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return order.filter(l => groups[l]).map(l => ({ label: l, items: groups[l] }));
}

type SupportFilter = "all" | "supported" | "third_party" | "unsupported";

function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    RDAP: "RDAP",
    RDAP_DIRECT: "RDAP直连",
    RDAP_ORG: "rdap.org",
    WHOIS_FALLBACK: "WHOIS",
    TIANHU: "tian.hu",
    DNS_FALLBACK: "DNS检测",
    UNKNOWN: "未知",
  };
  return map[source] ?? source;
}

export const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [supportFilter, setSupportFilter] = useState<SupportFilter>("all");
  const [supportList, setSupportList] = useState<TldSupportEntry[]>([]);
  const navigate = useNavigate();
  const { history, clearHistory, removeItem, refresh: refreshHistory } = useQueryHistory();

  const currentSection = activeSection && activeSection !== "history" && activeSection !== "support"
    ? toolSections[activeSection]
    : null;

  const refreshSupportList = useCallback(() => {
    setSupportList(getTldSupportList());
  }, []);

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

  const filteredHistory = useMemo(() => {
    if (activeSection !== "history") return [];
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter(
      (h) =>
        h.domain.toLowerCase().includes(q) ||
        h.displayDomain.toLowerCase().includes(q)
    );
  }, [activeSection, history, search]);

  const groupedHistory = useMemo(() => groupHistory(filteredHistory), [filteredHistory]);

  const handleQuickNav = (entry: QuickNavEntry) => {
    if (entry.action === "navigate") {
      setOpen(false);
      if (entry.route) navigate(entry.route);
    } else if (entry.sectionKey) {
      if (entry.sectionKey === "support") refreshSupportList();
      setActiveSection(entry.sectionKey);
      setSearch("");
      setSupportFilter("all");
    }
  };

  const handleBack = () => {
    setActiveSection(null);
    setSearch("");
    setSupportFilter("all");
  };

  const filteredSupportList = useMemo(() => {
    let list = supportList;
    if (supportFilter !== "all") list = list.filter((e) => e.status === supportFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.tld.toLowerCase().includes(q) || e.source.toLowerCase().includes(q));
    }
    return list;
  }, [supportList, supportFilter, search]);

  const supportCounts = useMemo(() => ({
    all: supportList.length,
    supported: supportList.filter((e) => e.status === "supported").length,
    third_party: supportList.filter((e) => e.status === "third_party").length,
    unsupported: supportList.filter((e) => e.status === "unsupported").length,
  }), [supportList]);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      refreshHistory();
    } else {
      setActiveSection(null);
      setSearch("");
      setSupportFilter("all");
    }
  };

  const handleHistorySelect = (item: QueryHistoryItem) => {
    setOpen(false);
    navigate(`/${item.displayDomain}`);
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
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-muted-foreground/20" />

        {!activeSection ? (
          <div className="px-5 pb-6 pt-2">
            <p className="text-base font-bold tracking-wide mb-4">不讲•李</p>
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
        ) : activeSection === "history" ? (
          <div className="flex flex-col overflow-hidden" style={{ height: "72vh" }}>
            <div className="flex items-center gap-2 px-5 pt-1 pb-3 flex-shrink-0">
              <button
                onClick={handleBack}
                className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">查询历史</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {filteredHistory.length} 条
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  清除
                </button>
              )}
            </div>

            <div className="px-5 pb-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索历史记录..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-6">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">暂无查询记录</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedHistory.map((group) => (
                    <div key={group.label}>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-0.5">{group.label}</p>
                      <div className="space-y-1.5">
                        {group.items.map((item) => (
                          <div
                            key={item.domain}
                            className="group flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                            onClick={() => handleHistorySelect(item)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                  {item.displayDomain}
                                </span>
                                {item.status && (
                                  <Badge
                                    variant={
                                      item.status === "未注册"
                                        ? "outline"
                                        : item.status === "已注册"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-[10px] px-1.5 py-0 h-4 leading-none flex-shrink-0"
                                  >
                                    {item.status}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {timeAgo(item.timestamp)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(item.domain);
                              }}
                              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeSection === "support" ? (
          <div className="flex flex-col overflow-hidden" style={{ height: "72vh" }}>
            {/* Header */}
            <div className="flex items-center gap-2 px-5 pt-1 pb-3 flex-shrink-0">
              <button
                onClick={handleBack}
                className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">域名支持列表</span>
              <span className="text-xs text-muted-foreground ml-auto">{filteredSupportList.length} 个后缀</span>
              {supportList.length > 0 && (
                <button
                  onClick={() => { clearTldSupportList(); refreshSupportList(); }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  清除
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="px-5 pb-2 flex-shrink-0">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {(
                  [
                    { key: "all",         label: "全部",   count: supportCounts.all },
                    { key: "supported",   label: "已支持", count: supportCounts.supported },
                    { key: "third_party", label: "第三方", count: supportCounts.third_party },
                    { key: "unsupported", label: "不支持", count: supportCounts.unsupported },
                  ] as { key: SupportFilter; label: string; count: number }[]
                ).map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setSupportFilter(key)}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      supportFilter === key
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                    }`}
                  >
                    {label}
                    <span className={`text-[10px] tabular-nums ${supportFilter === key ? "opacity-70" : "opacity-60"}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="px-5 pb-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索后缀..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-6">
              {supportList.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <ShieldCheck className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium mb-1">暂无记录</p>
                  <p className="text-xs opacity-70">查询域名后，系统会自动记录<br />各后缀的查询支持情况</p>
                </div>
              ) : filteredSupportList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">无匹配结果</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredSupportList.map((entry) => (
                    <div
                      key={entry.tld}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-card"
                    >
                      {/* Status icon */}
                      <div className="flex-shrink-0">
                        {entry.status === "supported" && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {entry.status === "third_party" && (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                        {entry.status === "unsupported" && (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>

                      {/* TLD + info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono font-semibold">.{entry.tld}</span>
                          <Badge
                            className={`text-[9px] px-1.5 py-0 h-4 leading-none ${
                              entry.status === "supported"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : entry.status === "third_party"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-red-500/10 text-red-500 border-red-400/20"
                            }`}
                            variant="outline"
                          >
                            {entry.status === "supported"
                              ? "已支持"
                              : entry.status === "third_party"
                              ? "第三方"
                              : "不支持"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{sourceLabel(entry.source)}</span>
                        </div>
                        {entry.status === "unsupported" && entry.errorMsg && (
                          <p className="text-[10px] text-red-400/80 mt-0.5 truncate">{entry.errorMsg}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                          查询 {entry.queryCount} 次 · {timeAgo(entry.lastQueried)}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => { removeTldEntry(entry.tld); refreshSupportList(); }}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col overflow-hidden" style={{ height: "72vh" }}>
            <div className="flex items-center gap-2 px-5 pt-1 pb-3 flex-shrink-0">
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

            <div className="px-5 pb-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-6">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredItems.map((item, i) => (
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
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};
