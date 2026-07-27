import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TranslationEditorView } from "@/components/admin/localization/translation-editor-view";
import { getQueueItemById } from "@/lib/mock/localization";
import { mockQuranContentRows } from "@/lib/mock/admin-quran";
import { mockHadithContentRows } from "@/lib/mock/admin-hadith";
import { mockAdminContentRows } from "@/lib/mock/admin-content";
import { siteConfig, type Locale } from "@/config/site";

export function generateStaticParams() {
  const allIds = [...mockQuranContentRows.map((r) => r.id), ...mockHadithContentRows.map((r) => r.id), ...mockAdminContentRows.map((r) => r.id)];
  return allIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getQueueItemById(id);
  if (!item) return {};
  return { title: `${item.title} — ${siteConfig.name}` };
}

export default async function TranslationEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getQueueItemById(id);
  if (!item) notFound();

  return <TranslationEditorView item={item} />;
}
