"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { Search, X } from "@/components/icons";

/**
 * SearchInput — Design System §3.15. أيقونة بحث ثابتة + زر مسح يظهر
 * فقط عند وجود قيمة. مكوّن مُتحكَّم به (Controlled) حصرًا — يتطلب
 * `value` و`onChange` من المستدعي (لا حالة داخلية) ليبقى قابلاً لإعادة
 * الاستخدام في أي سياق (شريط علوي، صفحة بحث كاملة، Drawer مرشِّحات).
 *
 * SearchInput — Design System §3.15. Fixed search icon + a clear button
 * that only appears when there's a value. Strictly a controlled
 * component — requires `value` and `onChange` from the caller (no
 * internal state) to stay reusable across contexts (header bar, full
 * search page, filter drawer).
 */
export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  /** تسمية aria للحقل عند غياب Label مرئي (مثل شريط البحث في الرأس). Aria label when no visible Label exists (e.g. header search bar). */
  "aria-label"?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, placeholder = "ابحث...", ...props }, ref) => (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius)] border border-input bg-background ps-9 pe-9 py-2 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "[&::-webkit-search-cancel-button]:appearance-none",
          className
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          aria-label="مسح البحث"
          className="absolute inset-y-0 end-2 my-auto flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
);
SearchInput.displayName = "SearchInput";
