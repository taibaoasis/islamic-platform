import { getTranslations, getLocale } from "next-intl/server";

import { ReadingTime } from "@/components/content/reading-time";
import { contentKindLabels, type ContentItem } from "@/lib/mock/content";
import type { Locale } from "@/config/site";

export async function ContentMeta({ item, showUpdated = true }: { item: ContentItem; showUpdated?: boolean }) {
  const t = await getTranslations("content.meta");
  const locale = (await getLocale()) as Locale;
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span>{contentKindLabels[item.kind][locale === "ar" ? "ar" : "en"]}</span>
      <time dateTime={item.publishedAt}>{t("publishedOn", { date: dateFormatter.format(new Date(item.publishedAt)) })}</time>
      {showUpdated && item.updatedAt && (
        <time dateTime={item.updatedAt}>{t("updatedOn", { date: dateFormatter.format(new Date(item.updatedAt)) })}</time>
      )}
      <ReadingTime minutes={item.readingTimeMinutes} />
    </div>
  );
}
