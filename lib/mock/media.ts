/**
 * بيانات وهمية لمكتبة الوسائط (Phase 11, Module 4) — لا اتصال بقاعدة
 * بيانات، لا خدمة تخزين حقيقية (S3 أو غيرها)، لا رفع فعلي. 25 عنصرًا
 * موزَّعة على الأنواع الأربعة (صور، صوتيات، فيديو، مستندات) لاختبار
 * البحث والفلاتر والفرز والصفحات وعرضي Grid/List معًا.
 *
 * Mock data for the Media Library (Phase 11, Module 4) — no database
 * connection, no real storage service (S3 or otherwise), no real
 * upload. 25 items spread across the four types (images, audio, video,
 * documents) to exercise search/filter/sort/pagination and both
 * Grid/List views.
 */

export type MediaType = "image" | "audio" | "video" | "document";

export interface MediaUsageRef {
  title: string;
  kind: string;
  href: string;
}

export interface MediaAsset {
  id: string;
  type: MediaType;
  name: string;
  fileSizeBytes: number;
  dimensions?: { width: number; height: number };
  durationSeconds?: number;
  uploadedAt: string;
  uploadedBy: string;
  usageCount: number;
  altText: string | null;
  caption: string | null;
  description: string;
  tags: string[];
  usedIn: MediaUsageRef[];
}

