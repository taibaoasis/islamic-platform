import { getTranslations } from "next-intl/server";

import { ListTree } from "@/components/icons";
import type { ContentBlock } from "@/lib/mock/content";

/**
 * TableOfContents — Server Component خالص. التنقّل للعناوين عبر روابط
 * Anchor عادية (`href="#id"`) بلا أي JavaScript — التمرير السلس مُفعَّل
 * عبر `scroll-behavior: smooth` (CSS عام في styles/globals.css من طبقة
 * الأساس)، لا مكتبة Scroll-Spy تحتاج عميلًا تفاعليًا.
 *
 * TableOfContents — a pure Server Component. Navigation to headings
 * uses plain anchor links (`href="#id"`) with zero JavaScript — smooth
 * scrolling comes from `scroll-behavior: smooth` (global CSS already in
 * styles/globals.css from the Foundation layer), not a client-side
 * scroll-spy library.
 */
export async function TableOfContents({ blocks }: { blocks: ContentBlock[] }) {
  const t = await getTranslations("content.toc");
  const headings = blocks.filter((b): b is Extract<ContentBlock, { type: "heading" }> => b.type === "heading");

  if (headings.length === 0) return null;

  return (
    <nav aria-label={t("title")} className="sticky top-20 hidden rounded-[var(--radius)] border border-border p-4 lg:block">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <ListTree className="size-4" aria-hidden="true" />
        {t("title")}
      </p>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "ps-4" : undefined}>
            <a href={`#${heading.id}`} className="text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
