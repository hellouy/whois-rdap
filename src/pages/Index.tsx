import { useState, useRef, useEffect } from "react";
import { QueryInput } from "@/components/QueryInput";
import { DnsQuery } from "@/components/DnsQuery";
import { WhoisQuery } from "@/components/WhoisQuery";
import { SslCertQuery } from "@/components/SslCertQuery";
import { DnsMap } from "@/components/DnsMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Activity } from "lucide-react";

const Index = () => {
  const [domain, setDomain] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);

  const handleQuery = async (queryDomain: string) => {
    setIsQuerying(true);
    setDomain(queryDomain);
    userInteractedRef.current = false;
    
    setTimeout(() => {
      setIsQuerying(false);
      // 开始平滑自动滚动
      if (resultsRef.current) {
        const startTime = Date.now();
        const duration = 2000; // 2秒滚动时间
        const startY = window.scrollY;
        const targetY = resultsRef.current.offsetTop - 20;
        const distance = targetY - startY;

        const smoothScroll = () => {
          if (userInteractedRef.current) {
            if (scrollIntervalRef.current) {
              cancelAnimationFrame(scrollIntervalRef.current);
              scrollIntervalRef.current = null;
            }
            return;
          }

          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // 使用 easeInOutCubic 缓动函数
          const easing = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
          window.scrollTo(0, startY + distance * easing);

          if (progress < 1) {
            scrollIntervalRef.current = requestAnimationFrame(smoothScroll);
          }
        };

        scrollIntervalRef.current = requestAnimationFrame(smoothScroll);
      }
    }, 500);
  };

  useEffect(() => {
    const stopAutoScroll = () => {
      userInteractedRef.current = true;
    };

    // 监听用户交互
    window.addEventListener('wheel', stopAutoScroll);
    window.addEventListener('touchstart', stopAutoScroll);
    window.addEventListener('touchmove', stopAutoScroll);
    window.addEventListener('mousedown', stopAutoScroll);

    return () => {
      window.removeEventListener('wheel', stopAutoScroll);
      window.removeEventListener('touchstart', stopAutoScroll);
      window.removeEventListener('touchmove', stopAutoScroll);
      window.removeEventListener('mousedown', stopAutoScroll);
      if (scrollIntervalRef.current) {
        cancelAnimationFrame(scrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-grid-light">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-5 mb-8">
              <div className="relative flex-shrink-0">
                <Globe className="h-20 w-20 md:h-24 md:w-24 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-primary whitespace-nowrap">
                域名查询
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto tracking-wide leading-relaxed">
              DNS · RDAP+Whois · SSL · 映射
            </p>
          </div>

          <QueryInput 
            onQuery={handleQuery} 
            isLoading={isQuerying}
            placeholder="输入域名，如：ye.ye"
          />
        </div>
      </div>

      {/* Results Section */}
      {domain && (
        <div ref={resultsRef} className="container mx-auto px-4 py-6 md:py-12 max-w-full overflow-hidden">
          <Tabs defaultValue="whois" className="w-full animate-fade-in">
            <TabsList className="grid w-full grid-cols-4 mb-6 md:mb-10 bg-card/30 backdrop-blur-md border border-border/50 p-2 h-auto rounded-2xl shadow-lg">
              <TabsTrigger 
                value="whois" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-4 font-semibold transition-all duration-300 ease-in-out rounded-xl text-sm hover:bg-accent/40 hover:scale-[1.02]"
              >
                Whois
              </TabsTrigger>
              <TabsTrigger 
                value="dns" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-4 font-semibold transition-all duration-300 ease-in-out rounded-xl text-sm hover:bg-accent/40 hover:scale-[1.02]"
              >
                DNS记录
              </TabsTrigger>
              <TabsTrigger 
                value="map" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-4 font-semibold transition-all duration-300 ease-in-out rounded-xl text-sm hover:bg-accent/40 hover:scale-[1.02]"
              >
                DNS映射
              </TabsTrigger>
              <TabsTrigger 
                value="ssl" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-4 font-semibold transition-all duration-300 ease-in-out rounded-xl text-sm hover:bg-accent/40 hover:scale-[1.02]"
              >
                SSL证书
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whois" className="mt-0 transition-opacity duration-500" forceMount>
              <WhoisQuery domain={domain} />
            </TabsContent>

            <TabsContent value="dns" className="mt-0 transition-opacity duration-500" forceMount>
              <DnsQuery domain={domain} />
            </TabsContent>

            <TabsContent value="map" className="mt-0 transition-opacity duration-500" forceMount>
              <DnsMap domain={domain} />
            </TabsContent>

            <TabsContent value="ssl" className="mt-0 transition-opacity duration-500" forceMount>
              <SslCertQuery domain={domain} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground/60">
            信息仅供参考，请勿以此为准。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
