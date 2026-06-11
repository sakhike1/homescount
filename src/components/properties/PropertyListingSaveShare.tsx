'use client'

import { useEffect, useState } from 'react'
import { Heart, Share2 } from 'lucide-react'

const STORAGE_KEY = 'homescout-saved-listings'

function getSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export default function PropertyListingSaveShare({
  propertyId,
  title,
}: {
  propertyId: string
  title: string
}) {
  const [saved, setSaved] = useState(false)
  const [shareMsg, setShareMsg] = useState('')

  useEffect(() => {
    setSaved(getSavedIds().includes(propertyId))
  }, [propertyId])

  function toggleSave() {
    const ids = getSavedIds()
    const next = ids.includes(propertyId)
      ? ids.filter((id) => id !== propertyId)
      : [...ids, propertyId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(!saved)
  }

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Check out this property on Homescout`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copied')
      setTimeout(() => setShareMsg(''), 2000)
    } catch {
      /* user cancelled share */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-stone-800 shadow-lg ring-1 ring-stone-900/10 backdrop-blur transition hover:bg-white"
      >
        <Share2 className="h-4 w-4" aria-hidden />
        {shareMsg || 'Share'}
      </button>
      <button
        type="button"
        onClick={toggleSave}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg ring-1 backdrop-blur transition ${
          saved
            ? 'bg-amber-500 text-white ring-amber-600/30 hover:bg-amber-600'
            : 'bg-white/95 text-stone-800 ring-stone-900/10 hover:bg-white'
        }`}
      >
        <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden />
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  )
}
