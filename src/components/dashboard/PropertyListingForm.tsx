'use client'

import { useState } from 'react'
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
}

type Props = {
  mode: 'create' | 'edit'
  propertyId?: string
  initialValues?: Partial<ListingFormValues>
}

export default function PropertyListingForm({
  mode,
  propertyId,
  initialValues,
}: Props) {
  const router = useRouter()
  const [values, setValues] = useState<ListingFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: keyof ListingFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url =
        mode === 'create' ? '/api/properties' : `/api/properties/${propertyId}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push(`/dashboard/listings/${data.id}#property-photos`)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={formErrorClass}>{error}</div>
      )}

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suburb
          </label>
          <input
            required
            value={values.suburb}
            onChange={(e) => update('suburb', e.target.value)}
            className={formInputClass}
            placeholder="Sandton"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            required
            value={values.city}
            onChange={(e) => update('city', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <input
            type="number"
            min="0"
            value={values.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
            className={formInputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms
          </label>
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
            Parking bays
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
          <p className="mt-1 text-xs text-gray-500">
            Paste a Matterport link to show a 360° tour on your listing page.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className={formButtonPrimaryClass}
        >
          {loading
            ? 'Saving...'
            : mode === 'create'
              ? 'Save & add photos'
              : 'Save changes'}
        </button>
        <Link
          href="/dashboard"
          className={formButtonSecondaryClass}
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
