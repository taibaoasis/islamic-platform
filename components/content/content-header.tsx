import { CategoryBadge } from "@/components/content/category-badge";
import { TopicBadge } from "@/components/content/topic-badge";
import { AuthorInfo } from "@/components/content/author-info";
import { ContentMeta } from "@/components/content/content-meta";
import type { ContentItem } from "@/lib/mock/content";

export function ContentHeader({ item }: { item: ContentItem }) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge category={item.category} />
        <TopicBadge topics={item.topics} />
      </div>
      <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">{item.title}</h1>
      <p className="mt-3 text-base text-muted-foreground">{item.excerpt}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <AuthorInfo author={item.author} />
        <ContentMeta item={item} />
      </div>
    </header>
  );
}
