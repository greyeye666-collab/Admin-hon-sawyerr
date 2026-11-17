import type {
  BlogPostRow,
  ContactInquiryRow,
  CoreValueRow,
  GalleryItemRow,
  HeroSlideRow,
  MpProfileRow,
  NewsArticleRow,
  NewsletterSubscriberRow,
  ProjectRow,
  QuickStatRow,
  TimelineMilestoneRow,
} from '../types/database';

export const SEED_MP_PROFILE: MpProfileRow = {
  id: '00000000-0000-4000-8000-000000000001',
  full_name: 'Hon. Queenstar Maame Pokua Sawyerr',
  short_name: 'Hon. Maame Pokua Sawyerr',
  popular_title: 'Mama Pokua',
  slogan: 'Dedicated to People. Committed to Progress.',
  hero_tagline:
    'A compassionate, visionary leader uplifting Agona East with dignity, educational empowerment, and sustainable community growth.',
  role: 'Member of Parliament, Agona East Constituency',
  party: 'National Democratic Congress (NDC)',
  constituency: 'Agona East',
  region: 'Central Region, Ghana',
  tenure: 'Serving since 2013 (3 Terms)',
  parliament_email: 'pokua.sawyerr@parliament.gh',
  office_email: 'info@honpokuasawyerr.org',
  constituency_phone: '+233 (0) 33 209 4412',
  hotline_phone: '+233 (0) 24 456 7890',
  office_address:
    'Agona East Constituency Secretariat, Main Nsaba-Swedru Road, Agona Nsaba, Central Region, Ghana',
  parliament_address:
    'Room 504, 5th Floor, Job 600, Parliament House, Osu, Accra, Ghana',
  portrait_hero_url:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
  portrait_about_url:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
  portrait_community_url:
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
  about_quote:
    'Leadership is about service to the vulnerable. When we empower a child with education and support a mother with dignity, we build a nation.',
  social_links: {
    facebook: 'https://facebook.com',
    x: 'https://x.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  constituency_towns: [
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
    'Diaspora / Other',
  ],
  updated_at: '2026-11-16T12:00:00Z',
};

export const SEED_HERO_SLIDES: HeroSlideRow[] = [
  {
    id: '00000000-0000-4000-8001-000000000001',
    sort_order: 1,
    is_active: true,
    type: 'landscape',
    tag: 'Leadership with the People',
    badge_color: 'green',
    title: 'Leadership with Integrity.',
    title_highlight: 'Service with Impact.',
    description:
      'Serving the good people of Agona East with steadfast compassion, educational empowerment, and sustainable community development.',
    landscape_image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
    portrait_images: null,
    updated_at: '2026-11-16T12:00:00Z',
  },
  {
    id: '00000000-0000-4000-8001-000000000002',
    sort_order: 2,
    is_active: true,
    type: 'paired-portrait',
    tag: 'Servant Leadership & Passion',
    badge_color: 'red',
    title: 'Mama Pokua: A Mother for All,',
    title_highlight: 'A Champion for the Youth.',
    description:
      'Affectionately called "Mama Pokua", Hon. Sawyerr is renowned across the Central Region for putting the people first in every legislative decision.',
    landscape_image: null,
    portrait_images: [
      {
        src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
        caption: 'Grassroots Warmth',
      },
      {
        src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80',
        caption: 'Mama Pokua in Agona East',
      },
    ],
    updated_at: '2026-11-16T12:00:00Z',
  },
  {
    id: '00000000-0000-4000-8001-000000000003',
    sort_order: 3,
    is_active: true,
    type: 'landscape',
    tag: 'Transforming Communities',
    badge_color: 'green',
    title: 'Delivering Tangible Progress',
    title_highlight: 'Across Agona East.',
    description:
      'From clean mechanized water boreholes to maternal health clinics and school infrastructure, delivering real development to every village.',
    landscape_image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1600&q=80',
    portrait_images: null,
    updated_at: '2026-11-16T12:00:00Z',
  },
  {
    id: '00000000-0000-4000-8001-000000000004',
    sort_order: 4,
    is_active: true,
    type: 'paired-portrait',
    tag: 'Women & Grassroots Economy',
    badge_color: 'green',
    title: 'Empowering Mothers & Traders',
    title_highlight: 'with Economic Dignity.',
    description:
      'Disbursing revolving seed grants and processing equipment to thousands of market women and farming cooperatives across Agona East.',
    landscape_image: null,
    portrait_images: [
      {
        src: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80',
        caption: 'Market Women Support',
      },
      {
        src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
        caption: 'Grassroots Engagement',
      },
      {
        src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
        caption: 'Economic Independence',
      },
    ],
    updated_at: '2026-11-16T12:00:00Z',
  },
  {
    id: '00000000-0000-4000-8001-000000000005',
    sort_order: 5,
    is_active: true,
    type: 'landscape',
    tag: 'Education for Every Child',
    badge_color: 'red',
    title: 'Securing the Next Generation',
    title_highlight: 'Through Education.',
    description:
      'Over 35,000 candidates supplied with free mathematical sets and hot nutritious lunch packages during BECE examinations across 42 schools.',
    landscape_image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    portrait_images: null,
    updated_at: '2026-11-16T12:00:00Z',
  },
  {
    id: '00000000-0000-4000-8001-000000000006',
    sort_order: 6,
    is_active: true,
    type: 'paired-portrait',
    tag: 'Parliamentary Stewardship',
    badge_color: 'green',
    title: 'A Fierce Voice in the',
    title_highlight: 'Parliament of Ghana.',
    description:
      'Championing rural health subventions, road maintenance, and youth employment on the floor of the 8th Parliament with integrity.',
    landscape_image: null,
    portrait_images: [
      {
        src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80',
        caption: 'Parliamentary Caucus',
      },
      {
        src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
        caption: 'Legislative Leadership',
      },
      {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
        caption: 'Public Accountability',
      },
    ],
    updated_at: '2026-11-16T12:00:00Z',
  },
];

