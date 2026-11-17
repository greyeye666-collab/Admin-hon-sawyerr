-- ============================================================================
-- OFFICIAL EDITORIAL CMS & PUBLIC WEBSITE SHARED DATABASE SCHEMA
-- Hon. Queenstar Maame Pokua Sawyerr — Member of Parliament, Agona East
-- ============================================================================
-- Run this file once in the Supabase SQL Editor (or via supabase db query).
-- Then run supabase/seed.sql to populate initial institutional content.
-- ============================================================================

-- Extensions
create extension if not exists pgcrypto;

-- Private schema for internal authorization helpers (not exposed via Data API)
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- ----------------------------------------------------------------------------
-- 1. STAFF AUTHORIZATION TABLE & HELPER
-- ----------------------------------------------------------------------------
create table if not exists public.secretariat_staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role text not null default 'secretariat' check (role in ('admin', 'secretariat', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.secretariat_staff enable row level security;

-- Helper function: verifies user is authenticated AND authorized either via
-- JWT app_metadata.role OR an active row in public.secretariat_staff.
create or replace function private.is_secretariat_staff()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    auth.uid() is not null
    and (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'secretariat', 'editor')
      or exists (
        select 1
        from public.secretariat_staff s
        where (s.user_id = auth.uid() or lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
          and s.is_active = true
      )
    );
$$;

revoke all on function private.is_secretariat_staff() from public;
grant execute on function private.is_secretariat_staff() to authenticated;

drop policy if exists "Secretariat staff can read staff directory" on public.secretariat_staff;
drop policy if exists "Admins can manage staff directory" on public.secretariat_staff;
drop policy if exists "Staff can insert staff directory" on public.secretariat_staff;
drop policy if exists "Staff can update staff directory" on public.secretariat_staff;
drop policy if exists "Staff can delete staff directory" on public.secretariat_staff;

create policy "Secretariat staff can read staff directory"
  on public.secretariat_staff for select
  to authenticated
  using (private.is_secretariat_staff() or user_id = (select auth.uid()));

create policy "Staff can insert staff directory"
  on public.secretariat_staff for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update staff directory"
  on public.secretariat_staff for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete staff directory"
  on public.secretariat_staff for delete
  to authenticated
  using (private.is_secretariat_staff());

-- Shared updated_at trigger function (pinned search_path)
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. MP PROFILE (Single-row global configuration for MP_DETAILS & Contact)
-- ----------------------------------------------------------------------------
create table if not exists public.mp_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  short_name text not null,
  popular_title text not null,
  slogan text not null,
  hero_tagline text not null,
  role text not null,
  party text not null,
  constituency text not null,
  region text not null,
  tenure text not null,
  parliament_email text not null,
  office_email text not null,
  constituency_phone text not null,
  hotline_phone text not null,
  office_address text not null,
  parliament_address text not null,
  portrait_hero_url text not null default '',
  portrait_about_url text not null default '',
  portrait_community_url text not null default '',
  about_quote text not null default '',
  social_links jsonb not null default '{"facebook":"","x":"","instagram":"","youtube":""}'::jsonb,
  constituency_towns text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_mp_profile_updated_at on public.mp_profile;
create trigger trg_mp_profile_updated_at
  before update on public.mp_profile
  for each row execute function private.set_updated_at();

alter table public.mp_profile enable row level security;

drop policy if exists "Public can read MP profile" on public.mp_profile;
drop policy if exists "Secretariat staff can manage MP profile" on public.mp_profile;
drop policy if exists "Staff can insert MP profile" on public.mp_profile;
drop policy if exists "Staff can update MP profile" on public.mp_profile;
drop policy if exists "Staff can delete MP profile" on public.mp_profile;

create policy "Public can read MP profile"
  on public.mp_profile for select
  to anon, authenticated
  using (true);

create policy "Staff can insert MP profile"
  on public.mp_profile for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update MP profile"
  on public.mp_profile for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete MP profile"
  on public.mp_profile for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 3. HERO SLIDES
-- ----------------------------------------------------------------------------
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  is_active boolean not null default true,
  type text not null check (type in ('landscape', 'paired-portrait')),
  tag text not null,
  badge_color text not null default 'green' check (badge_color in ('green', 'red')),
  title text not null,
  title_highlight text not null,
  description text not null,
  landscape_image text,
  portrait_images jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_hero_slides_order
  on public.hero_slides (is_active, sort_order);

drop trigger if exists trg_hero_slides_updated_at on public.hero_slides;
create trigger trg_hero_slides_updated_at
  before update on public.hero_slides
  for each row execute function private.set_updated_at();

alter table public.hero_slides enable row level security;

drop policy if exists "Public can read active hero slides" on public.hero_slides;
drop policy if exists "Secretariat staff can read all hero slides" on public.hero_slides;
drop policy if exists "Secretariat staff can manage hero slides" on public.hero_slides;
drop policy if exists "Staff can insert hero slides" on public.hero_slides;
drop policy if exists "Staff can update hero slides" on public.hero_slides;
drop policy if exists "Staff can delete hero slides" on public.hero_slides;

create policy "Public can read active hero slides"
  on public.hero_slides for select
  to anon
  using (is_active = true);

create policy "Secretariat staff can read all hero slides"
  on public.hero_slides for select
  to authenticated
  using (private.is_secretariat_staff() or is_active = true);

create policy "Staff can insert hero slides"
  on public.hero_slides for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update hero slides"
  on public.hero_slides for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete hero slides"
  on public.hero_slides for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 4. QUICK STATS (4-column Stats Bar)
-- ----------------------------------------------------------------------------
create table if not exists public.quick_stats (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  value text not null,
  label text not null,
  subtext text not null
);

create index if not exists idx_quick_stats_order on public.quick_stats (sort_order);

alter table public.quick_stats enable row level security;

drop policy if exists "Public can read quick stats" on public.quick_stats;
drop policy if exists "Secretariat staff can manage quick stats" on public.quick_stats;
drop policy if exists "Staff can insert quick stats" on public.quick_stats;
drop policy if exists "Staff can update quick stats" on public.quick_stats;
drop policy if exists "Staff can delete quick stats" on public.quick_stats;

create policy "Public can read quick stats"
  on public.quick_stats for select
  to anon, authenticated
  using (true);

create policy "Staff can insert quick stats"
  on public.quick_stats for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update quick stats"
  on public.quick_stats for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete quick stats"
  on public.quick_stats for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 5. CORE VALUES
-- ----------------------------------------------------------------------------
create table if not exists public.core_values (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  description text not null,
  icon_name text not null check (icon_name in ('heart', 'book', 'shield', 'users', 'trending-up', 'scale'))
);

create index if not exists idx_core_values_order on public.core_values (sort_order);

alter table public.core_values enable row level security;

drop policy if exists "Public can read core values" on public.core_values;
drop policy if exists "Secretariat staff can manage core values" on public.core_values;
drop policy if exists "Staff can insert core values" on public.core_values;
drop policy if exists "Staff can update core values" on public.core_values;
drop policy if exists "Staff can delete core values" on public.core_values;

create policy "Public can read core values"
  on public.core_values for select
  to anon, authenticated
  using (true);

create policy "Staff can insert core values"
  on public.core_values for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update core values"
  on public.core_values for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete core values"
  on public.core_values for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 6. TIMELINE MILESTONES
-- ----------------------------------------------------------------------------
create table if not exists public.timeline_milestones (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  year text not null,
  title text not null,
  role text not null,
  description text not null
);

create index if not exists idx_timeline_milestones_order on public.timeline_milestones (sort_order);

alter table public.timeline_milestones enable row level security;

drop policy if exists "Public can read timeline milestones" on public.timeline_milestones;
drop policy if exists "Secretariat staff can manage timeline milestones" on public.timeline_milestones;
drop policy if exists "Staff can insert timeline milestones" on public.timeline_milestones;
drop policy if exists "Staff can update timeline milestones" on public.timeline_milestones;
drop policy if exists "Staff can delete timeline milestones" on public.timeline_milestones;

create policy "Public can read timeline milestones"
  on public.timeline_milestones for select
  to anon, authenticated
  using (true);

create policy "Staff can insert timeline milestones"
  on public.timeline_milestones for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update timeline milestones"
  on public.timeline_milestones for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete timeline milestones"
  on public.timeline_milestones for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 7. PROJECTS (ImpactSection, DedicatedImpactPage & ProjectDetailPage)
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  category text not null check (category in ('Education', 'Healthcare', 'Women & Economy', 'Infrastructure', 'Youth & Skills')),
  impact_metric text not null,
  image text not null,
  completion_year text not null,
  location text not null,
  beneficiaries_count text not null,
  full_description text not null,
  key_highlights text[] not null default '{}'::text[],
  gallery_images text[] not null default '{}'::text[],
  testimonial jsonb,
  is_flagship boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_published_order
  on public.projects (is_published, is_flagship desc, sort_order asc);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function private.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
drop policy if exists "Secretariat staff can read all projects" on public.projects;
drop policy if exists "Secretariat staff can manage projects" on public.projects;
drop policy if exists "Staff can insert projects" on public.projects;
drop policy if exists "Staff can update projects" on public.projects;
drop policy if exists "Staff can delete projects" on public.projects;

create policy "Public can read published projects"
  on public.projects for select
  to anon
  using (is_published = true);

create policy "Secretariat staff can read all projects"
  on public.projects for select
  to authenticated
  using (private.is_secretariat_staff() or is_published = true);

create policy "Staff can insert projects"
  on public.projects for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update projects"
  on public.projects for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete projects"
  on public.projects for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 8. NEWS ARTICLES (NewsSection, DedicatedNewsPage & ArticleDetailPage)
-- ----------------------------------------------------------------------------
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  published_date text not null,
  category text not null check (category in ('Press Release', 'Education', 'Healthcare', 'Parliament', 'Community')),
  read_time text not null,
  thumbnail text not null,
  excerpt text not null,
  content text[] not null default '{}'::text[],
  featured boolean not null default false,
  author text not null,
  tags text[] not null default '{}'::text[],
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_articles_published
  on public.news_articles (is_published, featured desc, created_at desc);

drop trigger if exists trg_news_articles_updated_at on public.news_articles;
create trigger trg_news_articles_updated_at
  before update on public.news_articles
  for each row execute function private.set_updated_at();

alter table public.news_articles enable row level security;

drop policy if exists "Public can read published news articles" on public.news_articles;
drop policy if exists "Secretariat staff can read all news articles" on public.news_articles;
drop policy if exists "Secretariat staff can manage news articles" on public.news_articles;
drop policy if exists "Staff can insert news articles" on public.news_articles;
drop policy if exists "Staff can update news articles" on public.news_articles;
drop policy if exists "Staff can delete news articles" on public.news_articles;

create policy "Public can read published news articles"
  on public.news_articles for select
  to anon
  using (is_published = true);

create policy "Secretariat staff can read all news articles"
  on public.news_articles for select
  to authenticated
  using (private.is_secretariat_staff() or is_published = true);

create policy "Staff can insert news articles"
  on public.news_articles for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update news articles"
  on public.news_articles for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete news articles"
  on public.news_articles for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 9. BLOG POSTS (The MP's Notebook — DedicatedBlogPage & BlogDetailPage)
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text not null check (category in ('Legislative Insights', 'Rural Development', 'Education & Youth', 'Women Empowerment', 'Community Reflections')),
  publish_date text not null,
  read_time text not null,
  cover_image text not null,
  excerpt text not null,
  content text[] not null default '{}'::text[],
  featured boolean not null default false,
  author_name text not null,
  author_role text not null,
  author_avatar text,
  featured_quote text,
  tags text[] not null default '{}'::text[],
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status
  on public.blog_posts (status, featured desc, created_at desc);

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function private.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
drop policy if exists "Secretariat staff can read all blog posts" on public.blog_posts;
drop policy if exists "Secretariat staff can manage blog posts" on public.blog_posts;
drop policy if exists "Staff can insert blog posts" on public.blog_posts;
drop policy if exists "Staff can update blog posts" on public.blog_posts;
drop policy if exists "Staff can delete blog posts" on public.blog_posts;

create policy "Public can read published blog posts"
  on public.blog_posts for select
  to anon
  using (status = 'published');

create policy "Secretariat staff can read all blog posts"
  on public.blog_posts for select
  to authenticated
  using (private.is_secretariat_staff() or status = 'published');

create policy "Staff can insert blog posts"
  on public.blog_posts for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update blog posts"
  on public.blog_posts for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete blog posts"
  on public.blog_posts for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 10. GALLERY ITEMS
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Community', 'Education', 'Parliament', 'Healthcare', 'Festivals')),
  image text not null,
  date text not null,
  location text not null,
  caption text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_gallery_items_order
  on public.gallery_items (is_published, sort_order asc, created_at desc);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read published gallery items" on public.gallery_items;
drop policy if exists "Secretariat staff can read all gallery items" on public.gallery_items;
drop policy if exists "Secretariat staff can manage gallery items" on public.gallery_items;
drop policy if exists "Staff can insert gallery items" on public.gallery_items;
drop policy if exists "Staff can update gallery items" on public.gallery_items;
drop policy if exists "Staff can delete gallery items" on public.gallery_items;

create policy "Public can read published gallery items"
  on public.gallery_items for select
  to anon
  using (is_published = true);

create policy "Secretariat staff can read all gallery items"
  on public.gallery_items for select
  to authenticated
  using (private.is_secretariat_staff() or is_published = true);

create policy "Staff can insert gallery items"
  on public.gallery_items for insert
  to authenticated
  with check (private.is_secretariat_staff());

create policy "Staff can update gallery items"
  on public.gallery_items for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete gallery items"
  on public.gallery_items for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 11. CONTACT INQUIRIES
-- ----------------------------------------------------------------------------
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique not null,
  full_name text not null,
  email text not null default '',
  phone text not null,
  town text not null,
  category text not null,
  message text not null,
  volunteer boolean not null default false,
  status text not null default 'new' check (status in ('new', 'in_review', 'resolved')),
  internal_notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_inquiries_status
  on public.contact_inquiries (status, created_at desc);

alter table public.contact_inquiries enable row level security;

drop policy if exists "Public can submit contact inquiries" on public.contact_inquiries;
drop policy if exists "Secretariat staff can manage contact inquiries" on public.contact_inquiries;
drop policy if exists "Staff can read contact inquiries" on public.contact_inquiries;
drop policy if exists "Staff can update contact inquiries" on public.contact_inquiries;
drop policy if exists "Staff can delete contact inquiries" on public.contact_inquiries;

create policy "Public can submit contact inquiries"
  on public.contact_inquiries for insert
  to anon, authenticated
  with check (status = 'new' and internal_notes = '');

create policy "Staff can read contact inquiries"
  on public.contact_inquiries for select
  to authenticated
  using (private.is_secretariat_staff());

create policy "Staff can update contact inquiries"
  on public.contact_inquiries for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete contact inquiries"
  on public.contact_inquiries for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 12. NEWSLETTER SUBSCRIBERS
-- ----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'footer' check (source in ('blog', 'footer')),
  subscribed_at timestamptz not null default now()
);

create index if not exists idx_newsletter_subscribers_date
  on public.newsletter_subscribers (subscribed_at desc);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
drop policy if exists "Secretariat staff can manage newsletter subscribers" on public.newsletter_subscribers;
drop policy if exists "Staff can read newsletter subscribers" on public.newsletter_subscribers;
drop policy if exists "Staff can update newsletter subscribers" on public.newsletter_subscribers;
drop policy if exists "Staff can delete newsletter subscribers" on public.newsletter_subscribers;

create policy "Public can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Staff can read newsletter subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (private.is_secretariat_staff());

create policy "Staff can update newsletter subscribers"
  on public.newsletter_subscribers for update
  to authenticated
  using (private.is_secretariat_staff())
  with check (private.is_secretariat_staff());

create policy "Staff can delete newsletter subscribers"
  on public.newsletter_subscribers for delete
  to authenticated
  using (private.is_secretariat_staff());

-- ----------------------------------------------------------------------------
-- 13. GRANTS FOR SUPABASE DATA API
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.mp_profile, public.hero_slides, public.quick_stats,
  public.core_values, public.timeline_milestones, public.projects,
  public.news_articles, public.blog_posts, public.gallery_items
  to anon;

grant insert on public.contact_inquiries, public.newsletter_subscribers
  to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;

-- ----------------------------------------------------------------------------
-- 14. SUPABASE STORAGE BUCKET & POLICIES ('media')
-- Subfolders: hero/, projects/, news/, blog/, gallery/, profile/
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760, -- 10 MB max per image
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read media bucket objects" on storage.objects;
drop policy if exists "Secretariat staff can upload media objects" on storage.objects;
drop policy if exists "Secretariat staff can update media objects" on storage.objects;
drop policy if exists "Secretariat staff can delete media objects" on storage.objects;

create policy "Public can read media bucket objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "Secretariat staff can upload media objects"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and private.is_secretariat_staff());

create policy "Secretariat staff can update media objects"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and private.is_secretariat_staff())
  with check (bucket_id = 'media' and private.is_secretariat_staff());

create policy "Secretariat staff can delete media objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and private.is_secretariat_staff());
