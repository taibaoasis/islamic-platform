import bcrypt from "bcryptjs";

/**
 * Phase 0.2 — طبقة تجزئة كلمات المرور. غلاف رفيع فوق `bcryptjs` (JS
 * خالص، بلا تصريف Native — قرار مُبرَّر في docs/AUTHENTICATION_PLAN.md
 * §3 تفاديًا لمخاطر التصريف على استضافة cPanel/Passenger).
 *
 * Phase 0.2 — password hashing layer. A thin wrapper over `bcryptjs`
 * (pure JS, no native compilation — justified in
 * docs/AUTHENTICATION_PLAN.md §3 to avoid compilation risk on the
 * targeted cPanel/Passenger hosting).
 */

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

/**
 * تجزئة وهمية صالحة (bcrypt حقيقي لنص عشوائي غير سرّي، لا تمثِّل أي
 * حساب حقيقي) — تُستخدَم في `lib/auth.ts` لضمان تنفيذ `bcrypt.compare`
 * دائمًا حتى مع بريد غير موجود، فيتساوى زمن الاستجابة تقريبًا بين
 * "المستخدم غير موجود" و"كلمة المرور خاطئة" — يقلِّل من هجمات تعداد
 * البريد القائمة على التوقيت (`docs/AUTHENTICATION_SECURITY.md §2`).
 *
 * A valid dummy hash (a real bcrypt hash of a non-secret random
 * string, not tied to any real account) — used in `lib/auth.ts` to
 * ensure `bcrypt.compare` always runs even for a nonexistent email, so
 * response timing stays roughly equal between "user not found" and
 * "wrong password" — reduces timing-based email enumeration
 * (`docs/AUTHENTICATION_SECURITY.md §2`).
 */
export const DUMMY_PASSWORD_HASH = "$2b$12$Q03CyUak0fyaIRWMnePV8.TSOYZu1CcYoRpZG6k50kPSLO.84PnK2";
