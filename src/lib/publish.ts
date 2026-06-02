export type PublishCheck = {
  ok: boolean
  missing: string[]
}

export function canPublishListing(property: {
  title: string
  description: string
  price: number
  location: string
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  size: number
  images: { url: string }[]
}): PublishCheck {
  const missing: string[] = []

  if (!property.title?.trim()) missing.push('Title')
  if (!property.description?.trim()) missing.push('Description')
  if (!property.price || property.price <= 0) missing.push('Price')
  if (!property.location?.trim()) missing.push('Street address')
  if (!property.city?.trim()) missing.push('City')
  if (!property.province?.trim()) missing.push('Province')
  if (property.bedrooms < 0) missing.push('Bedrooms')
  if (property.bathrooms < 0) missing.push('Bathrooms')
  if (!property.size || property.size <= 0) missing.push('Property size (m²)')
  if (property.images.length === 0) missing.push('At least one photo')

  return { ok: missing.length === 0, missing }
}
