import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

import { RoleCard } from "@/components/admin/users/role-card";
import { roles } from "@/config/permissions";
import { requireAdminPermission } from "@/services/auth.service";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.roles" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

/**
 * صفحة إدارة الأدوار — Server Component خالص. `roles.map(...)` مباشرة
 * من `config/permissions.ts` — **لا سرد يدوي للأدوار السبعة في أي مكان
 * هنا**. إضافة دور ثامن هناك يعني بطاقة إضافية تلقائيًا بلا أي تعديل
 * على هذا الملف.
 *
 * Roles management page — a pure Server Component. `roles.map(...)`
 * directly from `config/permissions.ts` — **the seven roles are never
 * manually listed anywhere here**. Adding an eighth role there means an
 * extra card automatically, with zero changes to this file.
 */
export default async function AdminRolesPage() {
  await requireAdminPermission("user:manage");
  const t = await getTranslations("admin.roles");
  const locale = (await getLocale()) as Locale;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <RoleCard key={role} role={role} locale={locale} />
        ))}
      </div>
    </div>
  );
}
