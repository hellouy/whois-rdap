import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { normalizeDomain } from "@/utils/tld-servers";

interface QueryInputProps {
  onQuery: (domain: string, displayDomain: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  value?: string;
  compact?: boolean;
}

// Strip URL cruft from a raw input string
function cleanRawInput(raw: string): string {
  return raw
    .replace(/^https?:\/\//i, "")
    .replace(/^\/\//, "")
    .replace(/^ftp:\/\//i, "")
    .replace(/^mailto:/i, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\s+/g, ""); // remove ALL whitespace (including mid-string spaces)
}

// Validate a cleaned domain string
function validateDomain(cleaned: string): { valid: boolean; error?: string; hint?: string } {
  if (!cleaned) return { valid: false };

  // IP address
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(cleaned)) {
    return { valid: false, error: "请输入域名，不支持 IP 地址查询", hint: "示例：example.com" };
  }

  // IPv6
  if (/^[\da-fA-F:]+$/.test(cleaned) && cleaned.includes(":")) {
    return { valid: false, error: "请输入域名，不支持 IPv6 地址查询", hint: "示例：example.com" };
  }

  // Email
  if (cleaned.includes("@")) {
    return {
      valid: false,
      error: "请输入域名，不是邮箱地址",
      hint: `试试：${cleaned.split("@")[1] || "example.com"}`,
    };
  }

  // Illegal characters
  if (/[!@#$%^&*()+=\[\]{};':"\\|,<>/?`~]/.test(cleaned)) {
    return { valid: false, error: "域名包含非法字符", hint: "域名只能包含字母、数字、连字符和点" };
  }

  // Must have at least one dot (i.e. includes a TLD)
  const parts = cleaned.split(".");
  if (parts.length < 2) {
    if (/[\u4e00-\u9fff]/.test(cleaned))
      return { valid: false, error: "请输入完整域名", hint: `试试：${cleaned}.com 或 ${cleaned}.cn` };
    if (/^[a-zA-Z]+$/.test(cleaned))
      return { valid: false, error: "请输入完整域名，需要包含后缀", hint: `试试：${cleaned}.com 或 ${cleaned}.cn` };
    return { valid: false, error: "域名格式不完整，需要包含后缀", hint: "示例：example.com" };
  }

  // TLD checks
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2) {
    return { valid: false, error: "域名后缀不完整，至少需要 2 个字符", hint: "示例：example.com" };
  }
  // TLD must be alphabetic (or IDN punycode)
  if (!/^[a-zA-Z\u4e00-\u9fff\u00c0-\u024f]+$/.test(tld) && !tld.startsWith("xn--")) {
    return { valid: false, error: "域名后缀格式无效", hint: "示例：.com .cn .io .ai" };
  }

  // Label checks
  for (const part of parts) {
    if (!part) return { valid: false, error: "域名格式有误，包含连续的点" };
    if (part.length > 63) return { valid: false, error: "域名标签过长（最多 63 个字符）" };
    if (/^-|-$/.test(part) && !part.startsWith("xn--"))
      return { valid: false, error: "域名标签不能以连字符开头或结尾" };
  }

  if (cleaned.length > 253) return { valid: false, error: "域名总长度超出限制（最多 253 个字符）" };

  return { valid: true };
}

export const QueryInput = ({
  onQuery,
  isLoading,
  placeholder = "输入域名查询...",
  value,
  compact = false,
}: QueryInputProps) => {
  const [inputVal, setInputVal] = useState(value || "");
  const [validationError, setValidationError] = useState<{ error: string; hint?: string } | null>(null);

  // Sync external value (e.g. from URL params)
  useEffect(() => {
    if (value !== undefined && value !== inputVal) {
      setInputVal(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Auto-clean as user types: strip protocol and spaces
    const cleaned = cleanRawInput(raw);
    setInputVal(cleaned);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanRawInput(inputVal.trim());
    if (!cleaned) return;

    // Update display with cleaned value
    setInputVal(cleaned);

    const validation = validateDomain(cleaned);
    if (!validation.valid) {
      if (validation.error) {
        setValidationError({ error: validation.error, hint: validation.hint });
      }
      return;
    }

    setValidationError(null);
    const normalized = normalizeDomain(cleaned);
    onQuery(normalized, cleaned);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 w-full">
        <div className="relative flex-1">
          <Input
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`
              ${compact
                ? "h-10 sm:h-11 text-sm pl-3 pr-3 border"
                : "h-12 sm:h-14 md:h-16 text-base md:text-lg pl-3 sm:pl-6 pr-3 sm:pr-6 border-2"}
              bg-transparent
              ${validationError ? "border-destructive focus:border-destructive" : "border-foreground focus:border-foreground"}
              focus:ring-0 transition-all
            `}
            disabled={isLoading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className={`
            ${compact ? "h-10 sm:h-11 px-4" : "h-12 sm:h-14 md:h-16 px-4 sm:px-10"}
            bg-foreground hover:bg-foreground/90 text-background font-semibold transition-all shrink-0
          `}
        >
          <Search className={compact ? "h-4 w-4" : "h-5 w-5 sm:mr-2"} />
          {!compact && <span className="hidden sm:inline">查询</span>}
        </Button>
      </form>
      {validationError && (
        <div className="mt-2 flex items-start gap-2 text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{validationError.error}</p>
            {validationError.hint && (
              <p className="text-xs text-muted-foreground mt-0.5">{validationError.hint}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
