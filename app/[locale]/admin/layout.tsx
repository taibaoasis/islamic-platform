import type { ReactNode } from "react";

import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdminAccess } from "@/services/auth.service";

/**
 * Admin Layout — Design System §4.4 (Dashboard Layout) حرفيًا: Sidebar +
 * شريط علوي داخلي + منطقة محتوى، بلا Footer عام. يُطبَّق تلقائيًا على
 * كل مسار تحت /admin عبر بنية Next.js App Router (layout متداخل).
 *
 * Phase 0.1 — Security Baseline: `requireAdminAccess()` هو الآن حارس
 * المستوى الخارجي الفعلي (Layer A) لكل صفحات لوحة الإدارة — غير
 * مصادَق عليه → توجيه لتسجيل الدخول؛ مصادَق عليه بلا صلاحية إدارية
 * → توجيه للصفحة الرئيسية. تفصيل كامل في docs/SECURITY_BASELINE.md.
 *
 * Admin Layout — Design System §4.4 (Dashboard Layout) verbatim:
 * Sidebar + internal top bar + content area, no public Footer. Applied
 * automatically to every route under /admin via Next.js App Router's
 * nested layout structure.
 *
 * Phase 0.1 — Security Baseline: `requireAdminAccess()` is now the
 * real outer-level guard (Layer A) for every admin panel page —
 * unauthenticated → redirect to sign-in; authenticated without admin
 * permission → redirect to the home page. Full detail in
 * docs/SECURITY_BASELINE.md.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminAccess();

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
