"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/content/empty-state";
import type { ContentItem } from "@/lib/mock/content";

/**
 * ملاحظة معمارية: `ContentCard` مكوّن Server غير متزامن (async) — لا
 * يمكن استدعاؤه مباشرة من داخل Client Component. لذا يستقبل هذا
 * المنسِّق **عناصر ContentCard جاهزة التصيير مسبقًا** من الصفحة الأب
 * (Server Component) عبر `renderedCards`، ويقتصر دوره على تصفية أيها
 * يظهر حسب البحث — نمط "Server Component بداخل Client" القياسي في
 * Next.js App Router (تمرير عبر children/props بدل استيراد مباشر).
 *
 * Architecture note: `ContentCard` is an async Server Component — it
 * cannot be imported directly into a Client Component. This orchestrator
 * therefore receives **pre-rendered ContentCard elements** from the
 * parent Server Component page via `renderedCards`, and only filters
 * which ones are visible based on search — the standard "Server
 * Component inside Client" pattern in the Next.js App Router (passed
 * through children/props instead of direct import).
 */
export function ArticlesIndex({
  items,
  renderedCards,
}: {
  items: ContentItem[];
  renderedCards: Record<string, ReactNode>;
}) {
  const t = useTranslations("content.list");
  const tEmpty = useTranslations("content.empty");
  const [query, setQuery] = useState("");

  const filteredIds = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return items.map((i) => i.id);
    return items.filter((i) => i.title.toLocaleLowerCase().includes(normalizedQuery) || i.excerpt.toLocaleLowerCase().includes(normalizedQuery)).map((i) => i.id);
  }, [items, query]);

  return (
    <div>
      <div className="mb-6">
        <SearchInput value={query} onChange={setQuery} placeholder={t("searchPlaceholder")} aria-label={t("searchLabel")} className="max-w-md" />
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{t("resultsCount", { count: filteredIds.length })}</p>

      {filteredIds.length === 0 ? (
        <EmptyState
          title={tEmpty("title")}
          description={tEmpty("description")}
          action={
            <Button variant="outline" size="sm" onClick={() => setQuery("")}>
              {t("searchLabel")}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIds.map((id) => (
            <div key={id}>{renderedCards[id]}</div>
          ))}
        </div>
      )}
    </div>
  );
}
