import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { SectionHeaderCard } from '../components/layout/SectionHeaderCard';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { MediaUploader } from '../components/ui/MediaUploader';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { TagInput } from '../components/ui/TagInput';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import {
  estimateReadTime,
  formatTodayDisplay,
  generateUuid,
  slugify,
} from '../lib/utils';
import {
  NEWS_CATEGORIES,
  type NewsArticleRow,
  type NewsCategory,
} from '../types/database';

type NewsDraft = Omit<NewsArticleRow, 'created_at' | 'updated_at'> & {
  created_at?: string;
};

interface NewsPageProps {
  openNewIntent?: boolean;
}

function createEmptyNewsDraft(): NewsDraft {
  return {
    id: '',
    slug: '',
    title: '',
    published_date: formatTodayDisplay(),
    category: 'Press Release',
    read_time: '3 min read',
    thumbnail: '',
    excerpt: '',
    content: [''],
    featured: false,
    author: 'Constituency Communications Directorate',
    tags: ['Agona East'],
    is_published: true,
  };
}

export const NewsPage: React.FC<NewsPageProps> = ({ openNewIntent }) => {
  const { data, upsertNewsArticle, deleteNewsArticle, setFeaturedNewsArticle } = useCms();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<'All' | NewsCategory>('All');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<NewsDraft | null>(() =>
    openNewIntent ? createEmptyNewsDraft() : null
  );
  const [slugTouched, setSlugTouched] = useState(false);
  const [manualReadTime, setManualReadTime] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticleRow | null>(null);
  const [unpublishTarget, setUnpublishTarget] = useState<NewsArticleRow | null>(null);

  const openNew = () => {
    setEditing(createEmptyNewsDraft());
    setSlugTouched(false);
    setManualReadTime(false);
    setDirty(false);
  };

  const openEdit = (article: NewsArticleRow) => {
    setEditing({
      ...article,
      content: article.content.length > 0 ? [...article.content] : [''],
      tags: [...(article.tags ?? [])],
    });
    setSlugTouched(true);
    setManualReadTime(true);
    setDirty(false);
  };

  const updateField = <K extends keyof NewsDraft>(key: K, val: NewsDraft[K]) => {
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

  const filtered = data.newsArticles.filter((n) => {
    if (categoryFilter !== 'All' && n.category !== categoryFilter) return false;
    if (
      search.trim() &&
      !`${n.title} ${n.author} ${n.excerpt}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.excerpt.trim()) {
      showToast('Missing required fields', {
        description: 'Headline and Excerpt are required before saving.',
        tone: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      const cleanedParagraphs = editing.content.map((p) => p.trim()).filter(Boolean);
      await upsertNewsArticle({
        ...editing,
        id: editing.id || generateUuid(),
        slug: editing.slug.trim() || slugify(editing.title),
        content: cleanedParagraphs,
        read_time: editing.read_time.trim() || estimateReadTime(cleanedParagraphs),
      });

      showToast(
        editing.is_published ? 'Dispatch Published' : 'Press Statement Saved as Draft',
        { description: `"${editing.title}" synced with Gazette wire.` }
      );
      setEditing(null);
      setDirty(false);
    } catch (err) {
      showToast('Save failed', {
        description: err instanceof Error ? err.message : 'Unable to save dispatch.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Elevated Section Banner Card */}
      <SectionHeaderCard
        category="COMMUNICATIONS & PRESS"
        title="Press Room & Gazette Wire"
        subtitle="Issue authoritative statements, parliamentary updates, and constituency dispatches for public distribution."
        icon={Newspaper}
        iconTone="gold"
        badge={{
          text: `${data.newsArticles.length} Dispatches Published`,
          tone: 'gold',
        }}
        action={
          <button
            type="button"
            onClick={openNew}
            className="btn-editorial-primary shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Press Release</span>
          </button>
        }
      />

      {/* Scope, Segmented Pill Filter & Search Bar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Soft Segmented Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-100/80 border border-stone-200/60">
            {(['All', ...NEWS_CATEGORIES] as const).map((cat) => {
              const active = categoryFilter === cat;
              const count =
                cat === 'All'
                  ? data.newsArticles.length
                  : data.newsArticles.filter((n) => n.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                      active
                        ? 'bg-[#8F651C]/15 text-[#8F651C]'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dispatches or authors…"
              className="w-full bg-stone-50 hover:bg-white focus:bg-white text-stone-900 placeholder-stone-400 pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#007A43] focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C9963B]" />
          <span>
            Toggle <strong>Lead Dispatch</strong> on any article to feature it prominently in the left hero slot of the public Press Room.
          </span>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filtered.map((article) => (
          <article
            key={article.id}
            className={`bg-white border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-5 ${
              article.featured
                ? 'border-[#007A43]'
                : 'border-[rgba(17,20,18,0.085)]'
            }`}
          >
            <div className="w-full lg:w-44 h-28 rounded-xl overflow-hidden bg-[#F3F5F3] shrink-0 border border-[rgba(17,20,18,0.085)]">
              {article.thumbnail ? (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#636C67]">
                  No Thumbnail
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {article.featured && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#007A43] text-white">
                    <Sparkles className="w-3 h-3" />
                    <span>Lead Dispatch</span>
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#007A43]/10 text-[#007A43]">
                  {article.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#636C67]">
                  <Calendar className="w-3 h-3" />
                  <span>{article.published_date}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#636C67]">
                  <Clock className="w-3 h-3" />
                  <span>{article.read_time}</span>
                </span>
                {!article.is_published && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
                    Unpublished
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-[#111412] leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-[#636C67] line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="text-[11px] text-[#636C67]">
                By <span className="font-semibold text-[#2A312D]">{article.author}</span> &bull;{' '}
                {article.content.length} paragraph{article.content.length === 1 ? '' : 's'}
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {!article.featured && (
                  <button
                    type="button"
                    onClick={async () => {
                      await setFeaturedNewsArticle(article.id);
                      showToast('Lead Dispatch Updated', {
                        description: `"${article.title}" now leads the homepage News Section.`,
                      });
                    }}
                    className="btn-editorial-secondary text-xs py-1.5 px-3"
                  >
                    Set as Lead Dispatch
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openEdit(article)}
                  className="btn-editorial-secondary text-xs py-1.5 px-3"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(article)}
                  className="p-2 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                  aria-label="Delete dispatch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (article.is_published) {
                    setUnpublishTarget(article);
                  } else {
                    void upsertNewsArticle({ ...article, is_published: true }).then(() =>
                      showToast('Dispatch published')
                    );
                  }
                }}
                className="text-xs font-semibold text-[#636C67] hover:text-[#111412] cursor-pointer"
              >
                {article.is_published ? 'Unpublish from live wire' : 'Publish to live wire'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Dispatch Editor Drawer */}
      <SlideOverDrawer
        open={Boolean(editing)}
        title={editing?.id ? 'Edit Press Dispatch' : 'New Press Release / Dispatch'}
        subtitle="Publishes to NewsSection, DedicatedNewsPage, and ArticleDetailPage."
        dirty={dirty}
        widthClass="max-w-4xl"
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
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-editorial-primary"
            >
              {saving ? 'Saving Dispatch…' : 'Save & Sync Dispatch'}
            </button>
          </>
        }
      >
        {editing && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Dispatch Headline *
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Official headline for the Gazette Wire..."
                  className="editorial-input font-serif text-base font-bold"
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
                    Author / Issuing Desk
                  </label>
                  <input
                    type="text"
                    value={editing.author}
                    onChange={(e) => updateField('author', e.target.value)}
                    placeholder="Constituency Communications Directorate"
                    className="editorial-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) => updateField('category', e.target.value as NewsCategory)}
                    className="editorial-input"
                  >
                    {NEWS_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={editing.published_date}
                    onChange={(e) => updateField('published_date', e.target.value)}
                    placeholder="July 14, 2024"
                    className="editorial-input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D]">
                      Read Time
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setManualReadTime(false);
                        updateField('read_time', estimateReadTime(editing.content));
                      }}
                      className="text-[11px] text-[#007A43] font-semibold hover:underline cursor-pointer"
                    >
                      Auto-calc
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
              </div>

              <div className="flex flex-wrap gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="w-4 h-4 accent-[#007A43]"
                  />
                  <span>Lead Dispatch (Left Homepage Spotlight)</span>
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_published}
                    onChange={(e) => updateField('is_published', e.target.checked)}
                    className="w-4 h-4 accent-[#007A43]"
                  />
                  <span>Published on public website</span>
                </label>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Lead Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={editing.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  placeholder="Concise summary for the Gazette Wire card..."
                  className="editorial-input"
                />
              </div>

              <MediaUploader
                label="Dispatch Cover Image (media/news/)"
                value={editing.thumbnail}
                folder="news"
                onChange={(url) => updateField('thumbnail', url)}
              />
            </div>

            {/* Multi-paragraph Editorial Body */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D]">
                    Statement Paragraphs ({editing.content.length})
                  </label>
                  <p className="text-[11px] text-[#636C67]">
                    Serializes cleanly into <code className="font-mono">content: string[]</code>.
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
                    className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#007A43]">
                        Paragraph #{idx + 1}
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
                      rows={3}
                      value={para}
                      onChange={(e) => {
                        const next = [...editing.content];
                        next[idx] = e.target.value;
                        updateField('content', next);
                      }}
                      placeholder={`Write paragraph ${idx + 1}...`}
                      className="editorial-input text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)]">
              <TagInput
                tags={editing.tags}
                onChange={(next) => updateField('tags', next)}
              />
            </div>
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Press Dispatch?"
        description={`"${deleteTarget?.title ?? ''}" will be permanently removed from the Press Room.`}
        confirmLabel="Delete Dispatch"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteNewsArticle(deleteTarget.id);
            showToast('Dispatch deleted');
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={Boolean(unpublishTarget)}
        title="Unpublish Live Dispatch?"
        description={`Unpublishing "${unpublishTarget?.title ?? ''}" will immediately remove it from the public Gazette Wire.`}
        confirmLabel="Unpublish Dispatch"
        tone="warning"
        onConfirm={async () => {
          if (unpublishTarget) {
            await upsertNewsArticle({ ...unpublishTarget, is_published: false });
            showToast('Dispatch unpublished');
            setUnpublishTarget(null);
          }
        }}
        onCancel={() => setUnpublishTarget(null)}
      />
    </div>
  );
};
