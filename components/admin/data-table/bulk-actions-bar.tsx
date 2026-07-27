"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export interface BulkAction {
  label: string;
  onClick: () => void;
  variant?: "outline" | "destructive";
}

export function BulkActionsBar({ selectedCount, actions, onClear }: { selectedCount: number; actions: BulkAction[]; onClear: () => void }) {
  const t = useTranslations("admin.dataTable");

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-border bg-secondary/50 px-3 py-2">
      <span className="text-sm font-medium text-foreground">{t("selectedCount", { count: selectedCount })}</span>
      {actions.map((action) => (
        <Button key={action.label} variant={action.variant ?? "outline"} size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ))}
      <Button variant="ghost" size="sm" onClick={onClear}>
        {t("clearSelection")}
      </Button>
    </div>
  );
}
