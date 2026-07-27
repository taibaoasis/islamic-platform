import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { ReportsNav } from "@/components/admin/reports/reports-nav";

export default async function ReportsLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("admin.reportsNav");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">{t("title")}</h1>
      <ReportsNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
