# SECURITY_ROUTE_MATRIX.md
### Phase 0.1 — مصفوفة المسارات

**كل صف مُتحقَّق منه بقراءة الملف الفعلي وموقع الحارس بداخله، لا افتراضًا.**

## المسارات العامة (بلا حراسة — بالتصميم، صحيح)

| المسار | عام/محمي | ملاحظة |
|---|---|---|
| `/`, `/[locale]` | عام | الصفحة الرئيسية |
| `/[locale]/quran/**`, `/[locale]/hadith/**`, `/[locale]/articles/**`, `/[locale]/courses/**`, `/[locale]/search`, `/[locale]/dashboard` | عام | محتوى عام بالتصميم |
| `/api/auth/[...nextauth]` | عام (بالضرورة) | نقطة NextAuth القياسية — لا يمكن حمايتها هي نفسها (تُدير تسجيل الدخول) |
| `/api/health` | عام | فحص جاهزية — لا بيانات حسّاسة، إرجاع حالة اتصال فقط |

## المسارات المحمية — البوابة العامة فقط (Layer A)

**الحارس:** `requireAdminAccess()` في `app/[locale]/admin/layout.tsx` — يُطبَّق تلقائيًا على كل ما يلي عبر توارث Layout (لا حاجة لفحص مستقل بكل ملف).

| المسار | الصلاحية المطلوبة | سلوك غير المصادَق | سلوك بلا صلاحية كافية |
|---|---|---|---|
| `/[locale]/admin` | أي صلاحية من `ADMIN_BASELINE_PERMISSIONS` | توجيه → `/api/auth/signin` | توجيه → `/${locale}` |
| `/[locale]/admin/quran` | نفس أعلاه | نفس أعلاه | نفس أعلاه |
| `/[locale]/admin/hadith` | نفس أعلاه | نفس أعلاه | نفس أعلاه |
| `/[locale]/admin/content/[contentType]` | نفس أعلاه | نفس أعلاه | نفس أعلاه |
| `/[locale]/admin/editor/[contentType]/[slug]` | نفس أعلاه | نفس أعلاه | نفس أعلاه |
| `/[locale]/admin/media` | نفس أعلاه | نفس أعلاه | نفس أعلاه |
| `/[locale]/admin/localization`, `/languages`, `/queue`, `/editor/[id]` | نفس أعلاه | نفس أعلاه | نفس أعلاه |
| `/[locale]/admin/reports`, `/content`, `/users`, `/localization`, `/system` | نفس أعلاه | نفس أعلاه | نفس أعلاه |

## المسارات المحمية — بوابة إضافية أضيق

| المسار | الصلاحية الإضافية | موقع الحارس |
|---|---|---|
| `/[locale]/admin/settings` (وكل السبعة أقسام الفرعية) | `settings:manage` (فوق البوابة العامة) | `app/[locale]/admin/settings/layout.tsx` (مُشترَك لكل الأقسام السبعة تلقائيًا) |
| `/[locale]/admin/users` | `user:manage` (فوق البوابة العامة) | داخل `page.tsx` مباشرة |
| `/[locale]/admin/users/[userId]` | `user:manage` | داخل `page.tsx` مباشرة |
| `/[locale]/admin/roles` | `user:manage` | داخل `page.tsx` مباشرة |
| `/[locale]/admin/permissions` | `user:manage` | داخل `page.tsx` مباشرة |
| `/[locale]/admin/activity` | `user:manage` | داخل `page.tsx` مباشرة |

**لماذا 5 ملفات منفصلة لا Layout مشترَك؟** هذه الصفحات الخمس أشقاء مباشرون تحت `admin/` (لا مجلد فرعي مشترَك بينها مثل `settings/`) — إنشاء Layout جديد لها يعني إعادة تنظيم شجرة المسارات (منع صراحة إلا لحل حلقة توجيه، وهو غير مطبَّق هنا). الفحص المباشر لكل ملف أكثر جراحة (تعديلات أقل، مخاطرة أقل) بنفس النتيجة الأمنية بالضبط.

## من يجتاز أي بوابة؟ (حسب `config/permissions.ts`، مصدر واحد لا تكرار)

| الدور | يجتاز البوابة العامة؟ | يجتاز `settings:manage`؟ | يجتاز `user:manage`؟ |
|---|---|---|---|
| `VISITOR` | ❌ | ❌ | ❌ |
| `MEMBER` | ❌ | ❌ | ❌ |
| `STUDENT` | ❌ | ❌ | ❌ |
| `TEACHER` | ✅ (`content:create`) | ❌ | ❌ |
| `SCHOLAR_REVIEWER` | ✅ (`content:edit`/`content:publish`) | ❌ | ❌ |
| `COMMUNITY_MODERATOR` | ✅ (`community:moderate`) | ❌ | ❌ |
| `ADMIN` | ✅ (يملك كل الصلاحيات) | ✅ | ✅ |

**ملاحظة صريحة:** هذا يعني عمليًا أن `/admin/settings` و`/admin/users` وأقسامها **حكر فعلي على `ADMIN` وحده حاليًا** — لا دور آخر يملك `settings:manage` أو `user:manage` في مصفوفة `rolePermissions` الحالية. هذا **ليس قيدًا فرضته هذه الوحدة** — هو انعكاس مباشر لمصفوفة الصلاحيات الموجودة أصلاً في `config/permissions.ts` (لم تُعدَّل).

## الطبقة الثانية — Mutations (Layer B)

| العملية | الحالة |
|---|---|
| أي Server Action/Route Handler/API حقيقي في لوحة الإدارة | **لا يوجد حاليًا — صفر عمليات حقيقية** (`SECURITY_BASELINE.md §4`) |
| النمط الإلزامي لأي عملية مستقبلية | موثَّق في `lib/actions/example.action.ts` — `requirePermission()` كأول سطر إلزامي |
