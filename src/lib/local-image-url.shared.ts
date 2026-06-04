const LOCAL_PREFIXES = ['/property-images/', '/slide-hero/'] as const

export function isBundledLocalImage(url: string): boolean {
  const pathname = url.split('?')[0]
  return LOCAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}
