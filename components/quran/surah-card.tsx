"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { getMockDescription, type SurahMeta } from "@/lib/mock/quran";

/**
 * SurahCard — بطاقة موحَّدة للسورة (Phase 9.3، القسم 4)، مبنية حصرًا من
 * Card وBadge (Phase 8). تعرض: الرقم، الاسمين، النوع، عدد الآيات، ومقتطف
 * الوصف Mock.
 *
 * SurahCard — a unified surah card (Phase 9.3, section 4), built
 * exclusively from Card and Badge (Phase 8). Shows: number, both
 * names, type, verse count, and the Mock description excerpt.
 */
export function SurahCard({ surah }: { surah: SurahMeta }) {
  const t = useTranslations("quran");

  return (
    <Link
      href={`/quran/${surah.number}`}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card interactive className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {surah.number}
          </span>
          <Badge variant={surah.revelationType === "MECCAN" ? "info" : "success"}>
            {t(`filters.${surah.revelationType === "MECCAN" ? "meccan" : "medinan"}`)}
          </Badge>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">{surah.arabicName}</h2>
          <p className="text-sm text-muted-foreground">
            {surah.transliteratedName} · {surah.englishName}
          </p>
        </div>

        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{getMockDescription(surah)}</p>

        <p className="text-xs font-medium text-foreground/70">{t("verseCountLabel", { count: surah.verseCount })}</p>
      </Card>
    </Link>
  );
}
