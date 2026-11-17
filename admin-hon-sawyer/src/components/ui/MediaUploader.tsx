import React, { useId, useState } from 'react';
import { Image as ImageIcon, Link2, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { formatBytes } from '../../lib/imageOptimizer';
import { uploadMediaFile } from '../../lib/supabase';
import type { MediaFolder } from '../../types/database';
import { useToast } from './toastContext';

interface MediaUploaderProps {
  label: string;
  value: string;
  folder: MediaFolder;
  onChange: (url: string) => void;
  aspectClass?: string;
  objectPosition?: string;
  helperText?: string;
  compact?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  value,
  folder,
  onChange,
  aspectClass = 'aspect-[16/9]',
  objectPosition = 'center center',
  helperText,
  compact = false,
}) => {
  const inputId = useId();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid file format', {
        description: 'Please upload a JPEG, PNG, WebP, or AVIF image.',
        tone: 'error',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('File exceeds 10 MB limit', {
        description: 'Please compress the photograph below 10 MB before uploading.',
        tone: 'error',
      });
      return;
    }

    setUploading(true);
    setProgress(5);
    try {
      const result = await uploadMediaFile(file, folder, setProgress);
      onChange(result.publicUrl);
      showToast('Photograph uploaded', {
        description: result.wasCompressed
          ? `Optimized to WebP (${formatBytes(result.originalBytes)} → ${formatBytes(result.finalBytes)}) in media/${folder}/`
          : `Stored in media/${folder}/ (${formatBytes(result.finalBytes)}).`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      showToast('Upload failed', { description: msg, tone: 'error' });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 400);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput((s) => !s)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#636C67] hover:text-[#007A43] cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Paste image URL'}</span>
        </button>
      </div>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[rgba(17,20,18,0.12)] bg-[#F3F5F3]">
          <div className={`${compact ? 'h-36' : aspectClass} w-full overflow-hidden`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              style={{ objectPosition }}
            />
          </div>

          <div className="px-3 py-2 bg-white border-t border-[rgba(17,20,18,0.085)] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#636C67] truncate flex-1 font-mono">
              {value.startsWith('data:') ? 'Local preview image attached' : value}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <label
                htmlFor={inputId}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[rgba(17,20,18,0.14)] text-xs font-medium text-[#111412] hover:bg-[#F3F5F3] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </label>
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[rgba(214,31,51,0.22)] text-xs font-medium text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex flex-col items-center justify-center ${
            compact ? 'py-5' : 'py-8'
          } px-4 rounded-xl border border-dashed border-[rgba(17,20,18,0.22)] bg-[#FAF9F6] hover:bg-[#F3F5F3] hover:border-[#007A43] transition-colors cursor-pointer text-center`}
        >
          <div className="w-10 h-10 rounded-full bg-[#007A43]/10 text-[#007A43] flex items-center justify-center mb-2">
            {uploading ? (
              <UploadCloud className="w-5 h-5 animate-pulse" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>
          <span className="text-sm font-semibold text-[#111412]">
            {uploading ? 'Uploading to Storage…' : 'Upload photograph'}
          </span>
          <span className="text-xs text-[#636C67] mt-0.5">
            {`Uploads to media/${folder}/ (JPG, PNG, WebP up to 10 MB)`}
          </span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploading && progress > 0 && (
        <div className="w-full h-1.5 bg-[#F3F5F3] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#007A43] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {(showUrlInput || !value) && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload an image above"
          className="editorial-input text-xs"
        />
      )}

      {helperText && <p className="text-[11px] text-[#636C67]">{helperText}</p>}
    </div>
  );
};
