import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const funFacts = [
  "你知道吗？全球有超过 3.5 亿个已注册域名。",
  "第一个被注册的域名是 symbolics.com（1985年）。",
  "最短的域名只有 1 个字符，如 x.com、g.cn。",
  "全球最贵的域名 cars.com 售价 8.72 亿美元。",
  ".tk 是全球注册量最大的国别域名后缀。",
  "域名的最大长度是 253 个字符（含点号）。",
  "ICANN 每年管理超过 1500 个顶级域名后缀。",
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fact] = useState(() => funFacts[Math.floor(Math.random() * funFacts.length)]);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    console.error("404 Error:", location.pathname);
    const timer = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(timer);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 text-[20rem] font-bold text-primary select-none">4</div>
        <div className="absolute top-1/4 right-1/4 text-[20rem] font-bold text-primary select-none">4</div>
      </div>
      
      <div className="text-center space-y-6 p-8 relative z-10 max-w-lg">
        <div className="relative inline-block">
          <h1 className={`text-8xl sm:text-9xl font-black tracking-tighter transition-all duration-100 ${glitch ? 'text-destructive translate-x-1 skew-x-2' : 'text-primary'}`}>
            4
            <span className={`inline-block transition-transform duration-300 ${glitch ? '-translate-y-2 text-destructive' : ''}`}>0</span>
            4
          </h1>
        </div>
        
        <div className="space-y-2">
          <p className="text-xl sm:text-2xl font-bold text-foreground">页面走丢了</p>
          <p className="text-sm text-muted-foreground">
            看起来这个页面不存在，或者它正在某个平行宇宙里。
          </p>
        </div>

        {/* 趣味知识 */}
        <div className="p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
          <p className="text-xs text-muted-foreground mb-1">💡 域名冷知识</p>
          <p className="text-sm text-foreground font-medium">{fact}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg"
          >
            返回首页
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            返回上页
          </button>
        </div>

        <p className="text-xs text-muted-foreground/40 font-mono">
          {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
