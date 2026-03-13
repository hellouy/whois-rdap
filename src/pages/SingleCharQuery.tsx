import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, RotateCcw, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_CCTLDS, NEW_GTLDS } from "@/lib/tld-list";

// ── Types ────────────────────────────────────────────────────────────────────

type Status = "idle" | "checking" | "available" | "registered" | "unknown";
type Mode = "suffix-to-prefix" | "prefix-to-suffix";

interface DomainResult {
  domain: string;
  prefix: string;
  tld: string;
  status: Status;
}

// ── Constants ────────────────────────────────────────────────────────────────

const CHARS_09 = ["0","1","2","3","4","5","6","7","8","9"];
const CHARS_AZ = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const ALL_CHARS = [...CHARS_09, ...CHARS_AZ];

const GTLD_SET = new Set(NEW_GTLDS);
const CCTLD_SET = new Set(ALL_CCTLDS);

// ccTLDs that commonly support single-char + are worth checking
const COMMON_CCTLDS = ALL_CCTLDS.filter(t => t.length === 3); // 2-char like .ng, .io
const COMMON_GTLDS = NEW_GTLDS.filter(t => t.length <= 5); // .io, .com, .dev etc

const BATCH_SIZE = 20;
const BATCH_DELAY = 200;

// ── Batch availability check ─────────────────────────────────────────────────

