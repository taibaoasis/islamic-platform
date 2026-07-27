import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SurahGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </Card>
      ))}
    </div>
  );
}
