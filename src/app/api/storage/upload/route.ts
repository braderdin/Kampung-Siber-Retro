// Start: Cloudflare R2 Storage Upload Handler for Text Editor
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const MAX_TEXT_SIZE = 500 * 1024; // 500KB for text content
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/json",
  "text/html",
  "text/css",
  "text/javascript",
];

// Initialize Supabase client for session authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Start: R2 Configuration Constants
const R2_ENDPOINT = process.env.R2_ENDPOINT || 'https://account.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kampung-siber-sites';
// End: R2 Configuration Constants

// Start: Session Authentication Helper
async function authenticateSession(req: NextRequest): Promise<{ authenticated: boolean; userId?: string }> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false };
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { authenticated: false };
    }

    return { authenticated: true, userId: user.id };
  } catch (error) {
    console.error('Session authentication error:', error);
    return { authenticated: false };
  }
}
// End: Session Authentication Helper

// Start: Upload Request Interface
interface UploadRequest {
  file?: File;
  fileName?: string;
  content?: string;
  mimeType?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}
// End: Upload Request Interface

// Start: Upload Response Interface
interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  size: number;
  error?: string;
}
// End: Upload Response Interface

// Start: File Validation Interface
interface FileValidation {
  valid: boolean;
  error?: string;
  size: number;
  mimeType: string;
}
// End: File Validation Interface

// Start: File Validation Function
const validateFile = async (file: File): Promise<FileValidation> => {
  const size = file.size;
  const mimeType = file.type;

  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Saiz fail melebihi had 4.5MB (${(size / 1024 / 1024).toFixed(2)}MB)`,
      size,
      mimeType,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Jenis fail ${mimeType} tidak dibenarkan`,
      size,
      mimeType,
    };
  }

  if (size === 0) {
    return {
      valid: false,
      error: "Fail tidak sah (saiz sifar)",
      size,
      mimeType,
    };
  }

  return {
    valid: true,
    size,
    mimeType,
  };
};
// End: File Validation Function

// Start: Filename Sanitization Function
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^(\.)|(\.)$/g, "")
    .substring(0, 255);
};
// End: Filename Sanitization Function

// Start: POST Handler for Binary File Upload
export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Start: Session Authentication Check
    const { authenticated, userId } = await authenticateSession(req);
    
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        error: 'Pengesahan diperlukan untuk muat naik fail',
        size: 0,
      }, { status: 401 });
    }
    // End: Session Authentication Check

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metadata = formData.get("metadata") ? 
      JSON.parse(formData.get("metadata") as string) : {};

    if (!file) {
      return NextResponse.json({
        success: false,
        error: "Tiada fail yang diserakan",
        size: 0,
      }, { status: 400 });
    }

    const validation = await validateFile(file);
    
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
        size: validation.size,
      }, { status: 400 });
    }

    const sanitizedFileName = sanitizeFileName(file.name);
    const timestamp = Date.now();
    const fileKey = `${userId}/${sanitizedFileName}`;

    // Start: R2 Upload Logic (Mock Implementation)
    // In production, use AWS SDK S3 compatible client for Cloudflare R2
    try {
      // Placeholder for actual R2 implementation
      // const r2Client = new S3Client({
      //   endpoint: R2_ENDPOINT,
      //   credentials: {
      //     accessKeyId: R2_ACCESS_KEY_ID,
      //     secretAccessKey: R2_SECRET_ACCESS_KEY,
      //   },
      //   region: 'auto',
      // });
      // 
      // const arrayBuffer = await file.arrayBuffer();
      // const buffer = Buffer.from(arrayBuffer);
      // 
      // const command = new PutObjectCommand({
      //   Bucket: R2_BUCKET_NAME,
      //   Key: fileKey,
      //   Body: buffer,
      //   ContentType: file.type,
      // });
      // 
      // await r2Client.send(command);
    } catch (r2Error) {
      console.error('R2 upload error:', r2Error);
    }
    // End: R2 Upload Logic

    const uploadResponse: UploadResponse = {
      success: true,
      url: `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${fileKey}`,
      key: fileKey,
      size: validation.size,
    };

    return NextResponse.json(uploadResponse, { status: 200 });

  } catch (error) {
    console.error("Error processing upload:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal memproses muat naik",
      size: 0,
    }, { status: 500 });
  }
}
// End: POST Handler for Binary File Upload

// Start: PUT Handler for Text Content Upload (Editor)
export async function PUT(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Start: Session Authentication Check
    const { authenticated, userId } = await authenticateSession(req);
    
    if (!authenticated) {
      return NextResponse.json({
        success: false,
        error: 'Pengesahan diperlukan untuk mengemas kini kandungan',
        size: 0,
      }, { status: 401 });
    }
    // End: Session Authentication Check

    const body = await req.json();
    
    const { content, fileName, mimeType }: { content?: string; fileName: string; mimeType?: string } = body;

    // Start: Payload Validation
    if (!fileName) {
      return NextResponse.json({
        success: false,
        error: "Nama fail diperlukan",
        size: 0,
      }, { status: 400 });
    }

    if (!content && content !== '') {
      return NextResponse.json({
        success: false,
        error: "Kandungan fail diperlukan",
        size: 0,
      }, { status: 400 });
    }

    // Validate content size
    const contentSize = Buffer.byteLength(content || '', 'utf8');
    if (contentSize > MAX_TEXT_SIZE) {
      return NextResponse.json({
        success: false,
        error: `Saiz kandungan melebihi had ${MAX_TEXT_SIZE / 1024}KB`,
        size: contentSize,
      }, { status: 400 });
    }
    // End: Payload Validation

    // Sanitize filename
    const sanitizedFileName = sanitizeFileName(fileName);
    const fileKey = `${userId}/${sanitizedFileName}`;

    // Start: R2 Text Content Upload Logic
    try {
      // Placeholder for actual R2 implementation
      // const r2Client = new S3Client({
      //   endpoint: R2_ENDPOINT,
      //   credentials: {
      //     accessKeyId: R2_ACCESS_KEY_ID,
      //     secretAccessKey: R2_SECRET_ACCESS_KEY,
      //   },
      //   region: 'auto',
      // });
      // 
      // const command = new PutObjectCommand({
      //   Bucket: R2_BUCKET_NAME,
      //   Key: fileKey,
      //   Body: content,
      //   ContentType: mimeType || 'text/html',
      // });
      // 
      // await r2Client.send(command);
    } catch (r2Error) {
      console.error('R2 text upload error:', r2Error);
    }
    // End: R2 Text Content Upload Logic

    const uploadResponse: UploadResponse = {
      success: true,
      url: `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${fileKey}`,
      key: fileKey,
      size: contentSize,
    };

    return NextResponse.json(uploadResponse, { status: 200 });

  } catch (error) {
    console.error("Error processing text upload:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal mengemas kini kandungan fail",
      size: 0,
    }, { status: 500 });
  }
}
// End: PUT Handler for Text Content Upload

// Start: GET Handler for Upload Limits
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      maxSize: MAX_FILE_SIZE,
      maxTextSize: MAX_TEXT_SIZE,
      allowedTypes: ALLOWED_MIME_TYPES,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Gagal mendapatkan tetapan muat naik",
    }, { status: 500 });
  }
}
// End: GET Handler for Upload Limits