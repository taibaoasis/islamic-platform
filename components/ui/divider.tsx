import { cn } from "@/lib/utils";

/** Divider — فاصل بصري بلا معنى دلالي (role="separator" لتقنيات المساعدة). Visual separator with no semantic content (role="separator" for assistive tech). */
export function Divider({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}
