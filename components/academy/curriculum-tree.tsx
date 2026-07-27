import { getTranslations } from "next-intl/server";

import { LessonCard } from "@/components/academy/lesson-card";
import type { AcademyLesson, Course } from "@/lib/mock/academy";

/**
 * CurriculumTree — Phase 10 §4. مصفوفة الدروس مرتَّبة (`orderIndex`)،
 * تُستخدَم في صفحة الدورة وفي CourseSidebar معًا من نفس البيانات.
 * CurriculumTree — Phase 10 §4. The ordered lesson array, used on both
 * the course page and CourseSidebar from the same data.
 */
export async function CurriculumTree({ lessons, course }: { lessons: AcademyLesson[]; course: Course }) {
  const t = await getTranslations("academy.course");

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-foreground">{t("curriculumTitle")}</p>
      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonCard lesson={lesson} courseSlug={course.slug} locked={course.badge === "COMING_SOON"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
