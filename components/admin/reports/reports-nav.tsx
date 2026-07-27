"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const sections = ["content", "users", "localization", "system"] as const;

export function ReportsNav() {
  const t = useTranslations("admin.reportsNav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("title")} className="flex gap-1 overflow-x-auto border-b border-border pb-px">
      {sections.map((section) => {
        const href = `/admin/reports/${section}`;
        const isActive = pathname === href;
        return (
          <Link
            key={section}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium",
              isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t(section)}
          </Link>
        );
      })}
    </nav>
  );
}
