import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { SurahReader } from "@/components/quran/surah-reader";
import { getSurahByNumber, surahs } from "@/lib/mock/quran";
import { siteConfig, type Locale } from "@/config/site";

export function generateStaticParams() {
  return surahs.map((s) => ({ surahNumber: String(s.number) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; surahNumber: string }>;
}): Promise<Metadata> {
  const { locale, surahNumber } = await params;
  const surah = getSurahByNumber(Number(surahNumber));
  if (!surah) return {};
  const t = await getTranslations({ locale, namespace: "quran" });
  return {
    title: `${surah.arabicName} (${surah.englishName}) — ${t("title")} — ${siteConfig.name}`,
    description: `${surah.arabicName} · ${surah.transliteratedName} · ${t("verseCountLabel", { count: surah.verseCount })}`,
  };
}

/**
 * صفحة سورة واحدة — Phase 9.3، القسم 5. Server Component (لأجل
 * generateStaticParams/generateMetadata) يُصيِّر SurahReader. بيانات
 * وهمية بالكامل، بلا Prisma ولا API.
 *
 * Single surah page — Phase 9.3, section 5. A Server Component (for
 * generateStaticParams/generateMetadata) rendering SurahReader. Fully
 * mock data, no Prisma or API.
 */
export default async function SurahPage({
  params,
}: {
  params: Promise<{ surahNumber: string }>;
}) {
  const { surahNumber } = await params;
  const surah = getSurahByNumber(Number(surahNumber));
  if (!surah) notFound();

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
      links: [{ label: tFooter("aboutUs"), href: "/about-us" }],
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
      links: [{ label: tFooter("helpCenter"), href: "/help" }],
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
        <SurahReader surah={surah} />
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
