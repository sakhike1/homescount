import PropertyListingForm from '@/components/dashboard/PropertyListingForm'
import ListingWizardSteps from '@/components/dashboard/ListingWizardSteps'
import SellerWelcomeBanner from '@/components/dashboard/SellerWelcomeBanner'
import { requireSeller } from '@/lib/seller'
import prisma from '@/lib/prisma'

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const session = await requireSeller()
  const params = await searchParams
  const showWelcome = params.welcome === '1'

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
    <div className="space-y-6">
      {showWelcome ? <SellerWelcomeBanner /> : null}

      <div>
        <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">New listing</h1>
        <p className="mt-1 text-sm text-stone-500">
          Four steps: details → photos → choose package → pay & go live.
        </p>
      </div>

      <ListingWizardSteps
        steps={[
          { id: 'details', label: '1. Details', done: false, active: true },
          { id: 'photos', label: '2. Photos', done: false },
          { id: 'package', label: '3. Package & pay', done: false },
          { id: 'live', label: '4. Live', done: false },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-gradient-to-r from-violet-50/90 to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
            Step 1
          </p>
          <h2 className="text-lg font-bold text-stone-900 sm:text-xl">
            Property details
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Save your listing, then add photos and select a package on the next screen.
          </p>
        </div>
        <div className="p-6 sm:p-8">
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
      </div>
    </div>
  )
}
