import { useBracketSlides, useStory } from '@/components/providers'
import { CinderellaAnimatedBackground } from '@/components/story-slides/animations/CinderellaAnimatedElements'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'
import GroupSlideBanner from './GroupSlideBanner'

const GroupCinderellaSlide = () => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  // Placeholder data - would be replaced with actual data in production
  const cinderellaData = {
    team: "Saint Peter's",
    seed: 15,
    roundReached: 'Elite Eight',
    bracketCount: 12, // Number of brackets with this pick
    teamId: 'a47cb771-c12d-11ee-b568-d9cd047f74cf', // Placeholder ID
    bracketOwner: {
      name: 'Sarah Johnson',
      bracketName: 'March Madness Magic',
      avatarUrl: 'https://i.pravatar.cc/150?img=5', // Placeholder avatar URL
    },
  }

  // Log when isExiting changes
  useEffect(() => {
    console.log('isExiting changed:', isExiting)
  }, [isExiting])

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 3500) // Increased from 2.5s to 4.5s to give more time to read

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
      title: `${cinderellaData.team} - The Cinderella Story`,
      text: `Check out ${cinderellaData.team}, the #${cinderellaData.seed} seed that made it to the ${cinderellaData.roundReached}!`,
      url: 'https://bracketwrap.com',
      watermark: {
        text: 'bracketwrap.com',
        position: 'bottomRight' as const,
        color: 'rgba(255, 255, 255, 0.7)',
      },
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
        bgColor='bg-gradient-to-br from-[#0067b1] via-black to-[#0067b1]'
        footer={<GroupSlideBanner />}
      >
        <div className='relative flex flex-col w-full h-full overflow-hidden'>
          {/* Decorative elements - now appearing first with their own animations */}
          <CinderellaAnimatedBackground isExiting={isExiting} elements={animationElements as any} />

          {/* Radial gradient overlay for depth */}
          <div className='absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none' />

          {/* Content container with padding */}
          <div className='flex flex-col items-center justify-center gap-6 w-full px-4 py-6 flex-1'>
            <AnimatePresence mode='wait'>
              {!showContent ? (
                <motion.div
                  key='intro'
                  className='flex flex-col items-center justify-center h-full'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.p
                    className='text-3xl font-black text-center text-white leading-tight uppercase tracking-wide'
                    initial={{ x: -500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Every tournament has its
                  </motion.p>
                  <motion.p
                    className='text-4xl font-black text-center text-[#ff6b00] leading-tight mt-2 uppercase tracking-wide'
                    initial={{ x: 500, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    UNDERDOGS
                  </motion.p>
                  <motion.p
                    className='text-3xl font-black text-center text-white leading-tight mt-6 uppercase tracking-wide'
                    initial={{ x: -500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    Your group's Cinderella story
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
                      {/* Title with basketball icon and animation */}
                      <CinderellaTitle />

                      {/* Team Card */}
                      <TeamCard cinderellaData={cinderellaData} teams={teams} cardRef={cardRef} />

                      {/* Share Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 20,
                        }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className='flex justify-center'
                        onClick={e => e.stopPropagation()}
                        data-click='share-container'
                      >
                        <ShareButton isSharing={isSharing} handleShare={handleShare} />
                      </motion.div>
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

      <ShareableContent shareableRef={shareableRef} cinderellaData={cinderellaData} teams={teams} />
    </div>
  )
}

// Animation elements configuration
const animationElements = {
  brackets: [
    // Bracket 1 - Top right
    {
      top: '15%',
      right: '10%',
      size: '7',
      opacity: 0.8,
      rotateDirection: 'clockwise',
      color: 'blue',
      bracketType: 'right',
    },
    // Bracket 2 - Bottom left
    {
      bottom: '10%',
      left: '5%',
      size: '7',
      opacity: 0.7,
      rotateDirection: 'counterclockwise',
      color: 'blue',
      bracketType: 'left',
    },
    // Bracket 3 - Top left
    {
      top: '8%',
      left: '8%',
      size: '6',
      opacity: 0.6,
      color: 'blue',
      bracketType: 'left',
    },
    // Bracket 4 - Bottom right
    {
      bottom: '12%',
      right: '8%',
      size: '6',
      opacity: 0.6,
      color: 'blue',
      bracketType: 'right',
    },
    // Full bracket - center background (larger, more subtle)
    {
      top: '30%',
      left: '40%',
      size: '14',
      opacity: 0.15,
      color: 'blue',
      bracketType: 'full',
    },
  ],
  basketballs: [
    // Basketball 1 - Top
    {
      top: '12%',
      left: '30%',
      size: '3.5',
      opacity: 0.7,
      bounceHeight: 'low',
    },
    // Basketball 2 - Bottom
    {
      bottom: '15%',
      right: '35%',
      size: '4',
      opacity: 0.8,
      bounceHeight: 'medium',
    },
    // Basketball 3 - Side
    {
      top: '40%',
      right: '12%',
      size: '3',
      opacity: 0.6,
      bounceHeight: 'low',
    },
  ],
  ncaaLogos: [
    // NCAA Logo 1
    {
      top: '8%',
      right: '42%',
      size: 'sm',
      opacity: 0.3,
      pulseEffect: true,
    },
    // NCAA Logo 2
    {
      bottom: '10%',
      left: '35%',
      size: 'sm',
      opacity: 0.3,
      pulseEffect: true,
    },
  ],
  flashes: [
    // Flash effect 1
    { top: '20%', left: '20%', size: '100px', color: 'blue', opacity: 0.3, speed: 'medium' },
    { top: '50%', right: '15%', size: '80px', color: 'white', opacity: 0.2, speed: 'fast' },
    { bottom: '30%', left: '10%', size: '120px', color: 'blue', opacity: 0.3, speed: 'slow' },
    { bottom: '40%', right: '25%', size: '90px', color: 'white', opacity: 0.2, speed: 'medium' },
  ],
}

// Types for our components
interface CinderellaData {
  team: string
  seed: number
  roundReached: string
  bracketCount: number
  teamId: string
  bracketOwner: {
    name: string
    avatarUrl: string
    bracketName: string
  }
}

interface TeamCardProps {
  cinderellaData: CinderellaData
  teams: any
  animated?: boolean
  cardRef?: React.RefObject<HTMLDivElement>
}

interface BracketOwnerSectionProps {
  bracketOwner: CinderellaData['bracketOwner']
  animated?: boolean
}

// Reusable TeamCard component
const TeamCard: React.FC<TeamCardProps> = ({ cinderellaData, teams, animated = true, cardRef }) => {
  return (
    <motion.div
      ref={cardRef}
      className='w-full bg-black/60 backdrop-blur-md rounded-xl p-6 shadow-lg border-l-4 border-[#0067b1] mb-4'
      initial={{ opacity: 0, y: 20 }}
      animate={animated ? { opacity: 1, y: 0, x: [-5, 5, -5, 5, 0] } : { opacity: 1, y: 0 }}
      transition={{
        duration: animated ? 0.8 : 0.5,
        x: {
          duration: 0.5,
          times: [0, 0.25, 0.5, 0.75, 1],
          ease: 'easeOut',
          delay: 0.1,
        },
      }}
    >
      {/* Team Information Section */}
      <div className='flex items-center gap-4 mb-6'>
        <div className='flex-shrink-0 flex flex-col items-center gap-2'>
          {/* Seed */}
          <motion.div
            className='w-10 h-10 rounded-md bg-[#0067b1] flex items-center justify-center text-white font-black text-lg border-2 border-white/80'
            animate={animated ? { rotate: [-3, 3, -3] } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {cinderellaData.seed}
          </motion.div>

          {/* Team Logo */}
          <motion.div
            className='w-12 h-12 rounded-md overflow-hidden bg-white flex items-center justify-center'
            animate={animated ? { rotate: [0, 2, 0, -2, 0] } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Image
              src={teams?.[cinderellaData.teamId]?.images.secondary || '/placeholder-team.png'}
              alt={cinderellaData.team}
              width={40}
              height={40}
              className='w-10 h-10 object-contain'
            />
          </motion.div>
        </div>

        {/* Team Name and Round */}
        <div className='flex-1 min-w-0'>
          <h3 className='text-3xl font-black text-white uppercase tracking-tight'>
            {cinderellaData.team}
          </h3>
          <div className='flex items-center gap-2 mt-2'>
            <span className='bg-[#ff6b00] px-3 py-1 rounded text-white font-black uppercase text-sm tracking-wide'>
              {cinderellaData.roundReached}
            </span>
          </div>
        </div>
      </div>

      {/* Bracket Owner Section */}
      <BracketOwnerSection bracketOwner={cinderellaData.bracketOwner} animated={animated} />
    </motion.div>
  )
}

// Reusable BracketOwnerSection component
const BracketOwnerSection: React.FC<BracketOwnerSectionProps> = ({
  bracketOwner,
  animated = true,
}) => {
  return (
    <div className='pt-4 border-t border-[#0067b1]/50'>
      <h4 className='text-lg font-black text-white/90 mb-3 uppercase tracking-wide'>
        Bracket Owner
      </h4>
      <div className='flex items-center gap-4'>
        <motion.div
          className='flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 border-[#0067b1] bg-white/10 flex items-center justify-center text-white'
          animate={animated ? { scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-8 h-8'
          >
            <path
              fillRule='evenodd'
              d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
              clipRule='evenodd'
            />
          </svg>
        </motion.div>
        <div className='flex-1 min-w-0'>
          <p className='font-black text-xl text-white truncate'>{bracketOwner.name}</p>
          <p className='text-[#ff6b00] truncate font-bold'>{bracketOwner.bracketName}</p>
        </div>
      </div>
    </div>
  )
}

// Reusable Title component
const CinderellaTitle: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <motion.div
      className='mb-6 text-center'
      initial={{ y: -20, opacity: 0 }}
      animate={
        animated
          ? {
              y: 0,
              opacity: 1,
            }
          : { y: 0, opacity: 1 }
      }
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className='inline-block mb-3'
        animate={
          animated
            ? {
                rotate: [0, -10, 10, -5, 5, 0],
                scale: [1, 1.3, 1.3, 1.2, 1.2, 1],
              }
            : {}
        }
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        <span className='text-5xl' role='img' aria-label='basketball'>
          👸
        </span>
      </motion.div>
      <h2 className='text-4xl font-black text-white uppercase tracking-tighter'>
        CINDERELLA STORY
      </h2>
      <div className='h-1 w-32 bg-[#ff6b00] mx-auto mt-2'></div>
    </motion.div>
  )
}

// Reusable decorative elements component
export const DecorativeElements: React.FC = () => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {/* Brackets */}
      <div className='absolute top-[2%] right-[5%] opacity-70 text-4xl'>
        <Image
          src='/bracket.png'
          alt='March Madness bracket'
          width={100}
          height={100}
          className='w-full h-full object-contain'
        />
      </div>

      {/* Basketball */}
      <div className='absolute top-[15%] left-[10%] opacity-70 text-4xl'>
        <span role='img' aria-label='basketball'>
          🏀
        </span>
      </div>

      <div className='absolute bottom-[25%] right-[15%] opacity-60 text-3xl'>
        <span role='img' aria-label='basketball'>
          🏀
        </span>
      </div>

      {/* NCAA Logo */}
      <div className='absolute bottom-[20%] right-[25%] opacity-40'>
        <svg width='20' height='20' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='50' cy='50' r='45' fill='#0067b1' />
          <text
            x='50'
            y='57'
            fontFamily='Arial, sans-serif'
            fontSize='20'
            fontWeight='bold'
            fill='white'
            textAnchor='middle'
          >
            NCAA
          </text>
        </svg>
      </div>
    </div>
  )
}

const ShareableContent = ({
  shareableRef,
  cinderellaData,
  teams,
}: {
  shareableRef: React.RefObject<HTMLDivElement>
  cinderellaData: CinderellaData
  teams: any
}) => {
  return (
    <div
      ref={shareableRef}
      className='relative w-full top-0 left-0 pointer-events-none overflow-hidden'
      style={{
        background: 'linear-gradient(to bottom right, #0067b1, #000000, #0067b1)',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      {/* Decorative elements */}
      <DecorativeElements />

      {/* Radial gradient overlay for depth */}
      <div className='absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none' />

      {/* Title with emoji */}
      <div className='relative mb-8 text-center'>
        <CinderellaTitle animated={false} />
      </div>

      {/* Team Card - using our reusable component */}
      <TeamCard cinderellaData={cinderellaData} teams={teams} animated={false} />

      {/* Group name banner at top */}
      <GroupSlideBanner />
    </div>
  )
}

export default GroupCinderellaSlide
