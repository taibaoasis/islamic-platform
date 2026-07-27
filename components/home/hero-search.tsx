"use client";

import { useState, type FormEvent } from "react";

import { SearchInput } from "@/components/ui/search-input";
import { useRouter } from "@/i18n/navigation";

/**
 * ملف جديد — غلاف عميل صغير حول SearchInput (مكوّن موجود مسبقًا في
 * المكتبة) لأن SearchInput مُتحكَّم به (Controlled) بتصميم مقصود
 * (Phase 8) ويتطلب حالة من المستدعي. عند الإرسال يوجِّه المستخدم إلى
 * صفحة البحث الفعلية (Phase 9.2) — لا استدعاء بحث هنا نفسه (لا Backend).
 *
 * New file — a small client wrapper around SearchInput (an existing
 * library component) because SearchInput is intentionally controlled
 * (Phase 8) and requires state from its caller. On submit it navigates
 * to the real search page (Phase 9.2) — no search call happens here
 * itself (no backend).
 */
export function HeroSearch({ placeholder, ariaLabel }: { placeholder: string; ariaLabel: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-12 text-base shadow-sm"
      />
    </form>
  );
}
