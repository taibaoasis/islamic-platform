"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/admin/data-table/data-table-empty";
import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge, type ContentLifecycleStatus } from "@/components/admin/status-badge";
import { Link } from "@/i18n/navigation";
import { contentLifecycleStatuses } from "@/lib/admin/lifecycle";
import { buildTranslationQueue, supportedLanguages, type QueueContentKind } from "@/lib/mock/localization";

const PAGE_SIZE = 10;
const INTERACTION_DELAY_MS = 200;
type SortKey = "title" | "targetLanguage" | "status" | "lastModified";
const contentKinds: QueueContentKind[] = ["quran", "hadith", "article", "fatwa", "book", "lesson", "news"];

/** TranslationQueueTable — سابع استهلاك مباشر لِـ DataTable وFilterCheckboxGroup. TranslationQueueTable — the seventh direct consumer of DataTable and FilterCheckboxGroup. */
export function TranslationQueueTable() {
  const t = useTranslations("admin.localization.queue");
  const locale = useLocale();

  const allItems = useMemo(() => buildTranslationQueue(), []);
  const translatorOptions = useMemo(() => Array.from(new Set(allItems.map((i) => i.translator).filter((x): x is string => Boolean(x)))).sort(), [allItems]);

  const [query, setQuery] = useState("");
  const [activeLanguages, setActiveLanguages] = useState<string[]>([]);
  const [activeKinds, setActiveKinds] = useState<QueueContentKind[]>([]);
  const [activeStatuses, setActiveStatuses] = useState<ContentLifecycleStatus[]>([]);
  const [activeTranslators, setActiveTranslators] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("lastModified");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function pulseLoading() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_DELAY_MS);
  }

  const filteredSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let result = allItems.filter((item) => {
      if (activeLanguages.length > 0 && !activeLanguages.includes(item.targetLanguage)) return false;
      if (activeKinds.length > 0 && !activeKinds.includes(item.contentKind)) return false;
      if (activeStatuses.length > 0 && !activeStatuses.includes(item.status)) return false;
      if (activeTranslators.length > 0 && !(item.translator && activeTranslators.includes(item.translator))) return false;
      if (normalizedQuery && !item.title.toLocaleLowerCase().includes(normalizedQuery)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "title") compare = a.title.localeCompare(b.title);
      else if (sortKey === "targetLanguage") compare = a.targetLanguage.localeCompare(b.targetLanguage);
      else if (sortKey === "status") compare = a.status.localeCompare(b.status);
      else if (sortKey === "lastModified") compare = a.lastModified.localeCompare(b.lastModified);
      return sortDirection === "asc" ? compare : -compare;
    });

    return result;
  }, [allItems, query, activeLanguages, activeKinds, activeStatuses, activeTranslators, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: string) {
    if (key === sortKey) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key as SortKey);
      setSortDirection("asc");
    }
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  const columns: DataTableColumn<(typeof allItems)[number]>[] = [
    { key: "contentType", header: t("columns.contentType"), render: (item) => t(`contentTypes.${item.contentKind}`) },
    {
      key: "title",
      header: t("columns.title"),
      sortable: true,
      render: (item) => (
        <Link href={`/admin/localization/editor/${item.id}`} className="line-clamp-1 font-medium text-foreground hover:text-primary">
          {item.title}
        </Link>
      ),
    },
    { key: "sourceLanguage", header: t("columns.sourceLanguage"), render: (item) => <span className="uppercase">{item.sourceLanguage}</span> },
    { key: "targetLanguage", header: t("columns.targetLanguage"), sortable: true, render: (item) => <span className="uppercase">{item.targetLanguage}</span> },
    { key: "status", header: t("columns.status"), sortable: true, render: (item) => <StatusBadge status={item.status} /> },
    { key: "translator", header: t("columns.translator"), render: (item) => item.translator ?? t("columns.noTranslator") },
    { key: "lastModified", header: t("columns.lastModified"), sortable: true, render: (item) => dateFormatter.format(new Date(item.lastModified)) },
  ];

  return (
    <div>
      <DataTableToolbar
        searchValue={query}
        onSearchChange={(v) => {
          setQuery(v);
          setPage(1);
          pulseLoading();
        }}
        resultsCount={filteredSorted.length}
        filtersSlot={
          <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border p-3">
            <FilterCheckboxGroup
              label={t("filters.language")}
              options={supportedLanguages.map((l) => l.isoCode)}
              optionLabel={(code) => code}
              uppercase
              active={activeLanguages}
              onToggle={(code) => {
                setActiveLanguages((prev) => (prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]));
                setPage(1);
                pulseLoading();
              }}
            />
            <FilterCheckboxGroup
              label={t("filters.contentType")}
              options={contentKinds}
              optionLabel={(kind) => t(`contentTypes.${kind}`)}
              active={activeKinds}
              onToggle={(kind) => {
                setActiveKinds((prev) => (prev.includes(kind) ? prev.filter((x) => x !== kind) : [...prev, kind]));
                setPage(1);
                pulseLoading();
              }}
            />
            <FilterCheckboxGroup
              label={t("filters.status")}
              options={contentLifecycleStatuses}
              optionLabel={(status) => status}
              active={activeStatuses}
              onToggle={(status) => {
                setActiveStatuses((prev) => (prev.includes(status) ? prev.filter((x) => x !== status) : [...prev, status]));
                setPage(1);
                pulseLoading();
              }}
            />
            {translatorOptions.length > 0 && (
              <FilterCheckboxGroup
                label={t("filters.translator")}
                options={translatorOptions}
                optionLabel={(name) => name}
                active={activeTranslators}
                onToggle={(name) => {
                  setActiveTranslators((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
                  setPage(1);
                  pulseLoading();
                }}
              />
            )}
          </div>
        }
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={columns.length} />
      ) : filteredSorted.length === 0 ? (
        <DataTableEmpty
          onClearFilters={() => {
            setQuery("");
            setActiveLanguages([]);
            setActiveKinds([]);
            setActiveStatuses([]);
            setActiveTranslators([]);
          }}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            getRowId={(item) => item.id}
            selectedIds={selectedIds}
            onToggleRow={(id) =>
              setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
            onToggleAll={() =>
              setSelectedIds((prev) => {
                const allSelected = pageRows.every((i) => prev.has(i.id));
                const next = new Set(prev);
                pageRows.forEach((i) => (allSelected ? next.delete(i.id) : next.add(i.id)));
                return next;
              })
            }
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <div className="mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
