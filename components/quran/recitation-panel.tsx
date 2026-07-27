"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play } from "@/components/icons";

const mockReciters = ["الشيخ عبد الباسط عبد الصمد", "الشيخ محمود خليل الحصري", "الشيخ مشاري راشد العفاسي"];

/**
 * RecitationPanel — "مكان مخصص للتلاوات" (Phase 9.3، القسم 5). واجهة
 * فقط — قائمة قرّاء Mock واختيار حر، وزر تشغيل معطَّل عمدًا (لا ملفات
 * صوتية حقيقية بعد).
 *
 * RecitationPanel — "a place designated for recitations" (Phase 9.3,
 * section 5). UI only — a mock reciter list with free selection, and a
 * deliberately disabled play button (no real audio files yet).
 */
export function RecitationPanel() {
  const t = useTranslations("quran.details");

  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{t("recitationTitle")}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{t("recitationPlaceholder")}</p>
      </div>
      <div className="flex items-center gap-2">
        <Select defaultValue={mockReciters[0]}>
          <SelectTrigger className="w-56" aria-label={t("selectReciter")}>
            <SelectValue placeholder={t("selectReciter")} />
          </SelectTrigger>
          <SelectContent>
            {mockReciters.map((reciter) => (
              <SelectItem key={reciter} value={reciter}>
                {reciter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="md" disabled title={t("recitationPlaceholder")}>
          <Play className="size-4" aria-hidden="true" />
          {t("playRecitation")}
        </Button>
      </div>
    </Card>
  );
}
