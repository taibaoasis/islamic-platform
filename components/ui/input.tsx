import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { AlertCircle } from "@/components/icons";

/**
 * Input — يغطي text/email/number (Design System §3.2). حالة الخطأ
 * تُعرَض بنص + أيقونة معًا، لا بلون الحدود وحده (§7 — لا اعتماد على
 * اللون فقط). اتجاه الكتابة الداخلي (dir) يتبع لغة القيمة المُدخَلة عند
 * الحاجة عبر الخاصية القياسية `dir` على عنصر <input> نفسه، لا لغة
 * الواجهة العامة تلقائيًا (§3.2).
 *
 * Input — covers text/email/number (Design System §3.2). Error state is
 * shown via text + icon together, never color alone (§7 — no color-only
 * reliance). Internal writing direction follows the entered value's
 * language when needed via the standard `dir` prop on the <input>
 * itself, not the page's overall UI language automatically (§3.2).
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, errorMessage, id, ...props }, ref) => {
    const describedBy = errorMessage ? `${id}-error` : undefined;
    return (
      <div className="w-full">
        <input
          ref={ref}
          id={id}
          aria-invalid={!!errorMessage || undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
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
Input.displayName = "Input";
