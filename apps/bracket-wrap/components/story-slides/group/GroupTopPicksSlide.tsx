import { useBracketSlides, useStory } from '@/components/providers'
import { AnimatedBackground } from '@/components/story-slides/animations/AnimatedElements'
import StorySlide from '@/components/StorySlide'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import GroupSlideBanner from './GroupSlideBanner'

const GroupTopPicksSlide = () => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()

  console.log('data', data)

  // Stub data for group's most popular champion picks
  const championPicks = [
    {
      team: 'UConn',
      rank: 1,
      region: 'East',
      groupPercentage: 41.8,
      seed: 1,
      teamId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
    },
    {
      team: 'Drake',
      rank: 2,
      region: 'South',
      groupPercentage: 23.6,
      seed: 2,
      teamId: 'a47c1b32-c12d-11ee-b568-d9cd047f74cf',
    },
    {
      team: 'UNC',
      rank: 3,
      region: 'Midwest',
      groupPercentage: 15.2,
      seed: 3,
      teamId: 'a47cb771-c12d-11ee-b568-d9cd047f74cf',
    },
  ]

  // Log when isExiting changes
  useEffect(() => {
    console.log('isExiting changed:', isExiting)
  }, [isExiting])

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 3500) // Show content after 3.5 seconds

    return () => clearTimeout(timer)
  }, [])

  // Animation elements configuration
  const animationElements = {
    basketballs: [
      // Basketball 1 - Top right
      {
        top: '10%',
        right: '8%',
        size: '10',
        opacity: 0.8,
        rotateDirection: 'clockwise' as const,
        dotSize: '8px',
      },
      // Basketball 2 - Bottom left
      {
        bottom: '15%',
        left: '10%',
        size: '8',
        opacity: 0.7,
        rotateDirection: 'counterclockwise' as const,
        dotSize: '6px',
      },
    ],
    brackets: [
      // Bracket 1 - Top left
      {
        top: '15%',
        left: '12%',
        size: '14',
        color: 'yellow-400',
        opacity: 0.6,
        type: 'topLeft' as const,
      },
      // Bracket 2 - Bottom right
      {
        bottom: '20%',
        right: '10%',
        size: '16',
        color: 'orange-500',
        opacity: 0.6,
        type: 'bottomRight' as const,
      },
    ],
    percentageSymbols: [
      // Percentage 1 - Top right
      {
        top: '30%',
        right: '20%',
        color: 'yellow-400',
        size: '3xl' as const,
        opacity: 0.4,
        floatDistance: 15,
      },
      // Percentage 2 - Bottom left
      {
        bottom: '40%',
        left: '18%',
        color: 'orange-400',
        size: '2xl' as const,
        opacity: 0.3,
        floatDistance: 15,
      },
    ],
  }

  // Define exit animations for content
  const contentExitAnimation = {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: { duration: 0.6, ease: 'easeOut' },
  }

  return (
    <StorySlide
      bgColor='bg-gradient-to-br from-pink-800 to-orange-800'
      footer={<GroupSlideBanner />}
    >
      <div className='relative flex flex-col w-full h-full overflow-hidden'>
        {/* Decorative elements */}
        <AnimatedBackground isExiting={isExiting} elements={animationElements} />

        {/* Content container with padding */}
        <div className='flex flex-col items-center justify-center gap-6 w-full px-4 py-6 flex-1'>
          <AnimatePresence mode='wait'>
            {!showContent ? (
              <motion.div
                key='intro'
                className='flex flex-col items-center justify-center h-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p
                  className='text-2xl font-medium text-center text-white leading-relaxed'
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Every group has its favorites...
                </motion.p>
                <motion.p
                  className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  Here's who your group is backing to win it all
                </motion.p>
              </motion.div>
            ) : (
              <AnimatePresence mode='wait'>
                {!isExiting ? (
                  <motion.div
                    key='content'
                    className='w-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={contentExitAnimation}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.h2
                      className='text-3xl font-bold text-center'
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{
                        y: -80,
                        opacity: 0,
                        scale: 0.8,
                        transition: { duration: 0.5, ease: 'easeOut' },
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      Top Picks
                    </motion.h2>

                    {/* Top champion picks section */}
                    <motion.div
                      className='w-full mt-6'
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{
                        y: 50,
                        opacity: 0,
                        transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 },
                      }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className='flex flex-col gap-4'>
                        {championPicks.map((pick, idx) => (
                          <motion.div
                            key={idx}
                            className='relative'
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{
                              x: idx % 2 === 0 ? -300 : 300,
                              opacity: 0,
                              scale: 0.8,
                              transition: {
                                duration: 0.6,
                                delay: idx * 0.1,
                                ease: 'easeOut',
                              },
                            }}
                            transition={{ duration: 0.5, delay: 0.6 + idx * 0.2 }}
                          >
                            {/* Team info and percentage */}
                            <div className='flex items-center mb-1'>
                              <motion.div
                                className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 border-2 border-yellow-400'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{
                                  scale: 0,
                                  transition: {
                                    duration: 0.3,
                                    delay: 0.1 + idx * 0.1,
                                  },
                                }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 260,
                                  damping: 20,
                                  delay: 0.7 + idx * 0.2,
                                }}
                              >
                                <span className='font-bold text-sm'>{pick.rank}</span>
                              </motion.div>
                              <div className='flex-1'>
                                <div className='flex items-center'>
                                  <Image
                                    src={
                                      teams?.[pick.teamId]?.images.secondary ||
                                      '/placeholder-team.png'
                                    }
                                    alt='Winner'
                                    width={28}
                                    height={28}
                                    className='h-7 w-7 mr-2 mt-0.5 shrink-0'
                                  />
                                  <motion.p
                                    className='font-bold'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{
                                      opacity: 0,
                                      x: -50,
                                      transition: {
                                        duration: 0.4,
                                        delay: idx * 0.1,
                                      },
                                    }}
                                    transition={{ duration: 0.3, delay: 0.8 + idx * 0.2 }}
                                  >
                                    {pick.team}
                                  </motion.p>
                                </div>
                                <motion.p
                                  className='text-xs text-white/70'
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{
                                    opacity: 0,
                                    x: -30,
                                    transition: {
                                      duration: 0.3,
                                      delay: 0.05 + idx * 0.1,
                                    },
                                  }}
                                  transition={{ duration: 0.3, delay: 0.9 + idx * 0.2 }}
                                >
                                  {pick.region} Region
                                </motion.p>
                              </div>
                              <motion.div
                                className='text-right'
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.5,
                                  x: 50,
                                  transition: {
                                    duration: 0.4,
                                    delay: idx * 0.1,
                                  },
                                }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 260,
                                  damping: 20,
                                  delay: 1.1 + idx * 0.2,
                                }}
                              >
                                <p className='font-bold text-lg'>{pick.groupPercentage}%</p>
                              </motion.div>
                            </div>

                            {/* Percentage bar background */}
                            <div className='h-3 w-full bg-white/10 rounded-full overflow-hidden'>
                              {/* Animated percentage bar */}
                              <motion.div
                                className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full relative'
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${pick.groupPercentage}%`,
                                }}
                                exit={{
                                  width: '0%',
                                  transition: {
                                    duration: 0.5,
                                    delay: 0.1 + idx * 0.1,
                                  },
                                }}
                                transition={{
                                  duration: 1.2,
                                  delay: 0.8 + idx * 0.2,
                                  ease: 'easeOut',
                                }}
                              >
                                {/* Shimmer effect */}
                                <motion.div
                                  className='absolute inset-0 w-full h-full'
                                  style={{
                                    background:
                                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    backgroundSize: '200% 100%',
                                  }}
                                  animate={{
                                    backgroundPosition: ['100% 0%', '-100% 0%'],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                    ease: 'linear',
                                    delay: 1.5 + idx * 0.2,
                                  }}
                                />
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Additional context */}
                    <motion.p
                      className='text-sm text-center text-white/70 mt-6'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: 50,
                        transition: { duration: 0.5, delay: 0.2 },
                      }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                    >
                      Based on champion picks from {data?.group.size} brackets
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key='content-exiting'
                    className='w-full'
                    initial={{ opacity: 1 }}
                    animate={contentExitAnimation}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
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
  )
}

export default GroupTopPicksSlide
