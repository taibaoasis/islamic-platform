/**
 * إعدادات الموقع العامة — مصدر واحد للحقائق يُستخدم في i18n والـ layout والـ SEO.
 * General site configuration — single source of truth used by i18n, layout, and SEO.
 */

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

// اللغات التي تُكتب من اليمين إلى اليسار — أضف هنا عند تفعيل لغة جديدة (ur, fa ...)
// Locales written right-to-left — extend this when a new RTL locale is enabled.
export const rtlLocales: Locale[] = ["ar"];

export function getDirection(locale: string): "rtl" | "ltr" {
  return rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";
}

export const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const siteConfig = {
  name: "Islamic Platform",
  shortName: "IP",
  description: {
    ar: "المنصة العالمية للتعريف بالإسلام والتعليم الإسلامي",
    en: "The Global Platform for Introducing Islam and Islamic Education",
  },
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;
