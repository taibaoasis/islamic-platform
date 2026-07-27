import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { QuranContentTable } from "@/components/admin/quran-content-table";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.quran" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

/**
 * Module 2.1 — Quran Content Management. الصفحة نفسها Server Component
 * رفيعة تُصيِّر `QuranContentTable` كحد تفاعلي وحيد — كل التعقيد
 * (بحث/تصفية/فرز/تحديد/صفحات) يعيش داخل ذلك المكوّن فقط.
 */
export default async function AdminQuranPage() {
  const t = await getTranslations("admin.quran");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6">
        <QuranContentTable />
      </div>
    </div>
  );
}
