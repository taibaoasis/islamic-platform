"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

export type ContentLifecycleStatus = "DRAFT" | "REVIEW" | "SCHOLARLY_REVIEW" | "PUBLISHED" | "ARCHIVED";

const variantByStatus = {
  DRAFT: "neutral",
  REVIEW: "warning",
  SCHOLARLY_REVIEW: "info",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
} as const;

/**
 * StatusBadge — عام لكل أنواع المحتوى لحالاته الخمس (النمط A من Content
 * Models §0.3). **لا يُعاد تعريفه لكل نوع محتوى لاحقًا** — نفس المكوّن
 * حرفيًا.
 *
 * قرار تقني: "use client" (لا Server Component رغم إمكان ذلك) — لأن
 * هذا المكوّن سيُستخدَم داخل جداول تفاعلية تُحدِّث حالة الصف محليًا عند
 * النقر (Publish/Archive...)، ومكوّن Server غير متزامن لا يمكن أن
 * يُعاد تصييره تفاعليًا استجابة لتغيّر Props داخل شجرة عميل — نفس القيد
 * المكتشَف والموثَّق في CONTENT_ENGINE_REPORT.md (Phase 9.5).
 *
 * Technical decision: "use client" (not a Server Component, despite
 * being possible) — because this component will be used inside
 * interactive tables that update row state locally on click
 * (Publish/Archive...), and an async Server Component cannot be
 * reactively re-rendered in response to prop changes inside a client
 * tree — the same constraint discovered and documented in
 * CONTENT_ENGINE_REPORT.md (Phase 9.5).
 */
export function StatusBadge({ status }: { status: ContentLifecycleStatus }) {
  const t = useTranslations("admin.status");
  return <Badge variant={variantByStatus[status]}>{t(status)}</Badge>;
}
