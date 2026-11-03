import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_BAR_HEIGHTS = ["h-1/3", "h-2/3", "h-1/2", "h-full", "h-3/4"];

export function ChartSkeleton() {
  return (
    <div className="flex h-40 items-end gap-2">
      {SKELETON_BAR_HEIGHTS.map((height, index) => (
        <Skeleton key={index} className={`flex-1 ${height}`} />
      ))}
    </div>
  );
}
