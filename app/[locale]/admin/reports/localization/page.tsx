import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StatWidget } from "@/components/admin/stat-widget";
import { CompletionCard } from "@/components/admin/localization/completion-card";
import { getLocalizationReport } from "@/lib/mock/reports";
import { siteConfig, type Locale } from "@/config/site";
import { FileWarning } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.reports.localization" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

/**
 * Localization Report — يعيد استخدام `CompletionCard` من Module 6
 * حرفيًا (لا نسخة تقرير منفصلة لعرض نفس البيانات).
 * Reuses `CompletionCard` from Module 6 verbatim (no separate report-only
 * copy for displaying the same data).
 */
export default async function LocalizationReportPage() {
  const t = await getTranslations("admin.reports.localization");
  const report = getLocalizationReport();

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 max-w-xs">
        <StatWidget label={t("untranslatedTotal")} value={report.untranslatedTotal} icon={FileWarning} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.languages.map((language) => (
          <CompletionCard key={language.isoCode} language={language} stats={report.languageStats.find((s) => s.isoCode === language.isoCode)!} />
        ))}
      </div>
    </div>
  );
}
