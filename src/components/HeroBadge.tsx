'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.08] px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/[0.12] backdrop-blur-xl">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
          <Sparkles className="h-3 w-3 text-white" aria-hidden />
        </span>
        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-semibold">
          Homescout
        </span>
        <span className="h-1 w-1 rounded-full bg-white/40" />
        <span className="text-white/60">South Africa</span>
      </span>
    </motion.div>
  )
}
