import { Skeleton } from "@/components/ui/skeleton";

export const WhoisSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
    {/* 价格骨架 */}
    <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <div className="flex-1" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>

    {/* 域名信息骨架 */}
    <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-5 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>

    {/* 注册商骨架 */}
    <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-48" />
      </div>
    </div>

    {/* 时间骨架 x2 */}
    {[1, 2].map(i => (
      <div key={i} className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-44" />
        </div>
      </div>
    ))}

    {/* NS骨架 */}
    <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="ml-8 space-y-1.5">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
    </div>

    {/* 状态骨架 */}
    <div className="p-3 sm:p-5 bg-card/60 backdrop-blur-sm rounded-xl border border-border shadow-md">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="ml-8 flex gap-2">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);
