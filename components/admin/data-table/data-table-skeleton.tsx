import { Skeleton } from "@/components/ui/skeleton";

export function DataTableSkeleton({ columnCount = 6, rowCount = 8 }: { columnCount?: number; rowCount?: number }) {
  return (
    <div aria-hidden="true" className="space-y-2">
      {Array.from({ length: rowCount }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-border py-3">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          {Array.from({ length: columnCount }).map((__, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
