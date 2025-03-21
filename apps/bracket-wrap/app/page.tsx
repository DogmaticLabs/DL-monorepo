'use client'

import LandingPage from '@/components/LandingPage'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { SearchParamsProvider } from '../components/providers'
import './globals.css'

export default function Page({ searchParams }: { searchParams: Promise<{ mode: string }> }) {
  const unwrappedParams = use(searchParams)
  // const [pageState, setPageState] = useState<PageState>(PageState.IntroSequence)
  const router = useRouter()

  const onComplete = () => {
    // Get current search params and preserve them
    const searchParams = new URLSearchParams(window.location.search)
    const searchString = searchParams.toString()

    // Navigate with preserved search params
    const destination = searchString ? `/wrapped?${searchString}` : '/wrapped'
    router.push(destination)
  }

  return (
    <SearchParamsProvider params={unwrappedParams}>
      <div id='app-content' className='relative w-full flex flex-col bg-[#1e293b]'>
        <AnimatePresence mode='wait'>
          <motion.div
            key='landing-page'
            className='flex-1 flex items-center justify-center z-10'
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onComplete={onComplete} />
          </motion.div>
        </AnimatePresence>
      </div>
    </SearchParamsProvider>
  )
}
