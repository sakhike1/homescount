import { Suspense } from 'react'
import { buildPageMetadata } from '@/lib/seo'
import BuyLandingContent from '@/components/listing-landing/BuyLandingContent'

export const metadata = buildPageMetadata({
  title: 'Homes & Property for Sale',
  description:
    'Browse houses, apartments, and townhouses for sale across South Africa. Filter by city, suburb, and price in Johannesburg, Cape Town, Durban, Pretoria, and more.',
  path: '/buy',
  keywords: [
    'property for sale',
    'houses for sale Gauteng',
    'buy apartment Cape Town',
    'townhouses for sale',
  ],
})
import BuyBrowseTeaserAsync from '@/components/listing-landing/BuyBrowseTeaserAsync'
import RentTeaserSkeleton from '@/components/listing-landing/RentTeaserSkeleton'
import type { PropertyFilters } from '@/lib/properties'

function buildBrowseHref(params: Record<string, string | undefined>) {
  const qs = new URLSearchParams()
  qs.set('type', 'buy')
  for (const [key, value] of Object.entries(params)) {
    if (value) qs.set(key, value)
  }
  return `/properties?${qs.toString()}`
}

function toFilters(params: Record<string, string | undefined>): PropertyFilters {
  return {
    listingType: 'SALE',
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

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const browseHref = buildBrowseHref(params)

  return (
    <BuyLandingContent
      searchParams={params}
      listingsPreview={
        <Suspense fallback={<RentTeaserSkeleton />}>
          <BuyBrowseTeaserAsync browseHref={browseHref} filters={toFilters(params)} />
        </Suspense>
      }
    />
  )
}
