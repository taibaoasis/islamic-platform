"use client";

import { forwardRef, useId, useState } from "react";

import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "@/components/icons";
import type { InputProps } from "@/components/ui/input";

/**
 * PasswordInput — Design System §3.2. زر إظهار/إخفاء بأيقونة، مع
 * aria-label يتغيَّر حسب الحالة، وaria-pressed للإعلان الصحيح عن حالة
 * التبديل لتقنيات المساعدة.
 *
 * PasswordInput — Design System §3.2. Show/hide icon toggle, with an
 * aria-label that changes with state and aria-pressed to correctly
 * announce the toggle state to assistive technology.
 */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, errorMessage, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedBy = errorMessage ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            aria-invalid={!!errorMessage || undefined}
            aria-describedby={describedBy}
            className={cn(
              "flex h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 pe-10 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errorMessage && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--radius)]"
          >
            {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        </div>
        {errorMessage && (
          <p id={describedBy} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
