import { NemesisBracketData } from '@/app/api/bracket-data'
import { useBracketSlides, useStory } from '@/components/providers'
import BracketOwnerCard from '@/components/story-slides/shared/BracketOwnerCard'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import StorySlide from '../../StorySlide'
import ShareButton from '../ShareButton'

const BracketNemesisSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  // Animation states
  const [showContent, setShowContent] = useState(false)
  const { data: teams } = useTeams()
  const { data } = bracketSlidesData!.wrapped.bracket.nemesisBracket!

  // Transition to content after the intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 3500) // Show intro text for 3.5 seconds

    return () => clearTimeout(timer)
  }, [])

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default behavior and stop propagation to prevent slide navigation
    e.preventDefault()
    e.stopPropagation()

    // Share options
    const shareOptions = {
      url: 'https://bracketwrap.com',
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
        bgColor={'bg-gradient-to-br from-indigo-900 to-violet-800'}
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
          {/* Radial gradient overlay for depth */}
          <div className='absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none' />

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
                  {/* Lightning flash effect */}
                  {/* <motion.div
                    className='absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0 opacity-0'
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.7, 0, 0.3, 0],
                      backgroundColor: [
                        'rgba(255,255,255,0)',
                        'rgba(255,255,255,0.7)',
                        'rgba(255,255,255,0)',
                        'rgba(255,255,255,0.3)',
                        'rgba(255,255,255,0)',
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3,
                      times: [0, 0.1, 0.3, 0.5, 1],
                    }}
                  /> */}

                  <motion.p
                    className='text-3xl font-black text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  >
                    We can't always
                  </motion.p>

                  <motion.p
                    className='text-3xl font-black text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
                  >
                    see eye to eye 👀
                  </motion.p>

                  {/* Versus slash lines */}
                  <motion.div className='relative w-full flex justify-center items-center mt-4 perspective-[1000px]'>
                    <motion.div
                      className='absolute h-1 w-16 bg-gradient-to-r from-red-500 to-orange-400 rounded-full rotate-[20deg] shadow-lg'
                      initial={{ x: -50, opacity: 0, scale: 0 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                        delay: 1.2,
                      }}
                    />
                    <motion.div
                      className='absolute h-1 w-16 bg-gradient-to-r from-red-500 to-orange-400 rounded-full -rotate-[20deg] shadow-lg'
                      initial={{ x: 50, opacity: 0, scale: 0 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                        delay: 1.4,
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className='flex flex-col items-center gap-2 mt-4'
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 30,
                      delay: 1.6,
                      duration: 0.8,
                    }}
                  >
                    <motion.p
                      className='text-xl font-bold text-center text-white leading-tight z-10 mt-8'
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.8,
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
                      Meet your bracket
                    </motion.p>

                    <motion.p
                      className='text-5xl font-black uppercase text-center text-white leading-tight tracking-wide rounded-lg bg-[#ff6b00] px-3 py-1 shadow-lg'
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 2.1,
                      }}
                      whileInView={{
                        boxShadow: [
                          '0 4px 6px rgba(0,0,0,0.1)',
                          '0 4px 16px rgba(255,107,0,0.6), 0 0 20px rgba(255, 0, 0, 0.4)',
                          '0 4px 6px rgba(0,0,0,0.1)',
                        ],
                      }}
                      viewport={{ once: true }}
                    >
                      Nemesis
                    </motion.p>
                  </motion.div>
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
                        title={<BracketNemesisTitle />}
                        showGroup
                        showBracket
                      >
                        <SimilaritySection nemesisData={data} />
                        <div className='mt-5 pb-3'>
                          <BracketOwnerCard
                            name={data.member.displayName}
                            bracketName={data.bracketName}
                            teamLogo={teams?.[data.nemesisWinnerId!]?.images?.primary}
                            delay={0.4}
                            teamBackground={false}
                          />
                        </div>
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

      {/* Shareable Content */}
      <ShareableContent
        shareableRef={shareableRef}
        backgroundGradient='linear-gradient(to bottom right, #5D3FD3, #FF6B00)'
      >
        <StoryCard title={<BracketNemesisTitle />} animated={false} showGroup showBracket>
          <SimilaritySection nemesisData={data} />
          <div className='mt-5 pb-3'>
            <BracketOwnerCard
              name={data.member.displayName}
              bracketName={data.bracketName}
              teamLogo={teams?.[data.nemesisWinnerId!]?.images?.primary}
              delay={0.4}
              teamBackground={false}
            />
          </div>
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Bracket Nemesis Title component
const BracketNemesisTitle = () => {
  return (
    <motion.div
      className='text-center'
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex justify-center gap-2'>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>My Nemesis</h2>
        <span className='text-3xl' role='img' aria-label='nemesis'>
          🐍
        </span>
      </div>
      <motion.div
        className='h-1 mx-auto mt-2 bg-[#FF6B00]'
        initial={{ width: 0 }}
        animate={{ width: '15rem' }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}

// Similarity section showing the match percentage
const SimilaritySection: React.FC<{ nemesisData: NemesisBracketData }> = ({ nemesisData }) => {
  return (
    <motion.div
      className='mb-1'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Similarity Percentage Card */}
      <motion.div
        className='flex items-end justify-center gap-2 mt-5'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className='flex items-center space-x-4 w-full'>
          <div className='flex flex-col items-start'>
            <div className='flex justify-end'>
              <motion.div
                className='text-5xl font-black text-white'
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {Math.round(nemesisData.weightedSimilarityPercentage)}
              </motion.div>
              <span className='text-3xl text-white font-extrabold'>%</span>
            </div>
            {/* <div className='flex flex-col mt-1'> */}
            {/* <p className='text-md text-white/60 uppercase tracking-wide font-extrabold leading-4'>
                Weighted
              </p> */}
            <p className='text-sm text-white/60 tracking-wide font-extrabold leading-4'>
              Similarity
            </p>
            {/* </div> */}
          </div>

          {/* Visual representation of matching picks */}
          <div className='w-full'>
            <div className='flex justify-between text-sm font-bold text-white/70 mb-1'>
              <span>Common Picks</span>
              <span>{63 - nemesisData.differentPicks} of 63</span>
            </div>
            <div className='w-full bg-white/10 h-2 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-madness-orange'
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.round(((63 - nemesisData.differentPicks) * 100) / 63)}%`,
                }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BracketNemesisSlide
