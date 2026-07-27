/**
 * نظام الثيمات (Themes) — تعريف منطقي للأوضاع المتاحة.
 * القيم الفعلية للألوان (HSL) معرّفة كمتغيرات CSS في styles/themes.css
 * حتى يمكن تبديلها فورًا عبر class على <html> دون إعادة تحميل الصفحة.
 *
 * Theme system — logical definition of available modes.
 * Actual HSL color values live in styles/themes.css as CSS variables so
 * switching is instant via a class on <html>, no reload required.
 */

export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

export const defaultTheme: Theme = "system";

// أسماء المتغيرات المتوقعة في كل ثيم — استخدم هذه القائمة كعقد بين
// styles/themes.css وكتلة @theme inline في styles/globals.css (Tailwind
// v4 لا يستخدم ملف تهيئة JS) حتى لا تختلف الأسماء.
// Expected variable names per theme — treat this as the contract between
// styles/themes.css and the @theme inline block in styles/globals.css
// (Tailwind v4 has no JS config file) so names never drift apart.
export const themeTokens = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
] as const;
