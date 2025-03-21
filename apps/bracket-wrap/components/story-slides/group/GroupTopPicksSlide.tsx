import { ChampionStatsData, TeamMap } from '@/app/api/bracket-data'
import { useBracketSlides, useStory } from '@/components/providers'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'

const GroupTopPicksSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()
  const { data, shareId } = bracketSlidesData!.wrapped!.group!.championStats!

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 3500) // Show content after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [showContent])

  // Find the maximum bracket count for scaling
  const maxBracketCount = Math.max(...(data?.map(pick => pick.count) ?? []))

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
                    className='text-3xl font-black text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  >
                    Your group selected
                  </motion.p>
                  <motion.p
                    className='text-5xl font-black uppercase text-center text-white leading-tight tracking-wide rounded-lg bg-[#ff6b00] px-3 py-1 shadow-lg mt-4'
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    {bracketSlidesData?.info.group?.data.uniqueChampions}
                  </motion.p>
                  <motion.p
                    className='text-3xl text-center text-white leading-tight font-black mt-4 z-10'
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
                      transition={{ duration: 0.5 }}
                    >
                      <StoryCard title={<TopPicksTitle />} showGroup>
                        <ChampionBarChart
                          championPicks={data}
                          teams={teams}
                          maxBracketCount={maxBracketCount}
                        />
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
        backgroundGradient='linear-gradient(to bottom right, #1e3a8a, #1f2937)'
      >
        <StoryCard animated={false} title={<TopPicksTitle />} showGroup>
          <ChampionBarChart championPicks={data} teams={teams} maxBracketCount={maxBracketCount} />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Bar Chart Display component
interface ChampionBarChartProps {
  championPicks: ChampionStatsData[]
  teams: TeamMap
  maxBracketCount: number
}

const ChampionBarChart = ({ championPicks, teams, maxBracketCount }: ChampionBarChartProps) => {
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
          />
        ))}
      </div>
    </motion.div>
  )
}

const TopPicksTitle = () => {
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
        className='h-1 bg-madness-orange mx-auto mt-4'
        initial={{ width: 0 }}
        animate={{ width: '19rem' }} // 8rem = 32px (w-32)
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}

// Vertical bar chart component for team pick
interface TeamPickBarProps {
  pick: ChampionStatsData
  index: number
  teams: TeamMap
  maxBracketCount: number
}

const TeamPickBar = ({ pick, index, teams, maxBracketCount }: TeamPickBarProps) => {
  // Set a fixed height for the tallest bar (in pixels) and scale others proportionally
  const maxBarHeight = 200 // Height in pixels for the bar with most picks
  const barHeight = Math.max((pick.count / maxBracketCount) * maxBarHeight, 60) // Minimum 60px height
  // Use team colors from the data
  const primaryColor = teams?.[pick.teamId]?.colors.primary
  const secondaryColor = teams?.[pick.teamId]?.colors.secondary
  return (
    <motion.div
      className='flex flex-col items-center'
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.3,
      }}
    >
      {/* Pick Count */}
      <motion.div
        className='text-xl font-black text-white mb-3 flex flex-col items-center gap-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
      >
        <div className='text-2xl leading-none h-5'>{pick.count}</div>
        <div className='text-[10px] h-4 text-white/80'>{pick.count === 1 ? 'pick' : 'picks'}</div>
      </motion.div>

      {/* Vertical Bar with Team Logo */}
      <div className='relative'>
        {/* Main Bar with Gradient using team colors */}
        <motion.div
          className='w-24 rounded-lg flex items-center justify-center relative border border-white/15'
          style={{
            height: 0,
            background: `linear-gradient(to top, ${primaryColor} 0%, ${primaryColor}dd 70%, ${primaryColor}aa 100%)`,
            // boxShadow: `0 4px 12px rgba(0,0,0,0.25), 0 0 0 2px ${primaryColor}33`,
            // border: `1px solid `,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${barHeight}px` }}
          transition={{
            duration: 1.2,
            delay: 0.5 + index * 0.2,
            ease: 'easeOut',
          }}
        >
          {/* Team Logo Container */}
          <motion.div
            className='absolute transform -translate-x-1/2 -translate-y-1/2'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 1.0 + index * 0.2,
            }}
          >
            <div className='w-16 h-16 rounded-lg flex items-center justify-center'>
              <Image
                src={teams?.[pick.teamId]?.images.secondary || '/placeholder-team.png'}
                alt={teams?.[pick.teamId]?.name ?? ''}
                width={44}
                height={44}
                className='w-11 h-11 object-contain'
                priority
                unoptimized
              />
            </div>
          </motion.div>

          {/* Team Rank - Bottom of bar */}
          <div
            className='absolute bottom-[0.5px] left-[0.5px] border-l-0 border-b-0 w-4 h-4 rounded-tr-sm rounded-bl-lg flex items-center justify-center text-white font-bold text-[10px] shadow-md bg-white'
            style={{ color: teams?.[pick.teamId]?.colors.primary }}
          >
            {pick.rank}
          </div>
        </motion.div>

        {/* Team Name */}
        <motion.div
          className='mt-2 text-center flex flex-col items-center gap-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
        >
          <p className='text-white font-bold text-sm max-w-[96px] overflow-hidden text-ellipsis whitespace-nowrap'>
            {teams?.[pick.teamId]?.name}
          </p>
          <p className='text-white/60 font-extrabold text-[10px]'>
            {teams?.[pick.teamId]?.region.name} ({teams?.[pick.teamId]?.seed})
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GroupTopPicksSlide
