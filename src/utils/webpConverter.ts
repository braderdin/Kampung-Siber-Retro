// Start: WebP Image Optimization Utility (Rule 30 Compliance)
// Converts raw user image files into high-performance WebP at a fixed
// quality index of 80-85%, targeting a physical footprint below 200KB
// while keeping imagery crisp and sharp. Pure client-side canvas pipeline.

// Start: Configuration Constants
const TARGET_MAX_BYTES = 200 * 1024; // 200KB hard ceiling per asset (Rule 30)
const INITIAL_QUALITY = 0.85; // High-quality start (80-85% band)
const MIN_QUALITY = 0.8; // Lower bound of the 80-85% band
const QUALITY_STEP = 0.01;
const MAX_DIMENSION = 2048; // Deflate oversized source dimensions
// End: Configuration Constants

// Start: Convert Result Interface
export interface WebpConvertResult {
  blob: Blob;
  filename: string;
  size: number;
  contentType: string;
}

// Start: Dimension Constraint Helper
function constrainDimensions(
  width: number,
  height: number
): { width: number; height: number } {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { width, height };
  }
  const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}
// End: Dimension Constraint Helper

// Start: Single-Pass Canvas Encode
function encodeCanvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      'image/webp',
      quality
    );
  });
}
// End: Single-Pass Canvas Encode

// Start: Primary Conversion Function
export async function convertImageToWebp(
  file: File,
  outputName?: string
): Promise<WebpConvertResult> {
  // Decode the source image into an offscreen element
  const bitmapUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = bitmapUrl;
    await img.decode();

    const { width, height } = constrainDimensions(img.naturalWidth, img.naturalHeight);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Konteks kanvas tidak tersedia untuk penukaran WebP');
    }
    ctx.drawImage(img, 0, 0, width, height);

    let quality = INITIAL_QUALITY;
    let encoded: Blob | null = null;

    // Iteratively deflate quality within the 80-85% band until < 200KB
    while (quality >= MIN_QUALITY) {
      encoded = await encodeCanvasToWebp(canvas, quality);
      if (encoded && encoded.size <= TARGET_MAX_BYTES) {
        break;
      }
      quality = Math.round((quality - QUALITY_STEP) * 100) / 100;
    }

    // Fallback: accept the last (lowest-band) encode if still over budget
    if (!encoded) {
      encoded = await encodeCanvasToWebp(canvas, MIN_QUALITY);
    }

    if (!encoded) {
      throw new Error('Penukaran WebP gagal dihasilkan');
    }

    const baseName =
      outputName?.replace(/\.[^.]+$/, '') ||
      file.name.replace(/\.[^.]+$/, '');

    return {
      blob: encoded,
      filename: `${baseName}.webp`,
      size: encoded.size,
      contentType: 'image/webp',
    };
  } finally {
    URL.revokeObjectURL(bitmapUrl);
  }
}
// End: Primary Conversion Function

// Start: Image Type Guard
export function isConvertibleImage(file: File): boolean {
  return file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
}
// End: Image Type Guard
// End: WebP Image Optimization Utility