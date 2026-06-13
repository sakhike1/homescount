'use client'

import { useCallback, useRef, useState } from 'react'
import SafeImage from '@/components/SafeImage'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'

type ImageItem = { id: string; url: string }

type UploadItem = {
  id: string
  name: string
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
}

const MAX_PHOTOS = 30

export default function ImageUploader({
  propertyId,
  images: initialImages,
}: {
  propertyId: string
  images: ImageItem[]
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState(initialImages)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [reordering, setReordering] = useState(false)

  const isUploading = uploads.some((u) => u.status === 'uploading')

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files)
      if (!list.length) return

      if (images.length >= MAX_PHOTOS) {
        setError(`Maximum ${MAX_PHOTOS} photos per listing`)
        return
      }

      setError('')
      const queue = list.slice(0, MAX_PHOTOS - images.length)

      for (const file of queue) {
        const uploadId = `${file.name}-${Date.now()}-${Math.random()}`
        setUploads((prev) => [
          ...prev,
          { id: uploadId, name: file.name, progress: 0, status: 'uploading' },
        ])

        try {
          const created = await uploadWithProgress(propertyId, file, (progress) => {
            setUploads((prev) =>
              prev.map((item) =>
                item.id === uploadId ? { ...item, progress } : item
              )
            )
          })

          setImages((prev) => [
            ...prev,
            ...created.map((img: ImageItem) => ({ id: img.id, url: img.url })),
          ])
          setUploads((prev) =>
            prev.map((item) =>
              item.id === uploadId ? { ...item, progress: 100, status: 'done' } : item
            )
          )
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed'
          setUploads((prev) =>
            prev.map((item) =>
              item.id === uploadId
                ? { ...item, status: 'error', error: message }
                : item
            )
          )
          setError(message)
        }
      }

      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.status === 'uploading'))
      }, 2500)

      router.refresh()
    },
    [images.length, propertyId, router]
  )

  async function persistOrder(next: ImageItem[]) {
    setReordering(true)
    setError('')
    try {
      const res = await fetch(`/api/properties/${propertyId}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: next.map((img) => img.id) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not reorder photos')
        return
      }
      setImages(data.images)
      router.refresh()
    } catch {
      setError('Could not reorder photos')
    } finally {
      setReordering(false)
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setImages(next)
    void persistOrder(next)
  }

  function setAsCover(index: number) {
    if (index === 0) return
    const next = [...images]
    const [item] = next.splice(index, 1)
    next.unshift(item)
    setImages(next)
    void persistOrder(next)
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

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files?.length) {
      void uploadFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Property photos</h3>
          <p className="mt-1 text-sm text-stone-500">
            Drag and drop or browse. JPG, PNG, or WebP — max 5MB each. First photo is
            your cover image.
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {images.length} / {MAX_PHOTOS} photos
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading || images.length >= MAX_PHOTOS}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          {isUploading ? 'Uploading…' : 'Add photos'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          multiple
          className="hidden"
          disabled={isUploading || images.length >= MAX_PHOTOS}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files)
            e.target.value = ''
          }}
          data-testid="property-photo-upload"
        />
      </div>

      <div
        onDragEnter={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragActive
            ? 'border-violet-400 bg-violet-50'
            : 'border-stone-200 bg-stone-50/80'
        }`}
      >
        <Upload
          className={`mx-auto h-8 w-8 ${dragActive ? 'text-violet-600' : 'text-stone-400'}`}
          aria-hidden
        />
        <p className="mt-3 text-sm font-medium text-stone-700">
          Drop photos here or{' '}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-bold text-violet-700 hover:underline"
          >
            browse files
          </button>
        </p>
        <p className="mt-1 text-xs text-stone-400">
          Tip: upload at least 5 photos — exterior, living areas, kitchen, bedrooms.
        </p>
      </div>

      {uploads.length > 0 && (
        <ul className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          {uploads.map((item) => (
            <li key={item.id} className="text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-stone-700">{item.name}</span>
                <span
                  className={
                    item.status === 'error'
                      ? 'text-red-600'
                      : item.status === 'done'
                        ? 'text-green-600'
                        : 'text-stone-500'
                  }
                >
                  {item.status === 'error'
                    ? item.error
                    : item.status === 'done'
                      ? 'Done'
                      : `${Math.round(item.progress)}%`}
                </span>
              </div>
              {item.status === 'uploading' && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <p className="text-center text-sm text-stone-500">
          No photos yet — add images so buyers can see your property.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/80"
            >
              <SafeImage
                src={img.url}
                alt={index === 0 ? 'Cover photo' : `Property photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="200px"
              />

              {index === 0 ? (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-violet-900/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  <Star className="h-3 w-3 fill-current" aria-hidden />
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAsCover(index)}
                  disabled={reordering}
                  className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100"
                >
                  Set cover
                </button>
              )}

              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="rounded-full bg-black/60 p-1.5 text-white"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  disabled={index === 0 || reordering}
                  onClick={() => moveImage(index, -1)}
                  className="rounded-full bg-black/60 p-1 text-white disabled:opacity-40"
                  aria-label="Move photo earlier"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === images.length - 1 || reordering}
                  onClick={() => moveImage(index, 1)}
                  className="rounded-full bg-black/60 p-1 text-white disabled:opacity-40"
                  aria-label="Move photo later"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function uploadWithProgress(
  propertyId: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<ImageItem[]> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('images', file)

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      let data: { created?: ImageItem[]; error?: string; errors?: string[] } = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        reject(new Error('Upload failed'))
        return
      }

      if (xhr.status >= 200 && xhr.status < 300 && data.created?.length) {
        resolve(data.created)
        return
      }

      reject(
        new Error(data.error ?? data.errors?.[0] ?? 'Upload failed')
      )
    })

    xhr.addEventListener('error', () => reject(new Error('Upload failed')))
    xhr.open('POST', `/api/properties/${propertyId}/images`)
    xhr.send(formData)
  })
}
