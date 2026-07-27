"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { HadithCollectionCard } from "@/components/hadith/hadith-collection-card";
import { HadithCollectionGridSkeleton } from "@/components/hadith/hadith-skeletons";
import { hadithCollections } from "@/lib/mock/hadith";
import { SearchX } from "@/components/icons";

const INTERACTION_LOAD_DELAY_MS = 250;

/**
 * HadithIndex — Phase 9.4. نفس نمط QuranIndex (Phase 9.3) بالحرف —
 * `isLoading` يبدأ `false` عمدًا لتفادي إخفاء المحتوى الفعلي عن محركات
 * البحث عند أول عرض (درس مُستفاد فعليًا من إصلاح مشابه في Phase 9.3).
 *
 * HadithIndex — Phase 9.4. Identical pattern to QuranIndex (Phase 9.3)
 * — `isLoading` deliberately starts `false` to avoid hiding real
 * content from search engines on first render (a lesson actually
 * learned from a similar fix in Phase 9.3).
 */
export function HadithIndex() {
  const t = useTranslations("hadith");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleQueryChange(value: string) {
    setQuery(value);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_LOAD_DELAY_MS);
  }

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return hadithCollections;
    return hadithCollections.filter(
      (c) =>
        c.arabicName.includes(query.trim()) ||
        c.englishName.toLocaleLowerCase().includes(normalizedQuery) ||
        c.compiler.includes(query.trim())
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6">
        <SearchInput value={query} onChange={handleQueryChange} placeholder={t("searchPlaceholder")} aria-label={t("searchLabel")} className="max-w-md" />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t("resultsCount", { count: filtered.length })}</p>

      <div className="mt-4">
        {isLoading ? (
          <HadithCollectionGridSkeleton />
        ) : filtered.length === 0 ? (
          <div role="status" className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">{t("empty.title")}</h2>
            <p className="max-w-sm text-sm text-muted-foreground">{t("empty.description")}</p>
            <Button variant="outline" size="sm" onClick={() => setQuery("")}>
              {t("empty.clearFilters")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((collection) => (
              <HadithCollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
