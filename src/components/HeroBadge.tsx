'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2"
    >
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-violet-200 text-violet-200" />
        ))}
      </div>
      <span className="text-sm font-medium text-violet-200/90">
        Trusted property search across South Africa
      </span>
    </motion.div>
  )
}
