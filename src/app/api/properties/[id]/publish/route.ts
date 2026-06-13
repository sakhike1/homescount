import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import {
  forbidden,
  getSellerSession,
  unauthorized,
} from '@/lib/api-auth'
import { canPublishListing } from '@/lib/publish'
import { LISTING_PACKAGES, type ListingPackageKey } from '@/lib/listing-packages'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const { id } = await params

  const property = await prisma.property.findFirst({
    where: { id, sellerId: session.user.id },
    include: { images: true },
  })

  if (!property) return forbidden()

  if (property.published) {
    return NextResponse.json(
      { error: 'This listing is already published' },
      { status: 400 }
    )
  }

  const check = canPublishListing(property)
  if (!check.ok) {
    return NextResponse.json(
      {
        error: 'Complete your listing before publishing',
        missing: check.missing,
      },
      { status: 400 }
    )
  }

  let body: { plan?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Select a listing package' }, { status: 400 })
  }

  const plan = body.plan as ListingPackageKey | undefined
  if (!plan || !(plan in LISTING_PACKAGES)) {
    return NextResponse.json({ error: 'Select a valid listing package' }, { status: 400 })
  }

  const selected = LISTING_PACKAGES[plan]
  const featuredUntil = new Date()
  featuredUntil.setDate(featuredUntil.getDate() + selected.days)

  const [payment, updated] = await prisma.$transaction([
    prisma.adPayment.create({
      data: {
        plan,
        amount: selected.price,
        status: 'COMPLETED',
        propertyId: id,
        sellerId: session.user.id,
      },
    }),
    prisma.property.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date(),
        status: 'AVAILABLE',
        adPlan: plan,
        featured: selected.featured,
        featuredUntil: selected.featured ? featuredUntil : null,
      },
    }),
  ])

  revalidateTag('properties', 'max')

  await logActivity({
    type: 'LISTING_PUBLISHED',
    message: `Listing published (${selected.label}, R ${selected.price}): "${property.title}"`,
    userId: session.user.id,
    metadata: { propertyId: id, plan, paymentId: payment.id },
  })

  await logActivity({
    type: 'AD_PAYMENT',
    message: `${session.user.name} paid ${selected.label} (R ${selected.price}) to publish "${property.title}"`,
    userId: session.user.id,
    metadata: {
      propertyId: id,
      plan,
      amount: selected.price,
      paymentId: payment.id,
    },
  })

  return NextResponse.json({
    message: 'Payment successful — your listing is now live!',
    payment,
    property: updated,
  })
}
