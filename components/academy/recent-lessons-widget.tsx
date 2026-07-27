import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { PlayCircle, FileText } from "@/components/icons";
import type { AcademyLesson } from "@/lib/mock/academy";
import { getCourseBySlug } from "@/lib/mock/academy";

export async function RecentLessonsWidget({ lessons }: { lessons: AcademyLesson[] }) {
  const t = await getTranslations("academy.dashboard.recentLessons");

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{t("title")}</p>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((lesson) => {
            const course = getCourseBySlug(lesson.courseSlug);
            const Icon = lesson.hasVideo ? PlayCircle : FileText;
            return (
              <li key={lesson.id}>
                <Link
                  href={`/courses/${lesson.courseSlug}/${lesson.slug}`}
                  className="flex items-center gap-2.5 rounded-[var(--radius)] p-2 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{lesson.title}</p>
                    {course && <p className="truncate text-xs text-muted-foreground">{course.title}</p>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
