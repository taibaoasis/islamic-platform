import { mockContentItems, type ContentItem, type ContentKind } from "@/lib/mock/content";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";

/**
 * طبقة إدارة عامة فوق محرك المحتوى العام (Phase 9.5) — لا اتصال بقاعدة
 * بيانات ولا API.
 *
 * **نفس نمط Module 2.1/2.2 بالضبط:** `mockContentItems` (من Phase 9.5)
 * بيانات محتوى منشورة بالفعل (بلا حقول سير عمل — كانت غير ضرورية
 * لمحرك عرض عام للزوار). هذه الطبقة تُغلِّفها بحقول سير العمل
 * (`status`, `language`, `lastReviewer`) عبر إنشاء صف واحد أو أكثر
 * لكل عنصر (نسخة لغوية واحدة على الأقل)، **دون تعديل `ContentItem` نفسه
 * أو أي مكوّن من محرك المحتوى العام**.
 *
 * A generic admin layer over the Generic Content Engine (Phase 9.5) —
 * no database or API connection.
 *
 * **The exact same pattern as Module 2.1/2.2:** `mockContentItems`
 * (from Phase 9.5) is already-published content data (with no workflow
 * fields — unnecessary for a public-facing display engine). This layer
 * wraps it with workflow fields (`status`, `language`, `lastReviewer`)
 * by generating one or more rows per item (at least one language
 * variant), **without modifying `ContentItem` itself or any Generic
 * Content Engine component**.
 */

export interface AdminContentRow {
  id: string;
  kind: ContentKind;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  language: string;
  status: ContentLifecycleStatus;
  lastModified: string;
  lastReviewer: string | null;
  citationsCount: number;
}

const languages = ["ar", "en", "ur", "fr"];
const statusCycle: ContentLifecycleStatus[] = ["DRAFT", "REVIEW", "SCHOLARLY_REVIEW", "PUBLISHED", "PUBLISHED", "ARCHIVED"];
const reviewers = ["د. أحمد المنصوري", "هيئة الإشراف الشرعي", "الشيخ يوسف القرني", null];

function buildRowsFor(item: ContentItem, counterStart: number): AdminContentRow[] {
  const rows: AdminContentRow[] = [];
  const langCount = 1 + (counterStart % 3);
  for (let li = 0; li < langCount; li++) {
    const counter = counterStart + li;
    const language = languages[counter % languages.length]!;
    const status = statusCycle[counter % statusCycle.length]!;
    rows.push({
      id: `${item.id}-${language}`,
      kind: item.kind,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      authorName: item.author.name,
      language,
      status,
      lastModified: item.updatedAt ?? item.publishedAt,
      lastReviewer: status === "DRAFT" ? null : reviewers[counter % reviewers.length]!,
      citationsCount: item.citations.length,
    });
  }
  return rows;
}

export const mockAdminContentRows: AdminContentRow[] = mockContentItems.flatMap((item, index) => buildRowsFor(item, index * 3));

/** خريطة مسار الرابط لكل نوع محتوى — نفس النمط المستخدَم في ContentCard (Phase 9.5). URL segment map per content kind — same pattern used in ContentCard (Phase 9.5). */
export const contentKindUrlSegment: Record<ContentKind, string> = {
  article: "articles",
  fatwa: "fatwas",
  book: "books",
  lesson: "lessons",
  news: "news",
};

export function getKindFromUrlSegment(segment: string): ContentKind | undefined {
  const entry = Object.entries(contentKindUrlSegment).find(([, seg]) => seg === segment);
  return entry?.[0] as ContentKind | undefined;
}
