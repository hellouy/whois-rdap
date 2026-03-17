import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, RotateCcw, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ALL_CCTLDS } from "@/lib/tld-list";
import { WhoisQuery } from "@/components/WhoisQuery";
import {
  normalizeSuffix,
  buildS2pDomains,
  buildP2sDomains,
  applyPartialResults,
  batchCheckAvailability,
  GTLDS_ONLY,
  CHARS_09,
  CHARS_AZ,
  type DomainResult,
  type DomainStatus,
} from "@/services/single-char-service";

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DomainStatus }) {
  if (status === "checking") {
    return <span className="inline-block h-2 w-2 rounded-full bg-muted animate-pulse" />;
  }
  if (status === "available") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-medium">
        可注册
      </span>
    );
  }
  if (status === "registered") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
        已注册
      </span>
    );
  }
  return <span className="text-[10px] text-muted-foreground">—</span>;
}

// ── Skeleton card (mode 1 grid) ───────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 px-1">
      <div className="h-3.5 w-12 rounded shimmer" />
      <div className="h-4 w-8 rounded shimmer" />
    </div>
  );
}

// ── Result card (mode 1 grid) ─────────────────────────────────────────────────

function ResultCard({
  result,
  onOpenDetail,
}: {
  result: DomainResult;
  onOpenDetail: (domain: string) => void;
}) {
  const isAvailable = result.status === "available";
  const isChecking = result.status === "checking";

  if (isChecking) return <SkeletonCard />;

  if (isAvailable) {
    return (
      <button
        onClick={() => onOpenDetail(result.domain)}
        className="flex flex-col items-center justify-center gap-1 rounded-lg border border-primary bg-primary/5 hover:bg-primary/10 py-2.5 px-1 transition-all text-center cursor-pointer w-full"
      >
        <span className="font-mono text-xs font-bold leading-tight text-primary">
          {result.prefix}
          <span className="opacity-60">{result.tld}</span>
        </span>
        <StatusBadge status={result.status} />
      </button>
    );
  }

  return (
    <button
      onClick={() => onOpenDetail(result.domain)}
      className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border hover:bg-accent/50 py-2.5 px-1 transition-all text-center cursor-pointer w-full"
    >
      <span className="font-mono text-xs font-bold leading-tight text-foreground">
        {result.prefix}
        <span className="opacity-60">{result.tld}</span>
      </span>
      <StatusBadge status={result.status} />
    </button>
  );
}

// ── Skeleton row list (mode 2) ────────────────────────────────────────────────

function SkeletonList({ count }: { count: number }) {
  return (
    <div className="space-y-4">
      <div className="h-4 w-24 rounded shimmer" />
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
          <div key={i} className="h-9 rounded-md border border-border shimmer" />
        ))}
      </div>
      <div className="h-3 w-32 rounded shimmer mt-2" />
      <div className="flex flex-wrap gap-1 mt-1">
        {Array.from({ length: Math.min(count, 20) }).map((_, i) => (
          <div key={i} className="h-5 w-16 rounded border border-border shimmer" />
        ))}
      </div>
    </div>
  );
}

// ── P2s result list (mode 2) ──────────────────────────────────────────────────

