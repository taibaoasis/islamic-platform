import { defineRouting } from "next-intl/routing";

import { locales, defaultLocale } from "@/config/site";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always", // كل الروابط تبدأ بكود اللغة، مطابقة لمعيار الروابط في وثيقة IA
});
