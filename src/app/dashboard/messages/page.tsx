import InquiryInbox from '@/components/dashboard/InquiryInbox'
import SellerPhoneForm from '@/components/dashboard/SellerPhoneForm'
import { getSellerInquiries } from '@/lib/inquiries'
import { requireSeller } from '@/lib/seller'
import { isSmsConfigured } from '@/lib/sms'
import prisma from '@/lib/prisma'

export default async function DashboardMessagesPage() {
  const session = await requireSeller()

  const [inquiries, user] = await Promise.all([
    getSellerInquiries(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true },
    }),
  ])

  const serialized = inquiries.map((inq) => ({
    id: inq.id,
    name: inq.name,
    email: inq.email,
    phone: inq.phone,
    message: inq.message,
    read: inq.read,
    createdAt: inq.createdAt.toISOString(),
    property: inq.property,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enquiries and viewing requests from buyers on your listings.
        </p>
      </div>

      <SellerPhoneForm
        initialPhone={user?.phone ?? ''}
        smsEnabled={isSmsConfigured()}
      />

      <InquiryInbox inquiries={serialized} />
    </div>
  )
}
