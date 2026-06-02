import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { normalizeSaPhone } from '@/lib/sms'
import { getSellerSession, unauthorized, forbidden } from '@/lib/api-auth'

export async function GET() {
  const session = await getSellerSession()
  if (!session) return unauthorized()
  if (session.user.role !== 'SELLER') return forbidden()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true },
  })

  return NextResponse.json({ phone: user?.phone ?? '' })
}

export async function PATCH(req: Request) {
  const session = await getSellerSession()
  if (!session) return unauthorized()
  if (session.user.role !== 'SELLER') return forbidden()

  const { phone } = await req.json()
  const trimmed = typeof phone === 'string' ? phone.trim() : ''

  if (trimmed && !normalizeSaPhone(trimmed)) {
    return NextResponse.json(
      { error: 'Enter a valid SA mobile number (e.g. 082 123 4567)' },
      { status: 400 }
    )
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { phone: trimmed || null },
    select: { phone: true },
  })

  return NextResponse.json({ phone: user.phone ?? '' })
}
