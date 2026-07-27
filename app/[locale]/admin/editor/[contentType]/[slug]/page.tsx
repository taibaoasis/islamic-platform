import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorShell } from "@/components/editor/editor-shell";
import { getKindFromUrlSegment } from "@/lib/mock/admin-content";
import { mockContentItems } from "@/lib/mock/content";
import { siteConfig, type Locale } from "@/config/site";

export function generateStaticParams() {
  return mockContentItems.map((item) => ({
    contentType: item.kind === "article" ? "articles" : item.kind === "fatwa" ? "fatwas" : item.kind === "book" ? "books" : item.kind === "lesson" ? "lessons" : "news",
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; contentType: string; slug: string }>;
}): Promise<Metadata> {
  const { contentType, slug } = await params;
  const kind = getKindFromUrlSegment(contentType);
  const item = mockContentItems.find((i) => i.kind === kind && i.slug === slug);
  if (!item) return {};
  return { title: `${item.title} — ${siteConfig.name}` };
}

/**
 * محرر المحتوى المؤسسي — Phase 11, Module 3. صفحة رفيعة (Server
 * Component) تحمِّل عنصر `ContentItem` واحدًا من `mockContentItems`
 * حسب النوع والمعرِّف النصي في الرابط، وتُمرِّره لـ`EditorShell` كحد
 * تفاعلي وحيد. **لا فرع شرطي على النوع هنا أيضًا** — البحث عن العنصر
 * بمطابقة `kind`+`slug` فقط.
 *
 * Enterprise Content Editor — Phase 11, Module 3. A thin Server
 * Component page that loads one `ContentItem` from `mockContentItems`
 * by kind and slug from the URL, passing it to `EditorShell` as the
 * single interactive boundary. **No conditional branching on kind
 * here either** — the item lookup is just a `kind`+`slug` match.
 */
export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ contentType: string; slug: string }>;
}) {
  const { contentType, slug } = await params;
  const kind = getKindFromUrlSegment(contentType);
  const item = kind ? mockContentItems.find((i) => i.kind === kind && i.slug === slug) : undefined;
  if (!item) notFound();

  return <EditorShell item={item} />;
}
