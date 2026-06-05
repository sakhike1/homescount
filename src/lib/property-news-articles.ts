import { newsImages } from '@/lib/news-images'

export type PropertyNewsArticle = {
  slug: string
  title: string
  excerpt: string
  image: string
  imageAlt: string
  category: 'News' | 'Analysis' | 'Market outlook'
  publishedAt: string
  readMinutes: number
  featured: boolean
  body: string[]
  sources: { label: string; url: string }[]
}

export const propertyNewsArticles: PropertyNewsArticle[] = [
  {
    slug: 'property-industry-interest-rate-reaction',
    title: 'Property industry reacts to latest interest rate hike',
    excerpt:
      'The latest interest rate hike has been met with mixed reactions from the property industry, with some experts warning of a slowdown in the market.',
    image: newsImages.featured.rates,
    imageAlt: 'Modern residential property exterior',
    category: 'News',
    publishedAt: '2026-06-02',
    readMinutes: 5,
    featured: true,
    body: [
      'South Africa’s property sector is recalibrating after the Reserve Bank raised the repo rate amid rising fuel costs and inflationary pressure. While earlier in 2026 the Monetary Policy Committee held rates at 6.75%, global oil shocks and higher energy prices pushed consumer inflation back up — leading to renewed concern about bond repayments and buyer affordability.',
      'Industry leaders note that even before the latest move, many buyers and estate agents had hoped for further cuts to stimulate activity after the easing cycle that ran from late 2024 through November 2025. RE/MAX Southern Africa’s Adrian Goslett said holding or raising rates adds pressure on households already dealing with a higher cost of living, particularly first-time buyers trying to enter the market.',
      'On the other hand, analysts at Property24 and Pam Golding Property Group point out that the market has remained resilient. National purchase prices reached record levels in early 2026, zero-deposit bonds accounted for a growing share of applications, and demand in high-growth nodes — especially the Western Cape — stayed firm. The challenge now is whether commuting and construction costs, both linked to fuel prices, will dampen that momentum.',
      'For homeowners with existing bonds, higher rates mean revisiting household budgets. For sellers, realistic pricing in well-located suburbs remains critical. Tyson Properties spokesman Neil Abernethy noted that at elevated oil prices, the Reserve Bank’s inflation target leaves little room for aggressive easing — meaning the industry may need to wait until late 2026 or beyond for the next meaningful rate reduction.',
      'What should buyers and sellers take away? Stability is not the same as cheap credit. Those who qualify for finance may still find opportunities while prices in many inland metros remain competitive, but location, energy-efficient homes, and proximity to work and schools matter more when petrol and transport costs climb.',
    ],
    sources: [
      {
        label: 'Property24 — First rate call of 2026',
        url: 'https://www.property24.com/articles/first-rate-call-of-2026-what-the-experts-are-saying/32933',
      },
      {
        label: 'Property Professional — MPC holds repo rate at 6.75%',
        url: 'https://propertyprofessional.co.za/2026/03/30/mpc-holds-repo-rate-at-6-75-as-global-uncertainty-clouds-2026-outlook/',
      },
      {
        label: 'Business Day — Petrol price shock and repo rate',
        url: 'https://www.businessday.co.za/news/2026-06-02-petrol-price-shock-looms-as-fuel-levy-relief-is-cut/',
      },
    ],
  },
  {
    slug: 'fuel-prices-household-spending',
    title: 'Oil price shocks will affect household spending',
    excerpt:
      'The latest fuel price increases are expected to have a significant impact on household spending, with many South Africans feeling the pinch.',
    image: newsImages.featured.oil,
    imageAlt: 'Contemporary home with landscaped garden',
    category: 'News',
    publishedAt: '2026-06-03',
    readMinutes: 4,
    featured: true,
    body: [
      'From June 2026, South African motorists faced some of the highest petrol prices on record — with inland 95 unleaded reaching about R28 per litre as partial fuel-levy relief was withdrawn. Diesel prices moved in the opposite direction, offering some relief to logistics and agriculture, but petrol remains the dominant cost for commuting households.',
      'The South African Petroleum Retailers Association warned that higher pump prices add further strain to budgets already stretched by food, electricity, and debt repayments. When transport costs rise, consumers typically cut discretionary spending first — but mortgage and rental payments are not discretionary. Banks assess total household expenses when granting bonds, so fuel inflation can quietly reduce the amount a buyer qualifies for even when interest rates are stable.',
      'Property analysts at the Residential Investment & Development Summit argue that oil prices are reshaping housing preferences. Buyers in Johannesburg, Pretoria, and other long-commute metros increasingly favour homes closer to employment hubs, schools, and public transport. In coastal and semigration hotspots, lifestyle value still outweighs commuting — but inland, every extra kilometre to work carries a higher monthly cost.',
      'Construction is affected too. Cement, bricks, and steel must be transported; when diesel spikes, building costs follow. That can slow new supply and keep pressure on resale prices in undersupplied suburbs — a mixed outcome for sellers and developers.',
      'If you are house-hunting in 2026, factor transport into your affordability calculation the same way you would bond instalments. A slightly smaller home nearer to work may beat a larger property with a long daily commute when petrol accounts for a double-digit share of household spend.',
    ],
    sources: [
      {
        label: 'BusinessTech — Highest petrol price in history',
        url: 'https://businesstech.co.za/news/energy/862147/south-africans-set-to-pay-the-highest-petrol-price-in-history/',
      },
      {
        label: 'Residential Investment Summit — Oil and housing',
        url: 'https://residesummit.co.za/2026/03/25/rising-oil-prices-could-reshape-south-africas-housing-market/',
      },
      {
        label: 'Business Day — Fuel levy relief cut',
        url: 'https://www.businessday.co.za/news/2026-06-02-petrol-price-shock-looms-as-fuel-levy-relief-is-cut/',
      },
    ],
  },
  {
    slug: 'sona-2026-property-feedback',
    title: 'Feedback from SONA 2026',
    excerpt:
      'Real estate leaders unpack President Ramaphosa’s 2026 State of the Nation Address — from a new State Property Company to flexible housing subsidies.',
    image: newsImages.side.sona,
    imageAlt: 'Government buildings and urban development',
    category: 'Analysis',
    publishedAt: '2026-02-13',
    readMinutes: 6,
    featured: false,
    body: [
      'President Cyril Ramaphosa’s 2026 State of the Nation Address outlined a shift in how South Africa thinks about housing and state-owned land. Rather than focusing solely on building houses for citizens, government plans to expand subsidies for ownership and rental in well-located areas — acknowledging that labour mobility and changing household structures require more flexible support.',
      'A headline reform is the proposed State Property Company, intended to professionally manage roughly 88,000 government buildings and five million hectares of land. Public Works Minister Dean Macpherson told Parliament the entity would be ring-fenced, governed independently, and supported by a digitised asset register covering ownership, leases, and valuations.',
      'Property24 and Seeff Property Group welcomed the focus on infrastructure — over R1 trillion allocated to public infrastructure over three years — and on clearing title-deed backlogs. Seeff chairman Samuel Seeff said investment in water, electricity, ports, and roads is essential to unlock growth and make more suburbs viable for development.',
      'Experts caution that timelines and governance details still need to be finalised. Repurposing underused buildings — such as vacant office towers — into mixed-use housing could relieve pressure in inner cities, but success depends on partnerships with private developers and credible execution. IOL reported that the state currently spends billions leasing private buildings while many public assets stand idle or vandalised.',
      'For the private market, SONA 2026 signals opportunity in urban renewal and affordable rental, but not an overnight supply surge. Developers and investors should watch policy detail on subsidies, release of well-located land, and commuter-rail revitalisation — all of which could reshape demand over the next five years.',
    ],
    sources: [
      {
        label: 'Property24 — Real estate experts unpack SONA 2026',
        url: 'https://www.property24.com/articles/real-estate-experts-unpack-sona-2026/32950',
      },
      {
        label: 'South African Government — SONA 2026 speech',
        url: 'https://www.gov.za/news/speeches/2026StateOfTheNation',
      },
      {
        label: 'IOL — State property and underused assets',
        url: 'https://iol.co.za/business/property/2026-02-19-south-africas-property-dilemma-solutions-for-vandalised-and-underused-assets/',
      },
    ],
  },
  {
    slug: 'interest-rate-february-2026-unchanged',
    title: 'Interest rate – February 2026 – remains unchanged',
    excerpt:
      'The SARB kept the repo rate at 6.75% and prime at 10.25%, pausing the cutting cycle but leaving room for easing later in the year.',
    image: newsImages.side.febRates,
    imageAlt: 'Suburban homes in a South African neighbourhood',
    category: 'News',
    publishedAt: '2026-01-30',
    readMinutes: 4,
    featured: false,
    body: [
      'Breaking a run of six consecutive rate cuts between September 2024 and November 2025, the South African Reserve Bank’s Monetary Policy Committee held the repo rate at 6.75% in its first 2026 meeting — keeping the prime lending rate at 10.25%.',
      'Governor Lesetja Kganyago said the committee assessed inflation risks as balanced. Two MPC members voted for a 25 basis-point cut; four preferred a hold. For existing bond holders, instalments stayed the same — a relief for households mapping budgets around the National Budget speech in February.',
      'Private Property reported that industry reaction was summed up as “disappointed but not surprised.” Agents had hoped for another cut to pull more first-time buyers off the fence. Still, the cumulative easing since 2024 has already improved affordability: ooba and BetterBond data showed stronger application volumes and fewer deposit requirements compared with the 2023 peak.',
      'Most commentators expect up to two further 25 basis-point cuts in 2026 if inflation stays contained and the rand holds steady. Pam Golding Property Group’s Andrew Golding noted demand remains steady in high-demand suburbs, with buy-to-let investment surging in some metros.',
      'Buyers should treat the pause as a planning window: bond costs are materially lower than two years ago, but further relief is not guaranteed while global uncertainty persists. Sellers in sought-after areas still see competition for well-priced stock; overpriced listings in weaker locations may sit longer.',
    ],
    sources: [
      {
        label: 'Private Property — February 2026 rate unchanged',
        url: 'https://www.privateproperty.co.za/advice/news/articles/interest-rate-february-2026-remains-unchanged/9622',
      },
      {
        label: 'Business Report — SARB holds rates steady',
        url: 'https://businessreport.co.za/economy/2026-02-01-south-african-reserve-bank-holds-interest-rates-steady-implications-for-the-property-market/',
      },
      {
        label: 'Bizcommunity — Consumers and repo rate',
        url: 'https://www.bizcommunity.com/article/consumers-can-breathe-little-easier-as-repro-rate-remains-unchanged-284847a',
      },
    ],
  },
  {
    slug: 'climate-states-of-emergency',
    title: 'Be prepared for climate-induced States of Emergency',
    excerpt:
      'Floods, wildfires, and water shortages are driving national disaster declarations — and changing how buyers assess property risk.',
    image: newsImages.side.climate,
    imageAlt: 'Storm clouds over a residential area',
    category: 'Analysis',
    publishedAt: '2026-02-18',
    readMinutes: 5,
    featured: false,
    body: [
      'South Africa’s 2025/2026 summer brought a triple climate shock: destructive floods in Limpopo and Mpumalanga, severe wildfires in the Western Cape, and water shortages affecting towns along the Garden Route and beyond. Government declared multiple states of disaster within weeks, coordinating relief while insurers and homeowners grappled with damage on the ground.',
      'Private Property and the WWF summarised the pattern: extreme weather is becoming the new normal, not a once-off anomaly. Low-lying communities bore the brunt of flooded drainage systems; fire seasons intensified despite heavy rain elsewhere; and “Day Zero” water scenarios returned to public debate in drought-stressed municipalities.',
      'For property owners, disaster classification helps coordinate public recovery but does not automatically trigger private compensation. Cape Town News noted that insurance claims still depend on policy wording, proof of damage, maintenance history, and timely reporting. Businesses were urged to review continuity plans and access routes, not only building cover.',
      'Harcourts South Africa warns that climate risk is already influencing values and premiums. Homes in flood-prone or fire-corridors may face higher insurance costs or reduced buyer appetite. Conversely, properties with solar backup, water tanks, and fire-aware landscaping are gaining appeal — especially in lifestyle and semigration markets.',
      'Due diligence in 2026 should include flood history, soil stability, municipal water reliability, and fire defensible space — not just school catchments and commute times. Whether you are buying, selling, or holding investment stock, climate resilience is now part of the property equation.',
    ],
    sources: [
      {
        label: 'Private Property — Climate states of emergency',
        url: 'https://www.privateproperty.co.za/advice/news/articles/be-prepared-for-climate-induced-states-of-emergency/9621',
      },
      {
        label: 'Everything Property — Triple disaster impact',
        url: 'https://everythingproperty.co.za/when-climate-hits-home-property-owners-warned-of-triple-disaster-impact/',
      },
      {
        label: 'Harcourts SA — Climate change and property values',
        url: 'https://www.harcourts.co.za/news/the-effects-of-climate-change-on-south-african-property-values/',
      },
    ],
  },
  {
    slug: 'real-estate-outlook-2026',
    title: "What's ahead for real estate 2026: the comeback year",
    excerpt:
      'Analysts see measured recovery ahead — lower rates, grey-list exit, and regional winners — but warn it remains a tale of two markets.',
    image: newsImages.side.outlook,
    imageAlt: 'Aerial view of a growing South African suburb',
    category: 'Market outlook',
    publishedAt: '2026-01-08',
    readMinutes: 6,
    featured: false,
    body: [
      'Entering 2026, South Africa’s residential market carries more optimism than it did twelve months ago. Inflation moderated through 2025, the country exited the FATF grey list, the rand stabilised, and a series of rate cuts improved bond affordability. BetterBond reported double-digit growth in first-time buyer activity and a sharp decline in average deposit requirements since 2024.',
      'Private Property dubbed 2026 a potential “comeback year,” citing rising confidence, easing rates, stronger bank lending appetite, and employees reconsidering where they live relative to offices. FNB expects mild acceleration in transaction volumes and capital growth — though not a uniform national boom.',
      'Regional divergence remains the story. Property24 and Seeff describe a “tale of two markets”: the Western Cape and coastal lifestyle nodes continue to outperform, driven by semigration and stock shortages, while Gauteng and parts of the inland market lag until service-delivery and infrastructure concerns ease. Rental demand stays robust in urban centres, supporting investors even where sales volumes are patchy.',
      'Risks have not disappeared. Geopolitical tension in the Middle East fed oil-price volatility in early 2026, delaying expected rate cuts and unsettling household budgets. BetterBond’s April 2026 Property Brief noted home-loan applications still recovering — up roughly 21% from the 2023 peak — but warned that sustained recovery needs global stability and continued income growth.',
      'Practical takeaway for Homescout readers: 2026 favours prepared buyers and realistically priced sellers. Use bond pre-approval tools, compare suburbs on commute and utility costs, and do not assume every region moves in lockstep. The comeback is real — but it is selective.',
    ],
    sources: [
      {
        label: 'Private Property — Real estate 2026 comeback year',
        url: 'https://www.privateproperty.co.za/advice/news/articles/whats-ahead-for-real-estate-2026-the-comeback-year/9615',
      },
      {
        label: 'Property24 — Housing market recovery 2026',
        url: 'https://www.property24.com/articles/south-africas-housing-market-set-for-recovery-in-2026/32899',
      },
      {
        label: 'BetterBond — Property Brief April 2026',
        url: 'https://static.wp.betterbond.co.za/wp-content/uploads/BetterBond-Property-Brief-April-2026-final.pdf',
      },
    ],
  },
]

export function getNewsArticle(slug: string): PropertyNewsArticle | undefined {
  return propertyNewsArticles.find((a) => a.slug === slug)
}

export function getFeaturedNewsArticles() {
  return propertyNewsArticles.filter((a) => a.featured)
}

export function getSideNewsArticles() {
  return propertyNewsArticles.filter((a) => !a.featured)
}

export function formatNewsDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
