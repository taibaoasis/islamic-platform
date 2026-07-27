import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ContentHeader } from "@/components/content/content-header";
import { ContentBody } from "@/components/content/content-body";
import { TableOfContents } from "@/components/content/table-of-contents";
import { CitationBlock } from "@/components/content/citation-block";
import { TagsSection } from "@/components/content/tags-section";
import { ShareActions } from "@/components/content/share-actions";
import { BookmarkButton } from "@/components/content/bookmark-button";
import { getContentBySlug, getRelatedContent, mockContentItems } from "@/lib/mock/content";
import { siteConfig, type Locale } from "@/config/site";

// Lazy Loading للعناصر الثانوية (Phase 9.5 §4) — لا تُحمَّل حزمتاهما
// إلا عند الحاجة فعليًا لمحتوى أسفل الطية (Below-the-fold)، لا ضمن
// الحزمة الأولية للصفحة.
// Lazy Loading for secondary elements (Phase 9.5 §4) — their bundles
// aren't loaded until actually needed for below-the-fold content, not
// bundled into the page's initial chunk.
const RelatedContent = dynamic(() => import("@/components/content/related-content").then((m) => m.RelatedContent));
const CommentsPlaceholder = dynamic(() => import("@/components/content/comments-placeholder").then((m) => m.CommentsPlaceholder));

const articles = mockContentItems.filter((c) => c.kind === "article");

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) return {};
  const url = `${siteConfig.url}/${locale}/articles/${item.slug}`;

  return {
    title: `${item.title} — ${siteConfig.name}`,
    description: item.excerpt,
    authors: [{ name: item.author.name }],
    alternates: { canonical: url },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: item.publishedAt,
      modifiedTime: item.updatedAt,
      authors: [item.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getContentBySlug(slug);
  if (!item || item.kind !== "article") notFound();

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

  const url = `${siteConfig.url}/${locale}/articles/${item.slug}`;

  // Structured Data — Article Schema (Phase 9.5 §3)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    author: { "@type": "Person", name: item.author.name },
    datePublished: item.publishedAt,
    dateModified: item.updatedAt ?? item.publishedAt,
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  // Structured Data — BreadcrumbList Schema (Phase 9.5 §3)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteConfig.name, item: `${siteConfig.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${siteConfig.url}/${locale}/articles` },
      { "@type": "ListItem", position: 3, name: item.title, item: url },
    ],
  };

  const related = getRelatedContent(item);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
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
        <Container narrow className="py-8 sm:py-12">
          <Breadcrumb items={[{ label: t("title"), href: "/articles" }, { label: item.title }]} className="mb-6" />
        </Container>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_240px] lg:px-8">
          <article>
            <ContentHeader item={item} />

            <div className="mb-6 flex items-center justify-end gap-1">
              <ShareActions title={item.title} url={url} />
              <BookmarkButton />
            </div>

            <ContentBody blocks={item.blocks} />

            <div className="mt-8">
              <CitationBlock citations={item.citations} />
            </div>

            <div className="mt-6">
              <TagsSection tags={item.tags} />
            </div>

            <div className="mt-10">
              <RelatedContent items={related} />
            </div>

            <div className="mt-10">
              <CommentsPlaceholder />
            </div>
          </article>

          <aside>
            <TableOfContents blocks={item.blocks} />
          </aside>
        </div>

        <div className="h-12" />
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
