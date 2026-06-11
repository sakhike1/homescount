import PropertyListingForm from '@/components/dashboard/PropertyListingForm'
import { requireSeller } from '@/lib/seller'
import prisma from '@/lib/prisma'

export default async function NewListingPage() {
  const session = await requireSeller()
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-black text-gray-900 mb-2">New listing</h1>
      <p className="text-sm text-gray-500 mb-8">
        Step 1 — enter property details, features, and your company card below. After
        saving, you&apos;ll add photos and publish from the next screen.
      </p>
      <PropertyListingForm
        mode="create"
        listerName={user?.name ?? session.user.name ?? 'Seller'}
        initialValues={{
          phone: user?.phone ?? '',
          companyName: user?.companyName ?? '',
          companyAddress: user?.companyAddress ?? '',
          companyLogoUrl: user?.companyLogoUrl ?? '',
          showPhone: user?.showPhone ?? true,
        }}
      />
    </div>
  )
}
