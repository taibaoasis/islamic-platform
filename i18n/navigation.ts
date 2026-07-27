import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

/**
 * استخدم هذه بدل مكافآتها القياسية من next/link و next/navigation
 * لضمان بقاء المستخدم على نفس اللغة عند التنقل.
 *
 * Use these instead of their next/link & next/navigation counterparts
 * so navigation always preserves the current locale.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
