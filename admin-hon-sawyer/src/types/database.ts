// ============================================================================
// SHARED DATABASE & EDITORIAL TYPES
// Mirrors hon-sawyer/src/types/index.ts and supabase/schema.sql 1:1
// ============================================================================

export type ProjectCategory =
  | 'Education'
  | 'Healthcare'
  | 'Women & Economy'
  | 'Infrastructure'
  | 'Youth & Skills';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Education',
  'Healthcare',
  'Women & Economy',
  'Infrastructure',
  'Youth & Skills',
];

export type NewsCategory =
  | 'Press Release'
  | 'Education'
  | 'Healthcare'
  | 'Parliament'
  | 'Community';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'Press Release',
  'Education',
  'Healthcare',
  'Parliament',
  'Community',
];

export type BlogCategory =
  | 'Legislative Insights'
  | 'Rural Development'
  | 'Education & Youth'
  | 'Women Empowerment'
  | 'Community Reflections';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Legislative Insights',
  'Rural Development',
  'Education & Youth',
  'Women Empowerment',
  'Community Reflections',
];

export type GalleryCategory =
  | 'Community'
  | 'Education'
  | 'Parliament'
  | 'Healthcare'
  | 'Festivals';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Community',
  'Education',
  'Parliament',
  'Healthcare',
  'Festivals',
];

export type CoreValueIconName =
  | 'heart'
  | 'book'
  | 'shield'
  | 'users'
  | 'trending-up'
  | 'scale';

export const CORE_VALUE_ICONS: { value: CoreValueIconName; label: string }[] = [
  { value: 'heart', label: 'Compassion / Heart' },
  { value: 'book', label: 'Education / Book' },
  { value: 'trending-up', label: 'Economic Growth' },
  { value: 'shield', label: 'Integrity / Shield' },
  { value: 'users', label: 'Community / Users' },
  { value: 'scale', label: 'Justice / Scale' },
];

export type HeroSlideType = 'landscape' | 'paired-portrait';
export type HeroBadgeColor = 'green' | 'red';
export type BlogStatus = 'draft' | 'published';
export type InquiryStatus = 'new' | 'in_review' | 'resolved';
export type SubscriberSource = 'blog' | 'footer';

export const INQUIRY_CATEGORIES = [
  'Constituent Assistance',
  'Community Project Suggestion',
  'Women Micro-Grant Inquiry',
  'BECE / School Support',
  'Media & Press Interview',
  'Other Inquiries',
] as const;

export type MediaFolder = 'hero' | 'projects' | 'news' | 'blog' | 'gallery' | 'profile';

// ----------------------------------------------------------------------------
// 1. PostgreSQL Row Types (snake_case)
// ----------------------------------------------------------------------------

export interface SocialLinks {
  facebook: string;
  x: string;
  instagram: string;
  youtube: string;
}

export interface MpProfileRow {
  id: string;
  full_name: string;
  short_name: string;
  popular_title: string;
  slogan: string;
  hero_tagline: string;
  role: string;
  party: string;
  constituency: string;
  region: string;
  tenure: string;
  parliament_email: string;
  office_email: string;
  constituency_phone: string;
  hotline_phone: string;
  office_address: string;
  parliament_address: string;
  portrait_hero_url: string;
  portrait_about_url: string;
  portrait_community_url: string;
  about_quote: string;
  social_links: SocialLinks;
  constituency_towns: string[];
  updated_at: string;
}

export interface HeroPortraitItem {
  src: string;
  caption: string;
}

export interface HeroSlideRow {
  id: string;
  sort_order: number;
  is_active: boolean;
  type: HeroSlideType;
  tag: string;
  badge_color: HeroBadgeColor;
  title: string;
  title_highlight: string;
  description: string;
  landscape_image: string | null;
  portrait_images: HeroPortraitItem[] | null;
  updated_at: string;
}

export interface QuickStatRow {
  id: string;
  sort_order: number;
  value: string;
  label: string;
  subtext: string;
}

