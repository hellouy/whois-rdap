import { Clock, X, Trash2 } from "lucide-react";
import { QueryHistoryItem } from "@/hooks/use-query-history";
import { Badge } from "@/components/ui/badge";

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onSelect: (domain: string, displayDomain: string) => void;
  onRemove: (domain: string) => void;
  onClear: () => void;
}

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

export const QueryHistory = ({ history, onSelect, onRemove, onClear }: QueryHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">最近查询</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          清除
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {history.slice(0, 10).map((item) => (
          <div
            key={item.domain}
            className="group flex items-center gap-1 pl-2.5 sm:pl-3 pr-1 py-1 sm:py-1.5 bg-card/60 backdrop-blur-sm border border-border rounded-lg hover:bg-accent/50 hover:border-border transition-all cursor-pointer"
          >
            <button
              onClick={() => onSelect(item.domain, item.displayDomain)}
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <span className="font-medium text-foreground">{item.displayDomain}</span>
              {item.status && (
                <Badge
                  variant={item.status === "未注册" ? "outline" : item.status === "已注册" ? "default" : "secondary"}
                  className="text-[10px] px-1 py-0 h-4 leading-none"
                >
                  {item.status}
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground hidden sm:inline">{timeAgo(item.timestamp)}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.domain); }}
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
