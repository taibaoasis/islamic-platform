import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/config/site";

/** فهرس الإعدادات يُوجِّه مباشرة للقسم الأول — القوقعة الموحَّدة (layout.tsx) هي الصفحة الفعلية المشتركة. The settings index redirects straight to the first section — the unified shell (layout.tsx) is the real shared page. */
export default async function AdminSettingsIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: "/admin/settings/general", locale });
}
