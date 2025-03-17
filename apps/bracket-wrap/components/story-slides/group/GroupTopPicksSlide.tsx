import { useBracketSlides, useStory } from '@/components/providers'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { CinderellaAnimatedBackground } from '../animations/CinderellaAnimatedElements'
import ShareButton from '../ShareButton'

// Define the type for team pick
interface TeamPick {
  name?: string
  abbreviation?: string
  rank: number
  region: {
    id: number
    name: string
  }
  groupPercentage: number
  seed: number
  bracketCount: number
  teamId: string
  colors: {
    primary: string
    secondary: string
  }
}

// Bar Chart Display component
interface ChampionBarChartProps {
  championPicks: TeamPick[]
  teams: any
  maxBracketCount: number
  animated?: boolean
}

const ChampionBarChart = ({
  championPicks,
  teams,
  maxBracketCount,
  animated = true,
}: ChampionBarChartProps) => {
  if (animated) {
    return (
      <motion.div
        className='w-full py-4'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className='flex justify-center items-end gap-4'>
          {championPicks.map((pick, idx) => (
            <TeamPickBar
              key={idx}
              pick={pick}
              index={idx}
              teams={teams}
              maxBracketCount={maxBracketCount}
              animated={animated}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className='w-full py-4'>
      <div className='flex justify-center items-end gap-4'>
        {championPicks.map((pick, idx) => (
          <TeamPickBar
            key={idx}
            pick={pick}
            index={idx}
            teams={teams}
            maxBracketCount={maxBracketCount}
            animated={animated}
          />
        ))}
      </div>
    </div>
  )
}

const GroupTopPicksSlide = () => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  // Pick three random teams from the data
  const randomTeams = Object.values(teams ?? {})
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  console.log(randomTeams)

  // Stub data for group's most popular champion picks
  const championPicks = [
    {
      // team: randomTeams[0].name,
      rank: 1,
      region: 'East',
      groupPercentage: 41.8,
      // seed: 1,
      bracketCount: 13,
      // teamId: 'a47c1b32-c12d-11ee-b568-d9cd047f74cf',
      colors: {
        primary: '#0c2340',
        secondary: '#f1f2f3',
      },
      teamId: randomTeams[0]?.id,
      ...randomTeams[0],
    },
    {
      // team: 'Drake',
      rank: 2,
      region: 'South',
      groupPercentage: 23.6,
      // seed: 2,
      bracketCount: 6,
      // teamId: 'a47c1b32-c12d-11ee-b568-d9cd047f74cf',
      colors: {
        primary: '#005596',
        secondary: '#bec0c2',
      },
      teamId: randomTeams[1]?.id,
      ...randomTeams[1],
    },
    {
      // team: 'UNC',
      rank: 3,
      region: 'Midwest',
      groupPercentage: 15.2,
      // seed: 3,
      bracketCount: 4,
      // teamId: 'a47cb771-c12d-11ee-b568-d9cd047f74cf',
      colors: {
        primary: '#7bafd4',
        secondary: '#13294b',
      },
      teamId: randomTeams[2]?.id,
      ...randomTeams[2],
    },
  ]

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 4000) // Show content after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [showContent])

  // Find the maximum bracket count for scaling
  const maxBracketCount = Math.max(...championPicks.map(pick => pick.bracketCount))

  // Animation elements configuration - updated with more March Madness themed elements
  const animationElements = {
    flashes: [
      // Flash effect 1
      { top: '15%', left: '20%', size: '100px', color: 'blue', opacity: 0.3, speed: 'medium' },
      { top: '10%', right: '10%', size: '80px', color: 'white', opacity: 0.2, speed: 'fast' },
      { bottom: '10%', left: '10%', size: '120px', color: 'blue', opacity: 0.3, speed: 'slow' },
      { bottom: '10%', right: '10%', size: '90px', color: 'white', opacity: 0.2, speed: 'medium' },
    ],
  }

  // Define exit animations for content
  const contentExitAnimation = {
    opacity: 0,
    y: -80,
    scale: 0.8,
    transition: { duration: 0.7, ease: 'easeOut' },
  }

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const shareOptions = {
      title: 'Top Picks',
      text: `Check out my group's top champion picks!`,
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

  if (!teams) return null

  return (
    <div className='w-full h-dvh overflow-hidden'>
      <StorySlide
        // bgColor='bg-gradient-to-br from-[#0067b1] via-black to-[#0067b1]'
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
          {/* Decorative elements */}
          <CinderellaAnimatedBackground isExiting={isExiting} elements={animationElements as any} />

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
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <motion.p
                    className='text-3xl font-black uppercase text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  >
                    Your Group Selected
                  </motion.p>
                  <motion.p
                    className='text-5xl font-black uppercase text-center text-white leading-tight tracking-wide rounded-lg bg-[#ff6b00] px-3 py-1 shadow-lg mt-4'
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    12
                  </motion.p>
                  <motion.p
                    className='text-2xl text-center text-white leading-tight uppercase font-black mt-4 z-10'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.4 }}
                  >
                    unique champions
                  </motion.p>

                  <motion.p
                    className='text-xl font-bold text-center text-white leading-tight z-10 mt-[80px]'
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
                    Let's take a look at the top picks 🏆
                  </motion.p>
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
                      transition={{ duration: 0.8 }}
                    >
                      <StoryCard title={<TopPicksTitle animated={true} />}>
                        <ChampionBarChart
                          championPicks={championPicks as TeamPick[]}
                          teams={teams}
                          maxBracketCount={maxBracketCount}
                          animated={true}
                        />
                      </StoryCard>
                    </motion.div>
                  ) : (
                    <motion.div
                      key='content-exiting'
                      className='w-full'
                      initial={{ opacity: 1 }}
                      animate={contentExitAnimation}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
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
        backgroundGradient='linear-gradient(to bottom right, #0067b1, #000000)'
      >
        <StoryCard animated={false} title={<TopPicksTitle animated={false} />}>
          <ChampionBarChart
            championPicks={championPicks as TeamPick[]}
            teams={teams}
            maxBracketCount={maxBracketCount}
            animated={false}
          />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Reusable Title component
interface TopPicksTitleProps {
  animated?: boolean
}

const TopPicksTitle = ({ animated = true }: TopPicksTitleProps) => {
  if (animated) {
    return (
      <motion.div
        className='text-center mb-4'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className='flex justify-center gap-2'>
          <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
            Champion Picks
          </h2>
          <span className='text-3xl' role='img' aria-label='trophy'>
            🏆
          </span>
        </div>
        <motion.div
          className='h-1 bg-[#ff6b00] mx-auto mt-4'
          initial={{ width: 0 }}
          animate={{ width: '16rem' }} // 8rem = 32px (w-32)
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: 'easeOut',
          }}
        ></motion.div>
      </motion.div>
    )
  }

  return (
    <div className='text-center mb-4'>
      <div className='flex justify-center gap-2'>
        <span className='text-3xl' role='img' aria-label='trophy'>
          🏆
        </span>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
          Champion Picks
        </h2>
        <span className='text-3xl' role='img' aria-label='trophy'>
          🏆
        </span>
      </div>
      <div className='h-1 bg-[#ff6b00] mx-auto mt-4 w-64'></div>
    </div>
  )
}

// Vertical bar chart component for team pick
interface TeamPickBarProps {
  pick: TeamPick
  index: number
  teams: any
  maxBracketCount: number
  animated?: boolean
}

const TeamPickBar = ({
  pick,
  index,
  teams,
  maxBracketCount,
  animated = true,
}: TeamPickBarProps) => {
  // Set a fixed height for the tallest bar (in pixels) and scale others proportionally
  const maxBarHeight = 200 // Height in pixels for the bar with most picks
  const barHeight = Math.max((pick.bracketCount / maxBracketCount) * maxBarHeight, 60) // Minimum 60px height
  // Use team colors from the data
  const primaryColor = pick.colors.primary
  const secondaryColor = pick.colors.secondary
  return (
    <motion.div
      className='flex flex-col items-center'
      initial={animated ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        animated
          ? {
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: 0.3,
            }
          : { duration: 0 }
      }
    >
      {/* Pick Count */}
      <motion.div
        className='text-xl font-black text-white mb-3 flex flex-col items-center gap-0'
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={animated ? { duration: 0.5, delay: 0.7 + index * 0.2 } : { duration: 0 }}
      >
        <div className='text-2xl leading-none h-5'>{pick.bracketCount}</div>
        <div className='text-[10px] h-4 text-white/80'>
          {pick.bracketCount === 1 ? 'pick' : 'picks'}
        </div>
      </motion.div>

      {/* Vertical Bar with Team Logo */}
      <div className='relative'>
        {/* Main Bar with Gradient using team colors */}
        <motion.div
          className='w-24 rounded-lg flex items-center justify-center relative'
          style={{
            height: animated ? 0 : `${barHeight}px`,
            background: `linear-gradient(to top, ${primaryColor} 0%, ${primaryColor}dd 70%, ${primaryColor}aa 100%)`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.25), 0 0 0 2px ${primaryColor}33`,
          }}
          initial={animated ? { height: 0 } : { height: `${barHeight}px` }}
          animate={{ height: `${barHeight}px` }}
          transition={
            animated
              ? {
                  duration: 1.2,
                  delay: 0.5 + index * 0.2,
                  ease: 'easeOut',
                }
              : { duration: 0 }
          }
        >
          {/* Team Logo Container */}
          <motion.div
            className='absolute transform -translate-x-1/2 -translate-y-1/2'
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={
              animated
                ? {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 1.0 + index * 0.2,
                  }
                : { duration: 0 }
            }
          >
            <div className='w-16 h-16 rounded-lg flex items-center justify-center'>
              <Image
                src={teams?.[pick.teamId]?.images.secondary || '/placeholder-team.png'}
                alt={pick.name ?? ''}
                width={44}
                height={44}
                className='w-11 h-11 object-contain'
              />
            </div>
          </motion.div>

          {/* Team Rank - Bottom of bar */}
          <div
            className='absolute bottom-[0.5px] left-[0.5px] border-l-0 border-b-0 w-4 h-4 rounded-tr-sm rounded-bl-lg flex items-center justify-center text-white font-bold text-[10px] shadow-md bg-white'
            style={{
              // backgroundColor: pick.colors.secondary,
              // border: `1px solid ${pick.colors.secondary}`,
              color: pick.colors.primary,
            }}
          >
            {pick.rank}
          </div>
        </motion.div>

        {/* Team Name */}
        <motion.div
          className='mt-4 text-center flex flex-col items-center gap-0'
          initial={animated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={animated ? { duration: 0.5, delay: 1.2 + index * 0.2 } : { duration: 0 }}
        >
          <p className='text-white font-bold text-sm max-w-[96px] overflow-hidden text-ellipsis whitespace-nowrap'>
            {pick.name}
          </p>
          <p className='text-white/80 text-[10px]'>
            {pick.region.name} ({pick.seed})
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GroupTopPicksSlide
