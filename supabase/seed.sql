-- ============================================================================
-- OFFICIAL EDITORIAL CMS & PUBLIC WEBSITE SEED DATA
-- Hon. Queenstar Maame Pokua Sawyerr — Member of Parliament, Agona East
-- ============================================================================
-- Mirrors the exact mockData.ts & Hero.tsx structure from hon-sawyer.
-- Safe to run once after supabase/schema.sql.
-- ============================================================================

-- 1. MP PROFILE (Single-row global configuration)
insert into public.mp_profile (
  id,
  full_name,
  short_name,
  popular_title,
  slogan,
  hero_tagline,
  role,
  party,
  constituency,
  region,
  tenure,
  parliament_email,
  office_email,
  constituency_phone,
  hotline_phone,
  office_address,
  parliament_address,
  portrait_hero_url,
  portrait_about_url,
  portrait_community_url,
  about_quote,
  social_links,
  constituency_towns
) values (
  '00000000-0000-4000-8000-000000000001',
  'Hon. Queenstar Maame Pokua Sawyerr',
  'Hon. Maame Pokua Sawyerr',
  'Mama Pokua',
  'Dedicated to People. Committed to Progress.',
  'A compassionate, visionary leader uplifting Agona East with dignity, educational empowerment, and sustainable community growth.',
  'Member of Parliament, Agona East Constituency',
  'National Democratic Congress (NDC)',
  'Agona East',
  'Central Region, Ghana',
  'Serving since 2013 (3 Terms)',
  'pokua.sawyerr@parliament.gh',
  'info@honpokuasawyerr.org',
  '+233 (0) 33 209 4412',
  '+233 (0) 24 456 7890',
  'Agona East Constituency Secretariat, Main Nsaba-Swedru Road, Agona Nsaba, Central Region, Ghana',
  'Room 504, 5th Floor, Job 600, Parliament House, Osu, Accra, Ghana',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
  'Leadership is about service to the vulnerable. When we empower a child with education and support a mother with dignity, we build a nation.',
  '{"facebook":"https://facebook.com","x":"https://x.com","instagram":"https://instagram.com","youtube":"https://youtube.com"}'::jsonb,
  array[
    'Agona Nsaba (Capital)',
    'Agona Duakwa',
    'Agona Kwanyako',
    'Agona Mankrong',
    'Agona Asafo',
    'Fante Bawjiase',
    'Seth Okai',
    'Ninta',
    'Akotsi',
    'Otinkorang',
    'Agona Mensakrom',
    'Diaspora / Other'
  ]
)
on conflict (id) do nothing;

-- 2. HERO SLIDES
insert into public.hero_slides (
  id, sort_order, is_active, type, tag, badge_color, title, title_highlight, description, landscape_image, portrait_images
) values
(
  '00000000-0000-4000-8001-000000000001',
  1,
  true,
  'landscape',
  'Leadership with the People',
  'green',
  'Leadership with Integrity.',
  'Service with Impact.',
  'Serving the good people of Agona East with steadfast compassion, educational empowerment, and sustainable community development.',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
  null
),
(
  '00000000-0000-4000-8001-000000000002',
  2,
  true,
  'paired-portrait',
  'Servant Leadership & Passion',
  'red',
  'Mama Pokua: A Mother for All,',
  'A Champion for the Youth.',
  'Affectionately called "Mama Pokua", Hon. Sawyerr is renowned across the Central Region for putting the people first in every legislative decision.',
  null,
  '[{"src":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80","caption":"Grassroots Warmth"},{"src":"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80","caption":"Mama Pokua in Agona East"}]'::jsonb
),
(
  '00000000-0000-4000-8001-000000000003',
  3,
  true,
  'landscape',
  'Transforming Communities',
  'green',
  'Delivering Tangible Progress',
  'Across Agona East.',
  'From clean mechanized water boreholes to maternal health clinics and school infrastructure, delivering real development to every village.',
  'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1600&q=80',
  null
),
(
  '00000000-0000-4000-8001-000000000004',
  4,
  true,
  'paired-portrait',
  'Women & Grassroots Economy',
  'green',
  'Empowering Mothers & Traders',
  'with Economic Dignity.',
  'Disbursing revolving seed grants and processing equipment to thousands of market women and farming cooperatives across Agona East.',
  null,
  '[{"src":"https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80","caption":"Market Women Support"},{"src":"https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80","caption":"Grassroots Engagement"},{"src":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80","caption":"Economic Independence"}]'::jsonb
),
(
  '00000000-0000-4000-8001-000000000005',
  5,
  true,
  'landscape',
  'Education for Every Child',
  'red',
  'Securing the Next Generation',
  'Through Education.',
  'Over 35,000 candidates supplied with free mathematical sets and hot nutritious lunch packages during BECE examinations across 42 schools.',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
  null
),
(
  '00000000-0000-4000-8001-000000000006',
  6,
  true,
  'paired-portrait',
  'Parliamentary Stewardship',
  'green',
  'A Fierce Voice in the',
  'Parliament of Ghana.',
  'Championing rural health subventions, road maintenance, and youth employment on the floor of the 8th Parliament with integrity.',
  null,
  '[{"src":"https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80","caption":"Parliamentary Caucus"},{"src":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80","caption":"Legislative Leadership"},{"src":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80","caption":"Public Accountability"}]'::jsonb
),
(
  '00000000-0000-4000-8001-000000000007',
  7,
  true,
  'paired-portrait',
  'Agona East Forward',
  'red',
  'United in Strength.',
  'Focused on Progress.',
  'Building a resilient, inclusive, and prosperous constituency through unity, mutual respect, and active civic participation.',
  null,
  '[{"src":"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80","caption":"Community Durbar"},{"src":"https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80","caption":"Cultural Heritage"},{"src":"https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80","caption":"Youth & Artisans"}]'::jsonb
),
(
  '00000000-0000-4000-8001-000000000008',
  8,
  true,
  'paired-portrait',
  'Grassroots Resilience',
  'green',
  'A Mother to All.',
  'A Pillar of Agona East.',
  'Standing firmly beside market women, farmers, students, and traditional leaders with unwavering compassion and accessible leadership.',
  null,
  '[{"src":"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80","caption":"Mama Pokua with Constituents"},{"src":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80","caption":"Servant of Agona East"}]'::jsonb
)
on conflict (id) do nothing;

