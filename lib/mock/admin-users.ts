import { roles, rolePermissions, type Role } from "@/config/permissions";
import { mockContentItems, type ContentItem } from "@/lib/mock/content";
import { recentActivity as dashboardRecentActivity, type ActivityLogEntry } from "@/lib/mock/admin";

/**
 * بيانات وهمية لإدارة المستخدمين والأدوار (Phase 11, Module 5) — لا
 * اتصال بقاعدة بيانات ولا API.
 *
 * **مبدأ حاكم لهذه المرحلة بأكملها:** `Role` وصلاحياته (`rolePermissions`)
 * **مستورَدان مباشرة من `config/permissions.ts`** — المصدر الوحيد
 * المعتمَد في المشروع منذ طبقة الأساس (يُستخدَم أيضًا في Prisma schema
 * وNextAuth). **لا تعريف مواز لأي دور أو صلاحية هنا** — هذا الملف يضيف
 * فقط بيانات Mock تشغيلية (مستخدمون، نشاط) تُشير إلى تلك الأدوار، ونصوصًا
 * وصفية للعرض (لا منطق صلاحيات).
 *
 * Mock data for user and role management (Phase 11, Module 5) — no
 * database or API connection.
 *
 * **The governing principle for this entire module:** `Role` and its
 * permissions (`rolePermissions`) are **imported directly from
 * `config/permissions.ts`** — the single approved source in the project
 * since the Foundation layer (also consumed by the Prisma schema and
 * NextAuth). **No parallel definition of any role or permission here**
 * — this file only adds operational mock data (users, activity)
 * referencing those roles, plus display-only descriptive text (no
 * permission logic).
 */

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING" | "LOCKED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatarInitials: string;
  lastLogin: string | null;
  createdAt: string;
}

/** نصوص وصفية للعرض فقط — لا تُعرِّف صلاحيات، فقط تشرح الدور بلغة بشرية. Display-only descriptive text — defines no permissions, just explains the role in human language. */
export const roleDescriptions: Record<Role, { ar: string; en: string }> = {
  VISITOR: { ar: "زائر غير مسجَّل — قراءة عامة فقط بلا حساب.", en: "An unregistered visitor — public reading only, no account." },
  MEMBER: { ar: "مستخدم مسجَّل عادي (مسلم جديد، مهتم، مستخدم يومي).", en: "A regular registered user (new Muslim, interested learner, daily user)." },
  STUDENT: { ar: "طالب مسجَّل في مسارات تعليمية على الأكاديمية.", en: "A student enrolled in Academy learning paths." },
  TEACHER: { ar: "معلّم أو داعية يُنشئ محتوى تعليميًا.", en: "A teacher or educator who creates educational content." },
  SCHOLAR_REVIEWER: { ar: "مراجع شرعي يعتمد المحتوى علميًا قبل نشره.", en: "A scholarly reviewer who approves content before publishing." },
  COMMUNITY_MODERATOR: { ar: "مشرف مجتمع يدير المنتديات والفعاليات.", en: "A community moderator managing forums and events." },
  ADMIN: { ar: "مدير المنصة — صلاحيات كاملة.", en: "Platform administrator — full permissions." },
};

const roleBadgeVariant: Record<Role, "neutral" | "info" | "success" | "warning" | "primary" | "error"> = {
  VISITOR: "neutral",
  MEMBER: "info",
  STUDENT: "info",
  TEACHER: "success",
  SCHOLAR_REVIEWER: "primary",
  COMMUNITY_MODERATOR: "warning",
  ADMIN: "error",
};

export function getRoleBadgeVariant(role: Role) {
  return roleBadgeVariant[role];
}

const firstNames = ["أحمد", "محمد", "فاطمة", "عائشة", "عمر", "خديجة", "يوسف", "مريم", "علي", "زينب", "إبراهيم", "سارة"];
const lastNames = ["المنصوري", "الفاروقي", "السلمي", "القرني", "الزهراني", "العتيبي", "الحربي", "الغامدي"];
const statusCycle: UserStatus[] = ["ACTIVE", "ACTIVE", "ACTIVE", "PENDING", "SUSPENDED", "LOCKED"];

