import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "@/components/icons";

/**
 * تعريفي بحت — بلا أي استدعاء فعلي لمساعد ذكاء اصطناعي (لا Backend،
 * كما طُلب صراحة). الزر أدناه بلا onClick فعلي (تعطيل واعٍ) لتفادي وهم
 * وظيفة غير موجودة بعد.
 *
 * Purely introductory — no actual AI assistant invocation (no backend,
 * as explicitly requested). The button below has no real onClick
 * (deliberately disabled) to avoid the illusion of a feature that
 * doesn't exist yet.
 */
export async function AIAssistantSection() {
  const t = await getTranslations("home.ai");

  return (
    <Section>
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/10 p-8 text-center sm:p-12">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Sparkles className="size-7" aria-hidden="true" />
          </span>
          <Badge variant="info">{t("badge")}</Badge>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{t("description")}</p>
          <Button disabled title={t("badge")}>
            {t("cta")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
