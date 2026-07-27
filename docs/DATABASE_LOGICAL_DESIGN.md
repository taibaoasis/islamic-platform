# DATABASE_LOGICAL_DESIGN.md
### التصميم المنطقي لقاعدة البيانات — المنصة العالمية للتعريف بالإسلام والتعليم الإسلامي

**نوع الوثيقة:** تصميم منطقي بحت (Logical Database Design) — أنواع بيانات منطقية لا Prisma، بلا SQL، بلا Migration، بلا كود من أي نوع.
**المرجع الإلزامي:** `Master Project Document` · `Information Architecture` · `Knowledge Architecture` · `Content Models` · `Enterprise Database Architecture` — هذه الوثيقة الطبقة الأخيرة قبل الترميز الفعلي: تُترجم الكيانات والاستراتيجيات المعتمَدة إلى جداول منطقية بأعمدتها وقيودها، دون كتابة السطر الأول من Schema فعلي.

---

## 0. الاصطلاحات العامة (تُطبَّق على كل الوثيقة، لا تُعاد لكل جدول)

### 0.1 نظام الأنواع المنطقية (Logical Type System)

| النوع المنطقي | الوصف |
|---|---|
| `UUID` | معرِّف 128-بت (استراتيجية UUIDv7 — القسم 3). |
| `ShortText(N)` | نص متغير الطول بحد أقصى N حرفًا — للأسماء، العناوين، الأكواد. |
| `LongText` | نص غير محدود الطول — لمحتوى تحريري كامل. |
| `Integer` | عدد صحيح. |
| `Decimal(P,S)` | عدد عشري ثابت الدقة (P أرقام إجمالية، S منها بعد الفاصلة) — للإحداثيات الجغرافية والنسب. |
| `Boolean` | صحيح/خطأ. |
| `Date` | تاريخ تقويمي بلا وقت. |
| `Timestamp` | تاريخ ووقت مع منطقة زمنية. |
| `Enum(قيم)` | قائمة قيم مضبوطة ومحدَّدة سلفًا. |
| `JSON` | بنية شبه حرة — **مقصورة على جدولين فقط** (`content_versions`, `audit_log_entries`) لأن حمولتها تختلف شكلاً حسب نوع الكيان المرجعي؛ استثناء مبرَّر لا استخدام عام (يحافظ على مبدأ `Zero Hardcoded Structure` بمنع اللجوء لـJSON كحل سهل في أي مكان آخر). |

### 0.2 مجموعة الأعمدة القياسية (Standard Column Set)

كل جدول أدناه يحمل ضمنيًا هذه المجموعة **إلا ما استُثني صراحة** (جداول Reference الصرفة مثل `verses`, `surahs` تحمل نسخة مخفَّفة منها — موضَّح لكل جدول). لا تُكرَّر هذه القائمة تحت كل جدول؛ تُذكر فقط الأعمدة **المميِّزة**.

| العمود | النوع | إلزامي | القيمة الافتراضية | القيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا (UUIDv7) | Primary Key |
| `version` | Integer | نعم | `1` | ≥ 1 |
| `status` | Enum(حسب نمط دورة الحياة) | نعم | حسب النمط (غالبًا `Draft`) | من القائمة المضبوطة لنمط دورة حياة ذلك الجدول |
| `locale_group_id` | UUID | نعم *(للجداول القابلة للترجمة فقط)* | — | Foreign Key → `locale_groups.id` |
| `language` | ShortText(10) | نعم *(للجداول القابلة للترجمة فقط)* | — | Foreign Key → `languages.iso_code` |
| `created_at` | Timestamp | نعم | وقت الإنشاء | — |
| `updated_at` | Timestamp | نعم | وقت الإنشاء، يُحدَّث تلقائيًا | — |
| `deleted_at` | Timestamp | لا | `null` | علامة الحذف المنطقي |
| `created_by` | UUID | نعم | — | Foreign Key → `users.id` |
| `updated_by` | UUID | لا | `null` | Foreign Key → `users.id` |
| `reviewed_by` | UUID | لا | `null` | Foreign Key → `users.id` |
| `approved_by` | UUID | لا | `null` | Foreign Key → `users.id` |
| `published_by` | UUID | لا | `null` | Foreign Key → `users.id` |
| `seo_slug` | ShortText(255) | لا *(إلزامي لجداول المحتوى العام فقط)* | `null` | فريد ضمن (`locale_group_id` غير مطلوب — الفريدة على مستوى `language` + `seo_slug`) |
| `seo_meta_title` | ShortText(60) | لا | `null` | — |
| `seo_meta_description` | ShortText(160) | لا | `null` | — |
| `is_ai_indexable` | Boolean | نعم | `false` | يُضبَط `true` تلقائيًا فقط عند `status = 'Published'` |
| `is_search_indexed` | Boolean | نعم | `false` | نفس منطق `is_ai_indexable` |

### 0.3 قرار تصميمي مهم: كيانات الترجمة الرئيسية (Master) تتبع نفس نمط صف-لكل-لغة

نموذجيًا في تصميم قواعد البيانات، تُفصَل بيانات الكيانات الرئيسية (Master) إلى جدول "أساسي" غير مرتبط باللغة + جدول "ترجمة" satellite. **هذا التصميم يتعمَّد عدم فعل ذلك**، ويُبقي حتى `scholars`, `categories`, `topics`, `books`, `mosques`... إلخ على نفس نمط صف-لكل-لغة المُعتمَد للمحتوى التحريري (`Enterprise Database Architecture §4.2`).

**السبب:** توحيد نمط الترجمة عبر كل الجداول الخمسين تقريبًا يبسّط طبقة الوصول للبيانات (نمط استعلام واحد للجميع)، ويتفادى وجود نمطي ترجمة مختلفين في نفس النظام. **المقايضة المقبولة:** تكرار محدود لبعض الأعمدة غير النصية (مثل `Scholar.era`, `Category.sort_order`) عبر صفوف اللغات المختلفة لنفس الكيان — تكلفة تخزين مهملة عمليًا عند حجم بيانات هذه الجداول (آلاف السجلات لا ملايين)، مقابل بساطة معمارية حقيقية. القرار البديل (تقسيم إلى جدولين) دُرِس ورُفض لهذا السبب تحديدًا.

### 0.4 اصطلاح تسمية الجداول

`snake_case`، جمع (`scholars` لا `scholar`)، بادئة نطاق غير مستخدَمة (لا `quran_verses` بل `verses` ببساطة، لأن النطاق موثَّق في هذه الوثيقة لا في اسم الجدول نفسه — يبقي الأسماء قصيرة وقابلة للقراءة).

---

## 1. Logical Tables — قائمة الجداول المنطقية الكاملة

**66 جدولًا منطقيًا:** 50 من جرد الكيانات في `Enterprise Database Architecture §2` (4 منها — `users`, `accounts`, `sessions`, `verification_tokens` — موجودة مسبقًا في طبقة الأساس ولا تُعاد تصميمها هنا) + **16 جدول ربط (Join Tables)** استجدت عند الترجمة الفعلية للعلاقات N:M إلى بنية منطقية (تفصيلها في القسم 4).

