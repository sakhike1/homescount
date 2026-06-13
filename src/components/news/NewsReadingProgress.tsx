'use client'

import { useEffect, useState } from 'react'

export default function NewsReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const article = document.getElementById('news-article-body')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const start = window.scrollY + rect.top
      const height = article.offsetHeight
      const scrolled = window.scrollY - start + window.innerHeight * 0.35
      const pct = Math.min(100, Math.max(0, (scrolled / height) * 100))
      setProgress(pct)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 h-0.5 bg-stone-200/80"
      aria-hidden
    >
      <div
        className="h-full bg-violet-600 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
