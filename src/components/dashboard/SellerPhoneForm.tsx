'use client'

import { useState } from 'react'
import { Bell, Phone } from 'lucide-react'
import {
  formButtonPrimaryClass,
  formInputClass,
  formNoticeClass,
} from '@/lib/form-styles'

export default function SellerPhoneForm({
  initialPhone,
  smsEnabled,
}: {
  initialPhone: string
  smsEnabled: boolean
}) {
  const [phone, setPhone] = useState(initialPhone)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const smsReady = smsEnabled

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/seller/phone', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Could not save phone number')
        setStatus('error')
        return
      }
      setPhone(json.phone ?? '')
      setStatus('success')
    } catch {
      setError('Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">SMS alerts</h2>
          <p className="mt-1 text-sm text-gray-600">
            Get a text when a buyer sends an enquiry or wants to view your property.
          </p>
        </div>
      </div>

      {!smsReady && (
        <p className={`mt-4 text-sm ${formNoticeClass}`}>
          SMS alerts are not configured on this server yet. You will still receive
          messages in your portal below. Ask your admin to add Twilio credentials to
          enable texts.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setStatus('idle')
            }}
            placeholder="082 123 4567"
            className={`${formInputClass} pl-10`}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`shrink-0 ${formButtonPrimaryClass}`}
        >
          {status === 'loading' ? 'Saving…' : 'Save number'}
        </button>
      </form>

      {status === 'success' && (
        <p className="mt-3 text-sm font-medium text-green-700">Phone number saved.</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  )
}
