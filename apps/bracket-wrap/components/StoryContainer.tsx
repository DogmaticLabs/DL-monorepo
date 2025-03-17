'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useStoryNavigation } from '../hooks/useStoryNavigation'
import { useStory } from './providers'
import StoryProgress from './StoryProgress'

interface StoryContainerProps {
  children: React.ReactNode
}

export default function StoryContainer({ children }: StoryContainerProps) {
  const { currentSlide } = useStory()

  useStoryNavigation()

  // Convert children to array to access by index
  const slides = React.Children.toArray(children)

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    // You can implement close functionality here
    // For example, redirect to home page or show a confirmation dialog
    console.log('Close button clicked')
  }

  const handleVolume = (e: React.MouseEvent) => {
    e.stopPropagation()
    // You can implement volume control functionality here
    console.log('Volume button clicked')
  }

  return (
    <div className='relative w-full flex flex-col min-h-svh'>
      <StoryProgress />

      {/* Top controls bar */}
      <StoryControls handleVolume={handleVolume} handleClose={handleClose} />

      {slides[currentSlide]}
    </div>
  )
}

function StoryControls({
  handleVolume,
  handleClose,
}: {
  handleVolume: (e: React.MouseEvent) => void
  handleClose: (e: React.MouseEvent) => void
}) {
  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPaused(!isPaused)
  }
  const [isPaused, setIsPaused] = useState(false)
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