-- 3. QUICK STATS
insert into public.quick_stats (id, sort_order, value, label, subtext) values
('00000000-0000-4000-8002-000000000001', 1, '12+', 'Years in Parliament', 'Continuous Dedicated Service'),
('00000000-0000-4000-8002-000000000002', 2, '55,000+', 'Students Supported', 'BECE Math Sets & School Feeding'),
('00000000-0000-4000-8002-000000000003', 3, '140+', 'Community Projects', 'Water, Health & Schools'),
('00000000-0000-4000-8002-000000000004', 4, 'GH₵ 4.5M+', 'Women Micro-Grants', 'Seed Capital for Traders')
on conflict (id) do nothing;

-- 4. CORE VALUES
insert into public.core_values (id, sort_order, title, description, icon_name) values
('00000000-0000-4000-8003-000000000001', 1, 'Servant Leadership', 'Leading not from a pedestal, but from the front lines alongside farmers, market women, youth, and traditional leaders in Agona East.', 'heart'),
('00000000-0000-4000-8003-000000000002', 2, 'Education for All', 'A firm conviction that no child in Agona East should fail to realize their potential due to lack of basic learning tools or proper nutrition.', 'book'),
('00000000-0000-4000-8003-000000000003', 3, 'Economic Dignity', 'Equipping women entrepreneurs and hardworking youth with financial autonomy, working capital, and marketable vocational skills.', 'trending-up'),
('00000000-0000-4000-8003-000000000004', 4, 'Integrity & Accountability', 'Open, transparent representation on the floor of Parliament and prudent stewardship of public resources for grassroots development.', 'shield'),
('00000000-0000-4000-8003-000000000005', 5, 'Community Inclusivity', 'Uniting all towns and farming villages across Agona East regardless of background, creed, or political affiliation.', 'users'),
('00000000-0000-4000-8003-000000000006', 6, 'Social Justice & Equity', 'Fighting for equitable health infrastructure, rural electrification, clean potable water, and accessible farm-to-market feeder roads.', 'scale')
on conflict (id) do nothing;

-- 5. TIMELINE MILESTONES
insert into public.timeline_milestones (id, sort_order, year, title, role, description) values
('00000000-0000-4000-8004-000000000001', 1, '2012', 'First Historic Parliamentary Victory', 'Elected MP for Agona East', 'Won the parliamentary seat under the ticket of the National Democratic Congress (NDC), bringing renewed hope and accessible leadership to Agona East.'),
('00000000-0000-4000-8004-000000000002', 2, '2013 – 2017', 'Deputy Central Regional Minister', 'Government of Ghana', 'Appointed by H.E. President John Dramani Mahama. Supervised regional infrastructure development, educational monitoring, and health sector initiatives across the Central Region.'),
('00000000-0000-4000-8004-000000000003', 3, '2016', 'Re-election for Second Term', 'Member of Parliament', 'Re-elected with widespread constituent endorsement in recognition of her tireless community interventions, school feeding program, and rural health clinics.'),
('00000000-0000-4000-8004-000000000004', 4, '2020', 'Landmark Third-Term Victory', 'Member of Parliament', 'Secured an emphatic re-election mandate, solidifying her status as a resilient political pillar, passionate advocate for women, and fearless voice in the 8th Parliament of Ghana.'),
('00000000-0000-4000-8004-000000000005', 5, 'Present', 'Veteran Parliamentarian & Grassroots Icon', 'Parliamentary Committee Member', 'Serving with distinction on key parliamentary committees including Youth, Sports & Culture and the Privileges Committee, while continuously delivering high-impact projects in Agona East.')
on conflict (id) do nothing;

