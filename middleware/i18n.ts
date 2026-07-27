import createIntlMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/** يتعرّف على لغة الزائر ويعيد التوجيه إلى /{locale}/... عند الحاجة. */
export const intlMiddleware = createIntlMiddleware(routing);
