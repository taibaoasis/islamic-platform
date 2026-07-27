"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { SearchResult } from "@/lib/mock/search";
import { Search } from "@/components/icons";

/**
 * SearchSuggestions — Phase 9.2، القسم 1 ("اقتراحات أثناء الكتابة").
 * قائمة منسدلة بسيطة أسفل مربع البحث، `role="listbox"` لإتاحة الوصول.
 *
 * SearchSuggestions — Phase 9.2, section 1 ("type-ahead suggestions").
 * A simple dropdown below the search box, `role="listbox"` for
 * accessibility.
 */
export function SearchSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: SearchResult[];
  onSelect: (result: SearchResult) => void;
}) {
  const t = useTranslations("search");

  if (suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      aria-label={t("suggestions")}
      className="absolute z-20 mt-2 w-full overflow-hidden rounded-[var(--radius)] border border-border bg-background shadow-lg"
    >
      {suggestions.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          role="option"
          aria-selected={false}
          onClick={() => onSelect(item)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{item.title}</span>
        </Link>
      ))}
    </div>
  );
}
