"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { ChevronsLeft, ChevronsRight } from "@/components/icons";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

/**
 * Sidebar — Design System §4.2. تُستخدَم حصرًا داخل Dashboard Layout،
 * لا في الصفحات العامة. قابلة للطي على الشاشات المتوسطة (يُتحكَّم بها
 * هنا داخليًا لتوضيح السلوك؛ صفحات لاحقة قد ترفع الحالة للأعلى عند
 * الحاجة لحفظها). على الهاتف تُستبدَل بالكامل بمكوّن Drawer، لا بهذا
 * الشريط (§4.5).
 *
 * Sidebar — Design System §4.2. Used exclusively inside Dashboard
 * Layout, never on public pages. Collapsible on medium screens
 * (controlled internally here to demonstrate behavior; later pages may
 * lift the state up if persistence is needed). On mobile it's fully
 * replaced by the Drawer component, not this bar (§4.5).
 */
export function Sidebar({ items, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-e border-border bg-background transition-[width] md:flex md:flex-col",
        collapsed ? "md:w-16" : "md:w-64",
        className
      )}
    >
      <nav aria-label="تنقّل لوحة التحكم" className="flex-1 space-y-1 p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm font-medium",
              item.active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-2">
        <IconButton
          aria-label={collapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronsLeft aria-hidden="true" className="rtl:rotate-180" /> : <ChevronsRight aria-hidden="true" className="rtl:rotate-180" />}
        </IconButton>
      </div>
    </aside>
  );
}
