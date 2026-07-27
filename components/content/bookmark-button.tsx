"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/components/ui/icon-button";
import { Bookmark, BookmarkCheck } from "@/components/icons";

/** BookmarkButton — حالة محلية غير محفوظة (لا Backend). Local unsaved state (no backend). */
export function BookmarkButton() {
  const t = useTranslations("content.actions");
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <IconButton
      aria-label={isBookmarked ? t("bookmarkRemove") : t("bookmark")}
      aria-pressed={isBookmarked}
      variant="ghost"
      size="sm"
      onClick={() => setIsBookmarked((v) => !v)}
    >
      {isBookmarked ? <BookmarkCheck className="size-4 text-primary" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
    </IconButton>
  );
}
