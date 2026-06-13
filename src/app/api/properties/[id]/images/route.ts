import { NextResponse } from 'next/server'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import prisma from '@/lib/prisma'
import {
  forbidden,
  getSellerSession,
  unauthorized,
} from '@/lib/api-auth'
import { refreshPropertyQualityScore } from '@/lib/property-quality-sync'
import { propertyImageOrderBy } from '@/lib/property-image-order'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_IMAGES_PER_LISTING = 30
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function validateFile(file: File): string | null {
  if (!file.type.startsWith('image/') || !ACCEPTED_TYPES.has(file.type)) {
    return `${file.name}: use JPG, PNG, or WebP`
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name}: exceeds 5MB limit`
  }
  return null
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()

  const { id } = await params
  const property = await prisma.property.findFirst({
    where: { id, sellerId: session.user.id },
    include: { images: { orderBy: propertyImageOrderBy } },
  })

  if (!property) return forbidden()

  try {
    const formData = await req.formData()
    const files = formData.getAll('images').filter((f) => f instanceof File) as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const remaining = MAX_IMAGES_PER_LISTING - property.images.length
    if (remaining <= 0) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES_PER_LISTING} photos per listing` },
        { status: 400 }
      )
    }

    const uploadDir = path.join(
      process.cwd(),
      'public',
      'property-images',
      'uploads'
    )
    await mkdir(uploadDir, { recursive: true })

    const created = []
    const errors: string[] = []
    let nextSort =
      property.images.reduce((max, img) => Math.max(max, img.sortOrder), -1) + 1

    for (const file of files.slice(0, remaining)) {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(validationError)
        continue
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filename = `${randomUUID()}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), buffer)

      const url = `/property-images/uploads/${filename}`
      const image = await prisma.image.create({
        data: { url, propertyId: id, sortOrder: nextSort },
      })
      created.push(image)
      nextSort += 1
    }

    if (created.length === 0) {
      return NextResponse.json(
        {
          error:
            errors[0] ?? 'No valid images uploaded (max 5MB each, JPG/PNG/WebP)',
          errors,
        },
        { status: 400 }
      )
    }

    await refreshPropertyQualityScore(id)
    return NextResponse.json({ created, errors }, { status: 201 })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

  const body = await req.json().catch(() => null)
  const order = body?.order as string[] | undefined
  if (!order?.length) {
    return NextResponse.json({ error: 'order array required' }, { status: 400 })
  }

  const imageIds = new Set(property.images.map((img) => img.id))
  if (order.length !== imageIds.size || order.some((id) => !imageIds.has(id))) {
    return NextResponse.json({ error: 'Invalid image order' }, { status: 400 })
  }

  await prisma.$transaction(
    order.map((imageId, index) =>
      prisma.image.update({
        where: { id: imageId },
        data: { sortOrder: index },
      })
    )
  )

  const images = await prisma.image.findMany({
    where: { propertyId: id },
    orderBy: propertyImageOrderBy,
  })

  return NextResponse.json({ images })
}

export async function DELETE(
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

  const { searchParams } = new URL(req.url)
  const imageId = searchParams.get('imageId')
  if (!imageId) {
    return NextResponse.json({ error: 'imageId required' }, { status: 400 })
  }

  const image = await prisma.image.findFirst({
    where: { id: imageId, propertyId: id },
  })
  if (!image) return forbidden()

  await prisma.image.delete({ where: { id: imageId } })

  const remaining = await prisma.image.findMany({
    where: { propertyId: id },
    orderBy: propertyImageOrderBy,
  })
  await prisma.$transaction(
    remaining.map((img, index) =>
      prisma.image.update({
        where: { id: img.id },
        data: { sortOrder: index },
      })
    )
  )

  await refreshPropertyQualityScore(id)
  return NextResponse.json({ success: true })
}