function buildMockUsers(): AdminUser[] {
  const users: AdminUser[] = [];
  let counter = 0;
  for (const role of roles) {
    const usersPerRole = role === "MEMBER" ? 12 : role === "STUDENT" ? 8 : role === "ADMIN" ? 2 : 5;
    for (let i = 0; i < usersPerRole; i++) {
      const first = firstNames[counter % firstNames.length]!;
      const last = lastNames[counter % lastNames.length]!;
      const status = statusCycle[counter % statusCycle.length]!;
      users.push({
        id: `u-${role.toLowerCase()}-${i + 1}`,
        name: `${first} ${last}`,
        email: `${first}.${last}${counter}@example.com`.toLocaleLowerCase(),
        role,
        status,
        avatarInitials: `${first[0]}${last[0]}`,
        lastLogin: status === "PENDING" ? null : new Date(2026, 6, 1 + (counter % 25), 8 + (counter % 12)).toISOString(),
        createdAt: new Date(2025, counter % 12, 1 + (counter % 27)).toISOString(),
      });
      counter++;
    }
  }
  return users;
}

export const mockAdminUsers: AdminUser[] = buildMockUsers();

export function getUserById(id: string): AdminUser | undefined {
  return mockAdminUsers.find((u) => u.id === id);
}

export function getUserCountByRole(role: Role): number {
  return mockAdminUsers.filter((u) => u.role === role).length;
}

/** الصلاحيات الموروثة — مُشتَقة مباشرة من rolePermissions، لا تُخزَّن على المستخدم أبدًا. Inherited permissions — derived directly from rolePermissions, never stored on the user. */
export function getInheritedPermissions(role: Role) {
  return rolePermissions[role];
}

/** محتوى أُنشئ/رُوجِع — استنتاج Mock حتمي (لا عشوائي) من محرك المحتوى العام (Phase 9.5)، لا بيانات مستقلة موازية. Content authored/reviewed — a deterministic (not random) Mock derivation from the Generic Content Engine (Phase 9.5), not independent parallel data. */
export function getUserContent(user: AdminUser): { authored: ContentItem[]; reviewed: ContentItem[] } {
  const index = mockAdminUsers.findIndex((u) => u.id === user.id);
  const canAuthor = user.role === "TEACHER" || user.role === "ADMIN" || user.role === "SCHOLAR_REVIEWER";
  const canReview = user.role === "SCHOLAR_REVIEWER" || user.role === "ADMIN";
  return {
    authored: canAuthor ? mockContentItems.filter((_, i) => i % mockAdminUsers.length === index % mockContentItems.length) : [],
    reviewed: canReview ? mockContentItems.filter((_, i) => (i + 1) % mockAdminUsers.length === index % mockContentItems.length) : [],
  };
}

export type ActivityResult = "SUCCESS" | "FAILURE";

export interface FullActivityLogEntry extends ActivityLogEntry {
  result: ActivityResult;
}

/**
 * سجل نشاط كامل — **يمتد من `recentActivity` الموجود فعليًا في
 * `lib/mock/admin.ts` (Module 1)** بدل بيانات موازية جديدة، مضيفًا حقل
 * `result` فقط ومزيدًا من الإدخالات لاختبار الصفحات.
 *
 * Full activity log — **extends the existing `recentActivity` from
 * `lib/mock/admin.ts` (Module 1)** instead of new parallel data, only
 * adding a `result` field and more entries to exercise pagination.
 */
export const fullActivityLog: FullActivityLogEntry[] = [
  ...dashboardRecentActivity.map((entry, i) => ({ ...entry, result: (i % 6 === 0 ? "FAILURE" : "SUCCESS") as ActivityResult })),
  ...Array.from({ length: 24 }, (_, i) => {
    const user = mockAdminUsers[(i * 3) % mockAdminUsers.length]!;
    const actions = ["CREATE", "UPDATE", "APPROVE", "DELETE", "PUBLISH"] as const;
    const targets = ["مقالة", "فتوى", "درس", "حديث", "آية"];
    return {
      id: `act-extra-${i}`,
      actorName: user.name,
      actorInitials: user.avatarInitials,
      action: actions[i % actions.length]!,
      targetTitle: `${targets[i % targets.length]} رقم ${i + 1}`,
      targetType: targets[i % targets.length]!,
      timestamp: new Date(2026, 6, 1 + (i % 25), 7 + (i % 14)).toISOString(),
      result: (i % 7 === 0 ? "FAILURE" : "SUCCESS") as ActivityResult,
    };
  }),
];
