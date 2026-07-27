"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/content/empty-state";
import { Button } from "@/components/ui/button";

/** DataTableEmpty — يعيد استخدام EmptyState من محرك المحتوى العام (Phase 9.5). Reuses EmptyState from the Generic Content Engine (Phase 9.5). */
export function DataTableEmpty({ onClearFilters }: { onClearFilters?: () => void }) {
  const t = useTranslations("admin.dataTable");

  return (
    <EmptyState
      title={t("noResults.title")}
      description={t("noResults.description")}
      action={
        onClearFilters ? (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            {t("clearFilters")}
          </Button>
        ) : undefined
      }
    />
  );
}
