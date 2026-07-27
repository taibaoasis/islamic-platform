"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/use-locale";
import { localeLabels, locales } from "@/config/site";

/**
 * ملف جديد — تركيب صغير فوق next-intl مباشرة (لا يعتمد على مكوّن Select
 * لأن الخيارين فقط اثنان حاليًا، وفق قاعدة §12 من Design System: قائمة
 * ≤5 خيارات ظاهرة بالكامل لا تحتاج Select). موثَّق في التقرير.
 *
 * New file — a small composition directly over next-intl (does not use
 * the Select component since there are only two options today, per
 * Design System §12: a fully-visible ≤5-option list doesn't need
 * Select). Documented in the report.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale: current } = useLocale();

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted-foreground">/</span>}
          <Link
            href={pathname}
            locale={locale}
            aria-current={locale === current ? "true" : undefined}
            className={
              locale === current
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {localeLabels[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
