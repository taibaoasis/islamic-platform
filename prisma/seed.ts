import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const MIN_PASSWORD_LENGTH = 12;

/**
 * Phase 0.2 — تهيئة أول حساب ADMIN عبر متغيرات بيئة فقط، لا قيم ثابتة
 * في الكود أبدًا. آمن لإعادة التشغيل (Idempotent) — لا يستبدل حسابًا
 * موجودًا، ويتخطّى بصمت إن غابت المتغيرات (لا يفشل عمليات نشر لاحقة
 * لا تحتاج تهيئة أدمن). تفصيل كامل في docs/AUTHENTICATION_PLAN.md §6.
 *
 * ⚠ استيراد نسبي لا `@/...` عمدًا — هذا الملف يُشغَّل مباشرة عبر `tsx`
 * خارج بيئة تشغيل Next.js، التي لا تُحلِّل أسماء مسارات tsconfig
 * المستعارة (`@/lib/...`) بمعزل عن حزمة الترجمة الخاصة بـNext.js.
 *
 * Phase 0.2 — bootstraps the first ADMIN account from environment
 * variables only, never a hard-coded value. Safe to re-run
 * (idempotent) — never overwrites an existing user, and silently skips
 * when the variables are absent (won't fail later deploys that don't
 * need admin bootstrapping). Full detail in
 * docs/AUTHENTICATION_PLAN.md §6.
 *
 * ⚠ Deliberately a relative import, not `@/...` — this file runs
 * directly via `tsx` outside the Next.js runtime, which doesn't
 * resolve tsconfig path aliases (`@/lib/...`) without Next's own
 * bundler.
 */
async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ℹ BOOTSTRAP_ADMIN_EMAIL/BOOTSTRAP_ADMIN_PASSWORD غير مضبوطتين — تخطّي إنشاء الأدمن الأولي.");
    return;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`BOOTSTRAP_ADMIN_PASSWORD يجب ألا تقل عن ${MIN_PASSWORD_LENGTH} حرفًا.`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ المستخدم ${email} موجود بالفعل — لن تُستبدَل كلمة المرور تلقائيًا (أمان).`);
    return;
  }

  const passwordHash = await hashPassword(password);
  const admin = await prisma.user.create({
    data: { email, passwordHash, role: "ADMIN", name: "Platform Admin" },
  });

  console.log("✅ أُنشئ أول حساب ADMIN:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
