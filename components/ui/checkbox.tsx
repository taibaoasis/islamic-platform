"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

import { cn } from "@/lib/utils";
import { Check } from "@/components/icons";

/**
 * Checkbox — Design System §3.4. يدعم `checked={"indeterminate"}` من
 * Radix أصيلاً لحالة الاختيار الجزئي (مفيد لتحديد مجموعات فرعية من
 * Taxonomy لاحقًا). منطقة النقر تُترَك للمستدعي ليضمّها مع Label
 * المجاور بعنصر `<label>` واحد يلف الاثنين، كما يوصي القسم 3.4.
 *
 * Checkbox — Design System §3.4. Natively supports Radix's
 * `checked={"indeterminate"}` for partial-selection state (useful for
 * selecting Taxonomy subsets later). The click area is left to the
 * caller to wrap together with the adjacent Label in one `<label>`
 * element, as §3.4 recommends.
 */
export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-4 shrink-0 rounded-sm border border-input bg-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="size-3.5" aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
