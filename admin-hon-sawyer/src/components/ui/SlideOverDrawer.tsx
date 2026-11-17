import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SlideOverDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  dirty?: boolean;
  widthClass?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const SlideOverDrawer: React.FC<SlideOverDrawerProps> = ({
  open,
  title,
  subtitle,
  dirty = false,
  widthClass = 'max-w-3xl',
  onClose,
  footer,
  children,
}) => {
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const attemptClose = useCallback(() => {
    if (dirty) {
      setConfirmDiscard(true);
    } else {
      setConfirmDiscard(false);
      onClose();
    }
  }, [dirty, onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        attemptClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, attemptClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] flex justify-end bg-[#111412]/35 backdrop-blur-[1px]">
        <div className="flex-1" onClick={attemptClose} aria-hidden="true" />
        <aside
          className={`relative w-full ${widthClass} bg-[#FAF9F6] border-l border-[rgba(17,20,18,0.12)] flex flex-col h-full`}
          role="dialog"
          aria-modal="true"
        >
          <div className="ndc-ribbon shrink-0">
            <span />
            <span />
            <span />
          </div>

          <header className="px-6 py-4 bg-white border-b border-[rgba(17,20,18,0.085)] flex items-start justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-xl font-bold text-[#111412]">{title}</h2>
                {dirty && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
                    Unsaved Changes
                  </span>
                )}
              </div>
              {subtitle && <p className="text-xs text-[#636C67] mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={attemptClose}
              className="p-2 rounded-lg text-[#636C67] hover:text-[#111412] hover:bg-[#F3F5F3] cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">{children}</div>

          {footer && (
            <footer className="px-6 py-4 bg-white border-t border-[rgba(17,20,18,0.085)] flex items-center justify-between gap-3 shrink-0">
              {footer}
            </footer>
          )}
        </aside>
      </div>

      <ConfirmModal
        open={confirmDiscard}
        title="Discard unsaved editorial changes?"
        description="You have unpersisted edits in this drawer. Closing now will revert to the last saved version."
        confirmLabel="Discard Changes"
        cancelLabel="Keep Editing"
        tone="warning"
        onConfirm={() => {
          setConfirmDiscard(false);
          onClose();
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </>
  );
};
