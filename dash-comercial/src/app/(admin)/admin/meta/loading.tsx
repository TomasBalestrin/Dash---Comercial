import { Skeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-4 rounded-card border border-border-card bg-bg-card p-5">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
      <Skeleton className="h-9 w-full max-w-xs" />
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
