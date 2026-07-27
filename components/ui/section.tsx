import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Section — يضبط المسافة الرأسية الموحَّدة بين أقسام أي صفحة. Sets the uniform vertical rhythm between a page's sections. */
export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-8 sm:py-12", className)} {...props} />;
}
