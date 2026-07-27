import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { StatWidget } from "@/components/admin/stat-widget";
import { getContentReport } from "@/lib/mock/reports";
import { siteConfig, type Locale } from "@/config/site";
import { Newspaper, GraduationCap, MessageCircleQuestion, Library, Languages, Folder, PlayCircle, Bell } from "@/components/icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.reports.content" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

export default async function ContentReportPage() {
  const t = await getTranslations("admin.reports.content");
  const report = getContentReport();

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatWidget label={t("articles")} value={report.articles} icon={Newspaper} />
        <StatWidget label={t("lessons")} value={report.lessons} icon={GraduationCap} />
        <StatWidget label={t("fatwas")} value={report.fatwas} icon={MessageCircleQuestion} />
        <StatWidget label={t("books")} value={report.books} icon={Library} />
        <StatWidget label={t("translations")} value={report.translations} icon={Languages} />
        <StatWidget label={t("media")} value={report.media} icon={Folder} />
        <StatWidget label={t("courses")} value={report.courses} icon={PlayCircle} />
        <StatWidget label={t("news")} value={report.news} icon={Bell} />
      </div>
    </div>
  );
}
