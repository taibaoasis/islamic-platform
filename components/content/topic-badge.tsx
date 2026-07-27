import { Badge } from "@/components/ui/badge";

export function TopicBadge({ topics }: { topics: string[] }) {
  return (
    <>
      {topics.map((topic) => (
        <Badge key={topic} variant="info">
          {topic}
        </Badge>
      ))}
    </>
  );
}
