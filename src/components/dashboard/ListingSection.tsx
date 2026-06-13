import type { ReactNode } from 'react'

type Props = {
  id?: string
  step: number
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}

export default function ListingSection({
  id,
  step,
  title,
  description,
  icon,
  children,
}: Props) {
  return (
    <section
      id={id}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="border-b border-stone-100 bg-gradient-to-r from-violet-50/90 via-white to-white px-6 py-5 sm:px-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-900 text-white shadow-sm shadow-violet-900/20">
            {icon}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Step {step}
            </p>
            <h2 className="text-lg font-bold text-stone-900 sm:text-xl">{title}</h2>
            <p className="mt-0.5 text-sm text-stone-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </section>
  )
}

export const dashboardPrimaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-violet-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50'

export const dashboardSecondaryButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50'
