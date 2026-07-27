"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "@/lib/mock/admin-users";

const variantByStatus = { ACTIVE: "success", SUSPENDED: "error", PENDING: "warning", LOCKED: "neutral" } as const;

/**
 * UserStatusBadge — مكوّن عام جديد (Phase 11, Module 5 §"User Status").
 * **لم يُعَد استخدام `StatusBadge`** (النمط A لدورة حياة المحتوى) عمدًا
 * — حالة حساب المستخدم (نشط/موقوف/قيد الانتظار/مقفَل) مجال مختلف
 * جوهريًا عن سير عمل نشر المحتوى؛ فرض نفس المكوّن كان سيكون خطأً
 * معماريًا، بنفس المنطق المُقرَّر بشأن حالة الوسائط في Module 4.
 *
 * UserStatusBadge — a new generic component (Phase 11, Module 5, "User
 * Status" section). **`StatusBadge`** (the content-lifecycle Pattern A)
 * **was deliberately not reused** — a user account's status
 * (active/suspended/pending/locked) is a fundamentally different domain
 * from content publishing workflow; forcing the same component would
 * have been architecturally wrong, by the same reasoning decided for
 * media status in Module 4.
 */
export function UserStatusBadge({ status }: { status: UserStatus }) {
  const t = useTranslations("admin.userStatus");
  return <Badge variant={variantByStatus[status]}>{t(status)}</Badge>;
}
