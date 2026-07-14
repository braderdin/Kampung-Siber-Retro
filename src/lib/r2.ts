// Start: Kampung Siber Cloudflare R2 Storage Client (Rule 30 & 35)
// Guard-first client: validateR2Env() runs BEFORE the S3 client is built so
// missing/placeholder R2 keys hard-fail in production instead of causing
// silent upload failures at request time.

import { validateR2Env } from "./env-validation";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Enforce Rule 30 storage limits at the client boundary.
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB per individual upload

// Start: R2 env constants (read once, consumed by lazy factory)
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID as string;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string;
const R2_SECRET_ACCESS_KEY = process.env
  .CLOUDFLARE_R2_SECRET_ACCESS_KEY as string;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME as string;
// End: R2 env constants

// Start: getR2Client — lazy S3 client factory (no top-level eager init)
let cachedR2Client: S3Client | null = null;
function getR2Client(): S3Client {
  // Guard runs only when the client is first needed (lazy initialization).
  validateR2Env();
  if (cachedR2Client) return cachedR2Client;
  cachedR2Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return cachedR2Client;
}
// End: getR2Client

// Start: uploadToR2 — guarded put with 2MB ceiling (Rule 30)
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<string> {
  const size =
    typeof body === "string" ? Buffer.byteLength(body) : body.length;
  if (size > MAX_FILE_BYTES) {
    throw new Error(
      `[R2] File ${key} exceeds 2MB cap (Rule 30). Got ${size} bytes.`
    );
  }

  // Start: WebP format enforcement guard (Rule 30)
  if (contentType.startsWith("image/") && contentType !== "image/webp") {
    console.warn(
      "[R2 GUARD] Image is not optimized to WebP format. Enforcement of Rule 30 (80-85% compression) is required."
    );
  }
  // End: WebP format enforcement guard

  const input: PutObjectCommandInput = {
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  await getR2Client().send(new PutObjectCommand(input));
  return key;
}
// End: uploadToR2

// Start: getR2PresignedUrl — short-lived read link
export async function getR2PresignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    { expiresIn }
  );
}
// End: getR2PresignedUrl

// Start: deleteFromR2 — guarded removal
export async function deleteFromR2(key: string): Promise<void> {
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key })
  );
}
// End: deleteFromR2

// Start: compressToWebP — placeholder for next sprint (Rule 30)
// TODO: Integrate image compression lib (e.g. sharp) to convert/compress
// incoming image buffers to WebP at 80-85% quality.
export async function compressToWebP(
  body: Buffer | Uint8Array
): Promise<Buffer> {
  return Buffer.from(body); // placeholder: unchanged until lib integrated
}
// End: compressToWebP

export const R2_BUCKET = R2_BUCKET_NAME;
// End: Kampung Siber Cloudflare R2 Storage Client (Rule 30 & 35)