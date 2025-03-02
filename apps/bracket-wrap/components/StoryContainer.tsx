'use client'

import { BotIcon, PauseIcon, PlayIcon, VolumeIcon, X } from 'lucide-react'
import React, { useState } from 'react'
import { useStoryNavigation } from '../hooks/useStoryNavigation'
import { useStory } from './providers'
import StoryProgress from './StoryProgress'

interface StoryContainerProps {
  children: React.ReactNode
  logoSrc?: string
}

export default function StoryContainer({
  children,
  logoSrc = '/spotify-logo.png',
}: StoryContainerProps) {
  const { currentSlide, nextSlide, prevSlide } = useStory()
  const [isPaused, setIsPaused] = useState(false)
  useStoryNavigation()

  // Convert children to array to access by index
  const slides = React.Children.toArray(children)

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPaused(!isPaused)
  }

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
    <div className='relative w-full h-full min-h-svh overflow-hidden flex flex-col'>
      <StoryProgress />

      {/* Top controls bar */}
      <div className='absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center'>
        {/* Logo */}
        <div className='w-10 h-10 rounded-full flex items-center justify-center'>
          <BotIcon />
        </div>

        {/* Controls */}
        <div className='flex items-center gap-4'>
          {/* Pause/Play button */}
          <button
            onClick={togglePause}
            className='w-10 h-10 flex items-center justify-center text-white'
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>

          {/* Volume button */}
          <button
            onClick={handleVolume}
            className='w-10 h-10 flex items-center justify-center text-white'
            aria-label='Volume'
          >
            <VolumeIcon />
          </button>

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

      <div className='w-full flex-1 flex items-center justify-center'>{slides[currentSlide]}</div>
    </div>
  )
}
