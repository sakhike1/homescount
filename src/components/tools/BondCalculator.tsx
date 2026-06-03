'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Calculator,
  CircleDollarSign,
  Home,
  Info,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import {
  calculateBondAffordability,
  DEFAULT_ANNUAL_INTEREST_RATE,
  DEFAULT_DEPOSIT_PERCENT,
  DEFAULT_TERM_YEARS,
  formatZar,
  parseMoneyInput,
  propertiesInBudgetHref,
} from '@/lib/bond-calculator'
import { formInputClass, formNoticeClass } from '@/lib/form-styles'

const TERM_OPTIONS = [20, 25, 30] as const

function MoneyField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-800">
        {label}
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

function ResultStat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        highlight
          ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm'
          : 'border-stone-200/80 bg-white'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
      <p
        className={`mt-1 text-lg sm:text-xl font-bold tracking-tight ${
          highlight ? 'text-amber-800' : 'text-stone-900'
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-stone-500">{sub}</p>}
    </div>
  )
}

function IncomeBreakdown({
  income,
  expenses,
  bond,
}: {
  income: number
  expenses: number
  bond: number
}) {
  const safeIncome = Math.max(income, 1)
  const expensePct = Math.min(100, (expenses / safeIncome) * 100)
  const bondPct = Math.min(100 - expensePct, (bond / safeIncome) * 100)
  const bufferPct = Math.max(0, 100 - expensePct - bondPct)

  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-stone-100 ring-1 ring-stone-200/80">
        <div
          className="bg-stone-400 transition-all duration-500"
          style={{ width: `${expensePct}%` }}
          title="Expenses"
        />
        <div
          className="bg-amber-500 transition-all duration-500"
          style={{ width: `${bondPct}%` }}
          title="Bond (max)"
        />
        <div
          className="bg-emerald-400/80 transition-all duration-500"
          style={{ width: `${bufferPct}%` }}
          title="Remaining buffer"
        />
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-stone-400" />
          Expenses {Math.round(expensePct)}%
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Bond (max) {Math.round(bondPct)}%
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Buffer {Math.round(bufferPct)}%
        </li>
      </ul>
    </div>
  )
}

export default function BondCalculator() {
  const [incomeInput, setIncomeInput] = useState('45 000')
  const [livingInput, setLivingInput] = useState('12 000')
  const [debtInput, setDebtInput] = useState('3 500')
  const [depositPercent, setDepositPercent] = useState(DEFAULT_DEPOSIT_PERCENT)
  const [interestRate, setInterestRate] = useState(String(DEFAULT_ANNUAL_INTEREST_RATE))
  const [termYears, setTermYears] = useState<number>(DEFAULT_TERM_YEARS)

  const result = useMemo(() => {
    return calculateBondAffordability({
      grossMonthlyIncome: parseMoneyInput(incomeInput),
      monthlyLivingExpenses: parseMoneyInput(livingInput),
      monthlyDebtRepayments: parseMoneyInput(debtInput),
      depositPercent,
      annualInterestRatePercent: Number.parseFloat(interestRate) || DEFAULT_ANNUAL_INTEREST_RATE,
      termYears,
    })
  }, [incomeInput, livingInput, debtInput, depositPercent, interestRate, termYears])

  const browseHref = result ? propertiesInBudgetHref(result.conservativePropertyPrice) : '/properties?type=buy'

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
        <section className="rounded-[1.75rem] border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20">
              <Calculator className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Your finances</h2>
              <p className="text-sm text-stone-500">Monthly figures before tax (gross income)</p>
            </div>
          </div>

          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Bond affordability inputs"
          >
            <MoneyField
              id="income"
              label="Gross monthly income"
              hint="Salary plus regular commission or rental income you declare to the bank"
              value={incomeInput}
              onChange={setIncomeInput}
            />
            <MoneyField
              id="living"
              label="Monthly living expenses"
              hint="Groceries, transport, insurance, school fees, utilities — not bond repayments"
              value={livingInput}
              onChange={setLivingInput}
            />
            <MoneyField
              id="debt"
              label="Existing debt repayments"
              hint="Car finance, personal loans, credit cards, store accounts"
              value={debtInput}
              onChange={setDebtInput}
            />

            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="deposit" className="text-sm font-semibold text-stone-800">
                  Deposit ({depositPercent}%)
                </label>
                <span className="text-xs text-stone-500">0–30%</span>
              </div>
              <input
                id="deposit"
                type="range"
                min={0}
                max={30}
                step={1}
                value={depositPercent}
                onChange={(e) => setDepositPercent(Number(e.target.value))}
                className="mt-3 w-full accent-amber-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rate" className="block text-sm font-semibold text-stone-800">
                  Interest rate (% p.a.)
                </label>
                <input
                  id="rate"
                  type="number"
                  min={5}
                  max={25}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className={`${formInputClass} mt-2`}
                />
                <p className="mt-1 text-xs text-stone-500">Check your bank&apos;s current prime + margin</p>
              </div>
              <div>
                <span className="block text-sm font-semibold text-stone-800">Bond term</span>
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

          <p className={`mt-6 ${formNoticeClass} flex gap-2 text-xs sm:text-sm`}>
            <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" aria-hidden />
            <span>
              This is an estimate only — not financial advice. Banks use credit scores, employment,
              and property valuation. Always confirm with your lender.
            </span>
          </p>
        </section>

        <section className="space-y-4">
          {!result ? (
            <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50/80 p-8 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-stone-400" aria-hidden />
              <p className="mt-4 font-semibold text-stone-800">Enter your monthly income</p>
              <p className="mt-1 text-sm text-stone-500">We&apos;ll estimate what you could afford to buy</p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-amber-200/80 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-6 sm:p-8 text-white shadow-lg">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500/25 blur-3xl"
                  aria-hidden
                />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
                  Estimated maximum
                </p>
                <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {result.maxPropertyPrice > 0 ? formatZar(result.maxPropertyPrice) : '—'}
                </p>
                <p className="mt-2 text-sm text-white/70">Property price you may qualify for</p>
                {result.maxPropertyPrice > 0 && (
                  <p className="mt-4 text-sm text-amber-100/90">
                    Comfortable target:{' '}
                    <strong className="text-white">{formatZar(result.conservativePropertyPrice)}</strong>
                  </p>
                )}
                {result.maxPropertyPrice > 0 && (
                  <Link
                    href={browseHref}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
                  >
                    <Home className="h-4 w-4" aria-hidden />
                    Browse homes in your range
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                <ResultStat
                  label="Max bond repayment"
                  value={formatZar(result.maxMonthlyRepayment)}
                  sub="Per month"
                  highlight
                />
                <ResultStat
                  label="Max loan amount"
                  value={formatZar(result.maxLoanAmount)}
                  sub={`${result.termYears} years @ ${result.annualInterestRatePercent}%`}
                />
                <ResultStat
                  label="Deposit needed"
                  value={formatZar(result.depositAmount)}
                  sub={`${result.depositPercent}% of max price`}
                />
                <ResultStat
                  label="Upfront cash (est.)"
                  value={formatZar(result.totalCashNeeded)}
                  sub="Deposit + transfer costs"
                />
              </div>

              <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-stone-900">How your income is used</p>
                <p className="mt-1 text-xs text-stone-500 mb-4">Based on maximum bond repayment</p>
                <IncomeBreakdown
                  income={result.grossMonthlyIncome}
                  expenses={result.totalMonthlyExpenses}
                  bond={result.maxMonthlyRepayment}
                />
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-stone-500">Disposable income</dt>
                    <dd className="font-semibold text-stone-900">{formatZar(result.disposableIncome)}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Total interest (est.)</dt>
                    <dd className="font-semibold text-stone-900">{formatZar(result.totalInterestOverTerm)}</dd>
                  </div>
                </dl>
              </div>

              <ul className="space-y-3">
                {result.insights.map((insight) => (
                  <li
                    key={insight.title}
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      insight.tone === 'warning'
                        ? 'border-amber-200 bg-amber-50/80 text-amber-950'
                        : insight.tone === 'success'
                          ? 'border-emerald-200/80 bg-emerald-50/50 text-emerald-950'
                          : 'border-stone-200 bg-stone-50/80 text-stone-700'
                    }`}
                  >
                    <p className="font-semibold">{insight.title}</p>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed opacity-90">{insight.detail}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Banknote,
            title: '30% income guideline',
            text: 'Many South African banks limit your bond instalment to roughly 30% of gross monthly income.',
          },
          {
            icon: PiggyBank,
            title: 'After expenses',
            text: 'What remains after living costs and debt must cover the bond plus a safety buffer for rates and repairs.',
          },
          {
            icon: TrendingUp,
            title: 'Shop with a range',
            text: 'Use the comfortable price as your target; keep the maximum as an upper bound when pre-qualifying.',
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-stone-200/80 bg-white px-5 py-4 shadow-sm"
            >
              <Icon className="h-5 w-5 text-amber-600" aria-hidden />
              <p className="mt-3 font-bold text-stone-900 text-sm">{item.title}</p>
              <p className="mt-1 text-xs text-stone-600 leading-relaxed">{item.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
