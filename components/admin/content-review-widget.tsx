import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { contentUnderReview } from "@/lib/mock/admin";

const stageVariant = { REVIEW: "warning", SCHOLARLY_REVIEW: "info" } as const;

export async function ContentReviewWidget() {
  const t = await getTranslations("admin.review");

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{t("title")}</p>
        <Link href="/admin/articles" className="text-xs font-medium text-primary hover:underline">
          {t("viewAll")}
        </Link>
      </div>
      {contentUnderReview.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="space-y-3">
          {contentUnderReview.map((entry) => (
            <li key={entry.id} className="flex items-start justify-between gap-2 border-b border-border pb-3 last:border-none last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.type} · {t("submittedBy", { name: entry.submittedBy })}
                </p>
              </div>
              <Badge variant={stageVariant[entry.stage]} className="shrink-0">
                {t(`stage.${entry.stage}`)}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
