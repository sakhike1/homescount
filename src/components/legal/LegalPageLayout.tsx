import Link from 'next/link'
import type { ReactNode } from 'react'
import { LEGAL } from '@/lib/legal'

export default function LegalPageLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <main className="bg-[#faf9f7] min-h-screen px-4 py-10 sm:py-14">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm font-semibold text-amber-700 hover:text-amber-800 transition"
        >
          ← Back to Homescout
        </Link>
        <header className="mt-6 border-b border-stone-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Last updated: {LEGAL.lastUpdated} · {LEGAL.operatorName}
          </p>
        </header>
        <div className="mt-8 prose-legal space-y-6 text-stone-700 text-sm sm:text-base leading-relaxed">
          {children}
        </div>
        <footer className="mt-12 pt-6 border-t border-stone-200 text-sm text-stone-500">
          Questions? Contact{' '}
          <a
            href={`mailto:${LEGAL.privacyEmail}`}
            className="font-semibold text-amber-700 hover:underline"
          >
            {LEGAL.privacyEmail}
          </a>
        </footer>
      </article>
    </main>
  )
}
