'use client'

import { useState } from 'react'
import { Inbox, Mail } from 'lucide-react'
import ConsentCheckbox from '@/components/legal/ConsentCheckbox'

export default function NewsletterSignup() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()

    if (!email) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (data.get('privacyConsent') !== 'true') {
      setStatus('error')
      setErrorMessage('Please confirm you agree to our Privacy Policy before subscribing.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, privacyConsent: true }),
      })
      const json = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(json.error || 'Could not subscribe. Please try again.')
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-gray-200 bg-white px-5 py-6 sm:px-8 sm:py-7 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4 max-w-xl">
          <div
            className="shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-600"
            aria-hidden
          >
            <Inbox className="h-7 w-7" />
          </div>
          <p className="text-base sm:text-lg text-gray-800 leading-snug">
            Get the{' '}
            <span className="font-bold text-gray-900">latest property news</span> and{' '}
            <span className="font-bold text-gray-900">advice</span> direct to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:max-w-md flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="sr-only" htmlFor="newsletter-email">
              Your email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Your email address"
                disabled={status === 'loading'}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-600 transition disabled:opacity-60"
            >
              {status === 'loading' ? 'Signing up…' : 'Sign up'}
            </button>
          </div>
          <ConsentCheckbox variant="newsletter" id="newsletter-privacy-consent" />
        </form>
      </div>
      {status === 'success' && (
        <p className="mt-3 text-sm font-medium text-green-700">
          Thanks — you&apos;re on the list!
        </p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}
