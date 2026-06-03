import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import { getAdminSession, unauthorized, forbidden } from '@/lib/api-auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const { id } = await params
  const { reason } = await req.json().catch(() => ({}))

  const property = await prisma.property.findUnique({
    where: { id },
    include: { seller: { select: { name: true, email: true } } },
  })
  if (!property) return forbidden()

  await prisma.property.update({
    where: { id },
    data: {
      published: false,
      status: 'PENDING',
      featured: false,
      featuredUntil: null,
      adPlan: 'NONE',
    },
  })

  await logActivity({
    type: 'LISTING_SUSPENDED',
    message: `Listing suspended: "${property.title}" — ${reason?.trim() || 'Removed from public site by admin'}`,
    userId: property.sellerId,
    metadata: { propertyId: id, reason: reason?.trim() || null, adminId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
