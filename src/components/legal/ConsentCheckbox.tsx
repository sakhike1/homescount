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
  tone?: 'light' | 'dark'
}) {
  const isDark = tone === 'dark'

  return (
    <label
      htmlFor={id}
      className={
        isDark
          ? 'flex gap-3 cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs text-white/50 transition-colors duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] sm:text-sm'
          : 'flex gap-3 cursor-pointer rounded-xl border border-gray-200/60 bg-stone-50/50 px-4 py-3 text-xs sm:text-sm text-stone-600'
      }
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        value="true"
        required
        className={
          isDark
            ? 'mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0 focus:ring-offset-transparent'
            : 'mt-0.5 h-4 w-4 shrink-0 rounded border-gray-200 text-amber-600 focus:ring-gray-200/80'
        }
      />
      <span className="leading-relaxed">
        {variant === 'inquiry' ? (
          <>
            I have read the{' '}
            <Link
              href="/privacy"
              className={
                isDark
                  ? 'font-medium text-amber-400 hover:text-amber-300 transition-colors'
                  : 'font-semibold text-amber-700 hover:underline'
              }
            >
              Privacy Policy
            </Link>{' '}
            and consent to Homescout processing my personal information to pass this enquiry
            to the seller and to contact me about this property, in accordance with the
            Protection of Personal Information Act 4 of 2013 (POPIA).
          </>
        ) : (
          <>
            I have read the{' '}
            <Link
              href="/privacy"
              className={
                isDark
                  ? 'font-medium text-amber-400 hover:text-amber-300 transition-colors'
                  : 'font-semibold text-amber-700 hover:underline'
              }
            >
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
