import { Badge } from "@/components/ui/badge";

/** CategoryBadge — عام لكل أنواع المحتوى الخمسة، لا منطق خاص بنوع واحد. Generic across all five content kinds, no type-specific logic. */
export function CategoryBadge({ category }: { category: string }) {
  return <Badge variant="primary">{category}</Badge>;
}
