import { ProgressIndicator } from "@/components/academy/progress-indicator";
import { CurriculumTree } from "@/components/academy/curriculum-tree";
import type { AcademyLesson, Course } from "@/lib/mock/academy";

/**
 * CourseSidebar — Phase 10 §4. نسبة الإنجاز Mock ثابتة (لا تتبّع حقيقي
 * — ممنوع صراحة في هذه المرحلة) مبنية على ترتيب الدرس الحالي فقط، لغرض
 * العرض التوضيحي.
 *
 * CourseSidebar — Phase 10 §4. A fixed Mock completion percentage (no
 * real tracking — explicitly forbidden this phase) derived only from
 * the current lesson's order, for display purposes.
 */
export function CourseSidebar({ course, lessons, currentLessonOrder }: { course: Course; lessons: AcademyLesson[]; currentLessonOrder: number }) {
  const percentage = Math.round(((currentLessonOrder - 1) / lessons.length) * 100);

  return (
    <aside className="sticky top-20 hidden space-y-6 lg:block">
      <div className="rounded-[var(--radius)] border border-border p-4">
        <ProgressIndicator percentage={percentage} completed={currentLessonOrder - 1} total={lessons.length} />
      </div>
      <CurriculumTree lessons={lessons} course={course} />
    </aside>
  );
}
