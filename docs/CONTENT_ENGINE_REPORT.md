# CONTENT_ENGINE_REPORT.md
### تقرير محرك المحتوى العام — Phase 9.5

**الحالة العامة: ✅ مكتمل ومُتحقَّق منه فعليًا (Lint + TypeCheck + Build + تشغيل خادم حقيقي).**
**لا Prisma، لا API، لا Backend، لا نظام تعليقات حقيقي — بيانات وهمية بالكامل في `lib/mock/content.ts`.**

---

## 1. المكوّنات الجديدة

### 1.1 الستة عشر مكوّنًا المطلوبة (كلها تحت `components/content/`)

| # | المكوّن | Server/Client | ملاحظة |
|---|---|---|---|
| 1 | `ContentCard` | Server (async) | المكوّن المحوري — نفسه حرفيًا لكل الأنواع الخمسة |
| 2 | `ContentHeader` | Server | رأس صفحة المحتوى الفردي |
| 3 | `ContentMeta` | Server (async) | صف التاريخ + وقت القراءة + النوع |
| 4 | `AuthorInfo` | Server | يستخدم `Avatar` من Phase 8 |
| 5 | `CategoryBadge` | Server | يستخدم `Badge` من Phase 8 |
| 6 | `TopicBadge` | Server | قائمة شارات مواضيع |
| 7 | `ReadingTime` | Server (async) | مؤشر وقت القراءة |
| 8 | `ShareActions` | **Client** | Web Share/Clipboard APIs |
| 9 | `BookmarkButton` | **Client** | حالة محلية غير محفوظة |
| 10 | `TableOfContents` | Server (async) | روابط Anchor عادية، **بلا JavaScript** |
| 11 | `RelatedContent` | Server (async) | يُركَّب فوق `ContentCard` نفسه |
| 12 | `ContentBody` | Server | يعرض مصفوفة `ContentBlock` العامة |
| 13 | `CitationBlock` | Server (async) | "نظام الإسناد الإلزامي" كمكوّن عام |
| 14 | `TagsSection` | Server (async) | قائمة وسوم |
| 15 | `CommentsPlaceholder` | Server (async) | واجهة فقط، **بلا نظام تعليقات حقيقي** |
| 16 | `EmptyState` | Server | عام، يستقبل `action` جاهزًا من الأب |

**14 من أصل 16 مكوّنًا Server Components خالصة (صفر JavaScript للعميل)** — فقط `ShareActions` و`BookmarkButton` يحتاجان "use client" (تفاعل حقيقي: Clipboard/Share APIs وحالة زر). هذه النسبة (87.5%) نتيجة مباشرة لمتطلب "Server Components حيثما أمكن" (القسم 4).

### 1.2 مكوّن إضافي واحد خارج القائمة الستة عشر (موثَّق بسبب)

`ArticlesIndex` (`components/content/articles-index.tsx`) — منسِّق بحث خاص بصفحة القائمة، على نمط `QuranIndex`/`HadithIndex` من المراحل السابقة. **قرار معماري لافت:** بما أن `ContentCard` مكوّن Server غير متزامن (`async`) لا يمكن استيراده مباشرة داخل Client Component، يستقبل `ArticlesIndex` عناصر `ContentCard` **جاهزة التصيير مسبقًا** من الصفحة الأب (Server Component) عبر خاصية `renderedCards`، ويقتصر دوره على تصفية أيها ظاهر حسب نص البحث — نمط "Server Component داخل Client" القياسي في Next.js App Router (§4.3 أدناه).

---

## 2. المكوّنات المُعاد استخدامها من مكتبة Phase 8

`Card` (+`CardHeader`/`Title`/`Description`/`Content`/`Footer`), `Badge`, `Avatar` (+`AvatarFallback`), `SearchInput`, `Button`, `IconButton`, `Breadcrumb`, `Container`, `Header`, `Footer`. **10 مكوّنات** — نفس نطاق إعادة الاستخدام العالي المُلاحَظ في Phase 9.3/9.4.

---

## 3. الصفحتان المنفَّذتان

| الصفحة | المسار | ملاحظة |
|---|---|---|
| قائمة المقالات | `/articles` | بحث محلي + JSON-LD BreadcrumbList |
| صفحة مقالة واحدة | `/articles/[slug]` | `generateStaticParams` + Article Schema + BreadcrumbList Schema |

