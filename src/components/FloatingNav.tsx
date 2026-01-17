import { useState, useMemo } from "react";
import { Menu, Search, Grid3x3, FileText, Server, Database, Webhook, Globe, MessageSquare } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  description: string;
  url?: string;
  tld?: string;
}

interface NavSection {
  title: string;
  icon: any;
  items: NavItem[];
  isPhrase?: boolean;
}

// 域名短语数据 - 按后缀分组
const domainPhrases: Record<string, NavItem[]> = {
  ".in": [
    { title: "doma.in", description: "domain 域名", tld: ".in" },
    { title: "jo.in", description: "join 加入", tld: ".in" },
    { title: "tra.in", description: "train 火车/训练", tld: ".in" },
    { title: "bra.in", description: "brain 大脑", tld: ".in" },
    { title: "ga.in", description: "gain 获得", tld: ".in" },
    { title: "cha.in", description: "chain 链条", tld: ".in" },
    { title: "ma.in", description: "main 主要", tld: ".in" },
    { title: "pla.in", description: "plain 平原/朴素", tld: ".in" },
    { title: "aga.in", description: "again 再次", tld: ".in" },
    { title: "rema.in", description: "remain 保持", tld: ".in" },
    { title: "conta.in", description: "contain 包含", tld: ".in" },
    { title: "obta.in", description: "obtain 获得", tld: ".in" },
    { title: "log.in", description: "login 登录", tld: ".in" },
    { title: "plug.in", description: "plugin 插件", tld: ".in" },
    { title: "beg.in", description: "begin 开始", tld: ".in" },
    { title: "w.in", description: "win 赢", tld: ".in" },
    { title: "sk.in", description: "skin 皮肤", tld: ".in" },
    { title: "sp.in", description: "spin 旋转", tld: ".in" },
    { title: "tw.in", description: "twin 双胞胎", tld: ".in" },
    { title: "p.in", description: "pin 针/图钉", tld: ".in" },
    { title: "b.in", description: "bin 箱子", tld: ".in" },
  ],
  ".ly": [
    { title: "bit.ly", description: "bitly 短链接", tld: ".ly" },
    { title: "dai.ly", description: "daily 每日", tld: ".ly" },
    { title: "week.ly", description: "weekly 每周", tld: ".ly" },
    { title: "month.ly", description: "monthly 每月", tld: ".ly" },
    { title: "quick.ly", description: "quickly 快速地", tld: ".ly" },
    { title: "safe.ly", description: "safely 安全地", tld: ".ly" },
    { title: "love.ly", description: "lovely 可爱的", tld: ".ly" },
    { title: "live.ly", description: "lively 活泼的", tld: ".ly" },
    { title: "final.ly", description: "finally 最终", tld: ".ly" },
    { title: "actual.ly", description: "actually 实际上", tld: ".ly" },
    { title: "total.ly", description: "totally 完全地", tld: ".ly" },
    { title: "natural.ly", description: "naturally 自然地", tld: ".ly" },
    { title: "virtual.ly", description: "virtually 几乎", tld: ".ly" },
    { title: "on.ly", description: "only 只有", tld: ".ly" },
    { title: "tru.ly", description: "truly 真正地", tld: ".ly" },
    { title: "ho.ly", description: "holy 神圣的", tld: ".ly" },
    { title: "ear.ly", description: "early 早", tld: ".ly" },
    { title: "near.ly", description: "nearly 几乎", tld: ".ly" },
    { title: "clear.ly", description: "clearly 清楚地", tld: ".ly" },
    { title: "exact.ly", description: "exactly 确切地", tld: ".ly" },
    { title: "definite.ly", description: "definitely 肯定地", tld: ".ly" },
  ],
  ".am": [
    { title: "stre.am", description: "stream 流媒体", tld: ".am" },
    { title: "dre.am", description: "dream 梦想", tld: ".am" },
    { title: "te.am", description: "team 团队", tld: ".am" },
    { title: "be.am", description: "beam 光束", tld: ".am" },
    { title: "se.am", description: "seam 缝隙", tld: ".am" },
    { title: "cre.am", description: "cream 奶油", tld: ".am" },
    { title: "scre.am", description: "scream 尖叫", tld: ".am" },
    { title: "progr.am", description: "program 程序", tld: ".am" },
    { title: "diagr.am", description: "diagram 图表", tld: ".am" },
    { title: "j.am", description: "jam 果酱", tld: ".am" },
    { title: "sp.am", description: "spam 垃圾邮件", tld: ".am" },
    { title: "gr.am", description: "gram 克", tld: ".am" },
    { title: "sl.am", description: "slam 猛击", tld: ".am" },
  ],
  ".is": [
    { title: "th.is", description: "this 这个", tld: ".is" },
    { title: "h.is", description: "his 他的", tld: ".is" },
    { title: "kr.is", description: "kris 克利斯", tld: ".is" },
    { title: "cris.is", description: "crisis 危机", tld: ".is" },
    { title: "bas.is", description: "basis 基础", tld: ".is" },
    { title: "analys.is", description: "analysis 分析", tld: ".is" },
    { title: "thes.is", description: "thesis 论文", tld: ".is" },
    { title: "emphas.is", description: "emphasis 强调", tld: ".is" },
    { title: "hypothes.is", description: "hypothesis 假设", tld: ".is" },
    { title: "genes.is", description: "genesis 起源", tld: ".is" },
    { title: "oas.is", description: "oasis 绿洲", tld: ".is" },
    { title: "tenn.is", description: "tennis 网球", tld: ".is" },
  ],
  ".it": [
    { title: "b.it", description: "bit 位", tld: ".it" },
    { title: "f.it", description: "fit 适合", tld: ".it" },
    { title: "h.it", description: "hit 打击", tld: ".it" },
    { title: "k.it", description: "kit 工具包", tld: ".it" },
    { title: "un.it", description: "unit 单位", tld: ".it" },
    { title: "ed.it", description: "edit 编辑", tld: ".it" },
    { title: "vis.it", description: "visit 访问", tld: ".it" },
    { title: "cred.it", description: "credit 信用", tld: ".it" },
    { title: "prof.it", description: "profit 利润", tld: ".it" },
    { title: "benef.it", description: "benefit 好处", tld: ".it" },
    { title: "subm.it", description: "submit 提交", tld: ".it" },
    { title: "comm.it", description: "commit 承诺", tld: ".it" },
    { title: "redd.it", description: "reddit 红迪", tld: ".it" },
    { title: "lim.it", description: "limit 限制", tld: ".it" },
    { title: "sp.it", description: "spit 吐", tld: ".it" },
    { title: "qu.it", description: "quit 退出", tld: ".it" },
  ],
  ".us": [
    { title: "foc.us", description: "focus 焦点", tld: ".us" },
    { title: "bon.us", description: "bonus 奖金", tld: ".us" },
    { title: "stat.us", description: "status 状态", tld: ".us" },
    { title: "geni.us", description: "genius 天才", tld: ".us" },
    { title: "vir.us", description: "virus 病毒", tld: ".us" },
    { title: "camp.us", description: "campus 校园", tld: ".us" },
    { title: "pl.us", description: "plus 加", tld: ".us" },
    { title: "min.us", description: "minus 减", tld: ".us" },
    { title: "b.us", description: "bus 公交车", tld: ".us" },
    { title: "circ.us", description: "circus 马戏团", tld: ".us" },
    { title: "cact.us", description: "cactus 仙人掌", tld: ".us" },
    { title: "radi.us", description: "radius 半径", tld: ".us" },
  ],
  ".io": [
    { title: "stud.io", description: "studio 工作室", tld: ".io" },
    { title: "aud.io", description: "audio 音频", tld: ".io" },
    { title: "rad.io", description: "radio 收音机", tld: ".io" },
    { title: "rat.io", description: "ratio 比率", tld: ".io" },
    { title: "pat.io", description: "patio 露台", tld: ".io" },
    { title: "portfol.io", description: "portfolio 作品集", tld: ".io" },
    { title: "scenar.io", description: "scenario 场景", tld: ".io" },
    { title: "b.io", description: "bio 生物", tld: ".io" },
  ],
  ".ai": [
    { title: "dom.ai", description: "domain AI", tld: ".ai" },
    { title: "s.ai", description: "sai 赛", tld: ".ai" },
    { title: "m.ai", description: "mai 迈", tld: ".ai" },
    { title: "p.ai", description: "pay 支付", tld: ".ai" },
    { title: "tr.ai", description: "tray 托盘", tld: ".ai" },
    { title: "th.ai", description: "thai 泰国", tld: ".ai" },
  ],
  ".co": [
    { title: "ta.co", description: "taco 墨西哥卷", tld: ".co" },
    { title: "e.co", description: "eco 生态", tld: ".co" },
    { title: "dis.co", description: "disco 迪斯科", tld: ".co" },
    { title: "mo.co", description: "moco 摩科", tld: ".co" },
    { title: "stu.co", description: "stucco 灰泥", tld: ".co" },
  ],
  ".me": [
    { title: "ga.me", description: "game 游戏", tld: ".me" },
    { title: "na.me", description: "name 名字", tld: ".me" },
    { title: "ho.me", description: "home 家", tld: ".me" },
    { title: "ti.me", description: "time 时间", tld: ".me" },
    { title: "sha.me", description: "shame 羞耻", tld: ".me" },
    { title: "fra.me", description: "frame 框架", tld: ".me" },
    { title: "bla.me", description: "blame 责备", tld: ".me" },
    { title: "fla.me", description: "flame 火焰", tld: ".me" },
    { title: "sche.me", description: "scheme 计划", tld: ".me" },
    { title: "extre.me", description: "extreme 极端", tld: ".me" },
    { title: "costu.me", description: "costume 服装", tld: ".me" },
    { title: "volu.me", description: "volume 音量", tld: ".me" },
    { title: "resu.me", description: "resume 简历", tld: ".me" },
    { title: "assu.me", description: "assume 假设", tld: ".me" },
    { title: "consu.me", description: "consume 消费", tld: ".me" },
    { title: "welco.me", description: "welcome 欢迎", tld: ".me" },
  ],
  ".be": [
    { title: "tu.be", description: "tube 管道", tld: ".be" },
    { title: "cu.be", description: "cube 立方体", tld: ".be" },
    { title: "glo.be", description: "globe 地球", tld: ".be" },
    { title: "pro.be", description: "probe 探针", tld: ".be" },
    { title: "tri.be", description: "tribe 部落", tld: ".be" },
    { title: "scri.be", description: "scribe 抄写员", tld: ".be" },
    { title: "descri.be", description: "describe 描述", tld: ".be" },
  ],
  ".es": [
    { title: "gam.es", description: "games 游戏", tld: ".es" },
    { title: "not.es", description: "notes 笔记", tld: ".es" },
    { title: "vot.es", description: "votes 投票", tld: ".es" },
    { title: "pag.es", description: "pages 页面", tld: ".es" },
    { title: "lin.es", description: "lines 线条", tld: ".es" },
    { title: "ey.es", description: "eyes 眼睛", tld: ".es" },
    { title: "wav.es", description: "waves 波浪", tld: ".es" },
    { title: "shar.es", description: "shares 分享", tld: ".es" },
  ],
  ".or": [
    { title: "auth.or", description: "author 作者", tld: ".or" },
    { title: "edit.or", description: "editor 编辑", tld: ".or" },
    { title: "act.or", description: "actor 演员", tld: ".or" },
    { title: "doct.or", description: "doctor 医生", tld: ".or" },
    { title: "direct.or", description: "director 导演", tld: ".or" },
    { title: "invest.or", description: "investor 投资者", tld: ".or" },
    { title: "creat.or", description: "creator 创造者", tld: ".or" },
    { title: "mot.or", description: "motor 马达", tld: ".or" },
    { title: "sens.or", description: "sensor 传感器", tld: ".or" },
    { title: "mirr.or", description: "mirror 镜子", tld: ".or" },
    { title: "col.or", description: "color 颜色", tld: ".or" },
    { title: "may.or", description: "mayor 市长", tld: ".or" },
    { title: "tut.or", description: "tutor 导师", tld: ".or" },
  ],
};

