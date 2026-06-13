'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import ConsentCheckbox from '@/components/legal/ConsentCheckbox'

const NEWSLETTER_IMAGE = '/property-images/59f7a7ad7ff6f13afbfc384144a0628d.jpg'

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
    <div className="newsletter-card-shell relative overflow-hidden rounded-[1.75rem] border border-stone-200/80 sm:rounded-[2rem]">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[200px] overflow-hidden bg-stone-200 sm:min-h-[240px] lg:min-h-[280px] lg:rounded-l-[1.75rem]">
          <Image
            src={NEWSLETTER_IMAGE}
            alt="Modern South African home"
            fill
            priority
            quality={92}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
        </div>

        <div className="newsletter-content-panel relative px-6 py-8 sm:px-10 sm:py-10 lg:py-12">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-2xl font-bold leading-tight text-stone-800 sm:text-[1.75rem]">
              Subscribe to our newsletter for property updates across South Africa
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              Get market insights, new listings, and buying tips delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="newsletter-input-pill flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-full px-4 py-1 ring-1 ring-stone-200/90">
                  <Mail
                    className="h-4 w-4 shrink-0 text-stone-400"
                    aria-hidden
                  />
                  <label className="sr-only" htmlFor="footer-newsletter-email">
                    Your email address
                  </label>
                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    disabled={status === 'loading'}
                    className="newsletter-input-light h-11 min-w-0 flex-1 border-0 bg-transparent py-0 text-sm text-stone-800 placeholder:text-stone-400 outline-none ring-0 focus:outline-none focus:ring-0 disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-grad w-full shrink-0 rounded-full px-8 py-3 text-sm font-semibold sm:w-auto sm:py-2.5"
                >
                  {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>

              <ConsentCheckbox
                variant="newsletter"
                id="footer-newsletter-privacy-consent"
                tone="newsletter"
              />
            </form>

            {status === 'success' && (
              <p className="mt-4 text-sm font-medium text-emerald-700">
                Thanks — you&apos;re on the list!
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p>
            )}

            <p className="mt-4 text-xs text-stone-500">
              You can unsubscribe at any time. Read our{' '}
              <Link
                href="/privacy"
                className="font-medium text-stone-700 underline underline-offset-2 hover:text-stone-900"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
