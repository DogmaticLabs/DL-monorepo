'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useBracketSlides } from './providers'

interface IntroSequenceProps {
  onComplete: () => void
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [bracketSlidesData] = useBracketSlides()

  useEffect(() => {
    // Auto-progress through the simplified intro sequence
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2500)
      return () => clearTimeout(timer)
    }
    if (step === 1 && !isExiting) {
      const timer = setTimeout(() => {
        setIsExiting(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
    if (isExiting) {
      // Wait for exit animations to complete before calling onComplete
      const timer = setTimeout(() => {
        onComplete()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [step, isExiting, onComplete])

  console.log(bracketSlidesData)

  return (
    <motion.div
      className='relative flex flex-col items-center justify-center h-dvh w-full overflow-hidden'
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* Subtle radial gradient overlay */}
      <motion.div
        className='absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      />

      {/* Content */}
      <AnimatePresence mode='wait'>
        {step === 0 ? (
          <motion.div
            key='welcome-content'
            className='absolute inset-0 flex flex-col items-center justify-center px-6 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              isExiting
                ? {
                    opacity: 0,
                    y: -50,
                    transition: { duration: 0.5 },
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <motion.div
              key='welcome'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className='text-center'
            >
              <motion.div
                className='relative'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className='w-full h-1 bg-gradient-to-r from-transparent via-madness-orange to-transparent mb-8'
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </motion.div>
              <motion.h1
                className='text-4xl md:text-7xl font-bold text-white mb-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Welcome to your
              </motion.h1>
              <motion.h1
                className='text-5xl md:text-8xl font-extrabold text-white bg-madness-orange rounded-lg px-2 py-3 drop-shadow-md'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Bracket Wrap
              </motion.h1>
              <motion.div
                className='w-full h-1 bg-gradient-to-r from-transparent via-madness-orange to-transparent mt-8'
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key='intro-content'
            className='absolute inset-0 flex flex-col items-center justify-center px-6 z-10'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              isExiting
                ? {
                    opacity: 0,
                    y: -50,
                    transition: { duration: 0.5 },
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 0.5 }}
          >
            <motion.div
              key='intro'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className='text-center max-w-md'
            >
              <motion.div
                className='w-16 h-16 mx-auto mb-6 text-4xl flex items-center justify-center'
                initial={{ opacity: 0, rotateY: 180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.8 }}
              >
                🏀
              </motion.div>
              <motion.h2
                className='text-3xl md:text-4xl font-bold text-white mb-4'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Let's see how your bracket {bracketSlidesData?.info.group ? 'and group' : ''} stack
                up.
              </motion.h2>
              <motion.div
                className='w-32 h-1 bg-madness-orange mx-auto mt-6 rounded-full'
                initial={{ width: 0 }}
                animate={{ width: '8rem' }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
