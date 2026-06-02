import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function requireAuth(loginPath = '/login') {
  const session = await auth()
  if (!session?.user) {
    redirect(loginPath)
  }
  return session
}

export async function requireSeller() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?intent=seller&callbackUrl=/dashboard')
  }
  if (session.user.role !== 'SELLER') {
    redirect('/')
  }
  return session
}
