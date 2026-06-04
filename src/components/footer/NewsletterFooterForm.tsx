'use client'

import { useState } from 'react'
import ConsentCheckbox from '@/components/legal/ConsentCheckbox'
import { FooterSocialLinks } from '@/components/footer/SocialIconButton'

export default function NewsletterFooterForm() {
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
    <div>
      <p className="max-w-md text-sm leading-relaxed text-stone-600">
        Join our newsletter to stay up to date on property news, market updates, and
        buying advice across South Africa.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="flex max-w-lg flex-col gap-2 sm:flex-row sm:items-stretch sm:rounded-full sm:border sm:border-stone-200 sm:bg-white sm:p-1 sm:shadow-sm">
          <label className="sr-only" htmlFor="footer-newsletter-email">
            Your email address
          </label>
          <input
            id="footer-newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            disabled={status === 'loading'}
            className="w-full flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200 disabled:opacity-60 sm:border-0 sm:shadow-none sm:focus:ring-0"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
          >
            {status === 'loading' ? '…' : 'Subscribe'}
          </button>
        </div>
        <ConsentCheckbox variant="newsletter" id="footer-newsletter-privacy-consent" />
      </form>
      {status === 'success' && (
        <p className="mt-3 text-sm font-medium text-emerald-700">Thanks — you&apos;re on the list!</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
      )}
      <div className="mt-8">
        <FooterSocialLinks tone="light" />
      </div>
    </div>
  )
}
