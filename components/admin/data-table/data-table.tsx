"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "@/components/icons";

/**
 * DataTable — النموذج القياسي العام لكل صفحات إدارة المحتوى القادمة
 * (Phase 11, Module 2.1). **مبني بالكامل فوق `Table` من Phase 8** —
 * لا إعادة اختراع؛ فقط تركيب عام (Generic) للأعمدة والفرز والتحديد
 * المتعدد فوقه. أي صفحة إدارة لاحقة (حديث، مقالات، فتاوى...) تستخدم
 * هذا المكوّن بتغيير `columns`/`rows` فقط — تحقيقًا حرفيًا لهدف هذه
 * المرحلة ("نفس الجدول... مع تغيير نوع البيانات فقط").
 *
 * DataTable — the generic template for every future content management
 * page (Phase 11, Module 2.1). **Built entirely on top of Phase 8's
 * `Table`** — no reinvention; just a generic (TypeScript-generic)
 * composition of columns, sorting, and multi-select over it. Any later
 * admin page (hadith, articles, fatwas...) uses this exact component
 * by changing only `columns`/`rows` — a literal fulfillment of this
 * phase's stated goal ("the same table... just changing the data
 * type").
 */
export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sortKey,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const t = useTranslations("admin.dataTable");
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(getRowId(r)));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox checked={allSelected} onCheckedChange={onToggleAll} aria-label={t("selectAll")} />
          </TableHead>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.sortable && onSort ? (
                <button
                  type="button"
                  onClick={() => onSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  {col.header}
                  {sortKey === col.key &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="size-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    ))}
                </button>
              ) : (
                col.header
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const id = getRowId(row);
          const isSelected = selectedIds.has(id);
          return (
            <TableRow key={id} aria-selected={isSelected} className={isSelected ? "bg-secondary/50" : undefined}>
              <TableCell>
                <Checkbox checked={isSelected} onCheckedChange={() => onToggleRow(id)} aria-label={id} />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
