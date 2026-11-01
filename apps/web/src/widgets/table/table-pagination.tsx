import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  canPrevious: boolean;
  canNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function TablePagination({
  pageIndex,
  pageSize,
  rowCount,
  canPrevious,
  canNext,
  onPrevious,
  onNext,
}: TablePaginationProps) {
  const first = pageIndex * pageSize + 1;
  const last = Math.min(first + pageSize - 1, rowCount);

  return (
    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span className="tabular-nums">
        {first}–{last} of {rowCount}
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={!canPrevious} onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={!canNext} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
