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
    include: { seller: { select: { name: true, active: true } } },
  })
  if (!property) return forbidden()
  if (!property.seller.active) {
    return NextResponse.json(
      { error: 'Reactivate the seller before publishing their listings.' },
      { status: 400 }
    )
  }

  await prisma.property.update({
    where: { id },
    data: {
      published: true,
      publishedAt: new Date(),
      status: 'AVAILABLE',
    },
  })

  await logActivity({
    type: 'LISTING_REPUBLISHED',
    message: `Listing republished: "${property.title}" (${property.seller.name})`,
    userId: property.sellerId,
    metadata: { propertyId: id, adminId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
