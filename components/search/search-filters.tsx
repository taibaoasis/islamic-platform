"use client";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { searchResultTypes, type SearchResultType } from "@/lib/mock/search";
import { SlidersHorizontal } from "@/components/icons";

/**
 * SearchFilters — Phase 9.2، القسم 2. تسعة أنواع محتوى.
 *
 * ملاحظة قرار: Design System §11.6 يقترح Drawer للمرشِّحات على الهاتف،
 * لكن Drawer **لم يُبنَ بعد** في مكتبة Phase 8، وتعليمات هذه المرحلة
 * تُلزم "استخدام مكتبة المكونات الحالية فقط". استُخدِم Accordion
 * الموجود مسبقًا كبديل مكافئ وظيفيًا (مطوي افتراضيًا على الهاتف،
 * موسَّع دائمًا على سطح المكتب) بلا إنشاء أي مكوّن جديد.
 *
 * SearchFilters — Phase 9.2, section 2. Nine content types.
 *
 * Decision note: Design System §11.6 suggests a Drawer for filters on
 * mobile, but Drawer **has not been built yet** in the Phase 8 library,
 * and this phase's instructions require "using only the current
 * component library". The existing Accordion is used as a functionally
 * equivalent substitute (collapsed by default on mobile, always
 * expanded on desktop) without creating any new component.
 */
export function SearchFilters({
  activeTypes,
  onChange,
}: {
  activeTypes: SearchResultType[];
  onChange: (types: SearchResultType[]) => void;
}) {
  const t = useTranslations("search.filters");

  function toggle(type: SearchResultType) {
    onChange(activeTypes.includes(type) ? activeTypes.filter((t2) => t2 !== type) : [...activeTypes, type]);
  }

  const list = (
    <ul className="flex flex-col gap-3">
      {searchResultTypes.map((type) => {
        const id = `filter-${type}`;
        return (
          <li key={type} className="flex items-center gap-2">
            <Checkbox id={id} checked={activeTypes.includes(type)} onCheckedChange={() => toggle(type)} />
            <Label htmlFor={id} className="cursor-pointer font-normal">
              {t(`types.${type}`)}
            </Label>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      {activeTypes.length > 0 && (
        <Button variant="ghost" size="sm" className="mb-3 px-0" onClick={() => onChange([])}>
          {t("clearAll")}
        </Button>
      )}

      {/* سطح المكتب — قائمة ظاهرة دائمًا / Desktop — always-visible list */}
      <div className="hidden sm:block">
        <h2 className="mb-3 text-sm font-semibold text-foreground">{t("title")}</h2>
        {list}
      </div>

      {/* الهاتف — Accordion مطوي افتراضيًا / Mobile — collapsed Accordion */}
      <div className="sm:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="rounded-[var(--radius)] border border-border px-3 py-2 hover:no-underline">
              <span className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                {t("title")}
                {activeTypes.length > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {activeTypes.length}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3">{list}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
