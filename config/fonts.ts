import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

/**
 * نظام الخطوط — خط عربي وخط لاتيني، كلاهما محمّل عبر next/font
 * (بدون طلبات شبكة عند التشغيل، ومحسّن تلقائيًا) ومُصدَّر كمتغيرات CSS.
 * يتم اختيار العائلة المناسبة تلقائيًا حسب اتجاه اللغة في app/[locale]/layout.tsx.
 *
 * Font system — one Arabic + one Latin font, both loaded via next/font
 * (self-hosted at build time, no runtime network request) and exported as
 * CSS variables. The right family is applied per-locale in the root layout.
 */

// أسماء مميزة (next-font-*) بدل (--font-arabic/--font-sans) لتفادي التعارض
// مع أسماء رموز الثيم في Tailwind v4 (@theme في styles/globals.css يربط
// بينهما صراحة).
// Distinct names (next-font-*) instead of (--font-arabic/--font-sans) to
// avoid colliding with Tailwind v4's theme token names (@theme in
// styles/globals.css links them explicitly).
export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--next-font-arabic",
  display: "swap",
});

export const fontLatin = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--next-font-latin",
  display: "swap",
});

// اجمع كل متغيرات الخطوط لتطبيقها على <body> في layout الجذر.
// Combine all font variables to apply on <body> in the root layout.
export const fontVariables = `${fontArabic.variable} ${fontLatin.variable}`;
