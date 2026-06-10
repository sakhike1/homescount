'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
          <Mail className="h-5 w-5 text-white" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-white">Stay in the loop</h3>
      </div>
      <p className="max-w-md text-sm leading-relaxed text-white/50">
        Join our newsletter to stay up to date on property news, market updates, and
        buying advice across South Africa.
      </p>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch">
          <label className="sr-only" htmlFor="footer-newsletter-email">
            Your email address
          </label>
          <div className="relative flex-1">
            <input
              id="footer-newsletter-email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-amber-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-amber-500/20 disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="group shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Subscribing
              </span>
            ) : (
              <>
                Subscribe
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </>
            )}
          </button>
        </div>
        <ConsentCheckbox variant="newsletter" id="footer-newsletter-privacy-consent" tone="dark" />
      </form>
      
      {status === 'success' && (
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Thanks — you&apos;re on the list!
        </div>
      )}
      {status === 'error' && (
        <p className="mt-4 text-sm font-medium text-red-400">{errorMessage}</p>
      )}
      
      <div className="mt-10 pt-8 border-t border-white/[0.08]">
        <p className="text-xs text-white/40 mb-4">Follow us</p>
        <FooterSocialLinks tone="dark" />
      </div>
    </div>
  )
}
