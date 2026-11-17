import React from 'react';
import {
  ArrowRight,
  BookOpenText,
  Briefcase,
  FilePlus2,
  Inbox,
  MailCheck,
  Newspaper,
  Plus,
  Sparkles,
} from 'lucide-react';
import honSawyerrImg from '../assets/hon-sawyerr-podium.jpg';
import { useCms } from '../lib/cmsContext';
import { formatTimestampShort } from '../lib/utils';
import type { AdminRoute } from '../types/database';

interface DashboardPageProps {
  onNavigate: (route: AdminRoute, intent?: 'new') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { data } = useCms();

  const publishedBlogs = data.blogPosts.filter((b) => b.status === 'published');
  const draftBlogs = data.blogPosts.filter((b) => b.status === 'draft');
  const activeProjects = data.projects.filter((p) => p.is_published);
  const publishedNews = data.newsArticles.filter((n) => n.is_published);
  const unreadInquiries = data.contactInquiries.filter((i) => i.status === 'new');
  const flagshipProject = data.projects.find((p) => p.is_flagship) ?? data.projects[0];
  const leadDispatch = data.newsArticles.find((n) => n.featured) ?? data.newsArticles[0];
  const coverStory = data.blogPosts.find((b) => b.featured) ?? data.blogPosts[0];

  const metrics = [
    {
      label: 'Published Blog Essays',
      value: publishedBlogs.length,
      subtext: `${draftBlogs.length} draft${draftBlogs.length === 1 ? '' : 's'} in studio`,
      icon: BookOpenText,
      accent: 'text-[#007A43] bg-[#007A43]/10',
      route: 'blog' as AdminRoute,
    },
    {
      label: 'Active Projects',
      value: activeProjects.length,
      subtext: `${data.projects.length} total dossier entries`,
      icon: Briefcase,
      accent: 'text-[#007A43] bg-[#007A43]/10',
      route: 'projects' as AdminRoute,
    },
    {
      label: 'Press Dispatches',
      value: publishedNews.length,
      subtext: 'Official Gazette & wire',
      icon: Newspaper,
      accent: 'text-[#8F651C] bg-[#F3E5C2]',
      route: 'news' as AdminRoute,
    },
    {
      label: 'Unread Inquiries',
      value: unreadInquiries.length,
      subtext: `${data.contactInquiries.length} total constituent cases`,
      icon: Inbox,
      accent: unreadInquiries.length > 0 ? 'text-[#D61F33] bg-[#D61F33]/10' : 'text-[#007A43] bg-[#007A43]/10',
      route: 'inquiries' as AdminRoute,
    },
    {
      label: 'Newsletter Subscribers',
      value: data.newsletterSubscribers.length,
      subtext: 'Blog & Footer dispatch list',
      icon: MailCheck,
      accent: 'text-[#007A43] bg-[#007A43]/10',
      route: 'inquiries' as AdminRoute,
    },
  ];