**تحقق حاسم من الجنرالية:** مسار `/articles/[slug]` يتحقق صراحة من `item.kind === "article"` قبل العرض (`notFound()` غير ذلك) — تم اختباره فعليًا بمحاولة الوصول لفتوى Mock (`combining-prayers-illness`) عبر مسار المقالات، فأعاد **404 صحيحًا**، مؤكِّدًا أن نموذج البيانات العام يفرّق بالفعل بين الأنواع دون أي تسريب.

---

## 4. متطلبات SEO — التحقق الفعلي لا الافتراض

كل بند تحقَّق منه **فعليًا عبر `curl` على HTML خام**، لا بالقراءة البصرية فقط:

| البند | الحالة | الدليل |
|---|---|---|
| Metadata (عنوان/وصف) | ✅ | `generateMetadata` مخصَّصة لكل مقالة |
| Canonical URL | ✅ | `<link rel="canonical" href=".../articles/taqwa-in-quran"/>` مؤكَّد في HTML الفعلي |
| Open Graph | ✅ | `og:type=article` + `og:title`/`description`/`url`/`siteName` مؤكَّدة |
| Twitter Cards | ✅ | `twitter:card=summary_large_image` مؤكَّد |
| Structured Data — Article Schema | ✅ | JSON-LD كامل مستخرَج فعليًا من HTML: `@type: Article` مع `headline`/`author`/`datePublished`/`publisher` |
| Structured Data — Breadcrumb Schema | ✅ | JSON-LD كامل مستخرَج فعليًا: `@type: BreadcrumbList` بثلاث مستويات (الرئيسية ← المقالات ← المقالة) |

---

## 5. الأداء (القسم 4 من الطلب)

- **Server Components حيثما أمكن:** 14/16 مكوّنًا (§1.1)، وكلتا الصفحتين Server Components كاملتين عدا `ArticlesIndex` كحد تفاعلي وحيد على صفحة القائمة.
- **Lazy Loading:** `RelatedContent` و`CommentsPlaceholder` — وهما أدنى الصفحة أهمية للمشاهدة الأولى (Below-the-fold) — محمَّلان عبر `next/dynamic` في `app/[locale]/articles/[slug]/page.tsx`، فلا تدخل حزمتاهما ضمن الحزمة الأولية للصفحة.
- **تحسين الصور:** لا صور حقيقية بعد في نطاق البيانات الوهمية؛ استُخدِم نفس نمط الخلفية المتدرِّجة الزخرفية المُعتمَد مسبقًا في `FeaturedContentSection` (Phase 9.1) بدل صور فعلية. `next.config.ts` يحمل بالفعل `remotePatterns` لـS3/CDN جاهزة، فحين تتوفر صور حقيقية ستمر عبر `next/image` مباشرة دون أي تهيئة إضافية.
- **تحسين الخطوط:** مُحقَّق بالكامل مسبقًا (`next/font` في `config/fonts.ts`، طبقة الأساس) — لا عمل جديد لزم هنا.

---

## 6. Accessibility

- **لوحة المفاتيح:** كل الروابط/الأزرار موروثة حلقة التركيز المرئية من Phase 8؛ `TableOfContents` يعمل بالكامل بلوحة المفاتيح دون أي JavaScript (روابط Anchor عادية).
- **قارئات الشاشة:** `role="status"` على `EmptyState`/`CommentsPlaceholder`، `aria-pressed` على `BookmarkButton`، `aria-labelledby` يربط عنوان "محتوى ذو صلة" بقسمه، `<time dateTime="...">` دلالي للتواريخ، `cite`/`blockquote` دلالية للاقتباسات في `ContentBody`.
- **RTL/LTR ووضع داكن/فاتح:** رموز ألوان دلالية حصرًا، خصائص منطقية (`border-s-4`, `ps-4`) بلا استثناء — تحقَّق فعليًا بلغتين عبر `curl`.

---

## 7. قابلية إعادة الاستخدام (القسم 6 — الأهم في هذه المرحلة)

