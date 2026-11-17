import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning';
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  tone = 'danger',
  busy = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#111412]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-[rgba(17,20,18,0.12)] rounded-2xl max-w-md w-full overflow-hidden">
        <div className="ndc-ribbon">
          <span />
          <span />
          <span />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  tone === 'danger'
                    ? 'bg-[#D61F33]/10 text-[#D61F33]'
                    : 'bg-[#C9963B]/15 text-[#8F651C]'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111412] leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-[#636C67] mt-1.5 leading-relaxed">{description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-[#636C67] hover:text-[#111412] p-1 rounded cursor-pointer"
              aria-label="Close confirmation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[rgba(17,20,18,0.085)]">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="btn-editorial-secondary"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={tone === 'danger' ? 'btn-editorial-danger' : 'btn-editorial-primary'}
            >
              {busy ? 'Processing…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
