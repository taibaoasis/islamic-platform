import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { AlertTriangle } from "@/components/icons";
import type { LanguageStats } from "@/lib/mock/localization";

export async function MissingFieldsList({ stats }: { stats: LanguageStats[] }) {
  const t = await getTranslations("admin.localization.progress");
  const withMissing = stats.filter((s) => s.untranslatedCount > 0);

  if (withMissing.length === 0) return null;

  return (
    <Card className="p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
        {t("missingFieldsTitle")}
      </p>
      <ul className="space-y-1.5 text-sm">
        {withMissing.map((s) => (
          <li key={s.isoCode} className="flex items-center justify-between text-muted-foreground">
            <span dir="ltr" className="uppercase">
              {s.isoCode}
            </span>
            <span>{t("missingFieldsCount", { count: s.untranslatedCount })}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
