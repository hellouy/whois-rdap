import { useMemo } from "react";
import { PRESET_TLDS, POPULAR_TLDS } from "@/lib/tld-list";
import { WORD_LIBRARY } from "@/lib/word-library";

interface TldTagCloudProps {
  onSelectTld: (tld: string) => void;
}

/** 计算每个 TLD 的词库数量 */
function getTldWordCount(tld: string): number {
  const clean = tld.replace(/^\./, "").toLowerCase();
  return (WORD_LIBRARY[clean] || []).length;
}

const TldTagCloud = ({ onSelectTld }: TldTagCloudProps) => {
  // 按词库数量排序，有词的排前面
  const tldStats = useMemo(() => {
    const stats = PRESET_TLDS.map((tld) => ({
      tld,
      count: getTldWordCount(tld),
    }));
    // 优先显示 POPULAR_TLDS 中有词的，再显示其他有词的，最后无词的
    const popularSet = new Set(POPULAR_TLDS);
    stats.sort((a, b) => {
      const aPop = popularSet.has(a.tld) ? 1 : 0;
      const bPop = popularSet.has(b.tld) ? 1 : 0;
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      if (bPop !== aPop) return bPop - aPop;
      return b.count - a.count;
    });
    return stats;
  }, []);

  const withWords = tldStats.filter((s) => s.count > 0);
  const withoutWords = tldStats.filter((s) => s.count === 0);

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-1">
          点击后缀开始探索域名短语
        </p>
        <p className="text-xs text-muted-foreground/60">
          共 {PRESET_TLDS.length} 个后缀，其中 {withWords.length} 个有词库支持
        </p>
      </div>

      {/* 有词库的 TLD */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {withWords.map(({ tld, count }) => {
          // 根据词数量调整大小
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
              <span className={`
                font-mono opacity-60
                ${isLarge ? "text-xs" : "text-[10px]"}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 无词库的 TLD（折叠显示） */}
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
