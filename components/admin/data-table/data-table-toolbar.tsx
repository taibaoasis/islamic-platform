"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "@/components/icons";

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  resultsCount,
  filtersSlot,
  bulkActionsSlot,
  onCreateNew,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  resultsCount: number;
  filtersSlot?: ReactNode;
  bulkActionsSlot?: ReactNode;
  onCreateNew?: () => void;
}) {
  const t = useTranslations("admin.dataTable");

  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={searchValue} onChange={onSearchChange} placeholder={t("searchPlaceholder")} aria-label={t("searchLabel")} className="max-w-sm" />
        {onCreateNew && (
          <Button size="sm" onClick={onCreateNew}>
            <Plus className="size-4" aria-hidden="true" />
            {t("createNew")}
          </Button>
        )}
      </div>

      {filtersSlot}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("resultsCount", { count: resultsCount })}</p>
        {bulkActionsSlot}
      </div>
    </div>
  );
}
