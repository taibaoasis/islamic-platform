import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { AlertCircle } from "@/components/icons";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
}

/** Textarea — Design System §3.2، نفس نمط حالة الخطأ في Input. Same error-state pattern as Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, errorMessage, id, rows = 4, ...props }, ref) => {
    const describedBy = errorMessage ? `${id}-error` : undefined;
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={!!errorMessage || undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground resize-y",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            errorMessage && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
