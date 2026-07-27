import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";

/**
 * نقطة تجميع واحدة لكل الـ Providers — أضف أي Provider جديد هنا فقط
 * حتى لا يتشتت التركيب (nesting) عبر الملفات.
 *
 * Single composition point for all providers — add any new provider
 * here only, so nesting doesn't get scattered across files.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
