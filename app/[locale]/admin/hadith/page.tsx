import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { HadithContentTable } from "@/components/admin/hadith-content-table";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.hadith" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

/**
 * Module 2.2 — Hadith Content Management. صفحة رفيعة (نفس نمط
 * `admin/quran/page.tsx` حرفيًا) — كل التعقيد داخل `HadithContentTable`.
 */
export default async function AdminHadithPage() {
  const t = await getTranslations("admin.hadith");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6">
        <HadithContentTable />
      </div>
    </div>
  );
}
