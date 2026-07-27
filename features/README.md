# features/

بنية منظَّمة حسب الميزة (Feature-based architecture). كل ميزة مستقبلية
(مثل القرآن، الحديث، التعليم، المجتمع...) ستحصل على مجلد خاص بها هنا،
بالشكل التالي:

```
features/
  <feature-name>/
    components/   مكوّنات خاصة بهذه الميزة فقط
    hooks/        خطافات خاصة بهذه الميزة
    services/     منطق الوصول للبيانات الخاص بها
    types.ts      أنواع TypeScript الخاصة بها
    index.ts      نقطة تصدير عامة للميزة
```

لا تُنشأ أي ميزة فعلية في هذه المرحلة (البنية التقنية الأساسية فقط) —
هذا المجلد فارغ عمدًا وينتظر موافقة صريحة على المرحلة التالية.

---

Feature-based architecture. Every future feature (Quran, Hadith,
Education, Community...) will get its own folder here, shaped as shown
above.

No feature is created in this phase (foundational scaffolding only) —
this folder is intentionally empty pending explicit approval for the
next phase.
