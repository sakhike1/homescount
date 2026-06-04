import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Create account',
  description: 'Register as a Homescout seller to list property for sale or rent in South Africa.',
  path: '/register',
  noIndex: true,
})

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
