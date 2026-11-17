import React, { useCallback, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { generateUuid } from '../../lib/utils';
import { ToastContext, type ToastTone } from './toastContext';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, options?: { description?: string; tone?: ToastTone }) => {
      const id = generateUuid();
      const tone = options?.tone ?? 'success';
      setToasts((prev) => [...prev.slice(-3), { id, title, description: options?.description, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const borderAccent =
            toast.tone === 'error'
              ? 'border-l-[3px] border-l-[#D61F33]'
              : toast.tone === 'info'
                ? 'border-l-[3px] border-l-[#C9963B]'
                : 'border-l-[3px] border-l-[#007A43]';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-white border border-[rgba(17,20,18,0.1)] ${borderAccent} rounded-xl px-4 py-3 flex items-start gap-3 transition-all`}
              style={{ boxShadow: '0 8px 24px rgba(17, 20, 18, 0.08)' }}
            >
              <div className="mt-0.5 shrink-0">
                {toast.tone === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-[#D61F33]" />
                ) : toast.tone === 'info' ? (
                  <Info className="w-4 h-4 text-[#C9963B]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#007A43]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#111412]">{toast.title}</div>
                {toast.description && (
                  <div className="text-xs text-[#636C67] mt-0.5 leading-relaxed">
                    {toast.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-[#636C67] hover:text-[#111412] p-0.5 rounded cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

