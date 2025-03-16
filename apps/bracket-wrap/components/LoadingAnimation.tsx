'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface LoadingAnimationProps {
  onComplete: () => void
}

const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [loadingStep, setLoadingStep] = useState(0)

  // Loading animation text sequence
  const loadingMessages = [
    'Pulling your bracket data...',
    'Checking out your picks...',
    'Seeing how you stack up...',
    // 'Finding your bracket twin...',
    'Almost there...',
  ]

  // Handle loading animation steps
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Progress through loading messages
    if (loadingStep < loadingMessages.length - 1) {
      const timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1)
      }, 1500)
      timers.push(timer)
    } else {
      // Final step - complete
      const completeTimer = setTimeout(() => {
        onComplete()
      }, 2000)
      timers.push(completeTimer)
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [loadingStep, onComplete])

  return (
    <motion.div
      className='fixed inset-0 z-50 flex flex-col items-center justify-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated bracket shapes for decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Top left bracket */}
        <motion.div
          className='absolute top-[15%] left-[10%] w-16 h-16 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg opacity-70'
          animate={{
            rotate: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        {/* Bottom right bracket */}
        <motion.div
          className='absolute bottom-[20%] right-[15%] w-20 h-20 border-r-4 border-b-4 border-orange-500 rounded-br-lg opacity-70'
          animate={{
            rotate: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.5,
          }}
        />
        {/* Top right bracket */}
        <motion.div
          className='absolute top-[25%] right-[12%] w-12 h-12 border-r-4 border-t-4 border-pink-400 rounded-tr-lg opacity-70'
          animate={{
            rotate: [0, -15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 1.2,
          }}
        />
        {/* Basketball decorations */}
        <motion.div
          className='absolute top-[40%] right-[20%] w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 opacity-80'
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className='absolute bottom-[35%] left-[15%] w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 opacity-80'
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.7,
          }}
        />
      </div>

      {/* Loading spinner */}
      <motion.div
        className='mb-12'
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          },
        }}
      >
        <div className='w-16 h-16 border-4 border-t-orange-500 border-r-yellow-400 border-b-purple-500 border-l-blue-500 rounded-full' />
      </motion.div>

      {/* Loading message with AnimatePresence to prevent flickering */}
      <div className='relative h-16 flex items-center justify-center w-4/5'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={loadingStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className='text-center px-6 absolute'
          >
            <h2 className='text-2xl md:text-3xl font-bold text-white'>
              {loadingMessages[loadingStep]}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default LoadingAnimation
