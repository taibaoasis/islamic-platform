import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { serverEnv } from "@/config/env";

/**
 * طبقة تخزين الكائنات — تعمل مع Amazon S3 أو أي مزوّد متوافق
 * (Cloudflare R2, MinIO, DigitalOcean Spaces...) بتغيير STORAGE_ENDPOINT فقط.
 *
 * Object storage layer — works with Amazon S3 or any S3-compatible
 * provider (Cloudflare R2, MinIO, DigitalOcean Spaces...) by only
 * changing STORAGE_ENDPOINT.
 */
export const s3Client = new S3Client({
  region: serverEnv.STORAGE_REGION,
  endpoint: serverEnv.STORAGE_ENDPOINT || undefined,
  forcePathStyle: Boolean(serverEnv.STORAGE_ENDPOINT), // required by most non-AWS S3-compatible services
  credentials:
    serverEnv.STORAGE_ACCESS_KEY_ID && serverEnv.STORAGE_SECRET_ACCESS_KEY
      ? {
          accessKeyId: serverEnv.STORAGE_ACCESS_KEY_ID,
          secretAccessKey: serverEnv.STORAGE_SECRET_ACCESS_KEY,
        }
      : undefined,
});

const bucket = () => {
  if (!serverEnv.STORAGE_BUCKET) throw new Error("STORAGE_BUCKET is not configured");
  return serverEnv.STORAGE_BUCKET;
};

/** يرفع كائنًا مباشرة من الخادم (Server Action / Route Handler فقط). */
export async function uploadObject(key: string, body: Buffer | Uint8Array, contentType: string) {
  await s3Client.send(
    new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType })
  );
  return { key };
}

/** يحذف كائنًا من التخزين. */
export async function deleteObject(key: string) {
  await s3Client.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}

/** رابط مؤقت للرفع المباشر من المتصفح (Presigned Upload URL). */
export async function getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds = 300) {
  const command = new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/** رابط مؤقت للقراءة، لكائنات غير عامة (private buckets). */
export async function getPresignedReadUrl(key: string, expiresInSeconds = 300) {
  const command = new GetObjectCommand({ Bucket: bucket(), Key: key });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}
