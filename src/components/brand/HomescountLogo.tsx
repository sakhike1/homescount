'use client'

import Link from 'next/link'

const markSizes = {
  sm: 'text-sm px-2 py-0.5 rounded-md min-w-[2rem]',
  md: 'text-base sm:text-lg px-2.5 sm:px-3 py-1 rounded-lg min-w-[2.5rem]',
  lg: 'text-lg px-3 py-1.5 rounded-lg min-w-[3rem]',
} as const

export type HomescountLogoTone = 'default' | 'hero' | 'onDark'
export type HomescountLogoSize = keyof typeof markSizes

export function HomescountLogoMark({
  size = 'md',
  className = '',
  title = 'Homescount',
}: {
  size?: HomescountLogoSize
  className?: string
  title?: string
}) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-amber-500 text-white font-black tracking-tight shrink-0 shadow-sm ${markSizes[size]} ${className}`}
      aria-label={title}
    >
      HC
    </span>
  )
}

const wordmarkTone = {
  default: {
    homes: 'text-stone-900',
    count: 'text-amber-600',
  },
  hero: {
    homes: 'text-white',
    count: 'text-amber-300',
  },
  onDark: {
    homes: 'text-white',
    count: 'text-amber-300',
  },
} as const

type HomescountLogoProps = {
  href?: string
  size?: HomescountLogoSize
  showWordmark?: boolean
  tone?: HomescountLogoTone
  className?: string
  suffix?: React.ReactNode
}

export default function HomescountLogo({
  href = '/',
  size = 'md',
  showWordmark = true,
  tone = 'default',
  className = '',
  suffix,
}: HomescountLogoProps) {
  const colors = wordmarkTone[tone]
  const wordmarkSize =
    size === 'sm' ? 'text-base sm:text-lg' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'

  const content = (
    <>
      <HomescountLogoMark size={size} />
      {showWordmark && (
        <span
          className={`hidden sm:inline font-bold tracking-tight truncate ${wordmarkSize} ${colors.homes}`}
        >
          Homes<span className={colors.count}>count</span>
        </span>
      )}
      {suffix}
    </>
  )

  const shellClass = `flex items-center gap-2 min-w-0 shrink ${className}`

  if (!href) {
    return <div className={shellClass}>{content}</div>
  }

  return (
    <Link href={href} className={shellClass}>
      {content}
    </Link>
  )
}
