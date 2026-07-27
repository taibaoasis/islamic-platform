"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/admin/data-table/data-table-empty";
import { Pagination } from "@/components/ui/pagination";
import { IconButton } from "@/components/ui/icon-button";
import { MediaCard } from "@/components/admin/media/media-card";
import { MediaFilters, type MediaFilterState } from "@/components/admin/media/media-filters";
import { MediaDetailsPanel } from "@/components/admin/media/media-details-panel";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { MediaUploadDialog } from "@/components/admin/media/media-upload-dialog";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Rows3, UploadCloud } from "@/components/icons";
import { formatFileSize, formatDuration, mockMediaAssets, type MediaAsset } from "@/lib/mock/media";

const PAGE_SIZE = 12;
const INTERACTION_DELAY_MS = 200;
type SortKey = "name" | "type" | "size" | "uploadedAt";
type ViewMode = "grid" | "list";

/**
 * MediaLibraryView — Phase 11, Module 4. عرض القائمة (List) **يعيد
 * استخدام `DataTable` من Module 2.1 مباشرة بلا أي تعديل** (خامس
 * استهلاك مباشر له بعد القرآن، الحديث، المحتوى العام، والمحرر لا
 * يستخدمه لكنه يستخدم أجزاء أخرى) — عرض الشبكة (Grid) هو الوحيد الذي
 * احتاج مكوّنًا جديدًا (`MediaCard`) لأن `DataTable` عرض صفوف لا بطاقات
 * بطبيعته.
 *
 * MediaLibraryView — Phase 11, Module 4. List view **reuses `DataTable`
 * from Module 2.1 directly with zero modification** — Grid view is the
 * only mode that needed a new component (`MediaCard`) since `DataTable`
 * is inherently row-based, not card-based.
 */
export function MediaLibraryView() {
  const t = useTranslations("admin.media");
  const locale = useLocale();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<MediaFilterState>({ types: [], uploaders: [], tags: [] });
  const [sortKey, setSortKey] = useState<SortKey>("uploadedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const uploaderOptions = useMemo(() => Array.from(new Set(mockMediaAssets.map((a) => a.uploadedBy))).sort(), []);
  const tagOptions = useMemo(() => Array.from(new Set(mockMediaAssets.flatMap((a) => a.tags))).sort(), []);

  function pulseLoading() {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), INTERACTION_DELAY_MS);
  }

  const filteredSorted = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let result = mockMediaAssets.filter((asset) => {
      if (filters.types.length > 0 && !filters.types.includes(asset.type)) return false;
      if (filters.uploaders.length > 0 && !filters.uploaders.includes(asset.uploadedBy)) return false;
      if (filters.tags.length > 0 && !asset.tags.some((tag) => filters.tags.includes(tag))) return false;
      if (normalizedQuery && !asset.name.toLocaleLowerCase().includes(normalizedQuery) && !asset.tags.some((tag) => tag.toLocaleLowerCase().includes(normalizedQuery))) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "name") compare = a.name.localeCompare(b.name);
      else if (sortKey === "type") compare = a.type.localeCompare(b.type);
      else if (sortKey === "size") compare = a.fileSizeBytes - b.fileSizeBytes;
      else if (sortKey === "uploadedAt") compare = a.uploadedAt.localeCompare(b.uploadedAt);
      return sortDirection === "asc" ? compare : -compare;
    });

    return result;
  }, [query, filters, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filteredSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selectedAsset = selectedId ? mockMediaAssets.find((a) => a.id === selectedId) : undefined;

  function handleSort(key: string) {
    if (key === sortKey) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key as SortKey);
      setSortDirection("asc");
    }
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  const columns: DataTableColumn<MediaAsset>[] = [
    {
      key: "name",
      header: t("columns.name"),
      sortable: true,
      render: (asset) => (
        <button type="button" onClick={() => setSelectedId(asset.id)} className="flex items-center gap-2 text-start hover:text-primary">
          <MediaThumbnail type={asset.type} className="size-8 shrink-0 rounded" />
          <span className="line-clamp-1 font-medium text-foreground">{asset.name}</span>
        </button>
      ),
    },
    { key: "type", header: t("columns.type"), sortable: true, render: (asset) => t(`types.${asset.type}`) },
    { key: "size", header: t("columns.size"), sortable: true, render: (asset) => formatFileSize(asset.fileSizeBytes) },
    {
      key: "dimensions",
      header: t("columns.dimensions"),
      render: (asset) => (asset.dimensions ? `${asset.dimensions.width}×${asset.dimensions.height}` : asset.durationSeconds ? formatDuration(asset.durationSeconds) : "—"),
    },
    { key: "uploadedAt", header: t("columns.uploadedAt"), sortable: true, render: (asset) => dateFormatter.format(new Date(asset.uploadedAt)) },
    { key: "uploadedBy", header: t("columns.uploadedBy"), render: (asset) => asset.uploadedBy },
    { key: "usage", header: t("columns.usage"), render: (asset) => asset.usageCount },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <DataTableToolbar
          searchValue={query}
          onSearchChange={(v) => {
            setQuery(v);
            setPage(1);
            pulseLoading();
          }}
          resultsCount={filteredSorted.length}
          onCreateNew={() => setUploadOpen(true)}
          filtersSlot={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <MediaFilters
                value={filters}
                uploaderOptions={uploaderOptions}
                tagOptions={tagOptions}
                onChange={(v) => {
                  setFilters(v);
                  setPage(1);
                  pulseLoading();
                }}
              />
              <div className="flex shrink-0 items-center gap-1 rounded-[var(--radius)] border border-border p-1">
                <IconButton aria-label={t("view.grid")} aria-pressed={viewMode === "grid"} variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton aria-label={t("view.list")} aria-pressed={viewMode === "list"} variant={viewMode === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                  <Rows3 className="size-4" aria-hidden="true" />
                </IconButton>
              </div>
            </div>
          }
        />

        {isLoading ? (
          <DataTableSkeleton columnCount={viewMode === "list" ? columns.length : 4} />
        ) : filteredSorted.length === 0 ? (
          <DataTableEmpty
            onClearFilters={() => {
              setQuery("");
              setFilters({ types: [], uploaders: [], tags: [] });
            }}
          />
        ) : viewMode === "grid" ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageItems.map((asset) => (
                <MediaCard key={asset.id} asset={asset} selected={asset.id === selectedId} onSelect={() => setSelectedId(asset.id === selectedId ? null : asset.id)} />
              ))}
            </div>
            <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={pageItems}
              getRowId={(asset) => asset.id}
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
                  const allSelected = pageItems.every((a) => prev.has(a.id));
                  const next = new Set(prev);
                  pageItems.forEach((a) => (allSelected ? next.delete(a.id) : next.add(a.id)));
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

      {selectedAsset ? (
        <MediaDetailsPanel asset={selectedAsset} onClose={() => setSelectedId(null)} />
      ) : (
        <div className="hidden lg:block">
          <Button variant="outline" className="w-full" onClick={() => setUploadOpen(true)}>
            <UploadCloud className="size-4" aria-hidden="true" />
            {t("upload.button")}
          </Button>
        </div>
      )}

      <MediaUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
