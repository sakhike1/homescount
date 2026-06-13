import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  prismaSchemaVersion?: string
}

/** Bump when Prisma schema changes so `next dev` does not keep a stale client. */
const PRISMA_SCHEMA_VERSION = 'image-sort-order-v1'

if (
  process.env.NODE_ENV !== 'production' &&
  globalForPrisma.prismaSchemaVersion !== PRISMA_SCHEMA_VERSION
) {
  globalForPrisma.prisma = undefined
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION
}

/** Prefer Neon pooler + connect_timeout for cold starts and concurrent Next.js cache revalidation. */
export function resolveDatabaseUrl(raw = process.env.DATABASE_URL): string | undefined {
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    if (url.hostname.endsWith('.neon.tech') && !url.hostname.includes('-pooler')) {
      url.hostname = url.hostname.replace(/^([^.]+)\.(c-\d+\.)/, '$1-pooler.$2')
    }
    if (!url.searchParams.has('connect_timeout')) {
      url.searchParams.set('connect_timeout', '5')
    }
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '5')
    }
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require')
    }
    return url.toString()
  } catch {
    return raw
  }
}

function getPool() {
  if (!globalForPrisma.pool) {
    const pool = new Pool({
      connectionString: resolveDatabaseUrl(),
      max: 10,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 20_000,
    })
    pool.on('error', (err) => {
      console.error('[db] idle pool client error', err.message)
    })
    globalForPrisma.pool = pool
  }
  return globalForPrisma.pool
}

function createPrismaClient() {
  const adapter = new PrismaPg(getPool())
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
