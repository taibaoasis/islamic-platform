"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/admin/data-table/data-table-empty";
import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fullActivityLog, type ActivityResult } from "@/lib/mock/admin-users";
import type { ActivityAction } from "@/lib/mock/admin";

const PAGE_SIZE = 10;
const INTERACTION_DELAY_MS = 200;
type SortKey = "user" | "action" | "date";

const actions: ActivityAction[] = ["CREATE", "UPDATE", "APPROVE", "DELETE", "PUBLISH"];
const results: ActivityResult[] = ["SUCCESS", "FAILURE"];
const resultVariant = { SUCCESS: "success", FAILURE: "error" } as const;

/** ActivityLogTable — يعيد استخدام DataTable/Toolbar/Pagination/FilterCheckboxGroup بلا أي تعديل، سادس استهلاك مباشر. Reuses DataTable/Toolbar/Pagination/FilterCheckboxGroup with zero modification — sixth direct consumer. */
export function ActivityLogTable() {
  const t = useTranslations("admin");
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [activeActions, setActiveActions] = useState<ActivityAction[]>([]);
  const [activeResults, setActiveResults] = useState<ActivityResult[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("date");
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
    let result = fullActivityLog.filter((entry) => {
      if (activeActions.length > 0 && !activeActions.includes(entry.action)) return false;
      if (activeResults.length > 0 && !activeResults.includes(entry.result)) return false;
      if (normalizedQuery && !entry.actorName.toLocaleLowerCase().includes(normalizedQuery) && !entry.targetTitle.toLocaleLowerCase().includes(normalizedQuery)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "user") compare = a.actorName.localeCompare(b.actorName);
      else if (sortKey === "action") compare = a.action.localeCompare(b.action);
      else if (sortKey === "date") compare = a.timestamp.localeCompare(b.timestamp);
      return sortDirection === "asc" ? compare : -compare;
    });

    return result;
  }, [query, activeActions, activeResults, sortKey, sortDirection]);

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

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" });

  const columns: DataTableColumn<(typeof fullActivityLog)[number]>[] = [
    {
      key: "user",
      header: t("activityLog.columns.user"),
      sortable: true,
      render: (entry) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback className="text-[10px]">{entry.actorInitials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{entry.actorName}</span>
        </div>
      ),
    },
    { key: "action", header: t("activityLog.columns.action"), sortable: true, render: (entry) => t(`activity.actions.${entry.action}`) },
    { key: "targetType", header: t("activityLog.columns.targetType"), render: (entry) => entry.targetType },
    { key: "target", header: t("activityLog.columns.target"), render: (entry) => <span className="line-clamp-1">{entry.targetTitle}</span> },
    { key: "date", header: t("activityLog.columns.date"), sortable: true, render: (entry) => dateFormatter.format(new Date(entry.timestamp)) },
    { key: "result", header: t("activityLog.columns.result"), render: (entry) => <Badge variant={resultVariant[entry.result]}>{t(`activityLog.result.${entry.result}`)}</Badge> },
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
              label={t("activityLog.filters.action")}
              options={actions}
              optionLabel={(a) => t(`activity.actions.${a}`)}
              active={activeActions}
              onToggle={(a) => {
                setActiveActions((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
                setPage(1);
                pulseLoading();
              }}
            />
            <FilterCheckboxGroup
              label={t("activityLog.filters.result")}
              options={results}
              optionLabel={(r) => t(`activityLog.result.${r}`)}
              active={activeResults}
              onToggle={(r) => {
                setActiveResults((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
                setPage(1);
                pulseLoading();
              }}
            />
          </div>
        }
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={columns.length} />
      ) : filteredSorted.length === 0 ? (
        <DataTableEmpty
          onClearFilters={() => {
            setQuery("");
            setActiveActions([]);
            setActiveResults([]);
          }}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            getRowId={(entry) => entry.id}
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
                const allSelected = pageRows.every((e) => prev.has(e.id));
                const next = new Set(prev);
                pageRows.forEach((e) => (allSelected ? next.delete(e.id) : next.add(e.id)));
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
