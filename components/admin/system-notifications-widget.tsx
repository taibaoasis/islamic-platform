import { getTranslations, getLocale } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info } from "@/components/icons";
import { systemNotifications } from "@/lib/mock/admin";
import type { Locale } from "@/config/site";

const severityConfig = {
  info: { icon: Info, className: "text-info" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  error: { icon: AlertCircle, className: "text-destructive" },
} as const;

export async function SystemNotificationsWidget() {
  const t = await getTranslations("admin.notifications");
  const locale = (await getLocale()) as Locale;
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" });

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{t("title")}</p>
      {systemNotifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="space-y-3">
          {systemNotifications.map((n) => {
            const { icon: Icon, className } = severityConfig[n.severity];
            return (
              <li key={n.id} className="flex items-start gap-2.5">
                <Icon className={`mt-0.5 size-4 shrink-0 ${className}`} aria-hidden="true" />
                <div>
                  <p className="text-sm text-foreground">{n.message}</p>
                  <time dateTime={n.timestamp} className="text-xs text-muted-foreground">
                    {dateFormatter.format(new Date(n.timestamp))}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
