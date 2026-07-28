-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VISITOR', 'MEMBER', 'STUDENT', 'TEACHER', 'SCHOLAR_REVIEWER', 'COMMUNITY_MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'REVIEW', 'SCHOLARLY_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ReferenceStatus" AS ENUM ('IMPORTED', 'VALIDATED', 'ACTIVE', 'UNDER_CORRECTION');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OperationalStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('SUBMITTED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TaxonomyStatus" AS ENUM ('ACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "Era" AS ENUM ('CLASSICAL', 'CONTEMPORARY');

-- CreateEnum
CREATE TYPE "TextDirection" AS ENUM ('RTL', 'LTR');

-- CreateEnum
CREATE TYPE "TopicFacet" AS ENUM ('FIQH', 'AQIDAH', 'SEERAH', 'HADITH_CLASS', 'QURAN_CLASS', 'LEVEL', 'AUDIENCE', 'GENERAL_TOPIC');

-- CreateEnum
CREATE TYPE "TaxonomySubjectType" AS ENUM ('ARTICLE', 'FATWA', 'COURSE', 'LESSON', 'BOOK', 'HADITH', 'SURAH', 'TAFSIR', 'SCHOLAR_COMMENTARY', 'EVENT');

-- CreateEnum
CREATE TYPE "Riwayah" AS ENUM ('HAFS_ASIM', 'WARSH_NAFI');

-- CreateEnum
CREATE TYPE "RevelationType" AS ENUM ('MECCAN', 'MEDINAN');

-- CreateEnum
CREATE TYPE "MorphologicalTag" AS ENUM ('NOUN', 'VERB', 'PARTICLE');

-- CreateEnum
CREATE TYPE "TafsirScopeType" AS ENUM ('SINGLE_VERSE', 'VERSE_RANGE', 'SURAH');

-- CreateEnum
CREATE TYPE "RecitationScopeType" AS ENUM ('VERSE', 'SURAH', 'JUZ');

-- CreateEnum
CREATE TYPE "HadithGrade" AS ENUM ('SAHIH', 'HASAN', 'DAIF', 'MAWDU');

-- CreateEnum
CREATE TYPE "GenerationLayer" AS ENUM ('COMPANION', 'SUCCESSOR', 'SUCCESSOR_OF_SUCCESSOR', 'LATER_NARRATOR');

-- CreateEnum
CREATE TYPE "BookType" AS ENUM ('HADITH', 'FIQH', 'SEERAH', 'TAFSIR', 'GENERAL');

-- CreateEnum
CREATE TYPE "CitationSourceType" AS ENUM ('ARTICLE', 'FATWA', 'SCHOLAR_COMMENTARY', 'TAFSIR');

-- CreateEnum
CREATE TYPE "CitationTargetType" AS ENUM ('VERSE', 'HADITH', 'FATWA');

-- CreateEnum
CREATE TYPE "LessonContentType" AS ENUM ('TEXT', 'VIDEO', 'MIXED');

-- CreateEnum
CREATE TYPE "LessonContentKind" AS ENUM ('VIDEO', 'AUDIO', 'ARTICLE');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');

-- CreateEnum
CREATE TYPE "AttachmentFileType" AS ENUM ('PDF', 'PPTX', 'DOCX', 'XLSX', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaUsageType" AS ENUM ('VIDEO', 'AUDIO', 'IMAGE', 'ATTACHMENT');

-- CreateEnum
CREATE TYPE "MediaUsageContextType" AS ENUM ('LESSON', 'ARTICLE', 'EVENT', 'COURSE');

-- CreateEnum
CREATE TYPE "MediaUsageRole" AS ENUM ('FEATURED', 'INLINE');

-- CreateEnum
CREATE TYPE "PrayerTimeSource" AS ENUM ('CALCULATED', 'MANUAL');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'APPROVE', 'DELETE', 'RESTORE');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'PERMISSION_DENIED', 'ROLE_CHANGED');

