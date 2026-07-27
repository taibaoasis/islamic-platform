import type { ContentLifecycleStatus } from "@/components/admin/status-badge";

/**
 * تحسين عام استُخرِج أثناء Module 2.2 — كانت قائمة الحالات الخمس
 * مكرَّرة داخل `lib/mock/admin-quran.ts` باسم `quranContentStatuses`؛
 * نُقلت هنا كمصدر وحيد يخدم كل صفحات الإدارة الحالية والمستقبلية.
 *
 * General improvement extracted during Module 2.2 — the five-status
 * list was duplicated inside `lib/mock/admin-quran.ts` as
 * `quranContentStatuses`; moved here as the single source serving every
 * current and future admin content page.
 */
export const contentLifecycleStatuses: ContentLifecycleStatus[] = ["DRAFT", "REVIEW", "SCHOLARLY_REVIEW", "PUBLISHED", "ARCHIVED"];
