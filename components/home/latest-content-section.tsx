import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Link } from "@/i18n/navigation";
import { latestContent } from "@/lib/mock/home-page";

/**
 * ملاحظة تصميم: لا يُستخدَم Table هنا عمدًا — هذا محتوى استهلاكي عام
 * للزوار، وDesign System §12 يمنع Table لهذا الغرض صراحة (يضر بالقراءة
 * وإتاحة الوصول على الهاتف)، ويوصي بقائمة/بطاقات بدلاً منه.
 *
 * Design note: Table is deliberately not used here — this is general
 * consumer-facing content, and Design System §12 explicitly bans Table
 * for this purpose (hurts readability and mobile accessibility),
 * recommending a list/cards instead.
 */
export async function LatestContentSection() {
  const t = await getTranslations("home.latest");

  return (
    <Section>
      <Container narrow>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <Link href="/latest" className="text-sm font-medium text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        <Card>
          <ul>
            {latestContent.map((item, index) => (
              <li key={item.id}>
                {index > 0 && <Divider />}
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="flex items-center gap-3">
                    <Badge variant="neutral">{item.type}</Badge>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </span>
                  <time dateTime={item.addedAt} className="shrink-0 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("ar", { day: "numeric", month: "short" }).format(new Date(item.addedAt))}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </Container>
    </Section>
  );
}
