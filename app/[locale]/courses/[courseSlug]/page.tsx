import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { InstructorCard } from "@/components/academy/instructor-card";
import { CurriculumTree } from "@/components/academy/curriculum-tree";
import { getCourseBySlug, getLessonsForCourse, courses, courseLevelLabels, courseBadgeLabels } from "@/lib/mock/academy";
import { mockContentItems } from "@/lib/mock/content";
import { siteConfig, type Locale } from "@/config/site";
import { Clock3, CheckCircle2, ListChecks } from "@/components/icons";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Lazy Loading — نفس نمط Phase 9.5 (محتوى أسفل الطية). Same pattern as Phase 9.5 (below-the-fold content).
const RelatedContent = dynamic(() => import("@/components/content/related-content").then((m) => m.RelatedContent));

const badgeVariant = { FREE: "success", COMING_SOON: "warning" } as const;
const levelVariant = { BEGINNER: "success", INTERMEDIATE: "warning", ADVANCED: "info" } as const;

export function generateStaticParams() {
  return courses.map((c) => ({ courseSlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; courseSlug: string }>;
}): Promise<Metadata> {
  const { locale, courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) return {};
  return {
    title: `${course.title} — ${siteConfig.name}`,
    description: course.description,
    alternates: { canonical: `${siteConfig.url}/${locale}/courses/${course.slug}` },
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const t = await getTranslations("academy.course");
  const tCatalog = await getTranslations("academy.catalog");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tTheme = await getTranslations("system.theme");
  const locale = (await getLocale()) as Locale;

  const lessons = getLessonsForCourse(course.slug);

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

  // المحتوى المرتبط — يعيد استخدام RelatedContent من محرك المحتوى العام
  // (Phase 9.5) عبر مطابقة تصنيف/مواضيع الدورة مع محتوى موجود فعليًا
  // (بصرف النظر عن نوعه: مقالة أو فتوى)، إثباتًا إضافيًا لتكامل الوحدتين.
  // Related content — reuses RelatedContent from the Generic Content
  // Engine (Phase 9.5) by matching the course's category/topics against
  // real existing content (regardless of kind: article or fatwa),
  // further proof of the two modules' integration.
  const related = mockContentItems.filter((c) => c.topics.some((topic) => course.topics.includes(topic))).slice(0, 3);

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
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Breadcrumb items={[{ label: tCatalog("title"), href: "/courses" }, { label: course.title }]} className="mb-6" />

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{course.category}</Badge>
            <Badge variant={levelVariant[course.level]}>{courseLevelLabels[course.level][locale === "ar" ? "ar" : "en"]}</Badge>
            <Badge variant={badgeVariant[course.badge]}>{courseBadgeLabels[course.badge][locale === "ar" ? "ar" : "en"]}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{course.title}</h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock3 className="size-4" aria-hidden="true" />
            {course.durationLabel}
          </p>

          {course.badge === "COMING_SOON" && (
            <Card className="mt-4 border-warning/30 bg-warning/10 p-3 text-sm text-foreground">{t("comingSoonNotice")}</Card>
          )}

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <section>
                <h2 className="mb-2 text-lg font-bold text-foreground">{t("aboutTitle")}</h2>
                <p className="text-muted-foreground">{course.description}</p>
              </section>

              <section>
                <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-foreground">
                  <ListChecks className="size-5" aria-hidden="true" />
                  {t("objectivesTitle")}
                </h2>
                <ul className="space-y-1.5">
                  {course.objectives.map((objective) => (
                    <li key={objective} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-bold text-foreground">{t("requirementsTitle")}</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {course.requirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </section>

              {lessons.length > 0 && (
                <section>
                  <CurriculumTree lessons={lessons} course={course} />
                  {course.badge !== "COMING_SOON" && (
                    <Link href={`/courses/${course.slug}/${lessons[0]!.slug}`} className={cn(buttonVariants({ variant: "primary" }), "mt-4")}>
                      {t("startLearning")}
                    </Link>
                  )}
                </section>
              )}

              {related.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-bold text-foreground">{t("relatedContentTitle")}</h2>
                  <RelatedContent items={related} />
                </section>
              )}
            </div>

            <div>
              <InstructorCard instructor={course.instructor} />
            </div>
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
