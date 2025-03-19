import { Team } from '@/app/api/bracket-data'
import { useBracketSlides, useStory } from '@/components/providers'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { cn } from '@workspace/ui/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'

interface GroupFinalFourSlideProps {
  groupId?: string
}

const GroupFinalFourSlide = ({ groupId }: GroupFinalFourSlideProps) => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()
  const { data: teams } = useTeams()

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Placeholder data - would be replaced with actual data in production
  const finalFourData = [
    {
      percentage: 87,
      ...Object.values(teams ?? {})[Math.floor(Math.random() * Object.values(teams ?? {}).length)],
    },
    {
      percentage: 75,
      ...Object.values(teams ?? {})[Math.floor(Math.random() * Object.values(teams ?? {}).length)],
    },
    {
      percentage: 62,
      ...Object.values(teams ?? {})[Math.floor(Math.random() * Object.values(teams ?? {}).length)],
    },
    {
      percentage: 54,
      ...Object.values(teams ?? {})[Math.floor(Math.random() * Object.values(teams ?? {}).length)],
    },
  ]

  // Stub data for group info
  const groupInfo = {
    name: 'Cantonsville',
    memberCount: 24,
    uniqueFinalFourTeams: 12,
  }

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 4000) // Show content after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [showContent])

  // Define exit animations for content
  const contentExitAnimation = {
    opacity: 0,
    y: -80,
    scale: 0.8,
    transition: { duration: 0.4, ease: 'easeOut' },
  }

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const shareOptions = {
      title: 'Final Four Picks',
      text: `Check out my group's most popular Final Four picks!`,
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

  return (
    <div className='w-full h-dvh overflow-hidden'>
      <StorySlide
        bgColor='bg-gradient-to-br from-purple-900 to-blue-900'
        footer={
          showContent && !isExiting ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.0 }}
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
          <div className='flex flex-col items-center justify-center w-full flex-1 p-6'>
            <AnimatePresence mode='wait'>
              {!showContent ? (
                <motion.div
                  key='intro'
                  className='flex flex-col items-center justify-center h-full relative'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {/* Decorative basketball lines in background */}
                  <motion.div
                    className='absolute w-40 h-40 rounded-full border-2 border-dashed border-white/20 z-0'
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: [0, 0.4, 0.4, 0],
                      scale: [0.5, 1.5, 1.5, 2],
                      rotate: [0, 90, 180, 270],
                    }}
                    transition={{
                      duration: 6,
                      times: [0, 0.3, 0.7, 1],
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                  />

                  <motion.div
                    className='flex flex-col items-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* First line appearing with a reveal from left to right */}
                    <div className='overflow-hidden'>
                      <motion.p
                        className='text-3xl font-black text-center text-white leading-tight tracking-wide relative z-10'
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.2,
                        }}
                      >
                        Your group selected
                      </motion.p>
                    </div>

                    {/* Number with highlight effect */}
                    <motion.div
                      className='relative mt-6 mb-4'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      {/* Moving highlight effect */}
                      <motion.div
                        className='absolute -inset-4 bg-gradient-to-r from-purple-500/0 via-white/30 to-blue-500/0 rounded-xl z-0 blur-md'
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          ease: 'easeInOut',
                          delay: 1,
                          repeat: 2,
                          repeatType: 'mirror',
                        }}
                      />

                      <motion.div
                        className='relative'
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          damping: 12,
                          stiffness: 100,
                          delay: 0.9,
                        }}
                      >
                        <motion.p
                          className='text-5xl font-black uppercase text-center text-white leading-tight tracking-wide rounded-lg bg-[#ff6b00] px-5 py-2 shadow-lg relative z-10'
                          animate={{
                            y: [0, -3, 0, -3, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 1.2,
                            ease: 'easeInOut',
                          }}
                        >
                          {groupInfo.uniqueFinalFourTeams}
                        </motion.p>
                      </motion.div>
                    </motion.div>

                    {/* Second text line with fade-slide reveal */}
                    <div className='overflow-hidden'>
                      <motion.p
                        className='text-3xl text-center text-white leading-tight font-black z-10'
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 1.5,
                          ease: 'easeOut',
                        }}
                      >
                        different teams in the Final Four
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Final prompt with staggered letter reveal */}
                  <motion.div
                    className='mt-[80px] relative z-10 flex items-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 2.2 }}
                  >
                    <motion.p
                      className='text-xl font-bold text-center text-white'
                      initial={{ opacity: 0.6, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 0.6, delay: 2.3 }}
                    >
                      Here are the most common selections
                    </motion.p>

                    <motion.div
                      className='ml-2 relative'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.8 }}
                    >
                      <motion.div
                        className='absolute -inset-1 bg-orange-500/40 rounded-full blur-sm'
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: 'mirror',
                        }}
                      />
                      <motion.span
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{
                          type: 'spring',
                          damping: 5,
                          stiffness: 100,
                          delay: 2.8,
                        }}
                      >
                        🏀
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ) : (
                <AnimatePresence mode='wait'>
                  {!isExiting ? (
                    <motion.div
                      key='content'
                      className='w-full max-w-md mx-auto'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={contentExitAnimation}
                      transition={{ duration: 0.5 }}
                    >
                      <StoryCard cardRef={cardRef} title={<FinalFourTitle />}>
                        <FinalFourGrid teams={finalFourData as (Team & { percentage: number })[]} />
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
        backgroundGradient='linear-gradient(to bottom right, #4C1D95, #1E3A8A)'
      >
        <StoryCard animated={false} title={<FinalFourTitle />}>
          <FinalFourGrid teams={finalFourData as (Team & { percentage: number })[]} />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Title component for Final Four
const FinalFourTitle = () => {
  return (
    <motion.div
      className='text-center mb-4'
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex justify-center gap-2'>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>Final Four</h2>
        <span className='text-3xl' role='img' aria-label='basketball'>
          4️⃣
        </span>
      </div>
      <motion.div
        className='h-1 bg-madness-orange mx-auto mt-4'
        initial={{ width: 0 }}
        animate={{ width: '13rem' }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}

// 2x2 Grid component for Final Four teams
interface FinalFourGridProps {
  teams: (Team & { percentage: number })[]
}

const FinalFourGrid: React.FC<FinalFourGridProps> = ({ teams }: FinalFourGridProps) => {
  return (
    <motion.div
      className='grid grid-cols-2 mt-6 mb-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {teams?.map((team, index) => {
        const isLeftSide = index % 2 === 0
        const isTopRow = index < 2

        return (
          <motion.div
            key={team.name}
            className={cn(
              'relative flex items-center justify-end',
              isLeftSide ? 'flex-row' : 'flex-row-reverse',
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.2 + index * 0.1,
              duration: 0.5,
            }}
          >
            {/* Percentage indicator outside the box */}
            <motion.div
              className='flex flex-col'
              initial={{
                opacity: 0,
                x: isLeftSide ? -20 : 20,
              }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <p className='text-white font-bold text-xl ml-1'>{team.percentage}%</p>
            </motion.div>

            <div className='flex flex-col justify-center items-center m-2'>
              {/* Team box with primary color */}
              <motion.div
                className={cn(
                  'aspect-square rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden border border-white/60',
                )}
                style={{ backgroundColor: team.colors?.primary }}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                {/* Team logo */}
                <motion.div
                  className='size-28 flex items-center justify-center'
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.4 + index * 0.1,
                  }}
                >
                  <Image
                    src={team.images?.secondary}
                    alt={team.name}
                    width={60}
                    height={60}
                    className='object-contain'
                  />
                </motion.div>

                {/* Region badge */}
                <motion.div
                  className={cn(
                    'absolute text-xs -top-[0.5px] font-bold py-0.5 px-2 bg-white/60 rounded-lg',
                    isLeftSide ? '-left-[0.5px]' : '-right-[0.5px]',
                    isLeftSide
                      ? 'rounded-tr-none rounded-bl-none'
                      : 'rounded-tl-none rounded-br-none',
                  )}
                  style={{ color: team.colors?.primary }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  {team.region?.name}
                </motion.div>
              </motion.div>
              <div className='flex items-center'>
                <p className='text-white font-bold text-sm ml-1 flex-1 truncate'>{team.name}</p>
                <span className='text-white/60 text-xs font-black ml-1'>{team.seed}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default GroupFinalFourSlide
