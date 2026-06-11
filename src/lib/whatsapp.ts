/** Normalize SA numbers for wa.me links (27XXXXXXXXX). */
export function toWhatsAppNumber(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('27')) return d
  if (d.startsWith('0')) return `27${d.slice(1)}`
  return `27${d}`
}

export function whatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`
}
