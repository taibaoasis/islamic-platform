"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { StatusBadge, type ContentLifecycleStatus } from "@/components/admin/status-badge";
import { workflowOrder } from "@/lib/mock/editor";

/**
 * WorkflowBar — Phase 11, Module 3 §"Workflow". أزرار انتقال حالة
 * صريحة بين المراحل الخمس، **واجهة فقط بلا حفظ حقيقي** (نفس منطق
 * `RowActions` في Module 2.1 — لا اختصار لمرحلة الاعتماد العلمي أبدًا،
 * حتى هنا).
 *
 * WorkflowBar — Phase 11, Module 3, "Workflow" section. Explicit status
 * transition buttons across the five stages, **UI only, no real
 * persistence** (same logic as `RowActions` in Module 2.1 — never
 * skipping the scholarly-approval stage, even here).
 */
export function WorkflowBar({ status, onChange }: { status: ContentLifecycleStatus; onChange: (status: ContentLifecycleStatus) => void }) {
  const t = useTranslations("admin");
  const currentIndex = workflowOrder.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-border p-3">
      <span className="text-sm font-medium text-foreground">{t("editor.workflow.title")}:</span>
      <StatusBadge status={status} />
      <div className="ms-auto flex flex-wrap gap-1.5">
        {workflowOrder.map((stage, index) => {
          const isCurrent = stage === status;
          const isPastOrCurrentStage = index <= currentIndex;
          const isImmediateNext = index === currentIndex + 1;
          return (
            <Button
              key={stage}
              size="sm"
              variant={isCurrent ? "primary" : "outline"}
              disabled={isPastOrCurrentStage || !isImmediateNext}
              onClick={() => onChange(stage)}
            >
              {t(`status.${stage}`)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
