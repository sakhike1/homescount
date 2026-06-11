import type { ListingSeller } from '@/components/properties/PropertySellerCard'

type PropertyForSellerDisplay = {
  location: string
  suburb: string
  city: string
  province: string
  verified?: boolean
  qualityScore?: number
}

/** Consistent public seller card — company name, address, and contact fields. */
export function normalizeListingSeller(
  seller: ListingSeller,
  property: PropertyForSellerDisplay
): ListingSeller {
  const companyName = seller.companyName?.trim() || seller.name
  const propertyLine = [property.suburb, property.city, property.province]
    .filter(Boolean)
    .join(', ')
  const companyAddress =
    seller.companyAddress?.trim() ||
    (propertyLine ? `Listing office — ${propertyLine}` : undefined)

  return {
    ...seller,
    companyName,
    companyAddress: companyAddress ?? null,
    showPhone: seller.showPhone !== false,
  }
}

/** Align verified badge across published listings (admin flag or quality threshold). */
export function normalizeListingVerified(
  property: PropertyForSellerDisplay & { verified?: boolean },
  isDemo = false
): boolean {
  if (property.verified) return true
  if (isDemo) return false
  if (property.qualityScore == null) return true
  return property.qualityScore >= 35
}
