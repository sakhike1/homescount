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

  const seller = await prisma.user.findFirst({
    where: { id, role: 'SELLER' },
  })
  if (!seller) return forbidden()

  await prisma.user.update({
    where: { id },
    data: {
      active: true,
      suspendedAt: null,
      suspendedReason: null,
    },
  })

  await logActivity({
    type: 'SELLER_REACTIVATED',
    message: `Seller reactivated: ${seller.name} (${seller.email})`,
    userId: id,
    metadata: { adminId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
