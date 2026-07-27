import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/status-badge";
import { CompletionCard } from "@/components/admin/localization/completion-card";
import { MissingFieldsList } from "@/components/admin/localization/missing-fields-list";
import { StatWidget } from "@/components/admin/stat-widget";
import { supportedLanguages, getAllLanguageStats, getRecentTranslations, getRecentReviews } from "@/lib/mock/localization";
import { siteConfig, type Locale } from "@/config/site";
import { Globe2, FileWarning, Languages } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.localization.dashboard" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

export default async function AdminLocalizationDashboardPage() {
  const t = await getTranslations("admin.localization.dashboard");
  const locale = (await getLocale()) as Locale;
  const stats = getAllLanguageStats();
  const totalUntranslated = stats.reduce((sum, s) => sum + s.untranslatedCount, 0);
  const recentTranslations = getRecentTranslations();
  const recentReviews = getRecentReviews();
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatWidget label={t("languagesCount")} value={supportedLanguages.length} icon={Globe2} />
        <StatWidget label={t("untranslatedCount")} value={totalUntranslated} icon={FileWarning} />
        <StatWidget label={t("activeLanguagesCount")} value={supportedLanguages.filter((l) => l.isActive).length} icon={Languages} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supportedLanguages.map((language) => (
          <CompletionCard key={language.isoCode} language={language} stats={stats.find((s) => s.isoCode === language.isoCode)!} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("recentTranslations")}</p>
          {recentTranslations.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noRecent")}</p>
          ) : (
            <ul className="space-y-2">
              {recentTranslations.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="line-clamp-1 text-foreground">{entry.title}</span>
                  <StatusBadge status={entry.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("recentReviews")}</p>
          {recentReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noRecent")}</p>
          ) : (
            <ul className="space-y-2">
              {recentReviews.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="line-clamp-1 text-foreground">{entry.title}</span>
                  <time className="shrink-0 text-xs text-muted-foreground">{dateFormatter.format(new Date(entry.lastModified))}</time>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <MissingFieldsList stats={stats} />
      </div>
    </div>
  );
}
