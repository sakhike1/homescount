import prisma from '@/lib/prisma'

export type ListingAnalytics = {
  totalViews: number
  viewsThisWeek: number
  viewsLastWeek: number
  inquiryCount: number
  weekChangePercent: number | null
}

function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export async function getListingAnalytics(
  propertyId: string,
  sellerId: string
): Promise<ListingAnalytics | null> {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, sellerId },
    select: { id: true, _count: { select: { inquiries: true, listingViews: true } } },
  })
  if (!property) return null

  const now = new Date()
  const thisWeekStart = startOfWeek(now)
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const [viewsThisWeek, viewsLastWeek] = await Promise.all([
    prisma.listingView.count({
      where: { propertyId, viewedAt: { gte: thisWeekStart } },
    }),
    prisma.listingView.count({
      where: {
        propertyId,
        viewedAt: { gte: lastWeekStart, lt: thisWeekStart },
      },
    }),
  ])

  const weekChangePercent =
    viewsLastWeek > 0
      ? Math.round(((viewsThisWeek - viewsLastWeek) / viewsLastWeek) * 100)
      : viewsThisWeek > 0
        ? 100
        : null

  return {
    totalViews: property._count.listingViews,
    viewsThisWeek,
    viewsLastWeek,
    inquiryCount: property._count.inquiries,
    weekChangePercent,
  }
}

export async function recordListingView(propertyId: string): Promise<boolean> {
  const exists = await prisma.property.findFirst({
    where: {
      id: propertyId,
      published: true,
      status: 'AVAILABLE',
      seller: { active: true },
    },
    select: { id: true },
  })
  if (!exists) return false

  await prisma.listingView.create({
    data: { propertyId },
  })
  return true
}
