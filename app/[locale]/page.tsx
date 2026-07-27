import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { HeroSection } from "@/components/home/hero-section";
import { QuickAccessSection } from "@/components/home/quick-access-section";
import { FeaturedContentSection } from "@/components/home/featured-content-section";
import { LearningSection } from "@/components/home/learning-section";
import { StatsSection } from "@/components/home/stats-section";
import { LatestContentSection } from "@/components/home/latest-content-section";
import { AIAssistantSection } from "@/components/home/ai-assistant-section";
import { CTASection } from "@/components/home/cta-section";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return {
    title: `${siteConfig.name} — ${t("title")}`,
    description: t("description"),
  };
}

/**
 * الصفحة الرئيسية — Phase 9.1. كل الأقسام التسعة مبنية حصرًا من مكوّنات
 * components/ui/ الموجودة مسبقًا (Phase 8) + بيانات وهمية من
 * lib/mock/home-page.ts. لا Prisma، لا API، لا مصادقة فعلية.
 *
 * Home page — Phase 9.1. All nine sections are built exclusively from
 * existing components/ui/ (Phase 8) + mock data from
 * lib/mock/home-page.ts. No Prisma, no API, no real authentication.
 */
export default async function HomePage() {
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tTheme = await getTranslations("system.theme");

  const navItems = [
    { label: tNav("about"), href: "/about" },
    { label: tNav("quran"), href: "/quran" },
    { label: tNav("hadith"), href: "/hadith" },
    { label: tNav("fiqh"), href: "/fiqh" },
    { label: tNav("learning"), href: "/courses" },
    { label: tNav("community"), href: "/community" },
    { label: tNav("dailyTools"), href: "/tools" },
  ];

  const footerColumns = [
    {
      title: tFooter("about"),
      links: [
        { label: tFooter("aboutUs"), href: "/about-us" },
        { label: tFooter("scholarBoard"), href: "/scholar-board" },
        { label: tFooter("partners"), href: "/partners" },
        { label: tFooter("careers"), href: "/careers" },
      ],
    },
    {
      title: tFooter("content"),
      links: [
        { label: tNav("quran"), href: "/quran" },
        { label: tNav("hadith"), href: "/hadith" },
        { label: tFooter("library"), href: "/books" },
        { label: tFooter("dailyTools"), href: "/tools" },
      ],
    },
    {
      title: tFooter("support"),
      links: [
        { label: tFooter("helpCenter"), href: "/help" },
        { label: tFooter("contactUs"), href: "/contact" },
        { label: tFooter("privacyPolicy"), href: "/privacy" },
        { label: tFooter("termsOfService"), href: "/terms" },
      ],
    },
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
        <HeroSection />
        <QuickAccessSection />
        <FeaturedContentSection />
        <LearningSection />
        <StatsSection />
        <LatestContentSection />
        <AIAssistantSection />
        <CTASection />
      </main>

      <Footer
        columns={footerColumns}
        bottomContent={
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} {siteConfig.name} — {tFooter("rights")}
            </p>
            <Link href="/donate" className="font-medium text-primary hover:underline">
              {tFooter("donate")}
            </Link>
          </div>
        }
      />
    </>
  );
}