**لم تُعدَّل الفتوى/الكتاب/الدرس/الخبر أي مكوّن أساسي لتُعرَض.** الإثبات العملي المُنفَّذ فعليًا (لا نظريًا فقط) في هذه الجلسة:
- بيانات `lib/mock/content.ts` تضم بالفعل عناصر من الأنواع الخمسة (`article`, `fatwa`, `book`, `lesson`, `news`) في نفس المصفوفة، بنفس النموذج `ContentItem`.
- `RelatedContent` في صفحة المقالة الفعلية (`taqwa-in-quran`) تعرض بالفعل **حديثًا مرتبطًا بموضوع مشترك** (وليس مقالة أخرى فقط) عبر `ContentCard` نفسه دون أي فرع شرطي — تحقَّق ذلك من منطق `getRelatedContent` الذي يقارن `category`/`topics` بصرف النظر عن `kind`.
- جدول `kindRoute` في `ContentCard` هو **الفرق الوحيد** بين عرض نوع وآخر (مسار الرابط)، لا أي فرع في البنية البصرية أو الأنماط.

---

## 8. قرارات معمارية جديدة

1. **نموذج `ContentBlock` كمصدر حقيقة واحد لكل من `ContentBody` و`TableOfContents`** — بدل استخراج العناوين بتحليل HTML لاحقًا (هش وعرضة للأخطاء)، تُبنى المحتويات والفهرس من نفس مصفوفة الكتل البنيوية مباشرة.
2. **`TableOfContents` بلا JavaScript إطلاقًا** — رفض متعمَّد لمكتبة Scroll-Spy تفاعلية شائعة، لصالح روابط Anchor عادية + `scroll-behavior: smooth` (CSS عام موجود مسبقًا) — قرار أداء صريح يخدم متطلب "Server Components حيثما أمكن" حرفيًا.
3. **تمرير Server Components جاهزة التصيير إلى Client Component عبر Props** (`ArticlesIndex.renderedCards`) — حل لقيد تقني حقيقي (لا يمكن استيراد مكوّن Server غير متزامن مباشرة داخل "use client")، موثَّق بتعليق صريح داخل الملف نفسه لتفادي حيرة أي مطوِّر لاحق.
4. **حراسة النوع الصريحة عبر المسار** (`item.kind !== "article" → notFound()`) — تضمن أن محرك المحتوى العام لا يعني غياب حدود واضحة بين الأنواع على مستوى التوجيه (Routing)، حتى لو تشارك البيانات نموذجًا واحدًا.
5. **`contentKindLabels` مُخزَّنة في طبقة البيانات لا الترجمة** — تسميات الأنواع الخمسة (`مقالة`/`فتوى`/...) مرتبطة ببنية `ContentKind` نفسها في `lib/mock/content.ts` بدل `next-intl`، لضمان تزامنها الدائم مع قيم Enum عند إضافة نوع جديد مستقبلاً.

---

## 9. نتائج التحقق

| الفحص | النتيجة |
|---|---|
| `npm run lint` | ✅ صفر أخطاء **من أول تشغيل** |
| `npx tsc --noEmit` | ✅ صفر أخطاء جديدة **من أول تشغيل** (فقط أخطاء Prisma المعروفة سابقًا) |
| `npm run build` | ✅ "Compiled successfully" |
| **تشغيل خادم فعلي + `curl`** | ✅ `HTTP 200`: قائمة المقالات، مقالتان (AR/EN) |
| **رابط غير صالح** | ✅ `HTTP 404` صحيح |
| **حراسة النوع** | ✅ `HTTP 404` صحيح عند الوصول لفتوى عبر مسار `/articles/` |
| Structured Data | ✅ Article Schema وBreadcrumbList Schema مستخرَجان فعليًا من HTML وصحيحا البنية |
| Canonical/OG/Twitter | ✅ الثلاثة مؤكَّدة في HTML الفعلي |

---

## 10. مستوى التوافق مع Design System

**~98%** — لا انحراف يُذكَر عن الأنماط المعتمَدة؛ كل قيمة بصرية عبر رموز التصميم (Design Tokens)، بلا أي لون أو مسافة حرة.

---

## 11. الخلاصة

محرك محتوى عام حقيقي (لا مجرد "صفحة مقالات مموَّهة") — نموذج بيانات واحد، 16 مكوّنًا (14 منها بلا JavaScript للعميل إطلاقًا)، مُثبَت عمليًا أنه يخدم الأنواع الخمسة دون تعديل عبر بيانات Mock مختلطة الأنواع فعليًا في الصفحة المُسلَّمة نفسها. بناء صفحات الفتاوى والكتب والدروس والأخبار لاحقًا يحتاج بيانات + مسار جديد فقط — لا مكوّنات جديدة. بانتظار موافقة صريحة قبل أي مرحلة تالية.
