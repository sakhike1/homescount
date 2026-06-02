import { NextResponse } from 'next/server'
import { getSellerSession, unauthorized, forbidden } from '@/lib/api-auth'
import { markInquiryRead } from '@/lib/inquiries'

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSellerSession()
  if (!session) return unauthorized()
  if (session.user.role !== 'SELLER') return forbidden()

  const { id } = await params
  const inquiry = await markInquiryRead(id, session.user.id)

  if (!inquiry) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  return NextResponse.json(inquiry)
}
