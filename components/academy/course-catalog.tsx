"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/search-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/content/empty-state";
import { courseLevelLabels, type Course, type CourseLevel } from "@/lib/mock/academy";
import { useLocale } from "@/hooks/use-locale";

const levels: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function CourseCatalog({ courses, renderedCards }: { courses: Course[]; renderedCards: Record<string, ReactNode> }) {
  const t = useTranslations("academy.catalog");
  const tEmpty = useTranslations("academy.catalog.empty");
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [activeLevels, setActiveLevels] = useState<CourseLevel[]>([]);

  function toggleLevel(level: CourseLevel) {
    setActiveLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  }

  const filteredIds = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return courses
      .filter((c) => {
        const matchesLevel = activeLevels.length === 0 || activeLevels.includes(c.level);
        if (!matchesLevel) return false;
        if (!normalizedQuery) return true;
        return c.title.toLocaleLowerCase().includes(normalizedQuery) || c.description.toLocaleLowerCase().includes(normalizedQuery);
      })
      .map((c) => c.id);
  }, [courses, query, activeLevels]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <SearchInput value={query} onChange={setQuery} placeholder={t("searchPlaceholder")} aria-label={t("searchLabel")} className="max-w-md" />
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-foreground">{t("level.title")}:</span>
          {levels.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox id={`level-${level}`} checked={activeLevels.includes(level)} onCheckedChange={() => toggleLevel(level)} />
              <Label htmlFor={`level-${level}`} className="cursor-pointer font-normal">
                {courseLevelLabels[level][locale === "ar" ? "ar" : "en"]}
              </Label>
            </div>
          ))}
          {activeLevels.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setActiveLevels([])}>
              {t("level.clearAll")}
            </Button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{t("resultsCount", { count: filteredIds.length })}</p>

      {filteredIds.length === 0 ? (
        <EmptyState
          title={tEmpty("title")}
          description={tEmpty("description")}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setActiveLevels([]);
              }}
            >
              {t("level.clearAll")}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIds.map((id) => (
            <div key={id}>{renderedCards[id]}</div>
          ))}
        </div>
      )}
    </div>
  );
}
