'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Building2, UserRound } from 'lucide-react'
import AuthShell, {
  authButtonPrimaryClass,
  authInputClass,
  authSelectClass,
  authSignupLinkClass,
} from '@/components/auth/AuthShell'
import { authenticate } from './actions'
import { formErrorClass, formNoticeClass } from '@/lib/form-styles'

type AccountType = 'BUYER' | 'SELLER'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType: AccountType =
    searchParams.get('intent') === 'seller' ? 'SELLER' : 'BUYER'

  const [accountType, setAccountType] = useState<AccountType>(initialType)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const callbackUrl = searchParams.get('callbackUrl') ?? undefined
      const result = await authenticate(
        formData.email,
        formData.password,
        accountType,
        callbackUrl
      )

      if (!result.ok) {
        setError(result.error)
        return
      }

      router.push(result.redirectTo)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="login">
      <h1 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-stone-900">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Please enter your details to sign in.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border border-stone-200/80 bg-stone-50/80 p-1">
        <button
          type="button"
          onClick={() => setAccountType('BUYER')}
          className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition ${
            accountType === 'BUYER'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <UserRound className="h-4 w-4" aria-hidden />
          Buyer
        </button>
        <button
          type="button"
          onClick={() => setAccountType('SELLER')}
          className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition ${
            accountType === 'SELLER'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building2 className="h-4 w-4" aria-hidden />
          Seller
        </button>
      </div>

      {accountType === 'SELLER' ? (
        <p className={`mt-4 text-xs ${formNoticeClass}`}>
          Seller portal — manage listings, upload photos, and promote properties.
        </p>
      ) : (
        <p className={`mt-4 text-xs ${formNoticeClass}`}>
          Browse and save properties across South Africa.
        </p>
      )}

      {error && <div className={`mt-4 ${formErrorClass}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-stone-700 mb-1.5">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            required
            placeholder="Enter your email address"
            className={authInputClass}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-stone-700 mb-1.5">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            placeholder="Enter your password"
            className={authInputClass}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={authButtonPrimaryClass}
        >
          {loading
            ? 'Signing in...'
            : accountType === 'SELLER'
              ? 'Sign in to Seller Portal'
              : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don&apos;t have an account yet?{' '}
        <Link
          href={
            accountType === 'SELLER'
              ? '/register?role=SELLER'
              : '/register'
          }
          className={authSignupLinkClass}
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  )
}
