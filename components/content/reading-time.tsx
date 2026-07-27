import { getTranslations } from "next-intl/server";

import { Clock3 } from "@/components/icons";

/** ReadingTime — Server Component خالص (بلا JavaScript للعميل) عبر getTranslations غير المتزامن. A pure Server Component (zero client JavaScript) via async getTranslations. */
export async function ReadingTime({ minutes }: { minutes: number }) {
  const t = await getTranslations("content.meta");
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Clock3 className="size-4" aria-hidden="true" />
      {t("readingTime", { count: minutes })}
    </span>
  );
}
