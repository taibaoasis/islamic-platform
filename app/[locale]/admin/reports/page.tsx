import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getContentReport, getUsersReport, getLocalizationReport, getSystemReport } from "@/lib/mock/reports";
import { siteConfig, type Locale } from "@/config/site";
import { Newspaper, Users, Globe2, Database } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.reports" });
  return { title: `${t("overviewTitle")} — ${siteConfig.name}` };
}

export default async function AdminReportsIndexPage() {
  const t = await getTranslations("admin.reports");
  const tNav = await getTranslations("admin.reportsNav");
  const content = getContentReport();
  const users = getUsersReport();
  const localization = getLocalizationReport();
  const system = getSystemReport();

  return (
    <div>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{t("overviewDescription")}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/reports/content">
          <Card interactive className="flex items-center gap-3 p-4">
            <Newspaper className="size-6 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{tNav("content")}</p>
              <p className="text-xs text-muted-foreground">{content.articles + content.fatwas + content.books + content.lessons}</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/reports/users">
          <Card interactive className="flex items-center gap-3 p-4">
            <Users className="size-6 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{tNav("users")}</p>
              <p className="text-xs text-muted-foreground">{users.totalUsers}</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/reports/localization">
          <Card interactive className="flex items-center gap-3 p-4">
            <Globe2 className="size-6 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{tNav("localization")}</p>
              <p className="text-xs text-muted-foreground">{localization.languages.length}</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/reports/system">
          <Card interactive className="flex items-center gap-3 p-4">
            <Database className="size-6 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{tNav("system")}</p>
              <p className="text-xs text-muted-foreground">{system.storageUsedLabel}</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
