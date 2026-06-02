import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  Apple,
  AtSign,
  Camera,
  Play,
  PlayCircle,
  Pin,
  Users,
} from 'lucide-react'

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
        <h3 className="text-sm font-bold text-white mb-3 leading-snug">
          {title}
        </h3>
      )}
      <CityList cities={cities} />
    </div>
  )
}

const utilityLinks = {
  company: [
    { label: 'About Us', comingSoon: true },
    { label: 'Contact Us', href: 'mailto:hello@homescount.com' },
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
      <span className="text-sm text-gray-500 cursor-default" title="Coming soon">
        {label}
      </span>
    )
  }

  const isExternal = href?.startsWith('mailto:') || href?.startsWith('http')

  if (isExternal) {
    return (
      <a href={href} className="text-sm hover:text-white transition">
        {label}
      </a>
    )
  }

  return (
    <Link href={href!} className="text-sm hover:text-white transition">
      {label}
    </Link>
  )
}

function SocialIcon({
  label,
  children,
  href,
}: {
  label: string
  children: ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gray-400 hover:text-white transition"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const gautengMid = Math.ceil(gautengCities.length / 2)
  const gautengCol1 = gautengCities.slice(0, gautengMid)
  const gautengCol2 = gautengCities.slice(gautengMid)

  return (
    <footer className="mt-auto">
      {/* Regional property links */}
      <section className="bg-gradient-to-br from-amber-500 to-amber-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <FooterColumn
            title="Property for sale in Gauteng"
            cities={gautengCol1}
          />
          <FooterColumn cities={gautengCol2} />
          <FooterColumn
            title="Property for sale in KwaZulu Natal"
            cities={kznCities}
          />
          <FooterColumn
            title="Property for sale in Western Cape"
            cities={westernCapeCities}
          />
          <FooterColumn title="Rest of South Africa" cities={restOfSaCities} />
        </div>
      </section>

      {/* Brand, links & apps */}
      <section className="bg-gray-900 text-gray-300 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="bg-amber-500 text-white font-black text-lg px-3 py-1 rounded-lg tracking-tight">
                HC
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Homes<span className="text-amber-300">count</span>
              </span>
            </Link>

            <div className="flex items-center gap-5">
              <SocialIcon label="Instagram" href="https://instagram.com">
                <Camera className="w-5 h-5" aria-hidden />
              </SocialIcon>
              <SocialIcon label="Facebook" href="https://facebook.com">
                <Users className="w-5 h-5" aria-hidden />
              </SocialIcon>
              <SocialIcon label="X" href="https://x.com">
                <AtSign className="w-5 h-5" aria-hidden />
              </SocialIcon>
              <SocialIcon label="YouTube" href="https://youtube.com">
                <PlayCircle className="w-5 h-5" aria-hidden />
              </SocialIcon>
              <SocialIcon label="Pinterest" href="https://pinterest.com">
                <Pin className="w-5 h-5" aria-hidden />
              </SocialIcon>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <ul className="space-y-2.5">
              {utilityLinks.company.map((link) => (
                <li key={link.label}>
                  <UtilityLink {...link} />
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {utilityLinks.legal.map((link) => (
                <li key={link.label}>
                  <UtilityLink {...link} />
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {utilityLinks.business.map((link) => (
                <li key={link.label}>
                  <UtilityLink {...link} />
                </li>
              ))}
            </ul>
            <div>
              <p className="text-sm font-medium text-white mb-3">
                Download the App
              </p>
              <div className="flex flex-col gap-2 opacity-60">
                <div
                  className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                  title="Mobile app coming soon"
                >
                  <Apple className="w-6 h-6 text-white shrink-0" aria-hidden />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 leading-none">
                      Download on the
                    </div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      App Store
                    </div>
                  </div>
                </div>
                <div
                  className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 cursor-not-allowed"
                  title="Mobile app coming soon"
                >
                  <Play className="w-6 h-6 text-white shrink-0 fill-white" aria-hidden />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400 leading-none">
                      GET IT ON
                    </div>
                    <div className="text-sm font-semibold text-white leading-tight">
                      Google Play
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Mobile app coming soon</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              Copyright © {new Date().getFullYear()} Homescount. All rights reserved.
            </span>
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-gray-500 transition"
            >
              Admin access
            </Link>
          </p>
        </div>
      </section>
    </footer>
  )
}
