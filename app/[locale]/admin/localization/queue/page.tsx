import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TranslationQueueTable } from "@/components/admin/localization/translation-queue-table";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.localization.queue" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

export default async function AdminTranslationQueuePage() {
  const t = await getTranslations("admin.localization.queue");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6">
        <TranslationQueueTable />
      </div>
    </div>
  );
}
