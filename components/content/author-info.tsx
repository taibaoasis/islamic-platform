import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ContentAuthor } from "@/lib/mock/content";

/** AuthorInfo — عام لكل الأنواع (مؤلف مقالة، مُصدِر فتوى، مُصنِّف كتاب، معلّم درس، محرِّر خبر). Generic across all kinds. */
export function AuthorInfo({ author, size = "md" }: { author: ContentAuthor; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className={size === "sm" ? "size-8" : "size-10"}>
        <AvatarFallback>{author.initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-foreground">{author.name}</p>
        <p className="text-xs text-muted-foreground">{author.role}</p>
      </div>
    </div>
  );
}
