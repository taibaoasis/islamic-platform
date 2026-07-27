"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { DataTable, type DataTableColumn } from "@/components/admin/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { supportedLanguages, getLanguageStats, type LanguageInfo } from "@/lib/mock/localization";

/** LanguagesTable — يعيد استخدام DataTable حتى لمجموعة بيانات صغيرة، اتساقًا مع بقية لوحة الإدارة. LanguagesTable — reuses DataTable even for a small dataset, for consistency with the rest of the admin panel. */
export function LanguagesTable() {
  const t = useTranslations("admin.localization.languages");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const columns: DataTableColumn<LanguageInfo>[] = [
    { key: "language", header: t("columns.language"), render: (l) => l.nameLocalized.ar },
    { key: "code", header: t("columns.code"), render: (l) => <span dir="ltr" className="uppercase">{l.isoCode}</span> },
    { key: "direction", header: t("columns.direction"), render: (l) => <span dir="ltr">{l.direction}</span> },
    { key: "status", header: t("columns.status"), render: (l) => <Badge variant={l.isActive ? "success" : "neutral"}>{l.isActive ? t("active") : t("inactive")}</Badge> },
    {
      key: "completion",
      header: t("columns.completion"),
      render: (l) => `${getLanguageStats(l.isoCode).completionPercentage}%`,
    },
    { key: "itemsCount", header: t("columns.itemsCount"), render: (l) => getLanguageStats(l.isoCode).totalItems },
  ];

  return (
    <DataTable
      columns={columns}
      rows={supportedLanguages}
      getRowId={(l) => l.isoCode}
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
        setSelectedIds((prev) => (prev.size === supportedLanguages.length ? new Set() : new Set(supportedLanguages.map((l) => l.isoCode))))
      }
    />
  );
}
