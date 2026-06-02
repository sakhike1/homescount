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

  const seller = await prisma.user.findFirst({
    where: { id, role: 'SELLER' },
  })
  if (!seller) return forbidden()

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: {
        active: false,
        suspendedAt: new Date(),
        suspendedReason: reason?.trim() || 'Account suspended by admin',
      },
    }),
    prisma.property.updateMany({
      where: { sellerId: id, published: true },
      data: { published: false },
    }),
  ])

  await logActivity({
    type: 'SELLER_SUSPENDED',
    message: `Seller suspended: ${seller.name} (${seller.email})`,
    userId: id,
    metadata: { reason: reason?.trim() || null, adminId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
