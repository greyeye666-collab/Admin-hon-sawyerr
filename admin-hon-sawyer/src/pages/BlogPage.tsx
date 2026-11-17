import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { MediaUploader } from '../components/ui/MediaUploader';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { TagInput } from '../components/ui/TagInput';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import {
  countWords,
  estimateReadTime,
  formatTodayDisplay,
  generateUuid,
  slugify,
} from '../lib/utils';
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogPostRow,
  type BlogStatus,
  type MpProfileRow,
} from '../types/database';

type BlogDraft = Omit<BlogPostRow, 'created_at' | 'updated_at'> & {
  created_at?: string;
};

interface BlogPageProps {
  openNewIntent?: boolean;
}

function createEmptyBlogDraft(profile: MpProfileRow): BlogDraft {
  return {
    id: '',
    title: '',
    slug: '',
    category: 'Legislative Insights',
    publish_date: formatTodayDisplay(),
    read_time: '1 min read',
    cover_image: '',
    excerpt: '',
    content: [''],
    featured: false,
    author_name: profile.full_name || 'Hon. Queenstar Maame Pokua Sawyerr',
    author_role: profile.role || 'Member of Parliament, Agona East Constituency',
    author_avatar: profile.portrait_about_url || null,
    featured_quote: '',
    tags: ['Agona East'],
    status: 'draft',
  };
}