export const SEED_QUICK_STATS: QuickStatRow[] = [
  {
    id: '00000000-0000-4000-8002-000000000001',
    sort_order: 1,
    value: '12+',
    label: 'Years in Parliament',
    subtext: 'Continuous Dedicated Service',
  },
  {
    id: '00000000-0000-4000-8002-000000000002',
    sort_order: 2,
    value: '55,000+',
    label: 'Students Supported',
    subtext: 'BECE Math Sets & School Feeding',
  },
  {
    id: '00000000-0000-4000-8002-000000000003',
    sort_order: 3,
    value: '140+',
    label: 'Community Projects',
    subtext: 'Water, Health & Schools',
  },
  {
    id: '00000000-0000-4000-8002-000000000004',
    sort_order: 4,
    value: 'GH₵ 4.5M+',
    label: 'Women Micro-Grants',
    subtext: 'Seed Capital for Traders',
  },
];

export const SEED_CORE_VALUES: CoreValueRow[] = [
  {
    id: '00000000-0000-4000-8003-000000000001',
    sort_order: 1,
    title: 'Servant Leadership',
    description:
      'Leading not from a pedestal, but from the front lines alongside farmers, market women, youth, and traditional leaders in Agona East.',
    icon_name: 'heart',
  },
  {
    id: '00000000-0000-4000-8003-000000000002',
    sort_order: 2,
    title: 'Education for All',
    description:
      'A firm conviction that no child in Agona East should fail to realize their potential due to lack of basic learning tools or proper nutrition.',
    icon_name: 'book',
  },
  {
    id: '00000000-0000-4000-8003-000000000003',
    sort_order: 3,
    title: 'Economic Dignity',
    description:
      'Equipping women entrepreneurs and hardworking youth with financial autonomy, working capital, and marketable vocational skills.',
    icon_name: 'trending-up',
  },
  {
    id: '00000000-0000-4000-8003-000000000004',
    sort_order: 4,
    title: 'Integrity & Accountability',
    description:
      'Open, transparent representation on the floor of Parliament and prudent stewardship of public resources for grassroots development.',
    icon_name: 'shield',
  },
  {
    id: '00000000-0000-4000-8003-000000000005',
    sort_order: 5,
    title: 'Community Inclusivity',
    description:
      'Uniting all towns and farming villages across Agona East regardless of background, creed, or political affiliation.',
    icon_name: 'users',
  },
  {
    id: '00000000-0000-4000-8003-000000000006',
    sort_order: 6,
    title: 'Social Justice & Equity',
    description:
      'Fighting for equitable health infrastructure, rural electrification, clean potable water, and accessible farm-to-market feeder roads.',
    icon_name: 'scale',
  },
];

export const SEED_TIMELINE: TimelineMilestoneRow[] = [
  {
    id: '00000000-0000-4000-8004-000000000001',
    sort_order: 1,
    year: '2012',
    title: 'First Historic Parliamentary Victory',
    role: 'Elected MP for Agona East',
    description:
      'Won the parliamentary seat under the ticket of the National Democratic Congress (NDC), bringing renewed hope and accessible leadership to Agona East.',
  },
  {
    id: '00000000-0000-4000-8004-000000000002',
    sort_order: 2,
    year: '2013 – 2017',
    title: 'Deputy Central Regional Minister',
    role: 'Government of Ghana',
    description:
      'Appointed by H.E. President John Dramani Mahama. Supervised regional infrastructure development, educational monitoring, and health sector initiatives across the Central Region.',
  },
  {
    id: '00000000-0000-4000-8004-000000000003',
    sort_order: 3,
    year: '2016',
    title: 'Re-election for Second Term',
    role: 'Member of Parliament',
    description:
      'Re-elected with widespread constituent endorsement in recognition of her tireless community interventions, school feeding program, and rural health clinics.',
  },
  {
    id: '00000000-0000-4000-8004-000000000004',
    sort_order: 4,
    year: '2020',
    title: 'Landmark Third-Term Victory',
    role: 'Member of Parliament',
    description:
      'Secured an emphatic re-election mandate, solidifying her status as a resilient political pillar, passionate advocate for women, and fearless voice in the 8th Parliament of Ghana.',
  },
  {
    id: '00000000-0000-4000-8004-000000000005',
    sort_order: 5,
    year: 'Present',
    title: 'Veteran Parliamentarian & Grassroots Icon',
    role: 'Parliamentary Committee Member',
    description:
      'Serving with distinction on key parliamentary committees including Youth, Sports & Culture and the Privileges Committee, while continuously delivering high-impact projects in Agona East.',
  },
];

