'use client'

import { BracketSlidesData } from '@/app/api/bracket-data'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'
import { createContext, ReactNode, useContext, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
})

type StoryContextType = {
  currentSlide: number
  totalSlides: number
  nextSlide: () => void
  prevSlide: () => void
  goToSlide: (index: number) => void
  isExiting: boolean
  triggerNextSlide: () => void
}

const StoryContext = createContext<StoryContextType | undefined>(undefined)

// Create a context for search params
type SearchParamsContextType = {
  params: Record<string, string>
}

const SearchParamsContext = createContext<SearchParamsContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>
        <BracketSlidesProvider>{children}</BracketSlidesProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  )
}

export function SearchParamsProvider({
  children,
  params,
}: {
  children: ReactNode
  params: Record<string, string>
}) {
  return <SearchParamsContext.Provider value={{ params }}>{children}</SearchParamsContext.Provider>
}

type BracketSlidesContextType = {
  bracketSlidesData: BracketSlidesData | undefined
  setBracketSlidesData: (bracketSlidesData: BracketSlidesData) => void
}

const BracketSlidesContext = createContext<BracketSlidesContextType | undefined>(undefined)

export function BracketSlidesProvider({ children }: { children: ReactNode }) {
  const [bracketSlidesData, setBracketSlidesData] = useState<BracketSlidesData>()

  return (
    <BracketSlidesContext.Provider value={{ bracketSlidesData, setBracketSlidesData }}>
      {children}
    </BracketSlidesContext.Provider>
  )
}

export const useBracketSlides = (): [
  BracketSlidesData | undefined,
  (bracketSlidesData: BracketSlidesData) => void,
] => {
  const context = useContext(BracketSlidesContext)
  if (context === undefined) {
    throw new Error('useBracketSlides must be used within a BracketSlidesProvider')
  }
  return [context.bracketSlidesData, context.setBracketSlidesData]
}

export function StoryProvider({ children }: { children: ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const totalSlides = 12

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

  // New function to handle exit animation before changing slides
  const triggerNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setIsExiting(true)
      // Wait for exit animation to complete before changing slides
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
        setIsExiting(false)
      }, 500) // Match this with your exit animation duration
    }
  }

  return (
    <StoryContext.Provider
      value={{
        currentSlide,
        totalSlides,
        nextSlide,
        prevSlide,
        goToSlide,
        isExiting,
        triggerNextSlide,
      }}
    >
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

export const useSearchParams = () => {
  const context = useContext(SearchParamsContext)
  if (context === undefined) {
    throw new Error('useSearchParams must be used within a SearchParamsProvider')
  }
  return context.params
}
