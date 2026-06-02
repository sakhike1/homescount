'use client'

import Image from 'next/image'
import { useState } from 'react'

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
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
  fallbackClassName = 'bg-gray-200',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)

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

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  )
}
