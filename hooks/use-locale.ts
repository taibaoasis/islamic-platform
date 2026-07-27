"use client";

import { useLocale as useNextIntlLocale } from "next-intl";

import { getDirection, type Locale } from "@/config/site";

/** يعيد اللغة الحالية واتجاه الكتابة المرتبط بها معًا. */
export function useLocale() {
  const locale = useNextIntlLocale() as Locale;
  return { locale, direction: getDirection(locale) };
}
