'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function authenticateAdmin(
  _prev: string | undefined,
  formData: FormData
) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return 'Email and password are required.'
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.role !== 'ADMIN') {
    return 'Invalid email or password, or you are not an admin.'
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return 'Invalid email or password, or you are not an admin.'
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin',
    })
    return undefined
  } catch (error) {
    if (error instanceof AuthError) {
      return 'Something went wrong.'
    }
    throw error
  }
}
