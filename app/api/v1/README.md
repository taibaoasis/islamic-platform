# app/api/v1/

نقطة انطلاق REST API قابلة للتوسع عبر Route Handlers في Next.js.

**الاصطلاح المعتمد:**
- كل مورد (resource) يحصل على مجلد خاص: `app/api/v1/<resource>/route.ts`
  للعمليات على المجموعة (GET/POST)، و `app/api/v1/<resource>/[id]/route.ts`
  للعمليات على عنصر واحد (GET/PATCH/DELETE).
- الإصدار (`v1`) في المسار يسمح بإصدارات مستقبلية (`v2`) دون كسر التوافق.
- كل استجابة تتبع الشكل الموحّد `ApiResponse<T>` المعرَّف في `types/index.ts`.
- التحقق من الصلاحيات يتم عبر `services/auth.service.ts` (`requirePermission`).

لا يوجد أي مورد فعلي بعد في هذه المرحلة — البنية جاهزة فقط.

---

Scalable REST API entry point via Next.js Route Handlers.

**Convention:**
- Each resource gets its own folder: `app/api/v1/<resource>/route.ts` for
  collection operations (GET/POST), and
  `app/api/v1/<resource>/[id]/route.ts` for single-item operations
  (GET/PATCH/DELETE).
- The `v1` version segment allows a future `v2` without breaking
  compatibility.
- Every response follows the uniform `ApiResponse<T>` shape defined in
  `types/index.ts`.
- Authorization is checked via `services/auth.service.ts`
  (`requirePermission`).

No real resource exists yet in this phase — the structure is scaffolded
only.
