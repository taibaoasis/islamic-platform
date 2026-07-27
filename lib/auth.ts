import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role } from "@prisma/client";

import { db } from "@/lib/db";

/**
 * إعداد NextAuth (Auth.js v4 المستقر) المركزي. لا يُضاف أي مزوّد
 * (Provider) فعلي في هذه المرحلة — البنية جاهزة فقط. أضف مزوّدي الدخول
 * (Google, Email, Credentials...) عند بدء العمل على صفحات تسجيل الدخول
 * الفعلية.
 *
 * Central NextAuth (stable Auth.js v4) setup. No concrete provider is
 * wired up yet in this phase — the scaffolding is ready only. Add
 * sign-in providers (Google, Email, Credentials...) once real auth
 * pages are built.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    // سيتم تحديد المسارات الفعلية عند إنشاء صفحات تسجيل الدخول في مرحلة لاحقة.
    // Real paths will be set once sign-in pages exist in a later phase.
  },
  providers: [
    // مثال: GoogleProvider({ clientId: ..., clientSecret: ... })
    // Example: GoogleProvider({ clientId: ..., clientSecret: ... })
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
