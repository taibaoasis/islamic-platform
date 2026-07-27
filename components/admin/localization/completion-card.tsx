import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LanguageInfo, LanguageStats } from "@/lib/mock/localization";

/**
 * CompletionCard — Phase 11, Module 6 §"Translation Progress". يستخدم
 * `Progress` (Phase 8) مباشرة، **لا `ProgressIndicator`** (من وحدة
 * الأكاديمية، Phase 10) رغم تشابهه ظاهريًا — نصوصه مربوطة بمساحة اسم
 * `academy.progress` وتقول "دروس" حرفيًا، فإعادة استخدامه هنا كانت
 * ستُنتج تسمية مضلِّلة ("٣ من ٥ دروس" لعنصر ترجمة). نفس منطق قرارات
 * `StatusBadge` في Module 4/5: إعادة الاستخدام الصحيحة تعني أحيانًا
 * اختيار المكوّن الأدنى مستوى (العام) بدل الأعلى (المُخصَّص).
 *
 * CompletionCard — Phase 11, Module 6, "Translation Progress" section.
 * Uses `Progress` (Phase 8) directly, **not `ProgressIndicator`** (from
 * the Academy module, Phase 10) despite superficial similarity — its
 * text is bound to the `academy.progress` namespace and literally says
 * "lessons", so reusing it here would produce a misleading label ("3 of
 * 5 lessons" for a translation item). Same reasoning as the
 * `StatusBadge` decisions in Module 4/5: correct reuse sometimes means
 * choosing the lower-level (generic) component over the higher-level
 * (specialized) one.
 */
export function CompletionCard({ language, stats }: { language: LanguageInfo; stats: LanguageStats }) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-foreground">{language.nameLocalized.ar}</p>
        <span dir="ltr" className="text-xs uppercase text-muted-foreground">
          {language.isoCode}
        </span>
      </div>
      <Progress value={stats.completionPercentage} aria-label={language.nameLocalized.ar} />
      <p className="mt-1.5 text-xs text-muted-foreground">
        {stats.completionPercentage}% — {stats.publishedItems}/{stats.totalItems}
      </p>
    </Card>
  );
}
