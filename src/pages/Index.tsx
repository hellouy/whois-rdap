import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryInput } from "@/components/QueryInput";
import { DnsQuery } from "@/components/DnsQuery";
import { WhoisQuery } from "@/components/WhoisQuery";
import { SslCertQuery } from "@/components/SslCertQuery";
import { DnsMap } from "@/components/DnsMap";
import { FloatingNav } from "@/components/FloatingNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabLoading } from "@/hooks/use-tab-loading";
import { Loader2, Check, AlertCircle } from "lucide-react";

// Tab 加载状态指示器组件
const TabIndicator = ({ status }: { status: 'none' | 'loading' | 'loaded' | 'error' }) => {
  if (status === 'none') return null;
  
  if (status === 'loading') {
    return <Loader2 className="h-3 w-3 animate-spin ml-1.5 text-primary" />;
  }
  
  if (status === 'loaded') {
    return <Check className="h-3 w-3 ml-1.5 text-green-500" />;
  }
  
  if (status === 'error') {
    return <AlertCircle className="h-3 w-3 ml-1.5 text-destructive" />;
  }
  
  return null;
};

const Index = ({ initialDomain }: { initialDomain?: string }) => {
  const [domain, setDomain] = useState("");
  const [displayDomain, setDisplayDomain] = useState("");
  const navigate = useNavigate();
  const [isQuerying, setIsQuerying] = useState(false);
  
  const {
    activeTab,
    loadingStates,
    isWhoisComplete,
    reset: resetTabLoading,
    handleTabChange,
    setTabLoaded,
    shouldRenderTab,
    canLoadTab,
    getTabIndicator,
  } = useTabLoading({ preloadDelay: 1000, enablePreload: false });
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);
  const userInteractedRef = useRef(false);

  const handleQuery = async (queryDomain: string, originalDomain: string) => {
    setIsQuerying(true);
    setDomain(queryDomain);
    setDisplayDomain(originalDomain);
    userInteractedRef.current = false;
    
    // 更新 URL 为伪静态路径
    navigate(`/${originalDomain}`, { replace: true });
    
    // 重置 Tab 状态
    resetTabLoading();
    
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

  // 支持 initialDomain 伪静态查询
  useEffect(() => {
    if (initialDomain && !domain) {
      handleQuery(initialDomain, initialDomain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDomain]);

  return (
    <div className="min-h-screen bg-grid-light flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden flex-shrink-0">
        <div className="relative container mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-20">
          <div className="text-center mb-4 sm:mb-6 md:mb-12">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-primary mb-2 sm:mb-6">
              域名查询
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto tracking-wide">
              改版升级中，不保证信息准确性。
            </p>
          </div>

          <QueryInput 
            onQuery={handleQuery} 
            isLoading={isQuerying}
            placeholder="输入域名，如：NIC.RW"
            value={displayDomain}
          />
        </div>
      </div>

      {/* Results Section */}
      {domain && (
        <div ref={resultsRef} className="container mx-auto px-2 sm:px-4 py-4 md:py-12 max-w-full overflow-hidden flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full animate-fade-in" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <TabsList className="grid w-full grid-cols-4 mb-3 sm:mb-4 md:mb-10 bg-card/30 backdrop-blur-md border border-border/50 p-1 sm:p-2 h-auto rounded-xl sm:rounded-2xl shadow-lg sticky top-0 z-10">
              <TabsTrigger 
                value="whois" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-2.5 sm:py-4 font-semibold transition-all duration-300 ease-in-out rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-accent/40 hover:scale-[1.02] flex items-center justify-center"
              >
                Whois
                <TabIndicator status={getTabIndicator('whois')} />
              </TabsTrigger>
              <TabsTrigger 
                value="dns" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-2.5 sm:py-4 font-semibold transition-all duration-300 ease-in-out rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-accent/40 hover:scale-[1.02] flex items-center justify-center"
              >
                DNS
                <TabIndicator status={getTabIndicator('dns')} />
              </TabsTrigger>
              <TabsTrigger 
                value="map" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-2.5 sm:py-4 font-semibold transition-all duration-300 ease-in-out rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-accent/40 hover:scale-[1.02] flex items-center justify-center"
              >
                映射
                <TabIndicator status={getTabIndicator('map')} />
              </TabsTrigger>
              <TabsTrigger 
                value="ssl" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-2.5 sm:py-4 font-semibold transition-all duration-300 ease-in-out rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-accent/40 hover:scale-[1.02] flex items-center justify-center"
              >
                SSL
                <TabIndicator status={getTabIndicator('ssl')} />
              </TabsTrigger>
            </TabsList>

            {/* WHOIS 始终渲染（首次加载） */}
            <TabsContent 
              value="whois" 
              className="mt-0 transition-opacity duration-500 data-[state=inactive]:hidden" 
              forceMount
            >
              <WhoisQuery 
                domain={domain} 
                displayDomain={displayDomain} 
                onLoadComplete={() => setTabLoaded('whois', 'loaded')}
              />
            </TabsContent>

            {/* DNS - Whois完成后才渲染 */}
            {shouldRenderTab("dns") && canLoadTab("dns") ? (
              <TabsContent 
                value="dns" 
                className="mt-0 transition-opacity duration-500 data-[state=inactive]:hidden"
                forceMount
              >
                <DnsQuery 
                  domain={domain} 
                  displayDomain={displayDomain} 
                  onLoadComplete={() => setTabLoaded('dns', 'loaded')}
                />
              </TabsContent>
            ) : (
              <TabsContent value="dns" className="mt-0" />
            )}

            {/* 映射 - Whois完成后才渲染 */}
            {shouldRenderTab("map") && canLoadTab("map") ? (
              <TabsContent 
                value="map" 
                className="mt-0 transition-opacity duration-500 data-[state=inactive]:hidden"
                forceMount
              >
                <DnsMap 
                  domain={domain} 
                  displayDomain={displayDomain}
                  onLoadComplete={() => setTabLoaded('map', 'loaded')}
                />
              </TabsContent>
            ) : (
              <TabsContent value="map" className="mt-0" />
            )}

            {/* SSL - Whois完成后才渲染 */}
            {shouldRenderTab("ssl") && canLoadTab("ssl") ? (
              <TabsContent 
                value="ssl" 
                className="mt-0 transition-opacity duration-500 data-[state=inactive]:hidden"
                forceMount
              >
                <SslCertQuery 
                  domain={domain} 
                  displayDomain={displayDomain}
                  onLoadComplete={() => setTabLoaded('ssl', 'loaded')}
                />
              </TabsContent>
            ) : (
              <TabsContent value="ssl" className="mt-0" />
            )}
          </Tabs>
        </div>
      )}

      {/* Spacer to push footer down when no results */}
      {!domain && <div className="flex-1" />}

      {/* Fixed Footer */}
      <footer className="mt-auto py-4 border-t border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground/60">
            © 2026 域名查询工具 · 信息仅供参考
          </p>
        </div>
      </footer>

      {/* Floating Navigation */}
      <FloatingNav />
    </div>
  );
};

export default Index;
