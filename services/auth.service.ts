import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { authOptions } from "@/lib/auth";
import { hasPermission, permissions, type Permission, type Role } from "@/config/permissions";

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

/**
 * ============================================================
 * Phase 0.1 — Security Baseline (إضافة، لا تعديل على ما فوق)
 * ============================================================
 *
 * `requireAuth`/`requirePermission` أعلاه **يرميان استثناءً (throw)** —
 * مناسب تمامًا لسياق Server Action (يُلتقَط بمعالج الخطأ في نقطة
 * الاستدعاء)، لكن **غير مناسب داخل Layout/Page** حيث استثناء غير
 * مُلتقَط يُنتج صفحة خطأ عامة (500) بدل إعادة توجيه نظيفة لتسجيل
 * الدخول. الدالتان أدناه لسياق العرض (Layout/Page) تحديدًا — تُعيدان
 * التوجيه (`redirect`) بدل الرمي.
 *
 * `requireAuth`/`requirePermission` above **throw** — correct for a
 * Server Action context (caught at the call site), but **wrong inside
 * a Layout/Page**, where an uncaught exception produces a generic
 * error page (500) instead of a clean redirect to sign-in. The two
 * functions below are for the render context (Layout/Page)
 * specifically — they `redirect` instead of throwing.
 */

/** الصلاحيات التي تُعتبَر "وصول إداري أساسي" — أي دور يملك واحدة منها على الأقل يتجاوز البوابة الخارجية للوحة الإدارة. Permissions considered "baseline admin access" — any role holding at least one clears the admin panel's outer gate. */
const ADMIN_BASELINE_PERMISSIONS: Permission[] = [
  "content:create",
  "content:edit",
  "content:publish",
  "content:delete",
  "course:create",
  "community:moderate",
  "user:manage",
  "settings:manage",
];

function hasAnyPermission(role: Role, required: Permission[]): boolean {
  return required.some((permission) => hasPermission(role, permission));
}

/**
 * حارس المستوى الخارجي للوحة الإدارة (Layer A، البوابة العامة).
 * غير مصادَق عليه → توجيه لتدفّق تسجيل الدخول الفعلي (NextAuth).
 * مصادَق عليه بلا أي صلاحية إدارية → توجيه للصفحة الرئيسية العامة.
 *
 * The admin panel's outer-level guard (Layer A, the general gate).
 * Unauthenticated → redirect to the real sign-in flow (NextAuth).
 * Authenticated with zero admin-tier permissions → redirect to the
 * public home page.
 */
export async function requireAdminAccess() {
  const user = await getCurrentUser();

  if (!user) {
    // مسار NextAuth الافتراضي خارج بادئة اللغة تمامًا — next/navigation
    // العادي، لا نسخة next-intl. لا صفحة دخول مخصَّصة موجودة بعد (لا
    // مزوِّد مصادقة واحد مُهيَّأ في lib/auth.ts في هذه المرحلة أصلاً —
    // موثَّق صراحة في SECURITY_BASELINE.md، ليس خطأ في هذا الحارس.
    // NextAuth's default route lives entirely outside the locale
    // prefix — plain next/navigation, not the next-intl version. No
    // custom sign-in page exists yet (zero auth providers are
    // configured in lib/auth.ts at this phase at all — documented
    // explicitly in SECURITY_BASELINE.md, not a bug in this guard).
    redirect("/api/auth/signin");
  }

  if (!hasAnyPermission(user.role, ADMIN_BASELINE_PERMISSIONS)) {
    const locale = await getLocale();
    redirect(`/${locale}`);
  }

  return user;
}

/**
 * حارس أضيق لأقسام إدارية حسّاسة داخل اللوحة (مثل الإعدادات أو إدارة
 * المستخدمين) — يتحقق من البوابة العامة أولاً، ثم صلاحية محدَّدة.
 *
 * A narrower guard for sensitive admin sub-sections (like settings or
 * user management) — checks the general gate first, then a specific
 * permission.
 */
export async function requireAdminPermission(permission: Permission) {
  const user = await requireAdminAccess();
  if (!hasPermission(user.role, permission)) {
    const locale = await getLocale();
    redirect(`/${locale}/admin`);
  }
  return user;
}

// إعادة تصدير — يُستخدَم داخل مصفوفة التحقق والتوثيق دون تكرار قائمة الصلاحيات هنا.
// Re-exported for use in verification/docs without duplicating the permission list here.
export { ADMIN_BASELINE_PERMISSIONS, permissions };
