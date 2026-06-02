'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Building2, Home, UserRound } from 'lucide-react'
import HomescountLogo from '@/components/brand/HomescountLogo'
import { authenticate } from './actions'
import {
  formButtonPrimaryFullClass,
  formErrorClass,
  formInputClass,
  formNoticeClass,
} from '@/lib/form-styles'

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
      const result = await authenticate(
        formData.email,
        formData.password,
        accountType
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200/60 bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <HomescountLogo href="/" size="lg" className="justify-center" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-6">Sign in to your Homescount account</p>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full border border-gray-200/60 bg-stone-50/60 p-1">
          <button
            type="button"
            onClick={() => setAccountType('BUYER')}
            className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition ${
              accountType === 'BUYER'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserRound className="h-4 w-4" />
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setAccountType('SELLER')}
            className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition ${
              accountType === 'SELLER'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Seller
          </button>
        </div>

        {accountType === 'SELLER' ? (
          <p className={`mb-4 text-xs ${formNoticeClass}`}>
            Seller portal — manage listings, upload photos, and promote properties.
          </p>
        ) : (
          <p className={`mb-4 flex items-center gap-2 text-xs ${formNoticeClass}`}>
            <Home className="h-4 w-4 shrink-0" />
            Browse and save properties across South Africa.
          </p>
        )}

        {error && <div className={`mb-4 ${formErrorClass}`}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className={formInputClass}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className={formInputClass}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={formButtonPrimaryFullClass}
          >
            {loading
              ? 'Signing in...'
              : accountType === 'SELLER'
                ? 'Sign in to Seller Portal'
                : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link
            href={
              accountType === 'SELLER'
                ? '/register?role=SELLER'
                : '/register'
            }
            className="text-amber-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
