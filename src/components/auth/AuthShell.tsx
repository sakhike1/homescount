import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import {
  authButtonPrimaryClass,
  authSigninLinkClass,
  authSignupLinkClass,
  authTabClass,
} from '@/components/auth/auth-styles'

const AUTH_IMAGE = '/slide-hero/0c4dc544712037037444983752fe0a52.jpg'

type Mode = 'login' | 'register'

type Props = {
  mode: Mode
  children: ReactNode
}

export default function AuthShell({ mode, children }: Props) {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-white shadow-xl shadow-stone-900/10 ring-1 ring-stone-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            <div className="mx-auto flex w-full max-w-sm flex-col">
              <div className="mx-auto inline-flex items-center gap-1 rounded-full bg-stone-100/90 p-1.5 ring-1 ring-stone-200/80">
                <Link
                  href="/login"
                  className={authTabClass(mode === 'login', 'login')}
                >
                  <LogIn className="h-4 w-4" aria-hidden />
                  Login
                </Link>
                <Link
                  href="/register"
                  className={authTabClass(mode === 'register', 'signup')}
                >
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Sign up
                </Link>
              </div>

              <div className="mt-8">{children}</div>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block">
            <Image
              src={AUTH_IMAGE}
              alt="Modern South African home exterior"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 0vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-900/10 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-white/95">
                &ldquo;Homescout made it easy to compare listings across provinces and
                contact sellers directly — the whole search felt clear and trustworthy.&rdquo;
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">Thandi Mokoena</p>
                  <p className="text-xs text-white/75">Home buyer</p>
                  <p className="text-xs text-white/60">Johannesburg, Gauteng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const authInputClass =
  'w-full rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:outline-none focus:border-stone-300 focus:bg-white focus:ring-2 focus:ring-violet-200/80'

export const authSelectClass = authInputClass

export {
  authButtonPrimaryClass,
  authSignupLinkClass,
  authSigninLinkClass,
}
