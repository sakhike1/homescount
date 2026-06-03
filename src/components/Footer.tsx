import Link from 'next/link'
import HomescountLogo from '@/components/brand/HomescountLogo'
import { FooterSocialLinks } from '@/components/footer/SocialIconButton'
import { LEGAL } from '@/lib/legal'
import { Apple, Play } from 'lucide-react'

const gautengCities = [
  'Alberton',
  'Benoni',
  'Boksburg',
  'Brakpan',
  'Bronkhorstspruit',
  'Centurion',
  'Cullinan',
  'Edenvale',
  'Fourways',
  'Germiston',
  'Johannesburg',
  'Kempton Park',
  'Krugersdorp',
  'Midrand',
  'Pretoria',
  'Randburg',
  'Roodepoort',
  'Sandton',
  'Soweto',
  'Springs',
  'Vereeniging',
]

const kznCities = [
  'Ballito',
  'Durban',
  'Hillcrest',
  'Howick',
  'Margate',
  'Pietermaritzburg',
  'Pinetown',
  'Richards Bay',
  'Scottburgh',
  'Umhlanga',
  'Westville',
]

const westernCapeCities = [
  'Bellville',
  'Cape Town',
  'Constantia',
  'George',
  'Hermanus',
  'Knysna',
  'Mossel Bay',
  'Paarl',
  'Somerset West',
  'Stellenbosch',
  'Strand',
]

const restOfSaCities = [
  'Bloemfontein',
  'East London',
  'Gqeberha',
  'Kimberley',
  'Middelburg',
  'Nelspruit',
  'Polokwane',
  'Potchefstroom',
  'Rustenburg',
  'Witbank',
]

function cityHref(city: string) {
  return `/properties?q=${encodeURIComponent(city)}&type=buy`
}

function CityList({ cities }: { cities: string[] }) {
  return (
    <ul className="space-y-1.5">
      {cities.map((city) => (
        <li key={city}>
          <Link
            href={cityHref(city)}
            className="text-sm text-amber-50/90 hover:text-white transition"
          >
            {city}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function FooterColumn({
  title,
  cities,
}: {
  title?: string
  cities: string[]
}) {
  return (
    <div>
      {title && (
        <h3 className="text-sm font-bold text-white mb-3 leading-snug">{title}</h3>
      )}
      <CityList cities={cities} />
    </div>
  )
}

const utilityLinks = {
  company: [
    { label: 'About Us', comingSoon: true },
    { label: 'Contact Us', href: `mailto:${LEGAL.contactEmail}` },
    { label: 'Feedback', comingSoon: true },
    { label: 'Sitemap', href: '/properties' },
  ],
  legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'PAIA Manual', comingSoon: true },
  ],
  business: [
    { label: 'Join Our Team', comingSoon: true },
    { label: 'Agent Zone', href: '/sell' },
    { label: 'Agency Products', href: '/register?role=SELLER' },
  ],
} as const

function UtilityLink({
  label,
  href,
  comingSoon,
}: {
  label: string
  href?: string
  comingSoon?: boolean
}) {
  if (comingSoon) {
    return (
      <span className="text-sm text-stone-500 cursor-default" title="Coming soon">
        {label}
      </span>
    )
  }

  const isExternal = href?.startsWith('mailto:') || href?.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={href}
        className="text-sm text-stone-400 hover:text-amber-200 transition"
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={href!} className="text-sm text-stone-400 hover:text-amber-200 transition">
      {label}
    </Link>
  )
}

export default function Footer() {
  const gautengMid = Math.ceil(gautengCities.length / 2)
  const gautengCol1 = gautengCities.slice(0, gautengMid)
  const gautengCol2 = gautengCities.slice(gautengMid)

  return (
    <footer className="mt-auto">
      {/* Regional property links */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 text-white py-10 px-4">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(255,255,255,0.22),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(253,230,138,0.2),transparent_50%)]"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <FooterColumn title="Property for sale in Gauteng" cities={gautengCol1} />
          <FooterColumn cities={gautengCol2} />
          <FooterColumn title="Property for sale in KwaZulu Natal" cities={kznCities} />
          <FooterColumn title="Property for sale in Western Cape" cities={westernCapeCities} />
          <FooterColumn title="Rest of South Africa" cities={restOfSaCities} />
        </div>
      </section>

      {/* Brand, links & social */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-stone-300 py-12 px-4">
        <div
          className="pointer-events-none absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-amber-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-48 w-72 rounded-full bg-amber-400/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.03)_50%,transparent_60%)]"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 pb-10 border-b border-white/10 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 max-w-md">
              <HomescountLogo tone="onDark" size="lg" className="w-fit" />
              <p className="text-sm leading-relaxed text-stone-400">
                Find homes to buy and rent across South Africa — trusted sellers,
                clear listings, and guidance from enquiry to handover.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400/90">
                Follow us
              </p>
              <FooterSocialLinks />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                Company
              </p>
              <ul className="space-y-2.5">
                {utilityLinks.company.map((link) => (
                  <li key={link.label}>
                    <UtilityLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                Legal
              </p>
              <ul className="space-y-2.5">
                {utilityLinks.legal.map((link) => (
                  <li key={link.label}>
                    <UtilityLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                For business
              </p>
              <ul className="space-y-2.5">
                {utilityLinks.business.map((link) => (
                  <li key={link.label}>
                    <UtilityLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                Download the app
              </p>
              <div className="flex flex-col gap-2 opacity-70">
                <div
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 cursor-not-allowed backdrop-blur-sm"
                  title="Mobile app coming soon"
                >
                  <Apple className="h-6 w-6 text-white shrink-0" aria-hidden />
                  <div className="text-left">
                    <div className="text-[10px] text-stone-500 leading-none">
                      Download on the
                    </div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      App Store
                    </div>
                  </div>
                </div>
                <div
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 cursor-not-allowed backdrop-blur-sm"
                  title="Mobile app coming soon"
                >
                  <Play className="h-6 w-6 text-white shrink-0 fill-white" aria-hidden />
                  <div className="text-left">
                    <div className="text-[10px] text-stone-500 leading-none">GET IT ON</div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      Google Play
                    </div>
                  </div>
                </div>
                <p className="text-xs text-stone-600">Mobile app coming soon</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              Copyright © {new Date().getFullYear()} {LEGAL.siteName}. All rights reserved.
            </span>
            <Link
              href="/admin/login"
              className="text-stone-600 hover:text-stone-500 transition"
            >
              Admin access
            </Link>
          </p>
        </div>
      </section>
    </footer>
  )
}
