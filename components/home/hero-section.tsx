import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button-variants";
import { Link } from "@/i18n/navigation";
import { HeroSearch } from "@/components/home/hero-search";
import { BookOpen, ScrollText, ArrowLeft } from "@/components/icons";
import { cn } from "@/lib/utils";

export async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <div className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
      <Container className="flex flex-col items-center gap-8 py-16 text-center sm:py-24">
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{t("description")}</p>

        <HeroSearch placeholder={t("searchPlaceholder")} ariaLabel={t("searchLabel")} />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/courses" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
            {t("ctaLearn")}
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <Link href="/quran" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            <BookOpen className="size-4" aria-hidden="true" />
            {t("ctaQuran")}
          </Link>
          <Link href="/hadith" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            <ScrollText className="size-4" aria-hidden="true" />
            {t("ctaHadith")}
          </Link>
        </div>
      </Container>
    </div>
  );
}
