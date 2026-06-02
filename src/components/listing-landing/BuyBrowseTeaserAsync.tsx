import RentBrowseTeaser from '@/components/listing-landing/RentBrowseTeaser'
import { getBrowseListings, getPropertyImageUrl } from '@/lib/properties'
import type { PropertyFilters } from '@/lib/properties'

type Props = {
  browseHref: string
  filters: PropertyFilters
}

export default async function BuyBrowseTeaserAsync({ browseHref, filters }: Props) {
  const { properties, isDemo } = await getBrowseListings(filters)

  const preview = properties.slice(0, 6).map((p, i) => ({
    ...p,
    images: p.images.length ? p.images : [{ url: getPropertyImageUrl([], i) }],
  }))

  return (
    <RentBrowseTeaser
      variant="buy"
      properties={preview}
      browseHref={browseHref}
      isDemo={isDemo}
    />
  )
}
