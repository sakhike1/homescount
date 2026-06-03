import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'
import { getSiteUrl } from '@/lib/seo'

const staticPaths = [
  { path: '', priority: 1, changeFrequency: 'daily' as const },
  { path: '/buy', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/rent', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/sell', priority: 0.85, changeFrequency: 'weekly' as const },
  { path: '/properties', priority: 0.95, changeFrequency: 'daily' as const },
  { path: '/properties?type=buy', priority: 0.85, changeFrequency: 'daily' as const },
  { path: '/properties?type=rent', priority: 0.85, changeFrequency: 'daily' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  try {
    const listings = await prisma.property.findMany({
      where: { published: true, status: 'AVAILABLE' },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    })

    for (const listing of listings) {
      entries.push({
        url: `${siteUrl}/properties/${listing.id}`,
        lastModified: listing.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch {
    // Build-time or missing DATABASE_URL — static URLs only
  }

  return entries
}
