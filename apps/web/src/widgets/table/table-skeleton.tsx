import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = 5;

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      {Array.from({ length: SKELETON_ROWS }, (_, row) => (
        <Skeleton key={row} className="h-3 w-full" />
      ))}
    </div>
  );
}
