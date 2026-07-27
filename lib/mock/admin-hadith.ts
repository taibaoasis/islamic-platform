import { hadithCollections, mockHadithsByCollection, type HadithGrade } from "@/lib/mock/hadith";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";

/**
 * بيانات وهمية لإدارة محتوى الحديث (Phase 11, Module 2.2) — لا اتصال
 * بقاعدة بيانات ولا API.
 *
 * **نفس القرار المعماري المعتمَد في Module 2.1** (Quran): الجدول يدير
 * سجلات **ترجمة الحديث** لكل لغة (تخضع للنمط A الكامل: Draft→Review→
 * Scholarly Review→Published→Archived)، لا متن الحديث العربي ولا درجته
 * أنفسهما (بيانات مرجعية من `lib/mock/hadith.ts`، النمط B — بلا سير
 * عمل نشر). الراوي والدرجة والباب أدناه **حقول مرجعية معروضة من
 * الحديث الأصلي**، لا حقولاً قابلة للتحرير عبر سير العمل هنا.
 *
 * Mock data for Hadith content management (Phase 11, Module 2.2) — no
 * database or API connection.
 *
 * **The exact same architectural decision approved in Module 2.1**
 * (Quran): the table manages **hadith translation** records per
 * language (following the full Pattern A: Draft→Review→Scholarly
 * Review→Published→Archived), not the Arabic matn or grade themselves
 * (reference data from `lib/mock/hadith.ts`, Pattern B — no publish
 * workflow). The narrator, grade, and chapter below are **reference
 * fields displayed from the source hadith**, not fields editable via
 * the workflow here.
 */

export interface HadithContentRow {
  id: string;
  hadithNumber: number;
  collectionSlug: string;
  collectionName: string;
  chapter: string;
  narrator: string;
  grade: HadithGrade;
  matnExcerpt: string;
  language: string;
  status: ContentLifecycleStatus;
  lastReviewedAt: string | null;
}

const languages = ["ar", "en", "ur", "fr"];
const statusCycle: ContentLifecycleStatus[] = ["DRAFT", "REVIEW", "SCHOLARLY_REVIEW", "PUBLISHED", "PUBLISHED", "ARCHIVED"];

function buildMockRows(): HadithContentRow[] {
  const rows: HadithContentRow[] = [];
  let counter = 0;

  for (const collection of hadithCollections) {
    const hadiths = mockHadithsByCollection[collection.slug] ?? [];
    for (const hadith of hadiths) {
      const langCount = 1 + (counter % 3);
      for (let li = 0; li < langCount; li++) {
        const language = languages[(counter + li) % languages.length]!;
        const status = statusCycle[counter % statusCycle.length]!;
        rows.push({
          id: `hc-${collection.slug}-${hadith.numberInCollection}-${language}`,
          hadithNumber: hadith.numberInCollection,
          collectionSlug: collection.slug,
          collectionName: collection.arabicName,
          chapter: hadith.topic,
          narrator: hadith.narrators[0] ?? "—",
          grade: hadith.grade,
          matnExcerpt: hadith.matnPlaceholder,
          language,
          status,
          lastReviewedAt: status === "DRAFT" ? null : new Date(2026, 6, 1 + (counter % 24), 9 + (counter % 8)).toISOString(),
        });
        counter++;
      }
    }
  }
  return rows;
}

export const mockHadithContentRows: HadithContentRow[] = buildMockRows();
