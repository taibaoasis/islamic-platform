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
import { GenericContentFilters, type GenericContentFilterState } from "@/components/admin/generic-content-filters";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "@/i18n/navigation";
import { useToast } from "@/hooks/use-toast";
import { mockAdminContentRows, contentKindUrlSegment, type AdminContentRow } from "@/lib/mock/admin-content";
import type { ContentKind } from "@/lib/mock/content";

const PAGE_SIZE = 10;
const INTERACTION_DELAY_MS = 200;

type SortKey = "title" | "category" | "status" | "lastModified";

/**
 * GenericContentTable — Module 2.3. **إثبات الجنرالية الكامل**: مكوّن
 * واحد يدير خمسة أنواع محتوى مختلفة (مقالة/فتوى/كتاب/درس/خبر) عبر خاصية
 * `initialKind` فقط — إعادة استخدام حرفية لكل قطعة من نظام DataTable
 * (Module 2.1) بلا أي تعديل، للمرة الثالثة على التوالي.
 *
 * القيد المُطبَّق فقط على قسم "نوع المحتوى" في الفلاتر: `initialKind`
 * يضبط الفلتر الابتدائي (رابط عميق مباشر لكل نوع من الشريط الجانبي)،
 * لكنه **ليس قيدًا صلبًا** — يمكن للمستخدم تغيير التصفية لعرض أنواع
 * أخرى أو مزيج منها، إثباتًا إضافيًا أن الجدول عام حقًا لا مُقيَّد
 * بمسار واحد.
 *
 * GenericContentTable — Module 2.3. **Full proof of genericity**: one
 * component manages five different content kinds (article/fatwa/book/
 * lesson/news) via the `initialKind` prop alone — literal reuse of
 * every piece of the DataTable system (Module 2.1) with zero
 * modification, for the third consecutive time.
 *
 * The constraint applies only to the "content type" filter's initial
 * value: `initialKind` sets the starting filter (a direct deep link
 * per type from the sidebar), but it's **not a hard restriction** —
 * the user can change the filter to show other kinds or a mix, further
 * proof the table is genuinely generic, not tied to a single route.
 */
export function GenericContentTable({ initialKind }: { initialKind: ContentKind }) {
  const t = useTranslations("admin");
  const tActions = useTranslations("admin.dataTable.actions");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();

  const [rows, setRows] = useState<AdminContentRow[]>(mockAdminContentRows);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<GenericContentFilterState>({ kinds: [initialKind], categories: [], languages: [], statuses: [], authors: [] });
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.category))).sort(), [rows]);
  const authorOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.authorName))).sort(), [rows]);

  function pulseLoading() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_DELAY_MS);
  }

  const filteredSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let result = rows.filter((row) => {
      if (filters.kinds.length > 0 && !filters.kinds.includes(row.kind)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(row.category)) return false;
      if (filters.languages.length > 0 && !filters.languages.includes(row.language)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(row.status)) return false;
      if (filters.authors.length > 0 && !filters.authors.includes(row.authorName)) return false;
      if (
        normalizedQuery &&
        !row.title.toLocaleLowerCase().includes(normalizedQuery) &&
        !row.excerpt.toLocaleLowerCase().includes(normalizedQuery) &&
        !row.authorName.toLocaleLowerCase().includes(normalizedQuery)
      )
        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "title") compare = a.title.localeCompare(b.title);
      else if (sortKey === "category") compare = a.category.localeCompare(b.category);
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
    if (key === sortKey) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key as SortKey);
      setSortDirection("asc");
    }
  }

  function updateRowStatus(id: string, status: ContentLifecycleStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status, lastModified: new Date().toISOString() } : r)));
    toast({ description: tActions("statusChanged", { status: t(`status.${status}`) }), variant: "success" });
  }

  function bulkUpdateStatus(status: ContentLifecycleStatus) {
    setRows((prev) => prev.map((r) => (selectedIds.has(r.id) ? { ...r, status, lastModified: new Date().toISOString() } : r)));
    toast({ description: t("dataTable.bulk.bulkActionApplied", { count: selectedIds.size }), variant: "success" });
    setSelectedIds(new Set());
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  const columns: DataTableColumn<AdminContentRow>[] = [
    { key: "title", header: t("content.columns.title"), sortable: true, render: (row) => <span className="line-clamp-1 font-medium text-foreground">{row.title}</span> },
    { key: "author", header: t("content.columns.author"), render: (row) => row.authorName },
    { key: "category", header: t("content.columns.category"), sortable: true, render: (row) => row.category },
    { key: "language", header: t("content.columns.language"), render: (row) => <span className="uppercase">{row.language}</span> },
    { key: "status", header: t("content.columns.status"), sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: "lastModified", header: t("content.columns.lastModified"), sortable: true, render: (row) => dateFormatter.format(new Date(row.lastModified)) },
    { key: "citations", header: t("content.columns.citations"), render: (row) => (row.citationsCount > 0 ? row.citationsCount : t("content.columns.noCitations")) },
    {
      key: "actions",
      header: t("dataTable.actions.title"),
      render: (row) => (
        <RowActions
          status={row.status}
          onView={() => window.open(`/${locale}/${contentKindUrlSegment[row.kind]}/${row.slug}`, "_blank", "noopener,noreferrer")}
          onEdit={() => router.push(`/admin/editor/${contentKindUrlSegment[row.kind]}/${row.slug}`)}
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
  const hasError = false; // DataTableError جاهز، غير مُفعَّل حيًا (بلا API حقيقي). Ready, not live-triggered (no real API).

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
          <GenericContentFilters
            value={filters}
            categoryOptions={categoryOptions}
            authorOptions={authorOptions}
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
            setFilters({ kinds: [], categories: [], languages: [], statuses: [], authors: [] });
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
