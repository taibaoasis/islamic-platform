"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Clock } from "@/components/icons";

/**
 * SearchHistory — Phase 9.2، القسم 6. بيانات وهمية بحتة (بلا localStorage
 * ولا أي تخزين فعلي — القسم "ممنوع Backend/API" ينطبق على أي شكل تخزين
 * حقيقي أيضًا). "مسح السجل" هنا فعل عرضي فقط ضمن حالة الصفحة الحالية.
 *
 * SearchHistory — Phase 9.2, section 6. Purely mock data (no
 * localStorage or any real persistence — the "no Backend/API"
 * constraint extends to any real storage too). "Clear history" here is
 * a presentational action scoped to the current page state only.
 */
export function SearchHistory({
  items,
  onSelect,
  onClear,
}: {
  items: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}) {
  const t = useTranslations("search.history");

  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="size-4" aria-hidden="true" />
          {t("title")}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t("clear")}
        </Button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((query) => (
          <li key={query}>
            <button
              type="button"
              onClick={() => onSelect(query)}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