-- 6. PROJECTS
insert into public.projects (
  id, slug, title, short_description, category, impact_metric, image, completion_year,
  location, beneficiaries_count, full_description, key_highlights, gallery_images,
  testimonial, is_flagship, sort_order, is_published
) values
(
  '00000000-0000-4000-8005-000000000001',
  'school-feeding-bece',
  'Maame Pokua School Feeding & BECE Candidate Support Program',
  'Annual distribution of over 3,500 mathematical sets, revision materials, and daily warm nutritious meals to all BECE candidates across Agona East.',
  'Education',
  '35,000+ Students Reached',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
  'Ongoing Annual Initiative',
  'All 42 Junior High Schools in Agona East',
  '35,000+ candidates over 10 years',
  'Initiated over a decade ago by Hon. Queenstar Maame Pokua Sawyerr, this flagship intervention addresses the critical socio-economic barriers faced by rural candidates preparing for the Basic Education Certificate Examination (BECE). Every examination season, candidates across public and private schools receive mathematical instruments, pens, clipboards, and are provided with daily nourishing hot meals during mock exams and the official examination week. This has dramatically improved exam pass rates and boosted student confidence throughout Agona East.',
  array[
    'Over 3,500 candidates supplied with certified mathematical sets and study stationery annually',
    'Nutritious hot lunch provided to students during the entire examination period',
    'Free specialized district mock examinations conducted prior to BECE',
    'Financial prizes awarded to top-performing girls and boys in the district'
  ],
  array[
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80'
  ],
  '{"quote":"Mama Pokua''s mock exams and free math sets took away all my anxiety before BECE. Today I am at Wesley Girls High School because she believed in us.","author":"Abena Mensah","role":"Alumna, Agona Nsaba Presby JHS"}'::jsonb,
  true,
  1,
  true
),
(
  '00000000-0000-4000-8005-000000000002',
  'women-microfinance-traders',
  'Agona East Women Economic Empowerment & Seed Capital Fund',
  'Revolving interest-free micro-credit and business training empowering market women, petty traders, and agricultural processors.',
  'Women & Economy',
  'GH₵ 4.5M+ Seed Capital',
  'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
  '2015 – Present',
  'Nsaba, Duakwa, Kwanyako, and Mankrong Markets',
  '4,800+ Female Entrepreneurs',
  'Recognizing that women are the economic engine of Agona East, Hon. Sawyerr established the Women Economic Empowerment Fund. The program gives women working in markets and cottage industries interest-free loans and matching grants to restock goods, purchase processing equipment (such as cassava grating machines and palm kernel presses), and stabilize household livelihoods.',
  array[
    'Provided financial relief grants to 4,800+ market traders across Agona East markets',
    'Donation of mechanized cassava graters and corn mills to women cooperatives in 8 villages',
    'Practical bookkeeping and savings group workshops conducted in local languages',
    'Zero defaults through a peer-guaranteed communal solidarity lending model'
  ],
  array[
    'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80'
  ],
  '{"quote":"When the market fire destroyed my shed, Mama Pokua visited us that very evening and gave us capital to restart. She is truly a mother to Agona East.","author":"Madam Comfort Baidoo","role":"Agona Duakwa Market Queenmother"}'::jsonb,
  false,
  2,
  true
),
(
  '00000000-0000-4000-8005-000000000003',
  'maternal-health-chps',
  'Rural Maternal Healthcare & CHPS Compounds Modernization',
  'Refurbishing and equipping Community-Based Health Planning and Services (CHPS) compounds with solar power, delivery beds, and medical consumables.',
  'Healthcare',
  '18 Health Posts Upgraded',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  '2018 – Ongoing',
  'Agona Asafo, Mankrong Junction, Akotsi, Otinkorang',
  '60,000+ Constituents',
  'To eliminate preventable maternal and infant deaths in remote farming settlements, Hon. Queenstar Maame Pokua Sawyerr has prioritized healthcare infrastructure. She has spearheaded the construction of new maternal wards, donation of hydraulic delivery beds, supply of infant incubators to district health centres, and installation of solar power systems to keep vaccines and delivery lights working through grid outages.',
  array[
    '18 rural CHPS compounds refurbished and supplied with essential medical kits',
    'Solar panels installed in 9 off-grid health clinics for 24/7 delivery lighting',
    'Donation of emergency patient transport tricycles and district ambulance support',
    'Organized annual free medical screenings for diabetes, hypertension, and eye care'
  ],
  array[
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80'
  ],
  '{"quote":"Expectant mothers in Otinkorang used to travel over 15 kilometers on dirt roads during labor. Today we deliver safely with solar lights in our own community.","author":"Nurse Gifty Addo","role":"Senior Midwife, Agona East Health Directorate"}'::jsonb,
  false,
  3,
  true
),
(
  '00000000-0000-4000-8005-000000000004',
  'solar-water-boreholes',
  'Clean Water for All: Solar-Powered Mechanized Water Systems',
  'Installation of 32 mechanized solar water boreholes with high-capacity storage tanks providing potable water to farming communities.',
  'Infrastructure',
  '32 Mechanized Boreholes',
  'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
  '2020 – 2024',
  'Agona Kwanyako, Seth Okai, Fante Bawjiase, Ninta',
  '45,000+ Residents',
  'Water-borne diseases and hours spent by children fetching water from rivers before school have been significantly mitigated through Hon. Sawyerr''s Clean Water initiative. By drilling industrial boreholes powered by renewable solar pumps connected to overhead storage tanks, entire communities now enjoy potable running water within steps of their homes.',
  array[
    '32 high-capacity solar-powered mechanized boreholes constructed and operational',
    'Drastic reduction in waterborne illnesses reported by local health centres',
    'Children, especially school-age girls, saved hours of walking to muddy streams',
    'Local water management committees trained in each town for long-term sustainability'
  ],
  array[
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'
  ],
  '{"quote":"Our school children no longer arrive late or fall sick from stream water. We bless Mama Pokua for giving our village this priceless gift of clean water.","author":"Nana Kwesi Badu II","role":"Chief of Seth Okai Community"}'::jsonb,
  false,
  4,
  true
),
(
  '00000000-0000-4000-8005-000000000005',
  'youth-vocational-skills',
  'Agona East Youth Apprenticeship & Artisan Tool Kits Scheme',
  'Sponsoring apprenticeships and distributing free sewing machines, hairdryers, auto-mechanic sets, and masonry tool kits to graduating youth.',
  'Youth & Skills',
  '2,200+ Artisans Equipped',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  'Ongoing',
  'Constituency-Wide across Agona East',
  '2,200+ Young Men and Women',
  'Youth unemployment requires actionable solutions. Through this scheme, Hon. Sawyerr pays apprenticeship fees for vulnerable youth with master craftsmen, and upon graduation, provides them with complete professional start-up tool kits—empowering them to open their own enterprises.',
  array[
    'Full payment of apprenticeship master fees for over 1,200 youth',
    'Donation of 1,500+ industrial and domestic sewing machines and dryers',
    'Distribution of mechanic toolboxes, electrical testers, and masonry trowels',
    'Financial management seminars for budding young self-employed contractors'
  ],
  array[
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
  ],
  '{"quote":"I finished my tailoring apprenticeship with nothing to buy a machine. Mama Pokua bought me my first machine and paid my graduation dues. Today I employ three others.","author":"Kofi Asare","role":"Fashion Designer, Agona Nsaba"}'::jsonb,
  false,
  5,
  true
),
(
  '00000000-0000-4000-8005-000000000006',
  'feeder-roads-culverts',
  'Farm-to-Market Feeder Roads & Bridge Rehabilitation',
  'Constructing reinforced culverts, bridges, and shaping unpaved feeder roads to allow farmers to transport produce to urban market centers.',
  'Infrastructure',
  '75+ km Roads Shaped',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
  '2019 – Present',
  'Nsaba-Kwanyako Bypass, Duakwa-Akroso Corridor, Mankrong',
  '30,000+ Farmers & Drivers',
  'Agona East is a vital food basket producing cocoa, cassava, maize, plantain, and vegetables. To prevent post-harvest losses caused by impassable muddy roads during the rainy season, Hon. Sawyerr has facilitated continuous road grading, ditch clearing, and built critical drainage culverts.',
  array[
    'Construction of 14 reinforced concrete culverts preventing flood washouts',
    'Re-graveling and shaping of critical farm feeder road links across the district',
    'Continuous advocacy in Parliament for government road contractor mobilizations',
    'Immediate emergency repairs following devastating heavy rains'
  ],
  array[
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80'
  ],
  '{"quote":"During harvest season our cocoa used to rot in the bush because vehicles refused to ply our roads. The new culvert and grading saved our livelihood.","author":"Opanin Yaw Mensah","role":"Agona East Cocoa Farmers Association"}'::jsonb,
  false,
  6,
  true
)
on conflict (id) do nothing;

