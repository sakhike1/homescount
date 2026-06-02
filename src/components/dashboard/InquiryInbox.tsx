'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'

export type InquiryItem = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  createdAt: string
  property: {
    id: string
    title: string
    city: string
    listingType: string
  }
}

function toWhatsAppNumber(phone: string) {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('27')) return d
  if (d.startsWith('0')) return `27${d.slice(1)}`
  return `27${d}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function InquiryInbox({ inquiries }: { inquiries: InquiryItem[] }) {
  const [items, setItems] = useState(inquiries)

  async function markRead(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item || item.read) return

    try {
      await fetch(`/api/inquiries/${id}`, { method: 'PATCH' })
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, read: true } : i))
      )
    } catch {
      /* ignore */
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-4 font-medium text-gray-700">No messages yet</p>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          When buyers enquire or request a viewing on your published listings, their
          messages will appear here.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm font-bold text-amber-600 hover:underline"
        >
          Back to listings
        </Link>
      </div>
    )
  }

  const unread = items.filter((i) => !i.read).length

  return (
    <div className="space-y-4">
      {unread > 0 && (
        <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
          {unread} unread {unread === 1 ? 'message' : 'messages'}
        </p>
      )}

      {items.map((inq) => (
        <article
          key={inq.id}
          onClick={() => markRead(inq.id)}
          className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition cursor-pointer ${
            inq.read
              ? 'border-gray-200'
              : 'border-amber-300 ring-2 ring-amber-100'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-900">{inq.name}</h3>
                {!inq.read && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    New
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <Link
                  href={`/dashboard/listings/${inq.property.id}`}
                  className="font-medium text-amber-700 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {inq.property.title}
                </Link>
                <span className="text-gray-400">· {inq.property.city}</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(inq.createdAt)}
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            {inq.message}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.property.title}`)}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-2 text-xs font-bold text-white hover:bg-stone-800"
            >
              <Mail className="h-3.5 w-3.5" />
              Reply by email
            </a>
            {inq.phone && (
              <a
                href={`tel:${inq.phone.replace(/\s/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50"
              >
                <Phone className="h-3.5 w-3.5" />
                Call {inq.phone}
              </a>
            )}
            {inq.phone && (
              <a
                href={`https://wa.me/${toWhatsAppNumber(inq.phone)}?text=${encodeURIComponent(`Hi ${inq.name}, thanks for your enquiry about ${inq.property.title} on Homescount.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-bold text-green-800 hover:bg-green-100"
              >
                WhatsApp
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
