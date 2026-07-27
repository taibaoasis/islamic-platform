import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import type { AcademyLesson } from "@/lib/mock/academy";
import { cn } from "@/lib/utils";

export async function LessonNavigator({
  courseSlug,
  previous,
  next,
}: {
  courseSlug: string;
  previous?: AcademyLesson;
  next?: AcademyLesson;
}) {
  const t = await getTranslations("academy.lesson");

  return (
    <nav aria-label={t("previousLesson")} className="flex items-center justify-between gap-4 border-t border-border pt-6">
      {previous ? (
        <Link href={`/courses/${courseSlug}/${previous.slug}`} className={cn(buttonVariants({ variant: "outline" }))}>
          <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          <span className="flex flex-col items-start text-start">
            <span className="text-xs text-muted-foreground">{t("previousLesson")}</span>
            <span>{previous.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/courses/${courseSlug}/${next.slug}`} className={cn(buttonVariants({ variant: "outline" }))}>
          <span className="flex flex-col items-end text-end">
            <span className="text-xs text-muted-foreground">{t("nextLesson")}</span>
            <span>{next.title}</span>
          </span>
          <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
