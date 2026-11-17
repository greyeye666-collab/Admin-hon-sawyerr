import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { SlideOverDrawer } from '../components/ui/SlideOverDrawer';
import { useToast } from '../components/ui/toastContext';
import { useCms } from '../lib/cmsContext';
import { exportSubscribersCsv, formatTimestampShort } from '../lib/utils';
import {
  INQUIRY_CATEGORIES,
  type ContactInquiryRow,
  type InquiryStatus,
  type NewsletterSubscriberRow,
  type SubscriberSource,
} from '../types/database';

type SecretariatTab = 'inbox' | 'subscribers';

export const InquiriesPage: React.FC = () => {
  const { data, updateInquiry, deleteInquiry, deleteSubscriber } = useCms();
  const { showToast } = useToast();

  const [tab, setTab] = useState<SecretariatTab>('inbox');

  // Inquiries filters
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [townFilter, setTownFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [volunteerOnly, setVolunteerOnly] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');

  // Inquiry drawer
  const [activeInquiry, setActiveInquiry] = useState<ContactInquiryRow | null>(null);
  const [draftStatus, setDraftStatus] = useState<InquiryStatus>('new');
  const [draftNotes, setDraftNotes] = useState('');
  const [drawerDirty, setDrawerDirty] = useState(false);
  const [savingInquiry, setSavingInquiry] = useState(false);
  const [deleteInquiryTarget, setDeleteInquiryTarget] =
    useState<ContactInquiryRow | null>(null);

  // Subscribers filters
  const [sourceFilter, setSourceFilter] = useState<'all' | SubscriberSource>('all');
  const [subSearch, setSubSearch] = useState('');
  const [deleteSubTarget, setDeleteSubTarget] =
    useState<NewsletterSubscriberRow | null>(null);

  const openInquiry = (inq: ContactInquiryRow) => {
    setActiveInquiry(inq);
    setDraftStatus(inq.status);
    setDraftNotes(inq.internal_notes ?? '');
    setDrawerDirty(false);
  };

  const handleSaveInquiry = async () => {
    if (!activeInquiry) return;
    setSavingInquiry(true);
    try {
      await updateInquiry(activeInquiry.id, draftStatus, draftNotes);
      showToast('Inquiry Case Updated', {
        description: `${activeInquiry.reference_number} marked as ${draftStatus.replace('_', ' ')}.`,
      });
      setActiveInquiry(null);
      setDrawerDirty(false);
    } catch (err) {
      showToast('Update failed', {
        description: err instanceof Error ? err.message : 'Unable to update inquiry.',
        tone: 'error',
      });
    } finally {
      setSavingInquiry(false);
    }
  };

  const filteredInquiries = data.contactInquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (townFilter !== 'All' && inq.town !== townFilter) return false;
    if (categoryFilter !== 'All' && inq.category !== categoryFilter) return false;
    if (volunteerOnly && !inq.volunteer) return false;
    if (inquirySearch.trim()) {
      const q = inquirySearch.trim().toLowerCase();
      const hay = `${inq.reference_number} ${inq.full_name} ${inq.phone} ${inq.town} ${inq.message}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const filteredSubscribers = data.newsletterSubscribers.filter((sub) => {
    if (sourceFilter !== 'all' && sub.source !== sourceFilter) return false;
    if (
      subSearch.trim() &&
      !sub.email.toLowerCase().includes(subSearch.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const newCount = data.contactInquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Segmented Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Constituent Secretariat Views"
          className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white border border-[rgba(17,20,18,0.085)]"
        >
          <button
            role="tab"
            aria-selected={tab === 'inbox'}
            type="button"
            onClick={() => setTab('inbox')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              tab === 'inbox'
                ? 'bg-[#007A43] text-white'
                : 'text-[#2A312D] hover:bg-[#F3F5F3]'
            }`}
          >
            <span>Constituent Inquiries Inbox</span>
            {newCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${
                  tab === 'inbox'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#D61F33]/12 text-[#D61F33]'
                }`}
              >
                {newCount} new
              </span>
            )}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'subscribers'}
            type="button"
            onClick={() => setTab('subscribers')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              tab === 'subscribers'
                ? 'bg-[#007A43] text-white'
                : 'text-[#2A312D] hover:bg-[#F3F5F3]'
            }`}
          >
            Dispatch Subscribers ({data.newsletterSubscribers.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CONSTITUENT INQUIRIES INBOX */}
      {tab === 'inbox' && (
        <div className="space-y-4">
          {/* Filters Panel */}
          <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#636C67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder="Search AE-XXXXXX or name…"
                  className="editorial-input pl-8 text-xs"
                />
              </div>

              <select
                value={townFilter}
                onChange={(e) => setTownFilter(e.target.value)}
                className="editorial-input text-xs"
                aria-label="Filter by town"
              >
                <option value="All">All Agona East Towns</option>
                {data.mpProfile.constituency_towns.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="editorial-input text-xs"
                aria-label="Filter by inquiry category"
              >
                <option value="All">All Inquiry Categories</option>
                {INQUIRY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(17,20,18,0.12)] bg-[#FAF9F6] text-xs font-semibold text-[#111412] cursor-pointer">
                <input
                  type="checkbox"
                  checked={volunteerOnly}
                  onChange={(e) => setVolunteerOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#007A43]"
                />
                <span>Volunteer Signups Only</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[rgba(17,20,18,0.085)]">
              {(
                [
                  { id: 'all', label: 'All Statuses' },
                  { id: 'new', label: 'New' },
                  { id: 'in_review', label: 'In Review' },
                  { id: 'resolved', label: 'Resolved' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-[#007A43] text-white'
                      : 'bg-[#F3F5F3] text-[#2A312D] hover:bg-[#E7EBE7]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.length === 0 ? (
              <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl p-10 text-center text-sm text-[#636C67]">
                No constituent inquiries match the selected filters.
              </div>
            ) : (
              filteredInquiries.map((inq) => (
                <article
                  key={inq.id}
                  onClick={() => openInquiry(inq)}
                  className="bg-white border border-[rgba(17,20,18,0.085)] hover:border-[#007A43]/45 rounded-2xl p-5 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#111412] text-white tabular-nums">
                        {inq.reference_number}
                      </span>
                      <span className="font-serif text-base font-bold text-[#111412]">
                        {inq.full_name}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#007A43]/10 text-[#007A43]">
                        {inq.category}
                      </span>
                      {inq.volunteer && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3E5C2] text-[#8F651C]">
                          <UserPlus className="w-3 h-3" />
                          <span>Volunteer Corps</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-[#D61F33]/10 text-[#D61F33]'
                            : inq.status === 'in_review'
                              ? 'bg-[#F3E5C2] text-[#8F651C]'
                              : 'bg-[#007A43]/10 text-[#007A43]'
                        }`}
                      >
                        {inq.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#636C67]">
                        {formatTimestampShort(inq.created_at)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#2A312D] leading-relaxed line-clamp-2">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#636C67]">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#007A43]" />
                        <span>{inq.town}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Phone className="w-3.5 h-3.5 text-[#007A43]" />
                        <span>{inq.phone}</span>
                      </span>
                      {inq.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#007A43]" />
                          <span>{inq.email}</span>
                        </span>
                      )}
                    </div>

                    {inq.internal_notes && (
                      <span className="text-[11px] font-medium text-[#8F651C]">
                        Note attached
                      </span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH SUBSCRIBERS */}
      {tab === 'subscribers' && (
        <div className="bg-white border border-[rgba(17,20,18,0.085)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[rgba(17,20,18,0.085)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#636C67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Filter subscriber email…"
                  className="editorial-input pl-8 py-1.5 text-xs"
                />
              </div>

              <div className="inline-flex p-1 rounded-xl bg-[#F3F5F3]">
                {(['all', 'blog', 'footer'] as const).map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSourceFilter(src)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                      sourceFilter === src
                        ? 'bg-white text-[#111412]'
                        : 'text-[#636C67] hover:text-[#111412]'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                exportSubscribersCsv(filteredSubscribers);
                showToast('Subscriber CSV exported', {
                  description: `${filteredSubscribers.length} records downloaded.`,
                });
              }}
              className="btn-editorial-primary text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({filteredSubscribers.length})</span>
            </button>
          </div>

          <div className="divide-y divide-[rgba(17,20,18,0.085)]">
            {filteredSubscribers.map((sub) => (
              <div
                key={sub.id}
                className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF9F6]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#007A43]/10 text-[#007A43] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#111412] truncate">
                      {sub.email}
                    </div>
                    <div className="text-[11px] text-[#636C67]">
                      Subscribed {formatTimestampShort(sub.subscribed_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F3F5F3] text-[#2A312D]">
                    {sub.source}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteSubTarget(sub)}
                    className="p-1.5 rounded-lg border border-[rgba(214,31,51,0.2)] text-[#D61F33] hover:bg-[#D61F33]/5 cursor-pointer"
                    aria-label={`Remove subscriber ${sub.email}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredSubscribers.length === 0 && (
              <div className="p-8 text-center text-sm text-[#636C67]">
                No newsletter subscribers match your filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Constituent Case Slide-Over Drawer */}
      <SlideOverDrawer
        open={Boolean(activeInquiry)}
        title={
          activeInquiry
            ? `Case ${activeInquiry.reference_number} — ${activeInquiry.full_name}`
            : ''
        }
        subtitle={
          activeInquiry
            ? `${activeInquiry.town} • ${activeInquiry.category}`
            : undefined
        }
        dirty={drawerDirty}
        widthClass="max-w-2xl"
        onClose={() => setActiveInquiry(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                if (activeInquiry) setDeleteInquiryTarget(activeInquiry);
              }}
              className="btn-editorial-danger text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveInquiry(null)}
                className="btn-editorial-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveInquiry}
                disabled={savingInquiry}
                className="btn-editorial-primary"
              >
                {savingInquiry ? 'Updating…' : 'Save Case Resolution'}
              </button>
            </div>
          </>
        }
      >
        {activeInquiry && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.08)]">
                  <div className="text-[#636C67] uppercase font-bold text-[10px]">
                    Phone / WhatsApp
                  </div>
                  <div className="font-semibold text-[#111412] mt-0.5 tabular-nums">
                    {activeInquiry.phone}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.08)]">
                  <div className="text-[#636C67] uppercase font-bold text-[10px]">Email</div>
                  <div className="font-semibold text-[#111412] mt-0.5">
                    {activeInquiry.email || 'Not provided'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.08)]">
                  <div className="text-[#636C67] uppercase font-bold text-[10px]">
                    Community / Town
                  </div>
                  <div className="font-semibold text-[#111412] mt-0.5">
                    {activeInquiry.town}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(17,20,18,0.08)]">
                  <div className="text-[#636C67] uppercase font-bold text-[10px]">
                    Volunteer Interest
                  </div>
                  <div className="font-semibold text-[#111412] mt-0.5">
                    {activeInquiry.volunteer
                      ? 'Yes — Requested to join volunteer corps'
                      : 'No'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[rgba(17,20,18,0.085)]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#007A43] mb-1.5">
                  Constituent Message
                </div>
                <p className="text-sm text-[#111412] leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[rgba(17,20,18,0.085)] space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-2">
                  Secretariat Resolution Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'new', label: 'New', icon: Clock },
                      { id: 'in_review', label: 'In Review', icon: Clock },
                      { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
                    ] as const
                  ).map((opt) => {
                    const Icon = opt.icon;
                    const active = draftStatus === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setDraftStatus(opt.id);
                          setDrawerDirty(true);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                          active
                            ? opt.id === 'new'
                              ? 'bg-[#D61F33] text-white border-[#D61F33]'
                              : opt.id === 'in_review'
                                ? 'bg-[#C9963B] text-white border-[#C9963B]'
                                : 'bg-[#007A43] text-white border-[#007A43]'
                            : 'bg-[#FAF9F6] text-[#2A312D] border-[rgba(17,20,18,0.12)]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block mb-1.5">
                  Internal Secretariat Notes
                </label>
                <textarea
                  rows={4}
                  value={draftNotes}
                  onChange={(e) => {
                    setDraftNotes(e.target.value);
                    setDrawerDirty(true);
                  }}
                  placeholder="Log field officer assignment, follow-up calls, or resolution summary..."
                  className="editorial-input"
                />
              </div>
            </div>
          </div>
        )}
      </SlideOverDrawer>

      <ConfirmModal
        open={Boolean(deleteInquiryTarget)}
        title="Delete Constituent Inquiry?"
        description={`Reference ${deleteInquiryTarget?.reference_number ?? ''} from ${deleteInquiryTarget?.full_name ?? ''} will be permanently removed.`}
        confirmLabel="Delete Inquiry"
        onConfirm={async () => {
          if (deleteInquiryTarget) {
            await deleteInquiry(deleteInquiryTarget.id);
            showToast('Inquiry deleted');
            setDeleteInquiryTarget(null);
            setActiveInquiry(null);
          }
        }}
        onCancel={() => setDeleteInquiryTarget(null)}
      />

      <ConfirmModal
        open={Boolean(deleteSubTarget)}
        title="Remove Newsletter Subscriber?"
        description={`Unsubscribe "${deleteSubTarget?.email ?? ''}" from the dispatch list?`}
        confirmLabel="Remove Subscriber"
        onConfirm={async () => {
          if (deleteSubTarget) {
            await deleteSubscriber(deleteSubTarget.id);
            showToast('Subscriber removed');
            setDeleteSubTarget(null);
          }
        }}
        onCancel={() => setDeleteSubTarget(null)}
      />
    </div>
  );
};
