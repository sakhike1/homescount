export function formatStatCount(count: number): string {
  if (count >= 10000) return `${Math.floor(count / 1000)}k+`
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k+`
  }
  return String(count)
}
