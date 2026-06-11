import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  forbidden,
  getSellerSession,
  unauthorized,
} from '@/lib/api-auth'
import { computeListingQualityScore } from '@/lib/listing-quality'
import { parsePropertyFeatures } from '@/lib/property-features'

async function getOwnedProperty(id: string, sellerId: string) {
  return prisma.property.findFirst({
    where: { id, sellerId },
    include: {
      images: { orderBy: { createdAt: 'asc' } },
      adPayments: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const { id } = await params
  const property = await getOwnedProperty(id, session.user.id)
  if (!property) return forbidden()

  return NextResponse.json(property)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const { id } = await params
  const existing = await getOwnedProperty(id, session.user.id)
  if (!existing) return forbidden()

  try {
    const body = await req.json()
    const parsedFeatures =
      body.features !== undefined
        ? parsePropertyFeatures(body.features)
        : parsePropertyFeatures(existing.features)

    const next = {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      price: body.price != null ? Number(body.price) : existing.price,
      location: body.location ?? existing.location,
      suburb: body.suburb ?? existing.suburb,
      city: body.city ?? existing.city,
      province: body.province ?? existing.province,
      bedrooms:
        body.bedrooms != null ? Number(body.bedrooms) : existing.bedrooms,
      bathrooms:
        body.bathrooms != null ? Number(body.bathrooms) : existing.bathrooms,
      parkings:
        body.parkings != null ? Number(body.parkings) : existing.parkings,
      size: body.size != null ? Number(body.size) : existing.size,
      type: body.type ?? existing.type,
      listingType: body.listingType ?? existing.listingType,
      status: body.status ?? existing.status,
      virtualTourUrl:
        body.virtualTourUrl !== undefined
          ? String(body.virtualTourUrl).trim() || null
          : existing.virtualTourUrl,
      features: parsedFeatures,
      images: existing.images,
    }

    const { images: _images, ...propertyData } = next

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        qualityScore: computeListingQualityScore(next),
      },
      include: { images: true },
    })

    return NextResponse.json(property)
  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const { id } = await params
  const existing = await getOwnedProperty(id, session.user.id)
  if (!existing) return forbidden()

  await prisma.property.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
