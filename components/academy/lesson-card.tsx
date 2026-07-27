import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { CompletionBadge, type CompletionStatus } from "@/components/academy/completion-badge";
import { PlayCircle, FileText, Lock } from "@/components/icons";
import type { AcademyLesson } from "@/lib/mock/academy";

/** LessonCard — عام لأي درس ضمن أي دورة (Phase 10 §4). Generic for any lesson within any course. */
export async function LessonCard({
  lesson,
  courseSlug,
  status = "NOT_STARTED",
  locked = false,
}: {
  lesson: AcademyLesson;
  courseSlug: string;
  status?: CompletionStatus;
  locked?: boolean;
}) {
  const t = await getTranslations("academy.lesson");
  const Icon = locked ? Lock : lesson.hasVideo ? PlayCircle : FileText;

  const content = (
    <div className="flex items-center gap-3 rounded-[var(--radius)] border border-border p-3 hover:bg-secondary/50">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground/80">{lesson.orderIndex}</span>
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{lesson.title}</p>
        <p className="text-xs text-muted-foreground">
          {t("durationMinutes", { count: lesson.durationMinutes })}
          {!lesson.hasVideo && ` · ${t("noVideo")}`}
        </p>
      </div>
      <CompletionBadge status={status} />
    </div>
  );

  if (locked) {
    return <div aria-disabled="true" className="opacity-60">{content}</div>;
  }

  return (
    <Link href={`/courses/${courseSlug}/${lesson.slug}`} className="block rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {content}
    </Link>
  );
}
