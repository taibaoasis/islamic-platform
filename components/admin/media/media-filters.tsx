"use client";

import { useTranslations } from "next-intl";

import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import type { MediaType } from "@/lib/mock/media";

const types: MediaType[] = ["image", "audio", "video", "document"];

export interface MediaFilterState {
  types: MediaType[];
  uploaders: string[];
  tags: string[];
}

/** MediaFilters — رابع استهلاك مباشر لـ FilterCheckboxGroup (بعد القرآن والحديث والمحتوى العام). MediaFilters — the fourth direct consumer of FilterCheckboxGroup (after Quran, Hadith, and Generic Content). */
export function MediaFilters({
  value,
  onChange,
  uploaderOptions,
  tagOptions,
}: {
  value: MediaFilterState;
  onChange: (value: MediaFilterState) => void;
  uploaderOptions: string[];
  tagOptions: string[];
}) {
  const t = useTranslations("admin.media");

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border p-3">
      <FilterCheckboxGroup
        label={t("filters.type")}
        options={types}
        optionLabel={(type) => t(`types.${type}`)}
        active={value.types}
        onToggle={(type) => onChange({ ...value, types: value.types.includes(type) ? value.types.filter((tp) => tp !== type) : [...value.types, type] })}
      />
      <FilterCheckboxGroup
        label={t("filters.uploader")}
        options={uploaderOptions}
        optionLabel={(u) => u}
        active={value.uploaders}
        onToggle={(uploader) => onChange({ ...value, uploaders: value.uploaders.includes(uploader) ? value.uploaders.filter((u) => u !== uploader) : [...value.uploaders, uploader] })}
      />
      <FilterCheckboxGroup
        label={t("filters.tags")}
        options={tagOptions}
        optionLabel={(tag) => tag}
        active={value.tags}
        onToggle={(tag) => onChange({ ...value, tags: value.tags.includes(tag) ? value.tags.filter((tg) => tg !== tag) : [...value.tags, tag] })}
      />
    </div>
  );
}
