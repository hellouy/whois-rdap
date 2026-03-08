import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div 
    className="p-2.5 sm:p-5 bg-card/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-md animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    {children}
  </div>
);

export const WhoisSkeleton = () => (
  <div className="space-y-2.5 sm:space-y-4 md:space-y-6">
    {/* 域名信息骨架 */}
    <SkeletonCard delay={0}>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
          <Skeleton className="h-3 sm:h-4 w-10 shimmer" />
          <Skeleton className="h-4 sm:h-5 w-28 sm:w-32 shimmer" />
          <div className="flex-1" />
          <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 rounded-full shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
          <Skeleton className="h-3 sm:h-4 w-14 sm:w-16 shimmer" />
          <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 shimmer" />
        </div>
      </div>
    </SkeletonCard>

    {/* 注册商骨架 */}
    <SkeletonCard delay={80}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
        <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 shimmer" />
        <Skeleton className="h-4 sm:h-5 w-36 sm:w-48 shimmer" />
      </div>
    </SkeletonCard>

    {/* 时间骨架 x2 */}
    {[1, 2].map(i => (
      <SkeletonCard key={i} delay={160 + i * 80}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
          <Skeleton className="h-3 sm:h-4 w-14 sm:w-16 shimmer" />
          <Skeleton className="h-4 sm:h-5 w-36 sm:w-44 shimmer" />
        </div>
      </SkeletonCard>
    ))}

    {/* NS骨架 */}
    <SkeletonCard delay={400}>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 shimmer" />
        </div>
        <div className="ml-6 sm:ml-8 space-y-1.5">
          <Skeleton className="h-3 sm:h-4 w-44 sm:w-56 shimmer" />
          <Skeleton className="h-3 sm:h-4 w-40 sm:w-52 shimmer" />
        </div>
      </div>
    </SkeletonCard>

    {/* 状态骨架 */}
    <SkeletonCard delay={480}>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
          <Skeleton className="h-3 sm:h-4 w-14 sm:w-16 shimmer" />
        </div>
        <div className="ml-6 sm:ml-8 flex gap-2">
          <Skeleton className="h-6 sm:h-7 w-16 sm:w-20 rounded-lg shimmer" />
          <Skeleton className="h-6 sm:h-7 w-20 sm:w-28 rounded-lg shimmer" />
          <Skeleton className="h-6 sm:h-7 w-18 sm:w-24 rounded-lg shimmer" />
        </div>
      </div>
    </SkeletonCard>

    {/* 价格骨架 */}
    <SkeletonCard delay={560}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded shimmer" />
        <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 shimmer" />
        <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 shimmer" />
        <div className="flex-1" />
        <Skeleton className="h-3 sm:h-4 w-10 sm:w-12 shimmer" />
      </div>
    </SkeletonCard>
  </div>
);
