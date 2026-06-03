/**
 * South African home-loan affordability estimates for buyer education.
 * Banks apply their own scoring; this uses common industry rules of thumb.
 */

export const DEFAULT_ANNUAL_INTEREST_RATE = 11.75
export const DEFAULT_TERM_YEARS = 20
export const DEFAULT_DEPOSIT_PERCENT = 10
/** Many SA banks cap the bond instalment near 30% of gross income. */
export const MAX_REPAYMENT_INCOME_RATIO = 0.3
/** Share of money left after expenses that can safely go to a bond. */
export const MAX_REPAYMENT_DISPOSABLE_RATIO = 0.7
/** Suggested “comfortable” budget below the theoretical maximum. */
export const CONSERVATIVE_PRICE_FACTOR = 0.85
/** Rough cash-on-hand for transfer duty, bond costs, etc. (varies by price). */
export const ESTIMATED_TRANSFER_COST_RATIO = 0.08

export type BondCalculatorInput = {
  grossMonthlyIncome: number
  monthlyLivingExpenses: number
  monthlyDebtRepayments: number
  depositPercent?: number
  annualInterestRatePercent?: number
  termYears?: number
}

export type AffordabilityInsight = {
  tone: 'info' | 'warning' | 'success'
  title: string
  detail: string
}

export type BondAffordabilityResult = {
  grossMonthlyIncome: number
  totalMonthlyExpenses: number
  disposableIncome: number
  incomeCapRepayment: number
  disposableCapRepayment: number
  maxMonthlyRepayment: number
  limitingFactor: 'income_cap' | 'disposable_income' | 'insufficient_income'
  maxLoanAmount: number
  maxPropertyPrice: number
  conservativePropertyPrice: number
  depositAmount: number
  estimatedTransferCosts: number
  totalCashNeeded: number
  totalInterestOverTerm: number
  totalPaidOverTerm: number
  depositPercent: number
  annualInterestRatePercent: number
  termYears: number
  termMonths: number
  insights: AffordabilityInsight[]
}

