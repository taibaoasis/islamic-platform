"use server";

import { requirePermission } from "@/services/auth.service";

/**
 * مثال توضيحي لنمط Server Actions المعتمد في المشروع — وليس ميزة فعلية.
 * احذف هذا الملف عند إضافة أول Server Action حقيقي لأي ميزة.
 *
 * Phase 0.1 — Security Baseline: **كل Server Action إداري مستقبلي يُنشئ/
 * يُعدِّل/يحذف/ينشر بيانات حقيقية يجب أن يستدعي `requirePermission()` كأول
 * سطر في جسمه** — حماية مستقلة عن حراسة الصفحة (Layer A)، لأن أي
 * Server Action قابل للاستدعاء مباشرة بمعزل عن الصفحة التي تعرضه.
 * `requirePermission` يرمي استثناءً عند الفشل (`UNAUTHENTICATED`/
 * `FORBIDDEN`) — يُلتقَط هذا في جهة العميل التي استدعت الـAction.
 *
 * ⚠ لا توجد حاليًا أي Server Action إدارية حقيقية في المشروع تُنشئ أو
 * تُعدِّل بيانات فعلية (لوحة الإدارة بأكملها تعمل بحالة عميل محلية
 * ومزيَّفة (Mock) فقط حتى الآن) — هذا الملف نموذج مرجعي للنمط
 * الإلزامي فقط، لا حماية لعملية حقيقية موجودة. تفصيل كامل في
 * docs/SECURITY_BASELINE.md.
 *
 * Illustrative example of the project's Server Action pattern — not a
 * real feature. Delete this file once the first real feature's Server
 * Action is added.
 *
 * Phase 0.1 — Security Baseline: **every future admin Server Action
 * that creates/updates/deletes/publishes real data must call
 * `requirePermission()` as the first line in its body** — protection
 * independent of page-level guarding (Layer A), since any Server
 * Action can be invoked directly regardless of which page rendered it.
 * `requirePermission` throws on failure (`UNAUTHENTICATED`/
 * `FORBIDDEN`) — caught by the client call site.
 *
 * ⚠ There is currently no real admin Server Action anywhere in the
 * project that creates or mutates real data (the entire admin panel
 * runs on local, mocked client state only) — this file is a reference
 * pattern for the mandatory convention only, not protection for an
 * existing real operation. Full detail in docs/SECURITY_BASELINE.md.
 */
export async function pingAction(): Promise<{ ok: true; timestamp: number }> {
  await requirePermission("settings:manage"); // مثال فقط — بدِّل الصلاحية بما يناسب العملية الفعلية عند إضافتها. Example only — swap for whatever permission the real operation needs.
  return { ok: true, timestamp: Date.now() };
}
