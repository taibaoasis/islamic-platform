import { surahs } from "@/lib/mock/quran";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";
import { contentLifecycleStatuses } from "@/lib/admin/lifecycle";

/**
 * بيانات وهمية لإدارة محتوى القرآن (Phase 11, Module 2.1) — لا اتصال
 * بقاعدة بيانات ولا API.
 *
 * **قرار معماري مهم:** الجدول يدير سجلات **ترجمة/تفسير الآيات**
 * (شبيهة بـ`QuranTranslation`/`Tafsir` من Content Models)، لا نص الآية
 * العربي الثابت نفسه (`Verse`) — لأن `Verse` بيانات مرجعية (النمط B:
 * Imported/Validated/Active/UnderCorrection) **بلا سير عمل نشر** أصلاً
 * حسب `Content Models §1.3` و`Database Logical Design §0.3`، بخلاف
 * الترجمة التي تخضع للنمط A الكامل (Draft→Review→Scholarly
 * Review→Published→Archived) وتحمل مراجعًا ومُعتمِدًا. تطبيق حرفي لما
 * طلبته هذه المرحلة (حالة + آخر مراجع + نشر/أرشفة) دون التناقض مع
 * حساسية النص القرآني الثابت المُقرَّرة سابقًا.
 *
 * Mock data for Quran content management (Phase 11, Module 2.1) — no
 * database or API connection.
 *
 * **Important architectural decision:** the table manages **verse
 * translation/tafsir records** (akin to `QuranTranslation`/`Tafsir` in
 * Content Models), not the canonical Arabic verse text itself
 * (`Verse`) — because `Verse` is reference data (Pattern B:
 * Imported/Validated/Active/UnderCorrection) with **no publish
 * workflow at all** per `Content Models §1.3` and `Database Logical
 * Design §0.3`, unlike translations which follow the full Pattern A
 * (Draft→Review→Scholarly Review→Published→Archived) and carry a
 * reviewer and approver. A literal application of what this phase
 * requested (status + last reviewer + publish/archive) without
 * contradicting the previously established sensitivity of the fixed
 * Quranic text.
 */

export type QuranContentStatus = ContentLifecycleStatus;
export type QuranContentType = "TRANSLATION" | "TAFSIR";

// إعادة تصدير للتوافق الرجعي — المصدر الوحيد الآن lib/admin/lifecycle.ts (Module 2.2).
// Re-exported for backward compatibility — the single source is now lib/admin/lifecycle.ts (Module 2.2).
export const quranContentStatuses = contentLifecycleStatuses;

export interface QuranContentRow {
  id: string;
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  language: string;
  contentType: QuranContentType;
  status: QuranContentStatus;
  lastModified: string;
  lastReviewer: string | null;
}

const languages = ["ar", "en", "ur", "fr", "id"];
const reviewers = ["د. أحمد المنصوري", "هيئة الإشراف الشرعي", "الشيخ يوسف القرني", null, null];
const statusCycle: QuranContentStatus[] = ["DRAFT", "REVIEW", "SCHOLARLY_REVIEW", "PUBLISHED", "PUBLISHED", "PUBLISHED", "ARCHIVED"];

function buildMockRows(): QuranContentRow[] {
  const rows: QuranContentRow[] = [];
  // أول 12 سورة × حتى 4 آيات × لغتين إلى ثلاث — عيّنة كافية (~90 صفًا)
  // لاختبار البحث والفرز والصفحات دون تحميل كل الـ6236 آية.
  // First 12 surahs × up to 4 verses × two-to-three languages — a
  // sample large enough (~90 rows) to exercise search/sort/pagination
  // without loading all 6236 verses.
  const sampleSurahs = surahs.slice(0, 12);
  let counter = 0;

  for (const surah of sampleSurahs) {
    const verseSample = Math.min(4, surah.verseCount);
    for (let v = 1; v <= verseSample; v++) {
      const langCount = 2 + (counter % 2);
      for (let li = 0; li < langCount; li++) {
        const language = languages[(counter + li) % languages.length]!;
        const status = statusCycle[counter % statusCycle.length]!;
        const reviewer = status === "DRAFT" ? null : reviewers[counter % reviewers.length]!;
        rows.push({
          id: `qc-${surah.number}-${v}-${language}`,
          surahNumber: surah.number,
          surahName: surah.arabicName,
          verseNumber: v,
          language,
          contentType: counter % 5 === 0 ? "TAFSIR" : "TRANSLATION",
          status,
          lastModified: new Date(2026, 6, 1 + (counter % 24), 8 + (counter % 10)).toISOString(),
          lastReviewer: reviewer,
        });
        counter++;
      }
    }
  }
  return rows;
}

export const mockQuranContentRows: QuranContentRow[] = buildMockRows();

// انتقالات الحالة الصالحة — النمط A الكامل من Content Models §0.3،
// بلا اختصار لمرحلة الاعتماد العلمي أبدًا.
// Valid status transitions — the full Pattern A from Content Models
// §0.3, never skipping the scholarly-approval stage.
export const nextStatusAction: Partial<Record<QuranContentStatus, { next: QuranContentStatus; labelKey: "submitForReview" | "approveScholarly" | "publish" }>> = {
  DRAFT: { next: "REVIEW", labelKey: "submitForReview" },
  REVIEW: { next: "SCHOLARLY_REVIEW", labelKey: "approveScholarly" },
  SCHOLARLY_REVIEW: { next: "PUBLISHED", labelKey: "publish" },
};
