'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'
import { createContext, ReactNode, useContext, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

type StoryContextType = {
  currentSlide: number
  totalSlides: number
  nextSlide: () => void
  prevSlide: () => void
  goToSlide: (index: number) => void
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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

export const useSearchParams = () => {
  const context = useContext(SearchParamsContext)
  if (context === undefined) {
    throw new Error('useSearchParams must be used within a SearchParamsProvider')
  }
  return context.params
}
