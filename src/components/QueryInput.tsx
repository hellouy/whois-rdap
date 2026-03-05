import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { normalizeDomain } from "@/utils/tld-servers";

interface QueryInputProps {
  onQuery: (domain: string, displayDomain: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

// 域名输入验证
function validateDomainInput(input: string): { valid: boolean; error?: string; hint?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { valid: false };

  // 检查是否是纯数字（IP地址）
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed)) {
    return { valid: false, error: "请输入域名，不支持 IP 地址查询", hint: "示例：example.com" };
  }

  // 检查是否是邮箱
  if (trimmed.includes('@')) {
    return { valid: false, error: "请输入域名，不是邮箱地址", hint: `试试：${trimmed.split('@')[1] || 'example.com'}` };
  }

  // 清理后检查
  let cleaned = trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/^\/\//, '')
    .replace(/^ftp:\/\//i, '')
    .replace(/^mailto:/i, '')
    .split('/')[0].split('?')[0].split('#')[0].split(':')[0]
    .replace(/\.+$/, '').replace(/^\.+/, '')
    .replace(/\s/g, '');

  if (!cleaned) return { valid: false, error: "输入内容无效" };

  // 检查是否包含非法字符（允许中文、字母、数字、连字符、点）
  if (/[!@#$%^&*()+=\[\]{};':"\\|,<>/?`~]/.test(cleaned)) {
    return { valid: false, error: "域名包含非法字符", hint: "域名只能包含字母、数字、连字符和点" };
  }

  // 检查是否只有一个词（没有点）
  const parts = cleaned.split('.');
  if (parts.length < 2) {
    // 检查是否像单个关键词
    if (/^[a-zA-Z\u4e00-\u9fff]+$/.test(cleaned)) {
      return { valid: false, error: "请输入完整域名", hint: `试试：${cleaned}.com 或 ${cleaned}.cn` };
    }
    return { valid: false, error: "域名格式不完整，需要包含后缀", hint: "示例：example.com" };
  }

  // 检查TLD是否有效（至少1个字符）
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 1) {
    return { valid: false, error: "域名后缀不完整" };
  }

  // 检查标签长度
  for (const part of parts) {
    if (!part) {
      return { valid: false, error: "域名格式有误，包含连续的点" };
    }
    if (part.length > 63) {
      return { valid: false, error: "域名标签过长（最多63个字符）" };
    }
    // 允许 xn-- 开头的Punycode，也允许中文
    if (/^-|-$/.test(part) && !part.startsWith('xn--')) {
      return { valid: false, error: "域名标签不能以连字符开头或结尾" };
    }
  }

  // 总长度
  if (cleaned.length > 253) {
    return { valid: false, error: "域名总长度超出限制（最多253个字符）" };
  }

  return { valid: true };
}

export const QueryInput = ({ onQuery, isLoading, placeholder = "输入域名查询..." }: QueryInputProps) => {
  const [domain, setDomain] = useState("");
  const [displayDomain, setDisplayDomain] = useState("");
  const [validationError, setValidationError] = useState<{ error: string; hint?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    const validation = validateDomainInput(domain.trim());
    if (!validation.valid) {
      if (validation.error) {
        setValidationError({ error: validation.error, hint: validation.hint });
      }
      return;
    }

    setValidationError(null);
    const normalized = normalizeDomain(domain.trim());
    onQuery(normalized, domain.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayDomain(value);
    setDomain(value);
    if (validationError) setValidationError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 w-full">
        <div className="relative flex-1">
          <Input
            type="text"
            value={displayDomain}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`h-14 sm:h-16 text-base sm:text-lg pl-4 sm:pl-6 pr-4 sm:pr-6 bg-transparent border-2 ${validationError ? 'border-destructive focus:border-destructive' : 'border-foreground focus:border-foreground'} focus:ring-0 transition-all`}
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="h-14 sm:h-16 px-6 sm:px-10 bg-foreground hover:bg-foreground/90 text-background font-semibold transition-all shrink-0"
        >
          <Search className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">查询</span>
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
