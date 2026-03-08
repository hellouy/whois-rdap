import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  Sparkles,
  Copy,
  Download,
  ArrowLeft,
  Check,
  Search,
  Zap,
  SortAsc,
  Hash,
  Star,
  Ruler,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";

const SORT_OPTIONS: { value: SortMode; label: string; icon: typeof Star }[] = [
  { value: "score", label: "综合分", icon: Star },
  { value: "creativity", label: "创意度", icon: Sparkles },
  { value: "length", label: "长度", icon: Ruler },
  { value: "alpha", label: "字母", icon: SortAsc },
];

const HackGenerator = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedTlds, setSelectedTlds] = useState<string[]>(POPULAR_TLDS.slice(0, 12));
  const [customTld, setCustomTld] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [includeVariants, setIncludeVariants] = useState(true);
  const [showAllTlds, setShowAllTlds] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!keyword.trim()) return [];
    return sortHacks(generateDomainHacks(keyword, selectedTlds, includeVariants), sortMode);
  }, [keyword, selectedTlds, includeVariants, sortMode]);

  const toggleTld = useCallback((tld: string) => {
    setSelectedTlds((prev) =>
      prev.includes(tld) ? prev.filter((t) => t !== tld) : [...prev, tld]
    );
  }, []);

  const addCustomTld = useCallback(() => {
    let tld = customTld.trim().toLowerCase();
    if (!tld) return;
    if (!tld.startsWith(".")) tld = "." + tld;
    if (tld.length < 2) return;
    if (!selectedTlds.includes(tld)) {
      setSelectedTlds((prev) => [...prev, tld]);
    }
    setCustomTld("");
  }, [customTld, selectedTlds]);

  const copyDomain = useCallback(async (domain: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopiedDomain(domain);
      setTimeout(() => setCopiedDomain(null), 1500);
    } catch {
      // fallback
    }
  }, []);

  const handleExport = useCallback(() => {
    const text = exportHacks(results);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `domain-hacks-${keyword}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results, keyword]);

  const displayTlds = showAllTlds ? PRESET_TLDS : POPULAR_TLDS;

  return (
    <div className="min-h-screen bg-grid-light">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-primary flex items-center gap-2">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8" />
              Domain Hack
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              输入关键词，自动生成创意域名组合
            </p>
          </div>
        </div>

        {/* Input */}
        <Card className="p-3 sm:p-6 mb-4 sm:mb-6 bg-card/60 backdrop-blur-md border border-border shadow-md">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="输入关键词，如：code、hack、smart..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 h-12 sm:h-14 text-sm sm:text-lg border-2 border-foreground bg-transparent focus:ring-0"
              />
            </div>
          </div>

          {/* Variants toggle */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={includeVariants}
                onChange={(e) => setIncludeVariants(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-muted-foreground">词形变体</span>
            </label>
            {keyword && (
              <span className="text-xs text-muted-foreground">
                找到 <strong className="text-foreground">{results.length}</strong> 个创意域名
              </span>
            )}
          </div>

          {/* TLD Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">选择后缀 ({selectedTlds.length})</span>
              <button
                onClick={() => setShowAllTlds(!showAllTlds)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {showAllTlds ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showAllTlds ? `收起 (${PRESET_TLDS.length})` : `更多 (${PRESET_TLDS.length})`}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayTlds.map((tld) => (
                <button
                  key={tld}
                  onClick={() => toggleTld(tld)}
                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                    selectedTlds.includes(tld)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {tld}
                </button>
              ))}
            </div>
            {/* Custom TLD */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="自定义后缀如 .xyz"
                value={customTld}
                onChange={(e) => setCustomTld(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTld()}
                className="h-8 text-xs flex-1 max-w-[200px]"
              />
              <Button size="sm" variant="outline" onClick={addCustomTld} className="h-8 px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {/* Sort & Export toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortMode(opt.value)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                      sortMode === opt.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    <opt.icon className="h-3 w-3" />
                    {opt.label}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-8 text-xs gap-1"
              >
                <Download className="h-3 w-3" />
                导出 ({results.length})
              </Button>
            </div>

            {/* Result list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {results.map((hack, i) => (
                <HackResultCard
                  key={hack.domain}
                  hack={hack}
                  index={i}
                  copied={copiedDomain === hack.domain}
                  onCopy={copyDomain}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {keyword && results.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">没有找到匹配的域名组合</p>
            <p className="text-sm mt-1">试试更换关键词或添加更多后缀</p>
          </div>
        )}
      </div>
    </div>
  );
};

function HackResultCard({
  hack,
  index,
  copied,
  onCopy,
}: {
  hack: HackResult;
  index: number;
  copied: boolean;
  onCopy: (domain: string) => void;
}) {
  // Split domain to highlight TLD part
  const dotIndex = hack.domain.indexOf(".");
  const prefix = hack.domain.substring(0, dotIndex);
  const tldPart = hack.domain.substring(dotIndex);

  return (
    <div
      className="flex items-center gap-3 p-3 sm:p-4 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-sm hover:shadow-md transition-all group animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms`, animationFillMode: "both" }}
    >
      {/* Rank */}
      <span className="text-xs text-muted-foreground font-mono w-5 text-right shrink-0">
        {index + 1}
      </span>

      {/* Domain */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm sm:text-base font-mono">
          <span className="text-foreground">{prefix}</span>
          <span className="text-primary">{tldPart}</span>
        </div>
        <div className="flex items-center gap-1">
          {hack.isExact && (
            <span className="text-[10px] text-muted-foreground">完美匹配</span>
          )}
          {hack.isFromLibrary && !hack.isExact && (
            <span className="text-[10px] text-muted-foreground">词库: {hack.keyword}</span>
          )}
        </div>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant={hack.score >= 70 ? "default" : hack.score >= 50 ? "secondary" : "outline"}
          className="text-[10px] px-1.5 py-0 h-5"
        >
          {hack.score}分
        </Badge>
        <button
          onClick={() => onCopy(hack.domain)}
          className="p-1.5 rounded-md hover:bg-accent transition-colors opacity-50 group-hover:opacity-100"
          title="复制域名"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default HackGenerator;
