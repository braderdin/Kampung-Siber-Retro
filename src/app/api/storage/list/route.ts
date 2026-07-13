// Start: Cloudflare R2 Storage List Handler (Real Object Inventory)
// Authenticates the user, then enumerates genuine object metadata from the
// `kampung-siber-assets` bucket scoped strictly to the caller's prefix.
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
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

// Start: Response Interfaces
interface ListedFile {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  url: string;
  type: 'file';
}

interface ListedFolder {
  id: string;
  name: string;
  createdAt: string;
  type: 'folder';
}

interface StorageListResponse {
  success: boolean;
  files?: ListedFile[];
  folders?: ListedFolder[];
  totalSize?: number;
  error?: string;
}
// End: Response Interfaces

// Start: GET Handler - Authentic R2 Object Inventory
export async function GET(req: NextRequest): Promise<NextResponse<StorageListResponse>> {
  const userId = await resolveUserId(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Pengesahan diperlukan untuk mengakses simpanan' },
      { status: 401 }
    );
  }

  if (!CLOUDFLARE_R2_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    return NextResponse.json(
      { success: false, error: 'Kelayakan Cloudflare R2 tidak dikonfigurasikan' },
      { status: 500 }
    );
  }

  const prefix = `${userId}/`;

  try {
    const command = new ListObjectsV2Command({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
    });
    const result = await s3Client.send(command);

    const folders: ListedFolder[] = [];
    const folderNameSet = new Set<string>();

    // Common prefixes represent true sub-directory trees
    for (const cp of result.CommonPrefixes ?? []) {
      const raw = cp.Prefix ?? '';
      const name = raw.slice(prefix.length).replace(/\/$/, '');
      if (name) {
        folderNameSet.add(name);
        folders.push({
          id: `folder:${name}`,
          name,
          createdAt: new Date().toISOString(),
          type: 'folder',
        });
      }
    }

    const files: ListedFile[] = [];
    let totalSize = 0;

    for (const obj of result.Contents ?? []) {
      const key = obj.Key ?? '';
      // Skip .keep placeholder objects - they only persist folder trees
      if (key.endsWith('/.keep')) continue;

      const filename = key.slice(prefix.length);
      // Skip objects that live inside a sub-folder at this root level view
      if (filename.includes('/')) continue;

      const size = obj.Size ?? 0;
      totalSize += size;
      const contentType = inferContentType(filename);

      files.push({
        id: key,
        filename,
        size,
        contentType,
        uploadedAt: (obj.LastModified ?? new Date()).toISOString(),
        url: `https://${CLOUDFLARE_R2_BUCKET_NAME}.${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`,
        type: 'file',
      });
    }

    return NextResponse.json(
      { success: true, files, folders, totalSize },
      { status: 200 }
    );
  } catch (error) {
    console.error('R2 list error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyenaraikan objek simpanan' },
      { status: 500 }
    );
  }
}
// End: GET Handler

// Start: Folder Persistence Helper (POST)
// Persists a folder tree by writing a zero-byte `.keep` placeholder object
// directly inside the R2 directory hierarchy so it survives reloads.

export async function POST(req: NextRequest): Promise<NextResponse> {
  const userId = await resolveUserId(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Pengesahan diperlukan untuk mencipta folder' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const folderName: string = body.folderName?.trim();
    if (!folderName || folderName.includes('/') || folderName.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'Nama folder tidak sah' },
        { status: 400 }
      );
    }

    const keepKey = `${userId}/${folderName}/.keep`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET_NAME,
        Key: keepKey,
        Body: '',
        ContentType: 'application/x-directory',
      })
    );

    return NextResponse.json({ success: true, key: keepKey }, { status: 200 });
  } catch (error) {
    console.error('R2 folder create error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mencipta folder' },
      { status: 500 }
    );
  }
}
// End: Folder Persistence Helper

// Start: Content-Type Inference
function inferContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    mjs: 'text/javascript',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    md: 'text/markdown',
    pdf: 'application/pdf',
  };
  return map[ext] ?? 'application/octet-stream';
}
// End: Content-Type Inference