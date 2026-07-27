import { getTranslations } from "next-intl/server";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Instructor } from "@/lib/mock/academy";

export async function InstructorCard({ instructor }: { instructor: Instructor }) {
  const t = await getTranslations("academy.course");

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold text-foreground">{t("instructorTitle")}</p>
      <div className="flex items-start gap-3">
        <Avatar className="size-12">
          <AvatarFallback>{instructor.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{instructor.name}</p>
          <p className="text-xs text-muted-foreground">{instructor.role}</p>
          <p className="mt-2 text-sm text-muted-foreground">{instructor.bio}</p>
        </div>
      </div>
    </Card>
  );
}
