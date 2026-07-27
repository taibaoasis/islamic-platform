import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { MediaLibraryView } from "@/components/admin/media/media-library-view";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.media" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

/**
 * Module 4 — Enterprise Media Library. صفحة رفيعة تُصيِّر `MediaLibraryView`
 * كحد تفاعلي وحيد.
 */
export default async function AdminMediaPage() {
  const t = await getTranslations("admin.media");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6">
        <MediaLibraryView />
      </div>
    </div>
  );
}
