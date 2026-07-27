"use client";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { HadithGrade } from "@/lib/mock/hadith";

const grades: HadithGrade[] = ["SAHIH", "HASAN", "DAIF"];

export function HadithGradeFilter({ active, onChange }: { active: HadithGrade[]; onChange: (grades: HadithGrade[]) => void }) {
  const t = useTranslations("hadith.grade");

  function toggle(grade: HadithGrade) {
    onChange(active.includes(grade) ? active.filter((g) => g !== grade) : [...active, grade]);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-medium text-foreground">{t("title")}:</span>
      {grades.map((grade) => (
        <div key={grade} className="flex items-center gap-2">
          <Checkbox id={`grade-${grade}`} checked={active.includes(grade)} onCheckedChange={() => toggle(grade)} />
          <Label htmlFor={`grade-${grade}`} className="cursor-pointer font-normal">
            {t(grade)}
          </Label>
        </div>
      ))}
      {active.length > 0 && (
        <Button variant="ghost" size="sm" onClick={() => onChange([])}>
          {t("clearAll")}
        </Button>
      )}
    </div>
  );
}
