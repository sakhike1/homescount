import { buyJourneySteps, rentJourneySteps } from '@/lib/property-journey'
import { CheckCircle2, HandHeart } from 'lucide-react'

export default function PropertyJourneyGuide({
  listingType,
}: {
  listingType: string
}) {
  const steps =
    listingType === 'RENT' ? rentJourneySteps : buyJourneySteps
  const heading =
    listingType === 'RENT'
      ? 'Your path to renting this home'
      : 'Your path to owning this home'

  return (
    <section className="mt-10 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
          <HandHeart className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900">{heading}</h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed">
            Homescout will help you through every step of the way — answering your
            questions, explaining documents, and guiding you until the process is
            finished. You are never on your own.
          </p>
        </div>
      </div>

      <ol className="mt-8 space-y-4">
        {steps.map((item) => (
          <li
            key={item.step}
            className="flex gap-4 rounded-xl bg-white/80 border border-stone-100 p-4"
          >
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
        ))}
      </ol>

      <p className="mt-6 text-sm font-medium text-amber-800 bg-amber-100/60 rounded-xl px-4 py-3">
        Need help? Message the seller above or contact Homescout — we provide
        clear guides and support so your property journey stays smooth from first
        enquiry to keys in hand.
      </p>
    </section>
  )
}
