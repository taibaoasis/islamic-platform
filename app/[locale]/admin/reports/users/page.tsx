import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { StatWidget } from "@/components/admin/stat-widget";
import { SimpleBarChart } from "@/components/admin/reports/simple-bar-chart";
import { getUsersReport } from "@/lib/mock/reports";
import { siteConfig, type Locale } from "@/config/site";
import { Users, UserCheck } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.reports.users" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

export default async function UsersReportPage() {
  const t = await getTranslations("admin.reports.users");
  const tActivity = await getTranslations("admin.activity.actions");
  const report = getUsersReport();
  const locale = (await getLocale()) as Locale;
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <StatWidget label={t("activeUsers")} value={report.active} icon={UserCheck} />
        <StatWidget label={t("totalUsers")} value={report.totalUsers} icon={Users} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("roleDistribution")}</p>
          <SimpleBarChart data={report.roleDistribution.map((r) => ({ label: r.role, value: r.count }))} />
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("recentLogins")}</p>
          <ul className="space-y-2">
            {report.recentLogins.map((user) => (
              <li key={user.id}>
                <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2 hover:text-primary">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-[10px]">{user.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{user.name}</span>
                  <time className="shrink-0 text-xs text-muted-foreground">{user.lastLogin ? dateFormatter.format(new Date(user.lastLogin)) : "—"}</time>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{t("recentActivity")}</p>
          <ul className="space-y-2 text-sm">
            {report.recentActivity.map((entry) => (
              <li key={entry.id} className="text-foreground">
                <span className="font-medium">{entry.actorName}</span> {tActivity(entry.action)} {entry.targetTitle}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
