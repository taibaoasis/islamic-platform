"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { DataTableToolbar } from "@/components/admin/data-table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/admin/data-table/data-table-skeleton";
import { DataTableEmpty } from "@/components/admin/data-table/data-table-empty";
import { BulkActionsBar } from "@/components/admin/data-table/bulk-actions-bar";
import { Pagination } from "@/components/ui/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { Eye } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { RoleBadge } from "@/components/admin/users/role-badge";
import { UserStatusBadge } from "@/components/admin/users/user-status-badge";
import { UsersFilters, type UsersFilterState } from "@/components/admin/users/users-filters";
import { useToast } from "@/hooks/use-toast";
import { mockAdminUsers, type AdminUser, type UserStatus } from "@/lib/mock/admin-users";

const PAGE_SIZE = 10;
const INTERACTION_DELAY_MS = 200;
type SortKey = "name" | "role" | "status" | "lastLogin" | "createdAt";

/**
 * UsersTable — Phase 11, Module 5. **نمط مطابق حرفيًا** لِـ`HadithContentTable`/
 * `GenericContentTable` (Module 2.2/2.3) — إثبات إضافي أن نظام DataTable
 * يخدم بيانات المستخدمين تمامًا كما خدم المحتوى، بلا أي تعديل على
 * `DataTable` نفسه.
 *
 * UsersTable — Phase 11, Module 5. **A structurally identical pattern**
 * to `HadithContentTable`/`GenericContentTable` (Module 2.2/2.3) —
 * further proof the DataTable system serves user data exactly as it
 * served content, with zero modification to `DataTable` itself.
 */
export function UsersTable() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { toast } = useToast();

  const [rows, setRows] = useState<AdminUser[]>(mockAdminUsers);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<UsersFilterState>({ roles: [], statuses: [] });
  const [sortKey, setSortKey] = useState<SortKey>("name");
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
    let result = rows.filter((user) => {
      if (filters.roles.length > 0 && !filters.roles.includes(user.role)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(user.status)) return false;
      if (normalizedQuery && !user.name.toLocaleLowerCase().includes(normalizedQuery) && !user.email.toLocaleLowerCase().includes(normalizedQuery)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let compare = 0;
      if (sortKey === "name") compare = a.name.localeCompare(b.name);
      else if (sortKey === "role") compare = a.role.localeCompare(b.role);
      else if (sortKey === "status") compare = a.status.localeCompare(b.status);
      else if (sortKey === "lastLogin") compare = (a.lastLogin ?? "").localeCompare(b.lastLogin ?? "");
      else if (sortKey === "createdAt") compare = a.createdAt.localeCompare(b.createdAt);
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

  function bulkUpdateStatus(status: UserStatus) {
    setRows((prev) => prev.map((u) => (selectedIds.has(u.id) ? { ...u, status } : u)));
    toast({ description: t("dataTable.bulk.bulkActionApplied", { count: selectedIds.size }), variant: "success" });
    setSelectedIds(new Set());
  }

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium" });

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: "name",
      header: t("users.columns.name"),
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="text-xs">{user.avatarInitials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{user.name}</span>
        </div>
      ),
    },
    { key: "email", header: t("users.columns.email"), render: (user) => <span dir="ltr">{user.email}</span> },
    { key: "role", header: t("users.columns.role"), sortable: true, render: (user) => <RoleBadge role={user.role} label={user.role} /> },
    { key: "status", header: t("users.columns.status"), sortable: true, render: (user) => <UserStatusBadge status={user.status} /> },
    {
      key: "lastLogin",
      header: t("users.columns.lastLogin"),
      sortable: true,
      render: (user) => (user.lastLogin ? dateFormatter.format(new Date(user.lastLogin)) : t("users.columns.neverLoggedIn")),
    },
    { key: "createdAt", header: t("users.columns.createdAt"), sortable: true, render: (user) => dateFormatter.format(new Date(user.createdAt)) },
    {
      key: "actions",
      header: t("dataTable.actions.title"),
      render: (user) => (
        <Link href={`/admin/users/${user.id}`}>
          <IconButton aria-label={t("dataTable.actions.view")} variant="ghost" size="sm">
            <Eye className="size-4" aria-hidden="true" />
          </IconButton>
        </Link>
      ),
    },
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
          <UsersFilters
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
              { label: t("users.bulk.activateSelected"), onClick: () => bulkUpdateStatus("ACTIVE") },
              { label: t("users.bulk.suspendSelected"), onClick: () => bulkUpdateStatus("SUSPENDED"), variant: "destructive" },
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
            setFilters({ roles: [], statuses: [] });
          }}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            getRowId={(user) => user.id}
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
                const allSelected = pageRows.every((u) => prev.has(u.id));
                const next = new Set(prev);
                pageRows.forEach((u) => (allSelected ? next.delete(u.id) : next.add(u.id)));
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
