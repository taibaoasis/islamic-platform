import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { Link } from "@/i18n/navigation";
import { PlayCircle } from "@/components/icons";
import type { AcademyLesson, Course } from "@/lib/mock/academy";
import { cn } from "@/lib/utils";

export async function ContinueLearningCard({ course, lesson }: { course: Course; lesson: AcademyLesson }) {
  const t = await getTranslations("academy.dashboard");

  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PlayCircle className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{course.title}</p>
          <p className="text-sm font-medium text-foreground">{lesson.title}</p>
        </div>
      </div>
      <Link href={`/courses/${course.slug}/${lesson.slug}`} className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
        {t("resume")}
      </Link>
    </Card>
  );
}