async function batchCheck(domains: string[], signal: AbortSignal): Promise<Record<string, boolean | null>> {
  const results: Record<string, boolean | null> = {};
  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    if (signal.aborted) break;
    const batch = domains.slice(i, i + BATCH_SIZE);
    try {
      const resp = await fetch(`/api/whois?mode=dns-batch&domains=${batch.join(",")}`, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: "application/json" },
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.results) {
          for (const [d, v] of Object.entries(data.results)) {
            results[d] = v as boolean | null;
          }
        }
      }
    } catch {
      for (const d of batch) results[d] = null;
    }
    if (i + BATCH_SIZE < domains.length && !signal.aborted) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY));
    }
  }
  return results;
}

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  if (status === "idle" || status === "checking") {
    return (
      <span className="inline-block h-2 w-2 rounded-full bg-muted animate-pulse" />
    );
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

// ── Main component ────────────────────────────────────────────────────────────

const SingleCharQuery = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("suffix-to-prefix");

  // Mode 1 state
  const [suffixInput, setSuffixInput] = useState("");
  const [s2pResults, setS2pResults] = useState<DomainResult[]>([]);
  const [s2pRunning, setS2pRunning] = useState(false);

  // Mode 2 state
  const [prefixInput, setPrefixInput] = useState("");
  const [useCcTld, setUseCcTld] = useState(true);
  const [useGTld, setUseGTld] = useState(false);
  const [p2sResults, setP2sResults] = useState<DomainResult[]>([]);
  const [p2sRunning, setP2sRunning] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  // ── Mode 1: suffix → single-char prefixes ───────────────────────────────

  const runSuffixToPrefix = useCallback(async () => {
    const tld = suffixInput.trim().toLowerCase();
    if (!tld) return;
    const normalizedTld = tld.startsWith(".") ? tld : `.${tld}`;

    abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const initial: DomainResult[] = ALL_CHARS.map((c) => ({
      domain: `${c}${normalizedTld}`,
      prefix: c,
      tld: normalizedTld,
      status: "checking",
    }));
    setS2pResults(initial);
    setS2pRunning(true);

    const domains = initial.map((r) => r.domain);
    const raw = await batchCheck(domains, ctrl.signal);

    if (!ctrl.signal.aborted) {
      setS2pResults(
        initial.map((r) => ({
          ...r,
          status:
            raw[r.domain] === true
              ? "registered"
              : raw[r.domain] === false
              ? "available"
              : "unknown",
        }))
      );
      setS2pRunning(false);
    }
  }, [suffixInput, abort]);

  // ── Mode 2: prefix → all matching TLDs ─────────────────────────────────

  const runPrefixToSuffix = useCallback(async () => {
    const prefix = prefixInput.trim().toLowerCase();
    if (!prefix) return;
    if (!useCcTld && !useGTld) return;

    abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let tlds: string[] = [];
    if (useCcTld) tlds = [...tlds, ...ALL_CCTLDS];
    if (useGTld) tlds = [...tlds, ...NEW_GTLDS.filter(t => !CCTLD_SET.has(t))];
    // deduplicate
    tlds = [...new Set(tlds)];

    const initial: DomainResult[] = tlds.map((tld) => ({
      domain: `${prefix}${tld}`,
      prefix,
      tld,
      status: "checking",
    }));
    setP2sResults(initial);
    setP2sRunning(true);

    const domains = initial.map((r) => r.domain);
    const raw = await batchCheck(domains, ctrl.signal);

    if (!ctrl.signal.aborted) {
      setP2sResults(
        initial.map((r) => ({
          ...r,
          status:
            raw[r.domain] === true
              ? "registered"
              : raw[r.domain] === false
              ? "available"
              : "unknown",
        }))
      );
      setP2sRunning(false);
    }
  }, [prefixInput, useCcTld, useGTld, abort]);

  const resetS2p = useCallback(() => {
    abort();
    setS2pResults([]);
    setS2pRunning(false);
  }, [abort]);

  const resetP2s = useCallback(() => {
    abort();
    setP2sResults([]);
    setP2sRunning(false);
  }, [abort]);

  // ── Derived stats ───────────────────────────────────────────────────────

  const s2pAvailable = s2pResults.filter((r) => r.status === "available").length;
  const p2sAvailable = p2sResults.filter((r) => r.status === "available").length;

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Search className="h-6 w-6" />
              批量查询
            </h1>
          </div>
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
            后缀 → 前缀
          </button>
          <button
            onClick={() => { setMode("prefix-to-suffix"); abort(); }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "prefix-to-suffix"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            前缀 → 后缀
          </button>
        </div>

        {/* ── Mode 1 ── */}
        {mode === "suffix-to-prefix" && (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              输入一个后缀，自动查询 0–9 和 a–z 共 36 个单字符前缀的注册状态
            </p>

            {/* Input */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">.</span>
                <Input
                  placeholder="ng"
                  value={suffixInput.startsWith(".") ? suffixInput.slice(1) : suffixInput}
                  onChange={(e) => setSuffixInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSuffixToPrefix()}
                  className="pl-6 h-11 font-mono text-sm"
                />
              </div>
              {s2pResults.length > 0 ? (
                <Button variant="outline" size="icon" onClick={resetS2p} className="h-11 w-11 shrink-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              ) : null}
              <Button
                onClick={runSuffixToPrefix}
                disabled={s2pRunning || !suffixInput.trim()}
                className="h-11 px-5 shrink-0"
              >
                {s2pRunning ? "查询中…" : "查询"}
              </Button>
            </div>

            {/* Stats */}
            {s2pResults.length > 0 && !s2pRunning && (
              <p className="text-xs text-muted-foreground mb-3">
                共 {s2pResults.length} 个域名，
                <span className="text-primary font-medium"> {s2pAvailable} 个可注册</span>
              </p>
            )}

            {/* Results grid */}
            {s2pResults.length > 0 && (
              <>
                {/* 0-9 */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">0–9</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {s2pResults.filter((r) => /^[0-9]/.test(r.prefix)).map((r) => (
                      <ResultCard key={r.domain} result={r} />
                    ))}
                  </div>
                </div>

                {/* a-z */}
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">a–z</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {s2pResults.filter((r) => /^[a-z]/.test(r.prefix)).map((r) => (
                      <ResultCard key={r.domain} result={r} />
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

            {/* Input */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="前缀，如 a"
                value={prefixInput}
                onChange={(e) => setPrefixInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runPrefixToSuffix()}
                className="flex-1 h-11 font-mono text-sm"
              />
              {p2sResults.length > 0 ? (
                <Button variant="outline" size="icon" onClick={resetP2s} className="h-11 w-11 shrink-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              ) : null}
              <Button
                onClick={runPrefixToSuffix}
                disabled={p2sRunning || !prefixInput.trim() || (!useCcTld && !useGTld)}
                className="h-11 px-5 shrink-0"
              >
                {p2sRunning ? "查询中…" : "查询"}
              </Button>
            </div>

            {/* Type selector */}
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
                <span className="ml-1 text-xs opacity-70">({NEW_GTLDS.filter(t => !CCTLD_SET.has(t)).length})</span>
              </button>
            </div>

            {/* Stats */}
            {p2sResults.length > 0 && !p2sRunning && (
              <p className="text-xs text-muted-foreground mb-3">
                共查询 {p2sResults.length} 个后缀，
                <span className="text-primary font-medium"> {p2sAvailable} 个可注册</span>
              </p>
            )}

            {/* Results list – available first */}
            {p2sResults.length > 0 && (
              <P2sResultList results={p2sResults} running={p2sRunning} />
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
    </div>
  );
};

// ── ResultCard (for mode 1 grid) ────────────────────────────────────────────

function ResultCard({ result }: { result: DomainResult }) {
  const isAvailable = result.status === "available";
  const isChecking = result.status === "checking";

  return (
    <a
      href={isAvailable ? `https://www.porkbun.com/checkout/search?q=${result.domain}` : `/${result.domain}`}
      target={isAvailable ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`flex flex-col items-center justify-center gap-1 rounded-lg border py-2.5 px-1 transition-all text-center cursor-pointer ${
        isAvailable
          ? "border-primary bg-primary/5 hover:bg-primary/10"
          : isChecking
          ? "border-border opacity-60"
          : "border-border hover:bg-accent/50"
      }`}
    >
      <span className={`font-mono text-xs font-bold ${isAvailable ? "text-primary" : "text-foreground"}`}>
        {result.prefix}
        <span className="opacity-60">{result.tld}</span>
      </span>
      <StatusBadge status={result.status} />
    </a>
  );
}

// ── P2sResultList (for mode 2) ──────────────────────────────────────────────

function P2sResultList({ results, running }: { results: DomainResult[]; running: boolean }) {
  const available = results.filter((r) => r.status === "available");
  const checking = results.filter((r) => r.status === "checking");
  const registered = results.filter((r) => r.status === "registered");
  const unknown = results.filter((r) => r.status === "unknown");

  return (
    <div className="space-y-4">
      {available.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
            可注册 ({available.length})
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {available.map((r) => (
              <a
                key={r.domain}
                href={`https://www.porkbun.com/checkout/search?q=${r.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-1 rounded-md border border-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-2 transition-colors"
              >
                <span className="font-mono text-xs font-bold text-primary truncate">
                  {r.domain}
                </span>
                <ExternalLink className="h-2.5 w-2.5 text-primary/50 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {running && checking.length > 0 && (
        <p className="text-xs text-muted-foreground animate-pulse">
          正在查询 {checking.length} 个域名…
        </p>
      )}

      {registered.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            已注册 ({registered.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {registered.map((r) => (
              <a
                key={r.domain}
                href={`/${r.domain}`}
                className="px-2 py-0.5 text-xs font-mono rounded border border-border text-muted-foreground hover:bg-accent transition-colors"
              >
                {r.domain}
              </a>
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
              <span key={r.domain} className="px-2 py-0.5 text-xs font-mono rounded border border-border/50 text-muted-foreground/40">
                {r.domain}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCharQuery;
