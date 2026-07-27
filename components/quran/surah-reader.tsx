"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { FontSizeControl } from "@/components/quran/font-size-control";
import { RecitationPanel } from "@/components/quran/recitation-panel";
import { Verse, type VerseFontSize } from "@/components/quran/verse";
import { getAdjacentSurahs, getMockVerses, type SurahMeta } from "@/lib/mock/quran";
import { ChevronLeft, ChevronRight, Info } from "@/components/icons";
import { cn } from "@/lib/utils";

const LOAD_DELAY_MS = 350;

/**
 * ملاحظة SEO مهمة: `isLoading` يبدأ `false` — أول عرض (SSR) يُظهر نص
 * الآيات فورًا (بيانات وهمية متوفرة فورًا، لا فائدة من إخفائها عن
 * محركات البحث). حالة Skeleton تظهر فقط عند تنقّل فعلي بين السور من
 * جانب العميل (زر السابق/التالي) — يُتتبَّع أول عرض عبر `useRef` لتفادي
 * وميض Skeleton غير ضروري عند التحميل الأول.
 *
 * Important SEO note: `isLoading` starts `false` — first render (SSR)
 * shows verse text immediately (mock data is instantly available, no
 * benefit in hiding it from search engines). The Skeleton state only
 * appears on genuine client-side navigation between surahs (prev/next
 * button) — the first render is tracked via `useRef` to avoid an
 * unnecessary Skeleton flash on initial load.
 */
export function SurahReader({ surah }: { surah: SurahMeta }) {
  const t = useTranslations("quran");
  const tDetails = useTranslations("quran.details");
  const [fontSize, setFontSize] = useState<VerseFontSize>("md");
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const showId = setTimeout(() => setIsLoading(true), 0);
    const hideId = setTimeout(() => setIsLoading(false), LOAD_DELAY_MS);
    return () => {
      clearTimeout(showId);
      clearTimeout(hideId);
    };
  }, [surah.number]);

  const verses = getMockVerses(surah);
  const { previous, next } = getAdjacentSurahs(surah.number);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumb items={[{ label: t("title"), href: "/quran" }, { label: surah.arabicName }]} className="mb-6" />

      {/* رأس السورة — معلومات السورة / Surah header — surah information */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">{surah.arabicName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {surah.transliteratedName} · {surah.englishName}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Badge variant={surah.revelationType === "MECCAN" ? "info" : "success"}>
            {t(`filters.${surah.revelationType === "MECCAN" ? "meccan" : "medinan"}`)}
          </Badge>
          <Badge variant="neutral">{t("verseCountLabel", { count: surah.verseCount })}</Badge>
        </div>
      </div>

      {/* مكان مخصص للتلاوات / Place designated for recitations */}
      <div className="mb-6">
        <RecitationPanel />
      </div>

      {/* شريط أدوات القراءة / Reading toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{tDetails("versesTitle")}</h2>
        <FontSizeControl value={fontSize} onChange={setFontSize} />
      </div>

      <Card className="flex items-start gap-2 border-info/30 bg-info/10 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
        {tDetails("placeholderNotice")}
      </Card>

      {/* قائمة الآيات — ترقيم واضح / Verse list — clear numbering */}
      <div className="mt-4">
        {isLoading ? (
          <div aria-hidden="true" className="flex flex-col gap-6 py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <Skeleton className="h-7 flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {verses.map((verse) => (
              <Verse key={verse.numberInSurah} verse={verse} fontSize={fontSize} />
            ))}
          </div>
        )}
      </div>

      {/* تنقّل السورة السابقة/التالية / Previous/Next surah navigation */}
      <nav aria-label={t("title")} className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
        {previous ? (
          <Link href={`/quran/${previous.number}`} className={cn(buttonVariants({ variant: "outline" }))}>
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            <span className="flex flex-col items-start text-start">
              <span className="text-xs text-muted-foreground">{tDetails("previousSurah")}</span>
              <span>{previous.arabicName}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/quran/${next.number}`} className={cn(buttonVariants({ variant: "outline" }))}>
            <span className="flex flex-col items-end text-end">
              <span className="text-xs text-muted-foreground">{tDetails("nextSurah")}</span>
              <span>{next.arabicName}</span>
            </span>
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
