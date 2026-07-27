"use client";

import { useTheme as useNextTheme } from "next-themes";

import type { Theme } from "@/config/themes";

/**
 * غلاف رفيع فوق next-themes حتى يبقى نوع Theme متوافقًا مع config/themes.ts
 * في كل مكان يُستخدم فيه، ولإخفاء تفاصيل المكتبة عن بقية المشروع.
 *
 * Thin wrapper over next-themes so the Theme type stays aligned with
 * config/themes.ts everywhere it's used, and to keep the library's
 * details out of the rest of the project.
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  return {
    theme: theme as Theme | undefined,
    resolvedTheme: resolvedTheme as "light" | "dark" | undefined,
    setTheme: (value: Theme) => setTheme(value),
  };
}
