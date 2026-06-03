import { Suspense } from 'react'
import { buildPageMetadata } from '@/lib/seo'
import RentLandingContent from '@/components/listing-landing/RentLandingContent'

export const metadata = buildPageMetadata({
  title: 'Homes & Apartments to Rent',
  description:
    'Find rental homes and apartments across South Africa. Search by suburb, monthly rent, and city — from Sandton to Sea Point.',
  path: '/rent',
  keywords: [
    'property to rent',
    'apartments for rent',
    'houses to rent Johannesburg',
    'monthly rental listings',
  ],
})
import RentBrowseTeaserAsync from '@/components/listing-landing/RentBrowseTeaserAsync'
import RentTeaserSkeleton from '@/components/listing-landing/RentTeaserSkeleton'
import type { PropertyFilters } from '@/lib/properties'

function buildBrowseHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  qs.set('type', 'rent')
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value)
  }
  return `/properties?${qs.toString()}`
}

function toFilters(params: Record<string, string | undefined>): PropertyFilters {
  return {
    listingType: 'RENT',
    q: params.q,
    suburb: params.suburb,
    address: params.address,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice
      ? Number(params.maxPrice)
      : params.price
        ? Number(params.price)
        : undefined,
  }
}

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const browseHref = buildBrowseHref(params)

  return (
    <RentLandingContent
      searchParams={params}
      listingsPreview={
        <Suspense fallback={<RentTeaserSkeleton />}>
          <RentBrowseTeaserAsync browseHref={browseHref} filters={toFilters(params)} />
        </Suspense>
      }
    />
  )
}
