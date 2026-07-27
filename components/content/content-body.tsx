import { Link } from "@/i18n/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ScrollText, MessageCircleQuestion, ImageIcon, Video, Headphones } from "@/components/icons";
import type { ContentBlock } from "@/lib/mock/content";

const citationIconByType = { quran: BookOpen, hadith: ScrollText, fatwa: MessageCircleQuestion } as const;
const gradeVariant = { SAHIH: "success", HASAN: "info", DAIF: "warning" } as const;

/**
 * ContentBody — يعرض مصفوفة `ContentBlock` العامة (13 نوعًا بعد امتداد
 * Phase 11 Module 3). **نفس بنية الكتل** تُستخدَم لمقالة أو فتوى أو
 * كتاب أو درس أو خبر — لا قالب منفصل لكل نوع محتوى. هذا هو المكوّن
 * الذي يُصيِّر وضع Preview في محرر المحتوى المؤسسي **حرفيًا نفسه** بلا
 * أي نسخة موازية — تحقيقًا لمتطلب "نفس مكونات Content Engine".
 *
 * ContentBody — renders the generic `ContentBlock` array (13 types
 * after the Phase 11 Module 3 extension). **The same block structure**
 * is used for an article, fatwa, book, lesson, or news item — no
 * separate template per content kind. This is the exact component that
 * renders Preview mode in the Enterprise Content Editor — **literally
 * the same component**, no parallel copy — fulfilling the "same
 * Content Engine components" requirement.
 */
export function ContentBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="max-w-none space-y-4 text-base leading-relaxed text-foreground">
      {blocks.map((block, index) => (
        <BlockRenderer key={"id" in block ? block.id : index} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag id={block.id} className={block.level === 2 ? "pt-4 text-xl font-bold text-foreground scroll-mt-24" : "pt-2 text-lg font-semibold text-foreground scroll-mt-24"}>
          {block.text}
        </Tag>
      );
    }
    case "paragraph":
      return <p className="text-muted-foreground">{block.text}</p>;

    case "quote":
      return (
        <blockquote className="border-s-4 border-primary bg-secondary/40 px-4 py-3 italic text-foreground/90">
          <p>{block.text}</p>
          {block.attribution && <cite className="mt-1 block text-sm not-italic text-muted-foreground">— {block.attribution}</cite>}
        </blockquote>
      );

    case "citation": {
      const Icon = citationIconByType[block.sourceType];
      return (
        <Link href={block.href} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/80 hover:bg-secondary">
          <Icon className="size-3.5" aria-hidden="true" />
          {block.label}
        </Link>
      );
    }

    case "quranVerse":
      return (
        <Link href={block.href} className="block rounded-[var(--radius)] border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10">
          <p dir="rtl" lang="ar" className="font-arabic text-lg leading-loose text-foreground">
            ﴿ نص الآية — سيُعرَض هنا عند الاستيراد المعتمَد ﴾
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{block.reference}</p>
        </Link>
      );

    case "hadith":
      return (
        <Link href={block.href} className="block rounded-[var(--radius)] border border-border bg-secondary/30 p-4 hover:bg-secondary/50">
          <p dir="rtl" lang="ar" className="font-arabic text-base leading-loose text-foreground">
            [ متن الحديث — سيُعرَض هنا عند الاستيراد المعتمَد ]
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{block.reference}</span>
            {block.grade && <Badge variant={gradeVariant[block.grade]}>{block.grade}</Badge>}
          </div>
        </Link>
      );

    case "image":
      return (
        <figure aria-label={block.altText} className="flex flex-col items-center gap-2 rounded-[var(--radius)] bg-gradient-to-br from-primary/10 to-accent/10 p-10">
          <ImageIcon className="size-8 text-foreground/40" aria-hidden="true" />
          {block.caption && <figcaption className="text-sm text-muted-foreground">{block.caption}</figcaption>}
        </figure>
      );

    case "video":
      return (
        <figure className="flex flex-col items-center gap-2 rounded-[var(--radius)] bg-gradient-to-br from-primary/10 to-accent/10 p-10">
          <Video className="size-8 text-foreground/40" aria-hidden="true" />
          <figcaption className="text-sm text-muted-foreground">{block.caption ?? block.title}</figcaption>
        </figure>
      );

    case "audio":
      return (
        <figure className="flex flex-col items-center gap-2 rounded-[var(--radius)] bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <Headphones className="size-6 text-foreground/40" aria-hidden="true" />
          <figcaption className="text-sm text-muted-foreground">{block.caption ?? block.title}</figcaption>
        </figure>
      );

    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                {block.headers.map((h) => (
                  <th key={h} scope="col" className="p-2 text-start font-semibold text-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className={block.ordered ? "list-inside list-decimal space-y-1 text-muted-foreground" : "list-inside list-disc space-y-1 text-muted-foreground"}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ListTag>
      );
    }

    case "divider":
      return <hr className="border-border" />;

    case "callout":
      return <Alert variant={block.variant}>{block.text}</Alert>;

    default:
      return null;
  }
}
