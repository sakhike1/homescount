import prisma from '@/lib/prisma'
import type { ListingType, Prisma } from '@/generated/prisma/client'
import { propertyImageAt } from '@/lib/property-images'
import { withDbTimeout } from '@/lib/db-timeout'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import {
  demoToBrowseProperty,
  demoToFeaturedGrid,
  filterDemoProperties,
  getDemoPropertyById,
} from '@/lib/demo-properties'
import {
  normalizeListingSeller,
  normalizeListingVerified,
} from '@/lib/listing-seller-display'
import { parsePropertyFeatures } from '@/lib/property-features'
export { formatPrice, formatZaNumber } from '@/lib/format-price'

export function parseListingTypeFromParam(
  type?: string
): ListingType | undefined {
  if (type === 'buy') return 'SALE'
  if (type === 'rent') return 'RENT'
  return undefined
}

export type PropertyFilters = {
  listingType?: ListingType
  q?: string
  suburb?: string
  address?: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  /** Public browse pages only show published listings */
  publishedOnly?: boolean
}

function buildWhere(filters: PropertyFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    status: 'AVAILABLE',
  }

  if (filters.publishedOnly !== false) {
    where.published = true
    where.seller = { active: true }
  }

  if (filters.listingType) {
    where.listingType = filters.listingType
  }

  if (filters.suburb?.trim()) {
    where.suburb = { contains: filters.suburb.trim(), mode: 'insensitive' }
  }

  if (filters.address?.trim()) {
    where.location = { contains: filters.address.trim(), mode: 'insensitive' }
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim()
    where.OR = [
      { city: { contains: q, mode: 'insensitive' } },
      { province: { contains: q, mode: 'insensitive' } },
      { suburb: { contains: q, mode: 'insensitive' } },
      { location: { contains: q, mode: 'insensitive' } },
      { title: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (filters.minBedrooms && filters.minBedrooms > 0) {
    where.bedrooms = { gte: filters.minBedrooms }
  }

  const priceFilter: Prisma.FloatFilter = {}
  if (filters.minPrice && filters.minPrice > 0) {
    priceFilter.gte = filters.minPrice
  }
  if (filters.maxPrice && filters.maxPrice > 0) {
    priceFilter.lte = filters.maxPrice
  }
  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter
  }

  return where
}

const propertyListInclude = {
  images: { take: 1, orderBy: [{ createdAt: 'asc' as const }, { id: 'asc' as const }] },
  seller: { select: { name: true } },
} satisfies Prisma.PropertyInclude

const propertyOrderBy = [
  { featured: 'desc' as const },
  { publishedAt: 'desc' as const },
  { createdAt: 'desc' as const },
]

export async function getProperties(filters: PropertyFilters = {}, limit?: number) {
  return withDbTimeout(
    prisma.property.findMany({
      where: buildWhere({ publishedOnly: true, ...filters }),
      include: propertyListInclude,
      orderBy: propertyOrderBy,
      ...(limit ? { take: limit } : {}),
    })
  )
}

export async function getPropertyById(id: string) {
  return withDbTimeout(
    prisma.property.findFirst({
      where: { id, published: true, status: 'AVAILABLE', seller: { active: true } },
      include: {
        images: { orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] },
        seller: {
          select: {
            name: true,
            email: true,
            phone: true,
            companyName: true,
            companyAddress: true,
            companyLogoUrl: true,
            showPhone: true,
          },
        },
      },
    })
  )
}

const getHasPublishedListingsCached = unstable_cache(
  async () => {
    try {
      const count = await withDbTimeout(
        prisma.property.count({
          where: { published: true, status: 'AVAILABLE', seller: { active: true } },
        })
      )
      return count > 0
    } catch {
      return false
    }
  },
  ['has-published-listings'],
  { revalidate: 30, tags: ['properties'] }
)

export const hasPublishedListings = cache(async () => {
  return getHasPublishedListingsCached()
})

function filtersCacheKey(filters: PropertyFilters): string {
  return JSON.stringify({
    listingType: filters.listingType ?? null,
    q: filters.q?.trim() ?? '',
    suburb: filters.suburb?.trim() ?? '',
    address: filters.address?.trim() ?? '',
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    minBedrooms: filters.minBedrooms ?? null,
  })
}

const getBrowseListingsFromDb = unstable_cache(
  async (key: string) => {
    const filters = JSON.parse(key) as PropertyFilters
    return getProperties(filters)
  },
  ['browse-listings'],
  { revalidate: 30, tags: ['properties'] }
)

export async function getBrowseListings(filters: PropertyFilters = {}) {
  const useReal = await hasPublishedListings()

  if (useReal) {
    try {
      const properties = await getBrowseListingsFromDb(filtersCacheKey(filters))
      return { properties, isDemo: false as const }
    } catch {
      // Neon cold start / timeout — show demo listings instead of hanging or erroring.
    }
  }

  const demos = filterDemoProperties(filters).map(demoToBrowseProperty)
  return { properties: demos, isDemo: true as const }
}

