import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { featuredContent } from "@/lib/mock/home-page";
import { ArrowLeft } from "@/components/icons";

export async function FeaturedContentSection() {
  const t = await getTranslations("home.featured");

  return (
    <Section className="bg-secondary/30">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <Link href="/articles" className="shrink-0 text-sm font-medium text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredContent.map((item) => (
            <Card key={item.id} interactive>
              <div aria-hidden="true" className="h-32 rounded-t-lg bg-gradient-to-br from-primary/20 to-accent/20" />
              <CardHeader>
                <Badge variant="neutral" className="w-fit">{item.category}</Badge>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={item.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  {t("readMore")}
                  <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