export const SEED_PROJECTS: ProjectRow[] = [
  {
    id: '00000000-0000-4000-8005-000000000001',
    slug: 'school-feeding-bece',
    title: 'Maame Pokua School Feeding & BECE Candidate Support Program',
    short_description:
      'Annual distribution of over 3,500 mathematical sets, revision materials, and daily warm nutritious meals to all BECE candidates across Agona East.',
    category: 'Education',
    impact_metric: '35,000+ Students Reached',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    completion_year: 'Ongoing Annual Initiative',
    location: 'All 42 Junior High Schools in Agona East',
    beneficiaries_count: '35,000+ candidates over 10 years',
    full_description:
      'Initiated over a decade ago by Hon. Queenstar Maame Pokua Sawyerr, this flagship intervention addresses the critical socio-economic barriers faced by rural candidates preparing for the Basic Education Certificate Examination (BECE). Every examination season, candidates across public and private schools receive mathematical instruments, pens, clipboards, and are provided with daily nourishing hot meals during mock exams and the official examination week. This has dramatically improved exam pass rates and boosted student confidence throughout Agona East.',
    key_highlights: [
      'Over 3,500 candidates supplied with certified mathematical sets and study stationery annually',
      'Nutritious hot lunch provided to students during the entire examination period',
      'Free specialized district mock examinations conducted prior to BECE',
      'Financial prizes awarded to top-performing girls and boys in the district',
    ],
    gallery_images: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=80',
    ],
    testimonial: {
      quote:
        "Mama Pokua's mock exams and free math sets took away all my anxiety before BECE. Today I am at Wesley Girls High School because she believed in us.",
      author: 'Abena Mensah',
      role: 'Alumna, Agona Nsaba Presby JHS',
    },
    is_flagship: true,
    sort_order: 1,
    is_published: true,
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-06-01T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8005-000000000002',
    slug: 'women-microfinance-traders',
    title: 'Agona East Women Economic Empowerment & Seed Capital Fund',
    short_description:
      'Revolving interest-free micro-credit and business training empowering market women, petty traders, and agricultural processors.',
    category: 'Women & Economy',
    impact_metric: 'GH₵ 4.5M+ Seed Capital',
    image:
      'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
    completion_year: '2015 – Present',
    location: 'Nsaba, Duakwa, Kwanyako, and Mankrong Markets',
    beneficiaries_count: '4,800+ Female Entrepreneurs',
    full_description:
      'Recognizing that women are the economic engine of Agona East, Hon. Sawyerr established the Women Economic Empowerment Fund. The program gives women working in markets and cottage industries interest-free loans and matching grants to restock goods, purchase processing equipment (such as cassava grating machines and palm kernel presses), and stabilize household livelihoods.',
    key_highlights: [
      'Provided financial relief grants to 4,800+ market traders across Agona East markets',
      'Donation of mechanized cassava graters and corn mills to women cooperatives in 8 villages',
      'Practical bookkeeping and savings group workshops conducted in local languages',
      'Zero defaults through a peer-guaranteed communal solidarity lending model',
    ],
    gallery_images: [
      'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    ],
    testimonial: {
      quote:
        'When the market fire destroyed my shed, Mama Pokua visited us that very evening and gave us capital to restart. She is truly a mother to Agona East.',
      author: 'Madam Comfort Baidoo',
      role: 'Agona Duakwa Market Queenmother',
    },
    is_flagship: false,
    sort_order: 2,
    is_published: true,
    created_at: '2024-05-15T10:00:00Z',
    updated_at: '2024-05-15T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8005-000000000003',
    slug: 'maternal-health-chps',
    title: 'Rural Maternal Healthcare & CHPS Compounds Modernization',
    short_description:
      'Refurbishing and equipping Community-Based Health Planning and Services (CHPS) compounds with solar power, delivery beds, and medical consumables.',
    category: 'Healthcare',
    impact_metric: '18 Health Posts Upgraded',
    image:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    completion_year: '2018 – Ongoing',
    location: 'Agona Asafo, Mankrong Junction, Akotsi, Otinkorang',
    beneficiaries_count: '60,000+ Constituents',
    full_description:
      'To eliminate preventable maternal and infant deaths in remote farming settlements, Hon. Queenstar Maame Pokua Sawyerr has prioritized healthcare infrastructure. She has spearheaded the construction of new maternal wards, donation of hydraulic delivery beds, supply of infant incubators to district health centres, and installation of solar power systems to keep vaccines and delivery lights working through grid outages.',
    key_highlights: [
      '18 rural CHPS compounds refurbished and supplied with essential medical kits',
      'Solar panels installed in 9 off-grid health clinics for 24/7 delivery lighting',
      'Donation of emergency patient transport tricycles and district ambulance support',
      'Organized annual free medical screenings for diabetes, hypertension, and eye care',
    ],
    gallery_images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=80',
    ],
    testimonial: {
      quote:
        'Expectant mothers in Otinkorang used to travel over 15 kilometers on dirt roads during labor. Today we deliver safely with solar lights in our own community.',
      author: 'Nurse Gifty Addo',
      role: 'Senior Midwife, Agona East Health Directorate',
    },
    is_flagship: false,
    sort_order: 3,
    is_published: true,
    created_at: '2024-04-20T10:00:00Z',
    updated_at: '2024-04-20T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8005-000000000004',
    slug: 'solar-water-boreholes',
    title: 'Clean Water for All: Solar-Powered Mechanized Water Systems',
    short_description:
      'Installation of 32 mechanized solar water boreholes with high-capacity storage tanks providing potable water to farming communities.',
    category: 'Infrastructure',
    impact_metric: '32 Mechanized Boreholes',
    image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
    completion_year: '2020 – 2024',
    location: 'Agona Kwanyako, Seth Okai, Fante Bawjiase, Ninta',
    beneficiaries_count: '45,000+ Residents',
    full_description:
      "Water-borne diseases and hours spent by children fetching water from rivers before school have been significantly mitigated through Hon. Sawyerr's Clean Water initiative. By drilling industrial boreholes powered by renewable solar pumps connected to overhead storage tanks, entire communities now enjoy potable running water within steps of their homes.",
    key_highlights: [
      '32 high-capacity solar-powered mechanized boreholes constructed and operational',
      'Drastic reduction in waterborne illnesses reported by local health centres',
      'Children, especially school-age girls, saved hours of walking to muddy streams',
      'Local water management committees trained in each town for long-term sustainability',
    ],
    gallery_images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    ],
    testimonial: {
      quote:
        'Our school children no longer arrive late or fall sick from stream water. We bless Mama Pokua for giving our village this priceless gift of clean water.',
      author: 'Nana Kwesi Badu II',
      role: 'Chief of Seth Okai Community',
    },
    is_flagship: false,
    sort_order: 4,
    is_published: true,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8005-000000000005',
    slug: 'youth-vocational-skills',
    title: 'Agona East Youth Apprenticeship & Artisan Tool Kits Scheme',
    short_description:
      'Sponsoring apprenticeships and distributing free sewing machines, hairdryers, auto-mechanic sets, and masonry tool kits to graduating youth.',
    category: 'Youth & Skills',
    impact_metric: '2,200+ Artisans Equipped',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    completion_year: 'Ongoing',
    location: 'Constituency-Wide across Agona East',
    beneficiaries_count: '2,200+ Young Men and Women',
    full_description:
      'Youth unemployment requires actionable solutions. Through this scheme, Hon. Sawyerr pays apprenticeship fees for vulnerable youth with master craftsmen, and upon graduation, provides them with complete professional start-up tool kits—empowering them to open their own enterprises.',
    key_highlights: [
      'Full payment of apprenticeship master fees for over 1,200 youth',
      'Donation of 1,500+ industrial and domestic sewing machines and dryers',
      'Distribution of mechanic toolboxes, electrical testers, and masonry trowels',
      'Financial management seminars for budding young self-employed contractors',
    ],
    gallery_images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    ],
    testimonial: {
      quote:
        'I finished my tailoring apprenticeship with nothing to buy a machine. Mama Pokua bought me my first machine and paid my graduation dues. Today I employ three others.',
      author: 'Kofi Asare',
      role: 'Fashion Designer, Agona Nsaba',
    },
    is_flagship: false,
    sort_order: 5,
    is_published: true,
    created_at: '2024-02-05T10:00:00Z',
    updated_at: '2024-02-05T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8005-000000000006',
    slug: 'feeder-roads-culverts',
    title: 'Farm-to-Market Feeder Roads & Bridge Rehabilitation',
    short_description:
      'Constructing reinforced culverts, bridges, and shaping unpaved feeder roads to allow farmers to transport produce to urban market centers.',
    category: 'Infrastructure',
    impact_metric: '75+ km Roads Shaped',
    image:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    completion_year: '2019 – Present',
    location: 'Nsaba-Kwanyako Bypass, Duakwa-Akroso Corridor, Mankrong',
    beneficiaries_count: '30,000+ Farmers & Drivers',
    full_description:
      'Agona East is a vital food basket producing cocoa, cassava, maize, plantain, and vegetables. To prevent post-harvest losses caused by impassable muddy roads during the rainy season, Hon. Sawyerr has facilitated continuous road grading, ditch clearing, and built critical drainage culverts.',
    key_highlights: [
      'Construction of 14 reinforced concrete culverts preventing flood washouts',
      'Re-graveling and shaping of critical farm feeder road links across the district',
      'Continuous advocacy in Parliament for government road contractor mobilizations',
      'Immediate emergency repairs following devastating heavy rains',
    ],
    gallery_images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    ],
    testimonial: {
      quote:
        'During harvest season our cocoa used to rot in the bush because vehicles refused to ply our roads. The new culvert and grading saved our livelihood.',
      author: 'Opanin Yaw Mensah',
      role: 'Agona East Cocoa Farmers Association',
    },
    is_flagship: false,
    sort_order: 6,
    is_published: true,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
];

