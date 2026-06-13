'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthShell, {
  authButtonPrimaryClass,
  authInputClass,
  authSelectClass,
  authSigninLinkClass,
} from '@/components/auth/AuthShell'
import { UserPlus } from 'lucide-react'
import { signInAfterRegister } from './actions'
import { formErrorClass } from '@/lib/form-styles'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole =
    searchParams.get('role') === 'SELLER' ? 'SELLER' : 'BUYER'

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      const signIn = await signInAfterRegister(
        formData.email,
        formData.password,
        formData.role
      )

      router.push(signIn.redirectTo)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="register">
      <h1 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-stone-900">
        Create an account
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Join Homescout to browse, save, or list property across South Africa.
      </p>

      {error && <div className={`mt-6 ${formErrorClass}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-stone-700 mb-1.5">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            required
            placeholder="Enter your full name"
            className={authInputClass}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-stone-700 mb-1.5">
            Email address
          </label>
          <input
            id="register-email"
            type="email"
            required
            placeholder="Enter your email address"
            className={authInputClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-stone-700 mb-1.5">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            placeholder="Create a password"
            className={authInputClass}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="register-role" className="block text-sm font-medium text-stone-700 mb-1.5">
            I am a
          </label>
          <select
            id="register-role"
            className={authSelectClass}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="BUYER">Buyer — I want to find a property</option>
            <option value="SELLER">Seller — I want to list a property</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={authButtonPrimaryClass}
        >
          {loading ? (
            'Creating account...'
          ) : (
            <>
              <UserPlus className="h-4 w-4" aria-hidden />
              Create account
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link href="/login" className={authSigninLinkClass}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-100 flex items-center justify-center">
          <p className="text-stone-500">Loading...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
