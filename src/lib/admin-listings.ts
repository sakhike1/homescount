import prisma from '@/lib/prisma'

export async function getAdminListings() {
  return prisma.property.findMany({
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          active: true,
        },
      },
      images: { take: 1, orderBy: { createdAt: 'asc' } },
      _count: { select: { inquiries: true } },
    },
    orderBy: [{ published: 'desc' }, { updatedAt: 'desc' }],
  })
}

export async function getAdminInquiries(limit = 50) {
  return prisma.inquiry.findMany({
    include: {
      property: {
        select: { id: true, title: true, seller: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}
