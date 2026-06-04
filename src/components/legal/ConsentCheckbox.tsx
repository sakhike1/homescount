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
          ? 'flex gap-3 cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-xs text-white/75 backdrop-blur-sm sm:text-sm'
          : 'flex gap-3 cursor-pointer rounded-2xl border border-gray-200/60 bg-stone-50/50 px-3 py-3 text-xs sm:text-sm text-stone-600'
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
            ? 'mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-white/10 text-amber-400 focus:ring-white/20'
            : 'mt-0.5 h-4 w-4 shrink-0 rounded border-gray-200 text-amber-600 focus:ring-gray-200/80'
        }
      />
      <span>
        {variant === 'inquiry' ? (
          <>
            I have read the{' '}
            <Link
              href="/privacy"
              className={
                isDark
                  ? 'font-semibold text-white hover:underline'
                  : 'font-semibold text-amber-700 hover:underline'
              }
            >
              Privacy Policy
            </Link>{' '}
            and consent to Homescount processing my personal information to pass this enquiry
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
                  ? 'font-semibold text-white hover:underline'
                  : 'font-semibold text-amber-700 hover:underline'
              }
            >
              Privacy Policy
            </Link>{' '}
            and consent to Homescount processing my email address to send me property news, tips,
            and marketing communications. I understand I may withdraw consent or unsubscribe at
            any time.
          </>
        )}
      </span>
    </label>
  )
}
