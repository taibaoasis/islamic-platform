import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Check, CircleDot, Circle } from "@/components/icons";

export type CompletionStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

const config = {
  NOT_STARTED: { variant: "neutral" as const, icon: Circle, key: "notStarted" as const },
  IN_PROGRESS: { variant: "warning" as const, icon: CircleDot, key: "inProgress" as const },
  COMPLETED: { variant: "success" as const, icon: Check, key: "completed" as const },
};

/** CompletionBadge — واجهة فقط، لا نظام تتبّع تقدُّم حقيقي (Phase 10 §ممنوع). UI only, no real progress-tracking system. */
export async function CompletionBadge({ status }: { status: CompletionStatus }) {
  const t = await getTranslations("academy.completion");
  const { variant, icon: Icon, key } = config[status];

  return (
    <Badge variant={variant} className="inline-flex items-center gap-1">
      <Icon className="size-3" aria-hidden="true" />
      {t(key)}
    </Badge>
  );
}
