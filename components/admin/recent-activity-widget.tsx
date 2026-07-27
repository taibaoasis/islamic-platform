import { getTranslations, getLocale } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { recentActivity } from "@/lib/mock/admin";
import type { Locale } from "@/config/site";

export async function RecentActivityWidget() {
  const t = await getTranslations("admin.activity");
  const locale = (await getLocale()) as Locale;
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" });

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{t("title")}</p>
        <Link href="/admin/activity-log" className="text-xs font-medium text-primary hover:underline">
          {t("viewAll")}
        </Link>
      </div>
      {recentActivity.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="space-y-3">
          {recentActivity.slice(0, 5).map((entry) => (
            <li key={entry.id} className="flex items-start gap-2.5">
              <Avatar className="size-7 shrink-0">
                <AvatarFallback className="text-[10px]">{entry.actorInitials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{entry.actorName}</span> {t(`actions.${entry.action}`)}{" "}
                  <span className="font-medium">{entry.targetTitle}</span>
                </p>
                <time dateTime={entry.timestamp} className="text-xs text-muted-foreground">
                  {dateFormatter.format(new Date(entry.timestamp))}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
