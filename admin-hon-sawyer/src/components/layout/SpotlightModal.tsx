import React, { useMemo, useRef, useState } from 'react';
import {
  BookOpenText,
  Briefcase,
  Camera,
  CornerDownLeft,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserCheck,
  X,
} from 'lucide-react';
import { useCms } from '../../lib/cmsContext';
import type { AdminRoute } from '../../types/database';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: AdminRoute, intent?: 'new') => void;
  onRefresh: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Modules' | 'Actions' | 'Projects' | 'Notebook' | 'Press Room' | 'Inquiries';
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  badge?: string;
}

const SpotlightDialog: React.FC<{
  onClose: () => void;
  onNavigate: (route: AdminRoute, intent?: 'new') => void;
  onRefresh: () => void;
}> = ({ onClose, onNavigate, onRefresh }) => {
  const { data } = useCms();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<SearchItem[]>(() => {
    const list: SearchItem[] = [
      // Navigation Modules
      {
        id: 'nav-dashboard',
        title: 'Dashboard Overview',
        subtitle: 'Main Secretariat desk, live metrics, and editorial pulse',
        category: 'Modules',
        icon: LayoutDashboard,
        onSelect: () => onNavigate('dashboard'),
      },
      {
        id: 'nav-projects',
        title: 'Impact & Projects Dossier',
        subtitle: 'Manage constituency initiatives, schools, healthcare & water projects',
        category: 'Modules',
        icon: Briefcase,
        onSelect: () => onNavigate('projects'),
        badge: `${data.projects.length} entries`,
      },
      {
        id: 'nav-news',
        title: 'Press Room & Wire',
        subtitle: 'Official Gazette dispatches and public press statements',
        category: 'Modules',
        icon: Newspaper,
        onSelect: () => onNavigate('news'),
        badge: `${data.newsArticles.length} dispatches`,
      },
      {
        id: 'nav-blog',
        title: "The MP's Notebook",
        subtitle: 'Editorial essays, reflection studio, and reading measures',
        category: 'Modules',
        icon: BookOpenText,
        onSelect: () => onNavigate('blog'),
        badge: `${data.blogPosts.length} essays`,
      },
      {
        id: 'nav-gallery',
        title: 'Photographic Archive',
        subtitle: 'Curate high-resolution documentary and ceremonial plates',
        category: 'Modules',
        icon: Camera,
        onSelect: () => onNavigate('gallery'),
        badge: `${data.galleryItems.length} plates`,
      },
      {
        id: 'nav-inquiries',
        title: 'Constituent Secretariat & Inquiries',
        subtitle: 'Triage constituent messages, petitions & newsletter subscribers',
        category: 'Modules',
        icon: Inbox,
        onSelect: () => onNavigate('inquiries'),
        badge: `${data.contactInquiries.length} cases`,
      },
      {
        id: 'nav-about',
        title: 'About, Profile & Governance Stats',
        subtitle: 'Parliamentary biography, timeline, towns, and core values',
        category: 'Modules',
        icon: UserCheck,
        onSelect: () => onNavigate('about-profile'),
      },
      {
        id: 'nav-hero',
        title: 'Hero Carousel & Landing Masthead',
        subtitle: 'Manage homepage masthead slides, CTA badges & portraits',
        category: 'Modules',
        icon: SlidersHorizontal,
        onSelect: () => onNavigate('hero'),
        badge: `${data.heroSlides.length} slides`,
      },

      // Quick Actions
      {
        id: 'action-add-project',
        title: 'Add Constituency Project',
        subtitle: 'Document a new milestone in Agona East',
        category: 'Actions',
        icon: Plus,
        onSelect: () => onNavigate('projects', 'new'),
      },
      {
        id: 'action-write-blog',
        title: 'Write New Blog Essay',
        subtitle: "Draft a new long-form reflection for The MP's Notebook",
        category: 'Actions',
        icon: BookOpenText,
        onSelect: () => onNavigate('blog', 'new'),
      },
      {
        id: 'action-add-news',
        title: 'Issue Press Release',
        subtitle: 'Draft and publish an official Gazette dispatch',
        category: 'Actions',
        icon: Newspaper,
        onSelect: () => onNavigate('news', 'new'),
      },
      {
        id: 'action-sync',
        title: 'Refresh Portal Records',
        subtitle: 'Fetch the latest published updates and constituent inquiries',
        category: 'Actions',
        icon: RefreshCw,
        onSelect: () => onRefresh(),
      },
    ];

    // Search Projects
    data.projects.forEach((p) => {
      list.push({
        id: `project-${p.id}`,
        title: p.title,
        subtitle: `${p.category} • ${p.location} • ${p.impact_metric}`,
        category: 'Projects',
        icon: Briefcase,
        onSelect: () => onNavigate('projects'),
        badge: p.is_flagship ? 'Flagship' : p.completion_year,
      });
    });

    // Search News
    data.newsArticles.forEach((n) => {
      list.push({
        id: `news-${n.id}`,
        title: n.title,
        subtitle: `${n.category} • ${n.published_date} • ${n.read_time}`,
        category: 'Press Room',
        icon: Newspaper,
        onSelect: () => onNavigate('news'),
        badge: n.featured ? 'Lead Dispatch' : undefined,
      });
    });

    // Search Blog
    data.blogPosts.forEach((b) => {
      list.push({
        id: `blog-${b.id}`,
        title: b.title,
        subtitle: `${b.category} • ${b.publish_date} • ${b.read_time}`,
        category: 'Notebook',
        icon: BookOpenText,
        onSelect: () => onNavigate('blog'),
        badge: b.status,
      });
    });

    // Search Inquiries
    data.contactInquiries.forEach((i) => {
      list.push({
        id: `inquiry-${i.id}`,
        title: i.reference_number,
        subtitle: `From ${i.full_name} • ${i.town} • ${i.category}`,
        category: 'Inquiries',
        icon: Inbox,
        onSelect: () => onNavigate('inquiries'),
        badge: i.status === 'new' ? 'Unread' : 'Read',
      });
    });

    return list;
  }, [data, onNavigate, onRefresh]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return items.filter((it) => it.category === 'Modules' || it.category === 'Actions');
    }
    const clean = query.trim().toLowerCase();
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(clean) ||
        it.subtitle.toLowerCase().includes(clean) ||
        it.category.toLowerCase().includes(clean)
    );
  }, [items, query]);

  const safeIndex = selectedIndex < filteredItems.length ? selectedIndex : 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(filteredItems.length - 1, 0) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[safeIndex];
      if (target) {
        target.onSelect();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/45 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-stone-200 flex items-center px-4 py-3.5 gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search modules, projects, dispatches, essays, inquiries..."
            className="flex-1 bg-transparent border-none text-stone-900 text-sm sm:text-base placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-500 border border-stone-200">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-stone-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              No matching modules, dispatches, or records found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === safeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.onSelect();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#007A43]/8 text-stone-900'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#007A43] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-stone-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-200/70 text-stone-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-stone-400">
                      <span className="hidden sm:inline capitalize">{item.category}</span>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#007A43]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-semibold text-stone-600">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="font-semibold text-stone-600">↵</kbd> Select
            </span>
            <span>
              <kbd className="font-semibold text-stone-600">Esc</kbd> Close
            </span>
          </div>
          <span className="text-[#007A43] font-semibold">Hon. Queenstar Sawyerr Secretariat</span>
        </div>
      </div>
    </div>
  );
};

export const SpotlightModal: React.FC<SpotlightModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <SpotlightDialog
      key="spotlight-active"
      onClose={onClose}
      onNavigate={onNavigate}
      onRefresh={onRefresh}
    />
  );
};
