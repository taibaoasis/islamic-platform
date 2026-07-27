import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ContentBody } from "@/components/content/content-body";
import { CitationBlock } from "@/components/content/citation-block";
import { ShareActions } from "@/components/content/share-actions";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { CourseSidebar } from "@/components/academy/course-sidebar";
import { LessonNavigator } from "@/components/academy/lesson-navigator";
import {
  academyLessons,
  getAdjacentLessons,
  getCourseBySlug,
  getLesson,
  getLessonsForCourse,
} from "@/lib/mock/academy";
import { siteConfig, type Locale } from "@/config/site";
import { PlayCircle, FileDown, FileText } from "@/components/icons";

// Lazy Loading لعنصر ثانوي أسفل الطية (Phase 10 §7).
// Lazy Loading for a secondary below-the-fold element (Phase 10 §7).
const CommentsPlaceholder = dynamic(() => import("@/components/content/comments-placeholder").then((m) => m.CommentsPlaceholder));

export function generateStaticParams() {
  return academyLessons.map((l) => ({ courseSlug: l.courseSlug, lessonSlug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; courseSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { locale, courseSlug, lessonSlug } = await params;
  const lesson = getLesson(courseSlug, lessonSlug);
  const course = getCourseBySlug(courseSlug);
  if (!lesson || !course) return {};
  return {
    title: `${lesson.title} — ${course.title} — ${siteConfig.name}`,
    description: lesson.excerpt,
    alternates: { canonical: `${siteConfig.url}/${locale}/courses/${courseSlug}/${lessonSlug}` },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  const lesson = getLesson(courseSlug, lessonSlug);
  if (!course || !lesson) notFound();

  const t = await getTranslations("academy.lesson");
  const tCatalog = await getTranslations("academy.catalog");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tTheme = await getTranslations("system.theme");

  const lessons = getLessonsForCourse(courseSlug);
  const { previous, next } = getAdjacentLessons(courseSlug, lessonSlug);
  const url = `${siteConfig.url}/courses/${courseSlug}/${lessonSlug}`;

  const navItems = [
    { label: tNav("about"), href: "/about" },
    { label: tNav("quran"), href: "/quran" },
    { label: tNav("hadith"), href: "/hadith" },
    { label: tNav("articles"), href: "/articles" },
    { label: tNav("learning"), href: "/courses" },
    { label: tNav("community"), href: "/community" },
    { label: tNav("dailyTools"), href: "/tools" },
  ];

  const footerColumns = [
    { title: tFooter("about"), links: [{ label: tFooter("aboutUs"), href: "/about-us" }] },
    { title: tFooter("content"), links: [{ label: tNav("learning"), href: "/courses" }] },
    { title: tFooter("support"), links: [{ label: tFooter("helpCenter"), href: "/help" }] },
  ];

  return (
    <>
      <Header
        logo={
          <Link href="/" className="text-lg font-bold text-primary">
            {siteConfig.name}
          </Link>
        }
        navItems={navItems}
        actions={
          <>
            <LanguageSwitcher />
            <ThemeToggle labels={{ light: tTheme("light"), dark: tTheme("dark"), system: tTheme("system") }} />
          </>
        }
      />

      <main id="main-content">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Breadcrumb
            items={[{ label: tCatalog("title"), href: "/courses" }, { label: course.title, href: `/courses/${course.slug}` }, { label: lesson.title }]}
            className="mb-4"
          />
          <p className="mb-4 text-xs font-medium text-muted-foreground">{t("lessonOf", { current: lesson.orderIndex, total: lessons.length })}</p>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              {/* فيديو Mock / Mock video */}
              {lesson.hasVideo ? (
                <div
                  role="img"
                  aria-label={t("videoPlaceholder")}
                  className="mb-6 flex aspect-video items-center justify-center rounded-[var(--radius)] bg-gradient-to-br from-primary/20 to-accent/20"
                >
                  <div className="flex flex-col items-center gap-2 text-foreground/60">
                    <PlayCircle className="size-14" aria-hidden="true" />
                    <p className="text-sm">{t("videoPlaceholder")}</p>
                  </div>
                </div>
              ) : (
                <Card className="mb-6 flex items-center gap-2 p-3 text-sm text-muted-foreground">
                  <FileText className="size-4 shrink-0" aria-hidden="true" />
                  {t("noVideo")}
                </Card>
              )}

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">{lesson.title}</h1>
                <div className="flex items-center gap-1">
                  <ShareActions title={lesson.title} url={url} />
                  <BookmarkButton />
                </div>
              </div>

              {/* نص الدرس — يعيد استخدام ContentBody من محرك المحتوى العام. Lesson text — reuses ContentBody from the Generic Content Engine. */}
              <ContentBody blocks={lesson.blocks} />

              {/* المراجع — يعيد استخدام CitationBlock. References — reuses CitationBlock. */}
              <div className="mt-8">
                <CitationBlock citations={lesson.citations} />
              </div>

              {/* الملفات المرفقة (Placeholder) / Attachments (Placeholder) */}
              <Card className="mt-6 p-4">
                <p className="mb-3 text-sm font-semibold text-foreground">{t("attachmentsTitle")}</p>
                {lesson.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("noAttachments")}</p>
                ) : (
                  <ul className="space-y-2">
                    {lesson.attachments.map((file) => (
                      <li key={file.name} className="flex items-center justify-between gap-2 rounded-[var(--radius)] border border-border p-2.5 text-sm">
                        <span className="flex items-center gap-2 text-foreground/80">
                          <FileDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          {file.name}
                        </span>
                        <Button variant="ghost" size="sm" disabled title={t("download")}>
                          {t("download")}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              {/* زر متابعة التعلّم — واجهة فقط، لا تتبّع حقيقي. Continue-learning button — UI only, no real tracking. */}
              <div className="mt-6">
                <Button className="w-full sm:w-auto">{t("markComplete")}</Button>
              </div>

              <div className="mt-8">
                <LessonNavigator courseSlug={course.slug} previous={previous} next={next} />
              </div>

              <div className="mt-10">
                <CommentsPlaceholder />
              </div>
            </div>

            <CourseSidebar course={course} lessons={lessons} currentLessonOrder={lesson.orderIndex} />
          </div>
        </div>
      </main>

      <Footer
        columns={footerColumns}
        bottomContent={
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name} — {tFooter("rights")}
          </p>
        }
      />
    </>
  );
}
