"use client";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Pagination — Design System §3.14. نوعان: Numbered (لنتائج محدودة كالبحث)
 * وLoadMore (لتصفح استكشافي كالمقالات). Infinite Scroll ممنوع صراحة
 * على المحتوى الرئيسي (§3.14) فلا يوجد كمكوّن هنا.
 *
 * Pagination — Design System §3.14. Two kinds: Numbered (bounded
 * results like search) and LoadMore (exploratory browsing like
 * articles). Infinite Scroll is explicitly banned for primary content
 * (§3.14) so it has no component here.
 */
function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  const range: (number | "ellipsis")[] = [];
  const window = 1;
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || (page >= current - window && page <= current + window)) {
      range.push(page);
    } else if (range[range.length - 1] !== "ellipsis") {
      range.push("ellipsis");
    }
  }
  return range;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  return (
    <nav aria-label="تنقّل الصفحات" className={cn("flex items-center justify-center gap-1", className)}>
      <IconButton
        aria-label="الصفحة السابقة"
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronRight className="rtl:rotate-180" aria-hidden="true" />
      </IconButton>

      {getPageRange(currentPage, totalPages).map((page, i) =>
        page === "ellipsis" ? (
          <span key={`e-${i}`} className="flex size-9 items-center justify-center text-muted-foreground">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "ghost"}
            size="sm"
            className="size-9 px-0"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}

      <IconButton
        aria-label="الصفحة التالية"
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronLeft className="rtl:rotate-180" aria-hidden="true" />
      </IconButton>
    </nav>
  );
}

export function LoadMoreButton({
  onClick,
  isLoading,
  hasMore,
  className,
}: {
  onClick: () => void;
  isLoading?: boolean;
  hasMore: boolean;
  className?: string;
}) {
  if (!hasMore) return null;
  return (
    <div className={cn("flex justify-center", className)}>
      <Button variant="outline" onClick={onClick} isLoading={isLoading}>
        عرض المزيد
      </Button>
    </div>
  );
}
