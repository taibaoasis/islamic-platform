import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { buttonVariants } from "@/components/ui/button-variants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * الأزرار تشير إلى مسارات تسجيل مستقبلية (/register، /sign-in) لم
 * تُبنَ بعد — روابط عادية بلا أي منطق مصادقة فعلي، تمامًا كما طُلب
 * ("ممنوع Authentication").
 *
 * Buttons point to future auth routes (/register, /sign-in) not yet
 * built — plain links with no real authentication logic, exactly as
 * requested ("Authentication is forbidden").
 */
export async function CTASection() {
  const t = await getTranslations("home.cta");

  return (
    <Section>
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h2>
          <p className="text-sm text-muted-foreground sm:text-base">{t("description")}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              {t("button")}
            </Link>
            <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}>
              {t("secondaryButton")}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
