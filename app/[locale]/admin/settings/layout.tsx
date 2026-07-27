import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { SettingsNav } from "@/components/admin/settings/settings-nav";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("admin.settingsNav");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">{t("title")}</h1>
      <SettingsNav />
      <div className="mt-6 max-w-2xl">{children}</div>
    </div>
  );
}