export const SEED_NEWS: NewsArticleRow[] = [
  {
    id: '00000000-0000-4000-8006-000000000001',
    slug: 'bece-2024-distribution',
    title:
      'Hon. Queenstar Pokua Sawyerr Distributes Mathematical Sets to Over 3,500 BECE Candidates in Agona East',
    published_date: 'July 14, 2024',
    category: 'Education',
    read_time: '4 min read',
    thumbnail:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    excerpt:
      'The Member of Parliament reaffirmed her 12-year tradition of personally visiting every examination center in the constituency to motivate candidates and provide free examination supplies.',
    content: [
      'In continuation of her flagship educational intervention that has spanned more than a decade, the Member of Parliament for Agona East, Hon. Queenstar Maame Pokua Sawyerr, has distributed over 3,500 mathematical sets, clipboards, pens, and pencils to all registered candidates preparing for the 2024 Basic Education Certificate Examination (BECE) across the district.',
      'Addressing candidates and teachers at Agona Nsaba Presby JHS and Agona Duakwa Catholic JHS, Hon. Sawyerr urged the students to discard fear and approach every paper with calm self-confidence. "You have studied diligently. God has granted you wisdom, and we your parents and leaders are standing behind you with prayers and total support," she passionately stated.',
      "In addition to the stationery distribution, Hon. Sawyerr made arrangements for candidates in distant communities to receive warm lunch packages throughout the examination week, ensuring that hunger does not impede any student's academic performance.",
      "District Education Director and headteachers present commended the MP for her unwavering consistency over 12 consecutive years, noting that Agona East has seen a marked improvement in academic performance and girls' transition to senior high schools.",
    ],
    featured: true,
    author: 'Constituency Communications Directorate',
    tags: ['Education', 'BECE', 'Youth Empowerment', 'Mama Pokua'],
    is_published: true,
    created_at: '2024-07-14T09:00:00Z',
    updated_at: '2024-07-14T09:00:00Z',
  },
  {
    id: '00000000-0000-4000-8006-000000000002',
    slug: 'solar-water-inauguration',
    title:
      'Clean Potable Water Commissioned in Four Remote Farming Enclaves Across Agona East',
    published_date: 'May 28, 2024',
    category: 'Community',
    read_time: '3 min read',
    thumbnail:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
    excerpt:
      'Over 6,000 residents celebrate as modern solar mechanized water systems replace distant muddy streams in Seth Okai, Ninta, and adjacent settlements.',
    content: [
      'Excitement and heartfelt gratitude echoed through the farming communities of Seth Okai and Ninta as Hon. Queenstar Maame Pokua Sawyerr officially commissioned four new solar-powered mechanized water facilities.',
      'Prior to this intervention, women and school children had to trek several kilometers daily to fetch untreated water from local rivers, which frequently led to outbreaks of bilharzia and other water-borne ailments.',
      'Speaking at the grand commissioning durbar attended by chiefs, queenmothers, and community leaders, Hon. Sawyerr underscored her belief that access to clean drinking water is a fundamental human right. "No mother should worry about whether the water she gives her infant child is safe to drink," she said.',
      'The facilities feature 10,000-liter overhead storage tanks, multi-point stainless steel tap stands, and independent solar inverter arrays that ensure uninterrupted water flow even during regional power outages.',
    ],
    featured: false,
    author: 'Constituency Communications Directorate',
    tags: ['Water', 'Infrastructure', 'Healthcare', 'Agona East'],
    is_published: true,
    created_at: '2024-05-28T09:00:00Z',
    updated_at: '2024-05-28T09:00:00Z',
  },
  {
    id: '00000000-0000-4000-8006-000000000003',
    slug: 'parliament-health-funding-motion',
    title:
      'Parliamentary Debate: Hon. Sawyerr Demands Accelerated Release of NHIS Subventions for Rural Health Facilities',
    published_date: 'March 19, 2024',
    category: 'Parliament',
    read_time: '5 min read',
    thumbnail:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    excerpt:
      'On the floor of Parliament, Hon. Sawyerr passionately articulated the plight of district clinics and called on the Ministry of Finance to prioritize rural healthcare subventions.',
    content: [
      'Speaking during the parliamentary debate on the National Health Insurance Authority formula, Hon. Queenstar Maame Pokua Sawyerr raised severe concerns over prolonged delays in reimbursing healthcare providers in rural constituencies.',
      'Hon. Sawyerr pointed out that district hospitals and CHPS compounds in constituencies like Agona East bear the brunt of delayed disbursements, forcing facility administrators to rely on high-interest credit lines to maintain supplies of basic medications and maternity supplies.',
      '"Mr. Speaker, our rural folks pay their dues to this country. When a farmer or market woman in Agona East falls ill, the NHIS card must not be turned away because funds have not been transferred to the service providers," Hon. Sawyerr emphasized to bipartisan applause.',
      'Her advocacy led to high-level assurances from the leadership of the House to engage the Ministry of Finance for expedited clearance of verified claims.',
    ],
    featured: false,
    author: 'Parliamentary Press Corps',
    tags: ['Parliament', 'Healthcare', 'Good Governance', 'Central Region'],
    is_published: true,
    created_at: '2024-03-19T09:00:00Z',
    updated_at: '2024-03-19T09:00:00Z',
  },
  {
    id: '00000000-0000-4000-8006-000000000004',
    slug: 'market-women-grant-disbursement',
    title:
      'Over 500 Agona East Market Women Receive Seed Capital and Processing Machines in Agona Duakwa',
    published_date: 'January 12, 2024',
    category: 'Community',
    read_time: '4 min read',
    thumbnail:
      'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
    excerpt:
      'Hon. Queenstar Maame Pokua Sawyerr expands the Women Economic Empowerment Scheme to mitigate inflationary pressures on small traders.',
    content: [
      'In a bid to cushion local traders against economic hardship and high inflation, Hon. Queenstar Maame Pokua Sawyerr spearheaded a major disbursement of non-repayable seed grants and industrial processing equipment to over 500 women traders in Agona Duakwa and surrounding villages.',
      'The package included heavy-duty motorized cassava grating machines, corn millers, commercial sewing machines, and cash grants directly distributed to market cooperatives.',
      'Beneficiary women sang traditional songs of praise for "Mama Pokua", recounting how her continuous backing has sustained their families through tough times. Hon. Sawyerr urged the women to organize into trade credit groups to multiply the benefits.',
    ],
    featured: false,
    author: 'Constituency Communications Directorate',
    tags: ['Women Empowerment', 'Microfinance', 'Agona Duakwa', 'Economy'],
    is_published: true,
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
  },
  {
    id: '00000000-0000-4000-8006-000000000005',
    slug: 'akwambo-festival-speech',
    title:
      'Agona East Annual Akwambo Festival: Hon. Sawyerr Reaffirms Commitment to Peace, Culture, and Inclusive Growth',
    published_date: 'October 15, 2023',
    category: 'Press Release',
    read_time: '3 min read',
    thumbnail:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
    excerpt:
      'Joining the traditional council at the colourful Akwambo festival celebration, the MP called for unity and shared progress across Agona East.',
    content: [
      'Clad in exquisite traditional Ghanaian attire, Hon. Queenstar Maame Pokua Sawyerr was warmly received by the chiefs, queenmothers, and constituents at the annual Akwambo festival in Agona Nsaba.',
      'In her keynote message, she highlighted the rich heritage of the Agona people and paid homage to the ancestral trailblazers whose courage cleared paths for current generations.',
      'She pledged her sustained partnership with the traditional authorities to lobby for enhanced road infrastructure, modern sanitation facilities, and expanded youth employment opportunities across Agona East.',
    ],
    featured: false,
    author: 'Constituency Secretariat',
    tags: ['Culture', 'Akwambo', 'Unity', 'Agona Nsaba'],
    is_published: true,
    created_at: '2023-10-15T09:00:00Z',
    updated_at: '2023-10-15T09:00:00Z',
  },
];

