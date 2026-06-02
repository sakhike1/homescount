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

  try {
    const formData = await req.formData()
    const files = formData.getAll('images').filter((f) => f instanceof File)

    if (files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const uploadDir = path.join(
      process.cwd(),
      'public',
      'property-images',
      'uploads'
    )
    await mkdir(uploadDir, { recursive: true })

    const created = []

    for (const file of files as File[]) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 5 * 1024 * 1024) continue

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filename = `${randomUUID()}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(uploadDir, filename), buffer)

      const url = `/property-images/uploads/${filename}`
      const image = await prisma.image.create({
        data: { url, propertyId: id },
      })
      created.push(image)
    }

    if (created.length === 0) {
      return NextResponse.json(
        { error: 'No valid images uploaded (max 5MB each)' },
        { status: 400 }
      )
    }

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
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
  return NextResponse.json({ success: true })
}
