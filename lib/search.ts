import { serverEnv } from "@/config/env";

/**
 * طبقة البحث — جاهزة للدمج مع OpenSearch أو Elasticsearch في مرحلة لاحقة.
 * لم تُضَف مكتبة العميل بعد عمدًا (لا OpenSearch ولا Elasticsearch) حتى
 * يُحسم القرار بينهما؛ الواجهة أدناه محايدة تجاه أيهما سيُختار لاحقًا.
 *
 * Search layer — prepared for OpenSearch or Elasticsearch integration in
 * a later phase. No client library is installed yet on purpose (neither
 * OpenSearch nor Elasticsearch) until that decision is made; the interface
 * below is intentionally client-agnostic.
 *
 * عند البدء بالدمج الفعلي:
 * When wiring the real integration:
 *   1. npm install @opensearch-project/opensearch   (أو @elastic/elasticsearch)
 *   2. نفّذ SearchClient أدناه بعميل حقيقي.
 *      Implement SearchClient below with a real client.
 *   3. حدّد الفهارس (indices) حسب أنواع المحتوى في وثيقة IA.
 *      Define indices per the content types in the IA document.
 */

export interface SearchDocument {
  id: string;
  type: string; // article | video | course | qa | fatwa | book | event ...
  locale: string;
  title: string;
  [key: string]: unknown;
}

export interface SearchQuery {
  query: string;
  locale?: string;
  type?: string;
  filters?: Record<string, string | number | boolean>;
  page?: number;
  pageSize?: number;
}

export interface SearchResult<T = SearchDocument> {
  hits: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchClient {
  index(indexName: string, doc: SearchDocument): Promise<void>;
  remove(indexName: string, id: string): Promise<void>;
  search<T = SearchDocument>(indexName: string, query: SearchQuery): Promise<SearchResult<T>>;
}

export const searchConfig = {
  nodeUrl: serverEnv.SEARCH_NODE_URL,
  indexPrefix: serverEnv.SEARCH_INDEX_PREFIX,
};

/**
 * عميل مؤقت (No-op) — يمنع انهيار البناء عند استيراد هذا الملف قبل تفعيل
 * البحث فعليًا. استبدله بتنفيذ حقيقي عند بدء تلك المرحلة.
 *
 * Temporary no-op client — prevents build failures when this module is
 * imported before search is actually wired up. Replace with a real
 * implementation when that phase begins.
 */
export const searchClient: SearchClient = {
  async index() {
    throw new Error("Search is not yet configured. See lib/search.ts.");
  },
  async remove() {
    throw new Error("Search is not yet configured. See lib/search.ts.");
  },
  async search() {
    throw new Error("Search is not yet configured. See lib/search.ts.");
  },
};
