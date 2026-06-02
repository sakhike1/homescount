import type { JourneyStep } from '@/lib/property-journey'
import { CheckCircle2, HandHeart } from 'lucide-react'
import Reveal from '@/components/motion/Reveal'

export default function JourneyStepsSection({
  title,
  subtitle,
  steps,
  footnote,
}: {
  title: string
  subtitle: string
  steps: JourneyStep[]
  footnote?: string
}) {
  return (
    <section className="section-white px-4 py-14 sm:py-16 border-t border-stone-100">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
              <HandHeart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-section-title">
                {title}
              </h2>
              <p className="mt-2 text-stone-600 leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </Reveal>

        <ol className="mt-10 space-y-4">
          {steps.map((item, idx) => (
            <Reveal key={item.step} delay={idx * 0.03}>
              <li className="flex gap-4 rounded-2xl border border-stone-200 bg-[#faf9f7] p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 flex items-center gap-2">
                    {item.title}
                    {item.step === steps.length && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {footnote && (
          <Reveal delay={0.05}>
            <p className="mt-8 text-sm font-medium text-amber-900 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              {footnote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
