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
    include: { seller: { select: { name: true, email: true } } },
  })
  if (!property) return forbidden()

  await prisma.property.update({
    where: { id },
    data: { published: false },
  })

  await logActivity({
    type: 'LISTING_UNPUBLISHED',
    message: `Listing unpublished: "${property.title}" (${property.seller.name})`,
    userId: property.sellerId,
    metadata: { propertyId: id, adminId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
