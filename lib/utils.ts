import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** يدمج أسماء أصناف Tailwind بأمان (يحل تعارض الأصناف المكررة). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
