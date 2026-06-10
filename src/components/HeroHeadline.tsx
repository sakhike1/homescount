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
    y: 30,
    rotateX: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
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
      delay: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function HeroHeadline() {
  return (
    <div className="mt-8">
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
        style={{ perspective: '1000px' }}
      >
        <span className="block overflow-hidden pb-2">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em] text-white"
              style={{ transformOrigin: 'bottom' }}
            >
              {word}
            </motion.span>
          ))}
        </span>
        <span className="block overflow-hidden pb-2">
          {accentWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em] bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent"
              style={{ transformOrigin: 'bottom' }}
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
        className="mt-6 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed"
      >
        Search thousands of properties for sale and rent across all 9
        provinces — trusted sellers, verified listings.
      </motion.p>
    </div>
  )
}
