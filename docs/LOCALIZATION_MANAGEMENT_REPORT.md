# LOCALIZATION_MANAGEMENT_REPORT.md
### تقرير إدارة الترجمات — Phase 11, Module 6

**الحالة العامة: ✅ مكتمل ومُتحقَّق منه فعليًا (Lint + TypeCheck + Build + تشغيل خادم حقيقي عبر 8 حالات).**
**لا Prisma، لا API، لا حفظ حقيقي، لا ترجمة آلية — كل شيء مُشتَقّ من بيانات موجودة فعليًا.**

---

## 1. الصفحات المنفَّذة

| الصفحة | المسار |
|---|---|
| لوحة إدارة الترجمات | `/admin/localization` |
| إدارة اللغات | `/admin/localization/languages` |
| قائمة انتظار الترجمة | `/admin/localization/queue` |
| محرر الترجمة | `/admin/localization/editor/[id]` |

تم تصحيح روابط الشريط الجانبي (`/admin/languages`, `/admin/translations` من Module 1) لتشير إلى المسارات الفعلية أعلاه.

---

## 2. معيار النجاح: لا نموذج بيانات موازٍ — مُحقَّق ومُتحقَّق منه فعليًا

**`lib/mock/localization.ts` لا يحتوي أي مصفوفة "ترجمات" مستقلة.** كل دالة فيه تشتق من مصادر موجودة فعليًا:

| الوظيفة | تُشتَقّ من |
|---|---|
| `getLanguageStats` (نسبة الاكتمال، عدد العناصر، غير المترجَم) | حقل `language`+`status` من `mockQuranContentRows` (Module 2.1) + `mockHadithContentRows` (Module 2.2) + `mockAdminContentRows` (Module 2.3) مباشرة |
| `buildTranslationQueue` (قائمة الانتظار) | الصفوف الثلاثة نفسها، مُصفَّاة بـ`status !== PUBLISHED/ARCHIVED` |
| `originalText` في كل عنصر انتظار | `getMockVerses()` (`lib/mock/quran.ts`، Phase 9.3)، `matnExcerpt` (`lib/mock/admin-hadith.ts`، Module 2.2)، `excerpt` من `mockContentItems` (`lib/mock/content.ts`، Phase 9.5) — **لا نص جديد يُختلَق** |
| `supportedLanguages[].isActive` | `locales` من `config/site.ts` (next-intl الفعلي) — لا علم Mock مستقل |
| سجل النشاط لكل مستخدم في الملفات الشخصية (Module 5) | امتداد `lib/mock/admin.ts` (Module 1) — نفس المبدأ سابقًا |

**التحقق الفعلي:** طلبت صفحة المحرر لعنصر قرآني حقيقي وتأكَّدت أن "النص الأصلي" المعروض هو **نفس نص Placeholder** المُولَّد بواسطة `getMockVerses()` من Phase 9.3 حرفيًا — لا نص جديد كُتب لهذه الوحدة.

---

## 3. المكوّنات الجديدة

| المكوّن | الغرض |
|---|---|
| `CompletionCard` | بطاقة اكتمال لغة — **قرار معماري:** يستخدم `Progress` (Phase 8) مباشرة **لا `ProgressIndicator`** (Academy، Phase 10) رغم التشابه الظاهري، لأن نصوص الأخير مربوطة بمساحة اسم `academy.progress` وتقول "دروس" حرفيًا — إعادة استخدامه كانت ستُنتج تسمية مضلِّلة (انظر §5) |
| `MissingFieldsList` | عناصر ناقصة لكل لغة (حالة Draft) |
| `LanguagesTable` | جدول اللغات — يعيد استخدام `DataTable` حتى لخمس لغات فقط، اتساقًا |
| `TranslationQueueTable` | جدول قائمة الانتظار — سابع استهلاك مباشر لـ`DataTable`/`FilterCheckboxGroup` |
| `TranslationEditorView` | المحرر جنبًا إلى جنب |

---

## 4. المكوّنات المُعاد استخدامها

