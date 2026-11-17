import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { MediaFolder } from '../types/database';
import { optimizeImageForUpload } from './imageOptimizer';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-supabase')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

const ALLOWED_STAFF_ROLES = new Set(['admin', 'secretariat', 'editor']);

export interface StaffVerificationResult {
  authorized: boolean;
  role: string;
  fullName: string;
  reason?: string;
}

/**
 * Verifies that the authenticated Supabase user holds an authorized Secretariat
 * or Communications staff role via app_metadata or public.secretariat_staff.
 */
export async function verifySecretariatRole(
  user: User
): Promise<StaffVerificationResult> {
  if (!supabase) {
    return { authorized: false, role: 'none', fullName: 'Guest', reason: 'Supabase is not configured.' };
  }

  const appRole = String(user.app_metadata?.role ?? '').toLowerCase();
  if (ALLOWED_STAFF_ROLES.has(appRole)) {
    return {
      authorized: true,
      role: appRole,
      fullName:
        String(user.user_metadata?.full_name ?? '') ||
        user.email ||
        'Secretariat Officer',
    };
  }

  const emailLower = (user.email ?? '').toLowerCase();
  const { data, error } = await supabase
    .from('secretariat_staff')
    .select('full_name, role, is_active')
    .or(`user_id.eq.${user.id},email.ilike.${emailLower}`)
    .eq('is_active', true)
    .maybeSingle();

  if (!error && data && ALLOWED_STAFF_ROLES.has(String(data.role).toLowerCase())) {
    return {
      authorized: true,
      role: String(data.role),
      fullName: data.full_name || user.email || 'Secretariat Officer',
    };
  }

  return {
    authorized: false,
    role: 'unauthorized',
    fullName: user.email || 'Authenticated User',
    reason:
      'Your account is signed in, but lacks Secretariat / Communications staff clearance. Ask an administrator to grant role="secretariat" in app_metadata or add your email to public.secretariat_staff.',
  };
}

export interface UploadedMediaResult {
  publicUrl: string;
  storagePath: string;
  originalBytes: number;
  finalBytes: number;
  wasCompressed: boolean;
}

/**
 * Optimizes and uploads an image file to the shared Supabase Storage `media` bucket
 * under the requested folder (`hero/`, `projects/`, `news/`, `blog/`, `gallery/`, `profile/`).
 * Structured so the storage backend can later be swapped to Cloudflare R2 without changing callers.
 */
export async function uploadMediaFile(
  rawFile: File,
  folder: MediaFolder,
  onProgress?: (percent: number) => void
): Promise<UploadedMediaResult> {
  onProgress?.(10);

  const { file, originalBytes, finalBytes, wasCompressed } =
    await optimizeImageForUpload(rawFile);

  onProgress?.(28);

  if (!supabase) {
    // Graceful local preview fallback using a compact Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        onProgress?.(100);
        resolve({
          publicUrl: String(reader.result ?? ''),
          storagePath: `${folder}/${file.name}`,
          originalBytes,
          finalBytes,
          wasCompressed,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read local image file.'));
      reader.readAsDataURL(file);
    });
  }

  const safeExt = (file.name.split('.').pop() || 'webp').toLowerCase().replace(/[^a-z0-9]/g, '');
  const baseName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const path = `${folder}/${Date.now()}-${baseName || 'asset'}.${safeExt}`;

  onProgress?.(50);

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: true,
      contentType: file.type || 'image/webp',
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  onProgress?.(85);

  const { data } = supabase.storage.from('media').getPublicUrl(path);
  onProgress?.(100);

  return {
    publicUrl: data.publicUrl,
    storagePath: path,
    originalBytes,
    finalBytes,
    wasCompressed,
  };
}