export interface CoreValueRow {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  icon_name: CoreValueIconName;
}

export interface TimelineMilestoneRow {
  id: string;
  sort_order: number;
  year: string;
  title: string;
  role: string;
  description: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: ProjectCategory;
  impact_metric: string;
  image: string;
  completion_year: string;
  location: string;
  beneficiaries_count: string;
  full_description: string;
  key_highlights: string[];
  gallery_images: string[];
  testimonial: ProjectTestimonial | null;
  is_flagship: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleRow {
  id: string;
  slug: string;
  title: string;
  published_date: string;
  category: NewsCategory;
  read_time: string;
  thumbnail: string;
  excerpt: string;
  content: string[];
  featured: boolean;
  author: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  publish_date: string;
  read_time: string;
  cover_image: string;
  excerpt: string;
  content: string[];
  featured: boolean;
  author_name: string;
  author_role: string;
  author_avatar: string | null;
  featured_quote: string | null;
  tags: string[];
  status: BlogStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryItemRow {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  date: string;
  location: string;
  caption: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface ContactInquiryRow {
  id: string;
  reference_number: string;
  full_name: string;
  email: string;
  phone: string;
  town: string;
  category: string;
  message: string;
  volunteer: boolean;
  status: InquiryStatus;
  internal_notes: string;
  created_at: string;
}

export interface NewsletterSubscriberRow {
  id: string;
  email: string;
  source: SubscriberSource;
  subscribed_at: string;
}

// ----------------------------------------------------------------------------
// 2. Public Site Mirrored TypeScript Contracts (hon-sawyer/src/types/index.ts)
// ----------------------------------------------------------------------------

export interface PublicProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  impactMetric: string;
  image: string;
  completionYear: string;
  location: string;
  beneficiariesCount: string;
  fullDescription: string;
  keyHighlights: string[];
  galleryImages: string[];
  testimonial?: ProjectTestimonial;
}

export interface PublicNewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  readTime: string;
  thumbnail: string;
  excerpt: string;
  content: string[];
  featured?: boolean;
  author: string;
  tags: string[];
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  publishDate: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  featuredQuote?: string;
  tags: string[];
}

export interface PublicGalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  date: string;
  location: string;
  caption: string;
}

export interface PublicCoreValue {
  title: string;
  description: string;
  iconName: CoreValueIconName;
}

export interface PublicTimelineMilestone {
  year: string;
  title: string;
  role: string;
  description: string;
}

// ----------------------------------------------------------------------------
// 3. Bidirectional Mappers (DB snake_case <-> Public Site camelCase)
// ----------------------------------------------------------------------------

export function mapProjectRowToPublic(row: ProjectRow): PublicProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    category: row.category,
    impactMetric: row.impact_metric,
    image: row.image,
    completionYear: row.completion_year,
    location: row.location,
    beneficiariesCount: row.beneficiaries_count,
    fullDescription: row.full_description,
    keyHighlights: row.key_highlights ?? [],
    galleryImages: row.gallery_images ?? [],
    testimonial: row.testimonial ?? undefined,
  };
}

export function mapNewsRowToPublic(row: NewsArticleRow): PublicNewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.published_date,
    category: row.category,
    readTime: row.read_time,
    thumbnail: row.thumbnail,
    excerpt: row.excerpt,
    content: row.content ?? [],
    featured: row.featured,
    author: row.author,
    tags: row.tags ?? [],
  };
}

export function mapBlogRowToPublic(row: BlogPostRow): PublicBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    publishDate: row.publish_date,
    readTime: row.read_time,
    coverImage: row.cover_image,
    excerpt: row.excerpt,
    content: row.content ?? [],
    featured: row.featured,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatar: row.author_avatar ?? undefined,
    },
    featuredQuote: row.featured_quote ?? undefined,
    tags: row.tags ?? [],
  };
}

export type AdminRoute =
  | 'dashboard'
  | 'hero'
  | 'about-profile'
  | 'projects'
  | 'news'
  | 'blog'
  | 'gallery'
  | 'inquiries';
