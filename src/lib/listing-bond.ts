import {
  calculateBondAffordability,
  DEFAULT_ANNUAL_INTEREST_RATE,
  DEFAULT_TERM_YEARS,
  monthlyPaymentFromLoan,
} from '@/lib/bond-calculator'

export type ListingAffordabilityInput = {
  purchasePrice: number
  depositCash: number
  grossMonthlyIncome: number
  monthlyLivingExpenses?: number
  monthlyDebtRepayments?: number
  annualInterestRatePercent?: number
  termYears?: number
}

export type ListingAffordabilityResult = {
  monthlyRepayment: number
  loanAmount: number
  depositUsed: number
  totalRepayment: number
  totalInterest: number
  termYears: number
  annualInterestRatePercent: number
  depositPercentOfPrice: number
  maxMonthlyRepayment: number
  maxPropertyPrice: number
  conservativePropertyPrice: number
  canAffordMonthly: boolean
  canAffordPrice: boolean
  monthlySurplusOrShortfall: number
  depositShortfall: number
  overallAffordable: boolean
}

/** Bond repayment + income affordability for a specific listing price. */
export function assessListingAffordability(
  input: ListingAffordabilityInput
): ListingAffordabilityResult | null {
  const purchasePrice = Math.max(0, input.purchasePrice)
  if (purchasePrice <= 0) return null

  const depositCash = Math.max(0, input.depositCash)
  const depositUsed = Math.min(depositCash, purchasePrice)
  const loanAmount = Math.max(0, purchasePrice - depositUsed)
  const annualInterestRatePercent =
    input.annualInterestRatePercent ?? DEFAULT_ANNUAL_INTEREST_RATE
  const termYears = input.termYears ?? DEFAULT_TERM_YEARS
  const termMonths = termYears * 12

  const monthlyRepayment = monthlyPaymentFromLoan(
    loanAmount,
    annualInterestRatePercent,
    termMonths
  )
  const totalRepayment = monthlyRepayment * termMonths
  const totalInterest = Math.max(0, totalRepayment - loanAmount)
  const depositPercentOfPrice =
    purchasePrice > 0 ? (depositUsed / purchasePrice) * 100 : 0

  const affordability = calculateBondAffordability({
    grossMonthlyIncome: input.grossMonthlyIncome,
    monthlyLivingExpenses: input.monthlyLivingExpenses ?? 0,
    monthlyDebtRepayments: input.monthlyDebtRepayments ?? 0,
    depositPercent: depositPercentOfPrice,
    annualInterestRatePercent,
    termYears,
  })

  const maxMonthlyRepayment = affordability?.maxMonthlyRepayment ?? 0
  const maxPropertyPrice = affordability?.maxPropertyPrice ?? 0
  const conservativePropertyPrice = affordability?.conservativePropertyPrice ?? 0
  const hasIncome = input.grossMonthlyIncome > 0

  const canAffordMonthly = hasIncome && monthlyRepayment <= maxMonthlyRepayment
  const canAffordPrice = hasIncome && maxPropertyPrice >= purchasePrice
  const recommendedDeposit = purchasePrice * 0.1
  const depositShortfall = Math.max(0, recommendedDeposit - depositCash)
  const overallAffordable =
    hasIncome && canAffordMonthly && canAffordPrice && depositShortfall === 0

  return {
    monthlyRepayment,
    loanAmount,
    depositUsed,
    totalRepayment,
    totalInterest,
    termYears,
    annualInterestRatePercent,
    depositPercentOfPrice,
    maxMonthlyRepayment,
    maxPropertyPrice,
    conservativePropertyPrice,
    canAffordMonthly,
    canAffordPrice,
    monthlySurplusOrShortfall: maxMonthlyRepayment - monthlyRepayment,
    depositShortfall,
    overallAffordable,
  }
}

export function formatMoneyDisplay(n: number): string {
  if (n <= 0) return ''
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function defaultDepositForPrice(price: number): string {
  return formatMoneyDisplay(Math.round(price * 0.1))
}
