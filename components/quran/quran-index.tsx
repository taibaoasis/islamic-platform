"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/search-input";
import { SurahCard } from "@/components/quran/surah-card";
import { SurahGridSkeleton } from "@/components/quran/surah-grid-skeleton";
import { QuranFilters, type RevelationFilter } from "@/components/quran/quran-filters";
import { surahs } from "@/lib/mock/quran";
import { SearchX } from "@/components/icons";
import { Button } from "@/components/ui/button";

const INTERACTION_LOAD_DELAY_MS = 250;

/**
 * QuranIndex — Phase 9.3، الأقسام 1-3. البحث والتصفية كلاهما محليان
 * بالكامل على مصفوفة `surahs` الثابتة (بلا API) — Client Component
 * بالضرورة للتفاعلية الحيّة، بينما الصفحة الأب (page.tsx) تبقى Server
 * Component لأجل SEO.
 *
 * ملاحظة SEO مهمة: `isLoading` يبدأ `false` عمدًا (لا حالة تحميل مفروضة
 * عند أول عرض) — البيانات الوهمية متوفرة فورًا بلا أي طلب شبكة حقيقي،
 * فإخفاء المحتوى الفعلي خلف Skeleton عند أول عرض يضر بمحركات البحث
 * (تحديدًا) بلا أي فائدة حقيقية للمستخدم. تظهر حالة Skeleton فقط
 * استجابةً لفعل تفاعلي فعلي من المستخدم (كتابة/تصفية) — محاكاة صادقة
 * لا خداع بصري.
 *
 * QuranIndex — Phase 9.3, sections 1-3. Both search and filtering are
 * entirely local against the static `surahs` array (no API) —
 * necessarily a Client Component for live interactivity, while the
 * parent page.tsx stays a Server Component for SEO.
 *
 * Important SEO note: `isLoading` deliberately starts `false` (no
 * forced loading state on first render) — the mock data is available
 * instantly with no real network request, so hiding real content
 * behind a Skeleton on first paint hurts search engines specifically
 * with no real user benefit. The Skeleton state only appears in
 * response to an actual user interaction (typing/filtering) — an
 * honest simulation, not a visual deception.
 */
export function QuranIndex() {
  const t = useTranslations("quran");
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<RevelationFilter[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function triggerLoadingPulse() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_LOAD_DELAY_MS);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    triggerLoadingPulse();
  }

  function handleFiltersChange(types: RevelationFilter[]) {
    setActiveTypes(types);
    triggerLoadingPulse();
  }

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return surahs.filter((surah) => {
      const matchesType = activeTypes.length === 0 || activeTypes.includes(surah.revelationType);
      if (!matchesType) return false;
      if (!normalizedQuery) return true;
      return (
        surah.arabicName.includes(query.trim()) ||
        surah.transliteratedName.toLocaleLowerCase().includes(normalizedQuery) ||
        surah.englishName.toLocaleLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, activeTypes]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6 flex flex-col gap-4">
        <SearchInput value={query} onChange={handleQueryChange} placeholder={t("searchPlaceholder")} aria-label={t("searchLabel")} className="max-w-md" />
        <QuranFilters active={activeTypes} onChange={handleFiltersChange} />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t("resultsCount", { count: filtered.length })}</p>

      <div className="mt-4">
        {isLoading ? (
          <SurahGridSkeleton />
        ) : filtered.length === 0 ? (
          <div role="status" className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-7" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">{t("empty.title")}</h2>
            <p className="max-w-sm text-sm text-muted-foreground">{t("empty.description")}</p>
            {(query || activeTypes.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setActiveTypes([]);
                }}
              >
                {t("filters.clearAll")}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
