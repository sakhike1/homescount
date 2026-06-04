import Link from 'next/link'
import type { ReactNode } from 'react'
import ListingLandingHero from '@/components/listing-landing/ListingLandingHero'
import LandingHeroActionCard from '@/components/listing-landing/LandingHeroActionCard'
import BenefitCards from '@/components/listing-landing/BenefitCards'
import JourneyStepsSection from '@/components/listing-landing/JourneyStepsSection'
import LandingCtaBanner from '@/components/listing-landing/LandingCtaBanner'
import RentBrowseTeaser from '@/components/listing-landing/RentBrowseTeaser'
import { buyJourneySteps } from '@/lib/property-journey'
import { BadgeCheck, Building2, MapPinned } from 'lucide-react'

function buildBrowseHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  qs.set('type', 'buy')
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

export default function BuyLandingContent({
  searchParams,
  previewProperties,
  isDemo = false,
  listingsPreview,
}: {
  searchParams: Record<string, string | undefined>
  previewProperties?: Property[]
  isDemo?: boolean
  listingsPreview?: ReactNode
}) {
  const browseHref = buildBrowseHref(searchParams)
  const hasSearch = Boolean(
    searchParams.q || searchParams.price || searchParams.suburb || searchParams.address
  )

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <ListingLandingHero key="buy" variant="buy" locationHint={searchParams.q}>
        <LandingHeroActionCard
          variant="buy"
          primaryHref={hasSearch ? browseHref : '/properties?type=buy'}
          primaryLabel="Browse homes for sale"
          secondaryHref="/register"
          secondaryLabel="Create account"
        />
      </ListingLandingHero>

      {hasSearch && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-4">
          <p className="max-w-7xl mx-auto text-sm text-amber-950">
            You have an active search.{' '}
            <Link href={browseHref} className="font-bold underline hover:no-underline">
              View matching homes for sale
            </Link>
          </p>
        </div>
      )}

      <BenefitCards
        heading="Why buy with Homescout"
        benefits={[
          {
            title: 'Clear sale prices',
            description:
              'Every listing shows the full purchase price upfront — no hidden fees on the card.',
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
              'Filter by suburb, city, or province across all nine provinces from one place.',
            icon: MapPinned,
          },
        ]}
      />

      <JourneyStepsSection
        title="Your path from search to ownership"
        subtitle="Homescout guides buyers through each step — from the first enquiry to transfer at the Deeds Office."
        steps={buyJourneySteps}
        footnote="When you view a property for sale, you will see this journey on the property page too."
      />

      {listingsPreview ?? (
        <RentBrowseTeaser
          variant="buy"
          properties={previewProperties ?? []}
          browseHref={browseHref}
          isDemo={isDemo}
        />
      )}

      <LandingCtaBanner
        variant="buy"
        title="Ready to find your next home?"
        description="Search published homes for sale, filter by budget and location, and message sellers directly from each listing."
        primaryHref={browseHref}
        primaryLabel="Search homes for sale"
        secondaryHref="/tools/bond-calculator"
        secondaryLabel="Check affordability"
      />
    </main>
  )
}
