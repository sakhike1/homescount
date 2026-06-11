import prisma from '@/lib/prisma'
import { computeListingQualityScore } from '@/lib/listing-quality'
import { parsePropertyFeatures } from '@/lib/property-features'

export async function refreshPropertyQualityScore(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true },
  })
  if (!property) return

  const score = computeListingQualityScore({
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    suburb: property.suburb,
    city: property.city,
    province: property.province,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkings: property.parkings,
    size: property.size,
    virtualTourUrl: property.virtualTourUrl,
    images: property.images,
    features: parsePropertyFeatures(property.features),
  })

  await prisma.property.update({
    where: { id: propertyId },
    data: { qualityScore: score },
  })
}
