"use client";

import { useTranslations } from "next-intl";

import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2 } from "@/components/icons";

/** ShareActions — Client Component (Web Share/Clipboard APIs بحتة، لا Backend). Client Component (pure Web Share/Clipboard APIs, no backend). */
export function ShareActions({ title, url }: { title: string; url: string }) {
  const t = useTranslations("content.actions");
  const { toast } = useToast();

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast({ description: t("linkCopied"), variant: "success" });
    } catch {
      // بيئات بلا صلاحية الحافظة. Environments without clipboard permission.
    }
  }

  async function handleShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // المستخدم ألغى المشاركة. User cancelled the share sheet.
      }
    } else {
      await handleCopyLink();
    }
  }

  return (
    <div className="flex items-center gap-1">
      <IconButton aria-label={t("copyLink")} variant="ghost" size="sm" onClick={handleCopyLink}>
        <Copy className="size-4" aria-hidden="true" />
      </IconButton>
      <IconButton aria-label={t("share")} variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="size-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
}
