import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";

import { db } from "@/lib/db";
import { verifyPassword, DUMMY_PASSWORD_HASH } from "@/lib/password";

/**
 * إعداد NextAuth (Auth.js v4 المستقر) المركزي.
 *
 * Phase 0.2 — مزوِّد Credentials وحيد (بريد + كلمة مرور) — القرار
 * والمبرِّرات كاملة في docs/AUTHENTICATION_PLAN.md §2. لا مزوِّد ثانٍ
 * في هذه المرحلة.
 *
 * Central NextAuth (stable Auth.js v4) setup.
 *
 * Phase 0.2 — a single Credentials provider (email + password) — full
 * decision and rationale in docs/AUTHENTICATION_PLAN.md §2. No second
 * provider in this phase.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    // لا صفحة دخول مخصَّصة في هذه المرحلة — مسار NextAuth الافتراضي
    // (/api/auth/signin) يُستخدَم كما هو، بقرار صريح موثَّق
    // (docs/AUTHENTICATION_PLAN.md §5) لتفادي أي لمس على الواجهة.
    // No custom sign-in page in this phase — NextAuth's default route
    // (/api/auth/signin) is used as-is, an explicit documented decision
    // (docs/AUTHENTICATION_PLAN.md §5) to avoid touching the UI.
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const user = await db.user.findUnique({ where: { email } });

        // تنفيذ bcrypt.compare دائمًا (على تجزئة المستخدم الحقيقية إن
        // وُجدت، أو تجزئة وهمية صالحة إن لم يوجد) — يمنع اختلاف التوقيت
        // بين "بريد غير موجود" و"كلمة مرور خاطئة"
        // (docs/AUTHENTICATION_SECURITY.md §2).
        // Always run bcrypt.compare (against the real user's hash if
        // present, otherwise a valid dummy hash) — prevents a timing
        // difference between "email not found" and "wrong password"
        // (docs/AUTHENTICATION_SECURITY.md §2).
        const hashToCompare = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
        const isValid = await verifyPassword(credentials.password, hashToCompare);

        // فشل موحَّد لكل الحالات الثلاث — لا كشف عن السبب تحديدًا (منع
        // تعداد البريد). Unified failure for all three cases — no
        // disclosure of the specific reason (prevents email
        // enumeration).
        if (!user || !user.passwordHash || !isValid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role ?? "MEMBER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as Role) ?? "MEMBER";
      }
      return session;
    },
  },
};
