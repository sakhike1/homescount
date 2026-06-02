'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function DeleteListingButton({
  propertyId,
  propertyTitle,
  variant = 'button',
}: {
  propertyId: string
  propertyTitle: string
  variant?: 'button' | 'link'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${propertyTitle}"?\n\nThis permanently removes the listing and cannot be undone.`
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        alert('Could not delete listing. Please try again.')
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        {loading ? 'Deleting…' : 'Delete listing'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 transition"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  )
}
