'use client'

import { useEffect, useRef } from 'react'
import { useStory } from '../components/providers'

export function useStoryNavigation() {
  const { nextSlide, prevSlide } = useStory()
  const startXRef = useRef<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0]?.clientX ?? null
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (startXRef.current === null) return

      const endX = e.changedTouches[0]?.clientX
      if (!endX) return
      const diff = endX - startXRef.current

      // Swipe threshold
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          prevSlide()
        } else {
          nextSlide()
        }
      }

      startXRef.current = null
    }

    const handleClick = (e: MouseEvent) => {
      // Get the width of the screen
      const screenWidth = window.innerWidth
      // Determine if click was on left or right half
      if (e.clientX < screenWidth / 2) {
        prevSlide()
      } else {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('click', handleClick)
    }
  }, [nextSlide, prevSlide])
}
