export interface OptimizedImageResult {
  file: File;
  originalBytes: number;
  finalBytes: number;
  wasCompressed: boolean;
}

/**
 * Resizes and encodes browser image uploads to WebP (max 1600px) so photos fit
 * comfortably within Supabase Storage's free tier and load fast on mobile.
 * Falls back to the original file if canvas/WebP is unsupported or larger.
 */
export async function optimizeImageForUpload(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<OptimizedImageResult> {
  const originalBytes = file.size;

  // Skip non-raster or already tiny files (< 120 KB)
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || originalBytes < 120 * 1024) {
    return { file, originalBytes, finalBytes: originalBytes, wasCompressed: false };
  }

  try {
    const bitmap = await loadImageElement(file);
    const { width, height } = bitmap;

    const scale = Math.min(1, maxDimension / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, originalBytes, finalBytes: originalBytes, wasCompressed: false };
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );

    if (!blob || blob.size >= originalBytes) {
      return { file, originalBytes, finalBytes: originalBytes, wasCompressed: false };
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
    const optimizedFile = new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      originalBytes,
      finalBytes: optimizedFile.size,
      wasCompressed: true,
    };
  } catch {
    return { file, originalBytes, finalBytes: originalBytes, wasCompressed: false };
  }
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image for optimization'));
    };
    img.src = url;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
