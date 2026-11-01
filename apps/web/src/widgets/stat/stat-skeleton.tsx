import { Skeleton } from "@/components/ui/skeleton";

export function StatSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}