// 所有可用的后缀列表
const availableTlds = Object.keys(domainPhrases);

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
      { title: "Domainhacks", description: "hacks查询", url: "https://domainhacks.info" },
      { title: "Archive", description: "查询域名的建站历史", url: "https://archive.org" },
      { title: "DomainR", description: "域名注册信息查询", url: "https://domainr.com" },
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
      { title: "park", description: "抢注国别域名比较厉害的注册商", url: "https://park.io" },
      { title: "聚名网", description: "国内知名主流后缀域名抢注商", url: "https://juming.com" },
      { title: "Snapnames", description: "国际知名主流后缀域名抢注商", url: "https://snapnames.com" },
      { title: "Namejet", description: "国际知名主流后缀域名抢注商", url: "https://namejet.com" },
      { title: "Dropcatch", description: "国际知名主流后缀域名抢注商", url: "https://dropcatch.com" },
    ]
  },
  {
    title: "域名资讯平台",
    icon: FileText,
    items: [
      { title: "Dnjournal", description: "域名行业资讯以及交易新闻", url: "https://dnjournal.com" },
      { title: "Domaingang", description: "域名行业资讯以及交易新闻", url: "https://domaingang.com" },
      { title: "Techcrunch", description: "高科技终端融资新闻", url: "https://techcrunch.com" },
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
      { title: "Cloudflare", description: "强大的国外免费CDN和DNS服务", url: "https://cloudflare.com" },
      { title: "HE.NET", description: "美国老牌IDC", url: "https://he.net" },
      { title: "FreeDNS", description: "美国的老牌DNS网站", url: "https://freedns.afraid.org" },
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
      { title: "易名网", description: "国内知名主流后缀域名注册商", url: "https://ename.com" },
      { title: "腾讯云", description: "国内优惠券最多的域名注册商", url: "https://dnspod.cloud.tencent.com" },
      { title: "Godaddy", description: "历史悠久全球知名的域名注册商", url: "https://godaddy.com" },
      { title: "101domain", description: "全世界支持域名后缀最多的注册商", url: "https://101domain.com" },
      { title: "Namesilo", description: "支持支付宝的国外知名域名注册商", url: "https://namesilo.com" },
      { title: "Namecheap", description: "国际知名服务优秀的域名注册商", url: "https://namecheap.com" },
    ]
  },
  {
    title: "域名短语",
    icon: MessageSquare,
    items: [], // 动态填充
    isPhrase: true,
  },
];

