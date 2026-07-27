"use client";

import { useTranslations } from "next-intl";

import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import { contentLifecycleStatuses } from "@/lib/admin/lifecycle";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";
import type { QuranContentType } from "@/lib/mock/admin-quran";

const languages = ["ar", "en", "ur", "fr", "id"];
const contentTypes: QuranContentType[] = ["TRANSLATION", "TAFSIR"];

export interface QuranTableFilterState {
  statuses: ContentLifecycleStatus[];
  languages: string[];
  types: QuranContentType[];
}

/** أُعيد بناؤه في Module 2.2 فوق FilterCheckboxGroup العام — لا تكرار للنمط الآن. Rebuilt in Module 2.2 on top of the generic FilterCheckboxGroup — no more pattern duplication. */
export function QuranTableFilters({ value, onChange }: { value: QuranTableFilterState; onChange: (value: QuranTableFilterState) => void }) {
  const t = useTranslations("admin");

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border p-3">
      <FilterCheckboxGroup
        label={t("quran.filters.status")}
        options={contentLifecycleStatuses}
        optionLabel={(status) => t(`status.${status}`)}
        active={value.statuses}
        onToggle={(status) => onChange({ ...value, statuses: value.statuses.includes(status) ? value.statuses.filter((s) => s !== status) : [...value.statuses, status] })}
      />
      <FilterCheckboxGroup
        label={t("quran.filters.language")}
        options={languages}
        optionLabel={(l) => l}
        active={value.languages}
        uppercase
        onToggle={(language) => onChange({ ...value, languages: value.languages.includes(language) ? value.languages.filter((l) => l !== language) : [...value.languages, language] })}
      />
      <FilterCheckboxGroup
        label={t("quran.filters.type")}
        options={contentTypes}
        optionLabel={(type) => t(`quran.type.${type}`)}
        active={value.types}
        onToggle={(type) => onChange({ ...value, types: value.types.includes(type) ? value.types.filter((t2) => t2 !== type) : [...value.types, type] })}
      />
    </div>
  );
}
