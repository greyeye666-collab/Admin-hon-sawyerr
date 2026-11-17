import React from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import type { AdminRoute } from '../../types/database';

interface AdminHeaderProps {
  activeRoute: AdminRoute;
  isLiveMode: boolean;
  loading: boolean;
  onRefresh: () => void;
  onOpenMobileMenu: () => void;
}

const ROUTE_META: Record<AdminRoute, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Editorial Overview',
    subtitle: 'Office of Hon. Queenstar Maame Pokua Sawyerr — Content Secretariat',
  },
  hero: {
    title: 'Hero Carousel Manager',
    subtitle: 'Manage landing page masthead slides, badges, and paired portrait layouts',
  },
  'about-profile': {
    title: 'About, Profile & Stats',
    subtitle: 'Official MP details, constituency towns, attestation bar, core values & timeline',
  },
  projects: {
    title: 'Impact & Projects Dossier',
    subtitle: 'Manage constituency initiatives, flagship spotlight, galleries & testimonials',
  },
  news: {
    title: 'Press Room & Gazette Wire',
    subtitle: 'Authoritative statements, parliamentary updates & Lead Dispatch selection',
  },
  blog: {
    title: "The MP's Notebook — Editorial Studio",
    subtitle: 'Compose long-form essays with pull-quotes, drop-caps & reading measure preview',
  },
  gallery: {
    title: 'Photographic Archive',
    subtitle: 'Curate numbered archival plates stored in the shared media/gallery/ bucket',
  },
  inquiries: {
    title: 'Constituent Secretariat & Subscribers',
    subtitle: 'Triage constituent requests by town & category and export newsletter dispatches',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeRoute,
  isLiveMode,
  loading,
  onRefresh,
  onOpenMobileMenu,
}) => {
  const meta = ROUTE_META[activeRoute];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[rgba(17,20,18,0.085)] px-5 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg border border-[rgba(17,20,18,0.12)] text-[#111412] cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-[#111412] truncate">
              {meta.title}
            </h1>
            <p className="text-xs text-[#636C67] truncate hidden sm:block">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {!isLiveMode && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-[#F3E5C2]/55 border-[#C9963B]/35 text-[#8F651C]">
              <span>Local Preview Mode</span>
            </div>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="btn-editorial-secondary text-xs px-3 py-1.5"
            title="Sync latest records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};
