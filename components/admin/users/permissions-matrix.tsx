import { getTranslations } from "next-intl/server";

import { Check } from "@/components/icons";
import { roles, permissions, hasPermission } from "@/config/permissions";

/**
 * PermissionsMatrix — Phase 11, Module 5 §"Permissions Matrix". **هذا
 * المكوّن هو إثبات معيار نجاح الوحدة كاملة**: الصفوف من `permissions`،
 * الأعمدة من `roles`، وكل خلية نتيجة استدعاء حقيقي لـ`hasPermission()` —
 * الثلاثة مستوردة من `config/permissions.ts` دون أي نسخ أو تحويل. لا
 * توجد مصفوفة Mock موازية في أي مكان لهذه الصفحة.
 *
 * PermissionsMatrix — Phase 11, Module 5, "Permissions Matrix" section.
 * **This component is the proof of the entire module's success
 * criterion**: rows from `permissions`, columns from `roles`, and every
 * cell is a real call to `hasPermission()` — all three imported from
 * `config/permissions.ts` with no copying or transformation. No
 * parallel Mock matrix exists anywhere for this page.
 */
export async function PermissionsMatrix() {
  const t = await getTranslations("admin.permissionsMatrix");

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-border">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            <th scope="col" className="sticky start-0 bg-secondary/40 p-3 text-start font-semibold text-foreground">
              {t("permissionColumn")}
            </th>
            {roles.map((role) => (
              <th key={role} scope="col" className="p-3 text-center font-semibold text-foreground">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission} className="border-b border-border last:border-none">
              <th scope="row" className="sticky start-0 bg-background p-3 text-start font-normal text-foreground">
                {permission}
              </th>
              {roles.map((role) => (
                <td key={role} className="p-3 text-center">
                  {hasPermission(role, permission) ? (
                    <>
                      <Check className="mx-auto size-4 text-success" aria-hidden="true" />
                      <span className="sr-only">{t("allowed")}</span>
                    </>
                  ) : (
                    <span aria-hidden="true" className="text-muted-foreground/30">
                      —
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
