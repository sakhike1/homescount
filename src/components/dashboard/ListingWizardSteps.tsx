import { Check, Circle } from 'lucide-react'

type Step = {
  id: string
  label: string
  done: boolean
  active?: boolean
}

type Props = {
  steps: Step[]
}

export default function ListingWizardSteps({ steps }: Props) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
        <li key={step.id} className="flex items-center gap-2 sm:gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
              step.done
                ? 'bg-violet-100 text-violet-800'
                : step.active
                  ? 'bg-violet-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-500'
            }`}
          >
            {step.done ? (
              <Check className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Circle className="h-3.5 w-3.5" aria-hidden />
            )}
            {step.label}
          </span>
          {index < steps.length - 1 ? (
            <span className="hidden h-px w-6 bg-stone-200 sm:block" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  )
}
