import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StatWidget } from "@/components/admin/stat-widget";
import { RecentActivityWidget } from "@/components/admin/recent-activity-widget";
import { ContentReviewWidget } from "@/components/admin/content-review-widget";
import { SystemNotificationsWidget } from "@/components/admin/system-notifications-widget";
import { Library, Newspaper, GraduationCap, PlayCircle, Users } from "@/components/icons";
import { siteConfig, type Locale } from "@/config/site";
import { ROLES } from "@/lib/auth/roles";
import { requireCurrentRole } from "@/lib/auth/server";
import { dashboardStats } from "@/lib/mock/admin";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "admin.dashboard",
  });

  return {
    title: `${t("title")} — ${siteConfig.name}`,
  };
}

/**
 * Dashboard — Phase 11، الوحدة 1 (Module 1). ثمانية Widgets مطلوبة
 * صراحة: 5 بطاقات إحصائية (StatWidget) + 3 widgets تفصيلية (نشاط،
 * مراجعة، إشعارات). كل الإحصائيات مُشتَقة فعليًا من `lib/mock/admin.ts`
 * (وهي بدورها تُجمِّع من مصفوفات Mock السابقة، لا أرقامًا ثابتة معزولة).
 */
export default async function AdminDashboardPage() {
  await requireCurrentRole([ROLES.ADMIN]);

  const t = await getTranslations("admin.dashboard");
  const tStats = await getTranslations("admin.stats");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {t("title")}
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        {t("description")}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatWidget
          label={tStats("totalContent")}
          value={dashboardStats.totalContent}
          icon={Library}
        />

        <StatWidget
          label={tStats("publishedArticles")}
          value={dashboardStats.publishedArticles}
          icon={Newspaper}
        />

        <StatWidget
          label={tStats("lessons")}
          value={dashboardStats.lessons}
          icon={GraduationCap}
        />

        <StatWidget
          label={tStats("courses")}
          value={dashboardStats.courses}
          icon={PlayCircle}
        />

        <StatWidget
          label={tStats("users")}
          value={dashboardStats.users}
          icon={Users}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <RecentActivityWidget />
        <ContentReviewWidget />
        <SystemNotificationsWidget />
      </div>
    </div>
  );
}