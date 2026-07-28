# AUTHENTICATION_PLAN.md
### Phase 0.2 — خطة المصادقة (فرع `feature/phase-0.2-authentication`)

**⚠ لا تعديل واحد على `prisma/schema.prisma` أو أي أمر `migrate` نُفِّذ في هذه الجلسة — كل ما يلي خطة للاعتماد، لا تنفيذًا.**

---

## 1. نتائج الفحص (قراءة مباشرة، لا افتراض)

### `lib/auth.ts`
```ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {},
  providers: [],   // فارغة تمامًا
  callbacks: { jwt(...), session(...) },
};
```
`callbacks.jwt`/`callbacks.session` جاهزتان بالفعل لنقل `role` من `user` إلى الـtoken ثم الجلسة — **لا تعديل مطلوب عليهما**؛ يكفي إضافة مزوِّد واحد لـ`providers`.

### نماذج Prisma ذات الصلة (`User`, `Account`, `Session`, `VerificationToken`)
| النموذج | الحالة | الخلاصة |
|---|---|---|
| `User` | `id, name, email, emailVerified, image, role` — **لا حقل كلمة مرور إطلاقًا** | 🔴 يحتاج إضافة حقل واحد |
| `Account` | الشكل القياسي لمحوِّل NextAuth للـOAuth (`provider`, `providerAccountId`, `refresh_token`...) | غير مناسب لتخزين كلمة مرور — مصمَّم لربط حسابات OAuth، لا Credentials |
| `Session` | قياسي، غير مُستخدَم فعليًا (استراتيجية الجلسة `jwt` لا `database`) | لا تغيير |
| `VerificationToken` | قياسي، لإعادة تعيين كلمة المرور/تفعيل البريد لاحقًا | لا تغيير الآن، يُستخدَم مستقبلاً إن أُضيف "نسيت كلمة المرور" |

### `config/permissions.ts`
لا تغيير مطلوب — 7 أدوار، 11 صلاحية، `hasPermission()` جاهزة ومُستهلَكة بالفعل من `services/auth.service.ts` (Phase 0.1).

### مسار NextAuth الحالي
`app/api/auth/[...nextauth]/route.ts` — قياسي، يُصدِّر `GET`/`POST` من `NextAuth(authOptions)`. **لا تعديل مطلوب** — إضافة مزوِّد لـ`authOptions.providers` تكفي، المسار يلتقطه تلقائيًا.

### متغيرات البيئة الحالية (`config/env.ts`)
`AUTH_SECRET` (إلزامي بالفعل)، `AUTH_URL` (اختياري)، `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` (اختياريان، غير مُستخدَمين). **لا متغيرات خاصة بـCredentials موجودة بعد** — سنحتاج إضافتين جديدتين لتهيئة أول ADMIN (القسم 4).

### الطريقة الحالية لإنشاء أول ADMIN
`prisma/seed.ts` **الحالي** — 🔴 **يطابق تمامًا ما مُنِع صراحة في هذه المرحلة**:
```ts
create: { email: "admin@example.com", name: "Platform Admin", role: "ADMIN" }
```
بريد ثابت في الكود، **بلا كلمة مرور أصلاً** (لأن لا حقل لها بعد ولا مزوِّد يستهلكها) — غير قابل لتسجيل الدخول فعليًا حتى بصورته الحالية. **يجب استبداله بالكامل** (القسم 4).

---

## 2. اختيار المزوِّد — Credentials (بريد + كلمة مرور)، مزوِّد واحد فقط

### لماذا لا OAuth (Google مثلاً، رغم وجود حقول جاهزة له في `config/env.ts`)؟
- يتطلب تسجيل تطبيق خارجي (Google Cloud Console)، بيانات اعتماد خارجية، واعتمادًا على وصول شبكي خارجي وقت كل تسجيل دخول — **غير مناسب للوحة إدارة داخلية** يُفترَض عملها حتى لو انقطع الاتصال بخدمات خارجية.
- يربط هوية الموظف بحساب Google شخصي — غير مرغوب غالبًا لحسابات إدارية مؤسسية.

### لماذا Credentials هو الأبسط والأنسب هنا
- **صفر اعتماد خارجي** — يعمل بمعزل تام، مناسب تمامًا لطاقم داخلي محدود العدد.
- **لا حاجة لأي حزمة NextAuth إضافية** — `CredentialsProvider` مُضمَّن بالفعل في `next-auth` المثبَّتة حاليًا (`^4.24.15`).
- يتطابق تمامًا مع نمط "بريد + كلمة مرور" الذي تتوقعه أي لوحة إدارة تقليدية.

