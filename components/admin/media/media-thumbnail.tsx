import { ImageIcon, Music, Video, FileText } from "@/components/icons";
import type { MediaType } from "@/lib/mock/media";
import { cn } from "@/lib/utils";

const iconByType = { image: ImageIcon, audio: Music, video: Video, document: FileText } as const;

/**
 * MediaThumbnail — عام عبر كل الأنواع الأربعة، مُستخدَم في Grid وList
 * ولوحة التفاصيل ومنتقي الوسائط معًا — لا نسخة منفصلة لكل سياق.
 * Generic across all four types, used in Grid, List, the details panel,
 * and the media picker alike — no separate copy per context.
 */
export function MediaThumbnail({ type, className }: { type: MediaType; className?: string }) {
  const Icon = iconByType[type];
  return (
    <div className={cn("flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 text-foreground/40", className)}>
      <Icon className="size-8" aria-hidden="true" />
    </div>
  );
}
