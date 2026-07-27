import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { HadithCollectionReader } from "@/components/hadith/hadith-collection-reader";
import { getCollectionBySlug, hadithCollections } from "@/lib/mock/hadith";
import { siteConfig, type Locale } from "@/config/site";

export function generateStaticParams() {
  return hadithCollections.map((c) => ({ collectionSlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; collectionSlug: string }>;
}): Promise<Metadata> {
  const { locale, collectionSlug } = await params;
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return {};
  const t = await getTranslations({ locale, namespace: "hadith" });
  return {
    title: `${collection.arabicName} (${collection.englishName}) — ${t("title")} — ${siteConfig.name}`,
    description: `${collection.arabicName} · ${collection.compiler} · ${t("hadithCountLabel", { count: collection.hadithCount })}`,
  };
}

export default async function HadithCollectionPage({
  params,
}: {
  params: Promise<{ collectionSlug: string }>;
}) {
  const { collectionSlug } = await params;
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) notFound();

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
    { title: tFooter("about"), links: [{ label: tFooter("aboutUs"), href: "/about-us" }] },
    {
      title: tFooter("content"),
      links: [
        { label: tNav("quran"), href: "/quran" },
        { label: tNav("hadith"), href: "/hadith" },
      ],
    },
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
        <HadithCollectionReader collection={collection} />
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
