// Start: Cloudflare R2 Storage Rename Handler (Real Copy + Delete Sequence)
// Flat object stores (R2) have no atomic rename, so we perform the production
// grade pattern: CopyObject (oldKey -> newKey), verify the copy, then
// DeleteObject on the source key. All keys are scope-checked to the caller.
import { NextRequest, NextResponse } from 'next/server';
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

// Start: Environment Configuration
const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'kampung-siber-assets';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
// End: Environment Configuration

// Start: S3 Client Configuration
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
// End: S3 Client Configuration

// Start: Supabase Client Configuration
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// End: Supabase Client Configuration

// Start: Rule 30 Footprint Constraints
// Individual image upload cap: 2MB. Renames must respect this for images.
const RULE30_MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
const IMAGE_MIME_RE = /^image\/(png|jpe?g|gif|webp|bmp|avif|svg\+xml)$/i;
// End: Rule 30 Footprint Constraints

// Start: Session Resolution Helper
async function resolveUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}
// End: Session Resolution Helper

// Start: Request Interfaces
interface RenameItem {
  oldKey: string;
  newKey: string;
}
interface RenameRequestBody {
  items?: RenameItem[];
  oldKey?: string;
  newKey?: string;
}
// End: Request Interfaces

// Start: Key Sanitizer (prevents path traversal / cross-user access)
function sanitizeKey(raw: string): string {
  return raw
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.\.+/g, '')
    .replace(/\/{2,}/g, '/');
}
// End: Key Sanitizer

// Start: POST Handler - Real R2 Rename (Copy + Delete)
export async function POST(req: NextRequest): Promise<NextResponse> {
  const userId = await resolveUserId(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Pengesahan diperlukan untuk menamakan semula fail' },
      { status: 401 }
    );
  }

  if (!CLOUDFLARE_R2_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    return NextResponse.json(
      { success: false, error: 'Kelayakan Cloudflare R2 tidak dikonfigurasikan' },
      { status: 500 }
    );
  }

  try {
    const body: RenameRequestBody = await req.json();

    // Accept either a single { oldKey, newKey } or an array { items: [...] }
    const items: RenameItem[] = [];
    if (body.items && Array.isArray(body.items)) {
      items.push(...body.items);
    } else if (body.oldKey && body.newKey) {
      items.push({ oldKey: body.oldKey, newKey: body.newKey });
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tiada pasangan kunci nam semula diberikan' },
        { status: 400 }
      );
    }

    const results: Array<{
      oldKey: string;
      newKey: string;
      success: boolean;
      error?: string;
    }> = [];

    // Start: Per-item Copy + Delete Sequence
    for (const item of items) {
      const rawOld = sanitizeKey(item.oldKey);
      const rawNew = sanitizeKey(item.newKey);

      // Scope-guard: both keys MUST belong to the caller's prefix
      if (!rawOld.startsWith(`${userId}/`) || !rawNew.startsWith(`${userId}/`)) {
        results.push({
          oldKey: rawOld,
          newKey: rawNew,
          success: false,
          error: 'Kunci berada di luar ruang pengguna anda',
        });
        continue;
      }

      if (rawOld === rawNew) {
        results.push({
          oldKey: rawOld,
          newKey: rawNew,
          success: false,
          error: 'Kunci sumber dan destinasi adalah sama',
        });
        continue;
      }

      try {
        // Rule 30: Enforce per-file image footprint before copy
        const head = await s3Client.send(
          new HeadObjectCommand({
            Bucket: CLOUDFLARE_R2_BUCKET_NAME,
            Key: rawOld,
          })
        );
        const mime = head.ContentType ?? '';
        const size = head.ContentLength ?? 0;
        if (IMAGE_MIME_RE.test(mime) && size > RULE30_MAX_IMAGE_BYTES) {
          results.push({
            oldKey: rawOld,
            newKey: rawNew,
            success: false,
            error: 'Imej melebihi had saiz 2MB (Peraturan 30)',
          });
          continue;
        }

        // 1. Copy source object to the new destination key
        const copyRes = await s3Client.send(
          new CopyObjectCommand({
            Bucket: CLOUDFLARE_R2_BUCKET_NAME,
            CopySource: `${CLOUDFLARE_R2_BUCKET_NAME}/${rawOld}`,
            Key: rawNew,
            ContentType: mime || undefined,
            MetadataDirective: 'COPY',
          })
        );

        // 2. Verify copy succeeded (ETag presence = object materialized)
        if (!copyRes.CopyObjectResult?.ETag && copyRes.$metadata.httpStatusCode !== 200) {
          results.push({
            oldKey: rawOld,
            newKey: rawNew,
            success: false,
            error: 'Salinan R2 gagal disahkan',
          });
          continue;
        }

        // 3. Remove the source footprint only after verified copy
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: CLOUDFLARE_R2_BUCKET_NAME,
            Key: rawOld,
          })
        );

        results.push({ oldKey: rawOld, newKey: rawNew, success: true });
      } catch (itemError: unknown) {
        const message =
          itemError instanceof Error ? itemError.message : 'Ralat tidak diketahui';
        results.push({
          oldKey: rawOld,
          newKey: rawNew,
          success: false,
          error: `Gagal menamakan semula: ${message}`,
        });
      }
    }
    // End: Per-item Copy + Delete Sequence

    const allOk = results.every((r) => r.success);
    return NextResponse.json(
      {
        success: allOk,
        results,
        renamedCount: results.filter((r) => r.success).length,
      },
      { status: allOk ? 200 : 207 }
    );
  } catch (error) {
    console.error('R2 rename error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menamakan semula objek simpanan' },
      { status: 500 }
    );
  }
}
// End: POST Handler