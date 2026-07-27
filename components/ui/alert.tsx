import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "@/components/icons";

/**
 * Alert — Design System §3.17. رسالة سياقية ثابتة (لا تختفي تلقائيًا)
 * — يختلف عن Toast في البقاء طالما السياق قائم. مثال الاستخدام
 * الجوهري لهذا المشروع: "هذا المحتوى قيد المراجعة العلمية".
 *
 * Alert — Design System §3.17. A persistent contextual message (does
 * not auto-dismiss) — differs from Toast by staying as long as the
 * context holds. Core use case for this project: "this content is
 * under scholarly review".
 */
const alertVariants = cva("flex items-start gap-3 rounded-[var(--radius)] border p-4 text-sm", {
  variants: {
    variant: {
      info: "border-info/30 bg-info/10 text-foreground",
      success: "border-success/30 bg-success/10 text-foreground",
      warning: "border-warning/30 bg-warning/10 text-foreground",
      error: "border-destructive/30 bg-destructive/10 text-foreground",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

const iconColor = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
} as const;

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div role="status" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className={cn("size-5 shrink-0", iconColor[variant ?? "info"])} aria-hidden="true" />
      <div className="space-y-1">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