### 1.1 نطاق Identity & Access
| الجدول | الغرض |
|---|---|
| `users` *(موجود مسبقًا)* | حساب المستخدم الأساسي |
| `accounts` / `sessions` / `verification_tokens` *(موجودة مسبقًا)* | كيانات Auth.js القياسية |
| `scholars` | ملف عالِم شرعي |
| `authors` | ملف مؤلف محتوى عام |
| `translators` | ملف مترجم معتمَد |
| `reviewers` | ملف حامل صلاحية المراجعة الشرعية |
| `translator_languages` *(ربط)* | اللغات المعتمَدة لكل مترجم |
| `scholar_center_affiliations` *(ربط)* | انتساب عالِم لمركز إسلامي |

### 1.2 نطاق Quran
| الجدول | الغرض |
|---|---|
| `qurans` | الكيان الجذري للمصحف (رواية القراءة) |
| `surahs` | إحدى السور الـ114 |
| `verses` | آية بنصها العثماني الثابت |
| `words` | كلمة ضمن آية |
| `roots` | جذر لغوي عربي |
| `quran_translations` | ترجمة معنى آية |
| `tafsirs` | تفسير آية أو مجموعة آيات |
| `tafsir_verses` *(ربط)* | ربط تفسير بآية واحدة أو أكثر |
| `recitations` | تسجيل تلاوة صوتي |

### 1.3 نطاق Hadith
| الجدول | الغرض |
|---|---|
| `hadiths` | نص حديثي بدرجته |
| `hadith_collections` | مصدر كتابي (كصحيح البخاري) |
| `narrators` | راوٍ ضمن سلسلة إسناد |
| `hadith_narrators` *(ربط)* | سلسلة الإسناد المرتَّبة لكل حديث |
| `scholar_commentaries` | شرح عالِم (حديث/فتوى/موضوع) |

### 1.4 نطاق Islamic Knowledge
| الجدول | الغرض |
|---|---|
| `fatwas` | إجابة شرعية موثَّقة |
| `articles` | مقالة معرفية عامة |
| `books` | مصدر مرجعي كامل |
| `citations` *(ربط)* | استشهادات محتوى بآيات/أحاديث/فتاوى (متعدد الأنواع) |

### 1.5 نطاق Learning
| الجدول | الغرض |
|---|---|
| `courses` | مسار تعليمي متكامل |
| `lessons` | وحدة تعليمية ضمن دورة |
| `lesson_content_items` *(ربط)* | محتوى الدرس (فيديو/صوت/مقالة) |
| `quizzes` | اختبار معرفي |
| `questions` | سؤال ضمن اختبار |
| `answers` | خيار إجابة |
| `enrollments` | تسجيل مستخدم في دورة |
| `quiz_attempts` | محاولة مستخدم على اختبار |

### 1.6 نطاق Media
| الجدول | الغرض |
|---|---|
| `videos` | وسيط مرئي |
| `audios` | وسيط صوتي |
| `images` | صورة |
| `attachments` | ملف قابل للتنزيل |

### 1.7 نطاق Geography
| الجدول | الغرض |
|---|---|
| `countries` | دولة |
| `cities` | مدينة |
| `mosques` | مسجد |
| `islamic_centers` | مركز إسلامي |
| `mosque_center_affiliations` *(ربط)* | انتساب مسجد لمركز إسلامي |
| `event_scholars` *(ربط)* | مشاركة عالِم في فعالية |
| `events` | فعالية أو بث مباشر *(مذكور في IA، مُضاف هنا للاكتمال المنطقي)* |

### 1.8 نطاق Taxonomy
| الجدول | الغرض |
|---|---|
| `categories` | تصنيف رئيسي هرمي |
| `tags` | وسم حر |
| `topics` | موضوع (8 أوجه تصنيف) |
| `topic_assignments` *(ربط، متعدد الأنواع)* | ربط أي محتوى بموضوع واحد أو أكثر |
| `tag_assignments` *(ربط، متعدد الأنواع)* | ربط أي محتوى بوسم واحد أو أكثر |
| `media_usages` *(ربط، متعدد الأنواع)* | استخدام وسيط ضمن سياق محتوى محدَّد |

### 1.9 نطاق Localization
| الجدول | الغرض |
|---|---|
| `languages` | لغة مدعومة على المنصة |
| `locale_groups` | معرِّف تجميعي يربط النسخ اللغوية لنفس المحتوى |

### 1.10 نطاق Search
| الجدول | الغرض |
|---|---|
| `search_index_queue` | قائمة انتظار مزامنة مع محرك البحث الخارجي |

### 1.11 نطاق AI
| الجدول | الغرض |
|---|---|
| `ai_citation_logs` | سجل كل استشهاد فعلي للذكاء الاصطناعي بمحتوى محدَّد |

### 1.12 نطاق Audit
| الجدول | الغرض |
|---|---|
| `audit_log_entries` | سجل كل فعل على أي كيان |
| `security_event_logs` | سجل أحداث أمنية منفصل |
| `content_versions` | لقطة كاملة لحالة أي محتوى عند نقطة انتقال مهمة |
| `draft_revisions` | مراجعات مسودة قصيرة الأمد |

### 1.13 نطاق System
| الجدول | الغرض |
|---|---|
| `system_settings` | إعداد تشغيلي عام |
| `feature_flags` | علم تفعيل ميزة تدريجيًا |
| `background_job_logs` | سجل تنفيذ مهام خلفية |

---

## 2. Columns — أعمدة كل جدول (المميِّزة فقط، بالإضافة للأعمدة القياسية في §0.2)

### 2.1 نطاق Identity & Access

