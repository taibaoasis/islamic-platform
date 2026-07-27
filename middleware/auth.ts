import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * حارس المصادقة على مستوى الـ middleware — جاهز لكن غير مُفعَّل بعد،
 * لأنه لا توجد صفحات محمية في هذه المرحلة (حسب النطاق المطلوب).
 *
 * عند إضافة صفحات تتطلب تسجيل دخول (مثل حسابي/لوحة التحكم لاحقًا):
 * أضف مساراتها إلى PROTECTED_PATTERNS، واستخدم `getToken` من
 * "next-auth/jwt" (النمط المعتمد لفحص الجلسة داخل middleware في
 * NextAuth v4) للتحقق الفعلي من الجلسة هنا.
 *
 * Auth guard at the middleware level — wired but inert, since no
 * protected pages exist yet in this phase (per the requested scope).
 *
 * When pages that require sign-in are added later (e.g. "My account" /
 * admin dashboard): add their paths to PROTECTED_PATTERNS, and use
 * `getToken` from "next-auth/jwt" (NextAuth v4's supported pattern for
 * checking a session inside middleware) to actually check the session
 * here.
 */

const PROTECTED_PATTERNS: RegExp[] = [
  // مثال مستقبلي: /^\/(ar|en)\/account(\/.*)?$/
];

export function authMiddleware(request: NextRequest): NextResponse | null {
  const isProtected = PROTECTED_PATTERNS.some((pattern) => pattern.test(request.nextUrl.pathname));
  if (!isProtected) return null;

  // TODO: التحقق الفعلي من الجلسة عند تفعيل الصفحات المحمية.
  // TODO: real session check once protected pages are enabled.
  return NextResponse.next();
}
