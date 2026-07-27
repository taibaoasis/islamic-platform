"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { X } from "@/components/icons";

/**
 * Dialog — Design System §3.8. **يملأ فجوة مؤجَّلة صراحة منذ Phase 8**
 * ("لا مكوّن جاهز في المكتبة الحالية" — موثَّق في UI_IMPLEMENTATION_REPORT.md
 * وHOME_PAGE_IMPLEMENTATION_REPORT.md ومرات أخرى). بُني الآن لأن Module 4
 * (منتقي الوسائط + واجهة الرفع) يحتاجه فعليًا لأول مرة، لا استباقًا
 * بلا حاجة حقيقية — بالضبط القاعدة المُعلَنة في كل مرحلة سابقة
 * ("لا تنشئ مكوّنًا جديدًا إلا لضرورة حقيقية").
 *
 * Dialog — Design System §3.8. **Fills a gap explicitly deferred since
 * Phase 8** ("no ready component in the current library" — documented
 * in UI_IMPLEMENTATION_REPORT.md, HOME_PAGE_IMPLEMENTATION_REPORT.md,
 * and elsewhere). Built now because Module 4 (Media Picker + Upload UI)
 * genuinely needs it for the first time, not built preemptively without
 * real need — exactly the rule stated in every prior phase ("don't
 * create a new component without genuine necessity").
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = forwardRef<ElementRef<typeof DialogPrimitive.Overlay>, ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm", className)}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed start-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 shadow-lg rtl:translate-x-1/2",
          "max-h-[85vh] overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute end-4 top-4 rounded-[var(--radius)] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-start", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

export const DialogTitle = forwardRef<ElementRef<typeof DialogPrimitive.Title>, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export const DialogDescription = forwardRef<ElementRef<typeof DialogPrimitive.Description>, ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
  ({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;
