import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import { getAdminSession, unauthorized, forbidden } from '@/lib/api-auth'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
    include: { seller: { select: { id: true, name: true } } },
  })
  if (!property) return forbidden()

  await prisma.property.update({
    where: { id },
    data: {
      featured: false,
      featuredUntil: null,
      adPlan: 'NONE',
    },
  })

  await logActivity({
    type: 'AD_EXPIRED',
    message: `Admin ended advertisement for "${property.title}" (${property.seller.name})`,
    userId: property.sellerId,
    metadata: { propertyId: id, adminId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
