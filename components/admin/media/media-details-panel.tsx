"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "@/i18n/navigation";
import { X, Copy } from "@/components/icons";
import { MediaThumbnail } from "@/components/admin/media/media-thumbnail";
import { useToast } from "@/hooks/use-toast";
import { formatFileSize, formatDuration, type MediaAsset } from "@/lib/mock/media";

/**
 * MediaDetailsPanel — Phase 11, Module 4 §"Media Details Panel". لوحة
 * جانبية داخل الصفحة (نمط Master-Detail، لا Dialog) — أنسب لسياق
 * "استعراض عنصر واحد أثناء تصفح شبكة/قائمة كاملة" من نافذة منبثقة
 * تحجب بقية المحتوى.
 *
 * MediaDetailsPanel — Phase 11, Module 4, "Media Details Panel" section.
 * An in-page sidebar (Master-Detail pattern, not a Dialog) — better
 * suited to "reviewing one item while browsing a full grid/list" than a
 * modal that would block the rest of the content.
 */
export function MediaDetailsPanel({ asset, onClose }: { asset: MediaAsset; onClose: () => void }) {
  const t = useTranslations("admin.media");
  const tDetails = useTranslations("admin.media.details");
  const { toast } = useToast();

  async function handleCopyLink() {
    const url = `${window.location.origin}/media/${asset.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ description: tDetails("linkCopied"), variant: "success" });
    } catch {
      // بيئات بلا صلاحية الحافظة. Environments without clipboard permission.
    }
  }

  return (
    <Card className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col overflow-y-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{tDetails("title")}</p>
        <IconButton aria-label={tDetails("close")} variant="ghost" size="sm" onClick={onClose}>
          <X className="size-4" aria-hidden="true" />
        </IconButton>
      </div>

      <MediaThumbnail type={asset.type} className="mb-3 h-32 w-full rounded-[var(--radius)]" />

      <p className="mb-1 font-medium text-foreground">{asset.name}</p>
      <div className="mb-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
        <Badge variant="neutral">{t(`types.${asset.type}`)}</Badge>
        <span>{formatFileSize(asset.fileSizeBytes)}</span>
        {asset.dimensions && (
          <span>
            {asset.dimensions.width}×{asset.dimensions.height}
          </span>
        )}
        {asset.durationSeconds && <span>{formatDuration(asset.durationSeconds)}</span>}
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold text-foreground">{tDetails("altText")}</dt>
          <dd className="text-muted-foreground">{asset.altText || tDetails("noAltText")}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-foreground">{tDetails("caption")}</dt>
          <dd className="text-muted-foreground">{asset.caption || tDetails("noCaption")}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-foreground">{tDetails("description")}</dt>
          <dd className="text-muted-foreground">{asset.description}</dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold text-foreground">{tDetails("tags")}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold text-foreground">{tDetails("usedIn")}</dt>
          <dd>
            {asset.usedIn.length === 0 ? (
              <span className="text-muted-foreground">{tDetails("noUsage")}</span>
            ) : (
              <ul className="space-y-1">
                {asset.usedIn.map((usage) => (
                  <li key={usage.href}>
                    <Link href={usage.href} className="text-primary hover:underline">
                      {usage.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>

      <Button variant="outline" size="sm" className="mt-4" onClick={handleCopyLink}>
        <Copy className="size-4" aria-hidden="true" />
        {tDetails("copyLink")}
      </Button>
    </Card>
  );
}
