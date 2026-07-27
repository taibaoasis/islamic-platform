"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { Menu, X } from "@/components/icons";

export interface HeaderNavItem {
  label: string;
  href: string;
}

export interface HeaderProps {
  logo: ReactNode;
  navItems: HeaderNavItem[];
  /** عناصر الجهة الأخرى: بحث، مبدِّل لغة، مبدِّل ثيم، حساب. End-side items: search, language switcher, theme switcher, account. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Header — Design System §4.1. شريط علوي ثابت (Sticky). على الهاتف
 * تُستبدَل القائمة الأفقية بأيقونة همبرغر تفتح قائمة منسدلة داخلية (في
 * الصفحات الفعلية لاحقًا ستُستبدَل بمكوّن Drawer الكامل — هذا المكوّن
 * يوفّر السلوك الأساسي فقط دون التعميق في تفاصيل الحركة).
 *
 * Header — Design System §4.1. A sticky top bar. On mobile the
 * horizontal menu is replaced by a hamburger icon that opens an inline
 * dropdown (real pages will later swap this for the full Drawer
 * component — this component provides only the base behavior, not
 * motion detail).
 */
export function Header({ logo, navItems, actions, className }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {logo}
          <nav aria-label="التنقّل الرئيسي" className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/80 hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <IconButton
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            variant="ghost"
            size="md"
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </IconButton>
        </div>
      </div>

      {mobileOpen && (
        <nav aria-label="التنقّل الرئيسي (هاتف)" className="border-t border-border px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block text-sm font-medium text-foreground/80 hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
