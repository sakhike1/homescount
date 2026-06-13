'use client'

import Link from 'next/link'

const markSizes = {
  sm: 'text-sm px-2 py-0.5 rounded-md min-w-[2rem]',
  md: 'text-base sm:text-lg px-2.5 sm:px-3 py-1 rounded-lg min-w-[2.5rem]',
  lg: 'text-lg px-3 py-1.5 rounded-lg min-w-[3rem]',
} as const

export type HomescoutLogoTone = 'default' | 'hero' | 'onDark' | 'home'
export type HomescoutLogoSize = keyof typeof markSizes

export function HomescoutLogoMark({
  size = 'md',
  className = '',
  title = 'Homescout',
}: {
  size?: HomescoutLogoSize
  className?: string
  title?: string
}) {
  return (
    <span
      className={`inline-flex items-center justify-center bg-violet-800 text-white font-black tracking-tight shrink-0 shadow-sm ${markSizes[size]} ${className}`}
      aria-label={title}
    >
      HS
    </span>
  )
}

const wordmarkTone = {
  default: {
    homes: 'text-stone-900',
    scout: 'text-violet-700',
  },
  hero: {
    homes: 'text-white',
    scout: 'text-violet-300',
  },
  onDark: {
    homes: 'text-white',
    scout: 'text-violet-300',
  },
  home: {
    homes: 'text-stone-900',
    scout: 'text-violet-700',
  },
} as const

type HomescoutLogoProps = {
  href?: string
  size?: HomescoutLogoSize
  showWordmark?: boolean
  tone?: HomescoutLogoTone
  className?: string
  suffix?: React.ReactNode
}

export default function HomescoutLogo({
  href = '/',
  size = 'md',
  showWordmark = true,
  tone = 'default',
  className = '',
  suffix,
}: HomescoutLogoProps) {
  const colors = wordmarkTone[tone]
  const markClass = 'bg-violet-800 shadow-violet-900/20'
  const wordmarkSize =
    size === 'sm' ? 'text-base sm:text-lg' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'

  const content = (
    <>
      <HomescoutLogoMark size={size} className={markClass} />
      {showWordmark && (
        <span
          className={`hidden sm:inline font-bold tracking-tight truncate ${wordmarkSize} ${colors.homes}`}
        >
          Home<span className={colors.scout}>scout</span>
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
