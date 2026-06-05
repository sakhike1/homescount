import PropertyListingForm from '@/components/dashboard/PropertyListingForm'

export default function NewListingPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-black text-gray-900 mb-2">New listing</h1>
      <p className="text-sm text-gray-500 mb-8">
        Step 1 — enter property details below. After saving, you&apos;ll add photos
        and publish from the next screen.
      </p>
      <PropertyListingForm mode="create" />
    </div>
  )
}