export const mockMediaAssets: MediaAsset[] =
[
  {
    "id": "m1",
    "type": "image",
    "name": "غلاف مقالة التقوى",
    "fileSizeBytes": 120000,
    "uploadedAt": "2026-02-02T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": "نص بديل لِـغلاف مقالة التقوى",
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: غلاف مقالة التقوى.",
    "tags": [
      "رمضان",
      "الحديث"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1200,
      "height": 800
    }
  },
  {
    "id": "m2",
    "type": "image",
    "name": "صورة المسجد الحرام",
    "fileSizeBytes": 154000,
    "uploadedAt": "2026-03-03T09:00:00Z",
    "uploadedBy": "د. أحمد المنصوري",
    "usageCount": 2,
    "altText": "نص بديل لِـصورة المسجد الحرام",
    "caption": "تعليق توضيحي على صورة المسجد الحرام",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: صورة المسجد الحرام.",
    "tags": [
      "القرآن",
      "تصميم"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1240,
      "height": 820
    }
  },
  {
    "id": "m3",
    "type": "image",
    "name": "خط عربي زخرفي",
    "fileSizeBytes": 188000,
    "uploadedAt": "2026-04-04T09:00:00Z",
    "uploadedBy": "المشرف الإداري",
    "usageCount": 3,
    "altText": "نص بديل لِـخط عربي زخرفي",
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: خط عربي زخرفي.",
    "tags": [
      "الحديث",
      "أرشيف"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1280,
      "height": 840
    }
  },
  {
    "id": "m4",
    "type": "image",
    "name": "صورة المسجد النبوي",
    "fileSizeBytes": 222000,
    "uploadedAt": "2026-05-05T09:00:00Z",
    "uploadedBy": "فريق المنصة",
    "usageCount": 0,
    "altText": "نص بديل لِـصورة المسجد النبوي",
    "caption": "تعليق توضيحي على صورة المسجد النبوي",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: صورة المسجد النبوي.",
    "tags": [
      "تصميم",
      "دعوة"
    ],
    "usedIn": [],
    "dimensions": {
      "width": 1320,
      "height": 860
    }
  },
  {
    "id": "m5",
    "type": "image",
    "name": "أيقونة القرآن",
    "fileSizeBytes": 256000,
    "uploadedAt": "2026-06-06T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": "نص بديل لِـأيقونة القرآن",
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: أيقونة القرآن.",
    "tags": [
      "أرشيف",
      "تعليمي"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1360,
      "height": 880
    }
  },
  {
    "id": "m6",
    "type": "image",
    "name": "خلفية رمضان",
    "fileSizeBytes": 290000,
    "uploadedAt": "2026-07-07T09:00:00Z",
    "uploadedBy": "د. أحمد المنصوري",
    "usageCount": 2,
    "altText": "نص بديل لِـخلفية رمضان",
    "caption": "تعليق توضيحي على خلفية رمضان",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: خلفية رمضان.",
    "tags": [
      "دعوة",
      "رمضان"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1400,
      "height": 900
    }
  },
  {
    "id": "m7",
    "type": "image",
    "name": "صورة الأذان",
    "fileSizeBytes": 324000,
    "uploadedAt": "2026-01-08T09:00:00Z",
    "uploadedBy": "المشرف الإداري",
    "usageCount": 3,
    "altText": "نص بديل لِـصورة الأذان",
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: صورة الأذان.",
    "tags": [
      "تعليمي",
      "القرآن"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1440,
      "height": 920
    }
  },
  {
    "id": "m8",
    "type": "image",
    "name": "لوحة آية الكرسي",
    "fileSizeBytes": 358000,
    "uploadedAt": "2026-02-09T09:00:00Z",
    "uploadedBy": "فريق المنصة",
    "usageCount": 0,
    "altText": "نص بديل لِـلوحة آية الكرسي",
    "caption": "تعليق توضيحي على لوحة آية الكرسي",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: لوحة آية الكرسي.",
    "tags": [
      "رمضان",
      "الحديث"
    ],
    "usedIn": [],
    "dimensions": {
      "width": 1480,
      "height": 940
    }
  },
  {
    "id": "m9",
    "type": "image",
    "name": "صورة مكتبة إسلامية",
    "fileSizeBytes": 392000,
    "uploadedAt": "2026-03-10T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": "نص بديل لِـصورة مكتبة إسلامية",
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: صورة مكتبة إسلامية.",
    "tags": [
      "القرآن",
      "تصميم"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1520,
      "height": 960
    }
  },
  {
    "id": "m10",
    "type": "image",
    "name": "أيقونة الصلاة",
    "fileSizeBytes": 426000,
    "uploadedAt": "2026-04-11T09:00:00Z",
    "uploadedBy": "د. أحمد المنصوري",
    "usageCount": 2,
    "altText": "نص بديل لِـأيقونة الصلاة",
    "caption": "تعليق توضيحي على أيقونة الصلاة",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: أيقونة الصلاة.",
    "tags": [
      "الحديث",
      "أرشيف"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "dimensions": {
      "width": 1560,
      "height": 980
    }
  },
  {
    "id": "m11",
    "type": "audio",
    "name": "تلاوة سورة الرحمن",
    "fileSizeBytes": 3500000,
    "uploadedAt": "2026-05-12T09:00:00Z",
    "uploadedBy": "المشرف الإداري",
    "usageCount": 3,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: تلاوة سورة الرحمن.",
    "tags": [
      "تصميم",
      "دعوة"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 300
  },
  {
    "id": "m12",
    "type": "audio",
    "name": "محاضرة الصبر عند الابتلاء",
    "fileSizeBytes": 4300000,
    "uploadedAt": "2026-06-13T09:00:00Z",
    "uploadedBy": "فريق المنصة",
    "usageCount": 0,
    "altText": null,
    "caption": "تعليق توضيحي على محاضرة الصبر عند الابتلاء",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: محاضرة الصبر عند الابتلاء.",
    "tags": [
      "أرشيف",
      "تعليمي"
    ],
    "usedIn": [],
    "durationSeconds": 395
  },
  {
    "id": "m13",
    "type": "audio",
    "name": "خطبة الجمعة - التقوى",
    "fileSizeBytes": 5100000,
    "uploadedAt": "2026-07-14T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: خطبة الجمعة - التقوى.",
    "tags": [
      "دعوة",
      "رمضان"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 490
  },
  {
    "id": "m14",
    "type": "audio",
    "name": "تلاوة سورة يس",
    "fileSizeBytes": 5900000,
    "uploadedAt": "2026-01-15T09:00:00Z",
    "uploadedBy": "د. أحمد المنصوري",
    "usageCount": 2,
    "altText": null,
    "caption": "تعليق توضيحي على تلاوة سورة يس",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: تلاوة سورة يس.",
    "tags": [
      "تعليمي",
      "القرآن"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 585
  },
  {
    "id": "m15",
    "type": "audio",
    "name": "درس صوتي - آداب الدعاء",
    "fileSizeBytes": 6700000,
    "uploadedAt": "2026-02-16T09:00:00Z",
    "uploadedBy": "المشرف الإداري",
    "usageCount": 3,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: درس صوتي - آداب الدعاء.",
    "tags": [
      "رمضان",
      "الحديث"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 680
  },
  {
    "id": "m16",
    "type": "video",
    "name": "شرح أركان الإسلام",
    "fileSizeBytes": 24000000,
    "uploadedAt": "2026-03-17T09:00:00Z",
    "uploadedBy": "فريق المنصة",
    "usageCount": 0,
    "altText": null,
    "caption": "تعليق توضيحي على شرح أركان الإسلام",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: شرح أركان الإسلام.",
    "tags": [
      "القرآن",
      "تصميم"
    ],
    "usedIn": [],
    "durationSeconds": 600
  },
  {
    "id": "m17",
    "type": "video",
    "name": "قصة هجرة النبي ﷺ",
    "fileSizeBytes": 29000000,
    "uploadedAt": "2026-04-18T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: قصة هجرة النبي ﷺ.",
    "tags": [
      "الحديث",
      "أرشيف"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 780
  },
  {
    "id": "m18",
    "type": "video",
    "name": "محاضرة فقه الصيام",
    "fileSizeBytes": 34000000,
    "uploadedAt": "2026-05-19T09:00:00Z",
    "uploadedBy": "د. أحمد المنصوري",
    "usageCount": 2,
    "altText": null,
    "caption": "تعليق توضيحي على محاضرة فقه الصيام",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: محاضرة فقه الصيام.",
    "tags": [
      "تصميم",
      "دعوة"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 960
  },
  {
    "id": "m19",
    "type": "video",
    "name": "توثيق فعالية رمضان",
    "fileSizeBytes": 39000000,
    "uploadedAt": "2026-06-20T09:00:00Z",
    "uploadedBy": "المشرف الإداري",
    "usageCount": 3,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: توثيق فعالية رمضان.",
    "tags": [
      "أرشيف",
      "تعليمي"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ],
    "durationSeconds": 1140
  },
  {
    "id": "m20",
    "type": "video",
    "name": "لقاء مع د. أحمد المنصوري",
    "fileSizeBytes": 44000000,
    "uploadedAt": "2026-07-21T09:00:00Z",
    "uploadedBy": "فريق المنصة",
    "usageCount": 0,
    "altText": null,
    "caption": "تعليق توضيحي على لقاء مع د. أحمد المنصوري",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: لقاء مع د. أحمد المنصوري.",
    "tags": [
      "دعوة",
      "رمضان"
    ],
    "usedIn": [],
    "durationSeconds": 1320
  },
  {
    "id": "m21",
    "type": "document",
    "name": "ملخص الدرس الأول.pdf",
    "fileSizeBytes": 180000,
    "uploadedAt": "2026-01-22T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: ملخص الدرس الأول.pdf.",
    "tags": [
      "تعليمي",
      "القرآن"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ]
  },
  {
    "id": "m22",
    "type": "document",
    "name": "مخطط صفة الوضوء.pdf",
    "fileSizeBytes": 240000,
    "uploadedAt": "2026-02-23T09:00:00Z",
    "uploadedBy": "د. أحمد المنصوري",
    "usageCount": 2,
    "altText": null,
    "caption": "تعليق توضيحي على مخطط صفة الوضوء.pdf",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: مخطط صفة الوضوء.pdf.",
    "tags": [
      "رمضان",
      "الحديث"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ]
  },
  {
    "id": "m23",
    "type": "document",
    "name": "جدول أسباب النزول.pdf",
    "fileSizeBytes": 300000,
    "uploadedAt": "2026-03-24T09:00:00Z",
    "uploadedBy": "المشرف الإداري",
    "usageCount": 3,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: جدول أسباب النزول.pdf.",
    "tags": [
      "القرآن",
      "تصميم"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ]
  },
  {
    "id": "m24",
    "type": "document",
    "name": "دليل المعلم - أساسيات الإسلام.docx",
    "fileSizeBytes": 360000,
    "uploadedAt": "2026-04-25T09:00:00Z",
    "uploadedBy": "فريق المنصة",
    "usageCount": 0,
    "altText": null,
    "caption": "تعليق توضيحي على دليل المعلم - أساسيات الإسلام.docx",
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: دليل المعلم - أساسيات الإسلام.docx.",
    "tags": [
      "الحديث",
      "أرشيف"
    ],
    "usedIn": []
  },
  {
    "id": "m25",
    "type": "document",
    "name": "استمارة التسجيل.pdf",
    "fileSizeBytes": 420000,
    "uploadedAt": "2026-05-26T09:00:00Z",
    "uploadedBy": "الشيخ عمر الفاروقي",
    "usageCount": 1,
    "altText": null,
    "caption": null,
    "description": "وصف تفصيلي مختصر لعنصر الوسائط: استمارة التسجيل.pdf.",
    "tags": [
      "تصميم",
      "دعوة"
    ],
    "usedIn": [
      {
        "title": "معنى التقوى في القرآن الكريم",
        "kind": "article",
        "href": "/articles/taqwa-in-quran"
      }
    ]
  }
]
;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function getMediaAssetById(id: string): MediaAsset | undefined {
  return mockMediaAssets.find((a) => a.id === id);
}
