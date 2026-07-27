import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  columns: FooterColumn[];
  /** روابط الثقة، التواصل الاجتماعي، إلخ. Trust links, social links, etc. */
  bottomContent?: ReactNode;
  className?: string;
}

/** Footer — Design System §4.3. خريطة موقع مصغَّرة بالأعمدة + محتوى سفلي حر. Mini sitemap columns + free-form bottom content. */
export function Footer({ columns, bottomContent, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-border bg-secondary/40", className)}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {bottomContent && (
        <div className="border-t border-border px-4 py-6 sm:px-6 lg:px-8">{bottomContent}</div>
      )}
    </footer>
  );
}
