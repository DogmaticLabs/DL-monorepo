'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'
import { createContext, ReactNode, useContext, useState } from 'react'

type StoryContextType = {
  currentSlide: number
  totalSlides: number
  nextSlide: () => void
  prevSlide: () => void
  goToSlide: (index: number) => void
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  )
}

export function StoryProvider({
  children,
  totalSlides = 5,
}: {
  children: ReactNode
  totalSlides?: number
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index)
    }
  }

  return (
    <StoryContext.Provider value={{ currentSlide, totalSlides, nextSlide, prevSlide, goToSlide }}>
      {children}
    </StoryContext.Provider>
  )
}

export const useStory = () => {
  const context = useContext(StoryContext)
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider')
  }
  return context
}
