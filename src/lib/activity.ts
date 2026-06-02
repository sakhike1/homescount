import prisma from '@/lib/prisma'
import type { ActivityType, Prisma } from '@/generated/prisma/client'

export async function logActivity({
  type,
  message,
  userId,
  metadata,
}: {
  type: ActivityType
  message: string
  userId?: string
  metadata?: Prisma.InputJsonValue
}) {
  try {
    await prisma.siteActivity.create({
      data: { type, message, userId, metadata },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

export async function getRecentActivities(limit = 50) {
  return prisma.siteActivity.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getUnreadActivityCount() {
  return prisma.siteActivity.count({ where: { read: false } })
}

export async function markAllActivitiesRead() {
  await prisma.siteActivity.updateMany({
    where: { read: false },
    data: { read: true },
  })
}

/** Clear featured status on properties whose ad period has ended */
export async function expireOverdueAdvertisements() {
  const now = new Date()
  const overdue = await prisma.property.findMany({
    where: {
      featured: true,
      featuredUntil: { lt: now },
    },
    include: { seller: { select: { name: true } } },
  })

  if (overdue.length === 0) return 0

  await prisma.property.updateMany({
    where: {
      featured: true,
      featuredUntil: { lt: now },
    },
    data: {
      featured: false,
      featuredUntil: null,
      adPlan: 'NONE',
    },
  })

  for (const p of overdue) {
    await logActivity({
      type: 'AD_EXPIRED',
      message: `Advertisement ended for "${p.title}" (${p.seller.name})`,
      userId: p.sellerId,
      metadata: { propertyId: p.id },
    })
  }

  return overdue.length
}
