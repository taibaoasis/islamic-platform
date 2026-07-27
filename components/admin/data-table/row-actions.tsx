"use client";

import { useTranslations } from "next-intl";

import { IconButton } from "@/components/ui/icon-button";
import { Eye, Pencil, ArrowUpDown, UploadCloud, Folder } from "@/components/icons";
import type { ContentLifecycleStatus } from "@/components/admin/status-badge";

/**
 * RowActions — عام لكل صفوف أي جدول إدارة محتوى مستقبلي — خمسة أزرار
 * بالحرف كما طُلب (عرض/تعديل/مراجعة/نشر/أرشفة). تُعطَّل الأزرار حسب
 * صحة انتقال الحالة (النمط A، Content Models §0.3) — "نشر" غير متاح
 * إلا من `SCHOLARLY_REVIEW`، لا اختصار للاعتماد العلمي أبدًا حتى في
 * واجهة تجريبية.
 *
 * RowActions — generic for any future content management table's rows
 * — exactly five buttons as requested (View/Edit/Review/Publish/
 * Archive). Buttons are disabled based on valid status transitions
 * (Pattern A, Content Models §0.3) — "Publish" is only available from
 * `SCHOLARLY_REVIEW`, never skipping scholarly approval even in a demo UI.
 */
export function RowActions({
  status,
  onView,
  onEdit,
  onReview,
  onPublish,
  onArchive,
}: {
  status: ContentLifecycleStatus;
  onView: () => void;
  onEdit: () => void;
  onReview: () => void;
  onPublish: () => void;
  onArchive: () => void;
}) {
  const t = useTranslations("admin.dataTable.actions");

  const canReview = status === "DRAFT" || status === "REVIEW";
  const canPublish = status === "SCHOLARLY_REVIEW";
  const canArchive = status === "PUBLISHED";

  return (
    <div className="flex items-center gap-1">
      <IconButton aria-label={t("view")} variant="ghost" size="sm" onClick={onView}>
        <Eye className="size-4" aria-hidden="true" />
      </IconButton>
      <IconButton aria-label={t("edit")} title={t("editComingSoon")} variant="ghost" size="sm" onClick={onEdit}>
        <Pencil className="size-4" aria-hidden="true" />
      </IconButton>
      <IconButton
        aria-label={status === "DRAFT" ? t("submitForReview") : t("approveScholarly")}
        variant="ghost"
        size="sm"
        disabled={!canReview}
        onClick={onReview}
      >
        <ArrowUpDown className="size-4" aria-hidden="true" />
      </IconButton>
      <IconButton aria-label={t("publish")} variant="ghost" size="sm" disabled={!canPublish} onClick={onPublish}>
        <UploadCloud className="size-4" aria-hidden="true" />
      </IconButton>
      <IconButton aria-label={t("archive")} variant="ghost" size="sm" disabled={!canArchive} onClick={onArchive}>
        <Folder className="size-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
}
