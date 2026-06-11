import { countFilledFeatures, type PropertyFeatures } from '@/lib/property-features'

export type ListingQualityInput = {
  title: string
  description: string
  price: number
  location: string
  suburb: string
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  parkings: number
  size: number
  virtualTourUrl?: string | null
  images: { url: string }[]
  features?: PropertyFeatures | null
}

export type ListingQualityTier = 'excellent' | 'good' | 'fair' | 'needs-work'

export function computeListingQualityScore(input: ListingQualityInput): number {
  let score = 0

  if (input.title.trim().length >= 12) score += 5
  if (input.description.trim().length >= 120) score += 10
  if (input.description.trim().length >= 280) score += 5
  if (input.suburb.trim()) score += 5
  if (input.size > 0) score += 5
  if (input.bedrooms >= 0) score += 3
  if (input.bathrooms >= 0) score += 3
  if (input.parkings > 0) score += 2
  if (input.price > 0) score += 2

  const imageCount = input.images.length
  score += Math.min(30, imageCount * 5)
  if (imageCount >= 5) score += 5

  const amenityCount = countFilledFeatures(input.features ?? {})
  score += Math.min(20, amenityCount * 2)

  if (input.virtualTourUrl?.trim()) score += 5

  return Math.min(100, Math.round(score))
}

export function listingQualityTier(score: number): ListingQualityTier {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'needs-work'
}

export function listingQualityLabel(score: number): string {
  const tier = listingQualityTier(score)
  switch (tier) {
    case 'excellent':
      return 'Excellent listing quality'
    case 'good':
      return 'Good listing quality'
    case 'fair':
      return 'Fair listing quality'
    default:
      return 'Listing needs more detail'
  }
}
