import { NextResponse } from 'next/server'
import { estimatePropertyValue } from '@/lib/property-valuation'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      suburb,
      city,
      province,
      bedrooms,
      bathrooms,
      size,
      type,
      listingType,
    } = body

    if (!suburb?.trim() && !city?.trim()) {
      return NextResponse.json(
        { error: 'Suburb or city is required' },
        { status: 400 }
      )
    }

    const result = await estimatePropertyValue({
      suburb: String(suburb ?? '').trim(),
      city: String(city ?? '').trim(),
      province: String(province ?? 'Gauteng').trim(),
      bedrooms: Number(bedrooms) || 2,
      bathrooms: Number(bathrooms) || 1,
      size: Number(size) || 0,
      type: String(type ?? 'HOUSE'),
      listingType: listingType === 'RENT' ? 'RENT' : 'SALE',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Valuation error:', error)
    return NextResponse.json({ error: 'Valuation failed' }, { status: 500 })
  }
}