function P2sResultList({
  results,
  running,
  onOpenDetail,
}: {
  results: DomainResult[];
  running: boolean;
  onOpenDetail: (domain: string) => void;
}) {
  const available = results.filter((r) => r.status === "available");
  const checking = results.filter((r) => r.status === "checking");
  const registered = results.filter((r) => r.status === "registered");
  const unknown = results.filter((r) => r.status === "unknown");

  if (running && available.length === 0 && registered.length === 0) {
    return <SkeletonList count={results.length} />;
  }

  return (
    <div className="space-y-4">
      {available.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
            可注册 ({available.length})
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {available.map((r) => (
              <button
                key={r.domain}
                onClick={() => onOpenDetail(r.domain)}
                className="flex items-center justify-between gap-1 rounded-md border border-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-2 transition-colors w-full text-left"
              >
                <span className="font-mono text-xs font-bold text-primary truncate">
                  {r.domain}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {running && checking.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
          <p className="text-xs text-muted-foreground">
            正在查询剩余 {checking.length} 个域名…
          </p>
        </div>
      )}

      {registered.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            已注册 ({registered.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {registered.map((r) => (
              <button
                key={r.domain}
                onClick={() => onOpenDetail(r.domain)}
                className="px-2 py-0.5 text-xs font-mono rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {r.domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {unknown.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-2">
            未知 ({unknown.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {unknown.map((r) => (
              <button
                key={r.domain}
                onClick={() => onOpenDetail(r.domain)}
                className="px-2 py-0.5 text-xs font-mono rounded border border-border/50 text-muted-foreground/40 hover:border-border hover:text-muted-foreground transition-colors"
              >
                {r.domain}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Domain detail modal ───────────────────────────────────────────────────────

function DomainDetailModal({
  domain,
  onClose,
}: {
  domain: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!domain} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-border sticky top-0 bg-background z-10">
          <span className="font-mono font-bold text-sm text-foreground">{domain}</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3 sm:p-4">
          {domain && <WhoisQuery domain={domain} showPrice={false} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const SingleCharQuery = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"suffix-to-prefix" | "prefix-to-suffix">("suffix-to-prefix");

  const [detailDomain, setDetailDomain] = useState<string | null>(null);

  // Mode 1 state
  const [suffixInput, setSuffixInput] = useState("");
  const [suffixError, setSuffixError] = useState<string | null>(null);
  const [s2pResults, setS2pResults] = useState<DomainResult[]>([]);
  const [s2pRunning, setS2pRunning] = useState(false);

  // Mode 2 state
  const [prefixInput, setPrefixInput] = useState("");
  const [useCcTld, setUseCcTld] = useState(true);
  const [useGTld, setUseGTld] = useState(false);
  const [p2sResults, setP2sResults] = useState<DomainResult[]>([]);
  const [p2sRunning, setP2sRunning] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => { abortRef.current?.abort(); }, []);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  // ── Mode 1: suffix → single-char prefixes ──────────────────────────────────

  const runSuffixToPrefix = useCallback(async () => {
    const { tld, error } = normalizeSuffix(suffixInput);
    if (!tld) { setSuffixError("请输入后缀"); return; }
    setSuffixError(error);

    abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const initial = buildS2pDomains(tld);
    setS2pResults(initial);
    setS2pRunning(true);

    await batchCheckAvailability(
      initial.map((r) => r.domain),
      ctrl.signal,
      (partial) => setS2pResults((prev) => applyPartialResults(prev, partial))
    );

    if (!ctrl.signal.aborted) setS2pRunning(false);
  }, [suffixInput, abort]);

  // ── Mode 2: prefix → all matching TLDs ────────────────────────────────────

  const runPrefixToSuffix = useCallback(async () => {
    const prefix = prefixInput.trim().toLowerCase();
    if (!prefix || (!useCcTld && !useGTld)) return;

    abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const initial = buildP2sDomains(prefix, useCcTld, useGTld);
    setP2sResults(initial);
    setP2sRunning(true);

    await batchCheckAvailability(
      initial.map((r) => r.domain),
      ctrl.signal,
      (partial) => setP2sResults((prev) => applyPartialResults(prev, partial))
    );

    if (!ctrl.signal.aborted) setP2sRunning(false);
  }, [prefixInput, useCcTld, useGTld, abort]);

  const resetS2p = useCallback(() => {
    abort();
    setS2pResults([]);
    setS2pRunning(false);
    setSuffixInput("");
    setSuffixError(null);
  }, [abort]);

  const resetP2s = useCallback(() => {
    abort();
    setP2sResults([]);
    setP2sRunning(false);
    setPrefixInput("");
  }, [abort]);

  const s2pAvailable = s2pResults.filter((r) => r.status === "available").length;
  const s2pChecking = s2pResults.filter((r) => r.status === "checking").length;
  const p2sAvailable = p2sResults.filter((r) => r.status === "available").length;

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Search className="h-6 w-6" />
            批量查询
          </h1>
        </div>

        {/* Mode tabs */}
        <div className="flex border border-border rounded-lg overflow-hidden mb-6">
          <button
            onClick={() => { setMode("suffix-to-prefix"); abort(); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "suffix-to-prefix"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            单字符查询
          </button>
          <button
            onClick={() => { setMode("prefix-to-suffix"); abort(); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "prefix-to-suffix"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            可用后缀查询
          </button>
        </div>

        {/* ── Mode 1 ── */}
        {mode === "suffix-to-prefix" && (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              输入一个后缀，自动查询 0–9 和 a–z 共 36 个单字符前缀的注册状态
            </p>

            <div className="flex gap-2 mb-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono pointer-events-none select-none">.</span>
                <Input
                  placeholder="ng"
                  value={suffixInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^\.+/, "").replace(/[^a-zA-Z0-9-]/g, "");
                    setSuffixInput(val);
                    if (suffixError) setSuffixError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && runSuffixToPrefix()}
                  className="pl-6 h-11 font-mono"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </div>
              {s2pResults.length > 0 && (
                <Button variant="outline" size="icon" onClick={resetS2p} className="h-11 w-11 shrink-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={runSuffixToPrefix}
                disabled={s2pRunning || !suffixInput.trim()}
                className="h-11 px-5 shrink-0"
              >
                {s2pRunning ? "查询中…" : "查询"}
              </Button>
            </div>

            {suffixError && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs mt-1.5 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{suffixError}</span>
              </div>
            )}

            {s2pResults.length > 0 && (
              <p className="text-xs text-muted-foreground mb-3 mt-2">
                共 {s2pResults.length} 个域名
                {s2pRunning
                  ? <span className="animate-pulse">，正在查询 {s2pChecking} 个…</span>
                  : <span>，<span className="text-primary font-medium">{s2pAvailable} 个可注册</span></span>
                }
              </p>
            )}

            {s2pResults.length > 0 && (
              <>
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">0–9</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {s2pResults.filter((r) => CHARS_09.includes(r.prefix as typeof CHARS_09[number])).map((r) => (
                      <ResultCard key={r.domain} result={r} onOpenDetail={setDetailDomain} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">A–Z</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {s2pResults.filter((r) => CHARS_AZ.includes(r.prefix as typeof CHARS_AZ[number])).map((r) => (
                      <ResultCard key={r.domain} result={r} onOpenDetail={setDetailDomain} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {s2pResults.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">输入后缀开始查询</p>
                <p className="text-xs mt-1 opacity-60">例如 ng、io、ai、co</p>
              </div>
            )}
          </div>
        )}

        {/* ── Mode 2 ── */}
        {mode === "prefix-to-suffix" && (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              输入一个前缀，选择后缀类型，查询所有对应域名的注册状态
            </p>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder="前缀，如 a"
                value={prefixInput}
                onChange={(e) => setPrefixInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runPrefixToSuffix()}
                className="h-11"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
              />
              {p2sResults.length > 0 && (
                <Button variant="outline" size="icon" onClick={resetP2s} className="h-11 w-11 shrink-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={runPrefixToSuffix}
                disabled={p2sRunning || !prefixInput.trim() || (!useCcTld && !useGTld)}
                className="h-11 px-5 shrink-0"
              >
                {p2sRunning ? "查询中…" : "查询"}
              </Button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUseCcTld(!useCcTld)}
                className={`flex-1 py-2 text-sm rounded-md border transition-colors ${
                  useCcTld
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                ccTLD
                <span className="ml-1 text-xs opacity-70">({ALL_CCTLDS.length})</span>
              </button>
              <button
                onClick={() => setUseGTld(!useGTld)}
                className={`flex-1 py-2 text-sm rounded-md border transition-colors ${
                  useGTld
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                gTLD
                <span className="ml-1 text-xs opacity-70">({GTLDS_ONLY.length})</span>
              </button>
            </div>

            {p2sResults.length > 0 && !p2sRunning && (
              <p className="text-xs text-muted-foreground mb-3">
                共查询 {p2sResults.length} 个后缀，
                <span className="text-primary font-medium">{p2sAvailable} 个可注册</span>
              </p>
            )}

            {p2sResults.length > 0 && (
              <P2sResultList
                results={p2sResults}
                running={p2sRunning}
                onOpenDetail={setDetailDomain}
              />
            )}

            {p2sResults.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">输入前缀并选择后缀类型</p>
                <p className="text-xs mt-1 opacity-60">可同时选择 ccTLD 和 gTLD</p>
              </div>
            )}
          </div>
        )}
      </div>

      <DomainDetailModal
        domain={detailDomain}
        onClose={() => setDetailDomain(null)}
      />
    </div>
  );
};

export default SingleCharQuery;
