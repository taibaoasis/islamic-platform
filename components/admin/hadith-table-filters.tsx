"use client";

import { useTranslations } from "next-intl";

import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import { contentLifecycleStatuses } from "@/lib/admin/lifecycle";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";
import { hadithCollections, type HadithGrade } from "@/lib/mock/hadith";

const languages = ["ar", "en", "ur", "fr"];
const grades: HadithGrade[] = ["SAHIH", "HASAN", "DAIF"];

export interface HadithTableFilterState {
  collections: string[];
  narrators: string[];
  grades: HadithGrade[];
  languages: string[];
  statuses: ContentLifecycleStatus[];
}

/**
 * HadithTableFilters — Module 2.2. مبني بالكامل فوق `FilterCheckboxGroup`
 * العام (لا نمط جديد) — إثبات إعادة استخدام مباشر لتحسين Module 2.2
 * نفسه على أول صفحة تستهلكه.
 *
 * HadithTableFilters — Module 2.2. Built entirely on the generic
 * `FilterCheckboxGroup` (no new pattern) — direct proof of reusing
 * Module 2.2's own improvement on the very first page consuming it.
 */
export function HadithTableFilters({
  value,
  onChange,
  narratorOptions,
}: {
  value: HadithTableFilterState;
  onChange: (value: HadithTableFilterState) => void;
  narratorOptions: string[];
}) {
  const t = useTranslations("admin");
  const tGrade = useTranslations("hadith.grade");

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border p-3">
      <FilterCheckboxGroup
        label={t("hadith.filters.collection")}
        options={hadithCollections.map((c) => c.slug)}
        optionLabel={(slug) => hadithCollections.find((c) => c.slug === slug)?.arabicName ?? slug}
        active={value.collections}
        onToggle={(slug) => onChange({ ...value, collections: value.collections.includes(slug) ? value.collections.filter((c) => c !== slug) : [...value.collections, slug] })}
      />
      <FilterCheckboxGroup
        label={t("hadith.filters.grade")}
        options={grades}
        optionLabel={(grade) => tGrade(grade)}
        active={value.grades}
        onToggle={(grade) => onChange({ ...value, grades: value.grades.includes(grade) ? value.grades.filter((g) => g !== grade) : [...value.grades, grade] })}
      />
      <FilterCheckboxGroup
        label={t("hadith.filters.narrator")}
        options={narratorOptions}
        optionLabel={(n) => n}
        active={value.narrators}
        onToggle={(narrator) => onChange({ ...value, narrators: value.narrators.includes(narrator) ? value.narrators.filter((n) => n !== narrator) : [...value.narrators, narrator] })}
      />
      <FilterCheckboxGroup
        label={t("hadith.filters.language")}
        options={languages}
        optionLabel={(l) => l}
        uppercase
        active={value.languages}
        onToggle={(language) => onChange({ ...value, languages: value.languages.includes(language) ? value.languages.filter((l) => l !== language) : [...value.languages, language] })}
      />
      <FilterCheckboxGroup
        label={t("hadith.filters.status")}
        options={contentLifecycleStatuses}
        optionLabel={(status) => t(`status.${status}`)}
        active={value.statuses}
        onToggle={(status) => onChange({ ...value, statuses: value.statuses.includes(status) ? value.statuses.filter((s) => s !== status) : [...value.statuses, status] })}
      />
    </div>
  );
}
