import type { Metadata } from 'next'

export const SITE = {
  name: 'Homescount',
  tagline: 'Homes for Sale & Rent in South Africa',
  defaultDescription:
    'Search property for sale and homes to rent across South Africa. Browse houses, apartments, and townhouses in Johannesburg, Cape Town, Durban, Pretoria, Sandton, and all 9 provinces.',
  locale: 'en_ZA',
  country: 'South Africa',
} as const

/** Primary and long-tail keywords for SA property search. */
export const SEO_KEYWORDS = [
  'property for sale South Africa',
  'houses for sale',
  'homes for sale',
  'property to rent',
  'houses to rent',
  'apartments for rent',
  'buy house South Africa',
  'rent apartment South Africa',
  'sell my property',
  'list property online',
  'real estate South Africa',
  'Johannesburg property',
  'Cape Town homes',
  'Durban property for sale',
  'Pretoria houses for sale',
  'Sandton property',
  'Gauteng homes for sale',
  'Western Cape property',
  'KwaZulu-Natal rentals',
  'Homescount',
] as const

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL ||
    'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

type PageMetadataOptions = {
  title: string
  description: string
  path?: string
  keywords?: string[]
  noIndex?: boolean
}

export function buildPageMetadata(options: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl()
  const canonical = options.path ? `${siteUrl}${options.path}` : siteUrl
  const fullTitle = options.title.includes(SITE.name)
    ? options.title
    : `${options.title} | ${SITE.name}`

  return {
    title: options.title.includes(SITE.name)
      ? { absolute: options.title }
      : options.title,
    description: options.description,
    keywords: [...SEO_KEYWORDS, ...(options.keywords ?? [])],
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      url: canonical,
      siteName: SITE.name,
      title: fullTitle,
      description: options.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: options.description,
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.defaultDescription,
  keywords: [...SEO_KEYWORDS],
  applicationName: SITE.name,
  category: 'Real Estate',
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: siteUrl,
    logo: `${siteUrl}/logo-icon.svg`,
    description: SITE.defaultDescription,
    areaServed: {
      '@type': 'Country',
      name: SITE.country,
    },
  }
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: siteUrl,
    description: SITE.defaultDescription,
    inLanguage: 'en-ZA',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/properties?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function realEstateListingJsonLd(property: {
  id: string
  title: string
  description: string
  price: number
  city: string
  province: string
  suburb: string
  location: string
  bedrooms: number
  bathrooms: number
  listingType: string
  imageUrl?: string
}) {
  const siteUrl = getSiteUrl()
  const isRent = property.listingType === 'RENT'

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${siteUrl}/properties/${property.id}`,
    ...(property.imageUrl ? { image: property.imageUrl } : {}),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
      ...(isRent ? { priceSpecification: { '@type': 'UnitPriceSpecification', unitText: 'MONTH' } } : {}),
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: property.province,
      streetAddress: property.suburb || property.location,
      addressCountry: 'ZA',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
  }
}
