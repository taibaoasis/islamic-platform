"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EditableDraft } from "@/lib/mock/editor";

const languages = ["ar", "en", "ur", "fr", "id"];
const reviewStatuses: EditableDraft["reviewStatus"][] = ["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"];
const reviewVariant = { NOT_SUBMITTED: "neutral", PENDING: "warning", APPROVED: "success", REJECTED: "error" } as const;

/**
 * EditorSidebar — Phase 11, Module 3 §"Sidebar". لوحة جانبية عامة —
 * لا فرع شرطي على نوع المحتوى، تعمل لأي `EditableDraft` بصرف النظر عن
 * كونه مقالة أو فتوى أو كتابًا.
 *
 * EditorSidebar — Phase 11, Module 3, "Sidebar" section. A generic
 * panel — no conditional branching on content kind, works for any
 * `EditableDraft` regardless of whether it's an article, fatwa, or book.
 */
export function EditorSidebar({ draft, onChange }: { draft: EditableDraft; onChange: (patch: Partial<EditableDraft>) => void }) {
  const t = useTranslations("admin.editor.sidebar");
  const tReview = useTranslations("admin.editor.reviewStatus");

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">{t("propertiesTitle")}</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="prop-language">{t("languageSettings")}</Label>
            <Select value={draft.language} onValueChange={(v) => onChange({ language: v })}>
              <SelectTrigger id="prop-language" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="prop-publish-date">{t("publishDate")}</Label>
            <Input id="prop-publish-date" type="date" value={draft.publishDate.slice(0, 10)} onChange={(e) => onChange({ publishDate: e.target.value })} className="mt-1.5" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">{t("seoTitle")}</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="seo-title">{t("seoMetaTitle")}</Label>
            <Input id="seo-title" value={draft.seoMetaTitle} onChange={(e) => onChange({ seoMetaTitle: e.target.value })} className="mt-1.5" maxLength={60} />
          </div>
          <div>
            <Label htmlFor="seo-desc">{t("seoMetaDescription")}</Label>
            <Textarea id="seo-desc" value={draft.seoMetaDescription} onChange={(e) => onChange({ seoMetaDescription: e.target.value })} className="mt-1.5" rows={3} maxLength={160} />
          </div>
          <div>
            <Label htmlFor="seo-slug">{t("slug")}</Label>
            <Input id="seo-slug" dir="ltr" value={draft.slug} onChange={(e) => onChange({ slug: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="seo-canonical">{t("canonicalUrl")}</Label>
            <Input id="seo-canonical" dir="ltr" value={draft.canonicalUrl} onChange={(e) => onChange({ canonicalUrl: e.target.value })} className="mt-1.5" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">{t("ogTitle")}</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="og-title">{t("ogTitleField")}</Label>
            <Input id="og-title" value={draft.ogTitle} onChange={(e) => onChange({ ogTitle: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="og-desc">{t("ogDescription")}</Label>
            <Textarea id="og-desc" value={draft.ogDescription} onChange={(e) => onChange({ ogDescription: e.target.value })} className="mt-1.5" rows={3} />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">{t("reviewStatusTitle")}</p>
        <div className="flex flex-wrap gap-2">
          {reviewStatuses.map((rs) => (
            <button key={rs} type="button" onClick={() => onChange({ reviewStatus: rs })} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Badge variant={rs === draft.reviewStatus ? reviewVariant[rs] : "neutral"} className={rs === draft.reviewStatus ? "" : "opacity-50"}>
                {tReview(rs)}
              </Badge>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
