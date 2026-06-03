import { Suspense } from 'react'
import { buildPageMetadata } from '@/lib/seo'
import LoginForm from './LoginForm'

export const metadata = buildPageMetadata({
  title: 'Sign in',
  description: 'Sign in to your Homescount seller or admin account.',
  path: '/login',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