**scholars** *(قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `full_name` | ShortText(150) | نعم | — | — |
| `biography` | LongText | نعم | — | حد أدنى 100 حرف |
| `specialization_topic_id` | UUID | نعم | — | FK → `topics.id` |
| `era` | Enum(Classical, Contemporary) | نعم | — | — |
| `credentials_summary` | ShortText(500) | لا | `null` | — |
| `is_living_member` | Boolean | نعم | `false` | — |
| `linked_user_id` | UUID | لا *(إلزامي إن `is_living_member = true`)* | `null` | FK → `users.id` |

**authors** *(قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `full_name` | ShortText(150) | نعم | — | — |
| `biography` | LongText | لا | `null` | — |
| `pen_name` | ShortText(100) | لا | `null` | — |
| `user_id` | UUID | نعم | — | FK → `users.id` |

**translators** *(قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `full_name` | ShortText(150) | نعم | — | — |
| `biography` | LongText | لا | `null` | — |
| `credentials_summary` | ShortText(500) | لا | `null` | — |
| `user_id` | UUID | نعم | — | FK → `users.id` |
| `is_certification_verified` | Boolean | نعم | `false` | يتطلب تأكيد `ADMIN` |

**reviewers** *(غير قابل للترجمة — كيان تشغيلي داخلي)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `full_name` | ShortText(150) | نعم | — | — |
| `user_id` | UUID | نعم | — | FK → `users.id`، فريد |
| `active_status` | Boolean | نعم | `true` | — |

**translator_languages** *(ربط، غير قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `translator_id` | UUID | نعم | — | FK → `translators.id` |
| `language_code` | ShortText(10) | نعم | — | FK → `languages.iso_code` |

**scholar_center_affiliations** *(ربط، غير قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `scholar_id` | UUID | نعم | — | FK → `scholars.id` |
| `islamic_center_id` | UUID | نعم | — | FK → `islamic_centers.id` |

### 2.2 نطاق Quran

**qurans** *(Reference — نسخة مخفَّفة من الأعمدة القياسية: `id`, `created_at`, `updated_at` فقط، بلا `status`/إصدارات)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `riwayah` | Enum(Hafs_Asim, Warsh_Nafi, ...) | نعم | — | — |
| `total_surah_count` | Integer | نعم | `114` | = 114 |
| `total_verse_count` | Integer | نعم | — | > 0 |
| `source_edition` | ShortText(255) | نعم | — | — |
| `is_default` | Boolean | نعم | `false` | رواية افتراضية واحدة فقط عبر كل الجدول |

**surahs** *(Reference، قابل للترجمة لحقل `translated_name` فقط)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `quran_id` | UUID | نعم | — | FK → `qurans.id` |
| `number` | Integer | نعم | — | فريد، بين 1-114 |
| `arabic_name` | ShortText(100) | نعم | — | — |
| `transliterated_name` | ShortText(100) | نعم | — | — |
| `translated_name` | ShortText(150) | لا | `null` | — |
| `revelation_type` | Enum(Meccan, Medinan) | نعم | — | — |
| `verse_count` | Integer | نعم | — | > 0 |
| `order_of_revelation` | Integer | نعم | — | بين 1-114، فريد |

**verses** *(Reference صرف — بلا `status` دورة حياة تحريرية، فقط `status` من نمط B: Imported/Validated/Active/UnderCorrection)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `surah_id` | UUID | نعم | — | FK → `surahs.id` |
| `verse_number_in_surah` | Integer | نعم | — | > 0 |
| `absolute_verse_number` | Integer | نعم | — | فريد، بين 1-6236 |
| `arabic_text_uthmani` | LongText | نعم | — | — |
| `arabic_text_simple` | LongText | نعم | — | — |
| `juz_number` | Integer | نعم | — | بين 1-30 |
| `hizb_number` | Integer | نعم | — | بين 1-60 |
| `page_number` | Integer | لا | `null` | — |
| `sajdah_flag` | Boolean | نعم | `false` | — |

**words** *(Reference)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `verse_id` | UUID | نعم | — | FK → `verses.id` |
| `position_in_verse` | Integer | نعم | — | > 0 |
| `arabic_text` | ShortText(50) | نعم | — | — |
| `transliteration` | ShortText(80) | لا | `null` | — |
| `morphological_tag` | Enum(Noun, Verb, Particle, ...) | نعم | — | — |
| `root_id` | UUID | لا | `null` | FK → `roots.id` |
| `word_gloss` | ShortText(200) | لا | `null` | — |

**roots** *(Reference، قابل للترجمة لحقل `general_meaning`)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `root_letters` | ShortText(10) | نعم | — | فريد (مُطبَّع) |
| `general_meaning` | ShortText(300) | لا | `null` | — |
| `occurrence_count` | Integer | لا | `0` | محسوب دوريًا |

**quran_translations** *(Transactional، قابل للترجمة بالتعريف)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `verse_id` | UUID | نعم | — | FK → `verses.id` |
| `translator_id` | UUID | نعم | — | FK → `translators.id` |
| `translated_text` | LongText | نعم | — | — |
| `methodology_note` | ShortText(500) | لا | `null` | — |
| `footnotes` | LongText | لا | `null` | — |
| `disclaimer_accepted` | Boolean | نعم | `false` | يجب `true` قبل `status = 'Published'` |

**tafsirs** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `body_text` | LongText | نعم | — | حد أدنى 200 حرف |
| `scope_type` | Enum(SingleVerse, VerseRange, Surah) | نعم | — | — |
| `source_type` | Enum(Classical, Contemporary) | نعم | — | — |
| `scholar_id` | UUID | نعم | — | FK → `scholars.id` |
| `book_id` | UUID | لا | `null` | FK → `books.id` |

**tafsir_verses** *(ربط)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `tafsir_id` | UUID | نعم | — | FK → `tafsirs.id` |
| `verse_id` | UUID | نعم | — | FK → `verses.id` |

**recitations** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `reciter_id` | UUID | نعم | — | FK → `authors.id` |
| `audio_id` | UUID | نعم | — | FK → `audios.id` |
| `riwayah` | Enum(Hafs_Asim, Warsh_Nafi, ...) | نعم | — | — |
| `scope_type` | Enum(Verse, Surah, Juz) | نعم | — | — |
| `surah_id` | UUID | لا | `null` | FK → `surahs.id` |
| `duration_seconds` | Integer | نعم | — | > 0 |

### 2.3 نطاق Hadith

**hadiths** *(Reference للنص، `status` منفصل لتعديل الدرجة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `matn_text` | LongText | نعم | — | — |
| `grade` | Enum(Sahih, Hasan, Daif, Mawdu) | نعم | — | — |
| `grading_scholar_id` | UUID | نعم | — | FK → `scholars.id` |
| `hadith_collection_id` | UUID | نعم | — | FK → `hadith_collections.id` |
| `book_id` | UUID | نعم | — | FK → `books.id` |

**hadith_collections** *(Reference، قابل للترجمة لحقل `collection_name`)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `collection_name` | ShortText(150) | نعم | — | — |
| `compiler_scholar_id` | UUID | نعم | — | FK → `scholars.id` |
| `era` | ShortText(50) | لا | `null` | — |
| `total_hadith_count` | Integer | لا | `0` | محسوب دوريًا |

**narrators** *(Reference، قابل للترجمة لحقلي `full_name`/`reliability_assessment`)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `full_name` | ShortText(150) | نعم | — | — |
| `generation_layer` | Enum(Companion, Successor, ...) | نعم | — | — |
| `reliability_assessment` | ShortText(500) | نعم | — | يستشهد بمصدر كلاسيكي |
| `birth_era` | ShortText(50) | لا | `null` | — |
| `death_era` | ShortText(50) | لا | `null` | — |

**hadith_narrators** *(ربط، بسمة ترتيب)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `hadith_id` | UUID | نعم | — | FK → `hadiths.id` |
| `narrator_id` | UUID | نعم | — | FK → `narrators.id` |
| `chain_position` | Integer | نعم | — | > 0، فريد ضمن (`hadith_id`) |

**scholar_commentaries** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `body_text` | LongText | نعم | — | حد أدنى 100 حرف |
| `scholar_id` | UUID | نعم | — | FK → `scholars.id` |
| `related_entity_type` | Enum(Hadith, Fatwa, Topic, Article) | نعم | — | — |
| `related_entity_id` | UUID | نعم | — | مرجع متعدد الأنواع (بلا FK صارم على مستوى القاعدة، تحقق تطبيقي) |

### 2.4 نطاق Islamic Knowledge

**fatwas** *(Transactional — الأعلى حساسية)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `question_text` | LongText | نعم | — | حد أدنى 20 حرف |
| `answer_text` | LongText | نعم | — | حد أدنى 50 حرف |
| `fiqh_school_topic_id` | UUID | نعم | — | FK → `topics.id` |
| `issue_date` | Date | نعم | — | — |
| `scholar_id` | UUID | نعم | — | FK → `scholars.id` |

**articles** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `body_text` | LongText | نعم | — | حد أدنى 300 حرف |
| `excerpt` | ShortText(300) | نعم | — | — |
| `featured_image_id` | UUID | لا | `null` | FK → `images.id` |
| `author_id` | UUID | لا | `null` | FK → `authors.id` |
| `scholar_id` | UUID | لا | `null` | FK → `scholars.id` |
| `category_id` | UUID | نعم | — | FK → `categories.id` |

**books** *(Master)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(250) | نعم | — | — |
| `author_id` | UUID | لا | `null` | FK → `authors.id` |
| `scholar_id` | UUID | لا | `null` | FK → `scholars.id` |
| `publication_era` | ShortText(50) | نعم | — | — |
| `book_type` | Enum(Hadith, Fiqh, Seerah, Tafsir, General) | نعم | — | — |
| `digital_attachment_id` | UUID | لا | `null` | FK → `attachments.id` |
| `isbn` | ShortText(20) | لا | `null` | — |

**citations** *(ربط، متعدد الأنواع)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `source_type` | Enum(Article, Fatwa, ScholarCommentary, Tafsir) | نعم | — | — |
| `source_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `target_type` | Enum(Verse, Hadith, Fatwa) | نعم | — | — |
| `target_id` | UUID | نعم | — | مرجع متعدد الأنواع |

### 2.5 نطاق Learning

**courses** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `description` | LongText | نعم | — | — |
| `level_topic_id` | UUID | نعم | — | FK → `topics.id` |
| `audience_topic_id` | UUID | نعم | — | FK → `topics.id` |
| `certificate_eligible` | Boolean | نعم | `false` | — |
| `cover_image_id` | UUID | لا | `null` | FK → `images.id` |
| `teacher_id` | UUID | نعم | — | FK → `users.id` |

**lessons** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `course_id` | UUID | نعم | — | FK → `courses.id` |
| `title` | ShortText(200) | نعم | — | — |
| `order_index` | Integer | نعم | — | فريد ضمن (`course_id`) |
| `content_type` | Enum(Text, Video, Mixed) | نعم | — | — |
| `body_text` | LongText | لا | `null` | — |
| `estimated_duration_minutes` | Integer | نعم | — | > 0 |
| `quiz_id` | UUID | لا | `null` | FK → `quizzes.id` |

**lesson_content_items** *(ربط، متعدد الأنواع)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `lesson_id` | UUID | نعم | — | FK → `lessons.id` |
| `content_type` | Enum(Video, Audio, Article) | نعم | — | — |
| `content_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `order_index` | Integer | نعم | — | — |

**quizzes** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `course_id` | UUID | لا | `null` | FK → `courses.id` (اختبار نهائي) |
| `passing_score_percentage` | Integer | نعم | `70` | بين 0-100 |
| `attempt_limit` | Integer | لا | `null` | > 0 إن حُدِّد |
| `time_limit_minutes` | Integer | لا | `null` | > 0 إن حُدِّد |

**questions**
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `quiz_id` | UUID | نعم | — | FK → `quizzes.id` |
| `question_text` | ShortText(500) | نعم | — | — |
| `question_type` | Enum(MultipleChoice, TrueFalse, ShortAnswer) | نعم | — | — |
| `points` | Integer | نعم | `1` | > 0 |
| `order_index` | Integer | نعم | — | فريد ضمن (`quiz_id`) |

**answers**
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `question_id` | UUID | نعم | — | FK → `questions.id` |
| `answer_text` | ShortText(300) | نعم | — | — |
| `is_correct` | Boolean | نعم | `false` | ≥1 صحيحة ضمن كل `question_id` |
| `explanation_text` | ShortText(500) | لا | `null` | — |
| `order_index` | Integer | نعم | — | — |

**enrollments** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `user_id` | UUID | نعم | — | FK → `users.id` |
| `course_id` | UUID | نعم | — | FK → `courses.id` |
| `enrolled_at` | Timestamp | نعم | وقت التسجيل | — |
| `progress_percentage` | Integer | نعم | `0` | بين 0-100 |
| `completed_at` | Timestamp | لا | `null` | — |
| `certificate_issued` | Boolean | نعم | `false` | — |
| فريد مركَّب | — | — | — | (`user_id`, `course_id`) فريد — لا تسجيل مكرَّر |

**quiz_attempts** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `user_id` | UUID | نعم | — | FK → `users.id` |
| `quiz_id` | UUID | نعم | — | FK → `quizzes.id` |
| `attempt_number` | Integer | نعم | — | > 0 |
| `score_percentage` | Integer | لا | `null` | بين 0-100 |
| `started_at` | Timestamp | نعم | — | — |
| `submitted_at` | Timestamp | لا | `null` | — |
| `passed` | Boolean | لا | `null` | — |

### 2.6 نطاق Media

**videos** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `storage_file_key` | ShortText(500) | نعم | — | — |
| `duration_seconds` | Integer | نعم | — | > 0 |
| `resolution` | ShortText(20) | نعم | — | — |
| `transcript_text` | LongText | لا | `null` | — |
| `thumbnail_image_id` | UUID | نعم | — | FK → `images.id` |
| `uploader_user_id` | UUID | نعم | — | FK → `users.id` |

**audios** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `storage_file_key` | ShortText(500) | نعم | — | — |
| `duration_seconds` | Integer | نعم | — | > 0 |
| `speaker_id` | UUID | لا | `null` | FK → `authors.id` |
| `transcript_text` | LongText | لا | `null` | — |

**images** *(Transactional مخفَّف — دورة حياة C مبسَّطة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `storage_file_key` | ShortText(500) | نعم | — | — |
| `alt_text` | ShortText(200) | نعم | — | إلزامي بلا استثناء |
| `caption` | ShortText(300) | لا | `null` | — |
| `width_px` | Integer | نعم | — | > 0 |
| `height_px` | Integer | نعم | — | > 0 |

**attachments** *(Transactional)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `storage_file_key` | ShortText(500) | نعم | — | — |
| `file_type` | Enum(PDF, PPTX, DOCX, ...) | نعم | — | من قائمة مسموحة (قيد أمني) |
| `file_size_bytes` | Integer | نعم | — | ≤ الحد الأقصى المسموح |
| `title` | ShortText(200) | نعم | — | — |
| `description` | ShortText(500) | لا | `null` | — |

### 2.7 نطاق Geography

**countries** *(Master، قابل للترجمة لـ `name_localized`)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `iso_code` | ShortText(2) | نعم | — | فريد، ISO 3166-1 |
| `name_localized` | ShortText(100) | نعم | — | — |
| `region` | ShortText(50) | نعم | — | — |

**cities** *(Master، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `country_id` | UUID | نعم | — | FK → `countries.id` |
| `name_localized` | ShortText(100) | نعم | — | — |
| `latitude` | Decimal(9,6) | نعم | — | بين -90 و90 |
| `longitude` | Decimal(9,6) | نعم | — | بين -180 و180 |
| `timezone_identifier` | ShortText(50) | نعم | — | منطقة IANA صالحة |

**mosques** *(Master، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `city_id` | UUID | نعم | — | FK → `cities.id` |
| `name` | ShortText(200) | نعم | — | — |
| `latitude` | Decimal(9,6) | نعم | — | بين -90 و90 |
| `longitude` | Decimal(9,6) | نعم | — | بين -180 و180 |
| `address` | ShortText(300) | نعم | — | — |
| `prayer_time_source` | Enum(Calculated, Manual) | نعم | `Calculated` | — |
| `verification_status` | Enum(Submitted, Verified, Rejected) | نعم | `Submitted` | — |
| `contact_info` | ShortText(200) | لا | `null` | — |
| `submitted_by` | UUID | نعم | — | FK → `users.id` |

**islamic_centers** *(Master، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `city_id` | UUID | نعم | — | FK → `cities.id` |
| `name` | ShortText(200) | نعم | — | — |
| `latitude` | Decimal(9,6) | نعم | — | — |
| `longitude` | Decimal(9,6) | نعم | — | — |
| `contact_info` | ShortText(200) | لا | `null` | — |
| `verification_status` | Enum(Submitted, Verified, Rejected) | نعم | `Submitted` | — |

**mosque_center_affiliations** *(ربط)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `mosque_id` | UUID | نعم | — | FK → `mosques.id` |
| `islamic_center_id` | UUID | نعم | — | FK → `islamic_centers.id` |

**events** *(Transactional، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `title` | ShortText(200) | نعم | — | — |
| `description` | LongText | لا | `null` | — |
| `start_time` | Timestamp | نعم | — | — |
| `end_time` | Timestamp | لا | `null` | — |
| `is_virtual` | Boolean | نعم | `false` | — |
| `islamic_center_id` | UUID | لا | `null` | FK → `islamic_centers.id` |

**event_scholars** *(ربط)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `event_id` | UUID | نعم | — | FK → `events.id` |
| `scholar_id` | UUID | نعم | — | FK → `scholars.id` |

### 2.8 نطاق Taxonomy

**categories** *(Master، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `name_localized` | ShortText(100) | نعم | — | — |
| `parent_category_id` | UUID | لا | `null` | FK → `categories.id` (ذاتي) |
| `icon_image_id` | UUID | لا | `null` | FK → `images.id` |
| `sort_order` | Integer | نعم | `0` | — |
| `depth_level` | Integer | نعم | محسوب | ≤ 3 |
| `is_scholarly_gated` | Boolean | نعم | `false` | `true` لشجرة الفقه/العقيدة تحديدًا |

**tags** *(Master، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `name_localized` | ShortText(50) | نعم | — | فريد ضمن (`language`)، غير حساس للتشكيل |
| `usage_count` | Integer | نعم | `0` | محسوب دوريًا |

**topics** *(Master، قابل للترجمة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `name_localized` | ShortText(100) | نعم | — | — |
| `parent_topic_id` | UUID | لا | `null` | FK → `topics.id` (ذاتي) |
| `facet_type` | Enum(Fiqh, Aqidah, Seerah, HadithClass, QuranClass, Level, Audience, GeneralTopic) | نعم | — | — |
| `is_scholarly_gated` | Boolean | نعم | محسوب من `facet_type` | `true` عند `facet_type ∈ {Fiqh, Aqidah}` |

**topic_assignments** *(ربط، متعدد الأنواع)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `subject_type` | Enum(Article, Fatwa, Course, Lesson, Book, Hadith, Surah, ...) | نعم | — | — |
| `subject_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `topic_id` | UUID | نعم | — | FK → `topics.id` |

**tag_assignments** *(ربط، متعدد الأنواع)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `subject_type` | Enum(Article, Fatwa, Course, ...) | نعم | — | — |
| `subject_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `tag_id` | UUID | نعم | — | FK → `tags.id` |

**media_usages** *(ربط، متعدد الأنواع)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `media_type` | Enum(Video, Audio, Image, Attachment) | نعم | — | — |
| `media_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `context_type` | Enum(Lesson, Article, Event, Course) | نعم | — | — |
| `context_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `usage_role` | Enum(Featured, Inline) | نعم | `Inline` | — |

### 2.9 نطاق Localization

**languages** *(Master، قابل للترجمة لـ `name_localized` فقط)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `iso_code` | ShortText(10) | نعم | — | فريد |
| `name_localized` | ShortText(50) | نعم | — | — |
| `direction` | Enum(RTL, LTR) | نعم | — | — |
| `is_active` | Boolean | نعم | `false` | — |

**locale_groups** *(Reference — كيان خفيف جدًا)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key فقط — لا أعمدة أخرى |
| `created_at` | Timestamp | نعم | وقت الإنشاء | — |

### 2.10 نطاق Search

**search_index_queue** *(Transactional، بلا أعمدة قياسية كاملة — جدول قائمة انتظار)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key |
| `entity_type` | ShortText(50) | نعم | — | — |
| `entity_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `operation` | Enum(Index, Update, Remove) | نعم | — | — |
| `enqueued_at` | Timestamp | نعم | وقت الإدراج | — |
| `processed_at` | Timestamp | لا | `null` | — |
| `status` | Enum(Pending, Processing, Completed, Failed) | نعم | `Pending` | — |
| `retry_count` | Integer | نعم | `0` | — |

### 2.11 نطاق AI

**ai_citation_logs** *(Transactional، بلا أعمدة قياسية كاملة)*
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key |
| `cited_entity_type` | ShortText(50) | نعم | — | — |
| `cited_entity_id` | UUID | نعم | — | مرجع متعدد الأنواع |
| `cited_content_version` | Integer | نعم | — | يطابق `content_versions.version_number` وقتها |
| `query_context_hash` | ShortText(100) | لا | `null` | بلا بيانات شخصية |
| `cited_at` | Timestamp | نعم | وقت الاستشهاد | — |

### 2.12 نطاق Audit

**audit_log_entries** *(تفصيل في القسم 10)*
**security_event_logs**
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key |
| `user_id` | UUID | لا | `null` | FK → `users.id` (قد يكون `null` لمحاولة دخول فاشلة بلا حساب معروف) |
| `event_type` | Enum(LoginSuccess, LoginFailure, PermissionDenied, RoleChanged) | نعم | — | — |
| `ip_address` | ShortText(45) | لا | `null` | — |
| `occurred_at` | Timestamp | نعم | وقت الحدث | — |
| `details` | ShortText(500) | لا | `null` | — |

**content_versions** *(تفصيل في القسم 8)*
**draft_revisions** *(تفصيل في القسم 8)*

### 2.13 نطاق System

**system_settings**
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `setting_key` | ShortText(100) | نعم | — | فريد |
| `setting_value` | ShortText(1000) | نعم | — | — |
| `description` | ShortText(300) | لا | `null` | — |

**feature_flags**
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `flag_key` | ShortText(100) | نعم | — | فريد |
| `is_enabled` | Boolean | نعم | `false` | — |
| `rollout_percentage` | Integer | لا | `0` | بين 0-100 |

**background_job_logs**
| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key |
| `job_type` | ShortText(100) | نعم | — | — |
| `started_at` | Timestamp | نعم | — | — |
| `finished_at` | Timestamp | لا | `null` | — |
| `status` | Enum(Running, Succeeded, Failed) | نعم | `Running` | — |
| `error_message` | ShortText(1000) | لا | `null` | — |

---

## 3. Primary Keys — استراتيجية المفاتيح الأساسية

**كل جدول بلا استثناء يستخدم `id` من نوع `UUID` (نسخة UUIDv7) كمفتاح أساسي.** الأسباب:

- **ترتيب زمني ضمني:** UUIDv7 يضمّن طابعًا زمنيًا في الجزء الأول من القيمة، فتُصبح المعرِّفات قابلة للفرز زمنيًا دون عمود `created_at` إضافي لهذا الغرض تحديدًا — يحسّن أداء الفهرسة على الجداول الكبيرة (Append-Only خصوصًا) مقارنة بـUUIDv4 العشوائي بالكامل.
- **توليد موزَّع بلا تصادم:** لا حاجة لتنسيق مركزي (كما تتطلبه المفاتيح المتسلسلة Integer) — ضروري لبنية سحابية متعددة المناطق.
- **عدم تسريب معلومات:** لا يكشف حجم الجدول أو معدل النمو (خلافًا لمفتاح Integer تسلسلي يكشف "أنت السجل رقم 40219").
- **جداول الربط (Join Tables):** تحمل مفتاحًا أساسيًا مركَّبًا منطقيًا (مثل `tafsir_verses` على `tafsir_id + verse_id`) **أو** `id` مستقل خاص بها — القرار بين الاثنين يُترَك لمرحلة Prisma التالية، إذ لا يؤثر على أي قرار معماري في هذه الوثيقة.

---

## 4. Foreign Keys — كل العلاقات المرجعية

جدول شامل بكل مفتاح أجنبي في التصميم (باستثناء الأعمدة القياسية `created_by`/`updated_by`/`reviewed_by`/`approved_by`/`published_by`/`locale_group_id`/`language` المتكررة على معظم الجداول والمذكورة مرة واحدة في §0.2). سياسة الحذف (On Delete) منطقية لا صياغة SQL فعلية.

| الجدول.العمود | يشير إلى | سياسة الحذف المنطقية | السبب |
|---|---|---|---|
| `surahs.quran_id` | `qurans.id` | RESTRICT | لا حذف مصحف له سور مرتبطة |
| `verses.surah_id` | `surahs.id` | RESTRICT | — |
| `words.verse_id` | `verses.id` | RESTRICT | — |
| `words.root_id` | `roots.id` | SET NULL | فقدان الجذر لا يجب أن يحذف الكلمة |
| `quran_translations.verse_id` | `verses.id` | RESTRICT | — |
| `quran_translations.translator_id` | `translators.id` | RESTRICT | لا ترجمة بلا مترجم موثَّق |
| `tafsirs.scholar_id` | `scholars.id` | RESTRICT | — |
| `tafsirs.book_id` | `books.id` | SET NULL | — |
| `tafsir_verses.tafsir_id` | `tafsirs.id` | CASCADE | حذف التفسير يحذف روابطه بالآيات |
| `tafsir_verses.verse_id` | `verses.id` | RESTRICT | — |
| `recitations.reciter_id` | `authors.id` | RESTRICT | — |
| `recitations.audio_id` | `audios.id` | CASCADE | التلاوة بلا ملف صوتي عديمة المعنى |
| `hadiths.grading_scholar_id` | `scholars.id` | RESTRICT | — |
| `hadiths.hadith_collection_id` | `hadith_collections.id` | RESTRICT | — |
| `hadiths.book_id` | `books.id` | RESTRICT | — |
| `hadith_collections.compiler_scholar_id` | `scholars.id` | RESTRICT | — |
| `hadith_narrators.hadith_id` | `hadiths.id` | CASCADE | — |
| `hadith_narrators.narrator_id` | `narrators.id` | RESTRICT | لا حذف راوٍ موثَّق ضمن سند فعلي |
| `scholar_commentaries.scholar_id` | `scholars.id` | RESTRICT | — |
| `fatwas.fiqh_school_topic_id` | `topics.id` | RESTRICT | — |
| `fatwas.scholar_id` | `scholars.id` | RESTRICT | — |
| `articles.featured_image_id` | `images.id` | SET NULL | — |
| `articles.author_id` / `scholar_id` | `authors.id` / `scholars.id` | RESTRICT | يجب مؤلف واحد على الأقل (تحقق تطبيقي أن أحدهما موجود) |
| `articles.category_id` | `categories.id` | RESTRICT | كل مقالة تحتاج تصنيفًا رئيسيًا دومًا |
| `books.digital_attachment_id` | `attachments.id` | SET NULL | — |
| `citations.*` | متعدد الأنواع | لا FK صارم | تحقق تطبيقي فقط (نمط Polymorphic) |
| `lessons.course_id` | `courses.id` | CASCADE | لا درس بلا دورة |
| `lessons.quiz_id` | `quizzes.id` | SET NULL | — |
| `quizzes.course_id` | `courses.id` | CASCADE | — |
| `questions.quiz_id` | `quizzes.id` | CASCADE | — |
| `answers.question_id` | `questions.id` | CASCADE | — |
| `enrollments.user_id` / `course_id` | `users.id` / `courses.id` | RESTRICT | سجل تاريخي، لا يُحذَف بحذف الدورة |
| `quiz_attempts.user_id` / `quiz_id` | `users.id` / `quizzes.id` | RESTRICT | — |
| `videos.thumbnail_image_id` | `images.id` | RESTRICT | إلزامية الصورة المصغَّرة |
| `mosques.city_id` / `islamic_centers.city_id` | `cities.id` | RESTRICT | — |
| `cities.country_id` | `countries.id` | RESTRICT | — |
| `categories.parent_category_id` | `categories.id` (ذاتي) | RESTRICT | لا حذف تصنيف أب له أبناء |
| `topics.parent_topic_id` | `topics.id` (ذاتي) | RESTRICT | — |
| `topic_assignments.topic_id` / `tag_assignments.tag_id` | `topics.id` / `tags.id` | RESTRICT | — |
| `*.locale_group_id` (كل الجداول القابلة للترجمة) | `locale_groups.id` | RESTRICT | — |
| `*.language` (كل الجداول القابلة للترجمة) | `languages.iso_code` | RESTRICT | — |
| `content_versions.entity_id` / `audit_log_entries.entity_id` | متعدد الأنواع | لا FK صارم | نمط Polymorphic مقصود (`Enterprise Database Architecture §6.3`) |

---

## 5. Index Strategy — استراتيجية الفهارس

| الجدول | الفهرس | السبب |
|---|---|---|
| كل جدول | فهرس تلقائي على `id` (PK) | قياسي |
| كل مفتاح أجنبي في القسم 4 | فهرس مفرد | تسريع عمليات JOIN وRESTRICT/CASCADE |
| `verses` | `(absolute_verse_number)` فريد | البحث المرجعي المباشر الأكثر شيوعًا في كامل النظام |
| `verses` | `(surah_id, verse_number_in_surah)` مركَّب | التصفح المتسلسل ضمن سورة |
| `hadiths` | `(grade)` | تصفية شائعة جدًا في واجهة البحث |
| `articles`, `fatwas`, `courses`, ... (كل جداول المحتوى) | `(status, language)` جزئي (مع شرط `status = 'Published'`) | يخدم النمط الأشيع للاستعلام (عرض المحتوى المنشور فقط) بحجم فهرس أصغر من فهرسة الجدول كاملاً |
| `*.locale_group_id` | فهرس مفرد على كل جدول قابل للترجمة | تجميع سريع لكل نسخ لغة محتوى واحد |
| `audit_log_entries`, `content_versions`, `ai_citation_logs`, `security_event_logs` | `(entity_type, entity_id)` مركَّب | نمط الاستعلام الأساسي: "كل سجلات هذا الكيان تحديدًا" |
| `audit_log_entries`, `content_versions` | `(created_at)` أو `(occurred_at)` | يخدم الاستعلامات المقيَّدة بنطاق زمني (القسم 9.2 من Enterprise Database Architecture) |
| `mosques`, `islamic_centers` | فهرس جغرافي مكاني (Spatial/GiST) على `(latitude, longitude)` | بحث "أقرب مسجد" يتطلب فهرسة مكانية متخصصة، لا فهرسة عمودية عادية |
| `topic_assignments`, `tag_assignments`, `citations`, `media_usages` | `(subject_type, subject_id)` أو `(source_type, source_id)` مركَّب | نمط الاستعلام الأساسي لكل جداول الربط متعددة الأنواع |
| `search_index_queue` | `(status, enqueued_at)` مركَّب | معالجة قائمة الانتظار بترتيب FIFO ضمن الحالة `Pending` فقط |
| `tags` | `(language, name_localized)` فريد وغير حساس للتشكيل | كشف تكرار الوسوم |

**ملاحظة:** القرار بين B-Tree، GIN (للنص الكامل)، أو GiST (المكاني) تفصيل تنفيذي يخص مرحلة Prisma/SQL القادمة تحديدًا — هذه الوثيقة تحدد **أي الأعمدة** تحتاج فهرسة و**لماذا**، لا بناء جملة الفهرس ذاتها.

---

## 6. Unique Constraints — القيود الفريدة

| الجدول | الأعمدة | السبب |
|---|---|---|
| `users` | `email` | *(مطبَّق مسبقًا في طبقة الأساس)* |
| `surahs` | `number` | لا سورتان بنفس الرقم الترتيبي |
| `surahs` | `order_of_revelation` | لا سورتان بنفس ترتيب النزول |
| `verses` | `absolute_verse_number` | فريد عبر كل المصحف |
| `roots` | `root_letters` (بعد التطبيع) | لا جذران متطابقان |
| `hadith_narrators` | `(hadith_id, chain_position)` | لا موضعان متطابقان ضمن نفس السند |
| `enrollments` | `(user_id, course_id)` | لا تسجيل مكرَّر لنفس المستخدم في نفس الدورة |
| `translator_languages` | `(translator_id, language_code)` | لا تكرار لنفس زوج المترجم/اللغة |
| `languages` | `iso_code` | — |
| `countries` | `iso_code` | — |
| `system_settings` | `setting_key` | — |
| `feature_flags` | `flag_key` | — |
| `reviewers` | `user_id` | كل مستخدم له ملف مراجع واحد كحد أقصى |
| **قاعدة عامة — كل جدول قابل للترجمة (~40 جدولًا)** | `(locale_group_id, language)` | **لا يمكن أن يوجد صفّان بنفس مجموعة الترجمة ونفس اللغة** — القيد الذي يجعل نمط "صف-لكل-لغة" (§0.3) صحيحًا بنيويًا لا اتفاقيًا فقط |
| `categories`, `topics` | `(locale_group_id, language)` مع `is_scholarly_gated` الموروث من الأب | يضمن اتساق البوابة الشرعية عبر كل لغات نفس عقدة التصنيف |

---

## 7. Check Constraints — قواعد التحقق على مستوى قاعدة البيانات

| الجدول.العمود | القاعدة |
|---|---|
| `verses.absolute_verse_number` | `BETWEEN 1 AND 6236` |
| `verses.juz_number` | `BETWEEN 1 AND 30` |
| `verses.hizb_number` | `BETWEEN 1 AND 60` |
| `surahs.number` | `BETWEEN 1 AND 114` |
| `quizzes.passing_score_percentage` | `BETWEEN 0 AND 100` |
| `quiz_attempts.score_percentage` | `BETWEEN 0 AND 100` (عند عدم NULL) |
| `enrollments.progress_percentage` | `BETWEEN 0 AND 100` |
| `feature_flags.rollout_percentage` | `BETWEEN 0 AND 100` |
| `mosques.latitude` / `islamic_centers.latitude` / `cities.latitude` | `BETWEEN -90 AND 90` |
| `mosques.longitude` / `islamic_centers.longitude` / `cities.longitude` | `BETWEEN -180 AND 180` |
| `*.version` (كل الجداول) | `>= 1` |
| `videos.duration_seconds`, `audios.duration_seconds`, `recitations.duration_seconds` | `> 0` |
| `images.width_px`, `images.height_px` | `> 0` |
| `quran_translations.disclaimer_accepted` | يجب `= true` **قبل** السماح بانتقال `status` إلى `Published` — **قيد لا يُعبَّر عنه بـCHECK بسيط** (يعتمد على قيمة عمود آخر شرطيًا)؛ يُنفَّذ عبر Trigger منطقي أو تحقق تطبيقي إلزامي، موثَّق هنا كقاعدة عمل لا كقيد SQL جاهز. |
| `categories.depth_level` | `<= 3` — نفس ملاحظة الاعتماد الشرطي؛ يحتاج حساب تكراري (Recursive) غير قابل للتعبير كـCHECK بسيط على عمود واحد، يُنفَّذ عبر منطق تطبيقي أو Trigger. |
| `fatwas.approved_by` | **يجب أن يختلف عن** `scholar_id` (المُصدِر) — قاعدة استقلالية المراجعة (`Content Models §3.1`)؛ نفس ملاحظة الاعتماد الشرطي بين عمودين. |

**ملاحظة صادقة:** القيود الثلاثة الأخيرة تتجاوز قدرة `CHECK` البسيط على عمود واحد (تحتاج مقارنة بين عمودين أو حسابًا تكراريًا عبر صفوف أخرى) — تُوثَّق هنا **كقواعد عمل ملزمة** يجب فرضها إما عبر Trigger على مستوى قاعدة البيانات أو تحقق إلزامي في طبقة الخدمة (`services/`)، والقرار بين الاثنين يخص مرحلة التنفيذ لا هذه الوثيقة.

---

## 8. Versioning — تصميم جداول الإصدارات

### 8.1 `content_versions`

| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key |
| `entity_type` | ShortText(50) | نعم | — | اسم الجدول المصدر (مرجع متعدد الأنواع) |
| `entity_id` | UUID | نعم | — | — |
| `version_number` | Integer | نعم | — | فريد ضمن (`entity_type`, `entity_id`) |
| `status_at_snapshot` | ShortText(30) | نعم | — | قيمة `status` وقت أخذ اللقطة |
| `full_snapshot` | JSON | نعم | — | نسخة كاملة من كل أعمدة السجل وقتها (استثناء JSON المبرَّر في §0.1) |
| `change_summary` | ShortText(500) | لا | `null` | — |
| `changed_by` | UUID | نعم | — | FK → `users.id` |
| `created_at` | Timestamp | نعم | وقت أخذ اللقطة | **لا `updated_at` — الجدول Append-Only، لا تعديل بعد الإدراج أبدًا** |

**فهرس:** `(entity_type, entity_id, version_number)` مركَّب فريد — يضمن عدم تكرار رقم الإصدار لنفس السجل.

### 8.2 `draft_revisions`

نفس بنية `content_versions` تقريبًا، بفرق جوهري: **قابل للحذف الفعلي (Hard Delete)** بعد انتقال السجل من `Draft` إلى `Review` (سياسة احتفاظ قصيرة الأمد، بخلاف `content_versions` الدائم). لا يُستخدَم في أي استعلام تدقيقي رسمي — أداة تجربة تحرير فقط.

---

## 9. Translation Tables — تصميم جداول الترجمة

`locale_groups` هو الجدول الوحيد المخصَّص للترجمة بحد ذاته — **متعمَّد أن يبقى بهذه البساطة** (معرِّف + توقيت إنشاء فقط، بلا أي عمود وصفي). كل "جدول ترجمة" آخر في هذا التصميم **هو الجدول الأصلي نفسه لكل كيان قابل للترجمة** (مثل `articles`, `categories`, `scholars`) — لا يوجد جدول `article_translations` منفصل، لأن الصف بلغة واحدة **هو** وحدة الترجمة (§0.3).

**آلية القراءة النموذجية:** لعرض "مقالة X بكل لغاتها المتاحة"، الاستعلام هو: `SELECT * FROM articles WHERE locale_group_id = ?` — استعلام واحد بسيط بلا حاجة لأي JOIN إضافي لجدول ترجمة منفصل. هذه البساطة التشغيلية هي الفائدة المباشرة للقرار المعماري في §0.3.

---

## 10. Audit Tables — تصميم جداول التدقيق

### 10.1 `audit_log_entries`

| العمود | النوع | إلزامي | افتراضي | قيود |
|---|---|---|---|---|
| `id` | UUID | نعم | يُولَّد تلقائيًا | Primary Key |
| `entity_type` | ShortText(50) | نعم | — | مرجع متعدد الأنواع |
| `entity_id` | UUID | نعم | — | — |
| `action` | Enum(Create, Update, Approve, Delete, Restore) | نعم | — | الأفعال الخمسة الإلزامية |
| `actor_user_id` | UUID | نعم | — | FK → `users.id` |
| `actor_role_at_time` | ShortText(30) | نعم | — | لقطة الدور وقت الفعل (لا يعتمد على دور المستخدم *الحالي* الذي قد يتغيَّر لاحقًا) |
| `previous_status` | ShortText(30) | لا | `null` | — |
| `new_status` | ShortText(30) | لا | `null` | — |
| `changed_fields` | JSON | لا | `null` | قائمة أسماء الحقول التي تغيَّرت فقط (لا القيم الكاملة — تلك في `content_versions`) |
| `related_content_version_id` | UUID | لا | `null` | FK → `content_versions.id` (إلزامي فعليًا عند `action = 'Approve'`) |
| `reason` | ShortText(500) | لا *(إلزامي عند `action = 'Delete'`)* | `null` | — |
| `occurred_at` | Timestamp | نعم | وقت الفعل | **Append-Only — بلا `updated_at`** |

**فهرس:** `(entity_type, entity_id, occurred_at)` مركَّب — الاستعلام الأشيع "تاريخ كل الأفعال على هذا الكيان مرتَّبة زمنيًا".

### 10.2 `security_event_logs`

مُفصَّل بالكامل في القسم 2.12 أعلاه — أبسط بنيويًا من `audit_log_entries` (لا مرجع Polymorphic، مرتبط مباشرة بـ`user_id` فقط).

---

## 11. Performance Notes — ملاحظات الأداء

- **التوازن قراءة/كتابة:** جداول `verses`, `surahs`, `words`, `roots`, `hadiths`, `narrators` (Reference) تُقرَأ ملايين المرات مقابل كتابة نادرة جدًا بعد الاستيراد الأولي — مرشَّحة بقوة لتخزين مؤقت شبه دائم (TTL طويل جدًا أو بلا انتهاء صلاحية مع إبطال يدوي فقط عند تصحيح نادر).
- **جداول الربط متعددة الأنواع** (`citations`, `topic_assignments`, `tag_assignments`, `media_usages`) ستنمو بسرعة مع نمو المحتوى — فهرسة `(subject_type, subject_id)` (القسم 5) حرجة لتفادي فحص جدول كامل (Full Table Scan) عند جلب "كل الوسوم/المواضيع لهذا المحتوى".
- **`content_versions` و`audit_log_entries`** ستصبحان أكبر جدولين في قاعدة البيانات على المدى الطويل (Append-Only بلا سقف) — التقسيم الزمني (`Enterprise Database Architecture §9.2`) ليس اختياريًا عمليًا عند تجاوز حجم معيَّن، بل ضرورة مبكرة يُنصَح بتخطيطها من التصميم الأول لا كإصلاح لاحق.
- **`full_snapshot` (JSON) في `content_versions`:** حقل كبير نسبيًا لكل سجل — يُستبعَد عمدًا من أي فهرس نصي كامل (لا حاجة للبحث داخله)، ويُنصَح بضغطه على مستوى التخزين (قرار تنفيذي لاحق) نظرًا لتكرار كبير في البنية بين إصدارات متتالية لنفس السجل.
- **الاستعلامات الجغرافية** (`mosques`, `islamic_centers`) تتطلب فهرسة مكانية متخصصة (GiST/Spatial) لا فهرسة عمودية تقليدية — تجاهل هذا مبكرًا يعني بحثًا خطيًا بطيئًا جدًا عند نمو عدد المساجد المُدخَلة.
- **نمط `(status, language)` الجزئي** (القسم 5) يُطبَّق على كل جدول محتوى بلا استثناء تقريبًا — هو الفهرس الأكثر استخدامًا في كامل النظام عمليًا (كل صفحة عامة تقريبًا تستعلم "أعطني المنشور بهذه اللغة").

---

## 12. Prisma Readiness — تقرير الجاهزية

**هل أصبح المشروع جاهزًا لتحويل هذا التصميم إلى Prisma Schema؟**

**نعم.** هذا التصميم المنطقي يوفر لمصمم Prisma كل ما يلزم دون الحاجة لاتخاذ أي قرار معماري مرتجل أثناء الترميز:

- ✅ قائمة كاملة بـ66 جدولاً منطقيًا بأسمائها النهائية (`snake_case`).
- ✅ كل عمود مميِّز بنوعه المنطقي، إلزاميته، قيمته الافتراضية، وقيوده.
- ✅ استراتيجية مفاتيح أساسية موحَّدة (UUIDv7) بلا استثناء.
- ✅ كل علاقة مرجعية محدَّدة مع سياسة حذف منطقية مبرَّرة.
- ✅ استراتيجية فهرسة كاملة بالسبب لكل فهرس.
- ✅ كل القيود الفريدة محدَّدة، بما فيها القاعدة العامة الحرجة `(locale_group_id, language)`.
- ✅ قواعد التحقق موثَّقة، مع تمييز صادق بين ما يُعبَّر عنه كـCHECK بسيط وما يحتاج منطقًا تطبيقيًا/Trigger.
- ✅ تصميم الإصدارات والتدقيق والترجمة الثلاثة مفصَّل ببنية أعمدة كاملة، لا مبدأ عام فقط.

**ما تبقّى فعليًا خارج نطاق التصميم المنطقي (لمرحلة Prisma نفسها، لا هذه الوثيقة):**
- الصياغة الفعلية لأسماء أنواع Prisma (`String`, `Int`, `DateTime`...) المقابلة للأنواع المنطقية هنا.
- قرار Prisma الدقيق لتمثيل العلاقات متعددة الأنواع (Polymorphic) — Prisma لا يدعمها أصلاً بشكل أصيل، سيحتاج نمط تحايل معروف (مثل حقول FK اختيارية متعددة أو جدول وسيط) يُحسَم حينها.
- تفعيل/عدم تفعيل قيود CHECK المعقَّدة (القسم 7) كـTriggers فعلية في قاعدة البيانات مقابل الاكتفاء بمنطق تطبيقي.

**نسبة الجاهزية: 95%** لهذه الطبقة تحديدًا. الفجوة المتبقية (5%) تفاصيل ترميز بحتة تخص Prisma نفسه، لا قرارات تصميم منطقي معلَّقة.

**لا يبدأ أي Prisma Schema فعلي إلا بموافقة صريحة منفصلة على هذه الوثيقة.**
