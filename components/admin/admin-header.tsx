import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowRight } from "@/components/icons";
import { systemNotifications } from "@/lib/mock/admin";

/**
 * AdminHeader — شريط علوي داخلي خاص بلوحة الإدارة (يختلف عن Header
 * العام للموقع — Design System §4.4: "شريط علوي مصغَّر خاص بلوحة
 * التحكم... لا قائمة تنقّل عامة"). Server Component خالص.
 *
 * AdminHeader — internal top bar specific to the admin shell (differs
 * from the site's public Header — Design System §4.4: "a compact admin
 * top bar... no general nav menu"). A pure Server Component.
 */
export async function AdminHeader() {
  const t = await getTranslations("admin.nav");
  const unreadCount = systemNotifications.length;

  return (
    <div className="flex h-14 items-center justify-between border-b border-border px-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        {t("backToSite")}
      </Link>
      <div className="relative">
        <IconButton aria-label={t("dashboard")} variant="ghost" size="sm">
          <Bell className="size-4" aria-hidden="true" />
        </IconButton>
        {unreadCount > 0 && (
          <Badge variant="error" className="absolute -end-1 -top-1 flex size-4 items-center justify-center p-0 text-[10px]">
            {unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
}
