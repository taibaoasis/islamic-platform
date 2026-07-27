import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AiSettingsForm } from "@/components/admin/settings/ai-settings-form";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.settings.ai" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

export default function AiSettingsPage() {
  return <AiSettingsForm />;
}
