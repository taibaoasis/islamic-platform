import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { platformStats } from "@/lib/mock/home-page";
import { Library, Newspaper, GraduationCap, Languages } from "@/components/icons";

const iconMap = { books: Library, articles: Newspaper, lessons: GraduationCap, languages: Languages } as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("ar").format(value);
}

export async function StatsSection() {
  const t = await getTranslations("home.stats");

  return (
    <Section className="border-y border-border bg-primary text-primary-foreground">
      <Container>
        <h2 className="mb-8 text-center text-2xl font-bold">{t("title")}</h2>
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {platformStats.map((stat) => {
            const Icon = iconMap[stat.key];
            return (
              <div key={stat.key} className="flex flex-col items-center gap-2 text-center">
                <Icon className="size-6 opacity-80" aria-hidden="true" />
                <dt className="order-2 text-sm opacity-80">{t(stat.key)}</dt>
                <dd className="order-1 text-3xl font-bold tabular-nums">{formatNumber(stat.value)}+</dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </Section>
  );
}
