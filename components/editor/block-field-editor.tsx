"use client";

import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MediaPickerButton } from "@/components/admin/media/media-picker";
import type { ContentBlock } from "@/lib/mock/content";

/**
 * BlockFieldEditor — Phase 11, Module 3. **محور الجنرالية الحقيقي في
 * هذا المحرر**: مُعامَل بنوع الكتلة (`block.type`) لا بنوع المحتوى —
 * تحرير فقرة داخل مقالة يستخدم نفس النموذج المصغَّر بالحرف الذي يحرِّر
 * فقرة داخل فتوى أو كتاب أو درس أو خبر. هذا بالضبط ما يجعل معيار نجاح
 * هذه الوحدة ("محرر واحد لكل الأنواع الخمسة") متحقِّقًا بنيويًا.
 *
 * BlockFieldEditor — Phase 11, Module 3. **The true axis of genericity
 * in this editor**: parameterized by block type (`block.type`), not
 * content kind — editing a paragraph inside an article uses the exact
 * same mini-form as editing a paragraph inside a fatwa, book, lesson,
 * or news item. This is precisely what makes this module's success
 * criterion ("one editor for all five kinds") structurally true.
 */
export function BlockFieldEditor({ block, onChange }: { block: ContentBlock; onChange: (block: ContentBlock) => void }) {
  const t = useTranslations("admin.editor.fields");

  switch (block.type) {
    case "paragraph":
      return <Textarea aria-label={t("text")} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} rows={3} />;

    case "heading":
      return (
        <div className="flex gap-2">
          <Select value={String(block.level)} onValueChange={(v) => onChange({ ...block, level: Number(v) as 2 | 3 })}>
            <SelectTrigger className="w-24" aria-label={t("level")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
            </SelectContent>
          </Select>
          <Input aria-label={t("text")} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} className="flex-1" />
        </div>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <Textarea aria-label={t("text")} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} rows={2} />
          <Input aria-label={t("attribution")} placeholder={t("attribution")} value={block.attribution ?? ""} onChange={(e) => onChange({ ...block, attribution: e.target.value })} />
        </div>
      );

    case "citation":
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          <Select value={block.sourceType} onValueChange={(v) => onChange({ ...block, sourceType: v as typeof block.sourceType })}>
            <SelectTrigger aria-label={t("sourceType")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quran">Quran</SelectItem>
              <SelectItem value="hadith">Hadith</SelectItem>
              <SelectItem value="fatwa">Fatwa</SelectItem>
            </SelectContent>
          </Select>
          <Input aria-label={t("label")} placeholder={t("label")} value={block.label} onChange={(e) => onChange({ ...block, label: e.target.value })} />
          <Input aria-label={t("href")} dir="ltr" placeholder={t("href")} value={block.href} onChange={(e) => onChange({ ...block, href: e.target.value })} />
        </div>
      );

    case "quranVerse":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <Input aria-label={t("reference")} placeholder={t("reference")} value={block.reference} onChange={(e) => onChange({ ...block, reference: e.target.value })} />
          <Input aria-label={t("href")} dir="ltr" placeholder={t("href")} value={block.href} onChange={(e) => onChange({ ...block, href: e.target.value })} />
        </div>
      );

    case "hadith":
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          <Input aria-label={t("reference")} placeholder={t("reference")} value={block.reference} onChange={(e) => onChange({ ...block, reference: e.target.value })} />
          <Select value={block.grade ?? "SAHIH"} onValueChange={(v) => onChange({ ...block, grade: v as typeof block.grade })}>
            <SelectTrigger aria-label={t("grade")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SAHIH">SAHIH</SelectItem>
              <SelectItem value="HASAN">HASAN</SelectItem>
              <SelectItem value="DAIF">DAIF</SelectItem>
            </SelectContent>
          </Select>
          <Input aria-label={t("href")} dir="ltr" placeholder={t("href")} value={block.href} onChange={(e) => onChange({ ...block, href: e.target.value })} />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <MediaPickerButton filterType="image" onSelect={(asset) => onChange({ ...block, altText: block.altText || asset.name, caption: asset.caption ?? block.caption })} />
          <Input aria-label={t("altText")} placeholder={t("altText")} value={block.altText} onChange={(e) => onChange({ ...block, altText: e.target.value })} />
          <Input aria-label={t("caption")} placeholder={t("caption")} value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} />
        </div>
      );

    case "video":
      return (
        <div className="space-y-2">
          <MediaPickerButton filterType="video" onSelect={(asset) => onChange({ ...block, title: block.title || asset.name })} />
          <Input aria-label={t("title")} placeholder={t("title")} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
          <Input aria-label={t("caption")} placeholder={t("caption")} value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} />
        </div>
      );

    case "audio":
      return (
        <div className="space-y-2">
          <MediaPickerButton filterType="audio" onSelect={(asset) => onChange({ ...block, title: block.title || asset.name })} />
          <Input aria-label={t("title")} placeholder={t("title")} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
          <Input aria-label={t("caption")} placeholder={t("caption")} value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} />
        </div>
      );

    case "table":
      return (
        <div className="space-y-2">
          <div>
            <Label>{t("headers")}</Label>
            <Input
              className="mt-1"
              value={block.headers.join(", ")}
              onChange={(e) => onChange({ ...block, headers: e.target.value.split(",").map((s) => s.trim()) })}
            />
          </div>
          <div>
            <Label>{t("rows")}</Label>
            <Textarea
              className="mt-1"
              rows={3}
              value={block.rows.map((r) => r.join(", ")).join("\n")}
              onChange={(e) => onChange({ ...block, rows: e.target.value.split("\n").map((line) => line.split(",").map((s) => s.trim())) })}
            />
          </div>
        </div>
      );

    case "list":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch checked={block.ordered} onCheckedChange={(v) => onChange({ ...block, ordered: v })} id="list-ordered" />
            <Label htmlFor="list-ordered" className="font-normal">
              {t("ordered")}
            </Label>
          </div>
          <Textarea
            aria-label={t("items")}
            rows={3}
            value={block.items.join("\n")}
            onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })}
          />
        </div>
      );

    case "divider":
      return <hr className="border-border" />;

    case "callout":
      return (
        <div className="space-y-2">
          <Select value={block.variant} onValueChange={(v) => onChange({ ...block, variant: v as typeof block.variant })}>
            <SelectTrigger className="w-40" aria-label={t("variant")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
          <Textarea aria-label={t("text")} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} rows={2} />
        </div>
      );

    default:
      return null;
  }
}
