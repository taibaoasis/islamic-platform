import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { CategoryBadge } from "@/components/content/category-badge";
import { ReadingTime } from "@/components/content/reading-time";
import { AuthorInfo } from "@/components/content/author-info";
import type { ContentItem } from "@/lib/mock/content";
import { ArrowLeft } from "@/components/icons";

const kindRoute: Record<ContentItem["kind"], string> = {
  article: "/articles",
  fatwa: "/fatwa",
  book: "/books",
  lesson: "/lessons",
  news: "/news",
};

/**
 * ContentCard — المكوّن المحوري في محرك المحتوى العام (Phase 9.5).
 * **نفس المكوّن بالحرف** يعرض مقالة أو فتوى أو كتابًا أو درسًا أو خبرًا
 * دون أي فرع شرطي على `item.kind` في المنطق البصري — فقط مسار الرابط
 * يختلف حسب النوع (جدول `kindRoute`)، وهذا امتداد لبنية المسارات
 * الموثَّقة أصلاً في `Information Architecture`.
 *
 * ContentCard — the pivotal component in the Generic Content Engine
 * (Phase 9.5). **The exact same component** renders an article, fatwa,
 * book, lesson, or news item with no conditional branching on
 * `item.kind` in the visual logic — only the link path differs by kind
 * (the `kindRoute` table), extending the route structure already
 * documented in Information Architecture.
 */
export async function ContentCard({ item }: { item: ContentItem }) {
  const t = await getTranslations("content.list");

  return (
    <Link href={`${kindRoute[item.kind]}/${item.slug}`} className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card interactive className="flex h-full flex-col">
        <div aria-hidden="true" className="h-32 rounded-t-lg bg-gradient-to-br from-primary/20 to-accent/20" />
        <CardHeader>
          <CategoryBadge category={item.category} />
          <CardTitle className="text-base">{item.title}</CardTitle>
          <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-3">
          <AuthorInfo author={item.author} size="sm" />
          <ReadingTime minutes={item.readingTimeMinutes} />
        </CardContent>
        <CardFooter>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t("readMore")}
            <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
