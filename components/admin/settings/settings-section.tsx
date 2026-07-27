import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

/** SettingsSection — تُستخدَم حرفيًا عبر السبعة أقسام كافةً، بلا أي نسخة بديلة لأي منها. Used verbatim across all seven sections, with no alternate copy for any of them. */
export function SettingsSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  );
}

/** SettingsField — صف حقل عام (تسمية + وصف اختياري + عنصر التحكم). Generic field row (label + optional description + control element). */
export function SettingsField({ label, description, htmlFor, children }: { label: string; description?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-start">
      <div>
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
