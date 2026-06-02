import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (body.privacyConsent !== true) {
      return NextResponse.json(
        { error: 'Privacy consent is required to subscribe' },
        { status: 400 }
      )
    }

    const now = new Date()

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, privacyConsentAt: now },
      update: { privacyConsentAt: now },
    })

    await logActivity({
      type: 'NEWSLETTER_SUBSCRIBED',
      message: `Newsletter subscription: ${email}`,
      metadata: { email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Could not subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
