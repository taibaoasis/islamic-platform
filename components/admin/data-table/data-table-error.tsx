"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "@/components/icons";

/**
 * DataTableError — Placeholder جاهز لإعادة الاستخدام حين تُستبدَل
 * Mock Data باستدعاء API حقيقي قابل للفشل. **غير مُفعَّل حيًا** في هذه
 * الصفحة (لا طلب شبكة حقيقي يمكن أن يفشل الآن) — مُصدَّر هنا وجاهز.
 *
 * DataTableError — a ready-to-reuse placeholder for when Mock Data is
 * replaced by a real, failable API call. **Not live-triggered** on this
 * page (no real network request can fail yet) — exported here and
 * ready.
 */
export function DataTableError({ onRetry }: { onRetry?: () => void }) {
  const t = useTranslations("admin.dataTable.error");

  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{t("description")}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