export function formatZar(amount: number, options?: { decimals?: number }) {
  const decimals = options?.decimals ?? 0
  return `R ${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export function parseMoneyInput(value: string): number {
  const digits = value.replace(/[^\d]/g, '')
  if (!digits) return 0
  return Number.parseInt(digits, 10)
}

/** Maximum loan principal from a monthly repayment (standard amortisation). */
export function loanPrincipalFromMonthlyPayment(
  monthlyPayment: number,
  annualInterestRatePercent: number,
  termMonths: number
): number {
  if (monthlyPayment <= 0 || termMonths <= 0) return 0

  const monthlyRate = annualInterestRatePercent / 100 / 12
  if (monthlyRate === 0) {
    return monthlyPayment * termMonths
  }

  const factor = (1 - (1 + monthlyRate) ** -termMonths) / monthlyRate
  return monthlyPayment * factor
}

/** Monthly bond repayment for a given loan principal. */
export function monthlyPaymentFromLoan(
  loanAmount: number,
  annualInterestRatePercent: number,
  termMonths: number
): number {
  if (loanAmount <= 0 || termMonths <= 0) return 0

  const monthlyRate = annualInterestRatePercent / 100 / 12
  if (monthlyRate === 0) {
    return loanAmount / termMonths
  }

  return (
    (loanAmount * monthlyRate * (1 + monthlyRate) ** termMonths) /
    ((1 + monthlyRate) ** termMonths - 1)
  )
}

export function propertyPriceFromLoan(loanAmount: number, depositPercent: number): number {
  if (loanAmount <= 0) return 0
  const depositRatio = Math.min(Math.max(depositPercent, 0), 99) / 100
  if (depositRatio >= 1) return loanAmount
  return loanAmount / (1 - depositRatio)
}

export function calculateBondAffordability(
  input: BondCalculatorInput
): BondAffordabilityResult | null {
  const grossMonthlyIncome = Math.max(0, input.grossMonthlyIncome)
  const monthlyLivingExpenses = Math.max(0, input.monthlyLivingExpenses)
  const monthlyDebtRepayments = Math.max(0, input.monthlyDebtRepayments)
  const depositPercent = input.depositPercent ?? DEFAULT_DEPOSIT_PERCENT
  const annualInterestRatePercent =
    input.annualInterestRatePercent ?? DEFAULT_ANNUAL_INTEREST_RATE
  const termYears = input.termYears ?? DEFAULT_TERM_YEARS
  const termMonths = termYears * 12

  if (grossMonthlyIncome <= 0) return null

  const totalMonthlyExpenses = monthlyLivingExpenses + monthlyDebtRepayments
  const disposableIncome = grossMonthlyIncome - totalMonthlyExpenses
  const incomeCapRepayment = grossMonthlyIncome * MAX_REPAYMENT_INCOME_RATIO
  const disposableCapRepayment = Math.max(0, disposableIncome * MAX_REPAYMENT_DISPOSABLE_RATIO)

  let limitingFactor: BondAffordabilityResult['limitingFactor'] = 'income_cap'
  let maxMonthlyRepayment = Math.min(incomeCapRepayment, disposableCapRepayment)

  if (disposableIncome <= 0) {
    limitingFactor = 'insufficient_income'
    maxMonthlyRepayment = 0
  } else if (disposableCapRepayment < incomeCapRepayment) {
    limitingFactor = 'disposable_income'
  }

  maxMonthlyRepayment = Math.max(0, maxMonthlyRepayment)

  const maxLoanAmount = loanPrincipalFromMonthlyPayment(
    maxMonthlyRepayment,
    annualInterestRatePercent,
    termMonths
  )
  const maxPropertyPrice = propertyPriceFromLoan(maxLoanAmount, depositPercent)
  const conservativePropertyPrice = maxPropertyPrice * CONSERVATIVE_PRICE_FACTOR
  const depositAmount = maxPropertyPrice * (depositPercent / 100)
  const estimatedTransferCosts = maxPropertyPrice * ESTIMATED_TRANSFER_COST_RATIO
  const totalCashNeeded = depositAmount + estimatedTransferCosts
  const totalPaidOverTerm = maxMonthlyRepayment * termMonths
  const totalInterestOverTerm = Math.max(0, totalPaidOverTerm - maxLoanAmount)

  const insights = buildInsights({
    grossMonthlyIncome,
    totalMonthlyExpenses,
    disposableIncome,
    limitingFactor,
    maxMonthlyRepayment,
    incomeCapRepayment,
    disposableCapRepayment,
    depositPercent,
    maxPropertyPrice,
    conservativePropertyPrice,
    totalCashNeeded,
  })

  return {
    grossMonthlyIncome,
    totalMonthlyExpenses,
    disposableIncome,
    incomeCapRepayment,
    disposableCapRepayment,
    maxMonthlyRepayment,
    limitingFactor,
    maxLoanAmount,
    maxPropertyPrice,
    conservativePropertyPrice,
    depositAmount,
    estimatedTransferCosts,
    totalCashNeeded,
    totalInterestOverTerm,
    totalPaidOverTerm,
    depositPercent,
    annualInterestRatePercent,
    termYears,
    termMonths,
    insights,
  }
}

function buildInsights(ctx: {
  grossMonthlyIncome: number
  totalMonthlyExpenses: number
  disposableIncome: number
  limitingFactor: BondAffordabilityResult['limitingFactor']
  maxMonthlyRepayment: number
  incomeCapRepayment: number
  disposableCapRepayment: number
  depositPercent: number
  maxPropertyPrice: number
  conservativePropertyPrice: number
  totalCashNeeded: number
}): AffordabilityInsight[] {
  const insights: AffordabilityInsight[] = []
  const expenseRatio = ctx.totalMonthlyExpenses / ctx.grossMonthlyIncome

  if (ctx.limitingFactor === 'insufficient_income') {
    insights.push({
      tone: 'warning',
      title: 'Expenses exceed income',
      detail:
        'Your monthly costs are higher than your income on these figures. Pay down debt or increase income before taking on a home loan.',
    })
  } else if (ctx.limitingFactor === 'disposable_income') {
    insights.push({
      tone: 'info',
      title: 'Spending is your main limit',
      detail:
        'After living costs and debt, there is less room for a bond than the 30% income guideline. Reducing expenses or debt can raise what you qualify for.',
    })
  } else {
    insights.push({
      tone: 'success',
      title: 'Income guideline is the main limit',
      detail:
        'Banks often cap bond repayments at about 30% of gross monthly income. Your expenses still leave headroom below that cap.',
    })
  }

  if (expenseRatio >= 0.7) {
    insights.push({
      tone: 'warning',
      title: 'High expense ratio',
      detail: `Roughly ${Math.round(expenseRatio * 100)}% of your income goes to expenses. Lenders prefer more spare income for rates, insurance, and emergencies.`,
    })
  }

  if (ctx.depositPercent < 10 && ctx.maxPropertyPrice > 0) {
    insights.push({
      tone: 'info',
      title: 'Deposit below 10%',
      detail:
        'Many banks prefer at least 10% deposit. A larger deposit reduces your loan, monthly repayment, and risk of negative equity.',
    })
  }

  if (ctx.maxPropertyPrice > 0) {
    insights.push({
      tone: 'info',
      title: 'Plan for upfront cash',
      detail: `Besides a ${ctx.depositPercent}% deposit, budget roughly ${formatZar(ctx.totalCashNeeded)} for deposit plus transfer duty and bond registration (estimate ~${Math.round(ESTIMATED_TRANSFER_COST_RATIO * 100)}% of price).`,
    })

    insights.push({
      tone: 'success',
      title: 'Comfortable budget',
      detail: `For less financial pressure, aim closer to ${formatZar(ctx.conservativePropertyPrice)} — about ${Math.round(CONSERVATIVE_PRICE_FACTOR * 100)}% of the maximum shown.`,
    })
  }

  if (ctx.maxMonthlyRepayment <= 0) {
    insights.push({
      tone: 'warning',
      title: 'No bond room on these numbers',
      detail: 'Adjust income, expenses, or debt repayments to see an estimated price range.',
    })
  }

  return insights
}

export function propertiesInBudgetHref(maxPrice: number) {
  const rounded = Math.max(0, Math.floor(maxPrice / 1000) * 1000)
  if (rounded <= 0) return '/properties?type=buy'
  return `/properties?type=buy&maxPrice=${rounded}`
}
