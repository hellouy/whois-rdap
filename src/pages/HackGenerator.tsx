import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDomainAvailability } from "@/hooks/use-domain-availability";
import {
  generateDomainHacks,
  sortHacks,
  exportHacks,
  POPULAR_TLDS,
  PRESET_TLDS,
  type HackResult,
  type SortMode,
} from "@/lib/domain-hack";
import {
  ArrowLeft,
  Copy,
  Check,
  Search,
  Zap,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ArrowUpDown,
  Download,
} from "lucide-react";

const PAGE_SIZES = [20, 50, 100];

const HackGenerator = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedTld, setSelectedTld] = useState<string>("");
  const [tldDropdownOpen, setTldDropdownOpen] = useState(false);
  const [tldSearch, setTldSearch] = useState("");
  const [prefixLengthEnabled, setPrefixLengthEnabled] = useState(false);
  const [prefixMaxLength, setPrefixMaxLength] = useState(5);
  const [modeStartsWith, setModeStartsWith] = useState(false);
  const [modeEndsWith, setModeEndsWith] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [copiedAll, setCopiedAll] = useState(false);
  const { availability, isChecking, checkDomains, reset: resetAvailability } = useDomainAvailability();

  // Auto-check availability for visible (paginated) results
  useEffect(() => {
    if (paginatedResults.length > 0) {
      const domains = paginatedResults.map(r => r.domain);
      checkDomains(domains);
    }
  }, [paginatedResults, checkDomains]);

  // Determine which TLDs to search
  const activeTlds = useMemo(() => {
    if (selectedTld) return [selectedTld];
    return PRESET_TLDS;
  }, [selectedTld]);

  // Generate and filter results
  const allResults = useMemo(() => {
    if (!keyword.trim()) return [];
    let results = sortHacks(generateDomainHacks(keyword, activeTlds, true), sortMode);
    if (!sortAsc && sortMode !== "alpha" && sortMode !== "length") {
      // default descending for score/creativity
    } else if (sortAsc) {
      results = [...results].reverse();
    }

    // Apply prefix length filter
    if (prefixLengthEnabled) {
      results = results.filter((r) => r.prefix.length <= prefixMaxLength);
    }

    // Apply mode filters
    if (modeStartsWith) {
      const kw = keyword.trim().toLowerCase();
      results = results.filter((r) => r.prefix.toLowerCase().startsWith(kw));
    }
    if (modeEndsWith) {
      const kw = keyword.trim().toLowerCase();
      results = results.filter((r) => {
        const full = (r.prefix + r.tld.replace(/^\./, "")).toLowerCase();
        return full.endsWith(kw);
      });
    }

    return results;
  }, [keyword, activeTlds, sortMode, sortAsc, prefixLengthEnabled, prefixMaxLength, modeStartsWith, modeEndsWith]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(allResults.length / pageSize));
  const safePageNum = Math.min(page, totalPages);
  const paginatedResults = useMemo(() => {
    const start = (safePageNum - 1) * pageSize;
    return allResults.slice(start, start + pageSize);
  }, [allResults, safePageNum, pageSize]);

  // Reset page on filter change
  const resetPage = useCallback(() => setPage(1), []);

  const copyAll = useCallback(async () => {
    const text = allResults.map((r) => r.domain).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {}
  }, [allResults]);

  // Filtered TLD list for dropdown
  const filteredTlds = useMemo(() => {
    if (!tldSearch.trim()) return PRESET_TLDS;
    const q = tldSearch.trim().toLowerCase();
    return PRESET_TLDS.filter((t) => t.toLowerCase().includes(q));
  }, [tldSearch]);

  const handleExport = useCallback(() => {
    const text = exportHacks(allResults);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `domain-hacks-${keyword}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [allResults, keyword]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-6 w-6" />
              域名短语
            </h1>
          </div>
        </div>

        {/* Search bar: keyword + TLD dropdown */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="请输入关键词"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); resetPage(); }}
              className="pl-10 h-11 text-sm border border-border bg-background"
            />
          </div>
          {/* TLD dropdown */}
          <div className="relative">
            <button
              onClick={() => setTldDropdownOpen(!tldDropdownOpen)}
              className="h-11 px-3 border border-border rounded-md flex items-center gap-2 text-sm min-w-[120px] bg-background hover:bg-accent transition-colors"
            >
              <span className={selectedTld ? "text-foreground" : "text-muted-foreground"}>
                {selectedTld || "选择后缀"}
              </span>
              {tldDropdownOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </button>
            {tldDropdownOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-border">
                  <Input
                    placeholder="搜索后缀..."
                    value={tldSearch}
                    onChange={(e) => setTldSearch(e.target.value)}
                    className="h-8 text-xs"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1">
                  <button
                    onClick={() => { setSelectedTld(""); setTldDropdownOpen(false); setTldSearch(""); resetPage(); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${!selectedTld ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    全部后缀
                  </button>
                  {filteredTlds.map((tld) => (
                    <button
                      key={tld}
                      onClick={() => { setSelectedTld(tld); setTldDropdownOpen(false); setTldSearch(""); resetPage(); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${selectedTld === tld ? "text-primary font-medium" : "text-foreground"}`}
                    >
                      {tld}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm">
          {/* Prefix length */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">前缀长度</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={prefixLengthEnabled}
                onChange={(e) => { setPrefixLengthEnabled(e.target.checked); resetPage(); }}
                className="rounded border-border"
              />
              <span className="text-muted-foreground">≤</span>
            </label>
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => { setPrefixMaxLength(Math.max(0, prefixMaxLength - 1)); resetPage(); }}
                className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                disabled={!prefixLengthEnabled}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-foreground font-mono">{prefixMaxLength}</span>
              <button
                onClick={() => { setPrefixMaxLength(prefixMaxLength + 1); resetPage(); }}
                className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                disabled={!prefixLengthEnabled}
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">模式</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={modeStartsWith}
                onChange={(e) => { setModeStartsWith(e.target.checked); resetPage(); }}
                className="rounded border-border"
              />
              <span className="text-muted-foreground">前缀开头</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={modeEndsWith}
                onChange={(e) => { setModeEndsWith(e.target.checked); resetPage(); }}
                className="rounded border-border"
              />
              <span className="text-muted-foreground">前缀结尾</span>
            </label>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            总计 <strong className="text-foreground">{allResults.length}</strong> 条
          </span>
          <div className="flex items-center gap-2">
            {allResults.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleExport} className="h-7 text-xs gap-1">
                  <Download className="h-3 w-3" />
                  导出
                </Button>
                <button
                  onClick={copyAll}
                  className="p-1.5 rounded-md border border-border hover:bg-accent transition-colors"
                  title="复制全部"
                >
                  {copiedAll ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-md overflow-hidden bg-card">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr] border-b border-border bg-muted/50">
            <button
              onClick={() => {
                if (sortMode === "alpha") setSortAsc(!sortAsc);
                else { setSortMode("alpha"); setSortAsc(false); }
                resetPage();
              }}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              单词
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <div className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
              释义
            </div>
          </div>

          {/* Table body */}
          {paginatedResults.length > 0 ? (
            paginatedResults.map((hack) => (
              <HackRow key={hack.domain} hack={hack} />
            ))
          ) : (
            <div className="px-4 py-12 text-center text-muted-foreground text-sm">
              {keyword.trim() ? "没有找到匹配结果，试试更换关键词或后缀" : "请输入关键词开始搜索"}
            </div>
          )}
        </div>

        {/* Pagination */}
        {allResults.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, safePageNum - 1))}
                disabled={safePageNum <= 1}
                className="px-2 py-1 border border-border rounded text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (safePageNum <= 3) p = i + 1;
                else if (safePageNum >= totalPages - 2) p = totalPages - 4 + i;
                else p = safePageNum - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs transition-colors ${
                      p === safePageNum
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, safePageNum + 1))}
                disabled={safePageNum >= totalPages}
                className="px-2 py-1 border border-border rounded text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                ›
              </button>
            </div>
            <div className="flex items-center gap-1">
              {PAGE_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => { setPageSize(s); setPage(1); }}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    pageSize === s
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}条/页
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click-away for dropdown */}
      {tldDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => { setTldDropdownOpen(false); setTldSearch(""); }} />
      )}
    </div>
  );
};

function HackRow({ hack }: { hack: HackResult }) {
  const dotIndex = hack.domain.indexOf(".");
  const prefix = hack.domain.substring(0, dotIndex);
  const tldPart = hack.domain.substring(dotIndex);

  return (
    <Link
      to={`/${hack.domain}`}
      className="grid grid-cols-[1fr_1fr] border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors cursor-pointer"
    >
      <div className="px-4 py-3 font-mono text-sm font-bold">
        <span className="text-foreground">{prefix}</span>
        <span className="text-primary">{tldPart}</span>
      </div>
      <div className="px-4 py-3 text-sm text-muted-foreground truncate">
        {hack.meaning || hack.keyword}
      </div>
    </Link>
  );
}

export default HackGenerator;
