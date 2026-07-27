import { getTranslations, getLocale } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { RoleBadge } from "@/components/admin/users/role-badge";
import { UserStatusBadge } from "@/components/admin/users/user-status-badge";
import { getInheritedPermissions, getUserContent, roleDescriptions, type AdminUser } from "@/lib/mock/admin-users";
import { fullActivityLog } from "@/lib/mock/admin-users";
import type { Locale } from "@/config/site";

/**
 * UserProfileView — Phase 11, Module 5 §"User Profile". **"الصلاحيات
 * الموروثة" مُشتَقة حيًا** عبر `getInheritedPermissions(user.role)` (التي
 * تستدعي `rolePermissions` من `config/permissions.ts` مباشرة) — لا
 * قائمة مكتوبة يدويًا لكل مستخدم. أي تغيير في تلك المصفوفة ينعكس هنا
 * تلقائيًا دون لمس هذا الملف.
 *
 * UserProfileView — Phase 11, Module 5, "User Profile" section.
 * "Inherited Permissions" is **derived live** via
 * `getInheritedPermissions(user.role)` (which calls `rolePermissions`
 * from `config/permissions.ts` directly) — no hand-written list per
 * user. Any change to that matrix reflects here automatically without
 * touching this file.
 */
export async function UserProfileView({ user }: { user: AdminUser }) {
  const t = await getTranslations("admin");
  const locale = (await getLocale()) as Locale;
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "long" });

  const inheritedPermissions = getInheritedPermissions(user.role);
  const { authored, reviewed } = getUserContent(user);
  const userActivity = fullActivityLog.filter((entry) => entry.actorName === user.name).slice(0, 8);

  return (
    <div>
      <Breadcrumb items={[{ label: t("users.title"), href: "/admin/users" }, { label: user.name }]} className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <Avatar className="size-20">
            <AvatarFallback className="text-xl">{user.avatarInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold text-foreground">{user.name}</p>
            <p dir="ltr" className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RoleBadge role={user.role} label={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
          <p className="text-xs text-muted-foreground">{t("userProfile.memberSince", { date: dateFormatter.format(new Date(user.createdAt)) })}</p>
        </Card>

        <div className="space-y-6">
          <Card className="p-4">
            <p className="mb-2 text-sm font-semibold text-foreground">{t("userProfile.rolesTitle")}</p>
            <p className="text-sm text-muted-foreground">{roleDescriptions[user.role][locale === "ar" ? "ar" : "en"]}</p>
          </Card>

          <Card className="p-4">
            <p className="mb-1 text-sm font-semibold text-foreground">{t("userProfile.inheritedPermissions")}</p>
            <p className="mb-3 text-xs text-muted-foreground">{t("userProfile.inheritedNotice")}</p>
            <div className="flex flex-wrap gap-1.5">
              {inheritedPermissions.map((permission) => (
                <Badge key={permission} variant="neutral">
                  {permission}
                </Badge>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{t("userProfile.authoredTitle")}</p>
              {authored.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("userProfile.noContent")}</p>
              ) : (
                <ul className="space-y-1.5">
                  {authored.map((item) => (
                    <li key={item.id}>
                      <Link href={`/articles/${item.slug}`} className="text-sm text-primary hover:underline">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{t("userProfile.reviewedTitle")}</p>
              {reviewed.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("userProfile.noContent")}</p>
              ) : (
                <ul className="space-y-1.5">
                  {reviewed.map((item) => (
                    <li key={item.id}>
                      <Link href={`/articles/${item.slug}`} className="text-sm text-primary hover:underline">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card className="p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{t("userProfile.activityTitle")}</p>
            {userActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("activity.empty")}</p>
            ) : (
              <ul className="space-y-2">
                {userActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-none last:pb-0">
                    <span className="text-foreground">
                      {t(`activity.actions.${entry.action}`)} <span className="font-medium">{entry.targetTitle}</span>
                    </span>
                    <time dateTime={entry.timestamp} className="shrink-0 text-xs text-muted-foreground">
                      {dateFormatter.format(new Date(entry.timestamp))}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
