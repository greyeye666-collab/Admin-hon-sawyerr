import React, { useEffect, useState } from 'react';
import {
  Bell,
  ChevronRight,
  Menu,
  RefreshCw,
  Search,
  Settings,
} from 'lucide-react';
import { useCms } from '../../lib/cmsContext';
import type { AdminRoute } from '../../types/database';
import { NotificationsModal } from './NotificationsModal';
import { SettingsModal } from './SettingsModal';
import { SpotlightModal } from './SpotlightModal';

interface AdminHeaderProps {
  activeRoute: AdminRoute;
  isLiveMode: boolean;
  loading: boolean;
  onRefresh: () => void;
  onOpenMobileMenu: () => void;
  onNavigate: (route: AdminRoute, intent?: 'new') => void;
  officer: { email: string; fullName: string; role: string; isLive: boolean };
  onSignOut: () => void;
}

const ROUTE_LABELS: Record<AdminRoute, { breadcrumb: string; title: string }> = {
  dashboard: {
    breadcrumb: 'Dashboard Overview',
    title: 'Secretariat Overview',
  },
  hero: {
    breadcrumb: 'Hero Carousel',
    title: 'Hero Masthead Manager',
  },
  'about-profile': {
    breadcrumb: 'About & Profile',
    title: 'About, Profile & Governance Stats',
  },
  projects: {
    breadcrumb: 'Impact & Projects',
    title: 'Constituency Impact & Projects',
  },
  news: {
    breadcrumb: 'Press Room',
    title: 'Press Room & Gazette Wire',
  },
  blog: {
    breadcrumb: "The MP's Notebook",
    title: "The MP's Notebook Editorial Studio",
  },
  gallery: {
    breadcrumb: 'Photographic Archive',
    title: 'Photographic Plates Archive',
  },
  inquiries: {
    breadcrumb: 'Constituent Secretariat',
    title: 'Constituent Inquiries & Newsletter',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeRoute,
  isLiveMode,
  loading,
  onRefresh,
  onOpenMobileMenu,
  onNavigate,
  officer,
  onSignOut,
}) => {
  const { data } = useCms();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMac] = useState(() =>
    typeof navigator !== 'undefined' ? /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent) : false
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Format today's date pill matching reference: "• Wed, Nov 18"
  const formattedToday = (() => {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const day = now.getDate();
    return `${weekday}, ${month} ${day}`;
  })();

  const unreadCount = data.contactInquiries.filter((i) => i.status === 'new').length;
  const current = ROUTE_LABELS[activeRoute];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Mobile Toggle & Breadcrumb Navigation */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb Trail (matches reference image: "Overview › Bulk SMS") */}
            <nav
              className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap min-w-0"
              aria-label="Breadcrumb"
            >
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="text-stone-500 hover:text-stone-900 transition-colors font-medium cursor-pointer"
              >
                Overview
              </button>
              {activeRoute !== 'dashboard' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-semibold text-stone-900 truncate">
                    {current.breadcrumb}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Center: Spotlight Search (matching reference image) */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              type="button"
              onClick={() => setSpotlightOpen(true)}
              className="w-full bg-stone-50/80 hover:bg-white text-stone-500 border border-stone-200/90 hover:border-[#007A43]/40 rounded-full px-3.5 py-1.5 flex items-center justify-between gap-3 text-xs transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0 truncate">
                <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#007A43] transition-colors shrink-0" />
                <span className="truncate text-stone-500 group-hover:text-stone-700">
                  Spotlight search modules, dispatches, projects...
                </span>
              </div>
              <kbd className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-stone-500 border border-stone-200/80 shadow-2xs">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
          </div>

          {/* Right: Live Date Pill, Sync, Settings, Notifications, Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {!isLiveMode && (
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Local Preview
              </span>
            )}

            {/* Live Date Pill (matching reference image: "• Wed, Nov 18") */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#007A43]/8 text-[#007A43] border border-[#007A43]/15">
              <span className="w-2 h-2 rounded-full bg-[#007A43] animate-pulse" />
              <span>{formattedToday}</span>
            </div>

            {/* Mobile search trigger */}
            <button
              type="button"
              onClick={() => setSpotlightOpen(true)}
              className="md:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
              title="Spotlight Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Sync Button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Sync latest database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline text-stone-700">Sync</span>
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
              title="Secretariat Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Notifications Trigger */}
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs"
              title="Secretariat Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D61F33] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Officer Avatar Pill */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007A43] to-[#005A30] text-white text-xs font-bold flex items-center justify-center ring-2 ring-stone-200/80 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
              title={`${officer.fullName || 'Admin'} (${officer.role})`}
              aria-label="User Profile"
            >
              {officer.fullName ? officer.fullName.charAt(0).toUpperCase() : 'A'}
            </button>
          </div>
        </div>
      </header>

      {/* Spotlight Command Palette Modal */}
      <SpotlightModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        onNavigate={onNavigate}
        onRefresh={onRefresh}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        officer={officer}
        onSignOut={onSignOut}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
