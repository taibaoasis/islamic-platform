import { getTranslations } from "next-intl/server";

import { ContentCard } from "@/components/content/content-card";
import type { ContentItem } from "@/lib/mock/content";

/**
 * RelatedContent — يعرض عناصر ذات صلة **بصرف النظر عن نوعها** (قد تكون
 * فتوى أو كتابًا مرتبطًا بمقالة) عبر ContentCard نفسه — إثبات عملي على
 * قابلية إعادة الاستخدام عبر الأنواع الخمسة دون أي تعديل.
 *
 * RelatedContent — shows related items **regardless of their kind**
 * (a fatwa or book may be related to an article) via the same
 * ContentCard — a concrete proof of reuse across all five kinds with
 * zero modification.
 */
export async function RelatedContent({ items }: { items: ContentItem[] }) {
  const t = await getTranslations("content.related");
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-content-heading">
      <h2 id="related-content-heading" className="mb-4 text-xl font-bold text-foreground">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
