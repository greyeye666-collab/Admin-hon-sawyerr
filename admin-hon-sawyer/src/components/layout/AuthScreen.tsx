import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import honSawyerrImg from '../../assets/hon-sawyerr-podium.jpg';
import { isSupabaseConfigured, supabase, verifySecretariatRole } from '../../lib/supabase';

interface AuthScreenProps {
  onAuthenticated: (officer: {
    email: string;
    fullName: string;
    role: string;
    isLive: boolean;
  }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!supabase) {
      setErrorMsg(
        'Supabase environment variables are not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env or enter Local Secretariat Preview below.'
      );
      return;
    }

    setSubmitting(true);
    try {
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        setInfoMsg(
          'Password reset instructions have been dispatched if that Secretariat email is registered.'
        );
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (!data.user) {
        setErrorMsg('Authentication succeeded but no user session was returned.');
        return;
      }

      const verification = await verifySecretariatRole(data.user);
      if (!verification.authorized) {
        await supabase.auth.signOut();
        setErrorMsg(
          verification.reason || 'Access denied: Secretariat staff clearance required.'
        );
        return;
      }

      onAuthenticated({
        email: data.user.email || email.trim(),
        fullName: verification.fullName,
        role: verification.role,
        isLive: true,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnterPreview = () => {
    onAuthenticated({
      email: 'secretariat@honpokuasawyerr.org',
      fullName: 'Constituency Communications Desk',
      role: 'secretariat (preview)',
      isLive: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      <div className="ndc-ribbon">
        <span />
        <span />
        <span />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[900px] bg-white border border-[rgba(17,20,18,0.1)] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Personalized Portrait Panel */}
          <div className="md:col-span-5 relative min-h-[240px] md:min-h-[540px] bg-[#111412] overflow-hidden flex flex-col justify-end">
            <img
              src={honSawyerrImg}
              alt="Hon. Queenstar Maame Pokua Sawyerr addressing Parliament"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(10,16,13,0.08) 0%, rgba(10,16,13,0.42) 55%, rgba(10,16,13,0.92) 100%)',
              }}
            />

            <div className="relative z-10 p-6 sm:p-7 space-y-2.5 text-white">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/12 border border-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.12em] text-[#F3E5C2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009E52]" />
                <span>Agona East Constituency</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug text-white">
                Hon. Queenstar Maame Pokua Sawyerr
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Member of Parliament &bull; Parliament of Ghana
              </p>
              <div className="pt-2 border-t border-white/15 font-serif italic text-xs text-[#F3E5C2]">
                &ldquo;Dedicated to People. Committed to Progress.&rdquo;
              </div>
            </div>
          </div>

          {/* Right Secretariat Sign-In Form */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="px-7 sm:px-9 pt-8 pb-6 border-b border-[rgba(17,20,18,0.085)] bg-[#FAF9F6]/60">
              <div className="flex items-center gap-3.5">
                <img
                  src={honSawyerrImg}
                  alt="Hon. Queenstar Sawyerr"
                  className="w-12 h-12 rounded-full object-cover object-top shrink-0 border-2 border-[#007A43]"
                />
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#007A43]">
                    Office of Hon. Queenstar Sawyerr
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-[#111412] leading-tight mt-0.5">
                    Content Secretariat
                  </h1>
                </div>
              </div>
              <p className="text-xs text-[#636C67] mt-3 leading-relaxed">
                Official Editorial CMS &amp; Constituency Portal. Sign in with your authorized
                Secretariat &amp; Communications credentials.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="px-7 sm:px-9 py-7 space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#D61F33]/6 border border-[#D61F33]/25 text-xs text-[#AD1425] leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {infoMsg && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#007A43]/8 border border-[#007A43]/25 text-xs text-[#005A30] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="staff-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#2A312D] mb-1.5"
                >
                  Secretariat Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#636C67] absolute left-3.5 pointer-events-none" />
                  <input
                    id="staff-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="communications@honpokuasawyerr.org"
                    className="editorial-input pl-10"
                  />
                </div>
              </div>

              {!resetMode && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="staff-password"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#2A312D]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetMode(true);
                        setErrorMsg(null);
                        setInfoMsg(null);
                      }}
                      className="text-[11px] font-semibold text-[#007A43] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#636C67] absolute left-3.5 pointer-events-none" />
                    <input
                      id="staff-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="editorial-input pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-[#636C67] hover:text-[#111412] p-0.5 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-editorial-primary w-full py-2.5 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {submitting
                    ? resetMode
                      ? 'Sending Reset Link…'
                      : 'Verifying Credentials…'
                    : resetMode
                      ? 'Send Password Reset Link'
                      : 'Sign In to Secretariat'}
                </span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>

              {resetMode && (
                <button
                  type="button"
                  onClick={() => {
                    setResetMode(false);
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className="w-full text-center text-xs font-semibold text-[#636C67] hover:text-[#111412] pt-1 cursor-pointer"
                >
                  ← Back to Secretariat Sign In
                </button>
              )}

              {!isSupabaseConfigured && (
                <div className="pt-4 mt-4 border-t border-[rgba(17,20,18,0.085)] space-y-3">
                  <div className="p-3 rounded-xl bg-[#F3E5C2]/40 border border-[#C9963B]/30 text-xs text-[#6B4B12] leading-relaxed">
                    <strong>Preview mode available:</strong> Add your environment variables in{' '}
                    <code className="font-mono bg-white/80 px-1 py-0.5 rounded">.env</code> to sign
                    in with live Secretariat credentials.
                  </div>

                  <button
                    type="button"
                    onClick={handleEnterPreview}
                    className="btn-editorial-secondary w-full py-2.5 text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#007A43]" />
                    <span>Enter Local Secretariat Preview (Seeded Data)</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 text-center text-[11px] text-[#636C67] border-t border-[rgba(17,20,18,0.085)]">
        Agona East Constituency Secretariat &bull; Parliament of Ghana
      </footer>
    </div>
  );
};
