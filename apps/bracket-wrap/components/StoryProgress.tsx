'use client'

import { useEffect, useState } from 'react'
import { useStory } from './providers'

export default function StoryProgress() {
  const { currentSlide, totalSlides } = useStory()

  const [init, setInit] = useState(false)
  const [animationWidths, setAnimationWidths] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    // Initial setup
    if (!init) {
      setTimeout(() => {
        setInit(true)
        setAnimationWidths({ [currentSlide]: '100%' })
      }, 100)
      return
    }

    // Reset animation for the current slide
    setAnimationWidths(prev => {
      const newWidths = { ...prev }
      // First set width to 0% (without transition)
      newWidths[currentSlide] = '0%'
      return newWidths
    })

    // Then trigger the animation after a small delay
    const timer = setTimeout(() => {
      setAnimationWidths(prev => {
        const newWidths = { ...prev }
        newWidths[currentSlide] = '100%'
        return newWidths
      })
    }, 50)

    return () => clearTimeout(timer)
  }, [currentSlide, init])

  return (
    <div className='fixed top-0 left-0 right-0 z-10 flex gap-1 p-2'>
      {Array.from({ length: totalSlides }).map((_, index) => {
        // Slide is active if it's before or equal to the current slide
        const isActive = index <= currentSlide

        return (
          <div key={index} className={`h-1.5 rounded-full flex-1 bg-gray-600`}>
            <div
              className={`h-full rounded-full ${isActive ? 'bg-white' : ''}`}
              style={{
                width: (() => {
                  if (!init) return '0%'
                  if (index === currentSlide) return animationWidths[index] || '0%'
                  if (index < currentSlide) return '100%'
                  return '0%'
                })(),
                transition: index === currentSlide ? 'width 2s linear' : 'none',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
