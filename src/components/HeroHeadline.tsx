'use client'

import { motion } from 'framer-motion'

const headlineWords = ['Find', 'the', 'home']
const accentWords = ["you'll", 'love']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const descVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function HeroHeadline() {
  return (
    <div className="mt-6">
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1]"
      >
        <span className="block overflow-hidden pb-1">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em] text-white"
            >
              {word}
            </motion.span>
          ))}
        </span>
        <span className="block overflow-hidden pb-1">
          {accentWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em] text-violet-200"
            >
              {word}
            </motion.span>
          ))}
        </span>
      </motion.h1>

      <motion.p
        variants={descVariants}
        initial="hidden"
        animate="visible"
        className="mt-5 max-w-lg text-base sm:text-lg text-violet-100/80 leading-relaxed"
      >
        Search thousands of properties for sale and rent across all 9
        provinces — trusted sellers, verified listings.
      </motion.p>
    </div>
  )
}