export const BlogPage: React.FC<BlogPageProps> = ({ openNewIntent }) => {
  const { data, upsertBlogPost, deleteBlogPost, setFeaturedBlogPost } = useCms();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | BlogCategory>('All');
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState<BlogDraft | null>(() =>
    openNewIntent ? createEmptyBlogDraft(data.mpProfile) : null
  );
  const [composerTab, setComposerTab] = useState<'compose' | 'preview'>('compose');
  const [slugTouched, setSlugTouched] = useState(false);
  const [manualReadTime, setManualReadTime] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BlogPostRow | null>(null);
  const [unpublishTarget, setUnpublishTarget] = useState<BlogPostRow | null>(null);

  const openNew = () => {
    setEditing(createEmptyBlogDraft(data.mpProfile));
    setComposerTab('compose');
    setSlugTouched(false);
    setManualReadTime(false);
    setDirty(false);
  };

  const openEdit = (post: BlogPostRow) => {
    setEditing({
      ...post,
      content: post.content.length > 0 ? [...post.content] : [''],
      tags: [...(post.tags ?? [])],
      featured_quote: post.featured_quote ?? '',
      author_avatar: post.author_avatar ?? data.mpProfile.portrait_about_url ?? null,
    });
    setComposerTab('compose');
    setSlugTouched(true);
    setManualReadTime(true);
    setDirty(false);
  };

  const updateField = <K extends keyof BlogDraft>(key: K, val: BlogDraft[K]) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: val };
      if (key === 'title' && !slugTouched) {
        next.slug = slugify(String(val));
      }
      if (key === 'content' && !manualReadTime) {
        next.read_time = estimateReadTime(val as string[]);
      }
      return next;
    });
    setDirty(true);
  };

  const filtered = data.blogPosts.filter((post) => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && post.category !== categoryFilter) return false;
    if (
      search.trim() &&
      !`${post.title} ${post.excerpt} ${post.tags.join(' ')}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSave = async (overrideStatus?: BlogStatus) => {
    if (!editing) return;
    if (!editing.title.trim()) {
      showToast('Essay Title required', {
        description: 'Please enter a headline for this Notebook essay.',
        tone: 'error',
      });
      return;
    }

    const finalStatus = overrideStatus ?? editing.status;
    setSaving(true);
    try {
      const cleanedParagraphs = editing.content.map((p) => p.trim()).filter(Boolean);
      const computedRead = estimateReadTime(cleanedParagraphs);

      await upsertBlogPost({
        ...editing,
        id: editing.id || generateUuid(),
        slug: editing.slug.trim() || slugify(editing.title),
        content: cleanedParagraphs,
        read_time: manualReadTime ? editing.read_time.trim() || computedRead : computedRead,
        featured_quote: editing.featured_quote?.trim() || null,
        status: finalStatus,
      });

      showToast(
        finalStatus === 'published' ? 'Notebook Essay Published' : 'Draft Saved to Notebook',
        {
          description: `"${editing.title}" (${finalStatus}).`,
        }
      );
      setEditing(null);
      setDirty(false);
    } catch (err) {
      showToast('Save failed', {
        description: err instanceof Error ? err.message : 'Unable to save essay.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const wordCount = editing ? countWords(editing.content) : 0;

  return (
    <div className="space-y-6">
      {/* Studio Header & Filters */}
      <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#111412]">
              The MP&apos;s Notebook — Editorial Studio ({data.blogPosts.length})
            </h2>
            <p className="text-xs text-[#636C67]">
              Long-form essays with live drop-cap &amp; pull-quote preview matching{' '}
              <code className="font-mono">BlogDetailPage</code>.
            </p>
          </div>
          <button type="button" onClick={openNew} className="btn-editorial-primary shrink-0">
            <Plus className="w-4 h-4" />
            <span>Write New Blog Essay</span>
          </button>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-[rgba(17,20,18,0.085)]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="inline-flex p-1 rounded-xl bg-[#F3F5F3] border border-[rgba(17,20,18,0.08)]">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#111412]'
                      : 'text-[#636C67] hover:text-[#111412]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              {(['All', ...BLOG_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#007A43] text-white'
                      : 'bg-[#F3F5F3] text-[#2A312D] hover:bg-[#E7EBE7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full xl:w-64">
            <Search className="w-3.5 h-3.5 text-[#636C67] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search essays or tags…"
              className="editorial-input pl-8 py-1.5 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Blog Essays List */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <article
            key={post.id}
            className={`bg-white border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-5 ${
              post.featured
                ? 'border-[#C9963B]'
                : 'border-[rgba(17,20,18,0.085)]'
            }`}
          >
            <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden bg-[#F3F5F3] shrink-0 border border-[rgba(17,20,18,0.085)]">
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#636C67]">
                  No Cover
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {post.featured && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Cover Story</span>
                  </span>
                )}
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    post.status === 'published'
                      ? 'bg-[#007A43]/10 text-[#007A43]'
                      : 'bg-[#F3E5C2]/70 text-[#8F651C]'
                  }`}
                >
                  {post.status}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F5F3] text-[#2A312D]">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#636C67]">
                  <Calendar className="w-3 h-3" />
                  <span>{post.publish_date}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#636C67]">
                  <Clock className="w-3 h-3" />
                  <span>{post.read_time}</span>
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#111412] leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-[#636C67] line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-[#636C67] flex-wrap">
                <span className="font-mono">/blog/{post.slug}</span>
                <span>&bull;</span>
                <span>{countWords(post.content)} words</span>
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {!post.featured && post.status === 'published' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await setFeaturedBlogPost(post.id);
                      showToast('Cover Story Updated', {
                        description: `"${post.title}" now leads /blog.`,
                      });
                    }}
                    className="btn-editorial-secondary text-xs py-1.5 px-3"
                  >
                    Set Cover Story
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="btn-editorial-secondary text-xs py-1.5 px-3"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Compose</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(post)}
                  className="p-2 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                  aria-label="Delete essay"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {post.status === 'published' ? (
                <button
                  type="button"
                  onClick={() => setUnpublishTarget(post)}
                  className="text-xs font-semibold text-[#636C67] hover:text-[#111412] cursor-pointer"
                >
                  Revert to Draft
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void upsertBlogPost({ ...post, status: 'published' }).then(() =>
                      showToast('Notebook Essay Published')
                    );
                  }}
                  className="text-xs font-semibold text-[#007A43] hover:underline cursor-pointer"
                >
                  Publish Now
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Editorial Essay Composer Drawer */}
      <SlideOverDrawer
        open={Boolean(editing)}
        title={editing?.id ? 'Editorial Essay Composer' : 'Compose New Notebook Essay'}
        subtitle={
          editing
            ? `${wordCount} words • ${estimateReadTime(editing.content)} estimated reading time`
            : undefined
        }
        dirty={dirty}
        widthClass="max-w-5xl"
        onClose={() => setEditing(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="btn-editorial-secondary"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="btn-editorial-secondary"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={saving}
                className="btn-editorial-primary"
              >
                {saving ? 'Publishing…' : 'Publish to Notebook'}
              </button>
            </div>
          </>
        }
      >
        {editing && (
          <div className="space-y-5">
            {/* Compose vs Drop-Cap Reading Measure Preview Toggle */}
            <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-[rgba(17,20,18,0.085)]">
              <div className="inline-flex gap-1">
                <button
                  type="button"
                  onClick={() => setComposerTab('compose')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    composerTab === 'compose'
                      ? 'bg-[#007A43] text-white'
                      : 'text-[#2A312D] hover:bg-[#F3F5F3]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Editorial Composer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setComposerTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    composerTab === 'preview'
                      ? 'bg-[#007A43] text-white'
                      : 'text-[#2A312D] hover:bg-[#F3F5F3]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Drop-Cap &amp; Reading Measure Preview</span>
                </button>
              </div>

              <span className="text-xs text-[#636C67] pr-3 tabular-nums hidden sm:inline">
                {wordCount} words &bull; {editing.read_time}
              </span>
            </div>

            {composerTab === 'compose' ? (
              <>
                {/* Title, Slug, Category, Dates */}
                <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                      Essay Title *
                    </label>
                    <input
                      type="text"
                      value={editing.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g. The Agona East Educational Renaissance..."
                      className="editorial-input font-serif text-lg font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={editing.slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          updateField('slug', slugify(e.target.value));
                        }}
                        className="editorial-input font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                        Notebook Category
                      </label>
                      <select
                        value={editing.category}
                        onChange={(e) => updateField('category', e.target.value as BlogCategory)}
                        className="editorial-input"
                      >
                        {BLOG_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                        Publish Date
                      </label>
                      <input
                        type="text"
                        value={editing.publish_date}
                        onChange={(e) => updateField('publish_date', e.target.value)}
                        className="editorial-input"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D]">
                          Read Time (~200 wpm)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setManualReadTime(false);
                            updateField('read_time', estimateReadTime(editing.content));
                          }}
                          className="text-[11px] font-semibold text-[#007A43] hover:underline cursor-pointer"
                        >
                          Reset Auto
                        </button>
                      </div>
                      <input
                        type="text"
                        value={editing.read_time}
                        onChange={(e) => {
                          setManualReadTime(true);
                          updateField('read_time', e.target.value);
                        }}
                        className="editorial-input"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                        Publication Status
                      </label>
                      <select
                        value={editing.status}
                        onChange={(e) => updateField('status', e.target.value as BlogStatus)}
                        className="editorial-input"
                      >
                        <option value="draft">Draft (Secretariat Only)</option>
                        <option value="published">Published (Live on /blog)</option>
                      </select>
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(e) => updateField('featured', e.target.checked)}
                      className="w-4 h-4 accent-[#C9963B]"
                    />
                    <span>Featured Magazine Cover Story on /blog</span>
                  </label>
                </div>

                {/* Cover Image & Excerpt */}
                <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
                  <MediaUploader
                    label="Essay Cover Photograph (media/blog/)"
                    value={editing.cover_image}
                    folder="blog"
                    onChange={(url) => updateField('cover_image', url)}
                  />
                  {editing.cover_image && (
                    <div className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)] flex items-center justify-between text-xs text-[#636C67]">
                      <span>Photo Archive: Office of the MP for Agona East</span>
                      <span className="font-semibold text-[#005A30]">{editing.category}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                      Editorial Deck / Excerpt
                    </label>
                    <textarea
                      rows={3}
                      value={editing.excerpt}
                      onChange={(e) => updateField('excerpt', e.target.value)}
                      placeholder="Opening editorial summary displayed beneath the title..."
                      className="editorial-input"
                    />
                  </div>
                </div>

                {/* Featured Pull Quote with Live NDC-Green Callout Preview */}
                <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block">
                    Featured Pull Quote (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={editing.featured_quote ?? ''}
                    onChange={(e) => updateField('featured_quote', e.target.value)}
                    placeholder="Key reflection highlighted in the NDC-green bordered pull-quote box..."
                    className="editorial-input font-serif italic"
                  />

                  {editing.featured_quote?.trim() && (
                    <div className="p-4 bg-[#FAF9F6] border-l-4 border-l-[#007A43] rounded-r-xl border border-[rgba(17,20,18,0.085)]">
                      <p className="font-serif italic text-base text-[#111412] leading-relaxed">
                        &ldquo;{editing.featured_quote}&rdquo;
                      </p>
                      <div className="text-xs font-bold text-[#005A30] mt-2">
                        — {editing.author_name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Paragraph-by-paragraph Essay Composer */}
                <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D]">
                        Essay Paragraphs ({editing.content.length})
                      </label>
                      <p className="text-[11px] text-[#636C67]">
                        Paragraph #1 automatically receives the editorial emerald drop-cap on the
                        public reading view.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateField('content', [...editing.content, ''])}
                      className="btn-editorial-secondary text-xs py-1 px-2.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editing.content.map((para, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#007A43]">
                            Paragraph #{idx + 1} {idx === 0 ? '(Drop-Cap Lead)' : ''}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const next = [...editing.content];
                                const [item] = next.splice(idx, 1);
                                next.splice(idx - 1, 0, item);
                                updateField('content', next);
                              }}
                              className="p-1 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                              aria-label="Move paragraph up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === editing.content.length - 1}
                              onClick={() => {
                                const next = [...editing.content];
                                const [item] = next.splice(idx, 1);
                                next.splice(idx + 1, 0, item);
                                updateField('content', next);
                              }}
                              className="p-1 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                              aria-label="Move paragraph down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const next = editing.content.filter((_, i) => i !== idx);
                                updateField('content', next.length > 0 ? next : ['']);
                              }}
                              className="p-1 rounded border border-[rgba(214,31,51,0.2)] text-[#D61F33] cursor-pointer"
                              aria-label="Delete paragraph"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={4}
                          value={para}
                          onChange={(e) => {
                            const next = [...editing.content];
                            next[idx] = e.target.value;
                            updateField('content', next);
                          }}
                          placeholder={`Write paragraph ${idx + 1}...`}
                          className="editorial-input text-sm leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Author Attribution & Tags */}
                <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={editing.author_name}
                        onChange={(e) => updateField('author_name', e.target.value)}
                        className="editorial-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                        Author Title / Role
                      </label>
                      <input
                        type="text"
                        value={editing.author_role}
                        onChange={(e) => updateField('author_role', e.target.value)}
                        className="editorial-input"
                      />
                    </div>
                  </div>

                  <TagInput
                    tags={editing.tags}
                    onChange={(next) => updateField('tags', next)}
                  />
                </div>
              </>
            ) : (
              /* LIVE DROP-CAP & READING MEASURE PREVIEW (Matches BlogDetailPage) */
              <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-10 border-b border-[rgba(17,20,18,0.085)] max-w-3xl mx-auto">
                  <div className="flex items-center gap-2.5 text-xs text-[#636C67] mb-4 flex-wrap">
                    <span className="font-bold uppercase tracking-widest text-[#007A43] bg-[#007A43]/8 px-3 py-1 rounded-full">
                      {editing.category}
                    </span>
                    <span>&bull;</span>
                    <span>{editing.publish_date}</span>
                    <span>&bull;</span>
                    <span>{editing.read_time}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111412] leading-tight mb-4">
                    {editing.title || 'Untitled Essay'}
                  </h2>

                  <p className="text-base sm:text-lg text-[#3A423D] leading-relaxed mb-6">
                    {editing.excerpt || 'Your editorial deck will appear here.'}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-[rgba(17,20,18,0.085)]">
                    {editing.author_avatar && (
                      <img
                        src={editing.author_avatar}
                        alt={editing.author_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#007A43]"
                      />
                    )}
                    <div>
                      <div className="text-sm font-bold text-[#111412]">{editing.author_name}</div>
                      <div className="text-xs text-[#636C67]">{editing.author_role}</div>
                    </div>
                  </div>
                </div>

                {editing.cover_image && (
                  <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-8">
                    <div className="rounded-2xl overflow-hidden border border-[rgba(17,20,18,0.085)]">
                      <img
                        src={editing.cover_image}
                        alt={editing.title}
                        className="w-full max-h-[380px] object-cover"
                      />
                      <div className="px-4 py-2.5 bg-white border-t border-[rgba(17,20,18,0.085)] flex items-center justify-between text-xs text-[#636C67]">
                        <span>Photo Archive: Office of the MP for Agona East</span>
                        <span className="font-semibold text-[#005A30]">{editing.category}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="max-w-2xl mx-auto px-6 sm:px-10 py-8 space-y-6">
                  {editing.featured_quote?.trim() && (
                    <aside className="bg-[#FAF9F6] border-l-4 border-l-[#007A43] rounded-r-2xl p-6">
                      <p className="font-serif italic text-lg text-[#111412] leading-relaxed">
                        &ldquo;{editing.featured_quote}&rdquo;
                      </p>
                      <div className="text-xs font-bold text-[#005A30] mt-2">
                        — {editing.author_name}
                      </div>
                    </aside>
                  )}

                  {editing.content
                    .filter((p) => p.trim())
                    .map((paragraph, idx) => {
                      if (idx === 0) {
                        const firstLetter = paragraph.charAt(0);
                        const rest = paragraph.slice(1);
                        return (
                          <p
                            key={idx}
                            className="text-[17px] leading-[1.82] text-[#2E3530]"
                          >
                            <span className="float-left font-serif text-[3.5rem] leading-[0.8] pt-1 pr-3 pb-0.5 text-[#007A43] font-bold">
                              {firstLetter}
                            </span>
                            {rest}
                          </p>
                        );
                      }
                      return (
                        <p key={idx} className="text-[17px] leading-[1.82] text-[#2E3530]">
                          {paragraph}
                        </p>
                      );
                    })}

                  {editing.tags.length > 0 && (
                    <div className="pt-5 border-t border-[rgba(17,20,18,0.085)] flex flex-wrap gap-1.5">
                      {editing.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-[#FAF9F6] border border-[rgba(17,20,18,0.1)] text-[#111412]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Notebook Essay?"
        description={`"${deleteTarget?.title ?? ''}" will be permanently deleted from The MP's Notebook.`}
        confirmLabel="Delete Essay"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteBlogPost(deleteTarget.id);
            showToast('Essay deleted');
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={Boolean(unpublishTarget)}
        title="Unpublish Live Notebook Essay?"
        description={`Reverting "${unpublishTarget?.title ?? ''}" to draft will immediately hide it from public readers on /blog.`}
        confirmLabel="Revert to Draft"
        tone="warning"
        onConfirm={async () => {
          if (unpublishTarget) {
            await upsertBlogPost({ ...unpublishTarget, status: 'draft' });
            showToast('Essay reverted to draft');
            setUnpublishTarget(null);
          }
        }}
        onCancel={() => setUnpublishTarget(null)}
      />
    </div>
  );
};
