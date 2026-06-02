export type JourneyStep = {
  step: number
  title: string
  detail: string
}

export const buyJourneySteps: JourneyStep[] = [
  {
    step: 1,
    title: 'Enquire & view the property',
    detail:
      'Send a message to the seller, book a viewing, and ask any questions about the home.',
  },
  {
    step: 2,
    title: 'Make an offer',
    detail:
      'When you are ready, submit an offer. The seller may accept, counter, or decline.',
  },
  {
    step: 3,
    title: 'Bond & affordability',
    detail:
      'Apply for a home loan if needed. Your bank will assess affordability and property value.',
  },
  {
    step: 4,
    title: 'Attorney & sale agreement',
    detail:
      'Conveyancing attorneys draft the sale agreement. Review terms, deposits, and timelines.',
  },
  {
    step: 5,
    title: 'Documents you typically need',
    detail:
      'ID, proof of income, bank statements, FICA documents, and marriage certificate or antenuptial contract if applicable.',
  },
  {
    step: 6,
    title: 'Transfer & registration',
    detail:
      'After bond approval and compliance certificates, the property transfers into your name at the Deeds Office.',
  },
  {
    step: 7,
    title: 'Move in',
    detail:
      'Arrange utilities, insurance, and handover. Welcome home — the process is complete.',
  },
]

export const rentJourneySteps: JourneyStep[] = [
  {
    step: 1,
    title: 'Enquire & schedule a viewing',
    detail:
      'Contact the landlord or agent to ask questions and arrange a time to see the property.',
  },
  {
    step: 2,
    title: 'Rental application',
    detail:
      'Complete an application form. The landlord may run credit and reference checks.',
  },
  {
    step: 3,
    title: 'Documents you typically need',
    detail:
      'ID, proof of income, recent payslips or bank statements, and previous landlord references.',
  },
  {
    step: 4,
    title: 'Lease agreement',
    detail:
      'Review the lease — rent amount, deposit, duration, rules, and notice periods — before signing.',
  },
  {
    step: 5,
    title: 'Deposit & first payment',
    detail:
      'Pay the agreed deposit and first month’s rent as set out in the lease.',
  },
  {
    step: 6,
    title: 'Move-in inspection',
    detail:
      'Document the condition of the property on entry. Keep a copy of the inspection report.',
  },
  {
    step: 7,
    title: 'Settle in',
    detail:
      'Arrange utilities and contents insurance if required. Enjoy your new rental.',
  },
]

export const sellJourneySteps: JourneyStep[] = [
  {
    step: 1,
    title: 'Create your seller account',
    detail:
      'Register as a seller on Homescount. It takes a few minutes — name, email, and password.',
  },
  {
    step: 2,
    title: 'Add your property details',
    detail:
      'Enter title, description, price, location, suburb, and specs (bedrooms, bathrooms, size). Choose sale or rent.',
  },
  {
    step: 3,
    title: 'Upload quality photos',
    detail:
      'Add at least one image. Listings with clear photos get more views and enquiries.',
  },
  {
    step: 4,
    title: 'Publish when you are ready',
    detail:
      'Save as draft, then publish when every required field is complete. Only published listings appear to buyers.',
  },
  {
    step: 5,
    title: 'Promote your listing (optional)',
    detail:
      'Boost visibility with Basic, Featured, or Premium plans — homepage placement and featured badges.',
  },
  {
    step: 6,
    title: 'Respond to enquiries',
    detail:
      'Buyers and renters message you through Homescount. Reply promptly to book viewings and close deals.',
  },
]
