"use client";

import { useTranslations } from "next-intl";

import { Sidebar, type SidebarItem } from "@/components/ui/sidebar";
import { usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ScrollText,
  Newspaper,
  MessageCircleQuestion,
  Library,
  GraduationCap,
  PlayCircle,
  Folder,
  Users,
  ShieldCheck,
  Shield,
  Activity,
  Globe2,
  Languages,
  Settings,
  BarChart3,
} from "@/components/icons";

/**
 * AdminSidebarNav — تركيب عميل صغير فوق `Sidebar` من Phase 8 (لا تعديل
 * على المكوّن نفسه) — يحسب العنصر النشط عبر `usePathname` فقط. كل
 * أقسام لوحة الإدارة الـ16 مُدرَجة هنا حتى قبل بناء صفحاتها (Modules
 * 2-9 القادمة)، لتظهر بنية التنقّل الكاملة من البداية.
 *
 * AdminSidebarNav — a small client composition over Phase 8's `Sidebar`
 * (no modification to the component itself) — computes the active item
 * via `usePathname` only. All 16 admin sections are listed here even
 * before their pages are built (upcoming Modules 2-9), so the full
 * navigation structure is visible from the start.
 */
export function AdminSidebarNav() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  const items: { key: string; href: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", href: "/admin", icon: LayoutDashboard },
    { key: "quran", href: "/admin/quran", icon: BookOpen },
    { key: "hadith", href: "/admin/hadith", icon: ScrollText },
    { key: "articles", href: "/admin/content/articles", icon: Newspaper },
    { key: "fatwas", href: "/admin/content/fatwas", icon: MessageCircleQuestion },
    { key: "books", href: "/admin/content/books", icon: Library },
    { key: "lessons", href: "/admin/content/lessons", icon: GraduationCap },
    { key: "news", href: "/admin/content/news", icon: Newspaper },
    { key: "courses", href: "/admin/courses", icon: PlayCircle },
    { key: "media", href: "/admin/media", icon: Folder },
    { key: "users", href: "/admin/users", icon: Users },
    { key: "roles", href: "/admin/roles", icon: ShieldCheck },
    { key: "permissions", href: "/admin/permissions", icon: Shield },
    { key: "activityLog", href: "/admin/activity", icon: Activity },
    { key: "languages", href: "/admin/localization", icon: Globe2 },
    { key: "translations", href: "/admin/localization/queue", icon: Languages },
    { key: "settings", href: "/admin/settings", icon: Settings },
    { key: "reports", href: "/admin/reports", icon: BarChart3 },
  ];

  const sidebarItems: SidebarItem[] = items.map(({ key, href, icon: Icon }) => ({
    label: t(key as "dashboard"),
    href,
    icon: <Icon className="size-4" aria-hidden="true" />,
    active: pathname === href,
  }));

  return <Sidebar items={sidebarItems} />;
}
