'use client'

import { useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'

export default function NewsArticleShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      copyLink()
      return
    }
    try {
      await navigator.share({ title, url: window.location.href })
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50"
      >
        <Share2 className="h-4 w-4 text-amber-600" aria-hidden />
        Share
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600" aria-hidden />
        ) : (
          <Link2 className="h-4 w-4 text-stone-500" aria-hidden />
        )}
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
