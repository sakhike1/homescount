'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Phone, Send } from 'lucide-react'
import ConsentCheckbox from '@/components/legal/ConsentCheckbox'
import {
  formButtonPrimaryFullClass,
  formErrorClass,
  formInputClass,
  formNoticeClass,
  formTextareaClass,
} from '@/lib/form-styles'

export default function PropertyContactForm({
  propertyId,
  propertyTitle,
  sellerName,
  disabled = false,
}: {
  propertyId: string
  propertyTitle: string
  sellerName: string
  disabled?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    if (data.get('privacyConsent') !== 'true') {
      setError('Please confirm you agree to our Privacy Policy before sending.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone'),
          message: data.get('message'),
          privacyConsent: true,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Could not send message')
        setStatus('error')
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm ring-1 ring-stone-900/[0.03]">
      <h3 className="text-lg font-bold text-stone-900">Message {sellerName}</h3>
      <p className="mt-1 text-sm text-stone-500">
        Ask about <span className="font-medium text-stone-700">{propertyTitle}</span>
      </p>

      {disabled ? (
        <p className={`mt-4 ${formNoticeClass}`}>
          Messaging is unavailable for sample listings. Browse live properties once
          sellers publish on Homescount.
        </p>
      ) : status === 'success' ? (
        <p className="mt-4 rounded-2xl border border-green-100/80 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          Thanks! Your message was sent. The seller will get back to you soon — and
          Homescount is here if you need guidance on next steps.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="sr-only" htmlFor="inq-name">
              Name
            </label>
            <input
              id="inq-name"
              name="name"
              required
              placeholder="Your name"
              className={formInputClass}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="inq-email">
              Email
            </label>
            <input
              id="inq-email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className={formInputClass}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="inq-phone">
              Phone
            </label>
            <input
              id="inq-phone"
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              className={formInputClass}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="inq-message">
              Message
            </label>
            <textarea
              id="inq-message"
              name="message"
              required
              rows={4}
              placeholder="I'd like to arrange a viewing. When are you available?"
              className={formTextareaClass}
            />
          </div>

          <ConsentCheckbox variant="inquiry" id="inq-privacy-consent" />

          {error && <p className={formErrorClass}>{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`inline-flex w-full items-center justify-center gap-2 ${formButtonPrimaryFullClass}`}
          >
            <Send className="h-4 w-4" />
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>
        </form>
      )}

      <div className="mt-5 space-y-2 border-t border-gray-200/50 pt-5 text-sm text-stone-500">
        <p className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-amber-500" />
          We help you through every step
        </p>
        <p className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-amber-500" />
          Questions answered by our team
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-amber-500" />
          Smooth buy or rent process
        </p>
      </div>
    </div>
  )
}
