import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton — Design System §3.20. يُستخدَم بنفس أبعاد المحتوى الحقيقي
 * تقريبًا لتقليل "قفزة التخطيط" (Layout Shift). aria-hidden لأنه بديل
 * بصري مؤقت بلا معنى دلالي لتقنيات المساعدة (الحالة الفعلية تُعلَن عبر
 * aria-busy على الحاوية الأم).
 *
 * Skeleton — Design System §3.20. Used at roughly the real content's
 * dimensions to reduce layout shift. aria-hidden since it's a temporary
 * visual placeholder with no semantic meaning for assistive tech (the
 * actual loading state is announced via aria-busy on the parent
 * container).
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-[var(--radius)] bg-muted", className)}
      {...props}
    />
  );
}
