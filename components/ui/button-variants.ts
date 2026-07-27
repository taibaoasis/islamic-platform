import { cva } from "class-variance-authority";

/**
 * مفصولة عن button.tsx عمدًا — button.tsx يحمل توجيه "use client"
 * (لأن Button نفسه مكوّن تفاعلي)، ما يجعل كل تصدير منه، بما فيه دالة
 * عادية مثل buttonVariants، "عميلاً فقط" وغير قابل للاستدعاء من مكوّنات
 * الخادم (اكتُشف هذا فعليًا كخطأ تشغيل أثناء اختبار هذه الصفحة). فصلها
 * هنا في ملف بلا "use client" يسمح باستدعائها من Server Components
 * مباشرة (مثل تنسيق رابط ليبدو كزر دون تحويله لمكوّن عميل).
 *
 * Deliberately split from button.tsx — button.tsx carries a "use
 * client" directive (since Button itself is interactive), which makes
 * every export from it, including a plain function like
 * buttonVariants, "client-only" and uncallable from Server Components
 * (discovered as an actual runtime error while testing this page).
 * Splitting it out here, in a file with no "use client", allows it to
 * be called directly from Server Components (e.g. styling a Link to
 * look like a button without turning it into a client component).
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        outline: "border border-border bg-transparent hover:bg-secondary",
        ghost: "bg-transparent hover:bg-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
