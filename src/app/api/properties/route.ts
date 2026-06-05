import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSellerSession, unauthorized } from '@/lib/api-auth'

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

    const property = await prisma.property.create({
      data: {
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
        type,
        listingType,
        published: false,
        sellerId: session.user.id,
        virtualTourUrl: virtualTourUrl?.trim() || null,
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
