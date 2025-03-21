import { useBracketSlides, useStory } from '@/components/providers'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'
import TeamInfo from '../shared/TeamInfo'

const BracketCinderellaSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  const { data, shareId } = bracketSlidesData!.wrapped.bracket.cinderella
  const team = teams![data.teams[0]!.teamId!]!

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 3500) // Show content after 4 seconds, matching the GroupTopPicksSlide timing

      return () => clearTimeout(timer)
    }
  }, [showContent])

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default behavior and stop propagation to prevent slide navigation
    e.preventDefault()
    e.stopPropagation()

    // Share options
    const shareOptions = {
      url: `https://bracketwrap.com/share/${shareId}`,
    }

    try {
      if (shareableRef.current) {
        await shareContent(
          { current: shareableRef.current } as React.RefObject<HTMLElement>,
          shareOptions,
        )
      }
    } catch (error) {
      console.error('Error sharing content:', error)
      alert('There was an error sharing the content. Please try again.')
    }
  }

  // Define exit animations for content
  const contentExitAnimation = {
    opacity: 0,
    y: -100,
    scale: 0.8,
    transition: { duration: 0.4, ease: 'easeOut' },
  }

  return (
    <div className='w-full h-dvh overflow-hidden'>
      <StorySlide
        footer={
          showContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onClick={e => e.stopPropagation()}
              className='flex justify-center mt-3'
            >
              <ShareButton isSharing={isSharing} handleShare={handleShare} />
            </motion.div>
          ) : null
        }
      >
        <div className='relative flex flex-col w-full h-full overflow-hidden'>
          {/* Content container with padding */}
          <div className='flex flex-col items-center justify-center gap-6 w-full px-8 py-6 flex-1'>
            <AnimatePresence mode='wait'>
              {!showContent ? (
                <motion.div
                  key='intro'
                  className='flex flex-col items-center justify-center h-full relative'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {/* Animated sparkles */}
                  <motion.div
                    className='absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-white/80 blur-[1px] z-0'
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      y: [0, -15, -30],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: 1,
                      repeatType: 'loop',
                      times: [0, 0.5, 1],
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className='absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-white/80 blur-[1px] z-0'
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      y: [0, -15, -30],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: 1,
                      repeatType: 'loop',
                      times: [0, 0.5, 1],
                      delay: 0.8,
                    }}
                  />

                  <motion.p
                    className='text-3xl font-black text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  >
                    In your bracket
                  </motion.p>

                  <motion.p
                    className='text-3xl font-black text-center text-white leading-tight tracking-wide relative z-10 mt-2'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
                  >
                    we found a story worth telling
                  </motion.p>

                  {/* Clock animation - midnight */}
                  <motion.div
                    className='relative mt-4 mb-2 flex items-center justify-center bg-madness-orange rounded-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <motion.div
                      className='flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/70'
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 1.3 }}
                    >
                      <motion.div
                        className='absolute h-5 w-[2px] bg-white origin-bottom'
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          delay: 1.4,
                          ease: 'easeInOut',
                        }}
                        style={{ transformOrigin: 'center bottom' }}
                      />
                      <motion.div
                        className='absolute h-4 w-[2px] bg-white origin-bottom'
                        initial={{ rotate: -90 }}
                        animate={{ rotate: 270 }}
                        transition={{
                          duration: 2,
                          delay: 1.4,
                          ease: 'easeInOut',
                        }}
                        style={{ transformOrigin: 'center bottom' }}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.p
                    className='text-xl font-bold text-center text-white leading-tight z-10 mt-8'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 2.4,
                      ease: 'easeOut',
                    }}
                    whileInView={{
                      textShadow: [
                        '0px 0px 0px rgba(255,255,255,0)',
                        '0px 0px 8px rgba(255,255,255,0.5)',
                        '0px 0px 0px rgba(255,255,255,0)',
                      ],
                    }}
                    viewport={{ once: true }}
                  >
                    See your Cinderella pick ✨
                  </motion.p>
                </motion.div>
              ) : (
                <AnimatePresence mode='wait'>
                  {!isExiting ? (
                    <motion.div
                      key='content'
                      className='w-full max-w-md mx-auto'
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={contentExitAnimation}
                      transition={{ duration: 0.5 }}
                    >
                      <StoryCard
                        cardRef={cardRef}
                        title={<CinderellaTitle />}
                        showGroup
                        showBracket
                      >
                        <TeamInfo team={team} tags={[data.round.name]} className='mb-6 mt-8' />
                      </StoryCard>
                    </motion.div>
                  ) : (
                    <motion.div
                      key='content-exiting'
                      className='w-full'
                      initial={{ opacity: 1 }}
                      animate={contentExitAnimation}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      {/* Content is exiting - this is a placeholder that will animate out */}
                      <div className='opacity-0'>Content exiting</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </AnimatePresence>
          </div>
        </div>
      </StorySlide>

      <ShareableContent
        shareableRef={shareableRef}
        backgroundGradient='linear-gradient(to bottom right, #a855f3, #6366f1)'
      >
        <StoryCard title={<CinderellaTitle />} animated={false} showGroup showBracket>
          <TeamInfo team={team} tags={[data.round.name]} className='pb-6 pt-8' />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Reusable Title component
const CinderellaTitle: React.FC = () => {
  return (
    <motion.div
      className='text-center'
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex justify-center gap-2'>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
          My Cinderella
        </h2>
        <span className='text-3xl' role='img' aria-label='trophy'>
          👸
        </span>
      </div>
      <motion.div
        className='h-1 bg-cinderella mx-auto mt-2 bg-madness-orange'
        initial={{ width: 0 }}
        animate={{ width: '17rem' }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}

export default BracketCinderellaSlide
