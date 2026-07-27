"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpenCheck,
  Languages,
  Play,
  Copy,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "@/components/icons";
import type { MockVerse } from "@/lib/mock/quran";
import { cn } from "@/lib/utils";

export type VerseFontSize = "sm" | "md" | "lg";

const fontSizeClass: Record<VerseFontSize, string> = {
  sm: "text-xl leading-[2.5]",
  md: "text-2xl leading-[2.75]",
  lg: "text-3xl leading-[3]",
};

/**
 * Verse — مكوّن مستقل للآية (Phase 9.3، القسم 6). يعرض الواجهة فقط
 * حسب الطلب الصريح — "التفسير"/"الترجمة" يفتحان لوحة نائبة محليًا (حالة
 * عرض فقط، لا بيانات حقيقية)، "استماع" معطَّل بوضوح (Tooltip)، "نسخ"
 * و"مشاركة" وظيفيتان فعليًا (Web APIs متصفح بحتة، لا Backend)،
 * "الإشارة المرجعية" حالة محلية غير محفوظة (بلا تخزين حقيقي).
 *
 * Verse — a standalone verse component (Phase 9.3, section 6). UI-only
 * as explicitly requested — Tafsir/Translation open a local placeholder
 * panel (display-only state, no real data), Listen is clearly disabled
 * (tooltip), Copy and Share are genuinely functional (pure browser Web
 * APIs, no backend), Bookmark is local unsaved state (no real
 * persistence).
 */
export function Verse({ verse, fontSize = "md" }: { verse: MockVerse; fontSize?: VerseFontSize }) {
  const t = useTranslations("quran.verse");
  const { toast } = useToast();
  const [showTafsir, setShowTafsir] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(verse.placeholderText);
      toast({ description: t("copied"), variant: "success" });
    } catch {
      // بيئات بلا صلاحية الحافظة — فشل صامت مقصود، لا كسر للواجهة.
      // Environments without clipboard permission — intentional silent
      // failure, no UI breakage.
    }
  }

  async function handleShare() {
    const shareData = { title: t("ariaLabel", { number: verse.numberInSurah }), text: verse.placeholderText };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        // المستخدم ألغى المشاركة — لا حاجة لأي فعل. User cancelled the share sheet — no action needed.
      }
    } else {
      await handleCopy();
    }
  }

  return (
    <article aria-label={t("ariaLabel", { number: verse.numberInSurah })} className="border-b border-border py-6 last:border-none">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground/80">
          {verse.numberInSurah}
        </span>
        <p dir="rtl" lang="ar" className={cn("flex-1 font-arabic text-foreground", fontSizeClass[fontSize])}>
          {verse.placeholderText}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1 ps-12">
        <IconButton aria-label={t("tafsir")} variant={showTafsir ? "secondary" : "ghost"} size="sm" onClick={() => setShowTafsir((v) => !v)}>
          <BookOpenCheck className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={t("translation")} variant={showTranslation ? "secondary" : "ghost"} size="sm" onClick={() => setShowTranslation((v) => !v)}>
          <Languages className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton aria-label={t("play")} variant="ghost" size="sm" disabled title={t("play")}>
          <Play className="size-4" aria-hidden="true" />
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

      {showTafsir && (
        <div className="mt-3 ms-12 rounded-[var(--radius)] border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-semibold text-foreground">{t("tafsir")}</p>
          {t("tafsirPlaceholder")}
        </div>
      )}
      {showTranslation && (
        <div className="mt-3 ms-12 rounded-[var(--radius)] border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          <p className="mb-1 text-xs font-semibold text-foreground">{t("translation")}</p>
          {t("translationPlaceholder")}
        </div>
      )}
    </article>
  );
}
