"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { formatFileSize, mockMediaAssets, type MediaAsset, type MediaType } from "@/lib/mock/media";

/**
 * MediaPicker — Phase 11, Module 4 §"Media Picker". **المكوّن الذي
 * يُثبِت معيار نجاح هذه الوحدة**: مكوّن عام واحد بلا أي افتراض عن
 * السياق الذي استدعاه (محرر مقالة، فتوى، كتاب، درس...). يستقبل
 * `onSelect` كدالة استدعاء فقط — لا يعرف ولا يحتاج أن يعرف من استدعاه.
 * بيانات وهمية بالكامل من `lib/mock/media.ts` — لا اتصال حقيقي.
 *
 * MediaPicker — Phase 11, Module 4, "Media Picker" section. **The
 * component that proves this module's success criterion**: one generic
 * component with zero assumptions about the calling context (article
 * editor, fatwa, book, lesson...). Receives `onSelect` as a plain
 * callback — it doesn't know, and doesn't need to know, who called it.
 * Fully mock data from `lib/mock/media.ts` — no real connection.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  filterType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
  /** يقيِّد الاختيار بنوع وسائط واحد (مثلاً "image" لكتلة صورة) — اختياري. Restricts selection to one media type (e.g. "image" for an image block) — optional. */
  filterType?: MediaType;
}) {
  const t = useTranslations("admin.media.picker");
  const tTypes = useTranslations("admin.media.types");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return mockMediaAssets.filter((asset) => {
      if (filterType && asset.type !== filterType) return false;
      if (normalizedQuery && !asset.name.toLocaleLowerCase().includes(normalizedQuery)) return false;
      return true;
    });
  }, [query, filterType]);

  function handleSelect(asset: MediaAsset) {
    onSelect(asset);
    onOpenChange(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <SearchInput value={query} onChange={setQuery} placeholder="" aria-label={t("title")} />

        <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {filtered.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => handleSelect(asset)}
              className="rounded-[var(--radius)] border border-border text-start hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MediaThumbnail type={asset.type} className="h-20 w-full rounded-t-[calc(var(--radius)-1px)]" />
              <div className="p-2">
                <p className="truncate text-xs font-medium text-foreground">{asset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tTypes(asset.type)} · {formatFileSize(asset.fileSizeBytes)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MediaPickerButton({ onSelect, filterType }: { onSelect: (asset: MediaAsset) => void; filterType?: MediaType }) {
  const t = useTranslations("admin.media.picker");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        {t("openPicker")}
      </Button>
      <MediaPicker open={open} onOpenChange={setOpen} onSelect={onSelect} filterType={filterType} />
    </>
  );
}
