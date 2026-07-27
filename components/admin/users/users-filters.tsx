"use client";

import { useTranslations } from "next-intl";

import { FilterCheckboxGroup } from "@/components/admin/data-table/filter-checkbox-group";
import { roles, type Role } from "@/config/permissions";
import type { UserStatus } from "@/lib/mock/admin-users";

const statuses: UserStatus[] = ["ACTIVE", "SUSPENDED", "PENDING", "LOCKED"];

export interface UsersFilterState {
  roles: Role[];
  statuses: UserStatus[];
}

/** UsersFilters — قائمة الأدوار مصدرها `roles` من config/permissions.ts مباشرة، لا مصفوفة محلية. UsersFilters — the role list is sourced directly from `roles` in config/permissions.ts, not a local array. */
export function UsersFilters({ value, onChange }: { value: UsersFilterState; onChange: (value: UsersFilterState) => void }) {
  const t = useTranslations("admin");

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius)] border border-border p-3">
      <FilterCheckboxGroup
        label={t("users.filters.role")}
        options={[...roles]}
        optionLabel={(role) => role}
        active={value.roles}
        onToggle={(role) => onChange({ ...value, roles: value.roles.includes(role) ? value.roles.filter((r) => r !== role) : [...value.roles, role] })}
      />
      <FilterCheckboxGroup
        label={t("users.filters.status")}
        options={statuses}
        optionLabel={(status) => t(`userStatus.${status}`)}
        active={value.statuses}
        onToggle={(status) => onChange({ ...value, statuses: value.statuses.includes(status) ? value.statuses.filter((s) => s !== status) : [...value.statuses, status] })}
      />
    </div>
  );
}
