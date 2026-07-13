// Start: Cloudflare R2 Storage Hard-Delete Handler (Real Object Removal)
// Authenticates the user, then executes a genuine DeleteObjectsCommand
// scoped strictly to the caller's prefix so deletions never cross users.
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
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
interface DeleteRequestBody {
  keys?: string[]; // explicit R2 object keys (file deletes)
  folderNames?: string[]; // folder trees to purge recursively
}
// End: Request Interfaces

// Start: Folder Tree Key Expansion
async function expandFolderKeys(userId: string, folderNames: string[]): Promise<string[]> {
  const keys: string[] = [];
  for (const folder of folderNames) {
    const safe = folder.replace(/^\/+|\/+$/g, '').replace(/\.\./g, '');
    if (!safe) continue;
    const prefix = `${userId}/${safe}/`;

    let continuationToken: string | undefined;
    do {
      const list = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: CLOUDFLARE_R2_BUCKET_NAME,
          Prefix: prefix,
        })
      );
      for (const obj of list.Contents ?? []) {
        if (obj.Key) keys.push(obj.Key);
      }
      continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
    } while (continuationToken);
  }
  return keys;
}
// End: Folder Tree Key Expansion

// Start: POST Handler - Real R2 Deletion
export async function POST(req: NextRequest): Promise<NextResponse> {
  const userId = await resolveUserId(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Pengesahan diperlukan untuk memadam fail' },
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
    const body: DeleteRequestBody = await req.json();
    const rawKeys: string[] = Array.isArray(body.keys) ? body.keys : [];
    const rawFolders: string[] = Array.isArray(body.folderNames) ? body.folderNames : [];

    // Scope-guard: every key MUST belong to the caller's prefix
    const scopedKeys = rawKeys
      .filter((k) => typeof k === 'string' && k.startsWith(`${userId}/`))
      .map((k) => ({ Key: k }));

    const folderKeys = await expandFolderKeys(userId, rawFolders);
    const scopedFolderObjects = folderKeys
      .filter((k) => k.startsWith(`${userId}/`))
      .map((k) => ({ Key: k }));

    const allObjects = [...scopedKeys, ...scopedFolderObjects];
    if (allObjects.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tiada objek sah dikenal pasti untuk dipadam' },
        { status: 400 }
      );
    }

    // Cloudflare R2 batch delete (max 1000 keys per call)
    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Delete: { Objects: allObjects, Quiet: false },
      })
    );

    return NextResponse.json(
      { success: true, deletedCount: allObjects.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('R2 delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memadam objek simpanan' },
      { status: 500 }
    );
  }
}
// End: POST Handler