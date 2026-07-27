"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { NarratorChain } from "@/components/hadith/narrator-chain";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Copy, Share2, Bookmark, BookmarkCheck } from "@/components/icons";
import type { HadithCollectionMeta, MockHadith } from "@/lib/mock/hadith";
import { getCollectionBySlug } from "@/lib/mock/hadith";

const gradeVariant = { SAHIH: "success", HASAN: "info", DAIF: "warning" } as const;

/**
 * HadithCard — بطاقة موحَّدة للحديث (تقابل مكوّن Verse في تجربة القرآن،
 * Phase 9.3). الدرجة **تظهر دائمًا بجانب المتن مباشرة، لا مخفية أبدًا**
 * (مبدأ إلزامي من Content Models §2.1 — "لا تُحذَف أبدًا من عرض
 * الذكاء الاصطناعي" يُطبَّق هنا بنفس الصرامة على واجهة العرض البشري).
 *
 * HadithCard — a unified hadith card (the Hadith-domain counterpart to
 * the Verse component in the Quran experience, Phase 9.3). The grade
 * **always appears directly next to the matn, never hidden** (a
 * mandatory principle from Content Models §2.1 — "never omitted from
 * AI-generated display" is applied here with the same rigor to the
 * human-facing UI).
 */
export function HadithCard({ hadith, collection }: { hadith: MockHadith; collection?: HadithCollectionMeta }) {
  const t = useTranslations("hadith.card");
  const tGrade = useTranslations("hadith.grade");
  const { toast } = useToast();
  const [showCommentary, setShowCommentary] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const resolvedCollection = collection ?? getCollectionBySlug(hadith.collectionSlug);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hadith.matnPlaceholder);
      toast({ description: t("copied"), variant: "success" });
    } catch {
      // بيئات بلا صلاحية الحافظة — فشل صامت مقصود. Environments without clipboard permission — intentional silent failure.
    }
  }

  async function handleShare() {
    const shareData = { title: t("ariaLabel", { number: hadith.numberInCollection }), text: hadith.matnPlaceholder };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        // المستخدم ألغى المشاركة. User cancelled the share sheet.
      }
    } else {
      await handleCopy();
    }
  }

  return (
    <Card aria-label={t("ariaLabel", { number: hadith.numberInCollection })} className="p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground/80">
            {hadith.numberInCollection}
          </span>
          <Badge variant={gradeVariant[hadith.grade]}>{tGrade(hadith.grade)}</Badge>
        </div>
        {resolvedCollection && <span className="text-xs text-muted-foreground">{t("source")}: {resolvedCollection.arabicName}</span>}
      </div>

      <p dir="rtl" lang="ar" className="font-arabic text-lg leading-loose text-foreground">
        {hadith.matnPlaceholder}
      </p>

      <div className="mt-4">
        <NarratorChain narrators={hadith.narrators} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3">
        <IconButton aria-label={t("commentary")} variant={showCommentary ? "secondary" : "ghost"} size="sm" onClick={() => setShowCommentary((v) => !v)}>
          <MessageSquare className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={t("copy")} variant="ghost" size="sm" onClick={handleCopy}>
          <Copy className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={t("share")} variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton
          aria-label={isBookmarked ? t("bookmarkRemove") : t("bookmark")}
          aria-pressed={isBookmarked}
          variant="ghost"
          size="sm"
          onClick={() => setIsBookmarked((v) => !v)}
        >
          {isBookmarked ? <BookmarkCheck className="size-4 text-primary" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
        </IconButton>
      </div>

      {showCommentary && (
        <div className="mt-3 rounded-[var(--radius)] border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-semibold text-foreground">{t("commentary")}</p>
          {t("commentaryPlaceholder")}
        </div>
      )}
    </Card>
  );
}
