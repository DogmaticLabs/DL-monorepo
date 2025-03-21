'use client'

import { X } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useStoryNavigation } from '../hooks/useStoryNavigation'
import { useStory } from './providers'
import StoryProgress from './StoryProgress'

interface StoryContainerProps {
  children: React.ReactNode
}

export default function StoryContainer({ children }: StoryContainerProps) {
  const { currentSlide } = useStory()
  const router = useRouter()
  useStoryNavigation()

  // Convert children to array to access by index
  const slides = React.Children.toArray(children)

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push('/')
  }

  return (
    <div className='relative w-full flex flex-col min-h-svh'>
      {/* Background */}
      <StoryBackground />

      {/* Progress */}
      <StoryProgress />

      {/* Top controls bar */}
      <StoryControls handleClose={handleClose} />

      {slides[currentSlide]}
    </div>
  )
}

function StoryControls({ handleClose }: { handleClose: (e: React.MouseEvent) => void }) {
  return (
    <div className='fixed top-2 left-0 right-0 z-20 p-4 flex justify-between items-center'>
      {/* Logo */}
      <Image
        src='/logo.png'
        alt='BracketWrap Logo'
        width={64}
        height={64}
        className='size-16 object-contain'
      />

      {/* Controls */}
      <div className='flex items-center gap-4'>
        {/* Close button */}
        <button
          onClick={handleClose}
          className='w-10 h-10 flex items-center justify-center text-white'
          aria-label='Close'
        >
          <X />
        </button>
      </div>
    </div>
  )
}

const StoryBackground = () => {
  return (
    <div className='absolute inset-0 w-full h-full pt-8'>
      {/* Bracket SVG with masked center for the logo */}
      <motion.div
        className='absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          maskImage:
            'radial-gradient(circle at center, transparent 0%, transparent 60px, black 120px)',
          WebkitMaskImage:
            'radial-gradient(circle at center, transparent 0%, transparent 60px, black 120px)',
        }}
      >
        <motion.div
          className='absolute inset-0 bg-[url("/bracket.svg")] bg-no-repeat animate-bracket-pulse'
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          style={{
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            filter: 'invert(0.8) brightness(0.8) sepia(0.5) hue-rotate(170deg) saturate(4)',
            mixBlendMode: 'screen',
          }}
        />
      </motion.div>

      {/* Logo centered on the bracket - now visible through the "hole" */}
      <motion.div
        className='absolute inset-0 flex items-center justify-center pointer-events-none'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className='relative w-[200px] h-[200px] flex items-center justify-center'
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
          style={{
            filter: 'brightness(1) contrast(1)',
          }}
        >
          <Image
            src='/logo.png'
            alt='Bracket Wrap Logo'
            className='size-[200px] object-contain opacity-20'
            width={200}
            height={200}
            style={{
              mixBlendMode: 'soft-light',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Add a radial gradient to the center of the bracket */}
      <motion.div
        className='absolute inset-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(circle at center, rgba(40,40,40,0.5) 5%, rgba(0,0,0,0) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