-- 7. NEWS ARTICLES
insert into public.news_articles (
  id, slug, title, published_date, category, read_time, thumbnail, excerpt, content, featured, author, tags, is_published
) values
(
  '00000000-0000-4000-8006-000000000001',
  'bece-2024-distribution',
  'Hon. Queenstar Pokua Sawyerr Distributes Mathematical Sets to Over 3,500 BECE Candidates in Agona East',
  'July 14, 2024',
  'Education',
  '4 min read',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
  'The Member of Parliament reaffirmed her 12-year tradition of personally visiting every examination center in the constituency to motivate candidates and provide free examination supplies.',
  array[
    'In continuation of her flagship educational intervention that has spanned more than a decade, the Member of Parliament for Agona East, Hon. Queenstar Maame Pokua Sawyerr, has distributed over 3,500 mathematical sets, clipboards, pens, and pencils to all registered candidates preparing for the 2024 Basic Education Certificate Examination (BECE) across the district.',
    'Addressing candidates and teachers at Agona Nsaba Presby JHS and Agona Duakwa Catholic JHS, Hon. Sawyerr urged the students to discard fear and approach every paper with calm self-confidence. "You have studied diligently. God has granted you wisdom, and we your parents and leaders are standing behind you with prayers and total support," she passionately stated.',
    'In addition to the stationery distribution, Hon. Sawyerr made arrangements for candidates in distant communities to receive warm lunch packages throughout the examination week, ensuring that hunger does not impede any student''s academic performance.',
    'District Education Director and headteachers present commended the MP for her unwavering consistency over 12 consecutive years, noting that Agona East has seen a marked improvement in academic performance and girls'' transition to senior high schools.'
  ],
  true,
  'Constituency Communications Directorate',
  array['Education', 'BECE', 'Youth Empowerment', 'Mama Pokua'],
  true
),
(
  '00000000-0000-4000-8006-000000000002',
  'solar-water-inauguration',
  'Clean Potable Water Commissioned in Four Remote Farming Enclaves Across Agona East',
  'May 28, 2024',
  'Community',
  '3 min read',
  'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
  'Over 6,000 residents celebrate as modern solar mechanized water systems replace distant muddy streams in Seth Okai, Ninta, and adjacent settlements.',
  array[
    'Excitement and heartfelt gratitude echoed through the farming communities of Seth Okai and Ninta as Hon. Queenstar Maame Pokua Sawyerr officially commissioned four new solar-powered mechanized water facilities.',
    'Prior to this intervention, women and school children had to trek several kilometers daily to fetch untreated water from local rivers, which frequently led to outbreaks of bilharzia and other water-borne ailments.',
    'Speaking at the grand commissioning durbar attended by chiefs, queenmothers, and community leaders, Hon. Sawyerr underscored her belief that access to clean drinking water is a fundamental human right. "No mother should worry about whether the water she gives her infant child is safe to drink," she said.',
    'The facilities feature 10,000-liter overhead storage tanks, multi-point stainless steel tap stands, and independent solar inverter arrays that ensure uninterrupted water flow even during regional power outages.'
  ],
  false,
  'Constituency Communications Directorate',
  array['Water', 'Infrastructure', 'Healthcare', 'Agona East'],
  true
),
(
  '00000000-0000-4000-8006-000000000003',
  'parliament-health-funding-motion',
  'Parliamentary Debate: Hon. Sawyerr Demands Accelerated Release of NHIS Subventions for Rural Health Facilities',
  'March 19, 2024',
  'Parliament',
  '5 min read',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  'On the floor of Parliament, Hon. Sawyerr passionately articulated the plight of district clinics and called on the Ministry of Finance to prioritize rural healthcare subventions.',
  array[
    'Speaking during the parliamentary debate on the National Health Insurance Authority formula, Hon. Queenstar Maame Pokua Sawyerr raised severe concerns over prolonged delays in reimbursing healthcare providers in rural constituencies.',
    'Hon. Sawyerr pointed out that district hospitals and CHPS compounds in constituencies like Agona East bear the brunt of delayed disbursements, forcing facility administrators to rely on high-interest credit lines to maintain supplies of basic medications and maternity supplies.',
    '"Mr. Speaker, our rural folks pay their dues to this country. When a farmer or market woman in Agona East falls ill, the NHIS card must not be turned away because funds have not been transferred to the service providers," Hon. Sawyerr emphasized to bipartisan applause.',
    'Her advocacy led to high-level assurances from the leadership of the House to engage the Ministry of Finance for expedited clearance of verified claims.'
  ],
  false,
  'Parliamentary Press Corps',
  array['Parliament', 'Healthcare', 'Good Governance', 'Central Region'],
  true
),
(
  '00000000-0000-4000-8006-000000000004',
  'market-women-grant-disbursement',
  'Over 500 Agona East Market Women Receive Seed Capital and Processing Machines in Agona Duakwa',
  'January 12, 2024',
  'Community',
  '4 min read',
  'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
  'Hon. Queenstar Maame Pokua Sawyerr expands the Women Economic Empowerment Scheme to mitigate inflationary pressures on small traders.',
  array[
    'In a bid to cushion local traders against economic hardship and high inflation, Hon. Queenstar Maame Pokua Sawyerr spearheaded a major disbursement of non-repayable seed grants and industrial processing equipment to over 500 women traders in Agona Duakwa and surrounding villages.',
    'The package included heavy-duty motorized cassava grating machines, corn millers, commercial sewing machines, and cash grants directly distributed to market cooperatives.',
    'Beneficiary women sang traditional songs of praise for "Mama Pokua", recounting how her continuous backing has sustained their families through tough times. Hon. Sawyerr urged the women to organize into trade credit groups to multiply the benefits.'
  ],
  false,
  'Constituency Communications Directorate',
  array['Women Empowerment', 'Microfinance', 'Agona Duakwa', 'Economy'],
  true
),
(
  '00000000-0000-4000-8006-000000000005',
  'akwambo-festival-speech',
  'Agona East Annual Akwambo Festival: Hon. Sawyerr Reaffirms Commitment to Peace, Culture, and Inclusive Growth',
  'October 15, 2023',
  'Press Release',
  '3 min read',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
  'Joining the traditional council at the colourful Akwambo festival celebration, the MP called for unity and shared progress across Agona East.',
  array[
    'Clad in exquisite traditional Ghanaian attire, Hon. Queenstar Maame Pokua Sawyerr was warmly received by the chiefs, queenmothers, and constituents at the annual Akwambo festival in Agona Nsaba.',
    'In her keynote message, she highlighted the rich heritage of the Agona people and paid homage to the ancestral trailblazers whose courage cleared paths for current generations.',
    'She pledged her sustained partnership with the traditional authorities to lobby for enhanced road infrastructure, modern sanitation facilities, and expanded youth employment opportunities across Agona East.'
  ],
  false,
  'Constituency Secretariat',
  array['Culture', 'Akwambo', 'Unity', 'Agona Nsaba'],
  true
)
on conflict (id) do nothing;

