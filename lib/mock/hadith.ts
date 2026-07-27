/**
 * بيانات وهمية كاملة لتجربة الحديث (Phase 9.4) — لا اتصال بقاعدة
 * بيانات ولا API. بيانات المجموعات الحديثية الست (الاسم، المُصنِّف،
 * الحقبة) بيانات مرجعية فعلية دقيقة (كفهرس كتاب)، وأسماء الرواة في
 * سلاسل الإسناد شخصيات تاريخية حقيقية موثَّقة (كالصحابة رضي الله
 * عنهم) — بيانات فهرسة عامة لا حساسية فيها. **متن كل حديث أدناه نائب
 * (Placeholder) صريح، وليس نصًا حديثيًا حقيقيًا منسوبًا** — المتن
 * الفعلي يُستورَد لاحقًا من مصدر معتمَد فقط (نفس مبدأ lib/mock/quran.ts)،
 * لا يُكتَب يدويًا هنا أبدًا، ولا يُنسَب فعليًا لأي راوٍ.
 *
 * Full mock data for the Hadith experience (Phase 9.4) — no database or
 * API connection. The six canonical collections' metadata (name,
 * compiler, era) is accurate factual reference data (like a book
 * index), and narrator-chain names are real documented historical
 * figures (e.g. Companions) — general index data, no sensitivity.
 * **Every hadith's matn below is an explicit placeholder, not a real
 * hadith text** — the actual matn is imported later only from a
 * certified source (same principle as lib/mock/quran.ts), never
 * hand-written here, and never actually attributed to any narrator.
 */

export type HadithGrade = "SAHIH" | "HASAN" | "DAIF";

export interface HadithCollectionMeta {
  slug: string;
  arabicName: string;
  englishName: string;
  compiler: string;
  era: string;
  hadithCount: number;
}

export const hadithCollections: HadithCollectionMeta[] = [
  { slug: "bukhari", arabicName: "صحيح البخاري", englishName: "Sahih al-Bukhari", compiler: "الإمام محمد بن إسماعيل البخاري", era: "القرن 3 هـ", hadithCount: 7563 },
  { slug: "muslim", arabicName: "صحيح مسلم", englishName: "Sahih Muslim", compiler: "الإمام مسلم بن الحجاج النيسابوري", era: "القرن 3 هـ", hadithCount: 7500 },
  { slug: "abudawud", arabicName: "سنن أبي داود", englishName: "Sunan Abi Dawud", compiler: "الإمام سليمان بن الأشعث السجستاني", era: "القرن 3 هـ", hadithCount: 5274 },
  { slug: "tirmidhi", arabicName: "جامع الترمذي", englishName: "Jami' at-Tirmidhi", compiler: "الإمام محمد بن عيسى الترمذي", era: "القرن 3 هـ", hadithCount: 3956 },
  { slug: "nasai", arabicName: "سنن النسائي", englishName: "Sunan an-Nasa'i", compiler: "الإمام أحمد بن شعيب النسائي", era: "القرن 3 هـ", hadithCount: 5761 },
  { slug: "ibnmajah", arabicName: "سنن ابن ماجه", englishName: "Sunan Ibn Majah", compiler: "الإمام محمد بن يزيد ابن ماجه", era: "القرن 3 هـ", hadithCount: 4341 },
];

const narratorPool = [
  "أبو هريرة رضي الله عنه",
  "عبد الله بن عمر رضي الله عنهما",
  "عائشة أم المؤمنين رضي الله عنها",
  "أنس بن مالك رضي الله عنه",
  "عبد الله بن عباس رضي الله عنهما",
  "الزهري",
  "قتادة بن دعامة",
  "سفيان الثوري",
  "شعبة بن الحجاج",
];

export interface MockHadith {
  id: string;
  collectionSlug: string;
  numberInCollection: number;
  grade: HadithGrade;
  narrators: string[];
  /** نائب صريح — ليس نصًا حديثيًا حقيقيًا. Explicit placeholder — not a real hadith text. */
  matnPlaceholder: string;
  topic: string;
}

const topics = ["الطهارة", "الصلاة", "الزكاة", "الصيام", "الأدب والأخلاق", "البيوع"];

function buildChain(seed: number): string[] {
  const start = seed % narratorPool.length;
  return [narratorPool[start], narratorPool[(start + 3) % narratorPool.length], narratorPool[(start + 5) % narratorPool.length]].filter(
    (n): n is string => Boolean(n)
  );
}

function buildHadithsForCollection(collection: HadithCollectionMeta, count: number): MockHadith[] {
  return Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    const grade: HadithGrade = collection.slug === "bukhari" || collection.slug === "muslim" ? "SAHIH" : (number % 5 === 0 ? "DAIF" : number % 3 === 0 ? "HASAN" : "SAHIH");
    return {
      id: `${collection.slug}-${number}`,
      collectionSlug: collection.slug,
      numberInCollection: number,
      grade,
      narrators: buildChain(number),
      matnPlaceholder: `[ نص الحديث رقم ${number} — سيُستورَد المتن المعتمَد لاحقًا من مصدر موثَّق، ولن يُنسَب لأي راوٍ إلا بعد تحقق علمي كامل ]`,
      topic: topics[number % topics.length] ?? topics[0]!,
    };
  });
}

export const mockHadithsByCollection: Record<string, MockHadith[]> = Object.fromEntries(
  hadithCollections.map((c) => [c.slug, buildHadithsForCollection(c, 12)])
);

export function getCollectionBySlug(slug: string): HadithCollectionMeta | undefined {
  return hadithCollections.find((c) => c.slug === slug);
}

export function getHadithsForCollection(slug: string): MockHadith[] {
  return mockHadithsByCollection[slug] ?? [];
}

export function getMockCollectionDescription(collection: HadithCollectionMeta): string {
  return `${collection.arabicName} (${collection.englishName})، للمُصنِّف ${collection.compiler}، من علماء ${collection.era}. وصف تعريفي تجريبي لأغراض العرض — يُستبدَل لاحقًا بمحتوى علمي معتمَد.`;
}
