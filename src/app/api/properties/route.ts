import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSellerSession, unauthorized } from '@/lib/api-auth'
import { computeListingQualityScore } from '@/lib/listing-quality'
import { parsePropertyFeatures } from '@/lib/property-features'

export async function GET() {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const properties = await prisma.property.findMany({
    where: { sellerId: session.user.id },
    include: {
      images: { orderBy: { createdAt: 'asc' } },
      adPayments: { orderBy: { createdAt: 'desc' }, take: 3 },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(properties)
}

export async function POST(req: Request) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  try {
    const body = await req.json()
    const {
      title,
      description,
      price,
      location,
      suburb,
      city,
      province,
      bedrooms,
      bathrooms,
      parkings,
      size,
      type,
      listingType,
      virtualTourUrl,
      features,
    } = body

    if (
      !title ||
      !description ||
      price == null ||
      !location ||
      !city ||
      !province ||
      bedrooms == null ||
      bathrooms == null ||
      !type ||
      !listingType
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const parsedFeatures = parsePropertyFeatures(features)
    const draft = {
      title,
      description,
      price: Number(price),
      location,
      suburb: suburb?.trim() || '',
      city,
      province,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      parkings: Number(parkings ?? 0),
      size: Number(size ?? 0),
      virtualTourUrl: virtualTourUrl?.trim() || null,
      images: [] as { url: string }[],
      features: parsedFeatures,
    }

    const { images: _images, ...propertyData } = draft

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        type,
        listingType,
        published: false,
        sellerId: session.user.id,
        qualityScore: computeListingQualityScore(draft),
      },
      include: { images: true },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Create property error:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}