export const SEED_BLOG_POSTS: BlogPostRow[] = [
  {
    id: '00000000-0000-4000-8007-000000000001',
    title:
      "The Agona East Educational Renaissance: Why Nutrition and Basic Tools Determine a Child's Future",
    slug: 'agona-east-educational-renaissance-nutrition-basic-tools',
    category: 'Education & Youth',
    publish_date: 'October 14, 2024',
    read_time: '6 min read',
    cover_image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    excerpt:
      'A hungry child cannot master algebra, and a candidate without mathematical instruments enters the examination hall defeated before the bell rings. Over the past decade, our annual BECE interventions have demonstrated that educational equity is not about complex rhetoric—it begins with dignity in the classroom.',
    author_name: 'Hon. Queenstar Maame Pokua Sawyerr',
    author_role: 'Member of Parliament, Agona East Constituency',
    author_avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    featured_quote:
      'True empowerment does not trickle down from distant offices in Accra. It is planted when a child in Duakwa receives a school desk, a nutritious hot meal, and the quiet assurance that their dreams matter to their Member of Parliament.',
    tags: ['Education', 'BECE Candidates', 'Youth Development', 'Agona East', 'Rural Equity'],
    content: [
      'Every August when the Basic Education Certificate Examination (BECE) approaches, I am reminded of why I first sought public office. Education in rural Ghana has never suffered from a deficit of intellectual ambition. Our boys and girls in Agona Nsaba, Kwanyako, and Duakwa possess identical curiosities and raw cognitive potential as their counterparts in Cantonments or Airport Residential. What separates them is not capacity, but the quiet, grinding friction of basic material deprivation.',
      'Over a decade ago, during one of my early constituency tours through our basic schools, I watched a brilliant young girl in a farming village struggling through a mock mathematics examination. She was borrowing a wooden ruler from her classmate every few minutes, her hands trembling with anxiety as the clock ticked. When I asked her teachers why so many candidates were unprepared with standardized mathematical sets, the answer was heartbreakingly simple: for a subsistence cocoa farming family with three school-going children, purchasing certified compasses, dividers, and protractors represents a choice between exam tools and dinner.',
      'That afternoon, the "Maame Pokua School Feeding & BECE Candidate Support Initiative" was born. We made a binding commitment that no student across all 42 Junior High Schools in Agona East would ever sit for the BECE without certified geometry sets, writing materials, and a warm nutritious hot meal served right at their examination centers.',
      "Critics occasionally ask whether providing mathematical instruments and hot lunches is \"substantive policy.\" To that, I respond with the official WAEC examination statistics of Agona East over the past ten years. When you alleviate the visceral terror of hunger and exam unpreparedness, pass rates ascend. Girls who previously dropped out after basic school now gain admissions into Wesley Girls, Holy Child, Mfantsiman, and Swedru Senior High School. Several of our earliest beneficiaries have now completed university degrees in nursing, engineering, and education, returning to Agona East as professionals.",
      'As we look ahead, the challenge before our educational system is modernization. We must connect our rural schools to digital literacy labs and equip our teachers with contemporary pedagogical tools. But even as we aspire to artificial intelligence and code in the curriculum, we must never forget the foundational truth: dignity begins with a desk, a book, a meal, and a leader who refuses to let any child be left behind.',
    ],
    status: 'published',
    created_at: '2024-10-14T10:00:00Z',
    updated_at: '2024-10-14T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8007-000000000002',
    title:
      'A Decade on the Frontlines: Decentralisation and What True Grassroots Representation Demands',
    slug: 'decade-on-the-frontlines-decentralisation-grassroots-representation',
    category: 'Legislative Insights',
    publish_date: 'September 22, 2024',
    read_time: '8 min read',
    cover_image:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    excerpt:
      'The primary duty of a Member of Parliament is constitutional legislation, but for a rural representative, parliament begins at the durbar ground and ends by the bedside of a sick constituent. Here are my reflections on balancing parliamentary scrutiny in Accra with everyday community advocacy.',
    author_name: 'Hon. Queenstar Maame Pokua Sawyerr',
    author_role: 'Member of Parliament, Agona East Constituency',
    author_avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    featured_quote:
      'Legislation drafted in the air-conditioned chambers of Job 600 must withstand the scrutiny of a cocoa farmer in Mankrong. If our laws do not lower the cost of living or improve the price of produce, we are merely engaging in sophisticated theatre.',
    tags: ['Parliament of Ghana', 'Governance', 'Decentralisation', 'Constituency Realities'],
    content: [
      'In political science textbooks, the constitutional role of a Ghanaian parliamentarian is neatly categorized into three pillars: legislation, oversight, and representation. In the chamber of Parliament, we debate appropriation bills, interrogate ministerial budgets, and serve on standing and select committees. But the moment you cross the Ayensu river into Agona East, the abstract theories of constitutional governance are immediately tested against the lived realities of our people.',
      'In a rural district, your constituents do not measure your parliamentary tenure solely by how many hansard pages feature your interventions—though legislative vigilance is paramount. They measure leadership by whether the bridge linking their farm gate to the market was repaired before the heavy rains washed away their cassava harvest. They judge your stewardship by whether the community CHPS compound has a reliable nurse and maternal delivery bed.',
      'During my tenure as Deputy Central Regional Minister, I supervised regional development projects across twenty-two administrative districts. That executive experience reinforced my conviction that true decentralisation in Ghana remains incomplete. Local assemblies frequently struggle with delayed Common Fund disbursements, forcing Members of Parliament to shoulder responsibilities that ideally belong to municipal statutory budgets.',
      'Rather than complaining about institutional limitations, I chose the path of active grassroots partnership. By working hand-in-hand with our revered chiefs, queen mothers, assembly members, and unit committee heads, we have prioritized high-yield community infrastructure: over 140 mechanized boreholes, rural health compound refurbishments, and school infrastructure repairs.',
      'Our democracy is strongest when the distance between the lawmaker and the citizen is dissolved. Whenever I sit under the shade of a neem tree during community durbars listening to our elders and youth, I am reminded that public service is not a privilege of rank; it is a sacred covenant of accountability.',
    ],
    status: 'published',
    created_at: '2024-09-22T10:00:00Z',
    updated_at: '2024-09-22T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8007-000000000003',
    title:
      "Unlocking Rural Wealth: Why Investing Directly in Market Women Yields Ghana's Highest Societal Returns",
    slug: 'unlocking-rural-wealth-investing-directly-in-market-women',
    category: 'Women Empowerment',
    publish_date: 'August 18, 2024',
    read_time: '5 min read',
    cover_image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    excerpt:
      'When an informal market trader in Agona Nsaba or Kwanyako receives interest-free seed capital, the dividend is immediate: school fees are paid, clinic visits are settled, and local food supply chains stay alive. Women are not just economic participants—they are the shock absorbers of our rural economy.',
    author_name: 'Hon. Queenstar Maame Pokua Sawyerr',
    author_role: 'Member of Parliament, Agona East Constituency',
    author_avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    featured_quote:
      'Give a woman trader working capital and she does not merely expand her stall; she transforms her household, educates her children, and stabilises the entire community.',
    tags: ['Women in Trade', 'Microfinance', 'Rural Economy', 'Livelihoods', 'Agona Nsaba'],
    content: [
      'Walk through the Agona Nsaba or Swedru markets at 5:00 AM on a market day, and you will observe the true economic engine of Ghana. Long before government ministries unlock their doors, hundreds of women are already offloading plantain, smoked fish, palm oil, and fresh vegetables transported from surrounding farming hamlets. These women operate on margins that would astonish commercial bankers, yet their repayment discipline and resourcefulness are peerless.',
      'For years, commercial financial institutions have treated the informal market woman as high-risk, demanding collateral that rural women rarely possess. When they are forced to borrow from predatory informal lenders, exorbitant interest rates swallow their profits before their merchandise is even sold.',
      'Recognizing this structural barrier, we instituted the Agona East Women Economic Empowerment & Seed Capital Fund. The mechanism is intentionally straightforward: providing structured, interest-free micro-grants and rotating credit directly to organized market associations and trade groups, paired with essential financial literacy training.',
      'The results have been transformative. Over GH₵ 4.5 million in cumulative seed capital has circulated through the hands of over 6,500 petty traders, gari processors, bakers, and seamstresses across Agona East. Default rates are near zero because the program is anchored on mutual trust, community co-guarantee, and transparent oversight.',
      "When you empower a woman financially, the return on investment is multi-generational. Her profits do not disappear into speculative ventures; they are reinvested in children's school uniforms, NHIS cards, and nutritious family meals. Sustainable national development will remain an illusion until we place rural women at the center of fiscal strategy.",
    ],
    status: 'published',
    created_at: '2024-08-18T10:00:00Z',
    updated_at: '2024-08-18T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8007-000000000004',
    title:
      'Beyond the Floor of the House: Bringing Safe Water and Maternal Health to Every Hamlet',
    slug: 'bringing-safe-water-maternal-health-hamlet-agona-east',
    category: 'Rural Development',
    publish_date: 'July 05, 2024',
    read_time: '7 min read',
    cover_image:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    excerpt:
      'A CHPS compound without running potable water or reliable solar lighting is only half an answer to rural healthcare. Over 140 mechanized boreholes later, our fight for health infrastructure continues to redefine community resilience across Agona East.',
    author_name: 'Hon. Queenstar Maame Pokua Sawyerr',
    author_role: 'Member of Parliament, Agona East Constituency',
    author_avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    featured_quote:
      'Access to clean drinking water is not a political favor. It is a fundamental human right that protects mothers, children, and the dignity of rural living.',
    tags: ['Healthcare', 'Potable Water', 'Infrastructure', 'Public Health', 'Maternal Health'],
    content: [
      'In many rural farming communities across Central Region, preventable waterborne diseases such as cholera, bilharzia, and dysentery have historically extracted an unacceptable toll on productivity and human life. When school-going girls spend two hours every dawn carrying heavy buckets from polluted streams, their classroom attendance suffers before the school day even commences.',
      'Early in my first term as Member of Parliament, I resolved that clean water access must be treated with the urgency of a public health emergency. We initiated a sustained campaign to drill and commission mechanized boreholes across underserved settlements in Agona East. Today, with over 140 operational water facilities delivering potable water to tens of thousands of households, water-related hospital admissions in our district health centers have declined dramatically.',
      'Simultaneously, we focused our energy on rural maternal healthcare. No woman should risk complications or loss of life while bringing a new citizen into this world simply because a clinic lacks a functional delivery bed or solar lighting during a midnight blackout. By equipping local CHPS compounds with clean solar systems, sterile maternity wards, and providing essential medical supplies, we are restoring hope to expectant mothers.',
      'Quality healthcare cannot be the exclusive preserve of urban centers. Every citizen in Agona East, no matter how remote their village, deserves to know that when their child falls ill, professional medical care and clean water are within reach.',
    ],
    status: 'published',
    created_at: '2024-07-05T10:00:00Z',
    updated_at: '2024-07-05T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8007-000000000005',
    title:
      'The Dignity of Artisanship: Re-imagining Youth Employment Through Apprenticeship',
    slug: 'dignity-of-artisanship-reimagining-youth-employment-apprenticeship',
    category: 'Community Reflections',
    publish_date: 'May 30, 2024',
    read_time: '6 min read',
    cover_image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    excerpt:
      'Not every talented young person in Agona East will sit in a tertiary lecture hall, but every young person possesses hands capable of building, fabricating, designing, and creating enterprise. How our master-apprentice sponsorship model is creating self-reliant livelihoods.',
    author_name: 'Hon. Queenstar Maame Pokua Sawyerr',
    author_role: 'Member of Parliament, Agona East Constituency',
    author_avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    featured_quote:
      'Equipping a young man or woman with a trade and their own startup equipment breaks the cycle of generational dependency more effectively than any temporary handout.',
    tags: ['Youth Employment', 'Vocational Skills', 'Apprenticeship', 'Local Industry', 'Agona Kwanyako'],
    content: [
      "Ghana's youth unemployment crisis cannot be resolved solely through white-collar public sector recruitment. While tertiary education remains vital, our communities possess an immense, often undervalued reservoir of practical talent in masonry, carpentry, fashion design, electrical installation, cosmetology, and modern automotive mechanics.",
      'Too often, ambitious young school leavers who wish to learn a vocation are turned away because their families cannot afford the apprenticeship registration fees or the necessary starter toolkits. To bridge this gap, we established the Agona East Youth Apprenticeship Sponsorship Scheme.',
      'We partner directly with accredited master craftsmen and seasoned trade associations. We cover full apprenticeship fees for selected youth, monitor their training progression, and upon graduation, present each certified artisan with complete professional start-up toolkits—industrial sewing machines, hair dryers, masonry kits, and welding equipment.',
      'Over 1,200 young men and women across Agona East have graduated from this program into economic independence. Many have established their own workshops and are now training younger apprentices. This is the multiplier effect of targeted public investment: turning job seekers into job creators right in their home communities.',
    ],
    status: 'published',
    created_at: '2024-05-30T10:00:00Z',
    updated_at: '2024-05-30T10:00:00Z',
  },
];

