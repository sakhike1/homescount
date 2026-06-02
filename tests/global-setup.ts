import { execSync } from 'node:child_process'
import path from 'node:path'

export default async function globalSetup() {
  if (process.env.SKIP_E2E_SEED === '1') return

  try {
    execSync('npm run db:seed', {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
      env: process.env,
    })
  } catch (error) {
    console.warn(
      '[e2e] db:seed failed — auth tests may fail. Ensure DATABASE_URL is set.\n',
      error
    )
  }
}
