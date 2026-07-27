import { getTranslations, getLocale } from "next-intl/server";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { GraduationCap, Clock3 } from "@/components/icons";
import { courseBadgeLabels, courseLevelLabels, getLessonsForCourse, type Course } from "@/lib/mock/academy";
import type { Locale } from "@/config/site";

const badgeVariant = { FREE: "success", COMING_SOON: "warning" } as const;
const levelVariant = { BEGINNER: "success", INTERMEDIATE: "warning", ADVANCED: "info" } as const;

/**
 * CourseCard — Phase 10 §4. يعرض: التصنيف، مستوى الدورة، عدد الدروس،
 * المدة، المدرّس، وشارة مجاني/قريبًا — كل عنصر مطلوب صراحة في هذه
 * المرحلة (§1).
 */
export async function CourseCard({ course }: { course: Course }) {
  const t = await getTranslations("academy.card");
  const locale = (await getLocale()) as Locale;
  const lessonsCount = getLessonsForCourse(course.slug).length;

  return (
    <Link href={`/courses/${course.slug}`} className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card interactive className="flex h-full flex-col">
        <div aria-hidden="true" className="flex h-28 items-center justify-center rounded-t-lg bg-gradient-to-br from-primary/20 to-accent/20">
          <GraduationCap className="size-8 text-primary/60" aria-hidden="true" />
        </div>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{course.category}</Badge>
            <Badge variant={levelVariant[course.level]}>{courseLevelLabels[course.level][locale === "ar" ? "ar" : "en"]}</Badge>
            <Badge variant={badgeVariant[course.badge]}>{courseBadgeLabels[course.badge][locale === "ar" ? "ar" : "en"]}</Badge>
          </div>
          <CardTitle className="text-base">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span>{t("instructor", { name: course.instructor.name })}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {t("duration", { duration: course.durationLabel })}
          </span>
        </CardContent>
        <CardFooter>
          <span className="text-sm font-medium text-primary">{t("lessonsCount", { count: lessonsCount })}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
