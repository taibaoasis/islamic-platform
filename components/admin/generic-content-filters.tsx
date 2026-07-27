"use client";

import { useTranslations } from "next-intl";

import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import { contentLifecycleStatuses } from "@/lib/admin/lifecycle";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";
import { contentKindLabels, type ContentKind } from "@/lib/mock/content";
import { useLocale } from "@/hooks/use-locale";

const languages = ["ar", "en", "ur", "fr"];
const kinds: ContentKind[] = ["article", "fatwa", "book", "lesson", "news"];

export interface GenericContentFilterState {
  kinds: ContentKind[];
  categories: string[];
  languages: string[];
  statuses: ContentLifecycleStatus[];
  authors: string[];
}

/**
 * GenericContentFilters — Module 2.3. مبني بالكامل فوق `FilterCheckboxGroup`
 * (لا نمط جديد) — ثالث استهلاك مباشر للتحسين العام من Module 2.2.
 * GenericContentFilters — Module 2.3. Built entirely on
 * `FilterCheckboxGroup` (no new pattern) — the third direct consumer of
 * Module 2.2's general improvement.
 */
export function GenericContentFilters({
  value,
  onChange,
  categoryOptions,
  authorOptions,
}: {
  value: GenericContentFilterState;
  onChange: (value: GenericContentFilterState) => void;
  categoryOptions: string[];
  authorOptions: string[];
}) {
  const t = useTranslations("admin");
  const { locale } = useLocale();

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border p-3">
      <FilterCheckboxGroup
        label={t("content.filters.kind")}
        options={kinds}
        optionLabel={(kind) => contentKindLabels[kind][locale === "ar" ? "ar" : "en"]}
        active={value.kinds}
        onToggle={(kind) => onChange({ ...value, kinds: value.kinds.includes(kind) ? value.kinds.filter((k) => k !== kind) : [...value.kinds, kind] })}
      />
      <FilterCheckboxGroup
        label={t("content.filters.category")}
        options={categoryOptions}
        optionLabel={(c) => c}
        active={value.categories}
        onToggle={(category) => onChange({ ...value, categories: value.categories.includes(category) ? value.categories.filter((c) => c !== category) : [...value.categories, category] })}
      />
      <FilterCheckboxGroup
        label={t("content.filters.author")}
        options={authorOptions}
        optionLabel={(a) => a}
        active={value.authors}
        onToggle={(author) => onChange({ ...value, authors: value.authors.includes(author) ? value.authors.filter((a) => a !== author) : [...value.authors, author] })}
      />
      <FilterCheckboxGroup
        label={t("content.filters.language")}
        options={languages}
        optionLabel={(l) => l}
        uppercase
        active={value.languages}
        onToggle={(language) => onChange({ ...value, languages: value.languages.includes(language) ? value.languages.filter((l) => l !== language) : [...value.languages, language] })}
      />
      <FilterCheckboxGroup
        label={t("content.filters.status")}
        options={contentLifecycleStatuses}
        optionLabel={(status) => t(`status.${status}`)}
        active={value.statuses}
        onToggle={(status) => onChange({ ...value, statuses: value.statuses.includes(status) ? value.statuses.filter((s) => s !== status) : [...value.statuses, status] })}
      />
    </div>
  );
}
