"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { StatusBadge } from "@/components/admin/status-badge";
import { useToast } from "@/hooks/use-toast";
import { supportedLanguages, type TranslationQueueItem } from "@/lib/mock/localization";

/**
 * TranslationEditorView — Phase 11, Module 6 §"Translation Editor".
 * **واجهة فقط، بلا حفظ حقيقي** — حقل الترجمة حالة محلية بحتة، وزر
 * "حفظ" يعرض Toast فقط. النص الأصلي **مُعاد استخدامه من المصدر
 * الحقيقي** (`item.originalText`، مبني في `lib/mock/localization.ts`
 * من `lib/mock/quran.ts`/`lib/mock/hadith.ts`/`lib/mock/content.ts`) —
 * لا نص جديد يُختلَق هنا.
 *
 * TranslationEditorView — Phase 11, Module 6, "Translation Editor"
 * section. **UI only, no real save** — the translation field is purely
 * local state, and the "Save" button only shows a toast. The original
 * text is **reused from the real source** (`item.originalText`, built
 * in `lib/mock/localization.ts` from `lib/mock/quran.ts`/
 * `lib/mock/hadith.ts`/`lib/mock/content.ts`) — no new text is invented
 * here.
 */
export function TranslationEditorView({ item }: { item: TranslationQueueItem }) {
  const t = useTranslations("admin.localization.editor");
  const tQueue = useTranslations("admin.localization.queue");
  const { toast } = useToast();
  const [translation, setTranslation] = useState("");

  const targetLanguage = supportedLanguages.find((l) => l.isoCode === item.targetLanguage);

  return (
    <div>
      <Breadcrumb items={[{ label: tQueue("title"), href: "/admin/localization/queue" }, { label: item.title }]} className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <h1 className="mb-4 text-xl font-bold text-foreground">{item.title}</h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>
                {t("originalText")} <span dir="ltr" className="text-xs uppercase text-muted-foreground">({item.sourceLanguage})</span>
              </Label>
              <Card className="mt-1.5 min-h-40 p-3 text-sm text-foreground" dir="rtl">
                {item.originalText}
              </Card>
            </div>
            <div>
              <Label htmlFor="translation-field">
                {t("translationText")} <span dir="ltr" className="text-xs uppercase text-muted-foreground">({item.targetLanguage})</span>
              </Label>
              <Textarea
                id="translation-field"
                dir={targetLanguage?.direction === "RTL" ? "rtl" : "ltr"}
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder={t("translationPlaceholder")}
                className="mt-1.5 min-h-40"
              />
            </div>
          </div>

          <Button className="mt-4" onClick={() => toast({ description: t("saveNotice") })}>
            {t("saveDraft")}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("languageInfo")}</p>
            {targetLanguage && (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{tQueue("columns.targetLanguage")}</dt>
                  <dd className="text-foreground">{targetLanguage.nameLocalized.ar}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("code")}</dt>
                  <dd dir="ltr" className="uppercase text-foreground">
                    {targetLanguage.isoCode}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("direction")}</dt>
                  <dd dir="ltr" className="text-foreground">
                    {targetLanguage.direction}
                  </dd>
                </div>
              </dl>
            )}
          </Card>

          <Card className="p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("reviewStatus")}</p>
            <StatusBadge status={item.status} />
          </Card>
        </div>
      </div>
    </div>
  );
}