| المكوّن | من | ملاحظة |
|---|---|---|
| `DataTable`, `DataTableToolbar`, `DataTableSkeleton`, `DataTableEmpty` | Module 2.1 | صفر تعديل — سابع استهلاك مباشر |
| `FilterCheckboxGroup` | Module 2.2 | صفر تعديل — سابع استهلاك مباشر (٤ مجموعات فلترة في صفحة الانتظار وحدها) |
| `StatusBadge` | Module 2.1 | **استُخدِم هنا فعليًا لا رُفِض** — على عكس Module 4/5، حالة سجلات الترجمة تتبع فعليًا نفس النمط A الذي يمثِّله `StatusBadge`؛ إعادة استخدام صحيحة لا قسرية |
| `Pagination`, `Card`, `Badge`, `Textarea`, `Label`, `Button`, `Breadcrumb` | Phase 8 | صفر تعديل |
| `contentLifecycleStatuses` | Module 2.2 | لفلتر الحالة في قائمة الانتظار |

**~90% من الواجهة مبنية من مكوّنات موجودة مسبقًا.**

---

## 5. قرار معماري مهم: رفض إعادة استخدام `ProgressIndicator`

بخلاف `StatusBadge` (استُخدِم هنا بصحة تامة، §4)، `ProgressIndicator` (Academy، Phase 10) **رُفِض عمدًا** رغم كونه "شريط تقدُّم بنسبة مئوية" مطابقًا ظاهريًا لحاجة `CompletionCard` — لأن نصوصه المُترجَمة (`academy.progress.lessonsCompleted` = "{completed} من {total} دروس") مرتبطة دلاليًا بسياق الدروس التعليمية تحديدًا. استُخدِم `Progress` (Phase 8، المكوّن الأدنى مستوى) مباشرة بدلاً منه. **هذا القرار الثالث من نوعه على التوالي** (بعد `StatusBadge` في Module 4 وModule 5): إعادة الاستخدام الصحيحة تعني أحيانًا اختيار المستوى الأدنى العام، لا الأعلى المُخصَّص، حتى لو بدا "جاهزًا للاستخدام" للوهلة الأولى.

---

## 6. خطأ حقيقي اكتُشف وأُصلِح أثناء التحقق الفعلي

عند طلب `/admin/localization/queue` فعليًا، ظهر خطأ خادم `500`: `RangeError: Invalid time value`. السبب: صفوف الحديث بحالة `DRAFT` تحمل `lastReviewedAt: null`، والكود استخدم `row.lastReviewedAt ?? row.id` كقيمة احتياطية — لكن `row.id` نص مثل `"hc-bukhari-1-ar"` وليس تاريخًا صالحًا، فانهار `new Date(...)` عند التنسيق. **لم يكتشفه `tsc` ولا `eslint`** (لا خطأ نوع، السلسلتان كلتاهما `string`) — اكتُشف فقط بالتشغيل الفعلي وقراءة سجل الخادم. **الإصلاح:** استبدال القيمة الاحتياطية بتاريخ صالح ثابت. تم التحقق من زوال الخطأ بإعادة طلب الصفحة (٣ صفحات مختلفة، بما فيها محرر لعنصر حديث فعلي).

---

## 7. نتائج التحقق

| الفحص | النتيجة |
|---|---|
| `npm run lint` | ✅ صفر أخطاء |
| `npx tsc --noEmit` | ✅ صفر أخطاء جديدة **من أول تشغيل** |
| `npm run build` | ✅ "Compiled successfully" |
| `/ar/admin/localization` | ✅ `200` — كل اللغات الخمس، آخر الترجمات/المراجعات مؤكَّدة |
| `/ar/admin/localization/languages` | ✅ `200` — RTL/LTR، نشط/غير نشط مؤكَّدة |
| `/ar/admin/localization/queue` | ✅ `200` **بعد الإصلاح** (كان `500` قبله) |
| `/ar/admin/localization/editor/[id]` (قرآن) | ✅ `200` — النص الأصلي مطابق لـ`getMockVerses()` الحقيقي |
| `/ar/admin/localization/editor/[id]` (حديث) | ✅ `200` |
| `/ar/admin/localization/editor/does-not-exist` | ✅ `404` صحيح |
| `/en/admin/localization` | ✅ `200` |

---

## 8. الخلاصة

نظام إدارة الترجمة لا يحمل أي نموذج بيانات مستقل — كل رقم وكل نص فيه مُشتَقّ حيًا من الحقول الموجودة فعليًا في وحدات Phase 9.3/2.1/2.2/2.3، مع تصحيح فعلي لخطأ زمني حقيقي اكتُشف بالتحقق لا بالفحص الساكن. إضافة لغة سادسة تعني إدخالاً واحدًا في `allLanguageCodes`/`languageNames` فقط. بانتظار موافقة صريحة قبل الوحدتين الأخيرتين (الإعدادات والتقارير).
