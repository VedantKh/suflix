export default function MoviePreviewSkeleton() {
  return (
    <div className="relative w-full max-w-sm rounded-xl overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl" />
      
      <div className="relative p-4 flex flex-col gap-4">
        <div className="relative aspect-[2/3] w-full rounded-lg bg-foreground/20" />
        
        <div className="space-y-2">
          <div className="h-6 bg-foreground/20 rounded w-3/4" />
          <div className="h-4 bg-foreground/20 rounded w-1/2" />
          <div className="space-y-1">
            <div className="h-4 bg-foreground/20 rounded w-full" />
            <div className="h-4 bg-foreground/20 rounded w-5/6" />
            <div className="h-4 bg-foreground/20 rounded w-4/6" />
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-16 bg-foreground/20 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 