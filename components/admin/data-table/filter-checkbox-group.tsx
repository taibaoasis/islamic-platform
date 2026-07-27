"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * FilterCheckboxGroup — تحسين عام استُخرِج أثناء Module 2.2. كان نمط
 * "تسمية + Checkbox متعدد + Label" مكرَّرًا ثلاث مرات داخل
 * `QuranTableFilters` (الحالة، اللغة، النوع)؛ استُخرِج هنا كمكوّن عام
 * واحد يخدم أي مجموعة فلترة Checkbox في أي صفحة إدارة حالية أو مستقبلية.
 *
 * FilterCheckboxGroup — general improvement extracted during
 * Module 2.2. The "label + multi-checkbox + Label" pattern was
 * repeated three times inside `QuranTableFilters` (status, language,
 * type); extracted here as one generic component serving any checkbox
 * filter group on any current or future admin page.
 */
export function FilterCheckboxGroup<T extends string>({
  label,
  options,
  optionLabel,
  active,
  onToggle,
  uppercase,
}: {
  label: string;
  options: T[];
  optionLabel: (option: T) => string;
  active: T[];
  onToggle: (option: T) => void;
  uppercase?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold text-muted-foreground">{label}:</span>
      {options.map((option) => (
        <div key={option} className="flex items-center gap-1.5">
          <Checkbox id={`filter-${label}-${option}`} checked={active.includes(option)} onCheckedChange={() => onToggle(option)} />
          <Label htmlFor={`filter-${label}-${option}`} className={uppercase ? "cursor-pointer text-sm font-normal uppercase" : "cursor-pointer text-sm font-normal"}>
            {optionLabel(option)}
          </Label>
        </div>
      ))}
    </div>
  );
}
