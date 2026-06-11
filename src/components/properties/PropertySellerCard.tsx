import Link from 'next/link'
import { BadgeCheck, Home, Mail, MapPin, Shield } from 'lucide-react'
import SafeImage from '@/components/SafeImage'
import VerifiedBadge from '@/components/badges/VerifiedBadge'
import PropertySellerContact from '@/components/properties/PropertySellerContact'

function sellerInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export type ListingSeller = {
  name: string
  email: string
  phone?: string | null
  companyName?: string | null
  companyAddress?: string | null
  companyLogoUrl?: string | null
  showPhone?: boolean
}

export default function PropertySellerCard({
  seller,
  verified,
  listingType,
  isDemo,
  propertyTitle,
  listingAddress,
}: {
  seller: ListingSeller
  verified?: boolean
  listingType: string
  isDemo?: boolean
  propertyTitle: string
  listingAddress?: string
}) {
  const companyName = seller.companyName?.trim() || seller.name

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm ring-1 ring-stone-900/[0.03]">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {seller.companyLogoUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-stone-200">
              <SafeImage
                src={seller.companyLogoUrl}
                alt={companyName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-xl font-bold text-white shadow-lg shadow-amber-500/25">
              {sellerInitials(companyName)}
            </div>
          )}
          {verified && (
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Listing company
          </p>
          <p className="mt-0.5 truncate text-lg font-bold text-stone-900">{companyName}</p>
          <p className="mt-1 text-sm text-stone-600">Listed by {seller.name}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {verified && <VerifiedBadge size="sm" />}
            {!isDemo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600">
                <Shield className="h-3 w-3" aria-hidden />
                Homescout member
              </span>
            )}
          </div>
        </div>
      </div>

      {(seller.companyAddress || listingAddress) && (
        <div className="mt-4 space-y-2 text-sm text-stone-600">
          {seller.companyAddress && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
              <span>{seller.companyAddress}</span>
            </p>
          )}
          {listingAddress && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
              <span>{listingAddress}</span>
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        {isDemo
          ? 'This is a sample listing. Real sellers upload their own photos and respond to enquiries directly on Homescout.'
          : verified
            ? 'Verified seller with photos uploaded by the lister. Message them to arrange a viewing or ask questions.'
            : 'Photos uploaded by the seller. Reach out to arrange a viewing or ask about this property.'}
      </p>

      {!isDemo && (
        <a
          href={`mailto:${seller.email}?subject=${encodeURIComponent(`Enquiry: ${propertyTitle}`)}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {seller.email}
        </a>
      )}

      <PropertySellerContact
        phone={seller.phone}
        email={seller.email}
        listerName={seller.name}
        propertyTitle={propertyTitle}
        showPhone={seller.showPhone !== false}
        isDemo={isDemo}
      />

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50/80 px-3 py-2.5 text-xs text-amber-900/80 ring-1 ring-amber-100">
        <Home className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
        <span>
          Sellers upload their own photos on{' '}
          <Link href="/sell" className="font-semibold underline underline-offset-2">
            Homescout
          </Link>{' '}
          — real images build buyer trust.
        </span>
      </div>
    </div>
  )
}
