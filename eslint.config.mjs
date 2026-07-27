import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * تهيئة ESLint بصيغة Flat Config — الصيغة الوحيدة المدعومة اعتبارًا من
 * ESLint 10 وحزمة eslint-config-next 16 (next lint أُزيل من Next.js 16).
 *
 * ESLint Flat Config — the only supported format as of ESLint 10 and
 * eslint-config-next 16 (Next.js 16 removed the `next lint` command).
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);
