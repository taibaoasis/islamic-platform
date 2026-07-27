import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Table — Design System §3.10. للوحة التحكم الإدارية حصرًا — **لا
 * يُستخدَم لعرض محتوى عام للزوار** (استخدم Card ضمن قائمة/شبكة، §12).
 * ترويسة ثابتة عند التمرير عبر `sticky top-0` على TableHeader.
 *
 * Table — Design System §3.10. For the admin dashboard only — **never
 * used to display general content to visitors** (use Card within a
 * list/grid instead, §12). Sticky header on scroll via `sticky top-0`
 * on TableHeader.
 */
export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("sticky top-0 bg-background", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-secondary/50", className)} {...props} />;
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn("h-11 px-3 text-start align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-3 py-3 align-middle", className)} {...props} />;
}

/** حالة فارغة مصمَّمة — إلزامية، لا جدول فارغ بلا رسالة (§3.10). Designed empty state — mandatory, never an unexplained empty table (§3.10). */
export function TableEmpty({ colSpan, message = "لا توجد بيانات" }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-sm text-muted-foreground">
        {message}
      </td>
    </tr>
  );
}
