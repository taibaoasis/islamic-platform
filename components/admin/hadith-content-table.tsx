"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/admin/data-table/data-table-empty";
import { DataTableError } from "@/components/admin/data-table/data-table-error";
import { BulkActionsBar } from "@/components/admin/data-table/bulk-actions-bar";
import { RowActions } from "@/components/admin/data-table/row-actions";
import { StatusBadge, type ContentLifecycleStatus } from "@/components/admin/status-badge";
import { HadithTableFilters, type HadithTableFilterState } from "@/components/admin/hadith-table-filters";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { mockHadithContentRows, type HadithContentRow } from "@/lib/mock/admin-hadith";

const PAGE_SIZE = 10;
const INTERACTION_DELAY_MS = 200;

type SortKey = "hadithNumber" | "collection" | "grade" | "status" | "lastReviewed";

const gradeVariant = { SAHIH: "success", HASAN: "info", DAIF: "warning" } as const;

/**
 * HadithContentTable — Module 2.2. **إعادة استخدام حرفية** لـ
 * `DataTable`, `DataTableToolbar`, `BulkActionsBar`, `RowActions`,
 * `StatusBadge`, `Pagination`, `DataTableSkeleton`, `DataTableEmpty`,
 * `DataTableError` من Module 2.1 — صفر تعديل على أي منها. البنية العامة
 * لهذا الملف (الحالة، الفرز، الصفحات، انتقالات الحالة المحلية) منسوخة
 * حرفيًا من `QuranContentTable` مع تبديل نوع البيانات والأعمدة فقط —
 * تحقيقًا لهدف هذه الوحدة بالضبط.
 *
 * HadithContentTable — Module 2.2. **Literal reuse** of `DataTable`,
 * `DataTableToolbar`, `BulkActionsBar`, `RowActions`, `StatusBadge`,
 * `Pagination`, `DataTableSkeleton`, `DataTableEmpty`, `DataTableError`
 * from Module 2.1 — zero modification to any of them. This file's
 * overall structure (state, sorting, pagination, local status
 * transitions) is copied verbatim from `QuranContentTable`, swapping
 * only the data type and columns — exactly this module's stated goal.
 */
export function HadithContentTable() {
  const t = useTranslations("admin");
  const tActions = useTranslations("admin.dataTable.actions");
  const tGrade = useTranslations("hadith.grade");
  const locale = useLocale();
  const { toast } = useToast();

  const [rows, setRows] = useState<HadithContentRow[]>(mockHadithContentRows);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<HadithTableFilterState>({ collections: [], narrators: [], grades: [], languages: [], statuses: [] });
  const [sortKey, setSortKey] = useState<SortKey>("hadithNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const narratorOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.narrator))).sort(), [rows]);

  function pulseLoading() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_DELAY_MS);
  }

  const filteredSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let result = rows.filter((row) => {
      if (filters.collections.length > 0 && !filters.collections.includes(row.collectionSlug)) return false;
      if (filters.narrators.length > 0 && !filters.narrators.includes(row.narrator)) return false;
      if (filters.grades.length > 0 && !filters.grades.includes(row.grade)) return false;
      if (filters.languages.length > 0 && !filters.languages.includes(row.language)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) return false;
      if (
        normalizedQuery &&
        !row.matnExcerpt.toLocaleLowerCase().includes(normalizedQuery) &&
        !row.narrator.toLocaleLowerCase().includes(normalizedQuery) &&
        !row.collectionName.toLocaleLowerCase().includes(normalizedQuery)
      )
        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "hadithNumber") compare = a.hadithNumber - b.hadithNumber;
      else if (sortKey === "collection") compare = a.collectionName.localeCompare(b.collectionName);
      else if (sortKey === "grade") compare = a.grade.localeCompare(b.grade);
      else if (sortKey === "status") compare = a.status.localeCompare(b.status);
      else if (sortKey === "lastReviewed") compare = (a.lastReviewedAt ?? "").localeCompare(b.lastReviewedAt ?? "");
      return sortDirection === "asc" ? compare : -compare;
    });

    return result;
  }, [rows, query, filters, sortKey, sortDirection]);

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

  function updateRowStatus(id: string, status: ContentLifecycleStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status, lastReviewedAt: new Date().toISOString() } : r)));
    toast({ description: tActions("statusChanged", { status: t(`status.${status}`) }), variant: "success" });
  }

  function bulkUpdateStatus(status: ContentLifecycleStatus) {
    setRows((prev) => prev.map((r) => (selectedIds.has(r.id) ? { ...r, status, lastReviewedAt: new Date().toISOString() } : r)));
    toast({ description: t("dataTable.bulk.bulkActionApplied", { count: selectedIds.size }), variant: "success" });
    setSelectedIds(new Set());
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  const columns: DataTableColumn<HadithContentRow>[] = [
    { key: "hadithNumber", header: t("hadith.columns.hadithNumber"), sortable: true, render: (row) => row.hadithNumber },
    { key: "collection", header: t("hadith.columns.collection"), sortable: true, render: (row) => row.collectionName },
    { key: "chapter", header: t("hadith.columns.chapter"), render: (row) => row.chapter },
    { key: "narrator", header: t("hadith.columns.narrator"), render: (row) => row.narrator },
    { key: "grade", header: t("hadith.columns.grade"), sortable: true, render: (row) => <Badge variant={gradeVariant[row.grade]}>{tGrade(row.grade)}</Badge> },
    { key: "language", header: t("hadith.columns.language"), render: (row) => <span className="uppercase">{row.language}</span> },
    { key: "status", header: t("hadith.columns.status"), sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "lastReviewed",
      header: t("hadith.columns.lastReviewed"),
      sortable: true,
      render: (row) => (row.lastReviewedAt ? dateFormatter.format(new Date(row.lastReviewedAt)) : t("hadith.columns.noReview")),
    },
    {
      key: "actions",
      header: t("dataTable.actions.title"),
      render: (row) => (
        <RowActions
          status={row.status}
          onView={() => window.open(`/${locale}/hadith/${row.collectionSlug}`, "_blank", "noopener,noreferrer")}
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

  // DataTableError جاهز وغير مُفعَّل حيًا هنا أيضًا (بلا طلب شبكة حقيقي
  // قابل للفشل) — تمامًا كما في Module 2.1، بلا أي إعادة كتابة.
  // DataTableError is ready but not live-triggered here either (no real
  // failable network request) — exactly as in Module 2.1, with zero
  // rewriting.
  const hasError = false;

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
          <HadithTableFilters
            value={filters}
            narratorOptions={narratorOptions}
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

      {hasError ? (
        <DataTableError onRetry={() => undefined} />
      ) : isLoading ? (
        <DataTableSkeleton columnCount={columns.length} />
      ) : filteredSorted.length === 0 ? (
        <DataTableEmpty
          onClearFilters={() => {
            setQuery("");
            setFilters({ collections: [], narrators: [], grades: [], languages: [], statuses: [] });
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
