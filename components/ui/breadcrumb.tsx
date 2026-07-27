import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Home } from "@/components/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Breadcrumb — Design System §3.13 و§5.3. سهم الفصل ينعكس تلقائيًا مع
 * RTL/LTR عبر `rtl:rotate-180`. آخر عنصر بلا رابط ويحمل `aria-current`.
 * يستخدم Link من next-intl (لا <a> خام) للحفاظ على اللغة الحالية عند
 * التنقّل.
 *
 * Breadcrumb — Design System §3.13 and §5.3. The separator arrow flips
 * automatically with RTL/LTR via `rtl:rotate-180`. The last item has no
 * link and carries `aria-current`. Uses next-intl's Link (not a raw
 * <a>) to preserve the current locale when navigating.
 */
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="مسار التنقّل" className={cn("flex items-center gap-1.5 text-sm", className)}>
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground" aria-label="الرئيسية">
            <Home className="size-4" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              <ChevronLeft className="size-3.5 shrink-0 text-muted-foreground rtl:rotate-180" aria-hidden="true" />
              <li>
                {isLast || !item.href ? (
                  <span aria-current={isLast ? "page" : undefined} className="font-medium text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
