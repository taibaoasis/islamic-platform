import "server-only";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { hasPermission, type Permission } from "@/config/permissions";

/**
 * طبقة الخدمات (Service Layer) للمصادقة والصلاحيات.
 * تُستخدم من داخل Server Components و Server Actions و Route Handlers
 * فقط — لا تستوردها في مكوّنات العميل (client components).
 *
 * Auth/permissions service layer.
 * For use inside Server Components, Server Actions, and Route Handlers
 * only — never import into client components.
 */

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireAuth();
  if (!hasPermission(user.role, permission)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
