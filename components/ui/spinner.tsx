import { cn } from "@/lib/utils";
import { Loader2 } from "@/components/icons";

/**
 * Spinner — Design System §3.21 (Loading States: "تحميل أثناء فعل").
 * يُستخدَم داخل عنصر صغير (زر، حقل) لا كمؤشر يحجب الصفحة كاملة.
 * `role="status"` + نص مخفي بصريًا يعلن الحالة لتقنيات المساعدة.
 *
 * Spinner — Design System §3.21 ("loading during an action"). Used
 * inside a small element (button, field), not as a full-page blocking
 * indicator. `role="status"` + visually-hidden text announces the
 * state to assistive tech.
 */
export function Spinner({ className, label = "جارٍ التحميل" }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 className={cn("size-4 animate-spin", className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
