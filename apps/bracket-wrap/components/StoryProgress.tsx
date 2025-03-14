'use client'

import { useEffect, useState } from 'react'
import { useStory } from './providers'

export default function StoryProgress() {
  const { currentSlide, totalSlides } = useStory()

  const [init, setInit] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  // Reset and start animation whenever the current slide changes
  useEffect(() => {
    // Initial setup
    if (!init) {
      setAnimationProgress(0) // Start at 0% instead of immediately setting to 100%

      setTimeout(() => {
        setInit(true)
        setIsAnimating(true) // Enable animation for initial load
        setAnimationProgress(100)
      }, 100)
      return
    }

    // Reset animation
    setAnimationProgress(0)
    setIsAnimating(false)

    // Small delay before starting animation
    const startTimer = setTimeout(() => {
      setIsAnimating(true)
      setAnimationProgress(100)
    }, 50)

    return () => clearTimeout(startTimer)
  }, [currentSlide, init])

  return (
    <div className='fixed top-0 left-0 right-0 z-10 flex gap-1 p-2'>
      {Array.from({ length: totalSlides }).map((_, index) => {
        // Slide is active if it's before the current slide
        // or if it's the current slide with animation progress
        const isBeforeCurrent = index < currentSlide
        const isCurrent = index === currentSlide

        return (
          <div key={index} className={`h-1.5 rounded-full flex-1 bg-gray-600`}>
            <div
              className={`h-full rounded-full bg-white`}
              style={{
                width: (() => {
                  if (!init) return '0%'
                  if (isBeforeCurrent) return '100%'
                  if (isCurrent) return `${animationProgress}%`
                  return '0%'
                })(),
                transition: isCurrent && isAnimating ? 'width 4s linear' : 'none',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
