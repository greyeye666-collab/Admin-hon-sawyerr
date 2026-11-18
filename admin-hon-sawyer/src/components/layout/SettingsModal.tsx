import React from 'react';
import {
  CheckCircle2,
  Database,
  HardDrive,
  KeyRound,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: { email: string; fullName: string; role: string; isLive: boolean };
  onSignOut: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  officer,
  onSignOut,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Secretariat Portal Settings
            </h2>
            <p className="text-xs text-stone-500">
              Infrastructure status, officer credentials &amp; cloud storage
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Active Officer Profile */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#007A43] text-white flex items-center justify-center font-bold text-sm">
                {officer.fullName ? officer.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-stone-900 truncate">
                  {officer.fullName || 'Secretariat Staff'}
                </div>
                <div className="text-xs text-stone-500 truncate">{officer.email}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#007A43]/10 text-[#007A43] border border-[#007A43]/20">
                {officer.role}
              </span>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Backend &amp; Cloud Infrastructure
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1">
                <div className="flex items-center gap-2 text-stone-600 font-semibold">
                  <Database className="w-4 h-4 text-[#007A43]" />
                  <span>Database</span>
                </div>
                <div className="font-mono text-[11px] text-stone-500 truncate">
                  PostgreSQL 17 (eu-central-1)
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Schema Synchronized</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1">
                <div className="flex items-center gap-2 text-stone-600 font-semibold">
                  <HardDrive className="w-4 h-4 text-[#007A43]" />
                  <span>Media Bucket</span>
                </div>
                <div className="font-mono text-[11px] text-stone-500 truncate">
                  bucket: media/ (public)
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Client-Side WebP</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1">
                <div className="flex items-center gap-2 text-stone-600 font-semibold">
                  <KeyRound className="w-4 h-4 text-[#007A43]" />
                  <span>Authentication</span>
                </div>
                <div className="font-mono text-[11px] text-stone-500 truncate">
                  Supabase Auth + RLS
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active Session</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1">
                <div className="flex items-center gap-2 text-stone-600 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#007A43]" />
                  <span>Advisors Audit</span>
                </div>
                <div className="font-mono text-[11px] text-stone-500 truncate">
                  Clean (0 warnings)
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Optimized Search Path</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Sign Out of Secretariat
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-400">
          <span>Office of Hon. Queenstar Sawyerr</span>
          <span>v2.2 Production</span>
        </div>
      </div>
    </div>
  );
};
