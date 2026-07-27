import { ContentHeader } from "@/components/content/content-header";
import { ContentBody } from "@/components/content/content-body";
import { CitationBlock } from "@/components/content/citation-block";
import { TagsSection } from "@/components/content/tags-section";
import type { ContentItem } from "@/lib/mock/content";

/**
 * ContentPreview — Phase 11, Module 3 §"Preview". **يستورد نفس مكوّنات
 * محرك المحتوى العام حرفيًا (Phase 9.5) — لا نسخة موازية واحدة.** هذا
 * يعني أن أي تحسين مستقبلي على `ContentBody` (مثلاً) ينعكس تلقائيًا في
 * كل من الصفحة العامة والمعاينة داخل المحرر معًا، من مصدر واحد.
 *
 * ContentPreview — Phase 11, Module 3, "Preview" section. **Imports the
 * exact same Generic Content Engine components verbatim (Phase 9.5) —
 * not a single parallel copy.** This means any future improvement to
 * `ContentBody` (for example) automatically reflects in both the public
 * page and the editor's preview, from one source.
 */
export function ContentPreview({ item }: { item: ContentItem }) {
  return (
    <article className="mx-auto max-w-3xl">
      <ContentHeader item={item} />
      <ContentBody blocks={item.blocks} />
      <div className="mt-8">
        <CitationBlock citations={item.citations} />
      </div>
      <div className="mt-6">
        <TagsSection tags={item.tags} />
      </div>
    </article>
  );
}
