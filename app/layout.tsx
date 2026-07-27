import type { ReactNode } from "react";

/**
 * Layout جذري بأدنى حد — Next.js يتطلب app/layout.tsx واحدًا في الجذر.
 * كل المنطق الفعلي (اللغة، الاتجاه، الخطوط، الـ Providers) موجود في
 * app/[locale]/layout.tsx لأن كل صفحة تقع تحت مقطع لغة.
 *
 * Minimal root layout — Next.js requires exactly one root app/layout.tsx.
 * All real logic (locale, direction, fonts, providers) lives in
 * app/[locale]/layout.tsx since every page sits under a locale segment.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
