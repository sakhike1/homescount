'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  formButtonPrimaryClass,
  formButtonSecondaryClass,
  formChoiceButtonClass,
  formErrorClass,
  formInputClass,
  formSelectClass,
  formTextareaClass,
} from '@/lib/form-styles'
import PropertyFeaturesForm from '@/components/dashboard/PropertyFeaturesForm'
import ListingCompanyPreviewCard, {
  type CompanyPreviewData,
} from '@/components/dashboard/ListingCompanyPreviewCard'
import ListingQualityBadge from '@/components/properties/ListingQualityBadge'
import { computeListingQualityScore } from '@/lib/listing-quality'
import {
  EMPTY_PROPERTY_FEATURES,
  parsePropertyFeatures,
  type PropertyFeatures,
} from '@/lib/property-features'

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
]

export type ListingFormValues = {
  title: string
  description: string
  price: string
  location: string
  suburb: string
  city: string
  province: string
  bedrooms: string
  bathrooms: string
  parkings: string
  size: string
  type: string
  listingType: string
  virtualTourUrl: string
  phone: string
  companyName: string
  companyAddress: string
  companyLogoUrl: string
  showPhone: boolean
}

const defaultValues: ListingFormValues = {
  title: '',
  description: '',
  price: '',
  location: '',
  suburb: '',
  city: '',
  province: 'Gauteng',
  bedrooms: '2',
  bathrooms: '1',
  parkings: '1',
  size: '',
  type: 'HOUSE',
  listingType: 'SALE',
  virtualTourUrl: '',
  phone: '',
  companyName: '',
  companyAddress: '',
  companyLogoUrl: '',
  showPhone: true,
}

type Props = {
  mode: 'create' | 'edit'
  propertyId?: string
  initialValues?: Partial<ListingFormValues>
  initialFeatures?: PropertyFeatures
  listerName: string
  imageCount?: number
}

export default function PropertyListingForm({
  mode,
  propertyId,
  initialValues,
  initialFeatures,
  listerName,
  imageCount = 0,
}: Props) {
  const router = useRouter()
  const [values, setValues] = useState<ListingFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [features, setFeatures] = useState<PropertyFeatures>(
    initialFeatures ?? EMPTY_PROPERTY_FEATURES
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: keyof ListingFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const previewScore = useMemo(
    () =>
      computeListingQualityScore({
        title: values.title,
        description: values.description,
        price: Number(values.price) || 0,
        location: values.location,
        suburb: values.suburb,
        city: values.city,
        province: values.province,
        bedrooms: Number(values.bedrooms) || 0,
        bathrooms: Number(values.bathrooms) || 0,
        parkings: Number(values.parkings) || 0,
        size: Number(values.size) || 0,
        virtualTourUrl: values.virtualTourUrl,
        images: Array.from({ length: imageCount }, () => ({ url: 'x' })),
        features,
      }),
    [values, features, imageCount]
  )

  const companyPreview: CompanyPreviewData = {
    listerName,
    companyName: values.companyName,
    companyAddress: values.companyAddress,
    companyLogoUrl: values.companyLogoUrl,
    phone: values.phone,
    showPhone: values.showPhone,
    listingAddress: values.location,
    listingSuburb: values.suburb,
    listingCity: values.city,
  }

  async function saveCompanyProfile() {
    await fetch('/api/seller/company', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: values.phone,
        companyName: values.companyName,
        companyAddress: values.companyAddress,
        companyLogoUrl: values.companyLogoUrl,
        showPhone: values.showPhone,
      }),
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url =
        mode === 'create' ? '/api/properties' : `/api/properties/${propertyId}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const { phone, companyName, companyAddress, companyLogoUrl, showPhone, ...propertyPayload } =
        values

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...propertyPayload,
          features: parsePropertyFeatures(features),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      await saveCompanyProfile()

      router.push(`/dashboard/listings/${data.id}#property-photos`)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className={formErrorClass}>{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Listing type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'SALE', label: 'For sale' },
              { value: 'RENT', label: 'For rent' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('listingType', opt.value)}
                className={formChoiceButtonClass(values.listingType === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            required
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            className={formInputClass}
            placeholder="Modern 3-bed family home in Sandton"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            className={formTextareaClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {values.listingType === 'RENT' ? 'Monthly rent (R)' : 'Price (R)'}
          </label>
          <input
            required
            type="number"
            min="0"
            value={values.price}
            onChange={(e) => update('price', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property type
          </label>
          <select
            value={values.type}
            onChange={(e) => update('type', e.target.value)}
            className={formInputClass}
          >
            <option value="HOUSE">House</option>
            <option value="APARTMENT">Apartment</option>
            <option value="TOWNHOUSE">Townhouse</option>
            <option value="LAND">Land</option>
            <option value="COMMERCIAL">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street address
          </label>
          <input
            required
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
            className={formInputClass}
            placeholder="12 Oak Avenue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
          <input
            required
            value={values.suburb}
            onChange={(e) => update('suburb', e.target.value)}
            className={formInputClass}
            placeholder="Sandton"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            required
            value={values.city}
            onChange={(e) => update('city', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
          <select
            value={values.province}
            onChange={(e) => update('province', e.target.value)}
            className={formInputClass}
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size (m²) <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            min="1"
            value={values.size}
            onChange={(e) => update('size', e.target.value)}
            className={formInputClass}
            placeholder="180"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <input
            type="number"
            min="0"
            value={values.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <input
            type="number"
            min="0"
            value={values.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Garage parking
          </label>
          <input
            type="number"
            min="0"
            value={values.parkings}
            onChange={(e) => update('parkings', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Virtual tour URL <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            value={values.virtualTourUrl}
            onChange={(e) => update('virtualTourUrl', e.target.value)}
            className={formInputClass}
            placeholder="https://my.matterport.com/show/?m=..."
          />
        </div>
      </div>

      <PropertyFeaturesForm value={features} onChange={setFeatures} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h3 className="text-base font-bold text-gray-900">Your company & contact</h3>
        <p className="mt-1 text-sm text-gray-500">
          Shown on the public listing card — buyers can call or WhatsApp you.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company / agency name
            </label>
            <input
              value={values.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              className={formInputClass}
              placeholder={listerName}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company address
            </label>
            <input
              value={values.companyAddress}
              onChange={(e) => update('companyAddress', e.target.value)}
              className={formInputClass}
              placeholder="Office or branch address"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mobile number
            </label>
            <input
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={formInputClass}
              placeholder="082 123 4567"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Logo URL <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              value={values.companyLogoUrl}
              onChange={(e) => update('companyLogoUrl', e.target.value)}
              className={formInputClass}
              placeholder="https://…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={values.showPhone}
              onChange={(e) => update('showPhone', e.target.checked)}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            Show my number on the listing (with WhatsApp button)
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
        <span className="text-sm font-medium text-stone-700">Estimated listing quality:</span>
        <ListingQualityBadge score={previewScore} />
        <span className="text-xs text-stone-500">
          Add photos after saving to improve your score.
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className={formButtonPrimaryClass}>
          {loading
            ? 'Saving...'
            : mode === 'create'
              ? 'Save & add photos'
              : 'Save changes'}
        </button>
        <Link href="/dashboard" className={formButtonSecondaryClass}>
          Cancel
        </Link>
      </div>

      <ListingCompanyPreviewCard
        data={companyPreview}
        propertyTitle={values.title || 'your property'}
      />
    </form>
  )
}
