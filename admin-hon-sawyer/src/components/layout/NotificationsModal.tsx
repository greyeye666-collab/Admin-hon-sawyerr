import React from 'react';
import {
  BookOpenText,
  Inbox,
  X,
} from 'lucide-react';
import { useCms } from '../../lib/cmsContext';
import { formatTimestampShort } from '../../lib/utils';
import type { AdminRoute } from '../../types/database';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: AdminRoute) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { data } = useCms();

  if (!isOpen) return null;

  const newInquiries = data.contactInquiries.filter((i) => i.status === 'new');
  const draftEssays = data.blogPosts.filter((b) => b.status === 'draft');

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/35 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] mt-12 animate-in fade-in slide-in-from-top-4 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base font-bold text-stone-900">
                Secretariat Notifications
              </h2>
              {newInquiries.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {newInquiries.length} New
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">Citizen requests &amp; draft dispatches</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 divide-y divide-stone-100 overflow-y-auto space-y-2">
          {/* New Inquiries Section */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Unread Citizen Inquiries ({newInquiries.length})
            </div>
            {newInquiries.length === 0 ? (
              <div className="px-3 py-4 text-xs text-stone-400 text-center">
                All constituent messages triaged.
              </div>
            ) : (
              newInquiries.slice(0, 5).map((inq) => (
                <button
                  key={inq.id}
                  type="button"
                  onClick={() => {
                    onNavigate('inquiries');
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-stone-50 transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {inq.full_name}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0">
                        {formatTimestampShort(inq.created_at)}
                      </span>
                    </div>
                    <div className="text-xs text-stone-700 font-medium truncate mt-0.5">
                      {inq.reference_number}: {inq.message}
                    </div>
                    <div className="text-[11px] text-stone-400 truncate mt-0.5">
                      {inq.town} • {inq.category}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Draft Essays */}
          <div className="pt-2">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Unpublished Notebook Drafts ({draftEssays.length})
            </div>
            {draftEssays.length === 0 ? (
              <div className="px-3 py-4 text-xs text-stone-400 text-center">
                No drafts currently in studio.
              </div>
            ) : (
              draftEssays.slice(0, 4).map((draft) => (
                <button
                  key={draft.id}
                  type="button"
                  onClick={() => {
                    onNavigate('blog');
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-stone-50 transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpenText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {draft.title}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate mt-0.5">
                      {draft.category} • {draft.read_time}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200">
          <button
            type="button"
            onClick={() => {
              onNavigate('inquiries');
              onClose();
            }}
            className="w-full py-2 rounded-xl text-center text-xs font-semibold text-[#007A43] hover:bg-[#007A43]/10 transition-colors cursor-pointer"
          >
            Open Constituent Secretariat Inbox →
          </button>
        </div>
      </div>
    </div>
  );
};
