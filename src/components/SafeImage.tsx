'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { isBundledLocalImage } from '@/lib/local-image-url.shared'

type SafeImageProps = {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
  fallbackClassName?: string
  /** Animated shimmer while the image loads (default on). */
  showShimmer?: boolean
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = '',
  priority,
  fallbackClassName = 'bg-stone-200',
  showShimmer = true,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setFailed(false)
    setLoaded(false)
    if (!src?.trim()) return
    const probe = new window.Image()
    probe.src = src
    if (probe.complete) setLoaded(true)
  }, [src])

  if (!src?.trim() || failed) {
    return (
      <div
        className={`flex items-center justify-center text-gray-400 ${fallbackClassName} ${
          fill ? 'absolute inset-0' : ''
        }`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-4xl" aria-hidden>
          🏠
        </span>
      </div>
    )
  }

  const shimmerVisible = showShimmer && !loaded

  return (
    <>
      {shimmerVisible && (
        <div
          className={`image-shimmer ${fill ? 'absolute inset-0' : ''} ${fallbackClassName}`}
          style={!fill && width && height ? { width, height } : undefined}
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`${className} transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        unoptimized={isBundledLocalImage(src)}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  )
}
