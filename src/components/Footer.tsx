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
            className="text-sm text-white/90 transition hover:text-white"
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
        <h3 className="mb-3 text-sm font-bold leading-snug text-white">{title}</h3>
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
      <span className="text-sm text-stone-500 cursor-default" title="Coming soon">
        {label}
      </span>
    )
  }

  const className = highlight
    ? 'text-sm font-medium text-amber-600 transition hover:text-amber-700'
    : 'text-sm text-stone-600 transition hover:text-stone-900'

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
      <h3 className="text-base font-bold text-stone-900">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  )
}

function FooterWordmark() {
  return (
    <Link
      href="/"
      aria-label="Homescout home"
      className="mt-14 block select-none sm:mt-20"
    >
      <span
        className="block font-black leading-[0.88] tracking-tighter"
        style={{ fontSize: 'clamp(3.5rem, 16vw, 10rem)' }}
      >
        <span className="text-stone-900">Homes</span>
        <span className="text-amber-500">scout</span>
        <sup className="ml-1 align-super text-[0.12em] font-bold text-stone-400">®</sup>
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
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(255,255,255,0.22),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(253,230,138,0.25),transparent_50%)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-50/90">
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

      {/* Main footer — light gray */}
      <section className="w-full bg-stone-100 text-stone-800">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
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

          <p className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
            <span>
              Copyright © {new Date().getFullYear()} {LEGAL.siteName}. All rights reserved.
            </span>
            <span className="mx-2 hidden sm:inline" aria-hidden>
              ·
            </span>
            <Link
              href="/admin/login"
              className="mt-2 block transition hover:text-stone-800 sm:mt-0 sm:inline"
            >
              Admin access
            </Link>
          </p>
        </div>
      </section>
    </footer>
  )
}
