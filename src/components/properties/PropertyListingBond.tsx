'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  Info,
  TrendingDown,
} from 'lucide-react'
import {
  assessListingAffordability,
  defaultDepositForPrice,
} from '@/lib/listing-bond'
import {
  DEFAULT_ANNUAL_INTEREST_RATE,
  formatZar,
  parseMoneyInput,
} from '@/lib/bond-calculator'
import { formatPrice } from '@/lib/format-price'
import { formInputClass, formNoticeClass } from '@/lib/form-styles'

const TERM_OPTIONS = [20, 25, 30] as const

function MoneyField({
  id,
  label,
  hint,
  value,
  onChange,
  optional,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  optional?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-800">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-stone-400">(optional)</span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-xs text-stone-500">{hint}</p>}
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-stone-400">
          R
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${formInputClass} pl-9`}
          placeholder="0"
        />
      </div>
    </div>
  )
}

export default function PropertyListingBond({
  purchasePrice,
  listingType,
}: {
  purchasePrice: number
  listingType: string
}) {
  const [incomeInput, setIncomeInput] = useState('')
  const [livingInput, setLivingInput] = useState('')
  const [debtInput, setDebtInput] = useState('')
  const [depositInput, setDepositInput] = useState(() =>
    defaultDepositForPrice(purchasePrice)
  )
  const [interestRate, setInterestRate] = useState(String(DEFAULT_ANNUAL_INTEREST_RATE))
  const [termYears, setTermYears] = useState<number>(20)

  const result = useMemo(
    () =>
      assessListingAffordability({
        purchasePrice,
        depositCash: parseMoneyInput(depositInput),
        grossMonthlyIncome: parseMoneyInput(incomeInput),
        monthlyLivingExpenses: parseMoneyInput(livingInput),
        monthlyDebtRepayments: parseMoneyInput(debtInput),
        annualInterestRatePercent:
          Number.parseFloat(interestRate) || DEFAULT_ANNUAL_INTEREST_RATE,
        termYears,
      }),
    [
      purchasePrice,
      depositInput,
      incomeInput,
      livingInput,
      debtInput,
      interestRate,
      termYears,
    ]
  )

  const hasIncome = parseMoneyInput(incomeInput) > 0

  if (listingType === 'RENT') return null

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Calculator className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-bold text-stone-900">Calculate bond costs</h2>
          <p className="mt-1 text-sm text-stone-500">
            See monthly repayments for this home and whether your income and deposit
            could support it. Uses the same rules of thumb as SA banks (indicative only).
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="bond-price" className="block text-sm font-semibold text-stone-800">
              Purchase price
            </label>
            <input
              id="bond-price"
              type="text"
              readOnly
              value={formatPrice(purchasePrice, 'SALE')}
              className={`${formInputClass} mt-2 bg-stone-50 font-semibold text-stone-900`}
            />
          </div>

          <MoneyField
            id="bond-deposit"
            label="Deposit you have saved"
            hint="Cash you can put down — banks often expect at least 10%"
            value={depositInput}
            onChange={setDepositInput}
          />

          <MoneyField
            id="bond-income"
            label="Gross monthly income"
            hint="Salary plus regular commission or rental income you declare"
            value={incomeInput}
            onChange={setIncomeInput}
          />

          <MoneyField
            id="bond-living"
            label="Monthly living expenses"
            hint="Groceries, transport, utilities — not bond repayments"
            value={livingInput}
            onChange={setLivingInput}
            optional
          />

          <MoneyField
            id="bond-debt"
            label="Existing debt repayments"
            hint="Car finance, loans, credit cards"
            value={debtInput}
            onChange={setDebtInput}
            optional
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bond-rate" className="block text-sm font-semibold text-stone-800">
                Interest rate (% p.a.)
              </label>
              <input
                id="bond-rate"
                type="number"
                min={5}
                max={25}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`${formInputClass} mt-2`}
              />
              <p className="mt-1 text-xs text-stone-500">
                SA prime + your bank&apos;s margin (check current prime rate)
              </p>
            </div>
            <div>
              <span className="block text-sm font-semibold text-stone-800">Loan term</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {TERM_OPTIONS.map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setTermYears(years)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      termYears === years
                        ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {years} years
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-4">
          {!result ? null : (
            <>
              <div className="rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 p-6 ring-1 ring-stone-200/80">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Monthly repayments
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                  {formatZar(result.monthlyRepayment)}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  For this property over {result.termYears} years @{' '}
                  {result.annualInterestRatePercent}%
                </p>

                <dl className="mt-6 space-y-3 border-t border-stone-200/80 pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-500">Loan value</dt>
                    <dd className="font-semibold text-stone-800">
                      {formatZar(result.loanAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-500">Deposit used</dt>
                    <dd className="font-semibold text-stone-800">
                      {formatZar(result.depositUsed)}{' '}
                      <span className="font-normal text-stone-400">
                        ({result.depositPercentOfPrice.toFixed(0)}%)
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-500">Total interest</dt>
                    <dd className="font-semibold text-stone-800">
                      {formatZar(result.totalInterest)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-500">Total repayment</dt>
                    <dd className="font-semibold text-stone-800">
                      {formatZar(result.totalRepayment)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Affordability verdict */}
              {hasIncome ? (
                <div
                  className={`rounded-2xl border p-5 ${
                    result.overallAffordable
                      ? 'border-emerald-200 bg-emerald-50'
                      : result.canAffordMonthly
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.overallAffordable ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                    ) : (
                      <TrendingDown className="h-5 w-5 shrink-0 text-amber-700" aria-hidden />
                    )}
                    <div>
                      <p className="font-bold text-stone-900">
                        {result.overallAffordable
                          ? 'You may qualify for this property'
                          : result.canAffordMonthly
                            ? 'Repayments look manageable — check your deposit'
                            : 'This property may stretch your budget'}
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                        <li>
                          Max bond repayment (est.):{' '}
                          <strong>{formatZar(result.maxMonthlyRepayment)}/mo</strong>
                          {result.canAffordMonthly ? (
                            <span className="text-emerald-700">
                              {' '}
                              — {formatZar(result.monthlySurplusOrShortfall)} headroom
                            </span>
                          ) : (
                            <span className="text-red-700">
                              {' '}
                              — {formatZar(Math.abs(result.monthlySurplusOrShortfall))} short
                            </span>
                          )}
                        </li>
                        <li>
                          Max property price (est.):{' '}
                          <strong>{formatZar(result.maxPropertyPrice)}</strong>
                          {!result.canAffordPrice && (
                            <span className="text-red-700"> — below this listing</span>
                          )}
                        </li>
                        {result.depositShortfall > 0 && (
                          <li className="text-amber-800">
                            Deposit shortfall (10% guide):{' '}
                            <strong>{formatZar(result.depositShortfall)}</strong>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-stone-400" aria-hidden />
                  <p className="mt-3 font-semibold text-stone-800">
                    Enter your monthly income
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    We&apos;ll check if this home fits your budget
                  </p>
                </div>
              )}

              <p className={`${formNoticeClass} flex gap-2 text-xs`}>
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                <span>
                  Indicative only — not financial advice. Banks use credit scores, employment,
                  and property valuation. Confirm with your lender or bond originator.
                </span>
              </p>

              <Link
                href="/tools/bond-calculator"
                className="inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800 hover:underline"
              >
                Full affordability calculator →
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
