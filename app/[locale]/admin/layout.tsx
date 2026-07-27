import type { ReactNode } from "react";

import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { AdminHeader } from "@/components/admin/admin-header";

/**
 * Admin Layout — Design System §4.4 (Dashboard Layout) حرفيًا: Sidebar +
 * شريط علوي داخلي + منطقة محتوى، بلا Footer عام. يُطبَّق تلقائيًا على
 * كل مسار تحت /admin عبر بنية Next.js App Router (layout متداخل).
 *
 * ملاحظة أمان صريحة: هذه المرحلة "واجهة فقط" بالكامل — لا حراسة صلاحية
 * فعلية هنا. عند الربط بمصادقة حقيقية لاحقًا، نقطة التكامل الطبيعية هي
 * `services/auth.service.ts` (`requirePermission`) الموجودة مسبقًا من
 * طبقة الأساس — يُستدعى هنا في هذا الملف تحديدًا لحراسة كل لوحة الإدارة
 * بفحص واحد مركزي.
 *
 * Admin Layout — Design System §4.4 (Dashboard Layout) verbatim:
 * Sidebar + internal top bar + content area, no public Footer. Applied
 * automatically to every route under /admin via Next.js App Router's
 * nested layout structure.
 *
 * Explicit security note: this phase is entirely "UI only" — no real
 * permission gating here. When wired to real authentication later, the
 * natural integration point is the existing
 * `services/auth.service.ts` (`requirePermission`) from the Foundation
 * layer — called here, in this exact file, to guard the entire admin
 * panel with one centralized check.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebarNav />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main id="main-content" className="flex-1 bg-secondary/20 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
