import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { MessageCircle } from "@/components/icons";

/**
 * CommentsPlaceholder — واجهة فقط، **بلا أي نظام تعليقات حقيقي** (ممنوع
 * صراحة في نطاق هذه المرحلة). لا نموذج إدخال، لا حالة، لا تخزين — بطاقة
 * إعلامية ثابتة فقط.
 *
 * CommentsPlaceholder — UI only, **no real comments system whatsoever**
 * (explicitly forbidden in this phase's scope). No input form, no
 * state, no storage — just a static informational card.
 */
export async function CommentsPlaceholder() {
  const t = await getTranslations("content.comments");

  return (
    <Card className="flex flex-col items-center gap-2 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MessageCircle className="size-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{t("title")}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{t("placeholder")}</p>
    </Card>
  );
}
