import prisma from '@/lib/prisma'
import type { ListingType, Prisma } from '@/generated/prisma/client'
import { propertyImageAt } from '@/lib/property-images'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import {
  demoToBrowseProperty,
  demoToFeaturedGrid,
  filterDemoProperties,
  getDemoPropertyById,
} from '@/lib/demo-properties'

export function parseListingTypeFromParam(
  type?: string
): ListingType | undefined {
  if (type === 'buy') return 'SALE'
  if (type === 'rent') return 'RENT'
  return undefined
}

export function formatPrice(price: number, listingType: string) {
  const formatted = price.toLocaleString('en-ZA')
  return listingType === 'RENT' ? `R ${formatted}/mo` : `R ${formatted}`
}

export type PropertyFilters = {
  listingType?: ListingType
  q?: string
  suburb?: string
  address?: string
  minPrice?: number
  maxPrice?: number
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
  images: { take: 1, orderBy: { createdAt: 'asc' as const } },
  seller: { select: { name: true } },
} satisfies Prisma.PropertyInclude

const propertyOrderBy = [
  { featured: 'desc' as const },
  { publishedAt: 'desc' as const },
  { createdAt: 'desc' as const },
]

export async function getProperties(filters: PropertyFilters = {}, limit?: number) {
  return prisma.property.findMany({
    where: buildWhere({ publishedOnly: true, ...filters }),
    include: propertyListInclude,
    orderBy: propertyOrderBy,
    ...(limit ? { take: limit } : {}),
  })
}

export async function getPropertyById(id: string) {
  return prisma.property.findFirst({
    where: { id, published: true, status: 'AVAILABLE', seller: { active: true } },
    include: {
      images: { orderBy: { createdAt: 'asc' } },
      seller: { select: { name: true, email: true } },
    },
  })
}

const getHasPublishedListingsCached = unstable_cache(
  async () => {
    try {
      const count = await prisma.property.count({
        where: { published: true, status: 'AVAILABLE', seller: { active: true } },
      })
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
    const properties = await getBrowseListingsFromDb(filtersCacheKey(filters))
    return { properties, isDemo: false as const }
  }

  const demos = filterDemoProperties(filters).map(demoToBrowseProperty)
  return { properties: demos, isDemo: true as const }
}

export async function getPublicPropertyById(id: string) {
  const property = await getPropertyById(id)
  if (property) return { property, isDemo: false as const }

  const useReal = await hasPublishedListings()
  if (useReal) return null

  const demo = getDemoPropertyById(id)
  if (!demo) return null

  return { property: demo, isDemo: true as const }
}

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
    const items = await getFeaturedListingsFromDb(limit)
    return { isDemo: false as const, items }
  }

  const demos = filterDemoProperties().slice(0, limit)
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
      const [listingCount, sellerCount, provinceRows] = await Promise.all([
        prisma.property.count({
          where: { published: true, status: 'AVAILABLE', seller: { active: true } },
        }),
        prisma.user.count({
          where: {
            role: 'SELLER',
            properties: { some: { published: true, status: 'AVAILABLE' } },
          },
        }),
        prisma.property.findMany({
          where: { published: true, status: 'AVAILABLE', seller: { active: true } },
          select: { province: true },
          distinct: ['province'],
        }),
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
