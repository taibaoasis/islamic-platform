"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * IconButton — Design System §3.1. زر بأيقونة فقط بلا نص مرئي.
 * `aria-label` إلزامي (لا اختياري) لأن الأيقونة وحدها لا تكفي أبدًا
 * كتسمية لتقنيات المساعدة (§1.2, §9).
 *
 * IconButton — Design System §3.1. Icon-only button with no visible
 * label. `aria-label` is required (not optional) since the icon alone
 * is never sufficient labeling for assistive technology (§1.2, §9).
 */
const iconButtonVariants = cva(
  "inline-flex items-center justify-center shrink-0 rounded-[var(--radius)] transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        outline: "border border-border bg-transparent hover:bg-secondary",
        ghost: "bg-transparent hover:bg-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-10 [&_svg]:size-5",
        lg: "size-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** وصف نصي إلزامي لوظيفة الزر (لا عنوان الأيقونة). Required text description of the button's function. */
  "aria-label": string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(iconButtonVariants({ variant, size }), className)} {...props} />
  )
);
IconButton.displayName = "IconButton";
