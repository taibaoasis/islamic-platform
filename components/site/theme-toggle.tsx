"use client";

import { useSyncExternalStore } from "react";

import { useTheme } from "@/hooks/use-theme";
import { IconButton } from "@/components/ui/icon-button";
import { Sun, Moon, Monitor } from "@/components/icons";

/**
 * ملف جديد — ليس مكوّن أساسًا في مكتبة UI (components/ui/)، بل تركيب
 * صغير خاص بحالة الصفحة/الموقع فوق IconButton الموجود مسبقًا؛ موثَّق في
 * HOME_PAGE_IMPLEMENTATION_REPORT.md كإضافة ضرورية (لا بديل جاهز في
 * المكتبة الحالية لتبديل الثيم).
 *
 * New file — not a base component in the UI library (components/ui/),
 * but a small composition on top of the existing IconButton for
 * site-level theme state; documented in
 * HOME_PAGE_IMPLEMENTATION_REPORT.md as a necessary addition (no
 * existing library component covers theme switching).
 */
const cycle = { light: "dark", dark: "system", system: "light" } as const;
const icons = { light: Sun, dark: Moon, system: Monitor } as const;

function subscribeNoop() {
  return () => {};
}

/**
 * يتجنَّب عدم تطابق العرض بين الخادم والعميل (Hydration Mismatch) عبر
 * useSyncExternalStore بدل useEffect+setState (النمط الأحدث الموصى به،
 * لا يُنتج عروضًا متتالية غير ضرورية).
 * Avoids a server/client hydration mismatch via useSyncExternalStore
 * instead of useEffect+setState (the newer recommended pattern; avoids
 * unnecessary cascading renders).
 */
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function ThemeToggle({ labels }: { labels: { light: string; dark: string; system: string } }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const current = mounted ? theme ?? "system" : "system";
  const Icon = icons[current];

  return (
    <IconButton
      aria-label={labels[current]}
      variant="ghost"
      size="md"
      onClick={() => setTheme(cycle[current])}
    >
      <Icon aria-hidden="true" />
    </IconButton>
  );
}
