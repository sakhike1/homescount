/** Normalize Matterport / virtual tour URLs for iframe embed */
export function normalizeVirtualTourUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed)
      if (
        url.hostname.includes('matterport.com') ||
        url.hostname.includes('my.matterport.com')
      ) {
        return trimmed
      }
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        return trimmed
      }
      return trimmed
    } catch {
      return null
    }
  }

  if (trimmed.startsWith('my.matterport.com') || trimmed.startsWith('matterport.com')) {
    return `https://${trimmed}`
  }

  return null
}

export function getMatterportEmbedUrl(url: string): string | null {
  const normalized = normalizeVirtualTourUrl(url)
  if (!normalized) return null

  try {
    const parsed = new URL(normalized)
    if (parsed.hostname.includes('matterport.com')) {
      if (parsed.pathname.includes('/show')) return normalized
      const modelMatch = parsed.pathname.match(/\/models\/([a-zA-Z0-9]+)/)
      if (modelMatch) {
        return `https://my.matterport.com/show/?m=${modelMatch[1]}`
      }
      const mParam = parsed.searchParams.get('m')
      if (mParam) return `https://my.matterport.com/show/?m=${mParam}`
    }
    return normalized
  } catch {
    return null
  }
}
