"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/admin/data-table/data-table-empty";
import { BulkActionsBar } from "@/components/admin/data-table/bulk-actions-bar";
import { RowActions } from "@/components/admin/data-table/row-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { QuranTableFilters, type QuranTableFilterState } from "@/components/admin/quran-table-filters";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { mockQuranContentRows, type QuranContentRow, type QuranContentStatus } from "@/lib/mock/admin-quran";

const PAGE_SIZE = 10;
const INTERACTION_DELAY_MS = 200;

type SortKey = "surah" | "verse" | "status" | "lastModified";

/**
 * QuranContentTable — Phase 11, Module 2.1. المنسِّق الوحيد الذي يحمل
 * كل الحالة (بحث/تصفية/فرز/تحديد/صفحات/انتقالات حالة محلية) — النموذج
 * القياسي الذي ستتبعه بقية صفحات إدارة المحتوى حرفيًا (استبدال
 * `mockQuranContentRows` والأعمدة فقط).
 *
 * **لا حفظ حقيقي:** تغييرات الحالة (نشر/أرشفة/مراجعة) تُحدِّث `rows`
 * محليًا في حالة هذا المكوّن فقط، وتُفقَد عند إعادة تحميل الصفحة — تمامًا
 * كما طُلب ("لا تحفظ البيانات فعليًا").
 *
 * QuranContentTable — Phase 11, Module 2.1. The single orchestrator
 * holding all state (search/filter/sort/selection/pagination/local
 * status transitions) — the standard template every future content
 * management page will follow literally (swap only
 * `mockQuranContentRows` and the columns).
 *
 * **No real persistence:** status changes (publish/archive/review)
 * update `rows` in this component's local state only, and are lost on
 * page reload — exactly as requested ("don't actually save data").
 */
export function QuranContentTable() {
  const t = useTranslations("admin");
  const tActions = useTranslations("admin.dataTable.actions");
  const locale = useLocale();
  const { toast } = useToast();

  const [rows, setRows] = useState<QuranContentRow[]>(mockQuranContentRows);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<QuranTableFilterState>({ statuses: [], languages: [], types: [] });
  const [sortKey, setSortKey] = useState<SortKey>("surah");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  function pulseLoading() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_DELAY_MS);
  }

  const filteredSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let result = rows.filter((row) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) return false;
      if (filters.languages.length > 0 && !filters.languages.includes(row.language)) return false;
      if (filters.types.length > 0 && !filters.types.includes(row.contentType)) return false;
      if (normalizedQuery && !row.surahName.toLocaleLowerCase().includes(normalizedQuery)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "surah") compare = a.surahNumber - b.surahNumber || a.verseNumber - b.verseNumber;
      else if (sortKey === "verse") compare = a.verseNumber - b.verseNumber;
      else if (sortKey === "status") compare = a.status.localeCompare(b.status);
      else if (sortKey === "lastModified") compare = a.lastModified.localeCompare(b.lastModified);
      return sortDirection === "asc" ? compare : -compare;
    });

    return result;
  }, [rows, query, filters, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key as SortKey);
      setSortDirection("asc");
    }
  }

  function updateRowStatus(id: string, status: QuranContentStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status, lastModified: new Date().toISOString() } : r)));
    toast({ description: tActions("statusChanged", { status: t(`status.${status}`) }), variant: "success" });
  }

  function bulkUpdateStatus(status: QuranContentStatus) {
    setRows((prev) => prev.map((r) => (selectedIds.has(r.id) ? { ...r, status, lastModified: new Date().toISOString() } : r)));
    toast({ description: t("dataTable.bulk.bulkActionApplied", { count: selectedIds.size }), variant: "success" });
    setSelectedIds(new Set());
  }

  const columns: DataTableColumn<QuranContentRow>[] = [
    { key: "surah", header: t("quran.columns.surah"), sortable: true, render: (row) => `${row.surahName} (${row.surahNumber})` },
    { key: "verse", header: t("quran.columns.verse"), sortable: true, render: (row) => row.verseNumber },
    { key: "type", header: t("quran.columns.type"), render: (row) => t(`quran.type.${row.contentType}`) },
    { key: "language", header: t("quran.columns.language"), render: (row) => <span className="uppercase">{row.language}</span> },
    { key: "status", header: t("quran.columns.status"), sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "lastModified",
      header: t("quran.columns.lastModified"),
      sortable: true,
      render: (row) => new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" }).format(new Date(row.lastModified)),
    },
    { key: "lastReviewer", header: t("quran.columns.lastReviewer"), render: (row) => row.lastReviewer ?? t("quran.columns.noReviewer") },
    {
      key: "actions",
      header: t("dataTable.actions.title"),
      render: (row) => (
        <RowActions
          status={row.status}
          onView={() => window.open(`/${locale}/quran/${row.surahNumber}`, "_blank", "noopener,noreferrer")}
          onEdit={() => toast({ description: tActions("editComingSoon") })}
          onReview={() => updateRowStatus(row.id, row.status === "DRAFT" ? "REVIEW" : "SCHOLARLY_REVIEW")}
          onPublish={() => updateRowStatus(row.id, "PUBLISHED")}
          onArchive={() => updateRowStatus(row.id, "ARCHIVED")}
        />
      ),
    },
  ];

  const selectedArray = Array.from(selectedIds);
  const canBulkPublish = selectedArray.length > 0 && selectedArray.every((id) => rows.find((r) => r.id === id)?.status === "SCHOLARLY_REVIEW");
  const canBulkArchive = selectedArray.length > 0 && selectedArray.every((id) => rows.find((r) => r.id === id)?.status === "PUBLISHED");

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
        onCreateNew={() => toast({ description: tActions("editComingSoon") })}
        filtersSlot={
          <QuranTableFilters
            value={filters}
            onChange={(v) => {
              setFilters(v);
              setPage(1);
              pulseLoading();
            }}
          />
        }
        bulkActionsSlot={
          <BulkActionsBar
            selectedCount={selectedIds.size}
            onClear={() => setSelectedIds(new Set())}
            actions={[
              ...(canBulkPublish ? [{ label: t("dataTable.bulk.publishSelected"), onClick: () => bulkUpdateStatus("PUBLISHED") }] : []),
              ...(canBulkArchive ? [{ label: t("dataTable.bulk.archiveSelected"), onClick: () => bulkUpdateStatus("ARCHIVED") }] : []),
            ]}
          />
        }
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={columns.length} />
      ) : filteredSorted.length === 0 ? (
        <DataTableEmpty
          onClearFilters={() => {
            setQuery("");
            setFilters({ statuses: [], languages: [], types: [] });
          }}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            getRowId={(row) => row.id}
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
                const allSelected = pageRows.every((r) => prev.has(r.id));
                const next = new Set(prev);
                pageRows.forEach((r) => (allSelected ? next.delete(r.id) : next.add(r.id)));
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
