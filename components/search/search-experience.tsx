"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/search-input";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import { SearchResultCard } from "@/components/search/search-result-card";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";
import { SearchHistory } from "@/components/search/search-history";
import { TrendingSearches } from "@/components/search/trending-searches";
import {
  MOCK_SEARCH_DELAY_MS,
  getSuggestions,
  mockSearchHistory,
  mockTrendingSearches,
  searchMock,
  type SearchResult,
  type SearchResultType,
} from "@/lib/mock/search";

const HISTORY_LIMIT = 6;

/**
 * SearchExperience — Phase 9.2. المنسِّق الرئيسي للحالة بالكامل (Client
 * Component بالضرورة لتفاعلية الكتابة الحيّة). الصفحة الأب
 * (app/[locale]/search/page.tsx) تبقى Server Component لأجل SEO
 * (generateMetadata)، وتُصيِّر هذا المكوّن كحد تفاعلي وحيد.
 *
 * SearchExperience — Phase 9.2. The full state orchestrator (necessarily
 * a Client Component for live-typing interactivity). The parent page
 * (app/[locale]/search/page.tsx) stays a Server Component for SEO
 * (generateMetadata), rendering this as the single interactive boundary.
 */
export function SearchExperience() {
  const t = useTranslations("search");

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<SearchResultType[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>(mockSearchHistory);

  // Debounce: يفصل بين تحديث حقل الإدخال الفوري وتشغيل "بحث" فعلي.
  // Debounce: separates the instant input update from triggering an
  // actual "search".
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  // يحاكي زمن استجابة الشبكة ليكون لحالة Skeleton معنى فعلي ملموس.
  // Simulates network latency so the Skeleton state has real, felt meaning.
  useEffect(() => {
    const hasActiveSearch = debouncedQuery.trim() !== "" || activeTypes.length > 0;
    // لا حاجة لإعادة ضبط results/isLoading هنا — القسم الذي يعرضهما في
    // الواجهة لا يُصيَّر أصلاً حين لا يوجد بحث نشط (انظر hasSearch أدناه).
    // No need to reset results/isLoading here — the UI section that
    // displays them isn't rendered at all when there's no active search
    // (see hasSearch below).
    if (!hasActiveSearch) return;
    // يُؤجَّل ضبط isLoading إلى Callback (لا استدعاء متزامن مباشل في
    // جسم الأثر) — نفس النمط الموصى به في قاعدة react-hooks/set-state-in-effect.
    // Deferred into a callback (not a direct synchronous call in the
    // effect body) — matches the exact pattern recommended by the
    // react-hooks/set-state-in-effect rule itself.
    const loadingId = setTimeout(() => setIsLoading(true), 0);
    const id = setTimeout(() => {
      setResults(searchMock(debouncedQuery, activeTypes));
      setIsLoading(false);
    }, MOCK_SEARCH_DELAY_MS);
    return () => {
      clearTimeout(loadingId);
      clearTimeout(id);
    };
  }, [debouncedQuery, activeTypes]);

  const suggestions = useMemo(() => (isFocused ? getSuggestions(query) : []), [isFocused, query]);
  const hasSearch = debouncedQuery.trim() !== "" || activeTypes.length > 0;

  function commitSearch(value: string) {
    setQuery(value);
    setIsFocused(false);
    if (value.trim()) {
      setHistory((prev) => [value, ...prev.filter((q) => q !== value)].slice(0, HISTORY_LIMIT));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h1>

      <div className="relative mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitSearch(query);
          }}
          placeholder={t("placeholder")}
          aria-label={t("label")}
          className="h-12 text-base"
        />
        {isFocused && (
          <SearchSuggestions suggestions={suggestions} onSelect={(result) => commitSearch(result.title)} />
        )}
      </div>

      {!hasSearch ? (
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{t("startPrompt.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("startPrompt.description")}</p>
          </div>
          <SearchHistory items={history} onSelect={commitSearch} onClear={() => setHistory([])} />
          <TrendingSearches items={mockTrendingSearches} onSelect={commitSearch} />
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
          <SearchFilters activeTypes={activeTypes} onChange={setActiveTypes} />

          <div>
            {!isLoading && (
              <p className="mb-4 text-sm text-muted-foreground">
                {t("resultsCount", { count: results.length })}
                {debouncedQuery && ` — ${t("resultsFor")} "${debouncedQuery}"`}
              </p>
            )}

            {isLoading ? (
              <SearchResultsSkeleton />
            ) : results.length === 0 ? (
              <SearchEmptyState hasActiveFilters={activeTypes.length > 0} onClearFilters={() => setActiveTypes([])} />
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
