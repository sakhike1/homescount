/** Subtle borders and pill-shaped fields — matches property browse filters. */

export const formInputClass =
  'w-full rounded-full border border-gray-200/70 bg-stone-50/40 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-[box-shadow,border-color,background-color] focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200/80'

export const formTextareaClass =
  'w-full rounded-2xl border border-gray-200/70 bg-stone-50/40 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-[box-shadow,border-color,background-color] focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-200/80'

export const formSelectClass = formInputClass

export const formButtonPrimaryClass =
  'rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50'

export const formButtonPrimaryFullClass =
  'w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50'

export const formButtonSecondaryClass =
  'rounded-full border border-gray-200/70 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50'

export function formChoiceButtonClass(selected: boolean) {
  return `rounded-full border px-4 py-3 text-sm font-semibold transition ${
    selected
      ? 'border-gray-400 bg-stone-100 text-stone-900 shadow-sm'
      : 'border-gray-200/70 text-gray-600 hover:border-gray-300 hover:bg-stone-50/50'
  }`
}

export const formNoticeClass =
  'rounded-2xl border border-gray-200/60 bg-stone-50/80 px-4 py-3 text-sm text-stone-600'

export const formErrorClass =
  'rounded-2xl border border-red-100/80 bg-red-50 px-4 py-3 text-sm text-red-600'

export const formInputDarkClass =
  'w-full rounded-full border border-stone-700/80 bg-stone-950 px-4 py-3 text-sm text-white placeholder:text-stone-500 transition-[box-shadow,border-color] focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-700/80'

export const formButtonPrimaryDarkClass =
  'w-full rounded-full bg-amber-600 py-3 text-sm font-bold text-white transition hover:bg-amber-500 disabled:opacity-50'
