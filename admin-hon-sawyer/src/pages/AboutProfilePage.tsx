import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { SectionHeaderCard } from '../components/layout/SectionHeaderCard';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { CoreValueIcon } from '../components/ui/CoreValueIcon';
import { MediaUploader } from '../components/ui/MediaUploader';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import { generateUuid } from '../lib/utils';
import {
  CORE_VALUE_ICONS,
  type CoreValueIconName,
  type CoreValueRow,
  type MpProfileRow,
  type QuickStatRow,
  type TimelineMilestoneRow,
} from '../types/database';

type AboutTab = 'profile' | 'stats' | 'values' | 'timeline';

export const AboutProfilePage: React.FC = () => {
  const {
    data,
    saveMpProfile,
    saveQuickStat,
    upsertCoreValue,
    deleteCoreValue,
    reorderCoreValues,
    upsertTimelineMilestone,
    deleteTimelineMilestone,
    reorderTimelineMilestones,
  } = useCms();
  const { showToast } = useToast();

  const [tab, setTab] = useState<AboutTab>('profile');

  // Tab 1: MP Profile form state (null = mirroring live synced data.mpProfile)
  const [profileDraft, setProfileDraft] = useState<MpProfileRow | null>(null);
  const profileForm = profileDraft ?? data.mpProfile;
  const profileDirty = profileDraft !== null;
  const [savingProfile, setSavingProfile] = useState(false);
  const [newTown, setNewTown] = useState('');

  // Tab 2: Quick Stats state (null = mirroring live synced data.quickStats)
  const [statsDraft, setStatsDraft] = useState<QuickStatRow[] | null>(null);
  const statsForm = statsDraft ?? data.quickStats;
  const [savingStats, setSavingStats] = useState(false);

  // Tab 3: Core Value Drawer
  const [editingValue, setEditingValue] = useState<CoreValueRow | null>(null);
  const [valueDirty, setValueDirty] = useState(false);
  const [deleteValueTarget, setDeleteValueTarget] = useState<CoreValueRow | null>(null);

  // Tab 4: Timeline Milestone Drawer
  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestoneRow | null>(null);
  const [milestoneDirty, setMilestoneDirty] = useState(false);
  const [deleteMilestoneTarget, setDeleteMilestoneTarget] =
    useState<TimelineMilestoneRow | null>(null);

  const updateProfile = <K extends keyof MpProfileRow>(key: K, val: MpProfileRow[K]) => {
    setProfileDraft((prev) => ({ ...(prev ?? data.mpProfile), [key]: val }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await saveMpProfile(profileForm);
      setProfileDraft(null);
      showToast('Official MP Profile updated', {
        description: 'Contact details, portraits, and constituency towns synced.',
      });
    } catch (err) {
      showToast('Save failed', {
        description: err instanceof Error ? err.message : 'Unable to save MP profile.',
        tone: 'error',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddTown = () => {
    const cleaned = newTown.trim();
    if (!cleaned) return;
    if (!profileForm.constituency_towns.includes(cleaned)) {
      updateProfile('constituency_towns', [...profileForm.constituency_towns, cleaned]);
    }
    setNewTown('');
  };

  const handleSaveAllStats = async () => {
    setSavingStats(true);
    try {
      for (const stat of statsForm) {
        await saveQuickStat(stat);
      }
      setStatsDraft(null);
      showToast('Attestation Stats Bar updated', {
        description: '4-column public homepage metrics synced.',
      });
    } catch (err) {
      showToast('Failed to update stats', {
        description: err instanceof Error ? err.message : 'Error saving quick stats.',
        tone: 'error',
      });
    } finally {
      setSavingStats(false);
    }
  };

  const moveCoreValue = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= data.coreValues.length) return;
    const next = [...data.coreValues];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    await reorderCoreValues(next);
    showToast('Core value order updated');
  };

  const moveMilestone = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= data.timelineMilestones.length) return;
    const next = [...data.timelineMilestones];
    const [item] = next.splice(idx, 1);
    next.splice(target, 0, item);
    await reorderTimelineMilestones(next);
    showToast('Timeline milestone order updated');
  };

  const tabs: { id: AboutTab; label: string }[] = [
    { id: 'profile', label: 'Official Profile & Contact Info' },
    { id: 'stats', label: 'Attestation Stats Bar' },
    { id: 'values', label: `Core Values (${data.coreValues.length})` },
    { id: 'timeline', label: `Parliamentary Timeline (${data.timelineMilestones.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Elevated Section Banner Card */}
      <SectionHeaderCard
        category="PARLIAMENTARY DOSSIER"
        title="About, Profile & Governance Stats"
        subtitle="Manage Hon. Queenstar Sawyerr's parliamentary biography, attestation bar, constituency towns, and milestone timeline."
        icon={UserCheck}
        iconTone="emerald"
        badge={{
          text: 'Verified Parliamentary Bio',
          tone: 'emerald',
        }}
      />

      {/* Segmented Soft Pill Tabs (matching reference image) */}
      <div
        role="tablist"
        aria-label="About and Profile Sections"
        className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-stone-100/80 border border-stone-200/60 shadow-2xs"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === t.id
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OFFICIAL PROFILE & CONTACT INFO */}
      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(17,20,18,0.085)]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#111412]">
                  Identity &amp; Parliamentary Details
                </h2>
                <p className="text-xs text-[#636C67]">
                  Powers <code className="font-mono">MP_DETAILS</code>, Navbar, About section, and
                  Footer attribution.
                </p>
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-editorial-primary shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>
                  {savingProfile
                    ? 'Saving…'
                    : profileDirty
                      ? 'Save Official Profile'
                      : 'Save Profile'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Full Official Name
                </label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => updateProfile('full_name', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Short Name
                </label>
                <input
                  type="text"
                  value={profileForm.short_name}
                  onChange={(e) => updateProfile('short_name', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Popular Title
                </label>
                <input
                  type="text"
                  value={profileForm.popular_title}
                  onChange={(e) => updateProfile('popular_title', e.target.value)}
                  className="editorial-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Official Role
                </label>
                <input
                  type="text"
                  value={profileForm.role}
                  onChange={(e) => updateProfile('role', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Political Party
                </label>
                <input
                  type="text"
                  value={profileForm.party}
                  onChange={(e) => updateProfile('party', e.target.value)}
                  className="editorial-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Constituency
                </label>
                <input
                  type="text"
                  value={profileForm.constituency}
                  onChange={(e) => updateProfile('constituency', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Region
                </label>
                <input
                  type="text"
                  value={profileForm.region}
                  onChange={(e) => updateProfile('region', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Tenure
                </label>
                <input
                  type="text"
                  value={profileForm.tenure}
                  onChange={(e) => updateProfile('tenure', e.target.value)}
                  className="editorial-input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Official Slogan
              </label>
              <input
                type="text"
                value={profileForm.slogan}
                onChange={(e) => updateProfile('slogan', e.target.value)}
                className="editorial-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Hero Tagline
              </label>
              <textarea
                rows={2}
                value={profileForm.hero_tagline}
                onChange={(e) => updateProfile('hero_tagline', e.target.value)}
                className="editorial-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                About Section Editorial Quote
              </label>
              <textarea
                rows={2}
                value={profileForm.about_quote}
                onChange={(e) => updateProfile('about_quote', e.target.value)}
                className="editorial-input font-serif italic"
              />
            </div>
          </div>

          {/* Contact & Offices */}
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#111412]">
              Secretariat &amp; Parliamentary Contact Offices
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Parliament Email
                </label>
                <input
                  type="email"
                  value={profileForm.parliament_email}
                  onChange={(e) => updateProfile('parliament_email', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Constituency Office Email
                </label>
                <input
                  type="email"
                  value={profileForm.office_email}
                  onChange={(e) => updateProfile('office_email', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Constituency Telephone
                </label>
                <input
                  type="text"
                  value={profileForm.constituency_phone}
                  onChange={(e) => updateProfile('constituency_phone', e.target.value)}
                  className="editorial-input tabular-nums"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Urgent Hotline / WhatsApp
                </label>
                <input
                  type="text"
                  value={profileForm.hotline_phone}
                  onChange={(e) => updateProfile('hotline_phone', e.target.value)}
                  className="editorial-input tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Agona Nsaba Secretariat Address
                </label>
                <textarea
                  rows={2}
                  value={profileForm.office_address}
                  onChange={(e) => updateProfile('office_address', e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Job 600 Parliament House Address (Accra)
                </label>
                <textarea
                  rows={2}
                  value={profileForm.parliament_address}
                  onChange={(e) => updateProfile('parliament_address', e.target.value)}
                  className="editorial-input"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-[rgba(17,20,18,0.085)]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#007A43] mb-3">
                Official Social Media Handles
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(['facebook', 'x', 'instagram', 'youtube'] as const).map((platform) => (
                  <div key={platform}>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#636C67] block mb-1">
                      {platform === 'x' ? 'X (Twitter)' : platform}
                    </label>
                    <input
                      type="url"
                      value={profileForm.social_links?.[platform] ?? ''}
                      onChange={(e) =>
                        updateProfile('social_links', {
                          ...profileForm.social_links,
                          [platform]: e.target.value,
                        })
                      }
                      className="editorial-input text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Portraits */}
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#111412]">
              Official Portraits (media/profile/)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <MediaUploader
                label="Hero Portrait"
                value={profileForm.portrait_hero_url}
                folder="profile"
                aspectClass="aspect-[4/5]"
                objectPosition="center 20%"
                onChange={(url) => updateProfile('portrait_hero_url', url)}
              />
              <MediaUploader
                label="About Biography Portrait"
                value={profileForm.portrait_about_url}
                folder="profile"
                aspectClass="aspect-[4/5]"
                objectPosition="center 20%"
                onChange={(url) => updateProfile('portrait_about_url', url)}
              />
              <MediaUploader
                label="Community Engagement Portrait"
                value={profileForm.portrait_community_url}
                folder="profile"
                aspectClass="aspect-[4/5]"
                objectPosition="center 20%"
                onChange={(url) => updateProfile('portrait_community_url', url)}
              />
            </div>
          </div>

          {/* Constituency Towns List */}
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111412]">
                Constituency Towns &amp; Communities ({profileForm.constituency_towns.length})
              </h3>
              <p className="text-xs text-[#636C67]">
                Populates the town selector on the public Contact form and Inquiries filter.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileForm.constituency_towns.map((town) => (
                <span
                  key={town}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF9F6] border border-[rgba(17,20,18,0.12)] text-[#111412]"
                >
                  <span>{town}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateProfile(
                        'constituency_towns',
                        profileForm.constituency_towns.filter((t) => t !== town)
                      )
                    }
                    className="text-[#636C67] hover:text-[#D61F33] cursor-pointer"
                    aria-label={`Remove ${town}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newTown}
                onChange={(e) => setNewTown(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTown();
                  }
                }}
                placeholder="Add community or village name…"
                className="editorial-input text-xs"
              />
              <button
                type="button"
                onClick={handleAddTown}
                className="btn-editorial-secondary text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Town</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: ATTESTATION STATS BAR */}
      {tab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#111412]">
                  4-Column Attestation Stats Bar
                </h2>
                <p className="text-xs text-[#636C67]">
                  Displayed directly beneath the Hero Carousel on the landing page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveAllStats}
                disabled={savingStats}
                className="btn-editorial-primary shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{savingStats ? 'Saving Stats…' : 'Save Stats Bar'}</span>
              </button>
            </div>

            {/* Live Preview Strip */}
            <div className="rounded-2xl bg-[#111412] text-white p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsForm.map((s) => (
                <div key={s.id} className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0">
                  <div className="font-serif text-2xl font-bold text-[#F3E5C2] tabular-nums">
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold text-white mt-0.5">{s.label}</div>
                  <div className="text-[11px] text-white/65">{s.subtext}</div>
                </div>
              ))}
            </div>

            {/* Editable Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsForm.map((stat, idx) => (
                <div
                  key={stat.id}
                  className="p-4 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.085)] space-y-3"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#007A43]">
                    Column #{idx + 1}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-[#2A312D] block mb-1">
                        Metric Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const next = [...statsForm];
                          next[idx] = { ...stat, value: e.target.value };
                          setStatsDraft(next);
                        }}
                        className="editorial-input font-serif font-bold tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase text-[#2A312D] block mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const next = [...statsForm];
                          next[idx] = { ...stat, label: e.target.value };
                          setStatsDraft(next);
                        }}
                        className="editorial-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#2A312D] block mb-1">
                      Subtext
                    </label>
                    <input
                      type="text"
                      value={stat.subtext}
                      onChange={(e) => {
                        const next = [...statsForm];
                        next[idx] = { ...stat, subtext: e.target.value };
                        setStatsDraft(next);
                      }}
                      className="editorial-input text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CORE VALUES */}
      {tab === 'values' && (
        <div className="space-y-4">
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#111412]">
                Leadership Core Values
              </h2>
              <p className="text-xs text-[#636C67]">
                Displayed on the Dedicated About Page with institutional icons.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingValue({
                  id: '',
                  sort_order: data.coreValues.length + 1,
                  title: '',
                  description: '',
                  icon_name: 'heart',
                });
                setValueDirty(false);
              }}
              className="btn-editorial-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add Core Value</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.coreValues.map((cv, idx) => (
              <div
                key={cv.id}
                className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#007A43]/10 text-[#007A43] flex items-center justify-center shrink-0">
                  <CoreValueIcon name={cv.icon_name} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#111412]">{cv.title}</div>
                  <p className="text-xs text-[#636C67] mt-1 leading-relaxed">{cv.description}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveCoreValue(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                      aria-label="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCoreValue(idx, 1)}
                      disabled={idx === data.coreValues.length - 1}
                      className="p-1 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                      aria-label="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingValue({ ...cv });
                        setValueDirty(false);
                      }}
                      className="p-1 rounded border border-[rgba(17,20,18,0.1)] text-[#2A312D] hover:bg-[#F3F5F3] cursor-pointer"
                      aria-label="Edit core value"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteValueTarget(cv)}
                      className="p-1 rounded border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                      aria-label="Delete core value"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PARLIAMENTARY TIMELINE */}
      {tab === 'timeline' && (
        <div className="space-y-4">
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#111412]">
                Career &amp; Parliamentary Timeline
              </h2>
              <p className="text-xs text-[#636C67]">
                Chronological milestones rendered on the Biography / About page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingMilestone({
                  id: '',
                  sort_order: data.timelineMilestones.length + 1,
                  year: '',
                  title: '',
                  role: '',
                  description: '',
                });
                setMilestoneDirty(false);
              }}
              className="btn-editorial-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.timelineMilestones.map((ms, idx) => (
              <div
                key={ms.id}
                className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex sm:flex-col items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveMilestone(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                    aria-label="Move milestone up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMilestone(idx, 1)}
                    disabled={idx === data.timelineMilestones.length - 1}
                    className="p-1 rounded border border-[rgba(17,20,18,0.1)] disabled:opacity-30 cursor-pointer"
                    aria-label="Move milestone down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="sm:w-32 shrink-0">
                  <span className="inline-block font-serif text-base font-bold text-[#007A43] bg-[#007A43]/8 px-3 py-1 rounded-full tabular-nums">
                    {ms.year}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-serif text-base font-bold text-[#111412]">{ms.title}</div>
                  <div className="text-xs font-semibold text-[#8F651C] mt-0.5">{ms.role}</div>
                  <p className="text-xs text-[#636C67] mt-1 leading-relaxed">{ms.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMilestone({ ...ms });
                      setMilestoneDirty(false);
                    }}
                    className="btn-editorial-secondary text-xs px-3 py-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteMilestoneTarget(ms)}
                    className="p-2 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                    aria-label="Delete milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Value Editor Drawer */}
      <SlideOverDrawer
        open={Boolean(editingValue)}
        title={editingValue?.id ? 'Edit Core Value' : 'New Core Value'}
        dirty={valueDirty}
        widthClass="max-w-lg"
        onClose={() => setEditingValue(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingValue(null)}
              className="btn-editorial-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!editingValue || !editingValue.title.trim()) {
                  showToast('Title is required', { tone: 'error' });
                  return;
                }
                await upsertCoreValue({
                  ...editingValue,
                  id: editingValue.id || generateUuid(),
                });
                showToast('Core value saved');
                setEditingValue(null);
              }}
              className="btn-editorial-primary"
            >
              Save Core Value
            </button>
          </>
        }
      >
        {editingValue && (
          <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={editingValue.title}
                onChange={(e) => {
                  setEditingValue({ ...editingValue, title: e.target.value });
                  setValueDirty(true);
                }}
                placeholder="e.g. Servant Leadership"
                className="editorial-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Icon Symbol
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CORE_VALUE_ICONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setEditingValue({
                        ...editingValue,
                        icon_name: opt.value as CoreValueIconName,
                      });
                      setValueDirty(true);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                      editingValue.icon_name === opt.value
                        ? 'bg-[#007A43] text-white border-[#007A43]'
                        : 'bg-[#FAF9F6] text-[#111412] border-[rgba(17,20,18,0.12)]'
                    }`}
                  >
                    <CoreValueIcon name={opt.value} className="w-4 h-4 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={editingValue.description}
                onChange={(e) => {
                  setEditingValue({ ...editingValue, description: e.target.value });
                  setValueDirty(true);
                }}
                className="editorial-input"
              />
            </div>
          </div>
        )}
      </SlideOverDrawer>

      {/* Timeline Milestone Drawer */}
      <SlideOverDrawer
        open={Boolean(editingMilestone)}
        title={editingMilestone?.id ? 'Edit Timeline Milestone' : 'New Timeline Milestone'}
        dirty={milestoneDirty}
        widthClass="max-w-lg"
        onClose={() => setEditingMilestone(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingMilestone(null)}
              className="btn-editorial-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!editingMilestone || !editingMilestone.year.trim() || !editingMilestone.title.trim()) {
                  showToast('Year and Title are required', { tone: 'error' });
                  return;
                }
                await upsertTimelineMilestone({
                  ...editingMilestone,
                  id: editingMilestone.id || generateUuid(),
                });
                showToast('Timeline milestone saved');
                setEditingMilestone(null);
              }}
              className="btn-editorial-primary"
            >
              Save Milestone
            </button>
          </>
        }
      >
        {editingMilestone && (
          <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Year / Period *
                </label>
                <input
                  type="text"
                  value={editingMilestone.year}
                  onChange={(e) => {
                    setEditingMilestone({ ...editingMilestone, year: e.target.value });
                    setMilestoneDirty(true);
                  }}
                  placeholder="2013 – 2017"
                  className="editorial-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Official Role
                </label>
                <input
                  type="text"
                  value={editingMilestone.role}
                  onChange={(e) => {
                    setEditingMilestone({ ...editingMilestone, role: e.target.value });
                    setMilestoneDirty(true);
                  }}
                  placeholder="Member of Parliament"
                  className="editorial-input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Milestone Title *
              </label>
              <input
                type="text"
                value={editingMilestone.title}
                onChange={(e) => {
                  setEditingMilestone({ ...editingMilestone, title: e.target.value });
                  setMilestoneDirty(true);
                }}
                placeholder="First Historic Parliamentary Victory"
                className="editorial-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={editingMilestone.description}
                onChange={(e) => {
                  setEditingMilestone({ ...editingMilestone, description: e.target.value });
                  setMilestoneDirty(true);
                }}
                className="editorial-input"
              />
            </div>
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteValueTarget)}
        title="Delete Core Value?"
        description={`Remove "${deleteValueTarget?.title ?? ''}" from the About page core values?`}
        confirmLabel="Delete Value"
        onConfirm={async () => {
          if (deleteValueTarget) {
            await deleteCoreValue(deleteValueTarget.id);
            showToast('Core value removed');
            setDeleteValueTarget(null);
          }
        }}
        onCancel={() => setDeleteValueTarget(null)}
      />

      <ConfirmModal
        open={Boolean(deleteMilestoneTarget)}
        title="Delete Timeline Milestone?"
        description={`Remove "${deleteMilestoneTarget?.title ?? ''}" (${deleteMilestoneTarget?.year ?? ''})?`}
        confirmLabel="Delete Milestone"
        onConfirm={async () => {
          if (deleteMilestoneTarget) {
            await deleteTimelineMilestone(deleteMilestoneTarget.id);
            showToast('Milestone removed');
            setDeleteMilestoneTarget(null);
          }
        }}
        onCancel={() => setDeleteMilestoneTarget(null)}
      />
    </div>
  );
};
