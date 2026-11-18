import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Eye,
  EyeOff,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { SectionHeaderCard } from '../components/layout/SectionHeaderCard';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { MediaUploader } from '../components/ui/MediaUploader';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import { formatMonthYearDisplay, generateUuid } from '../lib/utils';
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItemRow,
} from '../types/database';

type GalleryDraft = Omit<GalleryItemRow, 'created_at'> & { created_at?: string };

export const GalleryPage: React.FC = () => {
  const { data, upsertGalleryItem, deleteGalleryItem, reorderGalleryItems } = useCms();
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<'All' | GalleryCategory>('All');
  const [editing, setEditing] = useState<GalleryDraft | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItemRow | null>(null);

  const openNew = () => {
    setEditing({
      id: '',
      title: '',
      category: 'Community',
      image: '',
      date: formatMonthYearDisplay(),
      location: 'Agona East',
      caption: '',
      sort_order: data.galleryItems.length + 1,
      is_published: true,
    });
    setDirty(false);
  };

  const openEdit = (item: GalleryItemRow) => {
    setEditing({ ...item });
    setDirty(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.image.trim()) {
      showToast('Missing plate details', {
        description: 'Plate Title and Image photograph are required.',
        tone: 'error',
      });
      return;
    }

    setSaving(true);
    try {
      await upsertGalleryItem({
        ...editing,
        id: editing.id || generateUuid(),
      });
      showToast('Archival plate saved', {
        description: `Stored in Photographic Archive.`,
      });
      setEditing(null);
      setDirty(false);
    } catch (err) {
      showToast('Save failed', {
        description: err instanceof Error ? err.message : 'Unable to save plate.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (item: GalleryItemRow, direction: -1 | 1) => {
    const idx = data.galleryItems.findIndex((g) => g.id === item.id);
    const target = idx + direction;
    if (idx === -1 || target < 0 || target >= data.galleryItems.length) return;
    const next = [...data.galleryItems];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    await reorderGalleryItems(next);
    showToast('Archival plate numbering updated');
  };

  const filtered = data.galleryItems.filter((g) =>
    categoryFilter === 'All' ? true : g.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Elevated Section Banner Card */}
      <SectionHeaderCard
        category="MEDIA ARCHIVE"
        title="Photographic Plates Archive"
        subtitle="Curate and organize numbered documentary and ceremonial photographs for the public photo gallery."
        icon={Camera}
        iconTone="emerald"
        badge={{
          text: `${data.galleryItems.length} Archival Plates`,
          tone: 'emerald',
        }}
        action={
          <button
            type="button"
            onClick={openNew}
            className="btn-editorial-primary shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Archival Photo</span>
          </button>
        }
      />

      {/* Scope & Segmented Pill Filter */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-100/80 border border-stone-200/60">
            {(['All', ...GALLERY_CATEGORIES] as const).map((cat) => {
              const active = categoryFilter === cat;
              const count =
                cat === 'All'
                  ? data.galleryItems.length
                  : data.galleryItems.filter((g) => g.category === cat).length;

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

          <div className="text-[11px] text-stone-500">
            Sequential ordering <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">#01</code>, <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">#02</code> mirrors public grid.
          </div>
        </div>
      </div>

      {/* Archival Plates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const plateNumber =
            data.galleryItems.findIndex((g) => g.id === item.id) + 1;
          const canMoveUp = plateNumber > 1;
          const canMoveDown = plateNumber < data.galleryItems.length;

          return (
            <article
              key={item.id}
              className={`bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl overflow-hidden flex flex-col ${
                item.is_published ? '' : 'opacity-65'
              }`}
            >
              <div className="relative aspect-[4/3] bg-[#F3F5F3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="px-2.5 py-1 rounded-full bg-[#111412]/80 text-white font-mono text-xs font-bold tabular-nums absolute top-3 left-3">
                  #{String(plateNumber).padStart(2, '0')}
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white/95 text-[#007A43] text-[11px] font-bold uppercase tracking-wider absolute top-3 right-3 border border-[rgba(17,20,18,0.1)]">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1">
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#636C67]">
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#007A43]" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="shrink-0 font-medium">{item.date}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#111412] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#636C67] line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="px-4 py-3 bg-[#FAF9F6] border-t border-[rgba(17,20,18,0.085)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!canMoveUp}
                    onClick={() => handleMove(item, -1)}
                    className="p-1.5 rounded-lg border border-[rgba(17,20,18,0.12)] bg-white disabled:opacity-30 cursor-pointer"
                    title="Move plate earlier"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={!canMoveDown}
                    onClick={() => handleMove(item, 1)}
                    className="p-1.5 rounded-lg border border-[rgba(17,20,18,0.12)] bg-white disabled:opacity-30 cursor-pointer"
                    title="Move plate later"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      await upsertGalleryItem({
                        ...item,
                        is_published: !item.is_published,
                      });
                      showToast(item.is_published ? 'Plate hidden' : 'Plate visible');
                    }}
                    className="p-1.5 rounded-lg border border-[rgba(17,20,18,0.12)] bg-white text-[#2A312D] cursor-pointer"
                    title={item.is_published ? 'Hide plate' : 'Publish plate'}
                  >
                    {item.is_published ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="btn-editorial-secondary text-xs py-1 px-2.5"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                    aria-label="Delete archival plate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Archival Plate Editor Drawer */}
      <SlideOverDrawer
        open={Boolean(editing)}
        title={editing?.id ? 'Edit Archival Plate' : 'Upload Archival Photo'}
        subtitle="Uploaded to media/gallery/ and rendered in GallerySection & DedicatedGalleryPage."
        dirty={dirty}
        widthClass="max-w-xl"
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
              {saving ? 'Saving Plate…' : 'Save Archival Plate'}
            </button>
          </>
        }
      >
        {editing && (
          <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
            <MediaUploader
              label="Archival Photograph *"
              value={editing.image}
              folder="gallery"
              aspectClass="aspect-[4/3]"
              onChange={(url) => {
                setEditing({ ...editing, image: url });
                setDirty(true);
              }}
            />

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Plate Title *
              </label>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => {
                  setEditing({ ...editing, title: e.target.value });
                  setDirty(true);
                }}
                placeholder="e.g. Akwambo Festival Grand Durbar of Chiefs"
                className="editorial-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Category
                </label>
                <select
                  value={editing.category}
                  onChange={(e) => {
                    setEditing({
                      ...editing,
                      category: e.target.value as GalleryCategory,
                    });
                    setDirty(true);
                  }}
                  className="editorial-input"
                >
                  {GALLERY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Date
                </label>
                <input
                  type="text"
                  value={editing.date}
                  onChange={(e) => {
                    setEditing({ ...editing, date: e.target.value });
                    setDirty(true);
                  }}
                  placeholder="July 2024"
                  className="editorial-input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={editing.location}
                onChange={(e) => {
                  setEditing({ ...editing, location: e.target.value });
                  setDirty(true);
                }}
                placeholder="Agona Nsaba Palace Grounds"
                className="editorial-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Archival Caption
              </label>
              <textarea
                rows={3}
                value={editing.caption}
                onChange={(e) => {
                  setEditing({ ...editing, caption: e.target.value });
                  setDirty(true);
                }}
                placeholder="Describe the context and community figures pictured..."
                className="editorial-input"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={editing.is_published}
                onChange={(e) => {
                  setEditing({ ...editing, is_published: e.target.checked });
                  setDirty(true);
                }}
                className="w-4 h-4 accent-[#007A43]"
              />
              <span>Visible in public Photographic Archive</span>
            </label>
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Archival Plate?"
        description={`"${deleteTarget?.title ?? ''}" will be removed from the Photographic Archive.`}
        confirmLabel="Delete Plate"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteGalleryItem(deleteTarget.id);
            showToast('Archival plate removed');
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
