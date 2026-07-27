import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { getSystemReport } from "@/lib/mock/reports";
import { siteConfig, type Locale } from "@/config/site";
import { Database, Cpu, Folder } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.reports.system" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

export default async function SystemReportPage() {
  const t = await getTranslations("admin.reports.system");
  const report = getSystemReport();
  const locale = (await getLocale()) as Locale;
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <Database className="size-6 text-primary" aria-hidden="true" />
          <div>
            <p className="text-lg font-bold text-foreground">{report.storageUsedLabel}</p>
            <p className="text-xs text-muted-foreground">{t("storageUsed")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Cpu className="size-6 text-primary" aria-hidden="true" />
          <div>
            <p className="text-lg font-bold text-foreground">{report.memoryUsagePlaceholder}</p>
            <p className="text-xs text-muted-foreground">{t("memoryUsage")}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Folder className="size-6 text-primary" aria-hidden="true" />
          <div>
            <p className="text-lg font-bold text-foreground">{report.filesCount}</p>
            <p className="text-xs text-muted-foreground">{t("filesCount")}</p>
          </div>
        </Card>
      </div>

      <Alert variant="info" className="mt-4">
        {t("memoryPlaceholderNotice")}
      </Alert>

      <Card className="mt-6 p-4">
        <p className="mb-1 text-sm font-semibold text-foreground">{t("errorLog")}</p>
        <p className="mb-3 text-xs text-muted-foreground">{t("errorLogNotice")}</p>
        {report.errorEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noErrors")}</p>
        ) : (
          <ul className="space-y-2">
            {report.errorEvents.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-none last:pb-0">
                <span className="text-foreground">
                  <span className="font-medium">{entry.actorName}</span> — {entry.targetTitle}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="error">{t("errorLog")}</Badge>
                  <time className="text-xs text-muted-foreground">{dateFormatter.format(new Date(entry.timestamp))}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
