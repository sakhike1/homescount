/** Shared modern signup / CTA styles for nav and auth flows. */

export const signupNavButtonClass =
  'group hidden md:inline-flex items-center gap-2 rounded-full bg-violet-900 pl-5 pr-1.5 py-1.5 text-sm font-semibold text-white shadow-md shadow-violet-900/20 transition hover:bg-violet-800'

export const signupNavIconClass =
  'flex h-8 w-8 items-center justify-center rounded-full bg-white text-violet-900 transition-transform duration-200 group-hover:translate-x-0.5'

export const signupMobileButtonClass =
  'flex w-full items-center justify-center rounded-full bg-violet-900 py-3 text-sm font-bold text-white shadow-sm shadow-violet-900/20 transition hover:bg-violet-800'

export function authTabClass(active: boolean, variant: 'login' | 'signup') {
  if (active && variant === 'signup') {
    return 'btn-grad inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold'
  }
  if (active) {
    return 'inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-stone-900 shadow-sm ring-1 ring-stone-200/80'
  }
  return 'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-stone-500 transition hover:bg-white/60 hover:text-stone-800'
}

export const authButtonPrimaryClass =
  'btn-grad group w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold'

export const authSignupLinkClass =
  'inline-flex items-center gap-1.5 rounded-full bg-[#a8caba]/20 px-3.5 py-1.5 text-sm font-bold text-[#5D4157] ring-1 ring-[#a8caba]/50 transition hover:bg-[#a8caba]/30'

export const authSigninLinkClass =
  'inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1.5 text-sm font-bold text-stone-700 ring-1 ring-stone-200/80 transition hover:bg-stone-200/80'
