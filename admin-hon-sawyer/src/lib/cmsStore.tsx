import React, { useCallback, useEffect, useState } from 'react';
import {
  SEED_BLOG_POSTS,
  SEED_CORE_VALUES,
  SEED_GALLERY,
  SEED_HERO_SLIDES,
  SEED_INQUIRIES,
  SEED_MP_PROFILE,
  SEED_NEWS,
  SEED_PROJECTS,
  SEED_QUICK_STATS,
  SEED_SUBSCRIBERS,
  SEED_TIMELINE,
} from '../data/seedData';
import type {
  BlogPostRow,
  ContactInquiryRow,
  CoreValueRow,
  GalleryItemRow,
  HeroSlideRow,
  InquiryStatus,
  MpProfileRow,
  NewsArticleRow,
  NewsletterSubscriberRow,
  ProjectRow,
  QuickStatRow,
  TimelineMilestoneRow,
} from '../types/database';
import { CmsContext, type CmsSnapshot } from './cmsContext';
import { supabase } from './supabase';
import { generateUuid } from './utils';

const STORAGE_KEY = 'hon_sawyerr_secretariat_cms_v1';

function getInitialLocalSnapshot(): CmsSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CmsSnapshot>;
      return {
        mpProfile: parsed.mpProfile ?? SEED_MP_PROFILE,
        heroSlides: parsed.heroSlides ?? SEED_HERO_SLIDES,
        quickStats: parsed.quickStats ?? SEED_QUICK_STATS,
        coreValues: parsed.coreValues ?? SEED_CORE_VALUES,
        timelineMilestones: parsed.timelineMilestones ?? SEED_TIMELINE,
        projects: parsed.projects ?? SEED_PROJECTS,
        newsArticles: parsed.newsArticles ?? SEED_NEWS,
        blogPosts: parsed.blogPosts ?? SEED_BLOG_POSTS,
        galleryItems: parsed.galleryItems ?? SEED_GALLERY,
        contactInquiries: parsed.contactInquiries ?? SEED_INQUIRIES,
        newsletterSubscribers: parsed.newsletterSubscribers ?? SEED_SUBSCRIBERS,
      };
    }
  } catch {
    // Fallback to seed data if storage is unavailable
  }
  return {
    mpProfile: SEED_MP_PROFILE,
    heroSlides: SEED_HERO_SLIDES,
    quickStats: SEED_QUICK_STATS,
    coreValues: SEED_CORE_VALUES,
    timelineMilestones: SEED_TIMELINE,
    projects: SEED_PROJECTS,
    newsArticles: SEED_NEWS,
    blogPosts: SEED_BLOG_POSTS,
    galleryItems: SEED_GALLERY,
    contactInquiries: SEED_INQUIRIES,
    newsletterSubscribers: SEED_SUBSCRIBERS,
  };
}