export const SEED_GALLERY: GalleryItemRow[] = [
  {
    id: '00000000-0000-4000-8008-000000000001',
    title: 'BECE Candidates Stationery & Nutrition Distribution',
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    date: 'July 2024',
    location: 'Agona Nsaba Presby JHS',
    caption:
      'Hon. Queenstar Maame Pokua Sawyerr presenting mathematical sets and study guides to final-year candidates.',
    sort_order: 1,
    is_published: true,
    created_at: '2024-07-15T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000002',
    title: 'Market Women Traders Empowerment Session',
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1000&q=80',
    date: 'January 2024',
    location: 'Agona Duakwa Central Market',
    caption:
      'Engaging with market queenmothers and distributing microfinance grants to petty traders.',
    sort_order: 2,
    is_published: true,
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000003',
    title: 'Commissioning of Solar-Powered Mechanized Water Project',
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1000&q=80',
    date: 'May 2024',
    location: 'Seth Okai Community',
    caption:
      'Official handover of 10,000-liter clean water borehole facility to the town development committee.',
    sort_order: 3,
    is_published: true,
    created_at: '2024-05-29T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000004',
    title: 'Floor of Parliament: Committee Debates on Public Welfare',
    category: 'Parliament',
    image:
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
    date: 'March 2024',
    location: 'Parliament House, Accra',
    caption:
      'Hon. Sawyerr articulating constitutional and district development priorities on the floor of the House.',
    sort_order: 4,
    is_published: true,
    created_at: '2024-03-20T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000005',
    title: 'Rural Maternal Health Ward Handover & Medical Supply Delivery',
    category: 'Healthcare',
    image:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    date: 'November 2023',
    location: 'Agona Asafo CHPS Compound',
    caption:
      'Handing over newly renovated maternity ward equipped with solar lighting and hydraulic delivery beds.',
    sort_order: 5,
    is_published: true,
    created_at: '2023-11-12T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000006',
    title: 'Youth Vocational Graduation & Tool Kits Presentation',
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    date: 'December 2023',
    location: 'Agona Kwanyako Community Center',
    caption:
      'Presenting sewing machines and artisan start-up kits to 150 young men and women apprentices.',
    sort_order: 6,
    is_published: true,
    created_at: '2023-12-10T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000007',
    title: 'Akwambo Festival Grand Durbar of Chiefs',
    category: 'Festivals',
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
    date: 'October 2023',
    location: 'Agona Nsaba Palace Grounds',
    caption:
      'Hon. Sawyerr paying homage to the Paramount Chief and traditional elders during the Akwambo festivities.',
    sort_order: 7,
    is_published: true,
    created_at: '2023-10-16T10:00:00Z',
  },
  {
    id: '00000000-0000-4000-8008-000000000008',
    title: 'Grassroots Community Engagement and Town Hall Gathering',
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    date: 'August 2023',
    location: 'Mankrong Junction',
    caption:
      'Listening directly to farmers, drivers, and teachers during regular constituency tour.',
    sort_order: 8,
    is_published: true,
    created_at: '2023-08-22T10:00:00Z',
  },
];

