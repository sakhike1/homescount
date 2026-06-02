import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import { AD_PLANS, type AdPlanKey } from '@/lib/ad-plans'
import {
  forbidden,
  getSellerSession,
  unauthorized,
} from '@/lib/api-auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const { id } = await params
  const property = await prisma.property.findFirst({
    where: { id, sellerId: session.user.id },
  })
  if (!property) return forbidden()

  try {
    const { plan } = await req.json()
    if (!plan || !(plan in AD_PLANS)) {
      return NextResponse.json({ error: 'Invalid ad plan' }, { status: 400 })
    }

    const planKey = plan as AdPlanKey
    const selected = AD_PLANS[planKey]
    const featuredUntil = new Date()
    featuredUntil.setDate(featuredUntil.getDate() + selected.days)

    const [payment, updated] = await prisma.$transaction([
      prisma.adPayment.create({
        data: {
          plan: planKey,
          amount: selected.price,
          status: 'COMPLETED',
          propertyId: id,
          sellerId: session.user.id,
        },
      }),
      prisma.property.update({
        where: { id },
        data: {
          featured: true,
          featuredUntil,
          adPlan: planKey,
        },
      }),
    ])

    await logActivity({
      type: 'AD_PAYMENT',
      message: `${session.user.name} purchased ${selected.label} (R ${selected.price}) for "${property.title}"`,
      userId: session.user.id,
      metadata: {
        propertyId: id,
        plan: planKey,
        amount: selected.price,
        paymentId: payment.id,
      },
    })

    return NextResponse.json({
      message: 'Advertising activated (demo payment)',
      payment,
      property: updated,
    })
  } catch (error) {
    console.error('Promote property error:', error)
    return NextResponse.json(
      { error: 'Failed to process advertising payment' },
      { status: 500 }
    )
  }
}