export const CmsProvider: React.FC<{
  isLiveMode: boolean;
  children: React.ReactNode;
}> = ({ isLiveMode, children }) => {
  const [data, setData] = useState<CmsSnapshot>(getInitialLocalSnapshot);
  const [loading, setLoading] = useState<boolean>(isLiveMode);

  const persistLocal = useCallback((next: CmsSnapshot) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const updateLocal = useCallback(
    (updater: (prev: CmsSnapshot) => CmsSnapshot) => {
      setData((prev) => {
        const next = updater(prev);
        if (!isLiveMode) {
          persistLocal(next);
        }
        return next;
      });
    },
    [isLiveMode, persistLocal]
  );

  const fetchLiveSnapshot = useCallback(async (): Promise<CmsSnapshot> => {
    if (!supabase) return getInitialLocalSnapshot();
    const [
      profileRes,
      heroRes,
      statsRes,
      valuesRes,
      timelineRes,
      projectsRes,
      newsRes,
      blogRes,
      galleryRes,
      inquiriesRes,
      subscribersRes,
    ] = await Promise.all([
      supabase.from('mp_profile').select('*').limit(1).maybeSingle(),
      supabase.from('hero_slides').select('*').order('sort_order', { ascending: true }),
      supabase.from('quick_stats').select('*').order('sort_order', { ascending: true }),
      supabase.from('core_values').select('*').order('sort_order', { ascending: true }),
      supabase.from('timeline_milestones').select('*').order('sort_order', { ascending: true }),
      supabase.from('projects').select('*').order('is_flagship', { ascending: false }).order('sort_order', { ascending: true }),
      supabase.from('news_articles').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('blog_posts').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('gallery_items').select('*').order('sort_order', { ascending: true }),
      supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
    ]);

    return {
      mpProfile: (profileRes.data as MpProfileRow | null) ?? SEED_MP_PROFILE,
      heroSlides: (heroRes.data as HeroSlideRow[] | null) ?? [],
      quickStats: (statsRes.data as QuickStatRow[] | null) ?? [],
      coreValues: (valuesRes.data as CoreValueRow[] | null) ?? [],
      timelineMilestones: (timelineRes.data as TimelineMilestoneRow[] | null) ?? [],
      projects: (projectsRes.data as ProjectRow[] | null) ?? [],
      newsArticles: (newsRes.data as NewsArticleRow[] | null) ?? [],
      blogPosts: (blogRes.data as BlogPostRow[] | null) ?? [],
      galleryItems: (galleryRes.data as GalleryItemRow[] | null) ?? [],
      contactInquiries: (inquiriesRes.data as ContactInquiryRow[] | null) ?? [],
      newsletterSubscribers: (subscribersRes.data as NewsletterSubscriberRow[] | null) ?? [],
    };
  }, []);

  const refreshAll = useCallback(async () => {
    if (!isLiveMode || !supabase) {
      setData(getInitialLocalSnapshot());
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const next = await fetchLiveSnapshot();
      setData(next);
    } finally {
      setLoading(false);
    }
  }, [isLiveMode, fetchLiveSnapshot]);

  useEffect(() => {
    if (!isLiveMode || !supabase) return;
    let mounted = true;
    void fetchLiveSnapshot()
      .then((next) => {
        if (mounted) setData(next);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [isLiveMode, fetchLiveSnapshot]);

  // --------------------------------------------------------------------------
  // MP PROFILE
  // --------------------------------------------------------------------------
  const saveMpProfile = useCallback(
    async (profile: MpProfileRow) => {
      const payload = { ...profile, updated_at: new Date().toISOString() };
      if (isLiveMode && supabase) {
        const { error, data: saved } = await supabase
          .from('mp_profile')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);
        updateLocal((prev) => ({ ...prev, mpProfile: saved as MpProfileRow }));
        return;
      }
      updateLocal((prev) => ({ ...prev, mpProfile: payload }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // HERO SLIDES
  // --------------------------------------------------------------------------
  const upsertHeroSlide = useCallback(
    async (slide: Omit<HeroSlideRow, 'updated_at'>) => {
      const now = new Date().toISOString();
      const id = slide.id || generateUuid();
      const payload: HeroSlideRow = { ...slide, id, updated_at: now };

      if (isLiveMode && supabase) {
        const { error, data: saved } = await supabase
          .from('hero_slides')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);
        updateLocal((prev) => {
          const exists = prev.heroSlides.some((s) => s.id === id);
          const nextSlides = exists
            ? prev.heroSlides.map((s) => (s.id === id ? (saved as HeroSlideRow) : s))
            : [...prev.heroSlides, saved as HeroSlideRow];
          nextSlides.sort((a, b) => a.sort_order - b.sort_order);
          return { ...prev, heroSlides: nextSlides };
        });
        return;
      }

      updateLocal((prev) => {
        const exists = prev.heroSlides.some((s) => s.id === id);
        const nextSlides = exists
          ? prev.heroSlides.map((s) => (s.id === id ? payload : s))
          : [...prev.heroSlides, payload];
        nextSlides.sort((a, b) => a.sort_order - b.sort_order);
        return { ...prev, heroSlides: nextSlides };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteHeroSlide = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        heroSlides: prev.heroSlides.filter((s) => s.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const reorderHeroSlides = useCallback(
    async (ordered: HeroSlideRow[]) => {
      const reindexed = ordered.map((s, idx) => ({ ...s, sort_order: idx + 1 }));
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('hero_slides').upsert(reindexed);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({ ...prev, heroSlides: reindexed }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // QUICK STATS
  // --------------------------------------------------------------------------
  const saveQuickStat = useCallback(
    async (stat: QuickStatRow) => {
      const id = stat.id || generateUuid();
      const payload = { ...stat, id };
      if (isLiveMode && supabase) {
        const { error, data: saved } = await supabase
          .from('quick_stats')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);
        updateLocal((prev) => ({
          ...prev,
          quickStats: prev.quickStats.map((q) => (q.id === id ? (saved as QuickStatRow) : q)),
        }));
        return;
      }
      updateLocal((prev) => ({
        ...prev,
        quickStats: prev.quickStats.map((q) => (q.id === id ? payload : q)),
      }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // CORE VALUES
  // --------------------------------------------------------------------------
  const upsertCoreValue = useCallback(
    async (value: CoreValueRow) => {
      const id = value.id || generateUuid();
      const payload = { ...value, id };
      if (isLiveMode && supabase) {
        const { error, data: saved } = await supabase
          .from('core_values')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);
        updateLocal((prev) => {
          const exists = prev.coreValues.some((v) => v.id === id);
          const next = exists
            ? prev.coreValues.map((v) => (v.id === id ? (saved as CoreValueRow) : v))
            : [...prev.coreValues, saved as CoreValueRow];
          next.sort((a, b) => a.sort_order - b.sort_order);
          return { ...prev, coreValues: next };
        });
        return;
      }
      updateLocal((prev) => {
        const exists = prev.coreValues.some((v) => v.id === id);
        const next = exists
          ? prev.coreValues.map((v) => (v.id === id ? payload : v))
          : [...prev.coreValues, payload];
        next.sort((a, b) => a.sort_order - b.sort_order);
        return { ...prev, coreValues: next };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteCoreValue = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('core_values').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        coreValues: prev.coreValues.filter((v) => v.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const reorderCoreValues = useCallback(
    async (ordered: CoreValueRow[]) => {
      const reindexed = ordered.map((v, idx) => ({ ...v, sort_order: idx + 1 }));
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('core_values').upsert(reindexed);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({ ...prev, coreValues: reindexed }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // TIMELINE MILESTONES
  // --------------------------------------------------------------------------
  const upsertTimelineMilestone = useCallback(
    async (milestone: TimelineMilestoneRow) => {
      const id = milestone.id || generateUuid();
      const payload = { ...milestone, id };
      if (isLiveMode && supabase) {
        const { error, data: saved } = await supabase
          .from('timeline_milestones')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);
        updateLocal((prev) => {
          const exists = prev.timelineMilestones.some((m) => m.id === id);
          const next = exists
            ? prev.timelineMilestones.map((m) =>
                m.id === id ? (saved as TimelineMilestoneRow) : m
              )
            : [...prev.timelineMilestones, saved as TimelineMilestoneRow];
          next.sort((a, b) => a.sort_order - b.sort_order);
          return { ...prev, timelineMilestones: next };
        });
        return;
      }
      updateLocal((prev) => {
        const exists = prev.timelineMilestones.some((m) => m.id === id);
        const next = exists
          ? prev.timelineMilestones.map((m) => (m.id === id ? payload : m))
          : [...prev.timelineMilestones, payload];
        next.sort((a, b) => a.sort_order - b.sort_order);
        return { ...prev, timelineMilestones: next };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteTimelineMilestone = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('timeline_milestones').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        timelineMilestones: prev.timelineMilestones.filter((m) => m.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const reorderTimelineMilestones = useCallback(
    async (ordered: TimelineMilestoneRow[]) => {
      const reindexed = ordered.map((m, idx) => ({ ...m, sort_order: idx + 1 }));
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('timeline_milestones').upsert(reindexed);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({ ...prev, timelineMilestones: reindexed }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // PROJECTS
  // --------------------------------------------------------------------------
  const upsertProject = useCallback(
    async (
      project: Omit<ProjectRow, 'created_at' | 'updated_at'> & { created_at?: string }
    ) => {
      const now = new Date().toISOString();
      const id = project.id || generateUuid();
      const payload: ProjectRow = {
        ...project,
        id,
        created_at: project.created_at ?? now,
        updated_at: now,
      };

      if (isLiveMode && supabase) {
        if (payload.is_flagship) {
          await supabase.from('projects').update({ is_flagship: false }).neq('id', id);
        }
        const { error, data: saved } = await supabase
          .from('projects')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);

        updateLocal((prev) => {
          const base = payload.is_flagship
            ? prev.projects.map((p) => ({ ...p, is_flagship: false }))
            : prev.projects;
          const exists = base.some((p) => p.id === id);
          const next = exists
            ? base.map((p) => (p.id === id ? (saved as ProjectRow) : p))
            : [saved as ProjectRow, ...base];
          next.sort((a, b) => Number(b.is_flagship) - Number(a.is_flagship) || a.sort_order - b.sort_order);
          return { ...prev, projects: next };
        });
        return;
      }

      updateLocal((prev) => {
        const base = payload.is_flagship
          ? prev.projects.map((p) => ({ ...p, is_flagship: false }))
          : prev.projects;
        const exists = base.some((p) => p.id === id);
        const next = exists
          ? base.map((p) => (p.id === id ? payload : p))
          : [payload, ...base];
        next.sort((a, b) => Number(b.is_flagship) - Number(a.is_flagship) || a.sort_order - b.sort_order);
        return { ...prev, projects: next };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const setFlagshipProject = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error: clearErr } = await supabase
          .from('projects')
          .update({ is_flagship: false })
          .neq('id', id);
        if (clearErr) throw new Error(clearErr.message);
        const { error: setErr } = await supabase
          .from('projects')
          .update({ is_flagship: true })
          .eq('id', id);
        if (setErr) throw new Error(setErr.message);
      }
      updateLocal((prev) => ({
        ...prev,
        projects: prev.projects
          .map((p) => ({ ...p, is_flagship: p.id === id }))
          .sort((a, b) => Number(b.is_flagship) - Number(a.is_flagship) || a.sort_order - b.sort_order),
      }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // NEWS ARTICLES
  // --------------------------------------------------------------------------
  const upsertNewsArticle = useCallback(
    async (
      article: Omit<NewsArticleRow, 'created_at' | 'updated_at'> & { created_at?: string }
    ) => {
      const now = new Date().toISOString();
      const id = article.id || generateUuid();
      const payload: NewsArticleRow = {
        ...article,
        id,
        created_at: article.created_at ?? now,
        updated_at: now,
      };

      if (isLiveMode && supabase) {
        if (payload.featured) {
          await supabase.from('news_articles').update({ featured: false }).neq('id', id);
        }
        const { error, data: saved } = await supabase
          .from('news_articles')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);

        updateLocal((prev) => {
          const base = payload.featured
            ? prev.newsArticles.map((n) => ({ ...n, featured: false }))
            : prev.newsArticles;
          const exists = base.some((n) => n.id === id);
          const next = exists
            ? base.map((n) => (n.id === id ? (saved as NewsArticleRow) : n))
            : [saved as NewsArticleRow, ...base];
          return { ...prev, newsArticles: next };
        });
        return;
      }

      updateLocal((prev) => {
        const base = payload.featured
          ? prev.newsArticles.map((n) => ({ ...n, featured: false }))
          : prev.newsArticles;
        const exists = base.some((n) => n.id === id);
        const next = exists
          ? base.map((n) => (n.id === id ? payload : n))
          : [payload, ...base];
        return { ...prev, newsArticles: next };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteNewsArticle = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('news_articles').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        newsArticles: prev.newsArticles.filter((n) => n.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const setFeaturedNewsArticle = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error: clearErr } = await supabase
          .from('news_articles')
          .update({ featured: false })
          .neq('id', id);
        if (clearErr) throw new Error(clearErr.message);
        const { error: setErr } = await supabase
          .from('news_articles')
          .update({ featured: true })
          .eq('id', id);
        if (setErr) throw new Error(setErr.message);
      }
      updateLocal((prev) => ({
        ...prev,
        newsArticles: prev.newsArticles.map((n) => ({ ...n, featured: n.id === id })),
      }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // BLOG POSTS (The MP's Notebook)
  // --------------------------------------------------------------------------
  const upsertBlogPost = useCallback(
    async (
      post: Omit<BlogPostRow, 'created_at' | 'updated_at'> & { created_at?: string }
    ) => {
      const now = new Date().toISOString();
      const id = post.id || generateUuid();
      const payload: BlogPostRow = {
        ...post,
        id,
        created_at: post.created_at ?? now,
        updated_at: now,
      };

      if (isLiveMode && supabase) {
        if (payload.featured) {
          await supabase.from('blog_posts').update({ featured: false }).neq('id', id);
        }
        const { error, data: saved } = await supabase
          .from('blog_posts')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);

        updateLocal((prev) => {
          const base = payload.featured
            ? prev.blogPosts.map((b) => ({ ...b, featured: false }))
            : prev.blogPosts;
          const exists = base.some((b) => b.id === id);
          const next = exists
            ? base.map((b) => (b.id === id ? (saved as BlogPostRow) : b))
            : [saved as BlogPostRow, ...base];
          return { ...prev, blogPosts: next };
        });
        return;
      }

      updateLocal((prev) => {
        const base = payload.featured
          ? prev.blogPosts.map((b) => ({ ...b, featured: false }))
          : prev.blogPosts;
        const exists = base.some((b) => b.id === id);
        const next = exists
          ? base.map((b) => (b.id === id ? payload : b))
          : [payload, ...base];
        return { ...prev, blogPosts: next };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteBlogPost = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        blogPosts: prev.blogPosts.filter((b) => b.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const setFeaturedBlogPost = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error: clearErr } = await supabase
          .from('blog_posts')
          .update({ featured: false })
          .neq('id', id);
        if (clearErr) throw new Error(clearErr.message);
        const { error: setErr } = await supabase
          .from('blog_posts')
          .update({ featured: true })
          .eq('id', id);
        if (setErr) throw new Error(setErr.message);
      }
      updateLocal((prev) => ({
        ...prev,
        blogPosts: prev.blogPosts.map((b) => ({ ...b, featured: b.id === id })),
      }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // GALLERY ITEMS
  // --------------------------------------------------------------------------
  const upsertGalleryItem = useCallback(
    async (item: Omit<GalleryItemRow, 'created_at'> & { created_at?: string }) => {
      const now = new Date().toISOString();
      const id = item.id || generateUuid();
      const payload: GalleryItemRow = {
        ...item,
        id,
        created_at: item.created_at ?? now,
      };

      if (isLiveMode && supabase) {
        const { error, data: saved } = await supabase
          .from('gallery_items')
          .upsert(payload)
          .select()
          .single();
        if (error) throw new Error(error.message);
        updateLocal((prev) => {
          const exists = prev.galleryItems.some((g) => g.id === id);
          const next = exists
            ? prev.galleryItems.map((g) => (g.id === id ? (saved as GalleryItemRow) : g))
            : [...prev.galleryItems, saved as GalleryItemRow];
          next.sort((a, b) => a.sort_order - b.sort_order);
          return { ...prev, galleryItems: next };
        });
        return;
      }

      updateLocal((prev) => {
        const exists = prev.galleryItems.some((g) => g.id === id);
        const next = exists
          ? prev.galleryItems.map((g) => (g.id === id ? payload : g))
          : [...prev.galleryItems, payload];
        next.sort((a, b) => a.sort_order - b.sort_order);
        return { ...prev, galleryItems: next };
      });
    },
    [isLiveMode, updateLocal]
  );

  const deleteGalleryItem = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('gallery_items').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        galleryItems: prev.galleryItems.filter((g) => g.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const reorderGalleryItems = useCallback(
    async (ordered: GalleryItemRow[]) => {
      const reindexed = ordered.map((g, idx) => ({ ...g, sort_order: idx + 1 }));
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('gallery_items').upsert(reindexed);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({ ...prev, galleryItems: reindexed }));
    },
    [isLiveMode, updateLocal]
  );

  // --------------------------------------------------------------------------
  // CONTACT INQUIRIES & SUBSCRIBERS
  // --------------------------------------------------------------------------
  const updateInquiry = useCallback(
    async (id: string, status: InquiryStatus, internalNotes: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase
          .from('contact_inquiries')
          .update({ status, internal_notes: internalNotes })
          .eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        contactInquiries: prev.contactInquiries.map((inq) =>
          inq.id === id ? { ...inq, status, internal_notes: internalNotes } : inq
        ),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const deleteInquiry = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        contactInquiries: prev.contactInquiries.filter((inq) => inq.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  const deleteSubscriber = useCallback(
    async (id: string) => {
      if (isLiveMode && supabase) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('id', id);
        if (error) throw new Error(error.message);
      }
      updateLocal((prev) => ({
        ...prev,
        newsletterSubscribers: prev.newsletterSubscribers.filter((sub) => sub.id !== id),
      }));
    },
    [isLiveMode, updateLocal]
  );

  return (
    <CmsContext.Provider
      value={{
        data,
        loading,
        isLiveMode,
        refreshAll,
        saveMpProfile,
        upsertHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        saveQuickStat,
        upsertCoreValue,
        deleteCoreValue,
        reorderCoreValues,
        upsertTimelineMilestone,
        deleteTimelineMilestone,
        reorderTimelineMilestones,
        upsertProject,
        deleteProject,
        setFlagshipProject,
        upsertNewsArticle,
        deleteNewsArticle,
        setFeaturedNewsArticle,
        upsertBlogPost,
        deleteBlogPost,
        setFeaturedBlogPost,
        upsertGalleryItem,
        deleteGalleryItem,
        reorderGalleryItems,
        updateInquiry,
        deleteInquiry,
        deleteSubscriber,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