**لن يُنفَّذ أي مزوِّد ثانٍ في هذه المرحلة**، كما طُلب صراحة.

---

## 3. حزمة جديدة واحدة مطلوبة — مُبرَّرة صراحة

**`bcryptjs`** — لا مكتبة تجزئة (Hashing) واحدة مثبَّتة حاليًا في المشروع (تحقَّقت: لا `bcrypt`, `bcryptjs`, `argon2` في `package.json`).

**لماذا `bcryptjs` تحديدًا لا `bcrypt` (الأشهر) ولا `argon2`:**
- `bcrypt` مكتبة **أصلية (Native)** تحتاج تصريفًا عبر `node-gyp` وقت التثبيت — **خطر حقيقي موثَّق على استضافة cPanel/Passenger المستهدَفة لهذا المشروع تحديدًا** (`docs/DEPLOYMENT_PLAN.md` من Phase 0 وثَّق مسبقًا فشل بناء بسبب قيود الاستضافة المشتركة؛ إضافة تصريف أصلي إضافي عند `npm install` يزيد الخطر لا يقلِّله).
- `bcryptjs` **تطبيق JavaScript خالص** بلا أي تصريف أصلي — نفس واجهة برمجة `bcrypt` تقريبًا، مُستخدَمة على نطاق واسع تحديدًا لهذا السبب في بيئات الاستضافة المقيَّدة.
- **البديل الأبعد عن أي حزمة جديدة**: `crypto.scrypt` المُضمَّنة في Node.js (بلا أي تثبيت) — أُرجِّح `bcryptjs` عليها لأن تطبيق `scrypt` يدويًا بأمان (توليد Salt، مقارنة بزمن ثابت، ترميز متوافق) عرضة لخطأ تنفيذ أعلى من استخدام مكتبة مُدقَّقة على نطاق واسع ومخصَّصة لهذا الغرض تحديدًا.

**لن تُثبَّت هذه الحزمة قبل موافقتك الصريحة أيضًا** — مذكورة هنا كجزء من الخطة.

---

## 4. التغيير المُقترَح على `prisma/schema.prisma` (لم يُطبَّق — للمراجعة فقط)

```diff
 model User {
   id            String    @id @default(uuid(7)) @db.Uuid
   name          String?
   email         String?   @unique
   emailVerified DateTime?
   image         String?
   role          Role      @default(MEMBER)
+  passwordHash  String?   @map("password_hash") @db.Text
```

**حقل واحد فقط، اختياري (`?`)** — لا يكسر أي مستخدم مستقبلي يُنشَأ عبر OAuth (لن يملك كلمة مرور أصلاً، وهذا صحيح ومقصود). **لا حذف ولا تعديل على أي حقل/علاقة موجودة** — امتثالاً لقاعدة "لا migrations مدمِّرة" من Phase 12 الأصلية، المُطبَّقة هنا أيضًا رغم عدم ذكرها صراحة في هذه المرحلة.

**أمر الـMigration المُقترَح (لن يُنفَّذ قبل الموافقة):**
```bash
npx prisma migrate dev --name add_user_password_hash
```
على بيئة تطوير محلية فقط، كما وُجِّهنا سابقًا في تعليمات Phase 12 الأصلية (لا `migrate dev` مباشرة على إنتاج).

---

## 5. الملفات التي ستتغيَّر (بعد الموافقة فقط)

| الملف | التغيير المخطَّط |
|---|---|
| `prisma/schema.prisma` | إضافة `passwordHash` كما في القسم 4 |
| `package.json` | إضافة `bcryptjs` + `@types/bcryptjs` (dev) |
| `lib/password.ts` **(جديد)** | دالتا `hashPassword`/`verifyPassword` — غلاف رفيع فوق `bcryptjs` |
| `lib/auth.ts` | إضافة `CredentialsProvider` واحد إلى `providers: []`، يستدعي `verifyPassword` |
| `prisma/seed.ts` | إعادة كتابة كاملة — القسم 6 أدناه |
| `.env.example` | إضافة توثيق لمتغيرين جديدين (القسم 6) |
| `app/[locale]/admin/**` | **لا تعديل** — الحراسة من Phase 0.1 تعمل بمعزل عن طريقة تسجيل الدخول |
| **صفحة تسجيل دخول جديدة؟** | **غير مخطَّط لها في هذه المرحلة** — سيُستخدَم مسار NextAuth الافتراضي `/api/auth/signin` (يعرض نموذج Credentials تلقائيًا بمجرد وجود المزوِّد، بلا أي صفحة مخصَّصة). إن رغبت بصفحة `/admin/login` مصمَّمة، هذا **يتطلب لمس UI** — خارج نطاق هذه المرحلة إلا لو طلبتَه صراحةً كـ"ضرورة قصوى" (كما ورد في تعليماتك) |

