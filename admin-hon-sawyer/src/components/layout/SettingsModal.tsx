import React, { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  X,
} from 'lucide-react';
import { useCms } from '../../lib/cmsContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ui/toastContext';

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
  const { data } = useCms();
  const { showToast } = useToast();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassText, setShowPassText] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!isOpen) return null;

  const publishedProjectsCount = data.projects.filter((p) => p.is_published).length;
  const publishedNewsCount = data.newsArticles.filter((n) => n.is_published).length;
  const publishedBlogsCount = data.blogPosts.filter((b) => b.status === 'published').length;
  const unreadInquiriesCount = data.contactInquiries.filter((i) => i.status === 'new').length;

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !officer.isLive) return;

    if (newPassword.length < 8) {
      showToast('Password too short', {
        description: 'Please enter at least 8 characters.',
        tone: 'error',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', {
        description: 'Please make sure both password fields match.',
        tone: 'error',
      });
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      showToast('Password updated', {
        description: 'Your Secretariat sign-in password has been changed.',
      });
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      showToast('Unable to update password', {
        description: err instanceof Error ? err.message : 'Please try again.',
        tone: 'error',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

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
              Account &amp; Portal Settings
            </h2>
            <p className="text-xs text-stone-500">
              Manage your Secretariat account, password, and publishing overview
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Active Officer Profile */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#007A43] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {officer.fullName ? officer.fullName.charAt(0).toUpperCase() : 'S'}
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

            {officer.isLive && supabase && (
              <div className="pt-2 border-t border-stone-200/70">
                {!showPasswordForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007A43] hover:text-[#005A30] cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change Account Password</span>
                  </button>
                ) : (
                  <form onSubmit={handlePasswordUpdate} className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-800">
                        Set New Password
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassText ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min. 8 characters)"
                        className="editorial-input pl-8 pr-9 py-1.5 text-xs bg-white"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassText((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                        aria-label={showPassText ? 'Hide password' : 'Show password'}
                      >
                        {showPassText ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <input
                      type={showPassText ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="editorial-input py-1.5 text-xs bg-white"
                      required
                      minLength={8}
                    />

                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="btn-editorial-primary w-full py-2 text-xs"
                    >
                      {updatingPassword ? 'Updating Password…' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Website Publishing Overview (Secretary-friendly language) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Secretariat Publishing Status
            </h3>

            <div className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#007A43] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-900">
                    Public Website Sync
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{officer.isLive ? 'Live & Active' : 'Preview Mode'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                  {officer.isLive
                    ? 'Updates saved in this portal automatically appear on the official Agona East website.'
                    : 'Running in local preview mode. Changes are saved in this browser only.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl border border-stone-200/80 bg-stone-50/50">
                <div className="text-[11px] text-stone-500 font-medium">Published Projects</div>
                <div className="font-serif text-lg font-bold text-stone-900 tabular-nums">
                  {publishedProjectsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-stone-50/50">
                <div className="text-[11px] text-stone-500 font-medium">Press Dispatches</div>
                <div className="font-serif text-lg font-bold text-stone-900 tabular-nums">
                  {publishedNewsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-stone-50/50">
                <div className="text-[11px] text-stone-500 font-medium">Published Essays</div>
                <div className="font-serif text-lg font-bold text-stone-900 tabular-nums">
                  {publishedBlogsCount}
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200/80 bg-stone-50/50">
                <div className="text-[11px] text-stone-500 font-medium">Unread Inquiries</div>
                <div className="font-serif text-lg font-bold text-stone-900 tabular-nums">
                  {unreadInquiriesCount}
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Secretariat</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
          <span>Office of Hon. Queenstar Maame Pokua Sawyerr</span>
          <span>Agona East Secretariat</span>
        </div>
      </div>
    </div>
  );
};
