"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { SearchX } from "@/components/icons";

export function SearchEmptyState({ hasActiveFilters, onClearFilters }: { hasActiveFilters: boolean; onClearFilters: () => void }) {
  const t = useTranslations("search.empty");

  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{t("description")}</p>
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
