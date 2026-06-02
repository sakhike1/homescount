import Link from 'next/link'
import type { ReactNode } from 'react'
import ListingLandingHero from '@/components/listing-landing/ListingLandingHero'
import LandingHeroActionCard from '@/components/listing-landing/LandingHeroActionCard'
import BenefitCards from '@/components/listing-landing/BenefitCards'
import JourneyStepsSection from '@/components/listing-landing/JourneyStepsSection'
import LandingCtaBanner from '@/components/listing-landing/LandingCtaBanner'
import RentBrowseTeaser from '@/components/listing-landing/RentBrowseTeaser'
import { rentJourneySteps } from '@/lib/property-journey'
import { BadgeCheck, Building2, MapPinned } from 'lucide-react'

function buildBrowseHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  qs.set('type', 'rent')
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value)
  }
  return `/properties?${qs.toString()}`
}

type Property = {
  id: string
  title: string
  price: number
  suburb: string
  location: string
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  parkings: number
  size: number
  type: string
  listingType: string
  featured: boolean
  images: { url: string }[]
}

export default function RentLandingContent({
  searchParams,
  previewProperties,
  isDemo = false,
  listingsPreview,
}: {
  searchParams: Record<string, string | undefined>
  previewProperties?: Property[]
  isDemo?: boolean
  /** When set, listings load via Suspense instead of blocking the page */
  listingsPreview?: ReactNode
}) {
  const browseHref = buildBrowseHref(searchParams)
  const hasSearch = Boolean(
    searchParams.q || searchParams.price || searchParams.suburb || searchParams.address
  )

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <ListingLandingHero variant="rent" locationHint={searchParams.q}>
        <LandingHeroActionCard
          variant="rent"
          primaryHref={hasSearch ? browseHref : '/properties?type=rent'}
          primaryLabel="Browse rentals"
          secondaryHref="/register"
          secondaryLabel="Create account"
        />
      </ListingLandingHero>

      {hasSearch && (
        <div className="border-b border-sky-100 bg-sky-50 px-4 py-4">
          <p className="max-w-7xl mx-auto text-sm text-sky-900">
            You have an active search.{' '}
            <Link href={browseHref} className="font-bold underline hover:no-underline">
              View matching rentals
            </Link>
          </p>
        </div>
      )}

      <BenefitCards
        heading="Why rent with Homescount"
        benefits={[
          {
            title: 'Clear monthly prices',
            description:
              'Every rental shows the monthly amount upfront — no hidden fees on the listing card.',
            icon: Building2,
          },
          {
            title: 'Trusted sellers',
            description:
              'Listings come from registered sellers with contact details on each property page.',
            icon: BadgeCheck,
          },
          {
            title: 'Nationwide search',
            description:
              'Filter by suburb, address, or area across all nine provinces from one place.',
            icon: MapPinned,
          },
        ]}
      />

      <JourneyStepsSection
        title="Your path from search to move-in"
        subtitle="Homescount guides renters through each step — from the first enquiry to settling in."
        steps={rentJourneySteps}
        footnote="When you view a rental, you will see this journey on the property page too — so you always know what comes next."
      />

      {listingsPreview ?? (
        <RentBrowseTeaser
          properties={previewProperties ?? []}
          browseHref={browseHref}
          isDemo={isDemo}
        />
      )}

      <LandingCtaBanner
        variant="rent"
        title="Ready to find your rental?"
        description="Search published rentals, filter by budget and location, and message landlords directly from each listing."
        primaryHref={browseHref}
        primaryLabel="Search all rentals"
      />
    </main>
  )
}
