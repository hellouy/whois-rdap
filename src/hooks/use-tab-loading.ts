import { useState, useCallback, useEffect, useRef } from 'react';

export interface TabLoadingState {
  whois: 'idle' | 'loading' | 'loaded' | 'error';
  dns: 'idle' | 'loading' | 'loaded' | 'error';
  map: 'idle' | 'loading' | 'loaded' | 'error';
  ssl: 'idle' | 'loading' | 'loaded' | 'error';
}

export interface UseTabLoadingOptions {
  /** Whois 加载完成后自动预加载其他 Tab 的延迟时间(毫秒) */
  preloadDelay?: number;
  /** 是否启用预加载 */
  enablePreload?: boolean;
}

export function useTabLoading(options: UseTabLoadingOptions = {}) {
  const { preloadDelay = 2000, enablePreload = true } = options;
  
  const [activeTab, setActiveTab] = useState<string>('whois');
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['whois']));
  const [loadingStates, setLoadingStates] = useState<TabLoadingState>({
    whois: 'loading',
    dns: 'idle',
    map: 'idle',
    ssl: 'idle',
  });
  
  const preloadTimerRef = useRef<number | null>(null);
  const preloadedRef = useRef(false);
  
  // 重置状态（新查询时调用）
  const reset = useCallback(() => {
    setActiveTab('whois');
    setVisitedTabs(new Set(['whois']));
    setLoadingStates({
      whois: 'loading',
      dns: 'idle',
      map: 'idle',
      ssl: 'idle',
    });
    preloadedRef.current = false;
    
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
      preloadTimerRef.current = null;
    }
  }, []);
  
  // 处理 Tab 切换
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setVisitedTabs(prev => {
      const newSet = new Set(prev);
      newSet.add(value);
      return newSet;
    });
    
    // 如果该 Tab 还没加载过，设置为 loading
    setLoadingStates(prev => {
      const key = value as keyof TabLoadingState;
      if (prev[key] === 'idle') {
        return { ...prev, [key]: 'loading' };
      }
      return prev;
    });
  }, []);
  
  // 更新某个 Tab 的加载状态
  const setTabLoaded = useCallback((tab: keyof TabLoadingState, status: 'loaded' | 'error' = 'loaded') => {
    setLoadingStates(prev => ({ ...prev, [tab]: status }));
  }, []);
  
  // 检查 Whois 是否已完成加载
  const isWhoisComplete = loadingStates.whois === 'loaded' || loadingStates.whois === 'error';
  
  // 当 Whois 加载完成后，启动预加载计时器
  useEffect(() => {
    if (isWhoisComplete && enablePreload && !preloadedRef.current) {
      preloadTimerRef.current = window.setTimeout(() => {
        preloadedRef.current = true;
        // 自动标记其他 Tab 为可预加载状态
        setVisitedTabs(new Set(['whois', 'dns', 'map', 'ssl']));
        setLoadingStates(prev => ({
          ...prev,
          dns: prev.dns === 'idle' ? 'loading' : prev.dns,
          map: prev.map === 'idle' ? 'loading' : prev.map,
          ssl: prev.ssl === 'idle' ? 'loading' : prev.ssl,
        }));
      }, preloadDelay);
    }
    
    return () => {
      if (preloadTimerRef.current) {
        clearTimeout(preloadTimerRef.current);
      }
    };
  }, [isWhoisComplete, enablePreload, preloadDelay]);
  
  // 判断某个 Tab 是否可以开始加载（Whois必须先完成）
  const canLoadTab = useCallback((tabName: string) => {
    if (tabName === 'whois') return true;
    return isWhoisComplete;
  }, [isWhoisComplete]);
  
  // 判断某个 Tab 是否应该渲染
  const shouldRenderTab = useCallback((tabName: string) => {
    return visitedTabs.has(tabName);
  }, [visitedTabs]);
  
  // 获取 Tab 的加载状态图标类型
  const getTabIndicator = useCallback((tabName: keyof TabLoadingState): 'none' | 'loading' | 'loaded' | 'error' => {
    const state = loadingStates[tabName];
    if (state === 'idle') return 'none';
    return state;
  }, [loadingStates]);
  
  return {
    activeTab,
    visitedTabs,
    loadingStates,
    isWhoisComplete,
    reset,
    handleTabChange,
    setTabLoaded,
    shouldRenderTab,
    canLoadTab,
    getTabIndicator,
  };
}
