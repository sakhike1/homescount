/** Deterministic ZA-style grouping (avoids server/client locale hydration mismatches). */
export function formatZaNumber(n: number): string {
  const rounded = Math.round(n)
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function formatPrice(price: number, listingType: string) {
  const formatted = formatZaNumber(price)
  return listingType === 'RENT' ? `R ${formatted}/mo` : `R ${formatted}`
}
