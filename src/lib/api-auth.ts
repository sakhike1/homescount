import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function getSellerSession() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'SELLER') return null
  return session
}

export async function getAdminSession() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'ADMIN') return null
  return session
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