function normalizePublicProperty<T extends {
  location: string
  suburb: string
  city: string
  province: string
  verified?: boolean
  qualityScore?: number
  features?: unknown
  seller: {
    name: string
    email: string
    phone?: string | null
    companyName?: string | null
    companyAddress?: string | null
    companyLogoUrl?: string | null
    showPhone?: boolean
  }
}>(property: T, isDemo: boolean) {
  return {
    ...property,
    verified: normalizeListingVerified(property, isDemo),
    features: parsePropertyFeatures(property.features),
    seller: normalizeListingSeller(property.seller, property),
  }
}

export const getPublicPropertyById = cache(async (id: string) => {
  // Demo listings never touch the database (avoids Neon timeouts on sample pages).
  if (id.startsWith('demo-')) {
    const demo = getDemoPropertyById(id)
    return demo
      ? { property: normalizePublicProperty(demo, true), isDemo: true as const }
      : null
  }

  const demo = getDemoPropertyById(id)
  if (demo) {
    return { property: normalizePublicProperty(demo, true), isDemo: true as const }
  }

  try {
    const property = await getPropertyById(id)
    if (property) {
      return {
        property: normalizePublicProperty(
          {
            ...property,
            qualityScore: property.qualityScore,
            features: property.features,
          },
          false
        ),
        isDemo: false as const,
      }
    }
  } catch {
    // DB unreachable — page falls through to 404 for live IDs; demos already returned above.
  }

  return null
})

const getFeaturedListingsFromDb = unstable_cache(
  async (limit: number) => {
    const properties = await getProperties({}, limit)
    return properties.map((p, i) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      city: p.city,
      province: p.province,
      bedrooms: p.bedrooms,
      listingType: p.listingType,
      imageUrl: getPropertyImageUrl(p.images, i),
    }))
  },
  ['featured-listings'],
  { revalidate: 30, tags: ['properties'] }
)

export async function getFeaturedListings(limit = 6) {
  const useReal = await hasPublishedListings()

  if (useReal) {
    try {
      const saleItems = await getFeaturedListingsFromDb(limit)
      if (saleItems.length > 0) {
        const sales = saleItems.filter((p) => p.listingType === 'SALE')
        const items =
          sales.length >= limit
            ? sales.slice(0, limit)
            : [
                ...sales,
                ...saleItems.filter((p) => p.listingType !== 'SALE').slice(0, limit - sales.length),
              ]
        return { isDemo: false as const, items: items.slice(0, limit) }
      }
    } catch {
      // fall through to demo featured listings
    }
  }

  const demos = filterDemoProperties({ listingType: 'SALE' }).slice(0, limit)
  return {
    isDemo: true as const,
    items: demos.map(demoToFeaturedGrid),
  }
}

export type PlatformStats = {
  listings: number
  sellers: number
  provinces: number
  isLive: boolean
}

async function computePlatformStats(): Promise<PlatformStats> {
  try {
    const useReal = await hasPublishedListings()

    if (useReal) {
      const publishedWhere = {
        published: true,
        status: 'AVAILABLE' as const,
        seller: { active: true },
      }
      const [listingCount, sellerCount, provinceRows] = await Promise.all([
        withDbTimeout(prisma.property.count({ where: publishedWhere })),
        withDbTimeout(
          prisma.user.count({
            where: {
              role: 'SELLER',
              properties: { some: { published: true, status: 'AVAILABLE' } },
            },
          })
        ),
        withDbTimeout(
          prisma.property.findMany({
            where: publishedWhere,
            select: { province: true },
            distinct: ['province'],
          })
        ),
      ])

      return {
        listings: listingCount,
        sellers: Math.max(sellerCount, 1),
        provinces: Math.max(provinceRows.length, 1),
        isLive: true,
      }
    }

    const { demoProperties } = await import('@/lib/demo-properties')
    const demoProvinces = new Set(demoProperties.map((p) => p.province))

    return {
      listings: demoProperties.length,
      sellers: 1,
      provinces: demoProvinces.size,
      isLive: false,
    }
  } catch {
    return { listings: 12, sellers: 1, provinces: 6, isLive: false }
  }
}

const getPlatformStatsCached = unstable_cache(
  computePlatformStats,
  ['platform-stats'],
  { revalidate: 60, tags: ['properties'] }
)

export async function getPlatformStats(): Promise<PlatformStats> {
  return getPlatformStatsCached()
}

export function getPropertyImageUrl(
  images: { url: string }[],
  index = 0
): string {
  return images[index]?.url ?? propertyImageAt(index)
}

/** @deprecated use getPropertyImageUrl */
export const getPropertyImages = getPropertyImageUrl
