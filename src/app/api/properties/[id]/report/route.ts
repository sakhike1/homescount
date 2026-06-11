import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const REPORT_REASONS = new Set([
  'incorrect_price',
  'wrong_location',
  'misleading_photos',
  'already_sold',
  'spam',
  'other',
])

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (id.startsWith('demo-')) {
    return NextResponse.json(
      { error: 'Reports are not available on sample listings.' },
      { status: 400 }
    )
  }

  try {
    const body = await req.json()
    const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
    const details = typeof body.details === 'string' ? body.details.trim() : ''
    const reporterName =
      typeof body.reporterName === 'string' ? body.reporterName.trim() : ''
    const reporterEmail =
      typeof body.reporterEmail === 'string' ? body.reporterEmail.trim() : ''

    if (!REPORT_REASONS.has(reason)) {
      return NextResponse.json({ error: 'Invalid report reason' }, { status: 400 })
    }
    if (details.length < 20) {
      return NextResponse.json(
        { error: 'Please describe the issue in at least 20 characters.' },
        { status: 400 }
      )
    }

    const property = await prisma.property.findFirst({
      where: { id, published: true },
      select: { id: true },
    })
    if (!property) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    await prisma.listingReport.create({
      data: {
        propertyId: id,
        reason,
        details,
        reporterName: reporterName || null,
        reporterEmail: reporterEmail || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Listing report error:', error)
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
  }
}
