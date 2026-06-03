export function isPrismaMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = 'code' in error ? String((error as { code: string }).code) : ''
  const message = 'message' in error ? String((error as { message: string }).message) : ''
  return (
    code === 'P2021' ||
    /does not exist|relation.*not found|SiteActivity|NewsletterSubscriber/i.test(message)
  )
}

export const ADMIN_DB_SETUP_MESSAGE =
  'Admin tables are missing or out of date. On your machine run: npm run db:push && npm run db:seed'
