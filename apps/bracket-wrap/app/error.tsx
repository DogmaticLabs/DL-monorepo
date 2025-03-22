'use client'

import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

// This component is a global error boundary for the Next.js app. It displays an error message and provides a button to go back home.
// It receives 'error' and 'reset' props as per Next.js app error handling convention.

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Error caught in error boundary:', error)
  }, [error])

  return (
    <motion.div
      className='relative container mx-auto max-w-md inset-0 z-[-1] flex flex-col min-h-[100dvh] items-center justify-center'
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='px-4 py-8 max-w-md w-full'>
        {/* Logo */}
        <div className='flex justify-center mb-6'>
          <Image src='/logo.png' alt='BracketWrap Logo' width={160} height={160} />
        </div>

        {/* Error content */}
        <div className='bg-[#2d3a4f] rounded-xl p-6 space-y-4 border border-[#3d4a61]'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-white mb-2'>Something went wrong</h1>
            <p className='text-[#94a3b8] text-base'>
              {error.message || 'An unexpected error has occurred'}
            </p>
          </div>

          <div className='flex flex-col space-y-3 pt-2'>
            <button
              onClick={() => reset()}
              className='w-full bg-[#3d4a61] hover:bg-[#4d5a71] text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200'
            >
              Try again
            </button>

            <Link href='/' className='w-full'>
              <button className='w-full bg-[#ff6b35] hover:bg-[#ff5a1f] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center'>
                <ArrowLeft className='h-5 w-5 mr-2' />
                <span>Go Home</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
