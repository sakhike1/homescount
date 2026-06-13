'use server'

import { signIn } from '@/lib/auth'

export async function signInAfterRegister(
  email: string,
  password: string,
  role: string
) {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return {
      ok: true as const,
      redirectTo:
        role === 'SELLER'
          ? '/dashboard/listings/new?welcome=1'
          : '/',
    }
  } catch {
    return {
      ok: false as const,
      redirectTo: role === 'SELLER' ? '/login?intent=seller' : '/login',
    }
  }
}
