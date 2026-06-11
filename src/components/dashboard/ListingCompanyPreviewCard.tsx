'use client'

import SafeImage from '@/components/SafeImage'
import PropertySellerContact from '@/components/properties/PropertySellerContact'
import { MapPin } from 'lucide-react'

export type CompanyPreviewData = {
  listerName: string
  companyName: string
  companyAddress: string
  companyLogoUrl: string
  phone: string
  showPhone: boolean
  listingAddress: string
  listingSuburb: string
  listingCity: string
}

function sellerInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function ListingCompanyPreviewCard({
  data,
  propertyTitle,
}: {
  data: CompanyPreviewData
  propertyTitle: string
}) {
  const displayCompany = data.companyName.trim() || data.listerName
  const addressLine = [data.listingAddress, data.listingSuburb, data.listingCity]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
        How buyers will see your listing
      </p>
      <h3 className="mt-2 text-lg font-bold text-gray-900">Listing company card</h3>
      <p className="mt-1 text-sm text-gray-500">
        This card appears on your public property page next to the contact form.
      </p>

      <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          {data.companyLogoUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <SafeImage
                src={data.companyLogoUrl}
                alt={displayCompany}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-xl font-bold text-white">
              {sellerInitials(displayCompany)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Listing company
            </p>
            <p className="mt-0.5 truncate text-lg font-bold text-stone-900">{displayCompany}</p>
            <p className="mt-1 text-sm text-stone-600">Listed by {data.listerName}</p>
          </div>
        </div>

        {(data.companyAddress || addressLine) && (
          <div className="mt-4 space-y-2 text-sm text-stone-600">
            {data.companyAddress && (
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                <span>{data.companyAddress}</span>
              </p>
            )}
            {addressLine && (
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
                <span>Property: {addressLine}</span>
              </p>
            )}
          </div>
        )}

        <PropertySellerContact
          phone={data.phone}
          listerName={data.listerName}
          propertyTitle={propertyTitle || 'your property'}
          showPhone={data.showPhone}
        />
      </div>
    </div>
  )
}
