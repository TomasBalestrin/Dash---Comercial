import { Skeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-card border border-border-card bg-bg-card p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="size-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
