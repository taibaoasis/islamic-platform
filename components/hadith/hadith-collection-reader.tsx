"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Card } from "@/components/ui/card";
import { Info, SearchX } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { HadithGradeFilter } from "@/components/hadith/hadith-grade-filter";
import { HadithCard } from "@/components/hadith/hadith-card";
import { HadithCardSkeleton } from "@/components/hadith/hadith-skeletons";
import { getHadithsForCollection, type HadithCollectionMeta, type HadithGrade } from "@/lib/mock/hadith";

const INTERACTION_LOAD_DELAY_MS = 250;

export function HadithCollectionReader({ collection }: { collection: HadithCollectionMeta }) {
  const t = useTranslations("hadith");
  const [query, setQuery] = useState("");
  const [activeGrades, setActiveGrades] = useState<HadithGrade[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function pulseLoading() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_LOAD_DELAY_MS);
  }

  const allHadiths = getHadithsForCollection(collection.slug);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return allHadiths.filter((h) => {
      const matchesGrade = activeGrades.length === 0 || activeGrades.includes(h.grade);
      if (!matchesGrade) return false;
      if (!normalizedQuery) return true;
      return h.matnPlaceholder.toLocaleLowerCase().includes(normalizedQuery) || h.topic.includes(query.trim());
    });
  }, [allHadiths, query, activeGrades]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumb items={[{ label: t("title"), href: "/hadith" }, { label: collection.arabicName }]} className="mb-6" />

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">{collection.arabicName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{collection.englishName}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="neutral">
            {t("collection.compiler")}: {collection.compiler}
          </Badge>
          <Badge variant="neutral">{t("hadithCountLabel", { count: collection.hadithCount })}</Badge>
        </div>
      </div>

      <Card className="mb-6 flex items-start gap-2 border-info/30 bg-info/10 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
        {t("card.placeholderNotice")}
      </Card>

      <div className="mb-6 flex flex-col gap-4">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            pulseLoading();
          }}
          placeholder={t("collection.searchPlaceholder")}
          aria-label={t("collection.searchPlaceholder")}
        />
        <HadithGradeFilter
          active={activeGrades}
          onChange={(g) => {
            setActiveGrades(g);
            pulseLoading();
          }}
        />
      </div>

      <h2 className="mb-4 text-sm font-semibold text-foreground">{t("collection.hadithsTitle")}</h2>

      {isLoading ? (
        <HadithCardSkeleton />
      ) : filtered.length === 0 ? (
        <div role="status" className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="size-7" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">{t("empty.title")}</h2>
          <p className="max-w-sm text-sm text-muted-foreground">{t("empty.description")}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setActiveGrades([]);
            }}
          >
            {t("empty.clearFilters")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((hadith) => (
            <HadithCard key={hadith.id} hadith={hadith} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
