import React, { useMemo, useState } from 'react';
import {
  BookOpenText,
  Briefcase,
  Camera,
  ChevronsUpDown,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Search,
  ShieldCheck,
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
  category: 'OVERVIEW' | 'EDITORIAL & DISPATCHES' | 'CONSTITUENCY & DOSSIER';
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    sectionHint: 'Secretariat Desk & Analytics',
    category: 'OVERVIEW',
    icon: LayoutDashboard,
  },
  {
    id: 'hero',
    label: 'Hero Carousel',
    sectionHint: 'Landing Masthead Slides',
    category: 'OVERVIEW',
    icon: SlidersHorizontal,
  },
  {
    id: 'news',
    label: 'Press Room & Wire',
    sectionHint: 'Official Gazette Dispatches',
    category: 'EDITORIAL & DISPATCHES',
    icon: Newspaper,
  },
  {
    id: 'blog',
    label: "The MP's Notebook",
    sectionHint: 'Editorial Essays Studio',
    category: 'EDITORIAL & DISPATCHES',
    icon: BookOpenText,
  },
  {
    id: 'gallery',
    label: 'Photographic Archive',
    sectionHint: 'Documentary Plates',
    category: 'EDITORIAL & DISPATCHES',
    icon: Camera,
  },
  {
    id: 'projects',
    label: 'Impact & Projects',
    sectionHint: 'Constituency Initiatives',
    category: 'CONSTITUENCY & DOSSIER',
    icon: Briefcase,
  },
  {
    id: 'about-profile',
    label: 'About & Profile',
    sectionHint: 'Parliamentary Bio & Towns',
    category: 'CONSTITUENCY & DOSSIER',
    icon: UserCheck,
  },
  {
    id: 'inquiries',
    label: 'Constituent Secretariat',
    sectionHint: 'Inbox & Subscribers',
    category: 'CONSTITUENCY & DOSSIER',
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
  const [filterQuery, setFilterQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Group items by category with live filtering (matching reference image "Filter modules...")
  const filteredNavItems = useMemo(() => {
    if (!filterQuery.trim()) return NAV_ITEMS;
    const clean = filterQuery.trim().toLowerCase();
    return NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(clean) ||
        item.sectionHint.toLowerCase().includes(clean) ||
        item.category.toLowerCase().includes(clean)
    );
  }, [filterQuery]);

  const categories = ['OVERVIEW', 'EDITORIAL & DISPATCHES', 'CONSTITUENCY & DOSSIER'] as const;

  const sidebarBody = (
    <div className="flex flex-col h-full bg-[#FAF9F6]/80 lg:bg-[#FAF9F6] border-r border-stone-200/80 w-[276px] select-none">
      {/* Top Institutional Tricolor Hairline */}
      <div className="ndc-ribbon shrink-0">
        <span />
        <span />
        <span />
      </div>

      {/* Brand Header (matching reference image: Logo Badge + Title + Subtitle + Collapse button) */}
      <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={honSawyerrImg}
              alt="Hon. Queenstar Maame Pokua Sawyerr"
              className="w-10 h-10 rounded-xl object-cover object-top border border-[#007A43]/30 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#007A43] ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <div className="font-serif font-bold text-sm text-stone-900 truncate leading-snug">
              Hon. Sawyerr
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#007A43] truncate">
              Content Secretariat
            </div>
          </div>
        </div>

        {/* Mobile close toggle */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Module Filter Input (matching reference image "Filter modules...") */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter modules..."
            className="w-full bg-stone-100/70 hover:bg-white focus:bg-white text-stone-800 placeholder-stone-400 text-xs rounded-xl pl-8 pr-7 py-2 border border-transparent focus:border-[#007A43]/30 focus:outline-none transition-all shadow-2xs"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Grouped Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4" aria-label="Portal Navigation">
        {categories.map((cat) => {
          const catItems = filteredNavItems.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-3 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                <span>{cat}</span>
              </div>

              <div className="space-y-0.5">
                {catItems.map((item) => {
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
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                        active
                          ? 'bg-white text-stone-900 font-semibold shadow-xs border border-stone-200/80'
                          : 'text-stone-600 hover:bg-stone-100/70 hover:text-stone-900'
                      }`}
                    >
                      {/* Active Left Vertical Accent Bar (matching reference image) */}
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.25 h-6 bg-[#007A43] rounded-r-full"
                          aria-hidden="true"
                        />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active
                            ? 'text-[#007A43]'
                            : 'text-stone-400 group-hover:text-stone-700'
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] leading-tight truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate mt-0.5">
                          {item.sectionHint}
                        </div>
                      </div>

                      {badge && (
                        <span
                          className={`text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full shrink-0 ${
                            badge.tone === 'red'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                              : 'bg-amber-50 text-amber-800 border border-amber-200/50'
                          }`}
                        >
                          {badge.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom User Profile Card (matching reference image "Joe / Project admin") */}
      <div className="p-3 border-t border-stone-200/80 bg-white/60 relative">
        <button
          type="button"
          onClick={() => setProfileDropdownOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-white border border-stone-200/80 hover:bg-stone-50 transition-colors text-left cursor-pointer shadow-2xs group"
        >
          {/* Circular avatar with officer initial */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#007A43] to-[#005A30] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            {officer.fullName ? officer.fullName.charAt(0).toUpperCase() : 'A'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-stone-900 truncate">
              {officer.fullName || 'Secretariat Staff'}
            </div>
            <div className="text-[11px] text-stone-400 truncate capitalize">
              {officer.role === 'admin' ? 'Project admin' : officer.role}
            </div>
          </div>

          <ChevronsUpDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 shrink-0" />
        </button>

        {/* Profile Popover Menu */}
        {profileDropdownOpen && (
          <div
            className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl border border-stone-200 shadow-xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2.5 py-1.5 border-b border-stone-100">
              <div className="text-xs font-bold text-stone-900 truncate">
                {officer.fullName}
              </div>
              <div className="text-[11px] text-stone-400 truncate">{officer.email}</div>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-600 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>{officer.isLive ? 'Authorized Staff Session' : 'Local Preview Mode'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Secretariat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">{sidebarBody}</aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex bg-black/40 backdrop-blur-xs">
          <div className="h-full">{sidebarBody}</div>
          <div className="flex-1" onClick={onCloseMobile} aria-hidden="true" />
        </div>
      )}
    </>
  );
};
