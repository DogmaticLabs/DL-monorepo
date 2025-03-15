'use client'

import { useEffect, useRef, useState } from 'react'
import { useStory } from '../components/providers'

export function useStoryNavigation() {
  const { nextSlide, prevSlide, triggerNextSlide, currentSlide, totalSlides } = useStory()
  const startXRef = useRef<number | null>(null)
  // Track if the current slide is fully loaded (animation progress at 100%)
  const [isSlideFullyLoaded, setIsSlideFullyLoaded] = useState(false)

  // Set a timer to mark the slide as fully loaded after the animation duration
  useEffect(() => {
    // Reset the loaded state when slide changes
    setIsSlideFullyLoaded(false)

    // After 4 seconds (matching the animation duration in StoryProgress),
    // consider the slide fully loaded
    const loadTimer = setTimeout(() => {
      setIsSlideFullyLoaded(true)
    }, 4000) // Match this with the animation duration in StoryProgress

    return () => clearTimeout(loadTimer)
  }, [currentSlide])

  // Helper function to handle next slide navigation
  const handleNextSlide = () => {
    // Only use triggerNextSlide if:
    // 1. The slide is fully loaded
    // 2. We're not on the last slide
    if (isSlideFullyLoaded && currentSlide < totalSlides - 1) {
      // Use triggerNextSlide to enable exit animations
      triggerNextSlide()
    } else {
      // If slide is not fully loaded or we're on the last slide,
      // just go to next slide without exit animations
      nextSlide()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextSlide()
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
          handleNextSlide()
        }
      }

      startXRef.current = null
    }

    const handleClick = (e: MouseEvent) => {
      // Skip navigation if the click is on an interactive element
      const target = e.target as HTMLElement

      // Check if the click target or any of its parents are interactive elements
      const isInteractive = (element: HTMLElement | null): boolean => {
        if (!element) return false

        // Check if the element is an interactive element
        const interactiveElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL']
        if (interactiveElements.includes(element.tagName)) return true

        // Check for elements with click handlers (data-attribute or role)
        if (
          element.hasAttribute('role') ||
          element.hasAttribute('data-click') ||
          element.hasAttribute('onClick') ||
          element.onclick !== null
        ) {
          return true
        }

        // Check if the element has a click event listener
        if (
          element.classList.contains('group-hover') ||
          element.classList.contains('hover') ||
          element.classList.contains('cursor-pointer')
        ) {
          return true
        }

        // If we're at the document body, stop checking
        if (element === document.body) return false

        // Check parent element
        return isInteractive(element.parentElement)
      }

      // If the click is on an interactive element, don't navigate
      if (isInteractive(target)) {
        return
      }

      // Get the width of the screen
      const screenWidth = window.innerWidth
      // Determine if click was on left or right half
      if (e.clientX < screenWidth / 2) {
        prevSlide()
      } else {
        handleNextSlide()
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
  }, [nextSlide, prevSlide, triggerNextSlide, isSlideFullyLoaded, currentSlide, totalSlides])
}
