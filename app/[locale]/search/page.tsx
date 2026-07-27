import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { SearchExperience } from "@/components/search/search-experience";
import { siteConfig, type Locale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return {
    title: `${t("title")} — ${siteConfig.name}`,
    description: t("startPrompt.description"),
  };
}

/**
 * صفحة البحث — Phase 9.2. Server Component (لأجل generateMetadata/SEO)
 * تُصيِّر SearchExperience كحد تفاعلي وحيد. بلا Prisma، بلا API، بيانات
 * وهمية بالكامل (lib/mock/search.ts).
 *
 * Search page — Phase 9.2. A Server Component (for
 * generateMetadata/SEO) that renders SearchExperience as the single
 * interactive boundary. No Prisma, no API, fully mock data
 * (lib/mock/search.ts).
 */
export default async function SearchPage() {
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
      ],
    },
    {
      title: tFooter("content"),
      links: [
        { label: tNav("quran"), href: "/quran" },
        { label: tNav("hadith"), href: "/hadith" },
      ],
    },
    {
      title: tFooter("support"),
      links: [
        { label: tFooter("helpCenter"), href: "/help" },
        { label: tFooter("privacyPolicy"), href: "/privacy" },
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
        <SearchExperience />
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
