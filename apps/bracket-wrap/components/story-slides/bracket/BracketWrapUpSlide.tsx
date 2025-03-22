import { useBracketSlides, useStory } from '@/components/providers'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { HomeIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'
import ShareButton from '../ShareButton'

const BracketWrapUpSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get shareId for sharing functionality
  const shareId =
    bracketSlidesData?.wrapped.bracket.finalFourPicksNational?.shareId ||
    bracketSlidesData?.wrapped.bracket.chalkScore?.shareId ||
    bracketSlidesData?.info.bracket?.data.id

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const shareOptions = {
      url: `https://bracketwrap.com/share/${shareId}`,
    }

    try {
      await shareContent(shareOptions)
    } catch (error) {
      console.error('Error sharing content:', error)
      alert('There was an error sharing the content. Please try again.')
    }
  }

  // Handle navigation to home while preserving group_id if present
  const handleHomeNavigation = () => {
    const groupId = searchParams.get('group_id')
    if (groupId) {
      window.location.href = `/?group_id=${groupId}`
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className='w-full h-dvh overflow-hidden'>
      <StorySlide bgColor='bg-gradient-to-br from-purple-950 to-blue-950'>
        <div className='relative flex flex-col w-full h-full overflow-hidden'>
          {/* Radial gradient overlay for depth */}
          <div className='absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none' />

          {/* Content container with padding */}
          <div className='flex flex-col items-center justify-center w-full flex-1 p-6'>
            <motion.div
              className='w-full max-w-md mx-auto text-center'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <motion.div
                className='-mb-8 flex justify-center'
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className='relative w-52 h-52'>
                  <Image
                    src='/logo.png'
                    alt='Bracket Wrap Logo'
                    width={250}
                    height={250}
                    className='object-contain drop-shadow-lg'
                    priority
                  />
                </div>
              </motion.div>

              {/* Thank you message */}
              <motion.div
                className='mb-10'
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className='text-4xl font-black text-white tracking-tight leading-tight mb-3'>
                  Thanks for viewing your
                  <span className='text-madness-orange'> Bracket Wrap</span>
                </h2>
                <p className='text-lg text-white/80 font-semibold'>
                  We hope you enjoy your March Madness experience!
                </p>
              </motion.div>

              <div className='flex justify-center items-center space-x-4'>
                {/* Navigation buttons */}
                <motion.div
                  className='flex flex-col sm:flex-row justify-center'
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <button
                    onClick={handleHomeNavigation}
                    className='bg-white text-blue-950 font-bold text-lg px-6 py-[10px] rounded-full shadow-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2'
                  >
                    <HomeIcon />
                    Home
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  onClick={e => e.stopPropagation()}
                  className='flex justify-center'
                >
                  <ShareButton
                    isSharing={isSharing}
                    handleShare={handleShare}
                    className='!mt-0 opacity-100 bg-opacity-100 bg-madness-blue'
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </StorySlide>
    </div>
  )
}

export default BracketWrapUpSlide
