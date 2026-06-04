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
    <div className="group mt-12 rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-amber-50/30 to-stone-50 px-5 py-7 sm:px-8 sm:py-8 shadow-sm ring-1 ring-stone-900/[0.03] transition-shadow duration-300 hover:shadow-lg hover:shadow-stone-900/10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 max-w-xl">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-600/25"
            aria-hidden
          >
            <Inbox className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-bold leading-snug text-stone-900 sm:text-xl">
              Get the latest property news and advice direct to your inbox.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Market updates, buying tips, and rental insights — no spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:max-w-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:rounded-full sm:border sm:border-stone-200/90 sm:bg-white sm:p-1.5 sm:shadow-sm sm:transition-shadow sm:duration-300 sm:hover:shadow-md sm:hover:shadow-stone-900/8">
            <label className="sr-only" htmlFor="newsletter-email">
              Your email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                aria-hidden
              />
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Your email address"
                disabled={status === 'loading'}
                className="w-full rounded-full border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-sm text-stone-900 shadow-sm outline-none transition-shadow duration-200 placeholder:text-stone-400 hover:shadow-md hover:shadow-stone-900/5 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 disabled:opacity-60 sm:border-0 sm:shadow-none sm:hover:shadow-none sm:focus:ring-0"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-amber-600/20 transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-600/30 disabled:opacity-60 sm:px-7"
            >
              {status === 'loading' ? 'Signing up…' : 'Sign up'}
            </button>
          </div>
          <ConsentCheckbox variant="newsletter" id="newsletter-privacy-consent" />
        </form>
      </div>
      {status === 'success' && (
        <p className="mt-4 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-800 ring-1 ring-green-200/80">
          Thanks — you&apos;re on the list!
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200/80">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
