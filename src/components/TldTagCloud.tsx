import { useState, useMemo, lazy, Suspense } from "react";
import { PRESET_TLDS, POPULAR_TLDS, ALL_CCTLDS } from "@/lib/tld-list";
import { TLD_CATEGORIES, HACKABLE_TLDS } from "@/lib/tld-categories";
import { WORD_LIBRARY } from "@/lib/word-library";
import { WORD_LIBRARY_EXTRA } from "@/lib/word-library-extra";
import { WORD_LIBRARY_EXTRA2 } from "@/lib/word-library-extra2";
import { WORD_LIBRARY_EXTRA3 } from "@/lib/word-library-extra3";
import { WORD_LIBRARY_EXTRA4 } from "@/lib/word-library-extra4";
import { WORD_LIBRARY_EXTRA5 } from "@/lib/word-library-extra5";
import { PINYIN_WORD_LIBRARY } from "@/lib/pinyin-library";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TldTagCloudProps {
  onSelectTld: (tld: string) => void;
}

/** 合并所有词库计算词数 */
function getTldWordCount(tld: string): number {
  const clean = tld.replace(/^\./, "").toLowerCase();
  return (
    (WORD_LIBRARY[clean] || []).length +
    (WORD_LIBRARY_EXTRA[clean] || []).length +
    (WORD_LIBRARY_EXTRA2[clean] || []).length +
    (WORD_LIBRARY_EXTRA3[clean] || []).length +
    (WORD_LIBRARY_EXTRA4[clean] || []).length +
    (WORD_LIBRARY_EXTRA5[clean] || []).length +
    (PINYIN_WORD_LIBRARY[clean] || []).length
  );
}

type SortBy = "popular" | "count" | "alpha";

const ccTldSet = new Set(ALL_CCTLDS);
const hackableSet = new Set(HACKABLE_TLDS);

const CATEGORY_KEYS = Object.keys(TLD_CATEGORIES);

const TldTagCloud = ({ onSelectTld }: TldTagCloudProps) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [category, setCategory] = useState("all");

  const tldStats = useMemo(() => {
    return PRESET_TLDS.map((tld) => ({
      tld,
      count: getTldWordCount(tld),
    }));
  }, []);

  const filtered = useMemo(() => {
    let items = tldStats;

    // Category filter
    if (category === "cctld") {
      items = items.filter((s) => ccTldSet.has(s.tld));
    } else if (category === "gtld") {
      items = items.filter((s) => !ccTldSet.has(s.tld));
    } else if (category === "hackable") {
      items = items.filter((s) => hackableSet.has(s.tld));
    } else if (category !== "all") {
      const cat = TLD_CATEGORIES[category];
      if (cat && cat.tlds.length > 0) {
        const catSet = new Set(cat.tlds);
        items = items.filter((s) => catSet.has(s.tld));
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((s) => s.tld.toLowerCase().includes(q));
    }

    const popularSet = new Set(POPULAR_TLDS);
    const sorted = [...items];

    switch (sortBy) {
      case "popular":
        sorted.sort((a, b) => {
          if (a.count > 0 && b.count === 0) return -1;
          if (a.count === 0 && b.count > 0) return 1;
          const aPop = popularSet.has(a.tld) ? 1 : 0;
          const bPop = popularSet.has(b.tld) ? 1 : 0;
          if (bPop !== aPop) return bPop - aPop;
          return b.count - a.count;
        });
        break;
      case "count":
        sorted.sort((a, b) => b.count - a.count);
        break;
      case "alpha":
        sorted.sort((a, b) => a.tld.localeCompare(b.tld));
        break;
    }
    return sorted;
  }, [tldStats, search, sortBy, category]);

  const withWords = filtered.filter((s) => s.count > 0);
  const withoutWords = filtered.filter((s) => s.count === 0);
  const totalWithWords = tldStats.filter((s) => s.count > 0).length;

  const sortOptions: { key: SortBy; label: string }[] = [
    { key: "popular", label: "推荐" },
    { key: "count", label: "词数" },
    { key: "alpha", label: "字母" },
  ];

  // Category tabs
  const categoryTabs = [
    { key: "all", label: "全部", emoji: "🌍" },
    { key: "hackable", label: "可拼", emoji: "⚡" },
    { key: "cctld", label: "国家", emoji: "🏳️" },
    { key: "gtld", label: "通用", emoji: "🔤" },
    { key: "asia", label: "亚洲", emoji: "🌏" },
    { key: "europe", label: "欧洲", emoji: "🇪🇺" },
    { key: "americas", label: "美洲", emoji: "🌎" },
    { key: "africa", label: "非洲", emoji: "🌍" },
    { key: "tech", label: "科技", emoji: "💻" },
    { key: "business", label: "商业", emoji: "💼" },
    { key: "creative", label: "创意", emoji: "🎨" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-center py-3">
        <p className="text-sm text-muted-foreground mb-1">
          点击后缀开始探索域名短语
        </p>
        <p className="text-xs text-muted-foreground/60">
          共 {PRESET_TLDS.length} 个后缀，其中 {totalWithWords} 个有词库支持
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-1 justify-center">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key)}
            className={`px-2 py-1 text-[11px] rounded-full border transition-colors ${
              category === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            <span className="mr-0.5">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Sort controls */}
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="搜索后缀..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-0.5 border border-border rounded-md p-0.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-2 py-1 text-[10px] rounded transition-colors ${
                sortBy === opt.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count summary for current filter */}
      <p className="text-center text-[10px] text-muted-foreground/50">
        当前筛选: {withWords.length} 个有词库 / {filtered.length} 个总计
      </p>

      {/* 有词库的 TLD */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {withWords.map(({ tld, count }) => {
          const isLarge = count >= 100;
          const isMedium = count >= 30;
          return (
            <button
              key={tld}
              onClick={() => onSelectTld(tld)}
              className={`
                inline-flex items-center gap-1 rounded-md border border-border
                hover:bg-primary hover:text-primary-foreground hover:border-primary
                transition-all cursor-pointer
                ${isLarge
                  ? "px-3 py-1.5 text-sm font-medium"
                  : isMedium
                    ? "px-2.5 py-1 text-sm"
                    : "px-2 py-0.5 text-xs"
                }
              `}
            >
              <span>{tld}</span>
              <span className={`font-mono opacity-60 ${isLarge ? "text-xs" : "text-[10px]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 无词库的 TLD */}
      {withoutWords.length > 0 && (
        <details className="text-center">
          <summary className="text-xs text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors">
            其他 {withoutWords.length} 个后缀（暂无词库）
          </summary>
          <div className="flex flex-wrap gap-1 justify-center mt-2">
            {withoutWords.map(({ tld }) => (
              <button
                key={tld}
                onClick={() => onSelectTld(tld)}
                className="px-1.5 py-0.5 text-[10px] text-muted-foreground/40 rounded border border-border/50 hover:bg-accent hover:text-muted-foreground transition-colors"
              >
                {tld}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default TldTagCloud;
