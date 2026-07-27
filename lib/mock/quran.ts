/**
 * بيانات وهمية كاملة لتجربة القرآن (Phase 9.3) — لا اتصال بقاعدة
 * بيانات ولا API. بيانات فهرس السور (الاسم، عدد الآيات، النوع) بيانات
 * مرجعية فعلية دقيقة (مطابقة للعدد الإجمالي المعروف 6236 آية عبر 114
 * سورة) — وهي بيانات فهرسة عامة (كفهرس كتاب) لا نص قرآني، فلا حساسية
 * فيها. **نص كل آية أدناه نائب (Placeholder) صريح، وليس نصًا قرآنيًا
 * حقيقيًا** — النص القرآني الفعلي يُستورَد لاحقًا من مصحف معتمَد فقط
 * (موثَّق في DATABASE_MIGRATION_STRATEGY.md)، لا يُكتَب يدويًا هنا أبدًا.
 *
 * Full mock data for the Quran experience (Phase 9.3) — no database or
 * API connection. The Surah index metadata (name, verse count, type)
 * is accurate factual reference data (matches the well-known total of
 * 6236 verses across 114 surahs) — general index/catalog data (like a
 * book's table of contents), not scripture text, so it carries no
 * sensitivity. **Every verse's text below is an explicit placeholder,
 * not real Quranic text** — actual Quran text is imported later only
 * from a certified mushaf (documented in
 * DATABASE_MIGRATION_STRATEGY.md), never hand-written here.
 */

export interface SurahMeta {
  number: number;
  arabicName: string;
  transliteratedName: string;
  englishName: string;
  verseCount: number;
  revelationType: "MECCAN" | "MEDINAN";
}