-- 8. BLOG POSTS (The MP's Notebook)
insert into public.blog_posts (
  id, title, slug, category, publish_date, read_time, cover_image, excerpt, content,
  featured, author_name, author_role, author_avatar, featured_quote, tags, status
) values
(
  '00000000-0000-4000-8007-000000000001',
  'The Agona East Educational Renaissance: Why Nutrition and Basic Tools Determine a Child''s Future',
  'agona-east-educational-renaissance-nutrition-basic-tools',
  'Education & Youth',
  'October 14, 2024',
  '6 min read',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  'A hungry child cannot master algebra, and a candidate without mathematical instruments enters the examination hall defeated before the bell rings. Over the past decade, our annual BECE interventions have demonstrated that educational equity is not about complex rhetoric—it begins with dignity in the classroom.',
  array[
    'Every August when the Basic Education Certificate Examination (BECE) approaches, I am reminded of why I first sought public office. Education in rural Ghana has never suffered from a deficit of intellectual ambition. Our boys and girls in Agona Nsaba, Kwanyako, and Duakwa possess identical curiosities and raw cognitive potential as their counterparts in Cantonments or Airport Residential. What separates them is not capacity, but the quiet, grinding friction of basic material deprivation.',
    'Over a decade ago, during one of my early constituency tours through our basic schools, I watched a brilliant young girl in a farming village struggling through a mock mathematics examination. She was borrowing a wooden ruler from her classmate every few minutes, her hands trembling with anxiety as the clock ticked. When I asked her teachers why so many candidates were unprepared with standardized mathematical sets, the answer was heartbreakingly simple: for a subsistence cocoa farming family with three school-going children, purchasing certified compasses, dividers, and protractors represents a choice between exam tools and dinner.',
    'That afternoon, the "Maame Pokua School Feeding & BECE Candidate Support Initiative" was born. We made a binding commitment that no student across all 42 Junior High Schools in Agona East would ever sit for the BECE without certified geometry sets, writing materials, and a warm nutritious hot meal served right at their examination centers.',
    'Critics occasionally ask whether providing mathematical instruments and hot lunches is "substantive policy." To that, I respond with the official WAEC examination statistics of Agona East over the past ten years. When you alleviate the visceral terror of hunger and exam unpreparedness, pass rates ascend. Girls who previously dropped out after basic school now gain admissions into Wesley Girls, Holy Child, Mfantsiman, and Swedru Senior High School. Several of our earliest beneficiaries have now completed university degrees in nursing, engineering, and education, returning to Agona East as professionals.',
    'As we look ahead, the challenge before our educational system is modernization. We must connect our rural schools to digital literacy labs and equip our teachers with contemporary pedagogical tools. But even as we aspire to artificial intelligence and code in the curriculum, we must never forget the foundational truth: dignity begins with a desk, a book, a meal, and a leader who refuses to let any child be left behind.'
  ],
  true,
  'Hon. Queenstar Maame Pokua Sawyerr',
  'Member of Parliament, Agona East Constituency',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'True empowerment does not trickle down from distant offices in Accra. It is planted when a child in Duakwa receives a school desk, a nutritious hot meal, and the quiet assurance that their dreams matter to their Member of Parliament.',
  array['Education', 'BECE Candidates', 'Youth Development', 'Agona East', 'Rural Equity'],
  'published'
),
(
  '00000000-0000-4000-8007-000000000002',
  'A Decade on the Frontlines: Decentralisation and What True Grassroots Representation Demands',
  'decade-on-the-frontlines-decentralisation-grassroots-representation',
  'Legislative Insights',
  'September 22, 2024',
  '8 min read',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  'The primary duty of a Member of Parliament is constitutional legislation, but for a rural representative, parliament begins at the durbar ground and ends by the bedside of a sick constituent. Here are my reflections on balancing parliamentary scrutiny in Accra with everyday community advocacy.',
  array[
    'In political science textbooks, the constitutional role of a Ghanaian parliamentarian is neatly categorized into three pillars: legislation, oversight, and representation. In the chamber of Parliament, we debate appropriation bills, interrogate ministerial budgets, and serve on standing and select committees. But the moment you cross the Ayensu river into Agona East, the abstract theories of constitutional governance are immediately tested against the lived realities of our people.',
    'In a rural district, your constituents do not measure your parliamentary tenure solely by how many hansard pages feature your interventions—though legislative vigilance is paramount. They measure leadership by whether the bridge linking their farm gate to the market was repaired before the heavy rains washed away their cassava harvest. They judge your stewardship by whether the community CHPS compound has a reliable nurse and maternal delivery bed.',
    'During my tenure as Deputy Central Regional Minister, I supervised regional development projects across twenty-two administrative districts. That executive experience reinforced my conviction that true decentralisation in Ghana remains incomplete. Local assemblies frequently struggle with delayed Common Fund disbursements, forcing Members of Parliament to shoulder responsibilities that ideally belong to municipal statutory budgets.',
    'Rather than complaining about institutional limitations, I chose the path of active grassroots partnership. By working hand-in-hand with our revered chiefs, queen mothers, assembly members, and unit committee heads, we have prioritized high-yield community infrastructure: over 140 mechanized boreholes, rural health compound refurbishments, and school infrastructure repairs.',
    'Our democracy is strongest when the distance between the lawmaker and the citizen is dissolved. Whenever I sit under the shade of a neem tree during community durbars listening to our elders and youth, I am reminded that public service is not a privilege of rank; it is a sacred covenant of accountability.'
  ],
  false,
  'Hon. Queenstar Maame Pokua Sawyerr',
  'Member of Parliament, Agona East Constituency',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'Legislation drafted in the air-conditioned chambers of Job 600 must withstand the scrutiny of a cocoa farmer in Mankrong. If our laws do not lower the cost of living or improve the price of produce, we are merely engaging in sophisticated theatre.',
  array['Parliament of Ghana', 'Governance', 'Decentralisation', 'Constituency Realities'],
  'published'
),
(
  '00000000-0000-4000-8007-000000000003',
  'Unlocking Rural Wealth: Why Investing Directly in Market Women Yields Ghana''s Highest Societal Returns',
  'unlocking-rural-wealth-investing-directly-in-market-women',
  'Women Empowerment',
  'August 18, 2024',
  '5 min read',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
  'When an informal market trader in Agona Nsaba or Kwanyako receives interest-free seed capital, the dividend is immediate: school fees are paid, clinic visits are settled, and local food supply chains stay alive. Women are not just economic participants—they are the shock absorbers of our rural economy.',
  array[
    'Walk through the Agona Nsaba or Swedru markets at 5:00 AM on a market day, and you will observe the true economic engine of Ghana. Long before government ministries unlock their doors, hundreds of women are already offloading plantain, smoked fish, palm oil, and fresh vegetables transported from surrounding farming hamlets. These women operate on margins that would astonish commercial bankers, yet their repayment discipline and resourcefulness are peerless.',
    'For years, commercial financial institutions have treated the informal market woman as high-risk, demanding collateral that rural women rarely possess. When they are forced to borrow from predatory informal lenders, exorbitant interest rates swallow their profits before their merchandise is even sold.',
    'Recognizing this structural barrier, we instituted the Agona East Women Economic Empowerment & Seed Capital Fund. The mechanism is intentionally straightforward: providing structured, interest-free micro-grants and rotating credit directly to organized market associations and trade groups, paired with essential financial literacy training.',
    'The results have been transformative. Over GH₵ 4.5 million in cumulative seed capital has circulated through the hands of over 6,500 petty traders, gari processors, bakers, and seamstresses across Agona East. Default rates are near zero because the program is anchored on mutual trust, community co-guarantee, and transparent oversight.',
    'When you empower a woman financially, the return on investment is multi-generational. Her profits do not disappear into speculative ventures; they are reinvested in children''s school uniforms, NHIS cards, and nutritious family meals. Sustainable national development will remain an illusion until we place rural women at the center of fiscal strategy.'
  ],
  false,
  'Hon. Queenstar Maame Pokua Sawyerr',
  'Member of Parliament, Agona East Constituency',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'Give a woman trader working capital and she does not merely expand her stall; she transforms her household, educates her children, and stabilises the entire community.',
  array['Women in Trade', 'Microfinance', 'Rural Economy', 'Livelihoods', 'Agona Nsaba'],
  'published'
),
(
  '00000000-0000-4000-8007-000000000004',
  'Beyond the Floor of the House: Bringing Safe Water and Maternal Health to Every Hamlet',
  'bringing-safe-water-maternal-health-hamlet-agona-east',
  'Rural Development',
  'July 05, 2024',
  '7 min read',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  'A CHPS compound without running potable water or reliable solar lighting is only half an answer to rural healthcare. Over 140 mechanized boreholes later, our fight for health infrastructure continues to redefine community resilience across Agona East.',
  array[
    'In many rural farming communities across Central Region, preventable waterborne diseases such as cholera, bilharzia, and dysentery have historically extracted an unacceptable toll on productivity and human life. When school-going girls spend two hours every dawn carrying heavy buckets from polluted streams, their classroom attendance suffers before the school day even commences.',
    'Early in my first term as Member of Parliament, I resolved that clean water access must be treated with the urgency of a public health emergency. We initiated a sustained campaign to drill and commission mechanized boreholes across underserved settlements in Agona East. Today, with over 140 operational water facilities delivering potable water to tens of thousands of households, water-related hospital admissions in our district health centers have declined dramatically.',
    'Simultaneously, we focused our energy on rural maternal healthcare. No woman should risk complications or loss of life while bringing a new citizen into this world simply because a clinic lacks a functional delivery bed or solar lighting during a midnight blackout. By equipping local CHPS compounds with clean solar systems, sterile maternity wards, and providing essential medical supplies, we are restoring hope to expectant mothers.',
    'Quality healthcare cannot be the exclusive preserve of urban centers. Every citizen in Agona East, no matter how remote their village, deserves to know that when their child falls ill, professional medical care and clean water are within reach.'
  ],
  false,
  'Hon. Queenstar Maame Pokua Sawyerr',
  'Member of Parliament, Agona East Constituency',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'Access to clean drinking water is not a political favor. It is a fundamental human right that protects mothers, children, and the dignity of rural living.',
  array['Healthcare', 'Potable Water', 'Infrastructure', 'Public Health', 'Maternal Health'],
  'published'
),
(
  '00000000-0000-4000-8007-000000000005',
  'The Dignity of Artisanship: Re-imagining Youth Employment Through Apprenticeship',
  'dignity-of-artisanship-reimagining-youth-employment-apprenticeship',
  'Community Reflections',
  'May 30, 2024',
  '6 min read',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  'Not every talented young person in Agona East will sit in a tertiary lecture hall, but every young person possesses hands capable of building, fabricating, designing, and creating enterprise. How our master-apprentice sponsorship model is creating self-reliant livelihoods.',
  array[
    'Ghana''s youth unemployment crisis cannot be resolved solely through white-collar public sector recruitment. While tertiary education remains vital, our communities possess an immense, often undervalued reservoir of practical talent in masonry, carpentry, fashion design, electrical installation, cosmetology, and modern automotive mechanics.',
    'Too often, ambitious young school leavers who wish to learn a vocation are turned away because their families cannot afford the apprenticeship registration fees or the necessary starter toolkits. To bridge this gap, we established the Agona East Youth Apprenticeship Sponsorship Scheme.',
    'We partner directly with accredited master craftsmen and seasoned trade associations. We cover full apprenticeship fees for selected youth, monitor their training progression, and upon graduation, present each certified artisan with complete professional start-up toolkits—industrial sewing machines, hair dryers, masonry kits, and welding equipment.',
    'Over 1,200 young men and women across Agona East have graduated from this program into economic independence. Many have established their own workshops and are now training younger apprentices. This is the multiplier effect of targeted public investment: turning job seekers into job creators right in their home communities.'
  ],
  false,
  'Hon. Queenstar Maame Pokua Sawyerr',
  'Member of Parliament, Agona East Constituency',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'Equipping a young man or woman with a trade and their own startup equipment breaks the cycle of generational dependency more effectively than any temporary handout.',
  array['Youth Employment', 'Vocational Skills', 'Apprenticeship', 'Local Industry', 'Agona Kwanyako'],
  'published'
)
on conflict (id) do nothing;

-- 9. GALLERY ITEMS
insert into public.gallery_items (
  id, title, category, image, date, location, caption, sort_order, is_published
) values
('00000000-0000-4000-8008-000000000001', 'BECE Candidates Stationery & Nutrition Distribution', 'Education', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80', 'July 2024', 'Agona Nsaba Presby JHS', 'Hon. Queenstar Maame Pokua Sawyerr presenting mathematical sets and study guides to final-year candidates.', 1, true),
('00000000-0000-4000-8008-000000000002', 'Market Women Traders Empowerment Session', 'Community', 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80', 'January 2024', 'Agona Duakwa Central Market', 'Engaging with market queenmothers and distributing microfinance grants to petty traders.', 2, true),
('00000000-0000-4000-8008-000000000003', 'Commissioning of Solar-Powered Mechanized Water Project', 'Community', 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80', 'May 2024', 'Seth Okai Community', 'Official handover of 10,000-liter clean water borehole facility to the town development committee.', 3, true),
('00000000-0000-4000-8008-000000000004', 'Floor of Parliament: Committee Debates on Public Welfare', 'Parliament', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80', 'March 2024', 'Parliament House, Accra', 'Hon. Sawyerr articulating constitutional and district development priorities on the floor of the House.', 4, true),
('00000000-0000-4000-8008-000000000005', 'Rural Maternal Health Ward Handover & Medical Supply Delivery', 'Healthcare', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80', 'November 2023', 'Agona Asafo CHPS Compound', 'Handing over newly renovated maternity ward equipped with solar lighting and hydraulic delivery beds.', 5, true),
('00000000-0000-4000-8008-000000000006', 'Youth Vocational Graduation & Tool Kits Presentation', 'Education', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80', 'December 2023', 'Agona Kwanyako Community Center', 'Presenting sewing machines and artisan start-up kits to 150 young men and women apprentices.', 6, true),
('00000000-0000-4000-8008-000000000007', 'Akwambo Festival Grand Durbar of Chiefs', 'Festivals', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80', 'October 2023', 'Agona Nsaba Palace Grounds', 'Hon. Sawyerr paying homage to the Paramount Chief and traditional elders during the Akwambo festivities.', 7, true),
('00000000-0000-4000-8008-000000000008', 'Grassroots Community Engagement and Town Hall Gathering', 'Community', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80', 'August 2023', 'Mankrong Junction', 'Listening directly to farmers, drivers, and teachers during regular constituency tour.', 8, true)
on conflict (id) do nothing;

-- 10. SAMPLE CONSTITUENT INQUIRIES
insert into public.contact_inquiries (
  id, reference_number, full_name, email, phone, town, category, message, volunteer, status, internal_notes
) values
(
  '00000000-0000-4000-8009-000000000001',
  'AE-104829',
  'Kwame Boateng',
  'kwame.boateng@example.gh',
  '+233 24 412 8891',
  'Agona Nsaba (Capital)',
  'BECE / School Support',
  'Good afternoon Secretariat. The PTA of Nsaba Methodist JHS wishes to submit our updated candidate register of 118 pupils for the upcoming BECE support distribution.',
  false,
  'new',
  ''
),
(
  '00000000-0000-4000-8009-000000000002',
  'AE-104812',
  'Abena Korkor Mensah',
  'abena.mensah@example.gh',
  '+233 54 780 3310',
  'Agona Duakwa',
  'Women Micro-Grant Inquiry',
  'Our 24-member Duakwa Gari Processors Cooperative would like to apply for the next tranche of mechanized cassava graters and revolving seed capital.',
  true,
  'in_review',
  'Forwarded cooperative list to Women Empowerment Desk Officer for field verification on Thursday.'
),
(
  '00000000-0000-4000-8009-000000000003',
  'AE-104755',
  'Nana Yaw Osei',
  '',
  '+233 20 918 4402',
  'Seth Okai',
  'Community Project Suggestion',
  'The borehole committee requests a routine solar inverter inspection before the harmattan dry season peaks.',
  false,
  'resolved',
  'District technician inspected pump and replaced battery terminal on 12th.'
),
(
  '00000000-0000-4000-8009-000000000004',
  'AE-104790',
  'Gifty Appiah',
  'gifty.appiah@example.gh',
  '+233 27 334 9021',
  'Agona Kwanyako',
  'Media & Press Interview',
  'Requesting a 15-minute radio interview slot with Hon. Sawyerr on Central Morning Dialogue regarding the rural NHIS subvention motion.',
  false,
  'new',
  ''
)
on conflict (id) do nothing;

-- 11. SAMPLE NEWSLETTER SUBSCRIBERS
insert into public.newsletter_subscribers (id, email, source) values
('00000000-0000-4000-8010-000000000001', 'kofi.amoah@agonaeast.org', 'blog'),
('00000000-0000-4000-8010-000000000002', 'adjoa.baidoo@gmail.com', 'footer'),
('00000000-0000-4000-8010-000000000003', 'press@centralregionvoice.gh', 'blog'),
('00000000-0000-4000-8010-000000000004', 'nsaba.youth.league@yahoo.com', 'footer')
on conflict (id) do nothing;
