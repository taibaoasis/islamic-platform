import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { quickAccessItems } from "@/lib/mock/home-page";
import {
  BookOpen,
  ScrollText,
  BookOpenCheck,
  MessageCircleQuestion,
  Newspaper,
  GraduationCap,
  Library,
  Users,
} from "@/components/icons";

const iconMap = {
  quran: BookOpen,
  hadith: ScrollText,
  tafsir: BookOpenCheck,
  fatwa: MessageCircleQuestion,
  articles: Newspaper,
  courses: GraduationCap,
  books: Library,
  scholars: Users,
} as const;

export async function QuickAccessSection() {
  const t = await getTranslations("home.quickAccess");

  return (
    <Section>
      <Container>
        <h2 className="mb-6 text-2xl font-bold text-foreground">{t("title")}</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {quickAccessItems.map((item) => {
            const Icon = iconMap[item.iconName];
            return (
              <li key={item.key}>
                <Link href={item.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
                  <Card interactive className="flex flex-col items-center gap-3 p-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{t(item.key)}</span>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
