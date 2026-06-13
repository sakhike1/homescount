import Link from 'next/link'

type Variant = 'inquiry' | 'newsletter'

export default function ConsentCheckbox({
  variant,
  id,
  name = 'privacyConsent',
  tone = 'light',
}: {
  variant: Variant
  id: string
  name?: string
  tone?: 'light' | 'dark' | 'newsletter'
}) {
  const isNewsletter = tone === 'newsletter'
  const isDark = tone === 'dark'

  const labelClass = isNewsletter
    ? 'flex gap-3 cursor-pointer text-xs text-stone-600 sm:text-sm'
    : isDark
      ? 'flex gap-3 cursor-pointer rounded-xl border border-slate-600/40 bg-slate-800/30 px-4 py-3 text-xs text-slate-400 transition-colors duration-200 hover:border-slate-500/50 hover:bg-slate-800/50 sm:text-sm'
      : 'flex gap-3 cursor-pointer rounded-xl border border-gray-200/60 bg-stone-50/50 px-4 py-3 text-xs sm:text-sm text-stone-600'

  const inputClass = isNewsletter
    ? 'mt-0.5 h-4 w-4 shrink-0 rounded border-stone-300 bg-white text-[#5D4157] focus:ring-[#abbaab]/60 focus:ring-offset-0'
    : isDark
      ? 'mt-0.5 h-4 w-4 shrink-0 rounded border-slate-500/50 bg-slate-700/50 text-violet-500 focus:ring-violet-500/30 focus:ring-offset-0 focus:ring-offset-transparent'
      : 'mt-0.5 h-4 w-4 shrink-0 rounded border-gray-200 text-violet-600 focus:ring-violet-200/80'

  const linkClass = isNewsletter
    ? 'font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-900'
    : isDark
      ? 'font-medium text-violet-400 hover:text-violet-300 transition-colors'
      : 'font-semibold text-violet-700 hover:underline'

  return (
    <label htmlFor={id} className={labelClass}>
      <input
        id={id}
        name={name}
        type="checkbox"
        value="true"
        required
        className={inputClass}
      />
      <span className="leading-relaxed">
        {variant === 'inquiry' ? (
          <>
            I have read the{' '}
            <Link href="/privacy" className={linkClass}>
              Privacy Policy
            </Link>{' '}
            and consent to Homescout processing my personal information to pass this enquiry
            to the seller and to contact me about this property, in accordance with the
            Protection of Personal Information Act 4 of 2013 (POPIA).
          </>
        ) : (
          <>
            I have read the{' '}
            <Link href="/privacy" className={linkClass}>
              Privacy Policy
            </Link>{' '}
            and consent to Homescout processing my email address to send me property news, tips,
            and marketing communications. I understand I may withdraw consent or unsubscribe at
            any time.
          </>
        )}
      </span>
    </label>
  )
}