export const surahs: SurahMeta[] = [
  { number: 1, arabicName: "الفاتحة", transliteratedName: "Al-Fatihah", englishName: "The Opening", verseCount: 7, revelationType: "MECCAN" },
  { number: 2, arabicName: "البقرة", transliteratedName: "Al-Baqarah", englishName: "The Cow", verseCount: 286, revelationType: "MEDINAN" },
  { number: 3, arabicName: "آل عمران", transliteratedName: "Aal-E-Imran", englishName: "The Family of Imran", verseCount: 200, revelationType: "MEDINAN" },
  { number: 4, arabicName: "النساء", transliteratedName: "An-Nisa", englishName: "The Women", verseCount: 176, revelationType: "MEDINAN" },
  { number: 5, arabicName: "المائدة", transliteratedName: "Al-Ma'idah", englishName: "The Table Spread", verseCount: 120, revelationType: "MEDINAN" },
  { number: 6, arabicName: "الأنعام", transliteratedName: "Al-An'am", englishName: "The Cattle", verseCount: 165, revelationType: "MECCAN" },
  { number: 7, arabicName: "الأعراف", transliteratedName: "Al-A'raf", englishName: "The Heights", verseCount: 206, revelationType: "MECCAN" },
  { number: 8, arabicName: "الأنفال", transliteratedName: "Al-Anfal", englishName: "The Spoils of War", verseCount: 75, revelationType: "MEDINAN" },
  { number: 9, arabicName: "التوبة", transliteratedName: "At-Tawbah", englishName: "The Repentance", verseCount: 129, revelationType: "MEDINAN" },
  { number: 10, arabicName: "يونس", transliteratedName: "Yunus", englishName: "Jonah", verseCount: 109, revelationType: "MECCAN" },
  { number: 11, arabicName: "هود", transliteratedName: "Hud", englishName: "Hud", verseCount: 123, revelationType: "MECCAN" },
  { number: 12, arabicName: "يوسف", transliteratedName: "Yusuf", englishName: "Joseph", verseCount: 111, revelationType: "MECCAN" },
  { number: 13, arabicName: "الرعد", transliteratedName: "Ar-Ra'd", englishName: "The Thunder", verseCount: 43, revelationType: "MEDINAN" },
  { number: 14, arabicName: "إبراهيم", transliteratedName: "Ibrahim", englishName: "Abraham", verseCount: 52, revelationType: "MECCAN" },
  { number: 15, arabicName: "الحجر", transliteratedName: "Al-Hijr", englishName: "The Rocky Tract", verseCount: 99, revelationType: "MECCAN" },
  { number: 16, arabicName: "النحل", transliteratedName: "An-Nahl", englishName: "The Bee", verseCount: 128, revelationType: "MECCAN" },
  { number: 17, arabicName: "الإسراء", transliteratedName: "Al-Isra", englishName: "The Night Journey", verseCount: 111, revelationType: "MECCAN" },
  { number: 18, arabicName: "الكهف", transliteratedName: "Al-Kahf", englishName: "The Cave", verseCount: 110, revelationType: "MECCAN" },
  { number: 19, arabicName: "مريم", transliteratedName: "Maryam", englishName: "Mary", verseCount: 98, revelationType: "MECCAN" },
  { number: 20, arabicName: "طه", transliteratedName: "Ta-Ha", englishName: "Ta-Ha", verseCount: 135, revelationType: "MECCAN" },
  { number: 21, arabicName: "الأنبياء", transliteratedName: "Al-Anbiya", englishName: "The Prophets", verseCount: 112, revelationType: "MECCAN" },
  { number: 22, arabicName: "الحج", transliteratedName: "Al-Hajj", englishName: "The Pilgrimage", verseCount: 78, revelationType: "MEDINAN" },
  { number: 23, arabicName: "المؤمنون", transliteratedName: "Al-Mu'minun", englishName: "The Believers", verseCount: 118, revelationType: "MECCAN" },
  { number: 24, arabicName: "النور", transliteratedName: "An-Nur", englishName: "The Light", verseCount: 64, revelationType: "MEDINAN" },
  { number: 25, arabicName: "الفرقان", transliteratedName: "Al-Furqan", englishName: "The Criterion", verseCount: 77, revelationType: "MECCAN" },
  { number: 26, arabicName: "الشعراء", transliteratedName: "Ash-Shu'ara", englishName: "The Poets", verseCount: 227, revelationType: "MECCAN" },
  { number: 27, arabicName: "النمل", transliteratedName: "An-Naml", englishName: "The Ant", verseCount: 93, revelationType: "MECCAN" },
  { number: 28, arabicName: "القصص", transliteratedName: "Al-Qasas", englishName: "The Stories", verseCount: 88, revelationType: "MECCAN" },
  { number: 29, arabicName: "العنكبوت", transliteratedName: "Al-Ankabut", englishName: "The Spider", verseCount: 69, revelationType: "MECCAN" },
  { number: 30, arabicName: "الروم", transliteratedName: "Ar-Rum", englishName: "The Romans", verseCount: 60, revelationType: "MECCAN" },
  { number: 31, arabicName: "لقمان", transliteratedName: "Luqman", englishName: "Luqman", verseCount: 34, revelationType: "MECCAN" },
  { number: 32, arabicName: "السجدة", transliteratedName: "As-Sajdah", englishName: "The Prostration", verseCount: 30, revelationType: "MECCAN" },
  { number: 33, arabicName: "الأحزاب", transliteratedName: "Al-Ahzab", englishName: "The Combined Forces", verseCount: 73, revelationType: "MEDINAN" },
  { number: 34, arabicName: "سبأ", transliteratedName: "Saba", englishName: "Sheba", verseCount: 54, revelationType: "MECCAN" },
  { number: 35, arabicName: "فاطر", transliteratedName: "Fatir", englishName: "Originator", verseCount: 45, revelationType: "MECCAN" },
  { number: 36, arabicName: "يس", transliteratedName: "Ya-Sin", englishName: "Ya Sin", verseCount: 83, revelationType: "MECCAN" },
  { number: 37, arabicName: "الصافات", transliteratedName: "As-Saffat", englishName: "Those who set the Ranks", verseCount: 182, revelationType: "MECCAN" },
  { number: 38, arabicName: "ص", transliteratedName: "Sad", englishName: "The Letter Sad", verseCount: 88, revelationType: "MECCAN" },
  { number: 39, arabicName: "الزمر", transliteratedName: "Az-Zumar", englishName: "The Troops", verseCount: 75, revelationType: "MECCAN" },
  { number: 40, arabicName: "غافر", transliteratedName: "Ghafir", englishName: "The Forgiver", verseCount: 85, revelationType: "MECCAN" },
  { number: 41, arabicName: "فصلت", transliteratedName: "Fussilat", englishName: "Explained in Detail", verseCount: 54, revelationType: "MECCAN" },
  { number: 42, arabicName: "الشورى", transliteratedName: "Ash-Shura", englishName: "The Consultation", verseCount: 53, revelationType: "MECCAN" },
  { number: 43, arabicName: "الزخرف", transliteratedName: "Az-Zukhruf", englishName: "The Gold Adornments", verseCount: 89, revelationType: "MECCAN" },
  { number: 44, arabicName: "الدخان", transliteratedName: "Ad-Dukhan", englishName: "The Smoke", verseCount: 59, revelationType: "MECCAN" },
  { number: 45, arabicName: "الجاثية", transliteratedName: "Al-Jathiyah", englishName: "The Crouching", verseCount: 37, revelationType: "MECCAN" },
  { number: 46, arabicName: "الأحقاف", transliteratedName: "Al-Ahqaf", englishName: "The Wind-Curved Sandhills", verseCount: 35, revelationType: "MECCAN" },
  { number: 47, arabicName: "محمد", transliteratedName: "Muhammad", englishName: "Muhammad", verseCount: 38, revelationType: "MEDINAN" },
  { number: 48, arabicName: "الفتح", transliteratedName: "Al-Fath", englishName: "The Victory", verseCount: 29, revelationType: "MEDINAN" },
  { number: 49, arabicName: "الحجرات", transliteratedName: "Al-Hujurat", englishName: "The Rooms", verseCount: 18, revelationType: "MEDINAN" },
  { number: 50, arabicName: "ق", transliteratedName: "Qaf", englishName: "The Letter Qaf", verseCount: 45, revelationType: "MECCAN" },
  { number: 51, arabicName: "الذاريات", transliteratedName: "Adh-Dhariyat", englishName: "The Winnowing Winds", verseCount: 60, revelationType: "MECCAN" },
  { number: 52, arabicName: "الطور", transliteratedName: "At-Tur", englishName: "The Mount", verseCount: 49, revelationType: "MECCAN" },
  { number: 53, arabicName: "النجم", transliteratedName: "An-Najm", englishName: "The Star", verseCount: 62, revelationType: "MECCAN" },
  { number: 54, arabicName: "القمر", transliteratedName: "Al-Qamar", englishName: "The Moon", verseCount: 55, revelationType: "MECCAN" },
  { number: 55, arabicName: "الرحمن", transliteratedName: "Ar-Rahman", englishName: "The Beneficent", verseCount: 78, revelationType: "MEDINAN" },
  { number: 56, arabicName: "الواقعة", transliteratedName: "Al-Waqi'ah", englishName: "The Inevitable", verseCount: 96, revelationType: "MECCAN" },
  { number: 57, arabicName: "الحديد", transliteratedName: "Al-Hadid", englishName: "The Iron", verseCount: 29, revelationType: "MEDINAN" },
  { number: 58, arabicName: "المجادلة", transliteratedName: "Al-Mujadilah", englishName: "The Pleading Woman", verseCount: 22, revelationType: "MEDINAN" },
  { number: 59, arabicName: "الحشر", transliteratedName: "Al-Hashr", englishName: "The Exile", verseCount: 24, revelationType: "MEDINAN" },
  { number: 60, arabicName: "الممتحنة", transliteratedName: "Al-Mumtahanah", englishName: "She that is to be examined", verseCount: 13, revelationType: "MEDINAN" },
  { number: 61, arabicName: "الصف", transliteratedName: "As-Saff", englishName: "The Ranks", verseCount: 14, revelationType: "MEDINAN" },
  { number: 62, arabicName: "الجمعة", transliteratedName: "Al-Jumu'ah", englishName: "The Congregation, Friday", verseCount: 11, revelationType: "MEDINAN" },
  { number: 63, arabicName: "المنافقون", transliteratedName: "Al-Munafiqun", englishName: "The Hypocrites", verseCount: 11, revelationType: "MEDINAN" },
  { number: 64, arabicName: "التغابن", transliteratedName: "At-Taghabun", englishName: "The Mutual Disillusion", verseCount: 18, revelationType: "MEDINAN" },
  { number: 65, arabicName: "الطلاق", transliteratedName: "At-Talaq", englishName: "The Divorce", verseCount: 12, revelationType: "MEDINAN" },
  { number: 66, arabicName: "التحريم", transliteratedName: "At-Tahrim", englishName: "The Prohibition", verseCount: 12, revelationType: "MEDINAN" },
  { number: 67, arabicName: "الملك", transliteratedName: "Al-Mulk", englishName: "The Sovereignty", verseCount: 30, revelationType: "MECCAN" },
  { number: 68, arabicName: "القلم", transliteratedName: "Al-Qalam", englishName: "The Pen", verseCount: 52, revelationType: "MECCAN" },
  { number: 69, arabicName: "الحاقة", transliteratedName: "Al-Haqqah", englishName: "The Reality", verseCount: 52, revelationType: "MECCAN" },
  { number: 70, arabicName: "المعارج", transliteratedName: "Al-Ma'arij", englishName: "The Ascending Stairways", verseCount: 44, revelationType: "MECCAN" },
  { number: 71, arabicName: "نوح", transliteratedName: "Nuh", englishName: "Noah", verseCount: 28, revelationType: "MECCAN" },
  { number: 72, arabicName: "الجن", transliteratedName: "Al-Jinn", englishName: "The Jinn", verseCount: 28, revelationType: "MECCAN" },
  { number: 73, arabicName: "المزمل", transliteratedName: "Al-Muzzammil", englishName: "The Enshrouded One", verseCount: 20, revelationType: "MECCAN" },
  { number: 74, arabicName: "المدثر", transliteratedName: "Al-Muddaththir", englishName: "The Cloaked One", verseCount: 56, revelationType: "MECCAN" },
  { number: 75, arabicName: "القيامة", transliteratedName: "Al-Qiyamah", englishName: "The Resurrection", verseCount: 40, revelationType: "MECCAN" },
  { number: 76, arabicName: "الإنسان", transliteratedName: "Al-Insan", englishName: "The Man", verseCount: 31, revelationType: "MEDINAN" },
  { number: 77, arabicName: "المرسلات", transliteratedName: "Al-Mursalat", englishName: "The Emissaries", verseCount: 50, revelationType: "MECCAN" },
  { number: 78, arabicName: "النبأ", transliteratedName: "An-Naba", englishName: "The Tidings", verseCount: 40, revelationType: "MECCAN" },
  { number: 79, arabicName: "النازعات", transliteratedName: "An-Nazi'at", englishName: "Those who drag forth", verseCount: 46, revelationType: "MECCAN" },
  { number: 80, arabicName: "عبس", transliteratedName: "Abasa", englishName: "He Frowned", verseCount: 42, revelationType: "MECCAN" },
  { number: 81, arabicName: "التكوير", transliteratedName: "At-Takwir", englishName: "The Overthrowing", verseCount: 29, revelationType: "MECCAN" },
  { number: 82, arabicName: "الإنفطار", transliteratedName: "Al-Infitar", englishName: "The Cleaving", verseCount: 19, revelationType: "MECCAN" },
  { number: 83, arabicName: "المطففين", transliteratedName: "Al-Mutaffifin", englishName: "Defrauding", verseCount: 36, revelationType: "MECCAN" },
  { number: 84, arabicName: "الإنشقاق", transliteratedName: "Al-Inshiqaq", englishName: "The Sundering", verseCount: 25, revelationType: "MECCAN" },
  { number: 85, arabicName: "البروج", transliteratedName: "Al-Buruj", englishName: "The Mansions of the Stars", verseCount: 22, revelationType: "MECCAN" },
  { number: 86, arabicName: "الطارق", transliteratedName: "At-Tariq", englishName: "The Morning Star", verseCount: 17, revelationType: "MECCAN" },
  { number: 87, arabicName: "الأعلى", transliteratedName: "Al-A'la", englishName: "The Most High", verseCount: 19, revelationType: "MECCAN" },
  { number: 88, arabicName: "الغاشية", transliteratedName: "Al-Ghashiyah", englishName: "The Overwhelming", verseCount: 26, revelationType: "MECCAN" },
  { number: 89, arabicName: "الفجر", transliteratedName: "Al-Fajr", englishName: "The Dawn", verseCount: 30, revelationType: "MECCAN" },
  { number: 90, arabicName: "البلد", transliteratedName: "Al-Balad", englishName: "The City", verseCount: 20, revelationType: "MECCAN" },
  { number: 91, arabicName: "الشمس", transliteratedName: "Ash-Shams", englishName: "The Sun", verseCount: 15, revelationType: "MECCAN" },
  { number: 92, arabicName: "الليل", transliteratedName: "Al-Layl", englishName: "The Night", verseCount: 21, revelationType: "MECCAN" },
  { number: 93, arabicName: "الضحى", transliteratedName: "Ad-Duhaa", englishName: "The Morning Hours", verseCount: 11, revelationType: "MECCAN" },
  { number: 94, arabicName: "الشرح", transliteratedName: "Ash-Sharh", englishName: "The Relief", verseCount: 8, revelationType: "MECCAN" },
  { number: 95, arabicName: "التين", transliteratedName: "At-Tin", englishName: "The Fig", verseCount: 8, revelationType: "MECCAN" },
  { number: 96, arabicName: "العلق", transliteratedName: "Al-Alaq", englishName: "The Clot", verseCount: 19, revelationType: "MECCAN" },
  { number: 97, arabicName: "القدر", transliteratedName: "Al-Qadr", englishName: "The Power, Fate", verseCount: 5, revelationType: "MECCAN" },
  { number: 98, arabicName: "البينة", transliteratedName: "Al-Bayyinah", englishName: "The Clear Proof", verseCount: 8, revelationType: "MEDINAN" },
  { number: 99, arabicName: "الزلزلة", transliteratedName: "Az-Zalzalah", englishName: "The Earthquake", verseCount: 8, revelationType: "MEDINAN" },
  { number: 100, arabicName: "العاديات", transliteratedName: "Al-Adiyat", englishName: "The Courser", verseCount: 11, revelationType: "MECCAN" },
  { number: 101, arabicName: "القارعة", transliteratedName: "Al-Qari'ah", englishName: "The Calamity", verseCount: 11, revelationType: "MECCAN" },
  { number: 102, arabicName: "التكاثر", transliteratedName: "At-Takathur", englishName: "The Rivalry in world increase", verseCount: 8, revelationType: "MECCAN" },
  { number: 103, arabicName: "العصر", transliteratedName: "Al-Asr", englishName: "The Declining Day", verseCount: 3, revelationType: "MECCAN" },
  { number: 104, arabicName: "الهمزة", transliteratedName: "Al-Humazah", englishName: "The Traducer", verseCount: 9, revelationType: "MECCAN" },
  { number: 105, arabicName: "الفيل", transliteratedName: "Al-Fil", englishName: "The Elephant", verseCount: 5, revelationType: "MECCAN" },
  { number: 106, arabicName: "قريش", transliteratedName: "Quraysh", englishName: "Quraysh", verseCount: 4, revelationType: "MECCAN" },
  { number: 107, arabicName: "الماعون", transliteratedName: "Al-Ma'un", englishName: "The Small Kindnesses", verseCount: 7, revelationType: "MECCAN" },
  { number: 108, arabicName: "الكوثر", transliteratedName: "Al-Kawthar", englishName: "The Abundance", verseCount: 3, revelationType: "MECCAN" },
  { number: 109, arabicName: "الكافرون", transliteratedName: "Al-Kafirun", englishName: "The Disbelievers", verseCount: 6, revelationType: "MECCAN" },
  { number: 110, arabicName: "النصر", transliteratedName: "An-Nasr", englishName: "The Divine Support", verseCount: 3, revelationType: "MEDINAN" },
  { number: 111, arabicName: "المسد", transliteratedName: "Al-Masad", englishName: "The Palm Fiber", verseCount: 5, revelationType: "MECCAN" },
  { number: 112, arabicName: "الإخلاص", transliteratedName: "Al-Ikhlas", englishName: "The Sincerity", verseCount: 4, revelationType: "MECCAN" },
  { number: 113, arabicName: "الفلق", transliteratedName: "Al-Falaq", englishName: "The Daybreak", verseCount: 5, revelationType: "MECCAN" },
  { number: 114, arabicName: "الناس", transliteratedName: "An-Nas", englishName: "Mankind", verseCount: 6, revelationType: "MECCAN" },
];
export function getSurahByNumber(number: number): SurahMeta | undefined {
  return surahs.find((s) => s.number === number);
}

