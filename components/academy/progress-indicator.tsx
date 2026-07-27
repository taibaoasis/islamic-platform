import { getTranslations } from "next-intl/server";

import { Progress } from "@/components/ui/progress";

export async function ProgressIndicator({ percentage, completed, total }: { percentage: number; completed?: number; total?: number }) {
  const t = await getTranslations("academy.progress");

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{t("label")}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <Progress value={percentage} aria-label={t("label")} />
      {completed !== undefined && total !== undefined && (
        <p className="mt-1.5 text-xs text-muted-foreground">{t("lessonsCompleted", { completed, total })}</p>
      )}
    </div>
  );
}
