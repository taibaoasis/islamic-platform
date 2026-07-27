import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * SearchResultsSkeleton — Phase 9.2، القسم 5. يطابق أبعاد
 * SearchResultCard تقريبًا (Design System §3.20) لتقليل قفزة التخطيط.
 * Matches SearchResultCard's approximate dimensions (Design System
 * §3.20) to reduce layout shift.
 */
export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex items-start gap-4 p-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
