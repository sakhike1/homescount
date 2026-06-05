'use client'

import { useState } from 'react'
import SafeImage from '@/components/SafeImage'
import { useRouter } from 'next/navigation'
import { ImagePlus, Trash2 } from 'lucide-react'
import { formButtonPrimaryClass, formErrorClass } from '@/lib/form-styles'

type ImageItem = { id: string; url: string }

export default function ImageUploader({
  propertyId,
  images: initialImages,
}: {
  propertyId: string
  images: ImageItem[]
}) {
  const router = useRouter()
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append('images', file))

      const res = await fetch(`/api/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      setImages((prev) => [...prev, ...data])
      router.refresh()
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function removeImage(imageId: string) {
    const res = await fetch(
      `/api/properties/${propertyId}/images?imageId=${imageId}`,
      { method: 'DELETE' }
    )
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Property photos</h3>
          <p className="text-sm text-gray-500">Upload JPG or PNG, max 5MB each</p>
        </div>
        <label className={`inline-flex cursor-pointer items-center gap-2 ${formButtonPrimaryClass}`}>
          <ImagePlus className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Add photos'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={handleUpload}
            data-testid="property-photo-upload"
          />
        </label>
      </div>

      {error && (
        <p className={formErrorClass}>
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-500">
          No photos yet — add images so buyers can see your property.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
            >
              <SafeImage
                src={img.url}
                alt="Property photo"
                fill
                className="object-cover"
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
