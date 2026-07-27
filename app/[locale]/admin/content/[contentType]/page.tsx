import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";

import { GenericContentTable } from "@/components/admin/generic-content-table";
import { getKindFromUrlSegment, contentKindUrlSegment } from "@/lib/mock/admin-content";
import { contentKindLabels } from "@/lib/mock/content";
import { siteConfig, type Locale } from "@/config/site";

export function generateStaticParams() {
  return Object.values(contentKindUrlSegment).map((segment) => ({ contentType: segment }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; contentType: string }>;
}): Promise<Metadata> {
  const { locale, contentType } = await params;
  const kind = getKindFromUrlSegment(contentType);
  if (!kind) return {};
  const t = await getTranslations({ locale, namespace: "admin.content" });
  return { title: `${t("titleFor", { kind: contentKindLabels[kind][locale === "ar" ? "ar" : "en"] })} — ${siteConfig.name}` };
}

/**
 * Module 2.3 — Generic Content Management. صفحة واحدة تخدم خمسة أنواع
 * محتوى (`generateStaticParams` يولِّد 5 مسارات سكونية منها). التحقق
 * من صحة `contentType` عبر `getKindFromUrlSegment` — قيمة غير معروفة
 * تُنتج `404` صحيحًا، لا شاشة فارغة صامتة.
 *
 * Module 2.3 — Generic Content Management. One page serves five content
 * kinds (`generateStaticParams` generates 5 static routes from it).
 * `contentType` validity is checked via `getKindFromUrlSegment` — an
 * unknown value correctly produces a `404`, not a silent blank screen.
 */
export default async function AdminContentTypePage({
  params,
}: {
  params: Promise<{ contentType: string }>;
}) {
  const { contentType } = await params;
  const kind = getKindFromUrlSegment(contentType);
  if (!kind) notFound();

  const t = await getTranslations("admin.content");
  const locale = (await getLocale()) as Locale;
  const kindLabel = contentKindLabels[kind][locale === "ar" ? "ar" : "en"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{t("titleFor", { kind: kindLabel })}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>

      <div className="mt-6">
        <GenericContentTable initialKind={kind} />
      </div>
    </div>
  );
}
