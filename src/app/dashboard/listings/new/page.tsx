import PropertyListingForm from '@/components/dashboard/PropertyListingForm'

export default function NewListingPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <h1 className="text-2xl font-black text-gray-900 mb-2">New listing</h1>
      <p className="text-sm text-gray-500 mb-8">
        Choose whether you&apos;re selling or renting, set your price, then add
        photos on the next screen.
      </p>
      <PropertyListingForm mode="create" />
    </div>
  )
}
