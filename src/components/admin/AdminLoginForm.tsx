'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import HomescountLogo from '@/components/brand/HomescountLogo'
import { authenticateAdmin } from '@/app/admin/login/actions'
import {
  formButtonPrimaryDarkClass,
  formInputDarkClass,
} from '@/lib/form-styles'

export default function AdminLoginForm() {
  const [error, formAction, pending] = useActionState(authenticateAdmin, undefined)

  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <HomescountLogo href="/" tone="onDark" size="lg" className="justify-center" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white text-center">Admin access</h1>
        <p className="mt-2 text-sm text-stone-400 text-center">
          Authorised administrators only
        </p>

        <form action={formAction} className="mt-8 space-y-4 rounded-2xl border border-stone-800/80 bg-stone-900 p-6">
          {error && (
            <p className="rounded-2xl border border-red-900/60 bg-red-950/50 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-stone-400 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={formInputDarkClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-stone-400 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={formInputDarkClass}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className={formButtonPrimaryDarkClass}
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-stone-500 hover:text-stone-400">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  )
}
