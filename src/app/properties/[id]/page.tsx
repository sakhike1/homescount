import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import PropertyDetailView from '@/components/properties/PropertyDetailView'
import ListingViewTracker from '@/components/properties/ListingViewTracker'
import JsonLd from '@/components/seo/JsonLd'
import {
  buildPageMetadata,
  getSiteUrl,
  realEstateListingJsonLd,
} from '@/lib/seo'
import {
  formatPrice,
  getPropertyImageUrl,
  getPublicPropertyById,
} from '@/lib/properties'
import { localImageCacheBust } from '@/lib/local-image-url'
import { parsePropertyFeatures } from '@/lib/property-features'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const result = await getPublicPropertyById(id)
  if (!result) {
    return { title: 'Property not found' }
  }

  const p = result.property
  const forLabel = p.listingType === 'RENT' ? 'to rent' : 'for sale'
  const price = formatPrice(p.price, p.listingType)
  const typeLabel = p.type.replace(/_/g, ' ').toLowerCase()

  return buildPageMetadata({
    title: `${p.title} — ${p.city}, ${p.province}`,
    description: `${p.bedrooms} bedroom ${typeLabel} ${forLabel} in ${p.suburb || p.city}, ${p.province}. ${price}. ${p.description.slice(0, 140).trim()}${p.description.length > 140 ? '…' : ''}`,
    path: `/properties/${id}`,
    keywords: [
      `${p.city} property ${forLabel}`,
      `${p.province} homes`,
      p.listingType === 'RENT' ? 'rental listing' : 'house for sale',
      p.suburb,
    ].filter(Boolean) as string[],
  })
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getPublicPropertyById(id)

  if (!result) notFound()

  const p = result.property
  const imageUrl = localImageCacheBust(getPropertyImageUrl(p.images, 0))
  const listingImage =
    imageUrl.startsWith('http')
      ? imageUrl
      : imageUrl.startsWith('/')
        ? `${getSiteUrl()}${imageUrl}`
        : undefined

  const raw = result.property
  const propertyWithFreshImages = {
    ...raw,
    createdAt: 'createdAt' in raw && raw.createdAt ? raw.createdAt : undefined,
    qualityScore:
      'qualityScore' in raw && typeof raw.qualityScore === 'number'
        ? raw.qualityScore
        : undefined,
    features: parsePropertyFeatures(
      'features' in raw ? raw.features : undefined
    ),
    images: raw.images.map((image) => ({
      ...image,
      url: localImageCacheBust(image.url),
    })),
  }

  return (
    <>
      <ListingViewTracker propertyId={p.id} isDemo={result.isDemo} />
      <JsonLd
        data={realEstateListingJsonLd({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          city: p.city,
          province: p.province,
          suburb: p.suburb,
          location: p.location,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          listingType: p.listingType,
          imageUrl: listingImage,
        })}
      />
      <PropertyDetailView property={propertyWithFreshImages} isDemo={result.isDemo} />
    </>
  )
}
