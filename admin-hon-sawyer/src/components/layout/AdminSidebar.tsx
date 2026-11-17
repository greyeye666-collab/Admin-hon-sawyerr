import React from 'react';
import {
  BookOpenText,
  Briefcase,
  Camera,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  SlidersHorizontal,
  UserCheck,
  X,
} from 'lucide-react';
import honSawyerrImg from '../../assets/hon-sawyerr-podium.jpg';
import type { AdminRoute } from '../../types/database';

interface AdminSidebarProps {
  activeRoute: AdminRoute;
  onNavigate: (route: AdminRoute) => void;
  unreadInquiriesCount: number;
  draftBlogCount: number;
  officer: { email: string; fullName: string; role: string; isLive: boolean };
  onSignOut: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AdminRoute;
  label: string;
  sectionHint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    sectionHint: 'Secretariat Desk',
    icon: LayoutDashboard,
  },
  {
    id: 'hero',
    label: 'Hero Carousel',
    sectionHint: 'Landing Masthead',
    icon: SlidersHorizontal,
  },
  {
    id: 'about-profile',
    label: 'About, Profile & Stats',
    sectionHint: 'MP Details & Bio',
    icon: UserCheck,
  },
  {
    id: 'projects',
    label: 'Impact & Projects',
    sectionHint: 'Constituency Dossier',
    icon: Briefcase,
  },
  {
    id: 'news',
    label: 'Press Room & Wire',
    sectionHint: 'Gazette Dispatches',
    icon: Newspaper,
  },
  {
    id: 'blog',
    label: "The MP's Notebook",
    sectionHint: 'Editorial Essays',
    icon: BookOpenText,
  },
  {
    id: 'gallery',
    label: 'Photographic Archive',
    sectionHint: 'Media Plates',
    icon: Camera,
  },
  {
    id: 'inquiries',
    label: 'Constituent Secretariat',
    sectionHint: 'Inbox & Subscribers',
    icon: Inbox,
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeRoute,
  onNavigate,
  unreadInquiriesCount,
  draftBlogCount,
  officer,
  onSignOut,
  mobileOpen,
  onCloseMobile,
}) => {
  const sidebarBody = (
    <div className="flex flex-col h-full bg-white border-r border-[rgba(17,20,18,0.085)] w-[272px]">
      <div className="ndc-ribbon shrink-0">
        <span />
        <span />
        <span />
      </div>

      {/* Institutional Crest */}
      <div className="px-5 py-4 border-b border-[rgba(17,20,18,0.085)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={honSawyerrImg}
            alt="Hon. Queenstar Maame Pokua Sawyerr"
            className="w-11 h-11 rounded-full object-cover object-top shrink-0 border-2 border-[#007A43]"
          />
          <div className="min-w-0">
            <div className="font-serif font-bold text-sm text-[#111412] truncate">
              Hon. Queenstar Sawyerr
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#007A43]">
              Agona East Secretariat
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-[#636C67] hover:text-[#111412] cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Public-Site Mirrored Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="CMS Navigation">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#636C67]">
          Public Site Architecture
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeRoute === item.id;
          const badge =
            item.id === 'inquiries' && unreadInquiriesCount > 0
              ? { count: unreadInquiriesCount, tone: 'red' as const }
              : item.id === 'blog' && draftBlogCount > 0
                ? { count: draftBlogCount, tone: 'gold' as const }
                : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                active
                  ? 'bg-[#007A43] text-white'
                  : 'text-[#2A312D] hover:bg-[#F3F5F3] hover:text-[#111412]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#007A43]'}`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold leading-tight truncate">
                  {item.label}
                </div>
                <div
                  className={`text-[11px] truncate mt-0.5 ${
                    active ? 'text-white/75' : 'text-[#636C67]'
                  }`}
                >
                  {item.sectionHint}
                </div>
              </div>
              {badge && (
                <span
                  className={`text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full shrink-0 ${
                    active
                      ? 'bg-white/20 text-white'
                      : badge.tone === 'red'
                        ? 'bg-[#D61F33]/12 text-[#D61F33]'
                        : 'bg-[#F3E5C2] text-[#8F651C]'
                  }`}
                >
                  {badge.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Officer Footer */}
      <div className="p-4 border-t border-[rgba(17,20,18,0.085)] bg-[#FAF9F6] space-y-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-[#111412] truncate">{officer.fullName}</div>
          <div className="text-[11px] text-[#636C67] truncate">{officer.email}</div>
          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
            {officer.role}
          </span>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[rgba(17,20,18,0.12)] bg-white text-xs font-semibold text-[#2A312D] hover:text-[#D61F33] hover:border-[#D61F33]/35 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">{sidebarBody}</div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden flex bg-[#111412]/40">
          <div className="h-full">{sidebarBody}</div>
          <div className="flex-1" onClick={onCloseMobile} aria-hidden="true" />
        </div>
      )}
    </>
  );
};
