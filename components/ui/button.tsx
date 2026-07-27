"use client";

import type { VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button-variants";

/**
 * Button — يطابق ENTERPRISE_DESIGN_SYSTEM.md §3.1.
 * الأنواع: Primary, Secondary, Outline, Ghost, Destructive.
 * الأحجام: sm/md/lg. حالة Loading تستبدل النص بمؤشر دوران دون إخفائه
 * كليًا (aria-busy). حلقة تركيز مرئية إلزامية (§7 — إتاحة الوصول).
 *
 * ملاحظة تقنية مهمة (اكتُشفت أثناء Phase 9.1): لا يدعم هذا المكوّن
 * `asChild` (نمط Radix Slot لتصيير رابط بمظهر زر). عند الاختبار الفعلي
 * تبيَّن أن Slot يفشل عبر حدود Server/Client Component في هذا الإعداد
 * (Next.js 16 + React 19 + Turbopack). البديل الموثَّق والمُختبَر فعليًا:
 * استورد `buttonVariants` من هذا الملف وطبِّقه مباشرة كـ className على
 * أي عنصر Link، كما هو مُطبَّق في components/home/*.
 *
 * Button — matches ENTERPRISE_DESIGN_SYSTEM.md §3.1.
 * Variants: Primary, Secondary, Outline, Ghost, Destructive.
 * Sizes: sm/md/lg. Loading state replaces the label with a spinner
 * without hiding it entirely (aria-busy). Visible focus ring is
 * mandatory (§7 — accessibility).
 *
 * Important technical note (discovered during Phase 9.1): this
 * component does not support `asChild` (the Radix Slot pattern for
 * rendering a link with button styling). Real testing showed Slot
 * fails across the Server/Client Component boundary in this setup
 * (Next.js 16 + React 19 + Turbopack). The documented, actually-tested
 * alternative: import `buttonVariants` from this file and apply it
 * directly as className on any Link element, as done in
 * components/home/*.
 */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** يعرض مؤشر دوران ويعطِّل الزر دون تغيير أبعاده. Shows a spinner and disables the button without changing its size. */
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";
