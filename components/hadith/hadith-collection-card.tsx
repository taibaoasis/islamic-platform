"use client";

import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { getMockCollectionDescription, type HadithCollectionMeta } from "@/lib/mock/hadith";
import { Library } from "@/components/icons";

export function HadithCollectionCard({ collection }: { collection: HadithCollectionMeta }) {
  const t = useTranslations("hadith");

  return (
    <Link href={`/hadith/${collection.slug}`} className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card interactive className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Library className="size-5" aria-hidden="true" />
          </span>
          <Badge variant="neutral">{t("hadithCountLabel", { count: collection.hadithCount })}</Badge>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">{collection.arabicName}</h2>
          <p className="text-sm text-muted-foreground">{collection.englishName}</p>
        </div>

        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{getMockCollectionDescription(collection)}</p>

        <p className="text-xs font-medium text-foreground/70">
          {t("collection.compiler")}: {collection.compiler}
        </p>
      </Card>
    </Link>
  );
}
