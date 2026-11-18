import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  Briefcase,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { SectionHeaderCard } from '../components/layout/SectionHeaderCard';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { MediaUploader } from '../components/ui/MediaUploader';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import { generateUuid, slugify } from '../lib/utils';
import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type ProjectRow,
} from '../types/database';

type ProjectDraft = Omit<ProjectRow, 'created_at' | 'updated_at'> & {
  created_at?: string;
};

interface ProjectsPageProps {
  openNewIntent?: boolean;
}

function createEmptyProjectDraft(nextSortOrder: number): ProjectDraft {
  return {
    id: '',
    slug: '',
    title: '',
    short_description: '',
    category: 'Education',
    impact_metric: '',
    image: '',
    completion_year: 'Ongoing',
    location: 'Agona East Constituency',
    beneficiaries_count: '',
    full_description: '',
    key_highlights: [''],
    gallery_images: [],
    testimonial: null,
    is_flagship: false,
    sort_order: nextSortOrder,
    is_published: true,
  };
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ openNewIntent }) => {
  const { data, upsertProject, deleteProject, setFlagshipProject } = useCms();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<'All' | ProjectCategory>('All');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ProjectDraft | null>(() =>
    openNewIntent ? createEmptyProjectDraft(data.projects.length + 1) : null
  );
  const [slugTouched, setSlugTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);
  const [unpublishTarget, setUnpublishTarget] = useState<ProjectRow | null>(null);

  const openNew = () => {
    setEditing(createEmptyProjectDraft(data.projects.length + 1));
    setSlugTouched(false);
    setDirty(false);
  };

  const openEdit = (p: ProjectRow) => {
    setEditing({
      ...p,
      key_highlights: p.key_highlights.length > 0 ? [...p.key_highlights] : [''],
      gallery_images: [...(p.gallery_images ?? [])],
      testimonial: p.testimonial ? { ...p.testimonial } : null,
    });
    setSlugTouched(true);
    setDirty(false);
  };

  const updateField = <K extends keyof ProjectDraft>(key: K, val: ProjectDraft[K]) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: val };
      if (key === 'title' && !slugTouched) {
        next.slug = slugify(String(val));
      }
      return next;
    });
    setDirty(true);
  };

  const filtered = data.projects.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (
      search.trim() &&
      !`${p.title} ${p.location} ${p.impact_metric}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.impact_metric.trim()) {
      showToast('Required fields missing', {
        description: 'Project Title and Impact Metric are required.',
        tone: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      const cleanedHighlights = editing.key_highlights.map((h) => h.trim()).filter(Boolean);
      const cleanedGallery = editing.gallery_images.map((g) => g.trim()).filter(Boolean);
      const cleanedTestimonial =
        editing.testimonial && editing.testimonial.quote.trim()
          ? {
              quote: editing.testimonial.quote.trim(),
              author: editing.testimonial.author.trim(),
              role: editing.testimonial.role.trim(),
            }
          : null;

      await upsertProject({
        ...editing,
        id: editing.id || generateUuid(),
        slug: editing.slug.trim() || slugify(editing.title),
        key_highlights: cleanedHighlights,
        gallery_images: cleanedGallery,
        testimonial: cleanedTestimonial,
      });

      showToast(editing.is_flagship ? 'Flagship Project Updated' : 'Project Dossier Saved', {
        description: `"${editing.title}" has been persisted.`,
      });
      setEditing(null);
      setDirty(false);
    } catch (err) {
      showToast('Save failed', {
        description: err instanceof Error ? err.message : 'Unable to save project.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Elevated Section Banner Card matching reference design */}
      <SectionHeaderCard
        category="CONSTITUENCY DOSSIER"
        title="Impact & Projects Dossier"
        subtitle="Document, curate, and spotlight Agona East development initiatives, schools, healthcare facilities, and water projects."
        icon={Briefcase}
        iconTone="emerald"
        badge={{
          text: `${data.projects.length} Total Projects`,
          tone: 'emerald',
        }}
        action={
          <button
            type="button"
            onClick={openNew}
            className="btn-editorial-primary shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Constituency Project</span>
          </button>
        }
      />

      {/* Scope, Segmented Pill Filter & Search Controls */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Soft Segmented Pill Tabs (matching reference image: ▷ Send Bulk SMS, Sender IDs (0), History (1)) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-100/80 border border-stone-200/60">
            {(['All', ...PROJECT_CATEGORIES] as const).map((cat) => {
              const active = categoryFilter === cat;
              const count =
                cat === 'All'
                  ? data.projects.length
                  : data.projects.filter((p) => p.category === cat).length;

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
                        ? 'bg-[#007A43]/10 text-[#007A43]'
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
              placeholder="Search projects, towns or metrics…"
              className="w-full bg-stone-50 hover:bg-white focus:bg-white text-stone-900 placeholder-stone-400 pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-[#007A43] focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#C9963B]" />
          <span>
            The <strong>Flagship Initiative</strong> appears in the asymmetric top spotlight on the public Impact section.
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((project) => (
          <article
            key={project.id}
            className={`bg-white border rounded-2xl overflow-hidden flex flex-col ${
              project.is_flagship
                ? 'border-[#C9963B]'
                : 'border-[rgba(17,20,18,0.085)]'
            }`}
          >
            {project.is_flagship && (
              <div className="px-4 py-1.5 bg-[#F3E5C2] text-[#8F651C] text-[11px] font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Flagship Initiative — Top Homepage Spotlight</span>
                </span>
                <span>{project.impact_metric}</span>
              </div>
            )}

            <div className="p-5 flex gap-4">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#F3F5F3] shrink-0 border border-[rgba(17,20,18,0.085)]">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[11px] text-[#636C67]">
                    No Cover
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#007A43]/10 text-[#007A43]">
                    {project.category}
                  </span>
                  {!project.is_published && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F5F3] text-[#636C67]">
                      Unpublished
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-bold text-[#111412] leading-snug line-clamp-2">
                  {project.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#636C67]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#007A43]" />
                    <span className="truncate max-w-[180px]">{project.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#007A43]" />
                    <span>{project.beneficiaries_count}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-4 text-xs text-[#636C67] line-clamp-2">
              {project.short_description}
            </div>

            <div className="mt-auto px-5 py-3 bg-[#FAF9F6] border-t border-[rgba(17,20,18,0.085)] flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {!project.is_flagship && (
                  <button
                    type="button"
                    onClick={async () => {
                      await setFlagshipProject(project.id);
                      showToast('Flagship Project Updated', {
                        description: `"${project.title}" is now the top homepage spotlight.`,
                      });
                    }}
                    className="btn-editorial-secondary text-xs py-1 px-2.5"
                  >
                    <Award className="w-3.5 h-3.5 text-[#C9963B]" />
                    <span>Set as Flagship</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (project.is_published) {
                      setUnpublishTarget(project);
                    } else {
                      void upsertProject({ ...project, is_published: true }).then(() =>
                        showToast('Project published to site')
                      );
                    }
                  }}
                  className="text-xs font-semibold text-[#636C67] hover:text-[#111412] px-2 py-1 cursor-pointer"
                >
                  {project.is_published ? 'Unpublish' : 'Publish'}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(project)}
                  className="btn-editorial-secondary text-xs py-1 px-3"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(project)}
                  className="p-1.5 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                  aria-label="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Rich Project Editor Drawer */}
      <SlideOverDrawer
        open={Boolean(editing)}
        title={editing?.id ? 'Edit Project Dossier' : 'New Constituency Project'}
        subtitle="Full dossier data powers ImpactSection, DedicatedImpactPage, and ProjectDetailPage."
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
              {saving ? 'Saving Project…' : 'Save Project Dossier'}
            </button>
          </>
        }
      >
        {editing && (
          <div className="space-y-5">
            {/* Core Identity */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Clean Water for All: Solar Boreholes"
                    className="editorial-input"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Focus Area Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) => updateField('category', e.target.value as ProjectCategory)}
                    className="editorial-input"
                  >
                    {PROJECT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Impact Metric Badge *
                  </label>
                  <input
                    type="text"
                    value={editing.impact_metric}
                    onChange={(e) => updateField('impact_metric', e.target.value)}
                    placeholder="e.g. 32 Mechanized Boreholes"
                    className="editorial-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Completion Year / Period
                  </label>
                  <input
                    type="text"
                    value={editing.completion_year}
                    onChange={(e) => updateField('completion_year', e.target.value)}
                    placeholder="e.g. 2020 – 2024"
                    className="editorial-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Location(s) in Agona East
                  </label>
                  <input
                    type="text"
                    value={editing.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="e.g. Nsaba, Duakwa, Kwanyako"
                    className="editorial-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Beneficiaries Count
                  </label>
                  <input
                    type="text"
                    value={editing.beneficiaries_count}
                    onChange={(e) => updateField('beneficiaries_count', e.target.value)}
                    placeholder="e.g. 45,000+ Residents"
                    className="editorial-input"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_flagship}
                    onChange={(e) => updateField('is_flagship', e.target.checked)}
                    className="w-4 h-4 accent-[#C9963B]"
                  />
                  <span>Set as Flagship Initiative (Top Homepage Spotlight)</span>
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

            {/* Narrative */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Short Summary (Card Preview)
                </label>
                <textarea
                  rows={2}
                  value={editing.short_description}
                  onChange={(e) => updateField('short_description', e.target.value)}
                  className="editorial-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Full Dossier Narrative
                </label>
                <textarea
                  rows={5}
                  value={editing.full_description}
                  onChange={(e) => updateField('full_description', e.target.value)}
                  className="editorial-input"
                />
              </div>
            </div>

            {/* Dynamic Key Highlights */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D]">
                  Key Highlights ({editing.key_highlights.length})
                </label>
                <button
                  type="button"
                  onClick={() => updateField('key_highlights', [...editing.key_highlights, ''])}
                  className="btn-editorial-secondary text-xs py-1 px-2.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bullet</span>
                </button>
              </div>

              <div className="space-y-2">
                {editing.key_highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...editing.key_highlights];
                        const [item] = next.splice(idx, 1);
                        next.splice(idx - 1, 0, item);
                        updateField('key_highlights', next);
                      }}
                      className="p-1.5 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                      aria-label="Move highlight up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === editing.key_highlights.length - 1}
                      onClick={() => {
                        const next = [...editing.key_highlights];
                        const [item] = next.splice(idx, 1);
                        next.splice(idx + 1, 0, item);
                        updateField('key_highlights', next);
                      }}
                      className="p-1.5 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                      aria-label="Move highlight down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const next = [...editing.key_highlights];
                        next[idx] = e.target.value;
                        updateField('key_highlights', next);
                      }}
                      placeholder={`Highlight #${idx + 1}`}
                      className="editorial-input text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = editing.key_highlights.filter((_, i) => i !== idx);
                        updateField('key_highlights', next.length > 0 ? next : ['']);
                      }}
                      className="p-1.5 rounded border border-[rgba(214,31,51,0.2)] text-[#D61F33] cursor-pointer"
                      aria-label="Remove highlight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover & Gallery Uploader */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-5">
              <MediaUploader
                label="Primary Project Cover Photograph"
                value={editing.image}
                folder="projects"
                onChange={(url) => updateField('image', url)}
              />

              <div className="pt-4 border-t border-[rgba(17,20,18,0.085)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A312D]">
                      Project Detail Gallery ({editing.gallery_images.length})
                    </h4>
                    <p className="text-[11px] text-[#636C67]">
                      Additional photographs displayed on the dedicated Project Detail Page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateField('gallery_images', [...editing.gallery_images, ''])
                    }
                    className="btn-editorial-secondary text-xs py-1 px-2.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Gallery Image</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {editing.gallery_images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#007A43]">
                          Gallery Photo #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              'gallery_images',
                              editing.gallery_images.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-[11px] text-[#D61F33] hover:underline cursor-pointer"
                        >
                          Remove Slot
                        </button>
                      </div>
                      <MediaUploader
                        label={`Photo ${idx + 1}`}
                        value={imgUrl}
                        folder="projects"
                        compact
                        onChange={(url) => {
                          const next = [...editing.gallery_images];
                          next[idx] = url;
                          updateField('gallery_images', next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Testimonial */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A312D]">
                    Constituent Testimonial (Optional)
                  </h4>
                  <p className="text-[11px] text-[#636C67]">
                    Rendered as an institutional quote block on the Project Detail Page.
                  </p>
                </div>
                {editing.testimonial ? (
                  <button
                    type="button"
                    onClick={() => updateField('testimonial', null)}
                    className="text-xs text-[#D61F33] hover:underline cursor-pointer"
                  >
                    Remove Testimonial
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      updateField('testimonial', { quote: '', author: '', role: '' })
                    }
                    className="btn-editorial-secondary text-xs py-1 px-2.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                )}
              </div>

              {editing.testimonial && (
                <div className="space-y-3 pt-2">
                  <textarea
                    rows={3}
                    value={editing.testimonial.quote}
                    onChange={(e) =>
                      updateField('testimonial', {
                        ...editing.testimonial!,
                        quote: e.target.value,
                      })
                    }
                    placeholder="Direct quote from a beneficiary, chief, midwife, or trader..."
                    className="editorial-input font-serif italic"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editing.testimonial.author}
                      onChange={(e) =>
                        updateField('testimonial', {
                          ...editing.testimonial!,
                          author: e.target.value,
                        })
                      }
                      placeholder="Beneficiary Name (e.g. Abena Mensah)"
                      className="editorial-input text-xs"
                    />
                    <input
                      type="text"
                      value={editing.testimonial.role}
                      onChange={(e) =>
                        updateField('testimonial', {
                          ...editing.testimonial!,
                          role: e.target.value,
                        })
                      }
                      placeholder="Community Role / School"
                      className="editorial-input text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Project Dossier?"
        description={`"${deleteTarget?.title ?? ''}" will be permanently deleted from the shared database.`}
        confirmLabel="Delete Project"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteProject(deleteTarget.id);
            showToast('Project deleted');
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={Boolean(unpublishTarget)}
        title="Unpublish Live Project?"
        description={`Unpublishing "${unpublishTarget?.title ?? ''}" will immediately hide it from the public Impact section and Impact page.`}
        confirmLabel="Unpublish Project"
        tone="warning"
        onConfirm={async () => {
          if (unpublishTarget) {
            await upsertProject({ ...unpublishTarget, is_published: false });
            showToast('Project unpublished');
            setUnpublishTarget(null);
          }
        }}
        onCancel={() => setUnpublishTarget(null)}
      />
    </div>
  );
};
