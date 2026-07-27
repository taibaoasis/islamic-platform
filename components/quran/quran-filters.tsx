"use client";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type RevelationFilter = "MECCAN" | "MEDINAN";

export function QuranFilters({
  active,
  onChange,
}: {
  active: RevelationFilter[];
  onChange: (types: RevelationFilter[]) => void;
}) {
  const t = useTranslations("quran.filters");

  function toggle(type: RevelationFilter) {
    onChange(active.includes(type) ? active.filter((x) => x !== type) : [...active, type]);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-medium text-foreground">{t("title")}:</span>
      <div className="flex items-center gap-2">
        <Checkbox id="filter-meccan" checked={active.includes("MECCAN")} onCheckedChange={() => toggle("MECCAN")} />
        <Label htmlFor="filter-meccan" className="cursor-pointer font-normal">
          {t("meccan")}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="filter-medinan" checked={active.includes("MEDINAN")} onCheckedChange={() => toggle("MEDINAN")} />
        <Label htmlFor="filter-medinan" className="cursor-pointer font-normal">
          {t("medinan")}
        </Label>
      </div>
      {active.length > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onChange([])}>
          {t("clearAll")}
        </Button>
      )}
    </div>
  );
}
