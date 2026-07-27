import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { RoleBadge } from "@/components/admin/users/role-badge";
import { rolePermissions, type Role } from "@/config/permissions";
import { getUserCountByRole, roleDescriptions } from "@/lib/mock/admin-users";
import type { Locale } from "@/config/site";

/**
 * RoleCard — Phase 11, Module 5 §"Roles Management". "مستوى الصلاحيات"
 * = `rolePermissions[role].length` **محسوبًا حيًا**، لا رقمًا مكتوبًا —
 * يتغيَّر تلقائيًا إن تغيَّرت مصفوفة الصلاحيات في `config/permissions.ts`.
 *
 * RoleCard — Phase 11, Module 5, "Roles Management" section.
 * "Permission level" = `rolePermissions[role].length` **computed live**,
 * not a hardcoded number — changes automatically if the permission
 * matrix in `config/permissions.ts` changes.
 */
export async function RoleCard({ role, locale }: { role: Role; locale: Locale }) {
  const t = await getTranslations("admin.roles");
  const userCount = getUserCountByRole(role);
  const permissionCount = rolePermissions[role].length;

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <RoleBadge role={role} label={role} />
      </div>
      <p className="text-sm text-muted-foreground">{roleDescriptions[role][locale === "ar" ? "ar" : "en"]}</p>
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("usersCount", { count: userCount })}</span>
        <span className="font-medium text-foreground">{t("permissionsLevel", { count: permissionCount })}</span>
      </div>
      <Link href={`/admin/users?role=${role}`} className="text-sm font-medium text-primary hover:underline">
        {t("viewUsers")}
      </Link>
    </Card>
  );
}
