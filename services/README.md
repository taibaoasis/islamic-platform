# services/

طبقة الخدمات — منطق الأعمال والوصول للبيانات، منفصل عن مكوّنات الواجهة
وعن Route Handlers. تُستدعى من Server Components أو Server Actions أو
Route Handlers، ولا تُستورد مباشرة في مكوّنات العميل.

الملف الوحيد المُنشأ في هذه المرحلة هو `auth.service.ts` (طبقة صلاحيات
أساسية). خدمات المحتوى (quran.service.ts، hadith.service.ts...) تُضاف
في مرحلة لاحقة بعد اعتماد نماذج قاعدة البيانات التفصيلية.

---

Service layer — business logic and data access, kept separate from UI
components and Route Handlers. Called from Server Components, Server
Actions, or Route Handlers; never imported directly into client
components.

The only file created in this phase is `auth.service.ts` (a basic
permissions layer). Content services (quran.service.ts,
hadith.service.ts...) are added in a later phase once detailed database
models are approved.
