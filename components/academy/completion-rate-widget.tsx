import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/progress";

export async function CompletionRateWidget({ percentage }: { percentage: number }) {
  const t = await getTranslations("academy.dashboard.completionRate");

  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="relative flex shrink-0 items-center justify-center">
        <CircularProgress value={percentage} size={64} strokeWidth={6} />
        <span className="absolute text-sm font-bold text-foreground">{percentage}%</span>
      </div>
      <p className="text-sm font-medium text-foreground">{t("title")}</p>
    </Card>
  );
}
