"use client";

import { useTranslations } from "next-intl";

import { Link2 } from "@/components/icons";

/**
 * NarratorChain — "سلسلة الإسناد كعرض بصري تسلسلي" (مطابق حرفيًا لقالب
 * صفحة الحديث في ENTERPRISE_DESIGN_SYSTEM.md §11.4).
 * NarratorChain — "chain of narration as a sequential visual display"
 * (matches the Hadith page template in ENTERPRISE_DESIGN_SYSTEM.md
 * §11.4 verbatim).
 */
export function NarratorChain({ narrators }: { narrators: string[] }) {
  const t = useTranslations("hadith.card");

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-foreground">{t("chainTitle")}</p>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-muted-foreground">
        {narrators.map((narrator, index) => (
          <li key={narrator} className="flex items-center gap-1">
            <span className="rounded-full border border-border bg-background px-2.5 py-1">{narrator}</span>
            {index < narrators.length - 1 && <Link2 className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </div>
  );
}
