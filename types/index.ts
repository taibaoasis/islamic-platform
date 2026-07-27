import type { Locale } from "@/config/site";
import type { Role } from "@/config/permissions";

/** شكل موحّد لاستجابات API عبر المشروع. Uniform API response shape. */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export type { Locale, Role };
