import prisma from '@/lib/prisma'

export async function getSellerInquiries(sellerId: string) {
  return prisma.inquiry.findMany({
    where: {
      property: { sellerId },
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          listingType: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUnreadInquiryCount(sellerId: string) {
  return prisma.inquiry.count({
    where: {
      read: false,
      property: { sellerId },
    },
  })
}

export async function markInquiryRead(inquiryId: string, sellerId: string) {
  const inquiry = await prisma.inquiry.findFirst({
    where: {
      id: inquiryId,
      property: { sellerId },
    },
  })
  if (!inquiry) return null

  return prisma.inquiry.update({
    where: { id: inquiryId },
    data: { read: true },
  })
}
