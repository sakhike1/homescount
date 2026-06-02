import { propertyImageAt, propertyImages } from '@/lib/property-images'

/** Image paths for property news cards. */
export const newsImages = {
  featured: {
    rates: propertyImages[0],
    oil: propertyImages[1],
  },
  side: {
    sona: propertyImages[2],
    febRates: propertyImages[3],
    climate: propertyImages[4],
    outlook: propertyImages[5],
  },
} as const

export { propertyImageAt }
