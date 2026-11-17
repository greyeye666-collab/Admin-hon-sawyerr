import { createContext, useContext } from 'react';
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

export interface CmsSnapshot {
  mpProfile: MpProfileRow;
  heroSlides: HeroSlideRow[];
  quickStats: QuickStatRow[];
  coreValues: CoreValueRow[];
  timelineMilestones: TimelineMilestoneRow[];
  projects: ProjectRow[];
  newsArticles: NewsArticleRow[];
  blogPosts: BlogPostRow[];
  galleryItems: GalleryItemRow[];
  contactInquiries: ContactInquiryRow[];
  newsletterSubscribers: NewsletterSubscriberRow[];
}

export interface CmsContextValue {
  data: CmsSnapshot;
  loading: boolean;
  isLiveMode: boolean;
  refreshAll: () => Promise<void>;
  saveMpProfile: (profile: MpProfileRow) => Promise<void>;
  upsertHeroSlide: (slide: Omit<HeroSlideRow, 'updated_at'>) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  reorderHeroSlides: (ordered: HeroSlideRow[]) => Promise<void>;
  saveQuickStat: (stat: QuickStatRow) => Promise<void>;
  upsertCoreValue: (value: CoreValueRow) => Promise<void>;
  deleteCoreValue: (id: string) => Promise<void>;
  reorderCoreValues: (ordered: CoreValueRow[]) => Promise<void>;
  upsertTimelineMilestone: (milestone: TimelineMilestoneRow) => Promise<void>;
  deleteTimelineMilestone: (id: string) => Promise<void>;
  reorderTimelineMilestones: (ordered: TimelineMilestoneRow[]) => Promise<void>;
  upsertProject: (
    project: Omit<ProjectRow, 'created_at' | 'updated_at'> & { created_at?: string }
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setFlagshipProject: (id: string) => Promise<void>;
  upsertNewsArticle: (
    article: Omit<NewsArticleRow, 'created_at' | 'updated_at'> & { created_at?: string }
  ) => Promise<void>;
  deleteNewsArticle: (id: string) => Promise<void>;
  setFeaturedNewsArticle: (id: string) => Promise<void>;
  upsertBlogPost: (
    post: Omit<BlogPostRow, 'created_at' | 'updated_at'> & { created_at?: string }
  ) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  setFeaturedBlogPost: (id: string) => Promise<void>;
  upsertGalleryItem: (
    item: Omit<GalleryItemRow, 'created_at'> & { created_at?: string }
  ) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  reorderGalleryItems: (ordered: GalleryItemRow[]) => Promise<void>;
  updateInquiry: (
    id: string,
    status: InquiryStatus,
    internalNotes: string
  ) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
}

export const CmsContext = createContext<CmsContextValue | null>(null);

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used inside CmsProvider');
  return ctx;
}