  const quickActions = [
    {
      label: 'Write New Blog Essay',
      description: "Compose an essay for The MP's Notebook",
      route: 'blog' as AdminRoute,
      intent: 'new' as const,
      icon: BookOpenText,
    },
    {
      label: 'Publish Press Release',
      description: 'Issue an official statement or Gazette wire',
      route: 'news' as AdminRoute,
      intent: 'new' as const,
      icon: Newspaper,
    },
    {
      label: 'Add Constituency Project',
      description: 'Document an Agona East impact milestone',
      route: 'projects' as AdminRoute,
      intent: 'new' as const,
      icon: FilePlus2,
    },
    {
      label: 'Review New Inquiries',
      description: `${unreadInquiries.length} awaiting Secretariat triage`,
      route: 'inquiries' as AdminRoute,
      intent: undefined,
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-7">
      {/* Editorial Welcome Masthead */}
      <section className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 max-w-2xl">
            <img
              src={honSawyerrImg}
              alt={data.mpProfile.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top shrink-0 border-2 border-[#007A43]"
            />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#007A43]">
                <span className="w-2 h-2 rounded-full bg-[#007A43]" />
                <span>Office of Hon. Queenstar Sawyerr — Content Secretariat</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111412] leading-tight">
                {data.mpProfile.full_name}
              </h2>
              <p className="text-sm text-[#636C67] leading-relaxed">
                {data.mpProfile.role} &bull; {data.mpProfile.party}. All updates published here sync
                directly with the shared database powering the public website.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('blog', 'new')}
              className="btn-editorial-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Write Essay</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('news', 'new')}
              className="btn-editorial-secondary"
            >
              <Plus className="w-4 h-4" />
              <span>New Press Release</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Metrics Strip */}
      <section aria-label="Live Secretariat Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => onNavigate(m.route)}
              className="text-left bg-white border border-[rgba(17,20,18,0.085)] hover:border-[#007A43]/35 rounded-2xl p-5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#636C67]">{m.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${m.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#111412] tabular-nums mt-3">
                {m.value}
              </div>
              <div className="text-xs text-[#636C67] mt-1 flex items-center justify-between">
                <span>{m.subtext}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#007A43] transition-opacity" />
              </div>
            </button>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-[#111412]">Secretariat Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.label}
                type="button"
                onClick={() => onNavigate(qa.route, qa.intent)}
                className="text-left bg-white border border-[rgba(17,20,18,0.085)] hover:border-[#007A43] rounded-2xl p-4 transition-colors cursor-pointer flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F3F5F3] group-hover:bg-[#007A43] text-[#007A43] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#111412]">{qa.label}</div>
                  <div className="text-xs text-[#636C67] mt-0.5 leading-relaxed">
                    {qa.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Homepage Editorial Spotlights & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Homepage Spotlights */}
        <section className="lg:col-span-5 bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#111412]">
              Active Public Spotlights
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
              <Sparkles className="w-3 h-3" />
              <span>Live Placement</span>
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#007A43]">
                Flagship Initiative (Impact Section)
              </div>
              <div className="text-sm font-semibold text-[#111412] mt-1 line-clamp-2">
                {flagshipProject?.title ?? 'No flagship selected'}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-[#636C67]">
                <span>{flagshipProject?.impact_metric}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="text-[#007A43] font-semibold hover:underline cursor-pointer"
                >
                  Change →
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#007A43]">
                Lead Dispatch (News Wire)
              </div>
              <div className="text-sm font-semibold text-[#111412] mt-1 line-clamp-2">
                {leadDispatch?.title ?? 'No lead dispatch selected'}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-[#636C67]">
                <span>{leadDispatch?.published_date}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('news')}
                  className="text-[#007A43] font-semibold hover:underline cursor-pointer"
                >
                  Manage →
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#007A43]">
                Cover Story (MP&apos;s Notebook)
              </div>
              <div className="text-sm font-semibold text-[#111412] mt-1 line-clamp-2">
                {coverStory?.title ?? 'No cover story selected'}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-[#636C67]">
                <span>{coverStory?.publish_date}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="text-[#007A43] font-semibold hover:underline cursor-pointer"
                >
                  Edit →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Recent Inquiries & Blog Drafts */}
        <section className="lg:col-span-7 bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#111412]">
              Recent Constituent Inquiries &amp; Drafts
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('inquiries')}
              className="text-xs font-semibold text-[#007A43] hover:underline cursor-pointer"
            >
              Open Inbox →
            </button>
          </div>

          <div className="divide-y divide-[rgba(17,20,18,0.085)]">
            {data.contactInquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="py-3 first:pt-0 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#111412]">
                      {inq.reference_number}
                    </span>
                    <span className="text-sm font-semibold text-[#111412]">{inq.full_name}</span>
                    <span className="text-xs text-[#636C67]">&bull; {inq.town}</span>
                  </div>
                  <p className="text-xs text-[#636C67] mt-1 line-clamp-1">{inq.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      inq.status === 'new'
                        ? 'bg-[#D61F33]/10 text-[#D61F33]'
                        : inq.status === 'in_review'
                          ? 'bg-[#F3E5C2] text-[#8F651C]'
                          : 'bg-[#007A43]/10 text-[#007A43]'
                    }`}
                  >
                    {inq.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-[#636C67]">
                    {formatTimestampShort(inq.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {draftBlogs.length > 0 && (
            <div className="pt-4 border-t border-[rgba(17,20,18,0.085)]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8F651C] mb-2">
                Unpublished Notebook Drafts ({draftBlogs.length})
              </div>
              <div className="space-y-2">
                {draftBlogs.map((draft) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F3E5C2]/25 border border-[#C9963B]/25"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#111412] truncate">
                        {draft.title}
                      </div>
                      <div className="text-xs text-[#636C67]">
                        {draft.category} &bull; {draft.read_time}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('blog')}
                      className="btn-editorial-secondary text-xs py-1 px-3 shrink-0"
                    >
                      Resume
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
