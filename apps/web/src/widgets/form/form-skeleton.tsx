import { Skeleton } from "@/components/ui/skeleton";

export function FormSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
