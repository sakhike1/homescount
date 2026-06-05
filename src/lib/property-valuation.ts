import prisma from '@/lib/prisma'

export type ValuationInput = {
  suburb: string
  city: string
  province: string
  bedrooms: number
  bathrooms: number
  size: number
  type: string
  listingType: 'SALE' | 'RENT'
}

export type ValuationResult = {
  estimatedLow: number
  estimatedHigh: number
  estimatedMid: number
  pricePerSqm: number | null
  comparableCount: number
  confidence: 'low' | 'medium' | 'high'
  message: string
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (sorted.length - 1) * p
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  if (lower === upper) return sorted[lower]
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower)
}

export async function estimatePropertyValue(
  input: ValuationInput
): Promise<ValuationResult> {
  const suburb = input.suburb.trim()
  const city = input.city.trim()

  const baseWhere = {
    published: true,
    status: 'AVAILABLE' as const,
    listingType: input.listingType,
    seller: { active: true },
  }

  let comparables = await prisma.property.findMany({
    where: {
      ...baseWhere,
      suburb: { contains: suburb, mode: 'insensitive' },
      bedrooms: { gte: Math.max(0, input.bedrooms - 1), lte: input.bedrooms + 1 },
    },
    select: { price: true, size: true, bedrooms: true },
  })

  if (comparables.length < 3 && city) {
    comparables = await prisma.property.findMany({
      where: {
        ...baseWhere,
        city: { contains: city, mode: 'insensitive' },
        bedrooms: { gte: Math.max(0, input.bedrooms - 1), lte: input.bedrooms + 1 },
      },
      select: { price: true, size: true, bedrooms: true },
    })
  }

  if (input.size > 0) {
    const minSize = input.size * 0.7
    const maxSize = input.size * 1.3
    const sized = comparables.filter(
      (c) => c.size > 0 && c.size >= minSize && c.size <= maxSize
    )
    if (sized.length >= 2) comparables = sized
  }

  if (comparables.length === 0) {
    return {
      estimatedLow: 0,
      estimatedHigh: 0,
      estimatedMid: 0,
      pricePerSqm: null,
      comparableCount: 0,
      confidence: 'low',
      message:
        'Not enough comparable listings in our database yet. Try a nearby suburb or check back as more sellers list properties.',
    }
  }

  const prices = comparables.map((c) => c.price).sort((a, b) => a - b)
  const p25 = percentile(prices, 0.25)
  const p75 = percentile(prices, 0.75)
  const median = percentile(prices, 0.5)

  let pricePerSqm: number | null = null
  if (input.size > 0) {
    const withSize = comparables.filter((c) => c.size > 0)
    if (withSize.length > 0) {
      const avgPpsm =
        withSize.reduce((sum, c) => sum + c.price / c.size, 0) / withSize.length
      pricePerSqm = Math.round(avgPpsm)
      const sizeBased = avgPpsm * input.size
      const blended = median * 0.6 + sizeBased * 0.4
      return {
        estimatedLow: Math.round(Math.min(p25, blended * 0.9)),
        estimatedHigh: Math.round(Math.max(p75, blended * 1.1)),
        estimatedMid: Math.round(blended),
        pricePerSqm,
        comparableCount: comparables.length,
        confidence:
          comparables.length >= 8 ? 'high' : comparables.length >= 4 ? 'medium' : 'low',
        message:
          comparables.length >= 4
            ? `Based on ${comparables.length} similar listings in ${suburb || city}.`
            : `Based on ${comparables.length} listing${comparables.length === 1 ? '' : 's'} — add more listings for higher accuracy.`,
      }
    }
  }

  return {
    estimatedLow: Math.round(p25),
    estimatedHigh: Math.round(p75),
    estimatedMid: Math.round(median),
    pricePerSqm,
    comparableCount: comparables.length,
    confidence:
      comparables.length >= 8 ? 'high' : comparables.length >= 4 ? 'medium' : 'low',
    message:
      comparables.length >= 4
        ? `Based on ${comparables.length} similar listings in ${suburb || city}.`
        : `Based on ${comparables.length} listing${comparables.length === 1 ? '' : 's'} — add more listings for higher accuracy.`,
  }
}
