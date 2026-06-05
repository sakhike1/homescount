import { NextResponse } from 'next/server'
import { recordListingView } from '@/lib/listing-analytics'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const recorded = await recordListingView(id)
    if (!recorded) {
      return NextResponse.json({ recorded: false }, { status: 404 })
    }
    return NextResponse.json({ recorded: true })
  } catch (error) {
    console.error('Record view error:', error)
    return NextResponse.json({ recorded: false }, { status: 500 })
  }
}
