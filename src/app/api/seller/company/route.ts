import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { normalizeSaPhone } from '@/lib/sms'
import { forbidden, getSellerSession, unauthorized } from '@/lib/api-auth'

export async function GET() {
  const session = await getSellerSession()
  if (!session) return unauthorized()
  if (session.user.role !== 'SELLER') return forbidden()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      phone: true,
      companyName: true,
      companyAddress: true,
      companyLogoUrl: true,
      showPhone: true,
    },
  })

  return NextResponse.json(user ?? {})
}

export async function PATCH(req: Request) {
  const session = await getSellerSession()
  if (!session) return unauthorized()
  if (session.user.role !== 'SELLER') return forbidden()

  const body = await req.json()
  const phone =
    typeof body.phone === 'string' ? body.phone.trim() : undefined

  if (phone && !normalizeSaPhone(phone)) {
    return NextResponse.json(
      { error: 'Enter a valid SA mobile number (e.g. 082 123 4567)' },
      { status: 400 }
    )
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(typeof body.companyName === 'string'
        ? { companyName: body.companyName.trim() || null }
        : {}),
      ...(typeof body.companyAddress === 'string'
        ? { companyAddress: body.companyAddress.trim() || null }
        : {}),
      ...(typeof body.companyLogoUrl === 'string'
        ? { companyLogoUrl: body.companyLogoUrl.trim() || null }
        : {}),
      ...(typeof body.showPhone === 'boolean' ? { showPhone: body.showPhone } : {}),
    },
    select: {
      name: true,
      phone: true,
      companyName: true,
      companyAddress: true,
      companyLogoUrl: true,
      showPhone: true,
    },
  })

  return NextResponse.json(user)
}
