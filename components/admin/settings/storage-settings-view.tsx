import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Database } from "@/components/icons";
import { storageProviders, formatBytes } from "@/lib/mock/settings";

/**
 * StorageSettingsView — Phase 11, Module 7 §Storage. عرض فقط، لا اتصال
 * حقيقي بأي خدمة. **مزوِّد "Local" يعرض استخدامًا حقيقيًا مُشتَقًّا من
 * `mockMediaAssets`** (Module 4)، لا رقمًا Mock معزولاً — بقية المزوِّدين
 * (S3، Backblaze، R2) غير مُفعَّلين فعليًا فيُعرَضون بصفر استخدام بصدق،
 * لا رقم مُختلَق.
 *
 * StorageSettingsView — Phase 11, Module 7, Storage section. Display
 * only, no real service connection. **The "Local" provider shows real
 * usage derived from `mockMediaAssets`** (Module 4), not an isolated
 * mock number — the other providers (S3, Backblaze, R2) aren't actually
 * enabled, so they honestly show zero usage, not a fabricated number.
 */
export async function StorageSettingsView() {
  const t = await getTranslations("admin.settings.storage");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{t("title")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {storageProviders.map((provider) => {
          const percentage = Math.round((provider.usedBytes / provider.totalBytes) * 100);
          return (
            <Card key={provider.id} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Database className="size-4 text-muted-foreground" aria-hidden="true" />
                  {provider.name}
                </span>
                <Badge variant={provider.isActive ? "success" : "neutral"}>{provider.isActive ? t("active") : t("inactive")}</Badge>
              </div>
              <Progress value={percentage} aria-label={provider.name} />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t("usageLabel", { used: formatBytes(provider.usedBytes), total: formatBytes(provider.totalBytes) })}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
