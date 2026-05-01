export function Skeleton({ className = "", variant = "rect" }: SkeletonProps) {
  const baseClass = "bg-slate-100 relative overflow-hidden";
  const variantClass = 
    variant === "circle" ? "rounded-full" : 
    variant === "text" ? "rounded-lg h-4 w-full" : 
    "rounded-2xl";

  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] p-4 border border-slate-50 space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-3 px-2">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-1/4 h-4" />
          <Skeleton className="w-8 h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function AuthorCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 flex flex-col items-center gap-4">
      <Skeleton variant="circle" className="w-24 h-24" />
      <Skeleton variant="text" className="w-1/2 h-5" />
      <Skeleton variant="text" className="w-1/3 h-3" />
      <div className="flex gap-2 w-full mt-4">
        <Skeleton className="flex-1 h-12 rounded-xl" />
      </div>
    </div>
  );
}
