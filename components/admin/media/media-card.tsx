"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { formatFileSize, formatDuration, type MediaAsset } from "@/lib/mock/media";

export function MediaCard({ asset, selected, onSelect }: { asset: MediaAsset; selected: boolean; onSelect: () => void }) {
  const t = useTranslations("admin.media");

  return (
    <Card interactive className={selected ? "ring-2 ring-primary" : undefined}>
      <button type="button" onClick={onSelect} aria-pressed={selected} className="block w-full text-start focus-visible:outline-none">
        <MediaThumbnail type={asset.type} className="h-28 w-full rounded-t-lg" />
        <div className="space-y-1.5 p-3">
          <p className="truncate text-sm font-medium text-foreground">{asset.name}</p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="neutral">{t(`types.${asset.type}`)}</Badge>
            <span>{formatFileSize(asset.fileSizeBytes)}</span>
            {asset.dimensions && (
              <span>
                {asset.dimensions.width}×{asset.dimensions.height}
              </span>
            )}
            {asset.durationSeconds && <span>{formatDuration(asset.durationSeconds)}</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("columns.usage")}: {asset.usageCount}
          </p>
        </div>
      </button>
    </Card>
  );
}
