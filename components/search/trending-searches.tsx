"use client";

import { useTranslations } from "next-intl";

import { TrendingUp } from "@/components/icons";

export function TrendingSearches({ items, onSelect }: { items: string[]; onSelect: (query: string) => void }) {
  const t = useTranslations("search.trending");

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <TrendingUp className="size-4" aria-hidden="true" />
        {t("title")}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((query) => (
          <li key={query}>
            <button
              type="button"
              onClick={() => onSelect(query)}
              className="rounded-full bg-accent/10 px-3 py-1.5 text-sm text-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
