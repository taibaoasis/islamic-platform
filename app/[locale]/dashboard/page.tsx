import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { requireAuthentication } from "@/lib/auth/server";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { RecentLessonsWidget } from "@/components/academy/recent-lessons-widget";
import { EnrolledCoursesWidget } from "@/components/academy/enrolled-courses-widget";
import { CompletionRateWidget } from "@/components/academy/completion-rate-widget";
import { CertificatesWidget } from "@/components/academy/certificates-widget";
import { academyLessons, courses } from "@/lib/mock/academy";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "academy.dashboard" });
  return { title: `${t("title")} — ${siteConfig.name}` };
}

/**
 * صفحة استضافة Widgets فقط — Phase 10 §5 يطلب "Widgets فقط" لا لوحة
 * تحكم كاملة (تلك محجوزة لمرحلة "لوحة التحكم (Admin)" اللاحقة المُعلَنة
 * في خارطة الطريق الأصلية). هذه صفحة "تعلّمي" خفيفة للمتعلِّم لاستضافة
 * الأربعة Widgets والتحقق منها فعليًا فقط، لا الإدارة الكاملة.
 *
 * Widget-hosting page only — Phase 10 §5 asks for "widgets only", not a
 * full dashboard (that's reserved for the later "Admin Dashboard" phase
 * already announced in the original roadmap). This is a lightweight
 * learner-facing "My Learning" page to host and actually verify the
 * four widgets, not full administration.
 */
export default async function DashboardPage() {
  await requireAuthentication();

  const t = await getTranslations("academy.dashboard");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tTheme = await getTranslations("system.theme");

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

  // بيانات "المستخدم الحالي" الوهمية — لا مصادقة، لا تتبّع حقيقي.
  // Mock "current user" data — no auth, no real tracking.
  const recentLessons = academyLessons.slice(0, 3);
  const enrolledCourses = courses.slice(0, 2).map((course, i) => ({ course, percentage: i === 0 ? 45 : 10 }));
  const overallPercentage = 28;

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
          <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h1>

          <div className="grid gap-6 sm:grid-cols-2">
            <CompletionRateWidget percentage={overallPercentage} />
            <CertificatesWidget />
            <EnrolledCoursesWidget courses={enrolledCourses} />
            <RecentLessonsWidget lessons={recentLessons} />
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
