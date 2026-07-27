import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Award } from "@/components/icons";

/** CertificatesWidget — Placeholder صريح، لا إصدار شهادات حقيقي. Explicit placeholder, no real certificate issuance. */
export async function CertificatesWidget() {
  const t = await getTranslations("academy.dashboard.certificates");

  return (
    <Card className="flex flex-col items-center gap-2 p-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Award className="size-6" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{t("title")}</p>
      <p className="text-sm text-muted-foreground">{t("placeholder")}</p>
    </Card>
  );
}
