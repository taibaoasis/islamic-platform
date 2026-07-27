/**
 * نظام صلاحيات المستخدمين — الأدوار (Roles) والصلاحيات (Permissions).
 * هذا هو المرجع الوحيد للأدوار في المشروع؛ يُستخدم في Prisma schema،
 * NextAuth callbacks، وأي تحقق من الصلاحيات في الـ Server Actions / API.
 *
 * User permissions system — Roles and Permissions.
 * Single source of truth for roles across the project; consumed by the
 * Prisma schema, NextAuth callbacks, and any authorization check in
 * Server Actions / Route Handlers.
 *
 * الأدوار مشتقة من فئات الجمهور المستهدف في وثيقة المشروع ووثيقة IA.
 * Roles are derived from the target-audience segments in the project
 * and IA documents.
 */

export const roles = [
  "VISITOR", // زائر غير مسجّل — قراءة عامة فقط
  "MEMBER", // مستخدم مسجّل عادي (مسلم جديد، مهتم، مستخدم يومي)
  "STUDENT", // طالب مسجَّل في مسارات تعليمية
  "TEACHER", // معلّم / داعية يُنشئ محتوى تعليميًا
  "SCHOLAR_REVIEWER", // مراجع شرعي — يعتمد المحتوى قبل النشر
  "COMMUNITY_MODERATOR", // مشرف مجتمع — يدير المنتديات والفعاليات
  "ADMIN", // مدير المنصة — صلاحيات كاملة
] as const;

export type Role = (typeof roles)[number];

export const defaultRole: Role = "MEMBER";

export const permissions = [
  "content:read",
  "content:create",
  "content:edit",
  "content:publish", // اعتماد المحتوى شرعيًا قبل النشر
  "content:delete",
  "course:enroll",
  "course:create",
  "community:post",
  "community:moderate",
  "user:manage",
  "settings:manage",
] as const;

export type Permission = (typeof permissions)[number];

// مصفوفة الأدوار ↔ الصلاحيات. أضف/عدّل هنا فقط — لا تُكرّر هذا المنطق
// في مكان آخر من الكود.
// Role ↔ Permission matrix. Add/edit here only — never duplicate this
// logic elsewhere in the codebase.
export const rolePermissions: Record<Role, Permission[]> = {
  VISITOR: ["content:read"],
  MEMBER: ["content:read", "community:post", "course:enroll"],
  STUDENT: ["content:read", "community:post", "course:enroll"],
  TEACHER: ["content:read", "content:create", "content:edit", "course:create", "community:post"],
  SCHOLAR_REVIEWER: ["content:read", "content:edit", "content:publish", "community:post"],
  COMMUNITY_MODERATOR: ["content:read", "community:post", "community:moderate"],
  ADMIN: [...permissions],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
