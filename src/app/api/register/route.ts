import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

const ALLOWED_ROLES = ['BUYER', 'SELLER'] as const

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const userRole =
      role && ALLOWED_ROLES.includes(role) ? role : 'BUYER'

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
      },
    })

    await logActivity({
      type: userRole === 'SELLER' ? 'SELLER_REGISTERED' : 'USER_REGISTERED',
      message:
        userRole === 'SELLER'
          ? `New seller registered: ${name} (${email})`
          : `New buyer registered: ${name} (${email})`,
      userId: user.id,
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user.id,
        role: user.role,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
