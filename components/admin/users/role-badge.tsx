import { Badge } from "@/components/ui/badge";
import type { Role } from "@/config/permissions";
import { getRoleBadgeVariant } from "@/lib/mock/admin-users";

/**
 * RoleBadge — مُعامَل بنوع `Role` المستورَد من `config/permissions.ts`
 * حرفيًا (لا نسخة محلية). إن أُضيف أو حُذف دور هناك، سيفشل التحقق من
 * الأنواع هنا فورًا (Type Error) إلى أن يُحدَّث `getRoleBadgeVariant` —
 * حارس تجميع (Compile-time Guard) يمنع الانحراف بصمت.
 *
 * RoleBadge — parameterized by the `Role` type imported from
 * `config/permissions.ts` verbatim (no local copy). If a role is added
 * or removed there, type-checking here fails immediately (a compile
 * error) until `getRoleBadgeVariant` is updated — a compile-time guard
 * preventing silent drift.
 */
export function RoleBadge({ role, label }: { role: Role; label: string }) {
  return <Badge variant={getRoleBadgeVariant(role)}>{label}</Badge>;
}
