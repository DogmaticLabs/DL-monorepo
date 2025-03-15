'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface IntroSequenceProps {
  onComplete: () => void
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

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
      const timer = setTimeout(() => onComplete(), 1200)
      return () => clearTimeout(timer)
    }
  }, [step, isExiting, onComplete])

  return (
    <motion.div
      className='relative flex flex-col items-center justify-center h-screen w-full overflow-hidden'
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* Decorative elements - placed outside of AnimatePresence to prevent reset */}
      {/* Top left bracket */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key='bracket-top-left'
            className='absolute top-[10%] left-[10%] w-16 h-16 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg opacity-70'
            animate={{
              rotate: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            exit={{
              x: -300,
              y: -300,
              opacity: 0,
              rotate: -45,
              transition: { duration: 0.8, ease: 'easeOut' },
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Bottom right bracket */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key='bracket-bottom-right'
            className='absolute bottom-[15%] right-[15%] w-20 h-20 border-r-4 border-b-4 border-orange-500 rounded-br-lg opacity-70'
            animate={{
              rotate: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            exit={{
              x: 300,
              y: 300,
              opacity: 0,
              rotate: 45,
              transition: { duration: 0.8, ease: 'easeOut' },
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.5,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Top right bracket */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key='bracket-top-right'
            className='absolute top-[20%] right-[20%] w-12 h-12 border-r-4 border-t-4 border-pink-400 rounded-tr-lg opacity-70'
            animate={{
              rotate: [0, 25, 0],
              scale: [1, 1.15, 1],
            }}
            exit={{
              x: 300,
              y: -300,
              opacity: 0,
              rotate: 45,
              transition: { duration: 0.7, ease: 'easeOut' },
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Bottom left bracket */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key='bracket-bottom-left'
            className='absolute bottom-[25%] left-[18%] w-14 h-14 border-l-4 border-b-4 border-purple-400 rounded-bl-lg opacity-70'
            animate={{
              rotate: [0, -15, 0],
              scale: [1, 1.1, 1],
            }}
            exit={{
              x: -300,
              y: 300,
              opacity: 0,
              rotate: -45,
              transition: { duration: 0.9, ease: 'easeOut' },
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1.5,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Basketball top left */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key='basketball-top-left'
            className='absolute top-[35%] left-[5%] w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 opacity-80'
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            exit={{
              x: -200,
              y: -200,
              opacity: 0,
              scale: 0.5,
              transition: { duration: 0.6, ease: 'easeOut' },
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Basketball bottom right */}
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            key='basketball-bottom-right'
            className='absolute bottom-[30%] right-[8%] w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 opacity-80'
            animate={{
              y: [0, 15, 0],
              x: [0, -8, 0],
            }}
            exit={{
              x: 200,
              y: 200,
              opacity: 0,
              scale: 0.5,
              transition: { duration: 0.7, ease: 'easeOut' },
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.7,
            }}
          />
        ) : null}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode='wait'>
        {step === 0 ? (
          <motion.div
            key='welcome-content'
            className='absolute inset-0 flex flex-col items-center justify-center px-6'
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
              <motion.h1
                className='text-5xl md:text-7xl font-bold text-white mb-4'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Welcome to your
              </motion.h1>
              <motion.h1
                className='text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Bracket Wrap
              </motion.h1>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key='intro-content'
            className='absolute inset-0 flex flex-col items-center justify-center px-6'
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
              <motion.h2
                className='text-3xl md:text-4xl font-bold text-white mb-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Let's take a look at your bracket this year
              </motion.h2>
              <motion.p
                className='text-xl md:text-2xl text-gray-200'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                and see what it says about you
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
