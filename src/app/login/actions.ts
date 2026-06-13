'use server'

import { AuthError } from 'next-auth'
import { auth, signIn, signOut } from '@/lib/auth'

export async function authenticate(
  email: string,
  password: string,
  accountType: 'BUYER' | 'SELLER',
  callbackUrl?: string
) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    const session = await auth()
    if (!session?.user) {
      return { ok: false as const, error: 'Invalid email or password' }
    }

    if (session.user.role !== accountType) {
      await signOut({ redirect: false })
      const label = accountType === 'SELLER' ? 'seller' : 'buyer'
      const actual =
        session.user.role === 'SELLER' ? 'a seller account' : 'a buyer account'
      return {
        ok: false as const,
        error: `This email is registered as ${actual}. Please sign in as ${label === 'seller' ? 'a seller' : 'a buyer'} instead.`,
      }
    }

    const fallback = session.user.role === 'SELLER' ? '/dashboard' : '/'

    return {
      ok: true as const,
      role: session.user.role,
      redirectTo: safeCallbackUrl(callbackUrl, fallback),
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false as const, error: 'Invalid email or password' }
    }
    return { ok: false as const, error: 'Something went wrong' }
  }
}

function safeCallbackUrl(url: string | undefined, fallback: string) {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return fallback
  return url
}
