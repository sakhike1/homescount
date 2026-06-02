import type { LucideIcon } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'

export type Benefit = {
  title: string
  description: string
  icon: LucideIcon
}

export default function BenefitCards({
  heading,
  benefits,
}: {
  heading: string
  benefits: Benefit[]
}) {
  return (
    <section className="section-warm px-4 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-section-title text-center">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon
            return (
              <Reveal key={b.title} delay={idx * 0.04}>
                <div className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-bold text-stone-900">{b.title}</h3>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
