import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { normalizeDomain } from "@/utils/tld-servers";

interface QueryInputProps {
  onQuery: (domain: string, displayDomain: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const QueryInput = ({ onQuery, isLoading, placeholder = "输入域名查询..." }: QueryInputProps) => {
  const [domain, setDomain] = useState("");
  const [displayDomain, setDisplayDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      // 标准化域名（支持中文域名转换）
      const normalized = normalizeDomain(domain.trim());
      // 传递标准化域名和原始显示域名
      onQuery(normalized, domain.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayDomain(value);
    setDomain(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4 w-full max-w-3xl mx-auto">
      <div className="relative flex-1">
        <Input
          type="text"
          value={displayDomain}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="h-14 sm:h-16 text-base sm:text-lg pl-4 sm:pl-6 pr-4 sm:pr-6 bg-transparent border-2 border-foreground focus:border-foreground focus:ring-0 transition-all"
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
  );
};
