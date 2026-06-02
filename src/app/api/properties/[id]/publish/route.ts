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

export async function POST(
  _req: Request,
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

  const updated = await prisma.property.update({
    where: { id },
    data: {
      published: true,
      publishedAt: new Date(),
      status: 'AVAILABLE',
    },
  })

  revalidateTag('properties', 'max')

  await logActivity({
    type: 'LISTING_PUBLISHED',
    message: `Listing published: "${property.title}"`,
    userId: session.user.id,
    metadata: { propertyId: id },
  })

  return NextResponse.json({
    message: 'Listing published! It is now visible on the properties page.',
    property: updated,
  })
}
