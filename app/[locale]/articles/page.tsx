import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ContentCard } from "@/components/content/content-card";
import { ArticlesIndex } from "@/components/content/articles-index";
import { mockContentItems } from "@/lib/mock/content";
import { siteConfig, type Locale } from "@/config/site";

const articles = mockContentItems.filter((c) => c.kind === "article");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "content.list" });
  const url = `${siteConfig.url}/${locale}/articles`;
  return {
    title: `${t("title")} — ${siteConfig.name}`,
    description: t("description"),
    alternates: { canonical: url },
    openGraph: { title: t("title"), description: t("description"), url, siteName: siteConfig.name, type: "website" },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export default async function ArticlesIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("content.list");
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
    { title: tFooter("content"), links: [{ label: tNav("articles"), href: "/articles" }] },
    { title: tFooter("support"), links: [{ label: tFooter("helpCenter"), href: "/help" }] },
  ];

  // ContentCard مكوّن Server غير متزامن — يُصيَّر هنا مسبقًا لكل مقالة،
  // ثم يُمرَّر جاهزًا لمكوّن العميل ليقتصر دوره على التصفية (§ArticlesIndex).
  // ContentCard is an async Server Component — pre-rendered here per
  // article, then passed pre-built into the client component whose role
  // is limited to filtering (see ArticlesIndex).
  const renderedCards = Object.fromEntries(
    await Promise.all(articles.map(async (item) => [item.id, <ContentCard key={item.id} item={item} />] as const))
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteConfig.name, item: `${siteConfig.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${siteConfig.url}/${locale}/articles` },
    ],
  };

  return (
    <>
      {/* Breadcrumb Structured Data — Phase 9.5 §3 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Breadcrumb items={[{ label: t("title") }]} className="mb-6" />
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

          <div className="mt-6">
            <ArticlesIndex items={articles} renderedCards={renderedCards} />
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
