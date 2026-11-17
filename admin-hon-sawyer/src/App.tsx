import React, { useCallback, useEffect, useState } from 'react';
import { AdminHeader } from './components/layout/AdminHeader';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AuthScreen } from './components/layout/AuthScreen';
import { ToastProvider } from './components/ui/ToastProvider';
import { useCms } from './lib/cmsContext';
import { CmsProvider } from './lib/cmsStore';
import { supabase, verifySecretariatRole } from './lib/supabase';
import { AboutProfilePage } from './pages/AboutProfilePage';
import { BlogPage } from './pages/BlogPage';
import { DashboardPage } from './pages/DashboardPage';
import { GalleryPage } from './pages/GalleryPage';
import { HeroManagerPage } from './pages/HeroManagerPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { NewsPage } from './pages/NewsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import type { AdminRoute } from './types/database';

interface OfficerSession {
  email: string;
  fullName: string;
  role: string;
  isLive: boolean;
}

const ROUTE_PATHS: Record<AdminRoute, string> = {
  dashboard: '/',
  hero: '/hero',
  'about-profile': '/about-profile',
  projects: '/projects',
  news: '/news',
  blog: '/blog',
  gallery: '/gallery',
  inquiries: '/inquiries',
};

function pathToRoute(pathname: string): AdminRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const entry = (Object.entries(ROUTE_PATHS) as [AdminRoute, string][]).find(
    ([, path]) => path === clean
  );
  return entry ? entry[0] : 'dashboard';
}

const AdminWorkspace: React.FC<{
  officer: OfficerSession;
  onSignOut: () => void;
}> = ({ officer, onSignOut }) => {
  const { data, loading, isLiveMode, refreshAll } = useCms();

  const [activeRoute, setActiveRoute] = useState<AdminRoute>(() =>
    pathToRoute(window.location.pathname)
  );
  const [newIntentRoute, setNewIntentRoute] = useState<AdminRoute | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(pathToRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((route: AdminRoute, intent?: 'new') => {
    setActiveRoute(route);
    setNewIntentRoute(intent === 'new' ? route : null);
    const nextPath = ROUTE_PATHS[route];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const unreadInquiriesCount = data.contactInquiries.filter(
    (i) => i.status === 'new'
  ).length;
  const draftBlogCount = data.blogPosts.filter((b) => b.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <AdminSidebar
        activeRoute={activeRoute}
        onNavigate={(r) => navigate(r)}
        unreadInquiriesCount={unreadInquiriesCount}
        draftBlogCount={draftBlogCount}
        officer={officer}
        onSignOut={onSignOut}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminHeader
          activeRoute={activeRoute}
          isLiveMode={isLiveMode}
          loading={loading}
          onRefresh={() => void refreshAll()}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-5 lg:p-8 max-w-7xl w-full mx-auto">
          {activeRoute === 'dashboard' && <DashboardPage onNavigate={navigate} />}
          {activeRoute === 'hero' && <HeroManagerPage />}
          {activeRoute === 'about-profile' && <AboutProfilePage />}
          {activeRoute === 'projects' && (
            <ProjectsPage
              key={newIntentRoute === 'projects' ? 'projects-new' : 'projects'}
              openNewIntent={newIntentRoute === 'projects'}
            />
          )}
          {activeRoute === 'news' && (
            <NewsPage
              key={newIntentRoute === 'news' ? 'news-new' : 'news'}
              openNewIntent={newIntentRoute === 'news'}
            />
          )}
          {activeRoute === 'blog' && (
            <BlogPage
              key={newIntentRoute === 'blog' ? 'blog-new' : 'blog'}
              openNewIntent={newIntentRoute === 'blog'}
            />
          )}
          {activeRoute === 'gallery' && <GalleryPage />}
          {activeRoute === 'inquiries' && <InquiriesPage />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  const [officer, setOfficer] = useState<OfficerSession | null>(null);
  const [bootstrapping, setBootstrapping] = useState<boolean>(Boolean(supabase));
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    const hydrateSession = async () => {
      try {
        const { data } = await supabase!.auth.getSession();
        const user = data.session?.user;
        if (user && active) {
          const check = await verifySecretariatRole(user);
          if (check.authorized && active) {
            setOfficer({
              email: user.email || '',
              fullName: check.fullName,
              role: check.role,
              isLive: true,
            });
          } else {
            await supabase!.auth.signOut();
          }
        }
      } finally {
        if (active) setBootstrapping(false);
      }
    };

    void hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        return;
      }
      if (!session?.user) {
        setOfficer(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || newPassword.length < 8) {
      setRecoveryError('Please enter a password of at least 8 characters.');
      return;
    }
    setUpdatingPassword(true);
    setRecoveryError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setRecoveryError(error.message);
        return;
      }
      setRecoveryMode(false);
      setNewPassword('');
      if (data.user) {
        const check = await verifySecretariatRole(data.user);
        if (check.authorized) {
          setOfficer({
            email: data.user.email || '',
            fullName: check.fullName,
            role: check.role,
            isLive: true,
          });
        }
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase && officer?.isLive) {
      await supabase.auth.signOut();
    }
    setOfficer(null);
  };

  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#007A43] text-white font-serif font-bold flex items-center justify-center mx-auto border border-[#C9963B]">
            QP
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#636C67]">
            Verifying Secretariat Session…
          </p>
        </div>
      </div>
    );
  }

  if (recoveryMode) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <form
          onSubmit={handlePasswordUpdate}
          className="w-full max-w-md bg-white border border-[rgba(17,20,18,0.1)] rounded-2xl p-8 space-y-4"
        >
          <h1 className="font-serif text-2xl font-bold text-[#111412]">
            Set New Secretariat Password
          </h1>
          <p className="text-xs text-[#636C67]">
            Choose a strong password (minimum 8 characters) to complete account recovery.
          </p>
          {recoveryError && (
            <div className="p-3 rounded-xl bg-[#D61F33]/8 border border-[#D61F33]/25 text-xs text-[#AD1425]">
              {recoveryError}
            </div>
          )}
          <input
            type="password"
            minLength={8}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="editorial-input"
          />
          <button
            type="submit"
            disabled={updatingPassword}
            className="btn-editorial-primary w-full"
          >
            {updatingPassword ? 'Updating Password…' : 'Update Password & Enter Portal'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <ToastProvider>
      {officer ? (
        <CmsProvider isLiveMode={officer.isLive}>
          <AdminWorkspace officer={officer} onSignOut={handleSignOut} />
        </CmsProvider>
      ) : (
        <AuthScreen onAuthenticated={setOfficer} />
      )}
    </ToastProvider>
  );
}

export default App;
