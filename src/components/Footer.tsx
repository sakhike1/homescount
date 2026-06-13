import type { ReactNode } from 'react'
import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import HomescoutLogo from '@/components/brand/HomescoutLogo'
import NewsletterFooterForm from '@/components/footer/NewsletterFooterForm'
import { FooterSocialLinks } from '@/components/footer/SocialIconButton'
import { LEGAL } from '@/lib/legal'

const gautengCities = [
  'Alberton', 'Benoni', 'Boksburg', 'Brakpan', 'Bronkhorstspruit', 'Centurion',
  'Cullinan', 'Edenvale', 'Fourways', 'Germiston', 'Johannesburg', 'Kempton Park',
  'Krugersdorp', 'Midrand', 'Pretoria', 'Randburg', 'Roodepoort', 'Sandton',
  'Soweto', 'Springs', 'Vereeniging',
]

const kznCities = [
  'Ballito', 'Durban', 'Hillcrest', 'Howick', 'Margate', 'Pietermaritzburg',
  'Pinetown', 'Richards Bay', 'Scottburgh', 'Umhlanga', 'Westville',
]

const westernCapeCities = [
  'Bellville', 'Cape Town', 'Constantia', 'George', 'Hermanus', 'Knysna',
  'Mossel Bay', 'Paarl', 'Somerset West', 'Stellenbosch', 'Strand',
]

const restOfSaCities = [
  'Bloemfontein', 'East London', 'Gqeberha', 'Kimberley', 'Middelburg',
  'Nelspruit', 'Polokwane', 'Potchefstroom', 'Rustenburg', 'Witbank',
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
            className="text-sm text-stone-600 transition-colors hover:text-violet-700"
          >
            {city}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function CityColumn({ title, cities }: { title?: string; cities: string[] }) {
  return (
    <div className="min-w-0">
      {title && (
        <h3 className="mb-4 text-sm font-semibold leading-snug text-stone-900">{title}</h3>
      )}
      <CityList cities={cities} />
    </div>
  )
}

const companyLinks = [
  { label: 'About Us', comingSoon: true },
  { label: 'Contact Us', href: `mailto:${LEGAL.contactEmail}` },
  { label: 'Feedback', comingSoon: true },
  { label: 'List your property', href: '/sell' },
] as const

const supportLinks = [
  { label: 'Help centre', comingSoon: true },
  { label: 'Property news', href: '/news' },
  { label: 'Bond calculator', href: '/tools/bond-calculator' },
  { label: 'Valuation estimator', href: '/tools/valuation-estimator' },
] as const

const browseLinks = [
  { label: 'All properties', href: '/properties' },
  { label: 'Homes for sale', href: '/buy' },
  { label: 'Rentals', href: '/rent' },
  { label: 'Sell your home', href: '/sell' },
  { label: 'Agent registration', href: '/register?role=SELLER' },
] as const

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Sitemap', href: '/properties' },
] as const

function FooterLink({
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
      <span className="text-sm text-stone-400 cursor-default" title="Coming soon">
        {label}
      </span>
    )
  }

  const className =
    'text-sm text-stone-600 transition-colors duration-200 hover:text-violet-700'

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

function LinkColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-bold text-stone-900">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  )
}

export default function Footer() {
  const gautengMid = Math.ceil(gautengCities.length / 2)
  const gautengCol1 = gautengCities.slice(0, gautengMid)
  const gautengCol2 = gautengCities.slice(gautengMid)

  return (
    <footer className="mt-auto w-full">
      <section className="bg-stone-100 border-y border-stone-200/80">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
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

      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8 sm:py-10 lg:py-12">
            <NewsletterFooterForm />
          </div>
        </div>
      </section>

      <section className="bg-stone-100">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-10 sm:pb-12 sm:pt-10">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
              <div className="lg:col-span-1">
                <HomescoutLogo tone="home" size="md" />
                <p className="mt-5 text-sm leading-relaxed text-stone-500 max-w-xs">
                  South Africa&apos;s property portal for buying, renting, and listing homes
                  across all nine provinces.
                </p>
                <div className="mt-6">
                  <FooterSocialLinks tone="light" />
                </div>
              </div>

              <LinkColumn title="Company">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </LinkColumn>

              <LinkColumn title="Support">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </LinkColumn>

              <LinkColumn title="Links">
                {browseLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </LinkColumn>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-stone-900">Contact us</h3>
                <ul className="mt-5 space-y-4">
                  <li>
                    <a
                      href={`mailto:${LEGAL.contactEmail}`}
                      className="flex items-start gap-3 text-sm text-stone-600 hover:text-violet-700 transition-colors"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                        <Mail className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="pt-1.5">{LEGAL.contactEmail}</span>
                    </a>
                  </li>
                  <li>
                    <span className="flex items-start gap-3 text-sm text-stone-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                        <Phone className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="pt-1.5">South Africa</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-8 sm:flex-row">
              <p className="text-xs text-stone-500">
                © Copyright {new Date().getFullYear()} {LEGAL.siteName}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs text-stone-500 transition-colors hover:text-violet-700"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin/login"
                  className="text-xs text-stone-400 transition-colors hover:text-stone-600"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
