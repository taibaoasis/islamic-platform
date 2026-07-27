"use server";

/**
 * مثال توضيحي لنمط Server Actions المعتمد في المشروع — وليس ميزة فعلية.
 * احذف هذا الملف عند إضافة أول Server Action حقيقي لأي ميزة.
 *
 * Illustrative example of the project's Server Action pattern — not a
 * real feature. Delete this file once the first real feature's Server
 * Action is added.
 */
export async function pingAction(): Promise<{ ok: true; timestamp: number }> {
  return { ok: true, timestamp: Date.now() };
}
