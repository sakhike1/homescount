'use client'

import { useState } from 'react'

const PREVIEW_CHARS = 320

export default function PropertyDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const needsToggle = text.length > PREVIEW_CHARS
  const display = expanded || !needsToggle ? text : `${text.slice(0, PREVIEW_CHARS).trim()}…`

  return (
    <div>
      <p className="whitespace-pre-line text-stone-600 leading-relaxed">{display}</p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
