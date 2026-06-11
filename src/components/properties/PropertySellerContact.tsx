'use client'

import { useState } from 'react'
import { Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react'
import { whatsAppUrl } from '@/lib/whatsapp'

export default function PropertySellerContact({
  phone,
  email,
  listerName,
  propertyTitle,
  showPhone = true,
  isDemo,
}: {
  phone?: string | null
  email?: string | null
  listerName: string
  propertyTitle: string
  showPhone?: boolean
  isDemo?: boolean
}) {
  const [revealed, setRevealed] = useState(false)
  const hasPhone = Boolean(phone?.trim()) && showPhone && !isDemo

  if (hasPhone) {
    const waMessage = `Hi ${listerName}, I'm interested in your Homescout listing: ${propertyTitle}`

    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Show number
          </button>
        ) : (
          <a
            href={`tel:${phone!.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-800 ring-1 ring-stone-200 hover:bg-stone-50"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {phone}
          </a>
        )}
        <a
          href={whatsAppUrl(phone!, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp
        </a>
      </div>
    )
  }

  if (isDemo) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {email && (
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${propertyTitle}`)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Email seller
        </a>
      )}
      <a
        href="#property-contact"
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
      >
        <MessageSquare className="h-4 w-4" aria-hidden />
        Send message
      </a>
    </div>
  )
}
