import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * Card — Design System §3.7. الأنواع (Default/Media/Interactive) تُبنى
 * من نفس هذه القطع الأساسية عبر التركيب (Composition)، لا Variants
 * منفصلة — `interactive` يُضاف كخاصية Boolean تفعِّل حالة Hover الكاملة.
 *
 * Card — Design System §3.7. The variants (Default/Media/Interactive)
 * are built from these same base parts via composition, not separate
 * variants — `interactive` is a boolean prop that enables the full
 * hover state.
 */
export function Card({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background shadow-sm",
        interactive && "cursor-pointer transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold leading-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-hidden rounded-t-lg", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2 p-4 pt-0", className)} {...props} />;
}
