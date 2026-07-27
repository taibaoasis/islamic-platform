import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Link } from "@/i18n/navigation";
import { learningPaths } from "@/lib/mock/home-page";
import { GraduationCap } from "@/components/icons";
import { cn } from "@/lib/utils";

const levelVariant = { "مبتدئ": "success", "متوسط": "warning", "متقدم": "info" } as const;

export async function LearningSection() {
  const t = await getTranslations("home.learning");

  return (
    <Section>
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <Card key={path.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <GraduationCap className="size-5" aria-hidden="true" />
                  </span>
                  <Badge variant={levelVariant[path.level]}>{path.level}</Badge>
                </div>
                <CardTitle className="text-base">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {t("lessonsCount", { count: path.lessonsCount })}
              </CardContent>
              <CardFooter>
                <Link href={path.href} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}>
                  {t("viewPath")}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
