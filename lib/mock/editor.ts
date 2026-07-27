import type { ContentBlock, ContentItem } from "@/lib/mock/content";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";

/**
 * بيانات وهمية لمحرر المحتوى المؤسسي (Phase 11, Module 3) — لا اتصال
 * بقاعدة بيانات ولا API. **لا حفظ حقيقي**: `loadEditableDraft` ينسخ
 * عنصرًا من `mockContentItems` (محرك المحتوى العام، Phase 9.5) في حالة
 * محلية جديدة عند فتح المحرر — أي تعديل يبقى في ذاكرة المتصفح فقط
 * ويُفقَد عند إعادة التحميل، تمامًا كما طُلب.
 *
 * Mock data for the Enterprise Content Editor (Phase 11, Module 3) — no
 * database or API connection. **No real persistence**:
 * `loadEditableDraft` copies an item from `mockContentItems` (Generic
 * Content Engine, Phase 9.5) into fresh local state when the editor
 * opens — any edit stays in browser memory only and is lost on reload,
 * exactly as requested.
 */

export interface EditableDraft {
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  language: string;
  status: ContentLifecycleStatus;
  tags: string[];
  blocks: ContentBlock[];
  // Sidebar — SEO / Open Graph / نشر
  slug: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
  publishDate: string;
  reviewStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
}

export function loadEditableDraft(item: ContentItem): EditableDraft {
  return {
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    authorName: item.author.name,
    language: "ar",
    status: "DRAFT",
    tags: [...item.tags],
    blocks: [...item.blocks],
    slug: item.slug,
    seoMetaTitle: item.title,
    seoMetaDescription: item.excerpt,
    ogTitle: item.title,
    ogDescription: item.excerpt,
    canonicalUrl: `/articles/${item.slug}`,
    publishDate: item.publishedAt,
    reviewStatus: "NOT_SUBMITTED",
  };
}

export const workflowOrder: ContentLifecycleStatus[] = ["DRAFT", "REVIEW", "SCHOLARLY_REVIEW", "PUBLISHED", "ARCHIVED"];

let blockIdCounter = 0;
function newBlockId() {
  blockIdCounter += 1;
  return `block-${Date.now()}-${blockIdCounter}`;
}

/** قوالب فارغة لكل نوع كتلة — تُستخدَم عند "إضافة كتلة جديدة" في المحرر. Empty templates per block type — used when "adding a new block" in the editor. */
export function createEmptyBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "heading":
      return { type: "heading", id: newBlockId(), level: 2, text: "" };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "quote":
      return { type: "quote", text: "", attribution: "" };
    case "citation":
      return { type: "citation", label: "", sourceType: "quran", href: "" };
    case "quranVerse":
      return { type: "quranVerse", reference: "", href: "" };
    case "hadith":
      return { type: "hadith", reference: "", grade: "SAHIH", href: "" };
    case "image":
      return { type: "image", altText: "", caption: "" };
    case "video":
      return { type: "video", title: "", caption: "" };
    case "audio":
      return { type: "audio", title: "", caption: "" };
    case "table":
      return { type: "table", headers: ["", ""], rows: [["", ""]] };
    case "list":
      return { type: "list", ordered: false, items: [""] };
    case "divider":
      return { type: "divider" };
    case "callout":
      return { type: "callout", variant: "info", text: "" };
  }
}

export const blockTypeOrder: ContentBlock["type"][] = [
  "paragraph",
  "heading",
  "quote",
  "citation",
  "quranVerse",
  "hadith",
  "image",
  "video",
  "audio",
  "table",
  "list",
  "divider",
  "callout",
];

/** يدمج حالة التحرير المحلية مع العنصر الأصلي لبناء شكل ContentItem الذي تحتاجه ContentPreview — بلا أي حفظ حقيقي. Merges local editor state back into the original item to build the ContentItem shape ContentPreview needs — no real persistence. */
export function draftToPreviewItem(original: ContentItem, draft: EditableDraft): ContentItem {
  return {
    ...original,
    title: draft.title,
    excerpt: draft.excerpt,
    category: draft.category,
    tags: draft.tags,
    blocks: draft.blocks,
    slug: draft.slug,
    publishedAt: draft.publishDate,
    author: { ...original.author, name: draft.authorName },
  };
}
