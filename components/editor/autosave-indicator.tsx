"use client";

import { useTranslations } from "next-intl";

import { Loader2, Check, Circle } from "@/components/icons";
import { cn } from "@/lib/utils";

export type AutosaveState = "saving" | "saved" | "unsaved";

/**
 * AutosaveIndicator — مؤشر شكلي بحت (Phase 11, Module 3 §"Auto Save").
 * **بلا أي منطق حفظ حقيقي** — الحالة تُمرَّر من الأب فقط استجابة لتغيّر
 * محلي في حالة المحرر (React state)، لا مؤقّت شبكة ولا طلب فعلي.
 *
 * AutosaveIndicator — a purely cosmetic indicator (Phase 11, Module 3,
 * "Auto Save" section). **No real save logic whatsoever** — the state
 * is passed from the parent only in response to a local editor state
 * change (React state), not a network timer or real request.
 */
export function AutosaveIndicator({ state }: { state: AutosaveState }) {
  const t = useTranslations("admin.editor.autosave");

  const config = {
    saving: { icon: Loader2, label: t("saving"), className: "text-muted-foreground [&_svg]:animate-spin" },
    saved: { icon: Check, label: t("saved"), className: "text-success" },
    unsaved: { icon: Circle, label: t("unsaved"), className: "text-warning" },
  }[state];

  const Icon = config.icon;

  return (
    <span role="status" className={cn("inline-flex items-center gap-1.5 text-xs", config.className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