export const SEED_INQUIRIES: ContactInquiryRow[] = [
  {
    id: '00000000-0000-4000-8009-000000000001',
    reference_number: 'AE-104829',
    full_name: 'Kwame Boateng',
    email: 'kwame.boateng@example.gh',
    phone: '+233 24 412 8891',
    town: 'Agona Nsaba (Capital)',
    category: 'BECE / School Support',
    message:
      'Good afternoon Secretariat. The PTA of Nsaba Methodist JHS wishes to submit our updated candidate register of 118 pupils for the upcoming BECE support distribution.',
    volunteer: false,
    status: 'new',
    internal_notes: '',
    created_at: '2026-11-16T14:22:00Z',
  },
  {
    id: '00000000-0000-4000-8009-000000000002',
    reference_number: 'AE-104812',
    full_name: 'Abena Korkor Mensah',
    email: 'abena.mensah@example.gh',
    phone: '+233 54 780 3310',
    town: 'Agona Duakwa',
    category: 'Women Micro-Grant Inquiry',
    message:
      'Our 24-member Duakwa Gari Processors Cooperative would like to apply for the next tranche of mechanized cassava graters and revolving seed capital.',
    volunteer: true,
    status: 'in_review',
    internal_notes:
      'Forwarded cooperative list to Women Empowerment Desk Officer for field verification on Thursday.',
    created_at: '2026-11-14T09:40:00Z',
  },
  {
    id: '00000000-0000-4000-8009-000000000003',
    reference_number: 'AE-104755',
    full_name: 'Nana Yaw Osei',
    email: '',
    phone: '+233 20 918 4402',
    town: 'Seth Okai',
    category: 'Community Project Suggestion',
    message:
      'The borehole committee requests a routine solar inverter inspection before the harmattan dry season peaks.',
    volunteer: false,
    status: 'resolved',
    internal_notes:
      'District technician inspected pump and replaced battery terminal on 12th.',
    created_at: '2026-11-08T16:15:00Z',
  },
  {
    id: '00000000-0000-4000-8009-000000000004',
    reference_number: 'AE-104790',
    full_name: 'Gifty Appiah',
    email: 'gifty.appiah@example.gh',
    phone: '+233 27 334 9021',
    town: 'Agona Kwanyako',
    category: 'Media & Press Interview',
    message:
      'Requesting a 15-minute radio interview slot with Hon. Sawyerr on Central Morning Dialogue regarding the rural NHIS subvention motion.',
    volunteer: false,
    status: 'new',
    internal_notes: '',
    created_at: '2026-11-15T11:05:00Z',
  },
];

export const SEED_SUBSCRIBERS: NewsletterSubscriberRow[] = [
  {
    id: '00000000-0000-4000-8010-000000000001',
    email: 'kofi.amoah@agonaeast.org',
    source: 'blog',
    subscribed_at: '2026-11-12T08:15:00Z',
  },
  {
    id: '00000000-0000-4000-8010-000000000002',
    email: 'adjoa.baidoo@gmail.com',
    source: 'footer',
    subscribed_at: '2026-11-10T17:45:00Z',
  },
  {
    id: '00000000-0000-4000-8010-000000000003',
    email: 'press@centralregionvoice.gh',
    source: 'blog',
    subscribed_at: '2026-11-09T11:30:00Z',
  },
  {
    id: '00000000-0000-4000-8010-000000000004',
    email: 'nsaba.youth.league@yahoo.com',
    source: 'footer',
    subscribed_at: '2026-11-05T14:20:00Z',
  },
];
