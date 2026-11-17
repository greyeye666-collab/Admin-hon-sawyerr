import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { MediaUploader } from '../components/ui/MediaUploader';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import { generateUuid } from '../lib/utils';
import type { HeroBadgeColor, HeroPortraitItem, HeroSlideRow, HeroSlideType } from '../types/database';

type SlideDraft = Omit<HeroSlideRow, 'updated_at'>;

const POSITION_PRESETS = [
  { label: 'Center', value: 'center center' },
  { label: 'Upper (Faces)', value: 'center 20%' },
  { label: 'Top', value: 'center top' },
  { label: 'Lower', value: 'center 80%' },
];

export const HeroManagerPage: React.FC = () => {
  const { data, upsertHeroSlide, deleteHeroSlide, reorderHeroSlides } = useCms();
  const { showToast } = useToast();

  const [editing, setEditing] = useState<SlideDraft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [objectPosition, setObjectPosition] = useState('center 25%');
  const [deleteTarget, setDeleteTarget] = useState<HeroSlideRow | null>(null);

  const openNew = () => {
    setEditing({
      id: '',
      sort_order: data.heroSlides.length + 1,
      is_active: true,
      type: 'landscape',
      tag: 'Agona East Forward',
      badge_color: 'green',
      title: '',
      title_highlight: '',
      description: '',
      landscape_image: '',
      portrait_images: [
        { src: '', caption: 'Grassroots Warmth' },
        { src: '', caption: 'Serving Agona East' },
      ],
    });
    setDirty(false);
  };

  const openEdit = (slide: HeroSlideRow) => {
    setEditing({
      ...slide,
      portrait_images:
        slide.portrait_images && slide.portrait_images.length > 0
          ? slide.portrait_images.map((p) => ({ ...p }))
          : [
              { src: '', caption: 'Grassroots Warmth' },
              { src: '', caption: 'Serving Agona East' },
            ],
    });
    setDirty(false);
  };

  const updateField = <K extends keyof SlideDraft>(key: K, val: SlideDraft[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: val } : prev));
    setDirty(true);
  };

  const updatePortrait = (idx: number, patch: Partial<HeroPortraitItem>) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const list = [...(prev.portrait_images ?? [])];
      list[idx] = { ...list[idx], ...patch };
      return { ...prev, portrait_images: list };
    });
    setDirty(true);
  };

  const addPortraitColumn = () => {
    setEditing((prev) => {
      if (!prev) return prev;
      const list = [...(prev.portrait_images ?? [])];
      if (list.length >= 3) return prev;
      list.push({ src: '', caption: 'Community Engagement' });
      return { ...prev, portrait_images: list };
    });
    setDirty(true);
  };

  const removePortraitColumn = (idx: number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const list = [...(prev.portrait_images ?? [])];
      if (list.length <= 2) return prev;
      list.splice(idx, 1);
      return { ...prev, portrait_images: list };
    });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.title_highlight.trim()) {
      showToast('Missing headline fields', {
        description: 'Both Title and Title Highlight are required.',
        tone: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      await upsertHeroSlide({
        ...editing,
        id: editing.id || generateUuid(),
        landscape_image:
          editing.type === 'landscape' ? editing.landscape_image || '' : null,
        portrait_images:
          editing.type === 'paired-portrait'
            ? (editing.portrait_images ?? []).slice(0, 3)
            : null,
      });
      showToast('Hero slide saved', {
        description: 'Landing page carousel order and editorial card updated.',
      });
      setEditing(null);
      setDirty(false);
    } catch (err) {
      showToast('Save failed', {
        description: err instanceof Error ? err.message : 'Unable to save hero slide.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.heroSlides.length) return;
    const next = [...data.heroSlides];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await reorderHeroSlides(next);
    showToast('Slide order updated');
  };

  const handleToggleActive = async (slide: HeroSlideRow) => {
    await upsertHeroSlide({ ...slide, is_active: !slide.is_active });
    showToast(slide.is_active ? 'Slide hidden from carousel' : 'Slide activated on homepage');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#111412]">
            Landing Masthead Slides ({data.heroSlides.length})
          </h2>
          <p className="text-xs text-[#636C67] mt-0.5">
            Supports full-bleed <code className="font-mono">landscape</code> photographs and 2–3
            column <code className="font-mono">paired-portrait</code> showcases.
          </p>
        </div>

        <button type="button" onClick={openNew} className="btn-editorial-primary shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Slides List */}
      <div className="space-y-3">
        {data.heroSlides.map((slide, idx) => {
          const thumb =
            slide.type === 'landscape'
              ? slide.landscape_image
              : slide.portrait_images?.[0]?.src;

          return (
            <article
              key={slide.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 transition-colors ${
                slide.is_active
                  ? 'border-[rgba(17,20,18,0.085)]'
                  : 'border-[rgba(17,20,18,0.085)] opacity-65 bg-[#FAF9F6]'
              }`}
            >
              {/* Reorder & Index */}
              <div className="flex md:flex-col items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-[rgba(17,20,18,0.1)] text-[#2A312D] hover:bg-[#F3F5F3] disabled:opacity-30 cursor-pointer"
                  aria-label="Move slide up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold text-[#636C67] tabular-nums px-1">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === data.heroSlides.length - 1}
                  className="p-1.5 rounded-lg border border-[rgba(17,20,18,0.1)] text-[#2A312D] hover:bg-[#F3F5F3] disabled:opacity-30 cursor-pointer"
                  aria-label="Move slide down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail Preview */}
              <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden bg-[#111412] shrink-0 border border-[rgba(17,20,18,0.1)]">
                {slide.type === 'paired-portrait' && slide.portrait_images?.length ? (
                  <div
                    className="grid h-full gap-0.5 bg-[#111412]"
                    style={{
                      gridTemplateColumns: `repeat(${slide.portrait_images.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {slide.portrait_images.map((p, pIdx) => (
                      <img
                        key={pIdx}
                        src={p.src}
                        alt={p.caption}
                        className="w-full h-full object-cover object-top"
                      />
                    ))}
                  </div>
                ) : thumb ? (
                  <img src={thumb} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-white/60">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      slide.badge_color === 'green'
                        ? 'bg-[#007A43]/10 text-[#007A43]'
                        : 'bg-[#D61F33]/10 text-[#D61F33]'
                    }`}
                  >
                    {slide.tag}
                  </span>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#F3F5F3] text-[#636C67]">
                    {slide.type}
                  </span>
                  {!slide.is_active && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
                      Hidden
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#111412] leading-snug">
                  {slide.title}{' '}
                  <span className="italic text-[#007A43] font-semibold">
                    {slide.title_highlight}
                  </span>
                </h3>
                <p className="text-xs text-[#636C67] line-clamp-2 leading-relaxed">
                  {slide.description}
                </p>
              </div>

              {/* Row Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide)}
                  className="btn-editorial-secondary text-xs px-3 py-1.5"
                  title={slide.is_active ? 'Hide slide' : 'Show slide'}
                >
                  {slide.is_active ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(slide)}
                  className="btn-editorial-secondary text-xs px-3 py-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(slide)}
                  className="p-2 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                  aria-label="Delete slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Slide Editor Drawer with Live Mini-Hero Preview */}
      <SlideOverDrawer
        open={Boolean(editing)}
        title={editing?.id ? 'Edit Hero Slide' : 'New Hero Slide'}
        subtitle="Changes preview immediately on the frosted-glass editorial card below."
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
              {saving ? 'Saving Slide…' : 'Save Hero Slide'}
            </button>
          </>
        }
      >
        {editing && (
          <div className="space-y-6">
            {/* Live Mini-Hero Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#007A43]">
                  Live Mini-Hero Preview
                </span>
                {editing.type === 'landscape' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#636C67]">Focal Point:</span>
                    {POSITION_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setObjectPosition(preset.value)}
                        className={`text-[11px] px-2 py-0.5 rounded-full border cursor-pointer ${
                          objectPosition === preset.value
                            ? 'bg-[#007A43] text-white border-[#007A43]'
                            : 'bg-white text-[#2A312D] border-[rgba(17,20,18,0.14)]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden min-h-[290px] bg-[#111412] border border-[rgba(17,20,18,0.15)] flex items-end p-5">
                {/* Background Layer */}
                {editing.type === 'landscape' ? (
                  editing.landscape_image ? (
                    <img
                      src={editing.landscape_image}
                      alt="Hero preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition }}
                    />
                  ) : null
                ) : (
                  <div
                    className="absolute inset-0 grid gap-1 bg-[#111412]"
                    style={{
                      gridTemplateColumns: `repeat(${
                        editing.portrait_images?.length || 2
                      }, minmax(0, 1fr))`,
                    }}
                  >
                    {(editing.portrait_images ?? []).map((p, i) => (
                      <div key={i} className="relative h-full bg-[#1A1F1C]">
                        {p.src && (
                          <img
                            src={p.src}
                            alt={p.caption}
                            className="w-full h-full object-cover object-top"
                          />
                        )}
                        {p.caption && (
                          <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20">
                            {p.caption}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(10, 14, 12, 0.84) 0%, rgba(10, 14, 12, 0.48) 48%, rgba(10, 14, 12, 0.12) 100%)',
                  }}
                />

                {/* Frosted Glass Editorial Card */}
                <div
                  className="relative z-10 max-w-md rounded-2xl p-5 border border-white/20 space-y-2.5"
                  style={{
                    backgroundColor: 'rgba(10, 18, 14, 0.65)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009E52]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D61F33]" />
                      <span>NDC Parliamentary Caucus</span>
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor:
                          editing.badge_color === 'green'
                            ? 'rgba(0, 158, 82, 0.25)'
                            : 'rgba(214, 31, 51, 0.25)',
                        color: editing.badge_color === 'green' ? '#A7F3D0' : '#FECACA',
                        borderColor:
                          editing.badge_color === 'green'
                            ? 'rgba(167, 243, 208, 0.35)'
                            : 'rgba(254, 202, 202, 0.35)',
                      }}
                    >
                      {editing.tag || 'Slide Tag'}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    {editing.title || 'Slide Headline'}{' '}
                    <span className="block text-[#F3E5C2] italic font-semibold mt-0.5">
                      {editing.title_highlight || 'Highlighted Continuation'}
                    </span>
                  </h4>

                  <p className="text-xs text-white/85 leading-relaxed line-clamp-3">
                    {editing.description || 'Editorial description will appear here.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Layout & Metadata Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)]">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Slide Layout Type
                </label>
                <select
                  value={editing.type}
                  onChange={(e) => updateField('type', e.target.value as HeroSlideType)}
                  className="editorial-input"
                >
                  <option value="landscape">Landscape (Single Wide)</option>
                  <option value="paired-portrait">Paired Portrait (2–3 Columns)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Slide Tag
                </label>
                <input
                  type="text"
                  value={editing.tag}
                  onChange={(e) => updateField('tag', e.target.value)}
                  placeholder="e.g. Leadership with the People"
                  className="editorial-input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Tag Badge Accent
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['green', 'red'] as HeroBadgeColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateField('badge_color', c)}
                      className={`py-2 rounded-lg text-xs font-semibold border capitalize cursor-pointer ${
                        editing.badge_color === c
                          ? c === 'green'
                            ? 'bg-[#007A43] text-white border-[#007A43]'
                            : 'bg-[#D61F33] text-white border-[#D61F33]'
                          : 'bg-[#FAF9F6] text-[#2A312D] border-[rgba(17,20,18,0.14)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Copy Fields */}
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Headline (Line 1) *
                  </label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Leadership with Integrity."
                    className="editorial-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                    Champagne Italic Highlight (Line 2) *
                  </label>
                  <input
                    type="text"
                    value={editing.title_highlight}
                    onChange={(e) => updateField('title_highlight', e.target.value)}
                    placeholder="Service with Impact."
                    className="editorial-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Concise summary displayed in the hero frosted card..."
                  className="editorial-input"
                />
              </div>

              <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#111412] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="w-4 h-4 accent-[#007A43]"
                />
                <span>Visible in live homepage carousel</span>
              </label>
            </div>

            {/* Media Upload Section */}
            {editing.type === 'landscape' ? (
              <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)]">
                <MediaUploader
                  label="Landscape Hero Photograph"
                  value={editing.landscape_image ?? ''}
                  folder="hero"
                  onChange={(url) => updateField('landscape_image', url)}
                  objectPosition={objectPosition}
                  helperText="Recommended wide landscape photograph (1600×900+)."
                />
              </div>
            ) : (
              <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#111412]">
                      Paired Portrait Columns ({editing.portrait_images?.length ?? 0}/3)
                    </h4>
                    <p className="text-xs text-[#636C67]">
                      Display 2 or 3 vertical portrait plates side by side with pill captions.
                    </p>
                  </div>
                  {(editing.portrait_images?.length ?? 0) < 3 && (
                    <button
                      type="button"
                      onClick={addPortraitColumn}
                      className="btn-editorial-secondary text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Column</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(editing.portrait_images ?? []).map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#007A43]">
                          Column #{idx + 1}
                        </span>
                        {(editing.portrait_images?.length ?? 0) > 2 && (
                          <button
                            type="button"
                            onClick={() => removePortraitColumn(idx)}
                            className="text-xs text-[#D61F33] hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <MediaUploader
                        label={`Portrait Image ${idx + 1}`}
                        value={p.src}
                        folder="hero"
                        compact
                        objectPosition="center top"
                        onChange={(url) => updatePortrait(idx, { src: url })}
                      />

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1">
                          Bottom Pill Caption
                        </label>
                        <input
                          type="text"
                          value={p.caption}
                          onChange={(e) => updatePortrait(idx, { caption: e.target.value })}
                          placeholder="e.g. Grassroots Warmth"
                          className="editorial-input text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Hero Slide?"
        description={`"${deleteTarget?.title ?? ''}" will be permanently removed from the landing carousel.`}
        confirmLabel="Delete Slide"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteHeroSlide(deleteTarget.id);
            showToast('Hero slide removed');
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
