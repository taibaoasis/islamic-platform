import type { ReactNode } from "react";

import { SearchX } from "@/components/icons";

/**
 * EmptyState — عام لأي قائمة محتوى فارغة (مقالات، فتاوى، كتب...). لا
 * يحمل أي حالة أو منطق تفاعلي بنفسه — أي فعل (مثل "مسح البحث") يُمرَّر
 * جاهزًا عبر `action` من المكوّن الأب (العميل)، فيبقى هذا المكوّن Server
 * Component خالصًا وعامًا تمامًا.
 *
 * EmptyState — generic for any empty content list (articles, fatwas,
 * books...). Carries no state or interactive logic itself — any action
 * (like "clear search") is passed in pre-built via `action` from the
 * (client) parent, keeping this component a pure, fully generic Server
 * Component.
 */
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