---

## 6. آلية آمنة لتهيئة أول ADMIN — بديل السكربت الحالي

### متغيرات بيئة جديدة (تُضاف إلى `.env` محليًا، **لا تُكتَب في الكود إطلاقًا**)
```
BOOTSTRAP_ADMIN_EMAIL="you@yourdomain.com"
BOOTSTRAP_ADMIN_PASSWORD="<كلمة مرور قوية تُختار وقت التشغيل، لا افتراضية>"
```

### `prisma/seed.ts` المُقترَح (منطق فقط، للمراجعة — لم يُطبَّق)
```ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ℹ BOOTSTRAP_ADMIN_EMAIL/BOOTSTRAP_ADMIN_PASSWORD غير مضبوطتين — تخطّي إنشاء الأدمن الأولي.");
    return;
  }
  if (password.length < 12) {
    throw new Error("BOOTSTRAP_ADMIN_PASSWORD يجب ألا تقل عن 12 حرفًا.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`ℹ المستخدم ${email} موجود بالفعل — لن تُستبدَل كلمة المرور تلقائيًا (أمان).`);
    return;
  }

  const passwordHash = await hashPassword(password);
  const admin = await prisma.user.create({
    data: { email, passwordHash, role: "ADMIN", name: "Platform Admin" },
  });
  console.log("✅ أُنشئ أول حساب ADMIN:", admin.email);
}

main().catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

**لماذا هذا آمن:**
- **صفر قيمة ثابتة في الكود** — البريد وكلمة المرور من البيئة فقط، غير موجودين في المستودع.
- **لا يُستبدِل كلمة مرور موجودة أبدًا** — يمنع إعادة التشغيل من الكتابة فوق حساب حقيقي بصمت.
- **يتخطّى بصمت (لا يفشل البناء) إن غابت المتغيرات** — يمنع فشل `npm install`/CI على بيئات لا تحتاج تهيئة أدمن (مثل عمليات نشر لاحقة بعد وجود مستخدمين فعليين).
- **يفرض حدًا أدنى لطول كلمة المرور** — تحقُّق أساسي، لا سياسة كاملة (خارج نطاق هذه المرحلة).
- يُشغَّل **يدويًا مرة واحدة** (`npm run prisma:seed`)، لا تلقائيًا ضمن أي سكربت بناء أو نشر.

---

## 7. `lib/auth.ts` — التعديل المُقترَح دقيقًا (للمراجعة، لم يُطبَّق)

```ts
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/password";

// داخل providers: [ ... ]
CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    const user = await db.user.findUnique({ where: { email: credentials.email } });
    if (!user?.passwordHash) return null; // لا كشف عن سبب الفشل تحديدًا (بريد غير موجود مقابل كلمة مرور خاطئة) — يمنع تعداد البريد (Email Enumeration)

    const isValid = await verifyPassword(credentials.password, user.passwordHash);
    if (!isValid) return null;

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },
}),
```

**ملاحظة أمان مقصودة:** رسالة الفشل موحَّدة (`return null` فقط) لكل من "البريد غير موجود" و"كلمة المرور خاطئة" — تفصيل كامل في `AUTHENTICATION_SECURITY.md`.

---

## ✅ الحالة النهائية — نُفِّذ بالكامل بعد الموافقة

كل البنود الخمسة أعلاه **اعتُمِدت ونُفِّذت فعليًا**:
1. ✔ Credentials هو المزوِّد الوحيد — مُضاف إلى `lib/auth.ts`
2. ✔ `bcryptjs` مُثبَّتة (بلا `@types/bcryptjs` — الحزمة تحمل تعريفاتها الخاصة، تحقَّقت عبر `npm view bcryptjs types`)
3. ✔ Diff الـSchema (القسم 4) **طُبِّق فعليًا** على `prisma/schema.prisma`
4. ✔ `prisma/seed.ts` أُعيدت كتابته بالكامل — استيراد نسبي (`../lib/password`) لا `@/...`، كما طُلب صراحة
5. ✔ لا صفحة `/admin/login` مخصَّصة — الاعتماد على مسار NextAuth الافتراضي كما تقرَّر

**نتائج التحقق الفعلي الكاملة في `docs/AUTHENTICATION_TEST_REPORT.md`** — بما فيها توضيح دقيق لماذا فشلت أوامر Prisma الثلاثة (`format`/`generate`/`migrate dev`) في هذا الصندوق تحديدًا، وإثبات أن كل كود Phase 0.2 يترجَم (Compile) بنجاح كامل بمعزل عن ذلك القيد.
