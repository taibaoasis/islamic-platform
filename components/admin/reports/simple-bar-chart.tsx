/**
 * SimpleBarChart — Phase 11, Module 7 §Charts. **بديل مقصود عن مكتبة
 * رسوم بيانية** (Chart.js متاحة في المشروع لكن غير مُستخدَمة هنا عمدًا) —
 * التعليمات تطلب صراحةً "تجنّب أي تعقيد غير ضروري"؛ أشرطة CSS بسيطة
 * تكفي تمامًا لعرض توزيع نسبي دون حزمة إضافية أو حالة عميل معقَّدة.
 *
 * SimpleBarChart — Phase 11, Module 7, "Charts" section. **A
 * deliberate alternative to a charting library** (Chart.js is available
 * in the project but intentionally unused here) — the instructions
 * explicitly ask to "avoid unnecessary complexity"; plain CSS bars are
 * entirely sufficient to show a relative distribution without an extra
 * package or complex client state.
 */
export function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <ul className="space-y-2.5">
      {data.map((item) => (
        <li key={item.label} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-muted-foreground">{item.label}</span>
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
          </span>
          <span className="w-10 shrink-0 text-end font-medium text-foreground tabular-nums">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
