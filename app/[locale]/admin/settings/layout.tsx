import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { requireAdminPermission } from "@/services/auth.service";

/** Phase 0.1 — يضيف حراسة settings:manage فوق البوابة العامة الموروثة من admin/layout.tsx. Phase 0.1 — adds a settings:manage guard on top of the general gate inherited from admin/layout.tsx. */
export default async function SettingsLayout({ children }: { children: ReactNode }) {
  await requireAdminPermission("settings:manage");
  const t = await getTranslations("admin.settingsNav");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">{t("title")}</h1>
      <SettingsNav />
      <div className="mt-6 max-w-2xl">{children}</div>
    </div>
  );
}