export function getAdjacentSurahs(number: number): { previous?: SurahMeta; next?: SurahMeta } {
  return {
    previous: surahs.find((s) => s.number === number - 1),
    next: surahs.find((s) => s.number === number + 1),
  };
}

/** وصف مختصر Mock — نمط موحَّد صريح، لا محتوى فريد مؤلَّف لكل سورة. Mock short description — an explicit uniform template, not unique authored content per surah. */
export function getMockDescription(surah: SurahMeta): string {
  const typeLabel = surah.revelationType === "MECCAN" ? "مكية" : "مدنية";
  return `سورة ${surah.arabicName} (${surah.englishName}) سورة ${typeLabel}، تتألف من ${surah.verseCount} آية. وصف تعريفي تجريبي لأغراض العرض — يُستبدَل لاحقًا بمحتوى علمي معتمَد.`;
}

export interface MockVerse {
  numberInSurah: number;
  /** نائب صريح — ليس نصًا قرآنيًا حقيقيًا. Explicit placeholder — not real Quranic text. */
  placeholderText: string;
}

/** يولِّد آيات نائبة بعدد آيات السورة الحقيقي — للتخطيط والعرض فقط. Generates placeholder verses matching the surah's real verse count — for layout/display only. */
export function getMockVerses(surah: SurahMeta): MockVerse[] {
  return Array.from({ length: surah.verseCount }, (_, i) => ({
    numberInSurah: i + 1,
    placeholderText: `﴿ نص الآية رقم ${i + 1} — سيُستورَد النص القرآني المعتمَد لاحقًا من مصحف موثَّق ﴾`,
  }));
}
