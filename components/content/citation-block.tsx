import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { BookOpen, ScrollText, MessageCircleQuestion } from "@/components/icons";
import type { ContentCitation } from "@/lib/mock/content";

const iconBySourceType = { quran: BookOpen, hadith: ScrollText, fatwa: MessageCircleQuestion } as const;

/**
 * CitationBlock — "نظام الإسناد الإلزامي" (Master Project Document)
 * مُطبَّقًا على مستوى مكوّن عام قابل لإعادة الاستخدام — أي محتوى (مقالة،
 * فتوى، كتاب) يستشهد بمصادر عبر نفس هذا المكوّن.
 *
 * CitationBlock — the "mandatory attribution system" (Master Project
 * Document) applied as a generic, reusable component — any content
 * (article, fatwa, book) cites sources through this same component.
 */
export async function CitationBlock({ citations }: { citations: ContentCitation[] }) {
  const t = await getTranslations("content.citations");
  if (citations.length === 0) return null;

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{t("title")}</p>
      <ul className="flex flex-wrap gap-2">
        {citations.map((citation) => {
          const Icon = iconBySourceType[citation.sourceType];
          return (
            <li key={citation.href}>
              <Link
                href={citation.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {citation.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