export const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<NavSection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTld, setSelectedTld] = useState<string | null>(null);

  // 获取短语板块的所有短语（用于搜索）
  const allPhraseItems = useMemo(() => {
    return Object.values(domainPhrases).flat();
  }, []);

  // 过滤后的导航数据
  const filteredSections = useMemo(() => {
    if (!searchQuery) return navigationData;
    
    const query = searchQuery.toLowerCase();
    return navigationData.filter(section => {
      if (section.isPhrase) {
        // 对于短语板块，搜索所有短语
        return allPhraseItems.some(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return section.title.toLowerCase().includes(query) ||
        section.items.some(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
    });
  }, [searchQuery, allPhraseItems]);

  // 过滤短语（按当前选择的TLD和搜索词）
  const filteredPhrases = useMemo(() => {
    let phrases = selectedTld ? domainPhrases[selectedTld] : allPhraseItems;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      phrases = phrases.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    return phrases;
  }, [selectedTld, searchQuery, allPhraseItems]);

  const handleSectionClick = (section: NavSection) => {
    if (section.isPhrase) {
      setSelectedSection(section);
      setSelectedTld(null);
    } else {
      setSelectedSection(section);
    }
  };

  const handleBack = () => {
    if (selectedSection?.isPhrase && selectedTld) {
      setSelectedTld(null);
    } else {
      setSelectedSection(null);
      setSelectedTld(null);
    }
  };

  return (
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
            {selectedSection 
              ? (selectedSection.isPhrase && selectedTld 
                  ? `短语 (${selectedTld})` 
                  : selectedSection.title)
              : "域名导航"}
          </SheetTitle>
          {selectedSection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
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
              // 主菜单 - 去掉图标
              <div className="grid grid-cols-2 gap-4">
                {filteredSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => handleSectionClick(section)}
                    className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
                  >
                    <span className="text-sm font-semibold text-center">
                      {section.title}
                    </span>
                    {section.isPhrase && (
                      <span className="text-xs text-muted-foreground">
                        {availableTlds.length} 个后缀
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : selectedSection.isPhrase && !selectedTld ? (
              // 短语板块 - 显示后缀列表
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  选择后缀查看域名短语
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableTlds.map((tld) => (
                    <Badge
                      key={tld}
                      variant="outline"
                      className="px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSelectedTld(tld)}
                    >
                      {tld} ({domainPhrases[tld].length})
                    </Badge>
                  ))}
                </div>
                
                {/* 显示搜索结果或全部短语 */}
                {searchQuery && (
                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground mb-3">
                      搜索结果 ({filteredPhrases.length})
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {filteredPhrases.slice(0, 20).map((item, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-xl border bg-card"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">
                              {item.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {item.tld}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : selectedSection.isPhrase && selectedTld ? (
              // 显示特定后缀的短语
              <div className="grid grid-cols-2 gap-3">
                {filteredPhrases.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              // 普通板块详情
              <div className="grid grid-cols-2 gap-3">
                {selectedSection.items
                  .filter(item => 
                    !searchQuery || 
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, index) => (
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
  );
};
