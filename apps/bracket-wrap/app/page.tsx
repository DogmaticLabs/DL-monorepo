'use client'

import IntroSequence from '@/components/IntroSequence'
import LandingPage from '@/components/LandingPage'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { SearchParamsProvider } from '../components/providers'
import './globals.css'
import PageState from './page-state'

export default function Page({ searchParams }: { searchParams: Promise<{ mode: string }> }) {
  const unwrappedParams = use(searchParams)
  const [pageState, setPageState] = useState<PageState>(PageState.LandingPage)
  const router = useRouter()

  // Handle navigation to /wrapped when StorySequence state is set
  useEffect(() => {
    if (pageState === PageState.StorySequence) {
      // Get current search params and preserve them
      const searchParams = new URLSearchParams(window.location.search)
      const searchString = searchParams.toString()

      // Navigate with preserved search params
      const destination = searchString ? `/wrapped?${searchString}` : '/wrapped'
      router.push(destination)
    }
  }, [pageState, router])

  return (
    <SearchParamsProvider params={unwrappedParams}>
      <div id='app-content' className='relative w-full flex flex-col bg-[#1e293b]'>
        <AnimatePresence mode='wait'>
          {pageState === PageState.LandingPage && (
            // Landing page with MainStorySlide
            <motion.div
              key='landing-page'
              className='flex-1 flex items-center justify-center z-10'
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onComplete={() => setPageState(PageState.IntroSequence)} />
            </motion.div>
          )}

          {[PageState.LoadingSequence, PageState.IntroSequence].includes(pageState) && (
            <div className='w-full h-dvh'>
              {pageState === PageState.IntroSequence && (
                <motion.div
                  key='intro-sequence'
                  className='absolute inset-0 z-20'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <IntroSequence onComplete={() => setPageState(PageState.StorySequence)} />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </SearchParamsProvider>
  )
}
