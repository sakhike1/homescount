import type { ReactNode } from 'react'
import Link from 'next/link'
import NewsletterFooterForm from '@/components/footer/NewsletterFooterForm'
import { LEGAL } from '@/lib/legal'

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
    <ul className="space-y-2">
      {cities.map((city) => (
        <li key={city}>
          <Link
            href={cityHref(city)}
            className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
          >
            {city}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function CityColumn({
  title,
  cities,
}: {
  title?: string
  cities: string[]
}) {
  return (
    <div className="min-w-0">
      {title && (
        <h3 className="mb-4 text-sm font-semibold leading-snug text-white">{title}</h3>
      )}
      <CityList cities={cities} />
    </div>
  )
}

const browseLinks = [
  { label: 'All properties', href: '/properties', highlight: true },
  { label: 'Homes for sale', href: '/buy' },
  { label: 'Rentals', href: '/rent' },
  { label: 'List your property', href: '/sell' },
  { label: 'Bond calculator', href: '/tools/bond-calculator' },
  { label: 'Valuation estimator', href: '/tools/valuation-estimator' },
  { label: 'Property news', href: '/news' },
] as const

const companyLinks = [
  { label: 'About Us', comingSoon: true },
  { label: 'Contact Us', href: `mailto:${LEGAL.contactEmail}` },
  { label: 'Feedback', comingSoon: true },
  { label: 'Agent Zone', href: '/sell' },
  { label: 'Agency Products', href: '/register?role=SELLER' },
] as const

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'PAIA Manual', comingSoon: true },
  { label: 'Join Our Team', comingSoon: true },
  { label: 'Sitemap', href: '/properties' },
] as const

function FooterLink({
  label,
  href,
  comingSoon,
  highlight,
}: {
  label: string
  href?: string
  comingSoon?: boolean
  highlight?: boolean
}) {
  if (comingSoon) {
    return (
      <span className="text-sm text-slate-500 cursor-default" title="Coming soon">
        {label}
      </span>
    )
  }

  const className = highlight
    ? 'text-sm font-medium text-amber-400 transition-colors duration-200 hover:text-amber-300'
    : 'text-sm text-slate-400 transition-colors duration-200 hover:text-slate-100'

  const isExternal = href?.startsWith('mailto:') || href?.startsWith('http')

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href!} className={className}>
      {label}
    </Link>
  )
}

function LinkColumn({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-slate-100 tracking-wide">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  )
}

function FooterWordmark() {
  return (
    <Link
      href="/"
      aria-label="Homescout home"
      className="mt-16 block select-none sm:mt-20"
    >
      <span
        className="block font-black leading-[0.88] tracking-tighter"
        style={{ fontSize: 'clamp(3rem, 14vw, 8rem)' }}
      >
        <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">Home</span>
        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">scout</span>
        <sup className="ml-1 align-super text-[0.12em] font-bold text-slate-500">®</sup>
      </span>
    </Link>
  )
}

export default function Footer() {
  const gautengMid = Math.ceil(gautengCities.length / 2)
  const gautengCol1 = gautengCities.slice(0, gautengMid)
  const gautengCol2 = gautengCities.slice(gautengMid)

  return (
    <footer className="mt-auto w-full">
      {/* City links — amber band */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(255,255,255,0.22),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(253,230,138,0.25),transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Properties by area
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
            <CityColumn title="Property for sale in Gauteng" cities={gautengCol1} />
            <CityColumn cities={gautengCol2} />
            <CityColumn title="Property for sale in KwaZulu Natal" cities={kznCities} />
            <CityColumn title="Property for sale in Western Cape" cities={westernCapeCities} />
            <CityColumn title="Rest of South Africa" cities={restOfSaCities} />
          </div>
        </div>
      </section>

      {/* Main footer — slate blue-gray */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-slate-100">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" aria-hidden />
        
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <NewsletterFooterForm />

            <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              <LinkColumn title="Browse">
                {browseLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </LinkColumn>

              <LinkColumn title="Company">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </LinkColumn>

              <LinkColumn title="Legal">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </LinkColumn>
            </div>
          </div>

          <FooterWordmark />

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700/60 pt-8 sm:flex-row">
            <p className="text-xs text-slate-500">
              Copyright © {new Date().getFullYear()} {LEGAL.siteName}. All rights reserved.
            </p>
            <Link
              href="/admin/login"
              className="text-xs text-slate-500 transition-colors duration-200 hover:text-slate-300"
            >
              Admin access
            </Link>
          </div>
        </div>
      </section>
    </footer>
  )
}