-- CreateEnum
CREATE TYPE "BackgroundJobStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "SearchOperation" AS ENUM ('INDEX', 'UPDATE', 'REMOVE');

-- CreateEnum
CREATE TYPE "SearchQueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "password_hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "scholars" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "biography" TEXT NOT NULL,
    "specialization_topic_id" UUID NOT NULL,
    "era" "Era" NOT NULL,
    "credentials_summary" VARCHAR(500),
    "is_living_member" BOOLEAN NOT NULL DEFAULT false,
    "linked_user_id" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "published_by" UUID,
    "seo_slug" VARCHAR(255),
    "seo_meta_title" VARCHAR(60),
    "seo_meta_description" VARCHAR(160),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "scholars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "biography" TEXT,
    "pen_name" VARCHAR(100),
    "user_id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "OperationalStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "seo_slug" VARCHAR(255),
    "seo_meta_title" VARCHAR(60),
    "seo_meta_description" VARCHAR(160),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translators" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "biography" TEXT,
    "credentials_summary" VARCHAR(500),
    "user_id" UUID NOT NULL,
    "is_certification_verified" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "OperationalStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "seo_slug" VARCHAR(255),
    "seo_meta_title" VARCHAR(60),
    "seo_meta_description" VARCHAR(160),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "translators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewers" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "user_id" UUID NOT NULL,
    "review_scope" UUID[],
    "active_status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translator_languages" (
    "id" UUID NOT NULL,
    "translator_id" UUID NOT NULL,
    "language_code" VARCHAR(10) NOT NULL,

    CONSTRAINT "translator_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholar_center_affiliations" (
    "id" UUID NOT NULL,
    "scholar_id" UUID NOT NULL,
    "islamic_center_id" UUID NOT NULL,

    CONSTRAINT "scholar_center_affiliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "isoCode" VARCHAR(10) NOT NULL,
    "name_localized" VARCHAR(50) NOT NULL,
    "direction" "TextDirection" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("isoCode")
);

-- CreateTable
CREATE TABLE "locale_groups" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locale_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "name_localized" VARCHAR(100) NOT NULL,
    "parent_category_id" UUID,
    "icon_image_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "depth_level" INTEGER NOT NULL DEFAULT 0,
    "is_scholarly_gated" BOOLEAN NOT NULL DEFAULT false,
    "status" "TaxonomyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "name_localized" VARCHAR(100) NOT NULL,
    "parent_topic_id" UUID,
    "facet_type" "TopicFacet" NOT NULL,
    "is_scholarly_gated" BOOLEAN NOT NULL DEFAULT false,
    "status" "TaxonomyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "name_localized" VARCHAR(50) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "status" "TaxonomyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_assignments" (
    "id" UUID NOT NULL,
    "subject_type" "TaxonomySubjectType" NOT NULL,
    "subject_id" UUID NOT NULL,
    "topic_id" UUID NOT NULL,

    CONSTRAINT "topic_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_assignments" (
    "id" UUID NOT NULL,
    "subject_type" "TaxonomySubjectType" NOT NULL,
    "subject_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "tag_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qurans" (
    "id" UUID NOT NULL,
    "riwayah" "Riwayah" NOT NULL,
    "total_surah_count" INTEGER NOT NULL DEFAULT 114,
    "total_verse_count" INTEGER NOT NULL,
    "source_edition" VARCHAR(255) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qurans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surahs" (
    "id" UUID NOT NULL,
    "quran_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "arabic_name" VARCHAR(100) NOT NULL,
    "transliterated_name" VARCHAR(100) NOT NULL,
    "translated_names" JSONB,
    "revelation_type" "RevelationType" NOT NULL,
    "verse_count" INTEGER NOT NULL,
    "order_of_revelation" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surahs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verses" (
    "id" UUID NOT NULL,
    "surah_id" UUID NOT NULL,
    "verse_number_in_surah" INTEGER NOT NULL,
    "absolute_verse_number" INTEGER NOT NULL,
    "arabic_text_uthmani" TEXT NOT NULL,
    "arabic_text_simple" TEXT NOT NULL,
    "juz_number" INTEGER NOT NULL,
    "hizb_number" INTEGER NOT NULL,
    "page_number" INTEGER,
    "sajdah_flag" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReferenceStatus" NOT NULL DEFAULT 'IMPORTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "position_in_verse" INTEGER NOT NULL,
    "arabic_text" VARCHAR(50) NOT NULL,
    "transliteration" VARCHAR(80),
    "morphological_tag" "MorphologicalTag" NOT NULL,
    "root_id" UUID,
    "word_gloss" VARCHAR(200),

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roots" (
    "id" UUID NOT NULL,
    "root_letters" VARCHAR(10) NOT NULL,
    "general_meaning" VARCHAR(300),
    "occurrence_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quran_translations" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "verse_id" UUID NOT NULL,
    "translator_id" UUID NOT NULL,
    "translated_text" TEXT NOT NULL,
    "methodology_note" VARCHAR(500),
    "footnotes" TEXT,
    "disclaimer_accepted" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "published_by" UUID,
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quran_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tafsirs" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body_text" TEXT NOT NULL,
    "scope_type" "TafsirScopeType" NOT NULL,
    "source_type" "Era" NOT NULL,
    "scholar_id" UUID NOT NULL,
    "book_id" UUID,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "published_by" UUID,
    "seo_slug" VARCHAR(255),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tafsirs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tafsir_verses" (
    "id" UUID NOT NULL,
    "tafsir_id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,

    CONSTRAINT "tafsir_verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recitations" (
    "id" UUID NOT NULL,
    "reciter_id" UUID NOT NULL,
    "audio_id" UUID NOT NULL,
    "riwayah" "Riwayah" NOT NULL,
    "scope_type" "RecitationScopeType" NOT NULL,
    "surah_id" UUID,
    "duration_seconds" INTEGER NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID NOT NULL,

    CONSTRAINT "recitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadiths" (
    "id" UUID NOT NULL,
    "matn_text" TEXT NOT NULL,
    "grade" "HadithGrade" NOT NULL,
    "grading_scholar_id" UUID NOT NULL,
    "hadith_collection_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "status" "ReferenceStatus" NOT NULL DEFAULT 'IMPORTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadiths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_collections" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "collection_name" VARCHAR(150) NOT NULL,
    "compiler_scholar_id" UUID NOT NULL,
    "era" VARCHAR(50),
    "total_hadith_count" INTEGER NOT NULL DEFAULT 0,
    "status" "ReferenceStatus" NOT NULL DEFAULT 'IMPORTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadith_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "narrators" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "generation_layer" "GenerationLayer" NOT NULL,
    "reliability_assessment" VARCHAR(500) NOT NULL,
    "birth_era" VARCHAR(50),
    "death_era" VARCHAR(50),
    "status" "ReferenceStatus" NOT NULL DEFAULT 'IMPORTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "narrators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith_narrators" (
    "id" UUID NOT NULL,
    "hadith_id" UUID NOT NULL,
    "narrator_id" UUID NOT NULL,
    "chain_position" INTEGER NOT NULL,

    CONSTRAINT "hadith_narrators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholar_commentaries" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body_text" TEXT NOT NULL,
    "scholar_id" UUID NOT NULL,
    "related_entity_type" "TaxonomySubjectType" NOT NULL,
    "related_entity_id" UUID NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "scholar_commentaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fatwas" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "fiqh_school_topic_id" UUID NOT NULL,
    "issue_date" DATE NOT NULL,
    "scholar_id" UUID NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "published_by" UUID,
    "seo_slug" VARCHAR(255),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "fatwas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "body_text" TEXT NOT NULL,
    "excerpt" VARCHAR(300) NOT NULL,
    "featured_image_id" UUID,
    "author_id" UUID,
    "scholar_id" UUID,
    "category_id" UUID NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "published_by" UUID,
    "seo_slug" VARCHAR(255),
    "seo_meta_title" VARCHAR(60),
    "seo_meta_description" VARCHAR(160),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "author_id" UUID,
    "scholar_id" UUID,
    "publication_era" VARCHAR(50) NOT NULL,
    "book_type" "BookType" NOT NULL,
    "digital_attachment_id" UUID,
    "isbn" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citations" (
    "id" UUID NOT NULL,
    "source_type" "CitationSourceType" NOT NULL,
    "source_id" UUID NOT NULL,
    "target_type" "CitationTargetType" NOT NULL,
    "target_id" UUID NOT NULL,

    CONSTRAINT "citations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "level_topic_id" UUID NOT NULL,
    "audience_topic_id" UUID NOT NULL,
    "certificate_eligible" BOOLEAN NOT NULL DEFAULT false,
    "cover_image_id" UUID,
    "teacher_id" UUID NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "approved_by" UUID,
    "published_by" UUID,
    "seo_slug" VARCHAR(255),
    "seo_meta_title" VARCHAR(60),
    "seo_meta_description" VARCHAR(160),
    "is_ai_indexable" BOOLEAN NOT NULL DEFAULT false,
    "is_search_indexed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "course_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "order_index" INTEGER NOT NULL,
    "content_type" "LessonContentType" NOT NULL,
    "body_text" TEXT,
    "estimated_duration_minutes" INTEGER NOT NULL,
    "quiz_id" UUID,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_content_items" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "content_type" "LessonContentKind" NOT NULL,
    "content_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "lesson_content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "course_id" UUID,
    "passing_score_percentage" INTEGER NOT NULL DEFAULT 70,
    "attempt_limit" INTEGER,
    "time_limit_minutes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "question_text" VARCHAR(500) NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "answer_text" VARCHAR(300) NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "explanation_text" VARCHAR(500),
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress_percentage" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "certificate_issued" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "score_percentage" INTEGER,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "passed" BOOLEAN,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "storage_file_key" VARCHAR(500) NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "resolution" VARCHAR(20) NOT NULL,
    "transcript_text" TEXT,
    "thumbnail_image_id" UUID NOT NULL,
    "uploader_user_id" UUID NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audios" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "storage_file_key" VARCHAR(500) NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "speaker_id" UUID,
    "transcript_text" TEXT,
    "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "storage_file_key" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(200) NOT NULL,
    "caption" VARCHAR(300),
    "width_px" INTEGER NOT NULL,
    "height_px" INTEGER NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "storage_file_key" VARCHAR(500) NOT NULL,
    "file_type" "AttachmentFileType" NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(500),
    "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_usages" (
    "id" UUID NOT NULL,
    "media_type" "MediaUsageType" NOT NULL,
    "media_id" UUID NOT NULL,
    "context_type" "MediaUsageContextType" NOT NULL,
    "context_id" UUID NOT NULL,
    "usage_role" "MediaUsageRole" NOT NULL DEFAULT 'INLINE',

    CONSTRAINT "media_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "iso_code" VARCHAR(2) NOT NULL,
    "name_localized" VARCHAR(100) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "name_localized" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "timezone_identifier" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mosques" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "city_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "address" VARCHAR(300) NOT NULL,
    "prayer_time_source" "PrayerTimeSource" NOT NULL DEFAULT 'CALCULATED',
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "contact_info" VARCHAR(200),
    "submitted_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mosques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "islamic_centers" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "city_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "contact_info" VARCHAR(200),
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "islamic_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mosque_center_affiliations" (
    "id" UUID NOT NULL,
    "mosque_id" UUID NOT NULL,
    "islamic_center_id" UUID NOT NULL,

    CONSTRAINT "mosque_center_affiliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "locale_group_id" UUID NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "is_virtual" BOOLEAN NOT NULL DEFAULT false,
    "islamic_center_id" UUID,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_scholars" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "scholar_id" UUID NOT NULL,

    CONSTRAINT "event_scholars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log_entries" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actor_user_id" UUID NOT NULL,
    "actor_role_at_time" VARCHAR(30) NOT NULL,
    "previous_status" VARCHAR(30),
    "new_status" VARCHAR(30),
    "changed_fields" JSONB,
    "related_content_version_id" UUID,
    "reason" VARCHAR(500),
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_event_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "event_type" "SecurityEventType" NOT NULL,
    "ip_address" VARCHAR(45),
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" VARCHAR(500),

    CONSTRAINT "security_event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "status_at_snapshot" VARCHAR(30) NOT NULL,
    "full_snapshot" JSONB NOT NULL,
    "change_summary" VARCHAR(500),
    "changed_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_revisions" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "revision_number" INTEGER NOT NULL,
    "full_snapshot" JSONB NOT NULL,
    "changed_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draft_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_citation_logs" (
    "id" UUID NOT NULL,
    "cited_entity_type" VARCHAR(50) NOT NULL,
    "cited_entity_id" UUID NOT NULL,
    "cited_content_version" INTEGER NOT NULL,
    "query_context_hash" VARCHAR(100),
    "cited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_citation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" VARCHAR(1000) NOT NULL,
    "description" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "flag_key" VARCHAR(100) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "rollout_percentage" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_job_logs" (
    "id" UUID NOT NULL,
    "job_type" VARCHAR(100) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "status" "BackgroundJobStatus" NOT NULL DEFAULT 'RUNNING',
    "error_message" VARCHAR(1000),

    CONSTRAINT "background_job_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_index_queue" (
    "id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "operation" "SearchOperation" NOT NULL,
    "enqueued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "status" "SearchQueueStatus" NOT NULL DEFAULT 'PENDING',
    "retry_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "search_index_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "scholars_specialization_topic_id_idx" ON "scholars"("specialization_topic_id");

-- CreateIndex
CREATE INDEX "scholars_status_language_idx" ON "scholars"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "scholars_locale_group_id_language_key" ON "scholars"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "authors_user_id_idx" ON "authors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "authors_locale_group_id_language_key" ON "authors"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "translators_user_id_idx" ON "translators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "translators_locale_group_id_language_key" ON "translators"("locale_group_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "reviewers_user_id_key" ON "reviewers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "translator_languages_translator_id_language_code_key" ON "translator_languages"("translator_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "scholar_center_affiliations_scholar_id_islamic_center_id_key" ON "scholar_center_affiliations"("scholar_id", "islamic_center_id");

-- CreateIndex
CREATE INDEX "categories_parent_category_id_idx" ON "categories"("parent_category_id");

-- CreateIndex
CREATE INDEX "categories_status_language_idx" ON "categories"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "categories_locale_group_id_language_key" ON "categories"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "topics_parent_topic_id_idx" ON "topics"("parent_topic_id");

-- CreateIndex
CREATE INDEX "topics_facet_type_status_language_idx" ON "topics"("facet_type", "status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "topics_locale_group_id_language_key" ON "topics"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "tags_language_name_localized_idx" ON "tags"("language", "name_localized");

-- CreateIndex
CREATE UNIQUE INDEX "tags_locale_group_id_language_key" ON "tags"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "topic_assignments_subject_type_subject_id_idx" ON "topic_assignments"("subject_type", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "topic_assignments_subject_type_subject_id_topic_id_key" ON "topic_assignments"("subject_type", "subject_id", "topic_id");

-- CreateIndex
CREATE INDEX "tag_assignments_subject_type_subject_id_idx" ON "tag_assignments"("subject_type", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_assignments_subject_type_subject_id_tag_id_key" ON "tag_assignments"("subject_type", "subject_id", "tag_id");

-- CreateIndex
CREATE INDEX "surahs_quran_id_idx" ON "surahs"("quran_id");

-- CreateIndex
CREATE UNIQUE INDEX "surahs_number_key" ON "surahs"("number");

-- CreateIndex
CREATE UNIQUE INDEX "surahs_order_of_revelation_key" ON "surahs"("order_of_revelation");

-- CreateIndex
CREATE UNIQUE INDEX "verses_absolute_verse_number_key" ON "verses"("absolute_verse_number");

-- CreateIndex
CREATE INDEX "verses_surah_id_verse_number_in_surah_idx" ON "verses"("surah_id", "verse_number_in_surah");

-- CreateIndex
CREATE INDEX "words_root_id_idx" ON "words"("root_id");

-- CreateIndex
CREATE UNIQUE INDEX "words_verse_id_position_in_verse_key" ON "words"("verse_id", "position_in_verse");

-- CreateIndex
CREATE UNIQUE INDEX "roots_root_letters_key" ON "roots"("root_letters");

-- CreateIndex
CREATE INDEX "quran_translations_verse_id_idx" ON "quran_translations"("verse_id");

-- CreateIndex
CREATE INDEX "quran_translations_status_language_idx" ON "quran_translations"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "quran_translations_locale_group_id_language_key" ON "quran_translations"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "tafsirs_scholar_id_idx" ON "tafsirs"("scholar_id");

-- CreateIndex
CREATE INDEX "tafsirs_status_language_idx" ON "tafsirs"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "tafsirs_locale_group_id_language_key" ON "tafsirs"("locale_group_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "tafsir_verses_tafsir_id_verse_id_key" ON "tafsir_verses"("tafsir_id", "verse_id");

-- CreateIndex
CREATE INDEX "recitations_reciter_id_idx" ON "recitations"("reciter_id");

-- CreateIndex
CREATE INDEX "recitations_status_idx" ON "recitations"("status");

-- CreateIndex
CREATE INDEX "hadiths_grade_idx" ON "hadiths"("grade");

-- CreateIndex
CREATE INDEX "hadiths_hadith_collection_id_idx" ON "hadiths"("hadith_collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "hadith_collections_locale_group_id_language_key" ON "hadith_collections"("locale_group_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "narrators_locale_group_id_language_key" ON "narrators"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "hadith_narrators_narrator_id_idx" ON "hadith_narrators"("narrator_id");

-- CreateIndex
CREATE UNIQUE INDEX "hadith_narrators_hadith_id_chain_position_key" ON "hadith_narrators"("hadith_id", "chain_position");

-- CreateIndex
CREATE INDEX "scholar_commentaries_related_entity_type_related_entity_id_idx" ON "scholar_commentaries"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "scholar_commentaries_locale_group_id_language_key" ON "scholar_commentaries"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "fatwas_scholar_id_idx" ON "fatwas"("scholar_id");

-- CreateIndex
CREATE INDEX "fatwas_status_language_idx" ON "fatwas"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "fatwas_locale_group_id_language_key" ON "fatwas"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "articles_category_id_idx" ON "articles"("category_id");

-- CreateIndex
CREATE INDEX "articles_status_language_idx" ON "articles"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "articles_locale_group_id_language_key" ON "articles"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "books_author_id_idx" ON "books"("author_id");

-- CreateIndex
CREATE INDEX "books_scholar_id_idx" ON "books"("scholar_id");

-- CreateIndex
CREATE INDEX "citations_source_type_source_id_idx" ON "citations"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "citations_target_type_target_id_idx" ON "citations"("target_type", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "citations_source_type_source_id_target_type_target_id_key" ON "citations"("source_type", "source_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "courses_status_language_idx" ON "courses"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "courses_locale_group_id_language_key" ON "courses"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "lessons_status_language_idx" ON "lessons"("status", "language");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_course_id_order_index_key" ON "lessons"("course_id", "order_index");

-- CreateIndex
CREATE INDEX "lesson_content_items_lesson_id_idx" ON "lesson_content_items"("lesson_id");

-- CreateIndex
CREATE INDEX "quizzes_course_id_idx" ON "quizzes"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_quiz_id_order_index_key" ON "questions"("quiz_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempts_user_id_quiz_id_attempt_number_key" ON "quiz_attempts"("user_id", "quiz_id", "attempt_number");

-- CreateIndex
CREATE INDEX "videos_status_idx" ON "videos"("status");

-- CreateIndex
CREATE INDEX "audios_speaker_id_idx" ON "audios"("speaker_id");

-- CreateIndex
CREATE INDEX "audios_status_idx" ON "audios"("status");

-- CreateIndex
CREATE INDEX "media_usages_media_type_media_id_idx" ON "media_usages"("media_type", "media_id");

-- CreateIndex
CREATE INDEX "media_usages_context_type_context_id_idx" ON "media_usages"("context_type", "context_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_code_key" ON "countries"("iso_code");

-- CreateIndex
CREATE INDEX "cities_country_id_idx" ON "cities"("country_id");

-- CreateIndex
CREATE INDEX "mosques_city_id_idx" ON "mosques"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "mosques_locale_group_id_language_key" ON "mosques"("locale_group_id", "language");

-- CreateIndex
CREATE INDEX "islamic_centers_city_id_idx" ON "islamic_centers"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "islamic_centers_locale_group_id_language_key" ON "islamic_centers"("locale_group_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "mosque_center_affiliations_mosque_id_islamic_center_id_key" ON "mosque_center_affiliations"("mosque_id", "islamic_center_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_locale_group_id_language_key" ON "events"("locale_group_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "event_scholars_event_id_scholar_id_key" ON "event_scholars"("event_id", "scholar_id");

-- CreateIndex
CREATE INDEX "audit_log_entries_entity_type_entity_id_occurred_at_idx" ON "audit_log_entries"("entity_type", "entity_id", "occurred_at");

-- CreateIndex
CREATE INDEX "security_event_logs_user_id_occurred_at_idx" ON "security_event_logs"("user_id", "occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_entity_type_entity_id_version_number_key" ON "content_versions"("entity_type", "entity_id", "version_number");

-- CreateIndex
CREATE UNIQUE INDEX "draft_revisions_entity_type_entity_id_revision_number_key" ON "draft_revisions"("entity_type", "entity_id", "revision_number");

-- CreateIndex
CREATE INDEX "ai_citation_logs_cited_entity_type_cited_entity_id_idx" ON "ai_citation_logs"("cited_entity_type", "cited_entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "system_settings"("setting_key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_flag_key_key" ON "feature_flags"("flag_key");

-- CreateIndex
CREATE INDEX "background_job_logs_status_started_at_idx" ON "background_job_logs"("status", "started_at");

-- CreateIndex
CREATE INDEX "search_index_queue_status_enqueued_at_idx" ON "search_index_queue"("status", "enqueued_at");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholars" ADD CONSTRAINT "scholars_linked_user_id_fkey" FOREIGN KEY ("linked_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholars" ADD CONSTRAINT "scholars_specialization_topic_id_fkey" FOREIGN KEY ("specialization_topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translators" ADD CONSTRAINT "translators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewers" ADD CONSTRAINT "reviewers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translator_languages" ADD CONSTRAINT "translator_languages_translator_id_fkey" FOREIGN KEY ("translator_id") REFERENCES "translators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translator_languages" ADD CONSTRAINT "translator_languages_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("isoCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_center_affiliations" ADD CONSTRAINT "scholar_center_affiliations_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_center_affiliations" ADD CONSTRAINT "scholar_center_affiliations_islamic_center_id_fkey" FOREIGN KEY ("islamic_center_id") REFERENCES "islamic_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_icon_image_id_fkey" FOREIGN KEY ("icon_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_parent_topic_id_fkey" FOREIGN KEY ("parent_topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_assignments" ADD CONSTRAINT "topic_assignments_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_assignments" ADD CONSTRAINT "tag_assignments_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surahs" ADD CONSTRAINT "surahs_quran_id_fkey" FOREIGN KEY ("quran_id") REFERENCES "qurans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verses" ADD CONSTRAINT "verses_surah_id_fkey" FOREIGN KEY ("surah_id") REFERENCES "surahs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "roots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quran_translations" ADD CONSTRAINT "quran_translations_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quran_translations" ADD CONSTRAINT "quran_translations_translator_id_fkey" FOREIGN KEY ("translator_id") REFERENCES "translators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tafsirs" ADD CONSTRAINT "tafsirs_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tafsirs" ADD CONSTRAINT "tafsirs_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tafsir_verses" ADD CONSTRAINT "tafsir_verses_tafsir_id_fkey" FOREIGN KEY ("tafsir_id") REFERENCES "tafsirs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tafsir_verses" ADD CONSTRAINT "tafsir_verses_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recitations" ADD CONSTRAINT "recitations_reciter_id_fkey" FOREIGN KEY ("reciter_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recitations" ADD CONSTRAINT "recitations_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadiths" ADD CONSTRAINT "hadiths_grading_scholar_id_fkey" FOREIGN KEY ("grading_scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadiths" ADD CONSTRAINT "hadiths_hadith_collection_id_fkey" FOREIGN KEY ("hadith_collection_id") REFERENCES "hadith_collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadiths" ADD CONSTRAINT "hadiths_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_collections" ADD CONSTRAINT "hadith_collections_compiler_scholar_id_fkey" FOREIGN KEY ("compiler_scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_narrators" ADD CONSTRAINT "hadith_narrators_hadith_id_fkey" FOREIGN KEY ("hadith_id") REFERENCES "hadiths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith_narrators" ADD CONSTRAINT "hadith_narrators_narrator_id_fkey" FOREIGN KEY ("narrator_id") REFERENCES "narrators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholar_commentaries" ADD CONSTRAINT "scholar_commentaries_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatwas" ADD CONSTRAINT "fatwas_fiqh_school_topic_id_fkey" FOREIGN KEY ("fiqh_school_topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatwas" ADD CONSTRAINT "fatwas_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_digital_attachment_id_fkey" FOREIGN KEY ("digital_attachment_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_level_topic_id_fkey" FOREIGN KEY ("level_topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_audience_topic_id_fkey" FOREIGN KEY ("audience_topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_content_items" ADD CONSTRAINT "lesson_content_items_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnail_image_id_fkey" FOREIGN KEY ("thumbnail_image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_uploader_user_id_fkey" FOREIGN KEY ("uploader_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audios" ADD CONSTRAINT "audios_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mosques" ADD CONSTRAINT "mosques_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mosques" ADD CONSTRAINT "mosques_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "islamic_centers" ADD CONSTRAINT "islamic_centers_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mosque_center_affiliations" ADD CONSTRAINT "mosque_center_affiliations_mosque_id_fkey" FOREIGN KEY ("mosque_id") REFERENCES "mosques"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mosque_center_affiliations" ADD CONSTRAINT "mosque_center_affiliations_islamic_center_id_fkey" FOREIGN KEY ("islamic_center_id") REFERENCES "islamic_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_islamic_center_id_fkey" FOREIGN KEY ("islamic_center_id") REFERENCES "islamic_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_scholars" ADD CONSTRAINT "event_scholars_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_scholars" ADD CONSTRAINT "event_scholars_scholar_id_fkey" FOREIGN KEY ("scholar_id") REFERENCES "scholars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_entries" ADD CONSTRAINT "audit_log_entries_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_entries" ADD CONSTRAINT "audit_log_entries_related_content_version_id_fkey" FOREIGN KEY ("related_content_version_id") REFERENCES "content_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_event_logs" ADD CONSTRAINT "security_event_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_revisions" ADD CONSTRAINT "draft_revisions_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
