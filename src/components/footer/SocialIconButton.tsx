import type { ReactNode } from 'react'
import { SOCIAL_LINKS, type SocialId } from '@/lib/social'

export default function SocialIconButton({
  label,
  href,
  children,
  tone = 'dark',
}: {
  label: string
  href: string
  children: ReactNode
  tone?: 'light' | 'dark'
}) {
  const isLight = tone === 'light'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={
        isLight
          ? 'group flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900'
          : 'group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-amber-100/90 shadow-sm backdrop-blur-sm transition hover:border-amber-400/40 hover:bg-amber-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(251,191,36,0.35)]'
      }
    >
      {children}
    </a>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.154 0-3.527.012-4.769.069-1.026.047-1.584.218-1.954.363-.492.191-.844.42-1.213.79-.37.37-.598.721-.79 1.213-.145.37-.316.928-.363 1.954-.057 1.242-.069 1.615-.069 4.769s.012 3.527.069 4.769c.047 1.026.218 1.584.363 1.954.191.492.42.844.79 1.213.37.37.721.598 1.213.79.37.145.928.316 1.954.363 1.242.057 1.615.069 4.769.069s3.527-.012 4.769-.069c1.026-.047 1.584-.218 1.954-.363.492-.191.844-.42 1.213-.79.37-.37.598-.721.79-1.213.145-.37.316-.928.363-1.954.057-1.242.069-1.615.069-4.769s-.012-3.527-.069-4.769c-.047-1.026-.218-1.584-.363-1.954-.191-.492-.42-.844-.79-1.213-.37-.37-.721-.598-1.213-.79-.37-.145-.928-.316-1.954-.363-1.242-.057-1.615-.069-4.769-.069zm0 3.568a5.467 5.467 0 1 1 0 10.934 5.467 5.467 0 0 1 0-10.934zm0 1.802a3.665 3.665 0 1 0 0 7.33 3.665 3.665 0 0 0 0-7.33zm6.406-3.845a1.28 1.28 0 1 1-2.56 0 1.28 1.28 0 0 1 2.56 0z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const socialIcons: Record<SocialId, () => React.JSX.Element> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  x: IconX,
  youtube: IconYouTube,
  linkedin: IconLinkedIn,
}

export function FooterSocialLinks({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {SOCIAL_LINKS.map((social) => {
        const Icon = socialIcons[social.id]
        return (
          <SocialIconButton key={social.id} label={social.label} href={social.href} tone={tone}>
            <Icon />
          </SocialIconButton>
        )
      })}
    </div>
  )
}
