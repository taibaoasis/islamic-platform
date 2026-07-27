import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";

export async function TagsSection({ tags }: { tags: string[] }) {
  const t = await getTranslations("content.tags");
  if (tags.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{t("title")}</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Badge variant="neutral">{tag}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
