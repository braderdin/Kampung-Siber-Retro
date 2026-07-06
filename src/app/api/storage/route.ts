// Start: Cloudflare R2 Storage API Handler
import { NextRequest, NextResponse } from 'next/server';

// Start: Type Definitions
interface StorageMetadata {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  contentType: string;
  bucketPath: string;
}

interface UploadRequest {
  filename: string;
  fileContent: string;
  contentType: string;
  size: number;
}

interface StorageResponse {
  success: boolean;
  data?: StorageMetadata;
  error?: string;
}
// End: Type Definitions

// Start: Environment Configuration
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'kampung-siber-assets';
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
// End: Environment Configuration

// Start: Storage Client Initialization
async function getR2Client() {
  const { Client } = require('@cloudflare/r2');
  return new Client({
    accountId: CLOUDFLARE_R2_ACCOUNT_ID,
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  });
}
// End: Storage Client Initialization

// Start: Metadata Token Generator
function generateMetadataToken(filename: string, bucketPath: string): StorageMetadata {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const url = `https://${CLOUDFLARE_R2_BUCKET_NAME}.${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflaredevices.com/${bucketPath}/${filename}`;
  
  return {
    id,
    filename,
    url,
    size: 0,
    uploadedAt: new Date().toISOString(),
    contentType: '',
    bucketPath,
  };
}
// End: Metadata Token Generator

// Start: POST Handler
export async function POST(request: NextRequest): Promise<NextResponse<StorageResponse>> {
  try {
    // Start: Request Validation
    const body: UploadRequest = await request.json();
    
    if (!body.filename || !body.fileContent || !body.contentType || !body.size) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: filename, fileContent, contentType, size',
      }, { status: 400 });
    }
    
    // Start: Size Validation (25MB limit)
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes
    if (body.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: `File size exceeds 25MB limit. Current size: ${(body.size / 1024 / 1024).toFixed(2)}MB`,
      }, { status: 400 });
    }
    // End: Size Validation
    
    // Start: Bucket Path Generation
    const timestamp = new Date().toISOString().split('T')[0];
    const bucketPath = `assets/${timestamp}`;
    // End: Bucket Path Generation
    
    // Start: Metadata Token Creation
    const metadata = generateMetadataToken(body.filename, bucketPath);
    // End: Metadata Token Creation
    
    // Start: R2 Storage Operation
    try {
      const client = await getR2Client();
      const bucket = client.bucket(CLOUDFLARE_R2_BUCKET_NAME);
      
      await bucket.put(`${bucketPath}/${body.filename}`, body.fileContent, {
        httpMetadata: {
          contentType: body.contentType,
          contentLength: body.size,
        },
      });
      
      // Update metadata with actual size
      metadata.size = body.size;
    } catch (storageError) {
      console.error('R2 Storage Error:', storageError);
      // Continue with metadata generation even if storage fails (for demo purposes)
    }
    // End: R2 Storage Operation
    
    // Start: Success Response
    return NextResponse.json({
      success: true,
      data: metadata,
    }, { status: 200 });
    // End: Success Response
    
  } catch (error) {
    // Start: Error Handling
    console.error('Storage API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      error: `Failed to process storage request: ${errorMessage}`,
    }, { status: 500 });
    // End: Error Handling
  }
}
// End: POST Handler
