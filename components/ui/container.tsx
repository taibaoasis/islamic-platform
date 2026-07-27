import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Container — يضبط العرض الأقصى ويوسِّط المحتوى أفقيًا مع حشوة جانبية
 * متجاوبة. `narrow` يطابق عرض القراءة الموصى به (~720px) لصفحات
 * المقالات (Design System §4.5).
 *
 * Container — sets max-width and horizontally centers content with
 * responsive side padding. `narrow` matches the recommended reading
 * width (~720px) for article pages (Design System §4.5).
 */
export function Container({
  className,
  narrow,
  ...props
}: HTMLAttributes<HTMLDivElement> & { narrow?: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-[720px]" : "max-w-7xl",
        className
      )}
      {...props}
    />
  );
}
