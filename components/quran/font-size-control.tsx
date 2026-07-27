"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { VerseFontSize } from "@/components/quran/verse";

const steps: VerseFontSize[] = ["sm", "md", "lg"];

/** FontSizeControl — جزء من تجربة القراءة (Phase 9.3، القسم 7). Part of the reading experience (Phase 9.3, section 7). */
export function FontSizeControl({ value, onChange }: { value: VerseFontSize; onChange: (size: VerseFontSize) => void }) {
  const t = useTranslations("quran.details");
  const currentIndex = steps.indexOf(value);

  function step(delta: number) {
    const nextIndex = Math.min(steps.length - 1, Math.max(0, currentIndex + delta));
    const nextSize = steps[nextIndex];
    if (nextSize) onChange(nextSize);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{t("fontSize")}</span>
      <Button variant="outline" size="sm" className="px-2.5" disabled={currentIndex <= 0} onClick={() => step(-1)} aria-label="−">
        A−
      </Button>
      <Button variant="outline" size="sm" className="px-2.5" disabled={currentIndex >= steps.length - 1} onClick={() => step(1)} aria-label="+">
        A+
      </Button>
    </div>
  );
}
