"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const sections = ["general", "seo", "email", "storage", "search", "ai", "security"] as const;

/**
 * SettingsNav — Phase 11, Module 7 §"واجهة موحَّدة". تُركَّب مرة واحدة
 * في `layout.tsx` (لا في كل صفحة) فتُطبَّق تلقائيًا على كل الأقسام
 * السبعة — إضافة قسم ثامن مستقبلاً تعني سطرًا واحدًا هنا، لا نسخ بنية
 * تنقّل جديدة.
 *
 * SettingsNav — Phase 11, Module 7, "unified interface" requirement.
 * Mounted once in `layout.tsx` (not per page), so it automatically
 * applies to all seven sections — adding an eighth section later means
 * one line here, not copying a new nav structure.
 */
export function SettingsNav() {
  const t = useTranslations("admin.settingsNav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("title")} className="flex gap-1 overflow-x-auto border-b border-border pb-px">
      {sections.map((section) => {
        const href = `/admin/settings/${section}`;
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
