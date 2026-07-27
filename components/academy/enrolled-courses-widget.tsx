import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { GraduationCap } from "@/components/icons";
import { ProgressIndicator } from "@/components/academy/progress-indicator";
import type { Course } from "@/lib/mock/academy";

export async function EnrolledCoursesWidget({ courses }: { courses: { course: Course; percentage: number }[] }) {
  const t = await getTranslations("academy.dashboard.enrolledCourses");

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{t("title")}</p>
      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="space-y-4">
          {courses.map(({ course, percentage }) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.slug}`}
                className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <GraduationCap className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {course.title}
              </Link>
              <ProgressIndicator percentage={percentage} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
