"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { SearchResult } from "@/lib/mock/search";
import {
  BookOpen,
  ScrollText,
  BookOpenCheck,
  MessageCircleQuestion,
  Newspaper,
  Library,
  GraduationCap,
  Video,
  Headphones,
} from "@/components/icons";

const iconByType = {
  quran: BookOpen,
  hadith: ScrollText,
  tafsir: BookOpenCheck,
  fatwa: MessageCircleQuestion,
  article: Newspaper,
  book: Library,
  course: GraduationCap,
  video: Video,
  audio: Headphones,
} as const;

const badgeVariantByType = {
  quran: "primary",
  hadith: "success",
  tafsir: "info",
  fatwa: "warning",
  article: "neutral",
  book: "neutral",
  course: "info",
  video: "neutral",
  audio: "neutral",
} as const;

/**
 * SearchResultCard — بطاقة موحَّدة لكل أنواع نتائج البحث التسعة
 * (Phase 9.2، القسم 3). نفس البنية البصرية بغض النظر عن النوع، مع
 * أيقونة ولون شارة مميِّزَين لكل نوع فقط.
 *
 * SearchResultCard — a single unified card for all nine search result
 * types (Phase 9.2, section 3). Same visual structure regardless of
 * type, with only the icon and badge color varying per type.
 */
export function SearchResultCard({ result }: { result: SearchResult }) {
  const t = useTranslations("search.filters.types");
  const Icon = iconByType[result.type];

  return (
    <Link href={result.href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card interactive className="flex items-start gap-4 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground/70">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant={badgeVariantByType[result.type]}>{t(result.type)}</Badge>
            {result.meta && <span className="text-xs text-muted-foreground">{result.meta}</span>}
          </div>
          <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">{result.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{result.excerpt}</p>
        </div>
      </Card>
    </Link>
  );
}
