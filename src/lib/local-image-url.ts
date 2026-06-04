import { statSync } from 'fs'
import path from 'path'
import { isBundledLocalImage } from '@/lib/local-image-url.shared'

export { isBundledLocalImage } from '@/lib/local-image-url.shared'

/** Append ?v=mtime so replacing a file under /public keeps the same path but busts caches. */
export function localImageCacheBust(url: string | null | undefined): string {
  if (!url) return url ?? ''
  const pathname = url.split('?')[0]
  if (!isBundledLocalImage(pathname)) return url
  try {
    const filePath = path.join(process.cwd(), 'public', pathname.slice(1))
    const mtime = statSync(filePath).mtimeMs
    return `${pathname}?v=${Math.floor(mtime)}`
  } catch {
    return pathname
  }
}
