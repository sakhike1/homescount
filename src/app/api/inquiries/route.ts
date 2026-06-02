import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'
import { sendSellerInquirySms } from '@/lib/sms'
import { getSellerSession, unauthorized, forbidden } from '@/lib/api-auth'
import { getSellerInquiries } from '@/lib/inquiries'

export async function GET() {
  const session = await getSellerSession()
  if (!session) return unauthorized()
  if (session.user.role !== 'SELLER') return forbidden()

  const inquiries = await getSellerInquiries(session.user.id)
  return NextResponse.json(inquiries)
}

export async function POST(req: Request) {
  try {
    const { propertyId, name, email, phone, message, privacyConsent } =
      await req.json()

    if (!propertyId || !name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    if (privacyConsent !== true) {
      return NextResponse.json(
        { error: 'Privacy consent is required to send an enquiry' },
        { status: 400 }
      )
    }

    const property = await prisma.property.findFirst({
      where: { id: propertyId, published: true },
      include: {
        seller: { select: { id: true, name: true, phone: true, email: true } },
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        message: message.trim(),
        privacyConsentAt: new Date(),
      },
    })

    if (property.seller.phone) {
      await sendSellerInquirySms({
        sellerPhone: property.seller.phone,
        buyerName: name.trim(),
        propertyTitle: property.title,
      })
    }

    await logActivity({
      type: 'INQUIRY_SENT',
      message: `${name.trim()} enquired on "${property.title}"`,
      metadata: {
        propertyId,
        inquiryId: inquiry.id,
        buyerEmail: email.trim(),
      },
    })

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json(
      { error: 'Could not send message' },
      { status: 500 }
    )
  }
}
