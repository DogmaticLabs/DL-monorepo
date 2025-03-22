import { GroupChalkScoresData, TeamMap } from '@/app/api/bracket-data'
import { useBracketSlides, useStory } from '@/components/providers'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'
import BracketOwnerCard from '../shared/BracketOwnerCard'

const GroupChalkScoreSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()
  const { data: teamsData } = useTeams()

  const { data, shareId } = bracketSlidesData!.wrapped.group!.chalkScores!

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

  return (
    <div className='w-full h-dvh overflow-hidden'>
      <StorySlide
        bgColor='bg-gradient-to-br from-slate-900 to-emerald-900'
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
                  {/* Animated dice background elements */}
                  <motion.div
                    className='absolute w-20 h-20 opacity-10'
                    style={{ top: '15%', left: '20%' }}
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 4, repeat: Infinity, repeatType: 'reverse' },
                    }}
                  >
                    🎲
                  </motion.div>

                  <motion.div
                    className='absolute w-16 h-16 opacity-10'
                    style={{ bottom: '20%', right: '15%' }}
                    animate={{
                      rotate: -360,
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 6, repeat: Infinity, repeatType: 'reverse' },
                    }}
                  >
                    🎲
                  </motion.div>

                  <motion.p
                    className='text-2xl font-black text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  >
                    Some brackets play it{' '}
                    <motion.span
                      className='uppercase rounded-lg bg-blue-600 px-2 py-1 shadow-lg inline-block'
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 100 }}
                    >
                      SAFE
                    </motion.span>
                  </motion.p>

                  <motion.p
                    className='text-2xl font-black text-center text-white leading-tight tracking-wide relative z-10 mt-4'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.2, ease: 'easeOut' }}
                  >
                    while others{' '}
                    <motion.span
                      className='uppercase rounded-lg bg-madness-orange px-2 py-1 shadow-lg inline-block'
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: [0, -10, 10, -10, 10, 0], // Keyframes for the shake effect
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 1.3,
                        ease: 'easeInOut', // A smoother easing for the shake
                      }}
                    >
                      SHAKE
                    </motion.span>{' '}
                    things up
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
                    Who stuck to the script and who's gambling? 🎲
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
                      <StoryCard cardRef={cardRef} title={<ChalkScoreTitle />} showGroup>
                        <ChalkScoreContent data={data} teamsData={teamsData!} animated={true} />
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

      {/* Add ShareableContent component for sharing */}
      <ShareableContent
        shareableRef={shareableRef}
        backgroundGradient='linear-gradient(to bottom right, #1f2937, #065f46)'
      >
        <StoryCard title={<ChalkScoreTitle animated={false} />} animated={false} showGroup>
          <ChalkScoreContent data={data} teamsData={teamsData!} animated={false} />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Title component
interface ChalkScoreTitleProps {
  animated?: boolean
}

const ChalkScoreTitle = ({ animated = true }: ChalkScoreTitleProps) => {
  if (!animated) {
    return (
      <div className='text-center mb-3'>
        <div className='flex justify-center gap-2'>
          <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
            Chalk Score
          </h2>
          <span className='text-3xl' role='img' aria-label='dice'>
            🎲
          </span>
        </div>
        <div className='h-1 bg-madness-orange mx-auto mt-4 w-[16rem]' />
      </div>
    )
  }

  return (
    <motion.div
      className='text-center mb-3'
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex justify-center gap-2'>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>Risk Index</h2>
        <span className='text-3xl' role='img' aria-label='dice'>
          🎲
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

// ChalkScoreContent Component to reduce duplication
interface ChalkScoreContentProps {
  data: GroupChalkScoresData
  teamsData: TeamMap
  animated?: boolean
}

const ChalkScoreContent: React.FC<ChalkScoreContentProps> = ({
  data,
  teamsData,
  animated = true,
}) => {
  return (
    <>
      <motion.div
        className='mt-4 p-3 rounded-lg border border-white/20 relative'
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className='flex justify-between items-center mb-1'>
          <div className='flex items-center gap-2'>
            <span className='bg-madness-orange text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
              🔥
            </span>
            <span className='text-sm font-bold text-orange-300'>RISK TAKER</span>
            <span className='text-xs font-bold text-white/60'>
              {data.highestChalk.upsetsCount} Upsets
            </span>
          </div>
          <div className='text-xl font-bold text-white bg-madness-orange absolute top-0 right-0 rounded-lg rounded-tl-none rounded-br-none px-2 py-1'>
            {data.highestChalk.percentile}
          </div>
        </div>
        <BracketOwnerCard
          name={data.highestChalk.bracket.member.displayName}
          bracketName={data.highestChalk.bracket.name}
          teamLogo={
            teamsData?.[data.highestChalk.bracket.winnerId!]?.id
              ? `/team-logos/${teamsData?.[data.highestChalk.bracket.winnerId!]?.id}-primary.png`
              : '/placeholder-team.png'
          }
          iconColor='text-madness-orange'
          delay={0.7}
          teamBackground={false}
        />
      </motion.div>

      {/* Chalk Score Visualization */}
      <ChalkScoreBar
        leastChalky={data.lowestChalk.percentile}
        mostChalky={data.highestChalk.percentile}
        groupAverage={data.averageChalk.percentile}
        animated={animated}
      />

      {/* Safe Bet (Lowest Chalk) */}
      <motion.div
        className='mb-4 p-3 rounded-lg border border-white/20 relative'
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <div className='flex justify-between items-center mb-1'>
          <div className='flex items-center gap-2'>
            <span className='bg-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
              🧊
            </span>
            <span className='text-sm font-bold text-blue-300'>PLAYING IT SAFE</span>
            <span className='text-xs font-bold text-white/60'>
              {data.lowestChalk.upsetsCount} Upsets
            </span>
          </div>
          <div className='text-xl font-bold text-white bg-blue-600 absolute top-0 right-0 rounded-lg rounded-tl-none rounded-br-none px-2 py-1'>
            {data.lowestChalk.percentile}
          </div>
        </div>
        <BracketOwnerCard
          name={data.lowestChalk.bracket.member.displayName}
          bracketName={data.lowestChalk.bracket.name}
          teamLogo={
            teamsData?.[data.lowestChalk.bracket.winnerId!]?.id
              ? `/team-logos/${teamsData?.[data.lowestChalk.bracket.winnerId!]?.id}-primary.png`
              : '/placeholder-team.png'
          }
          delay={1.3}
          teamBackground={false}
          iconColor='text-blue-500'
        />
      </motion.div>
    </>
  )
}

// Chalk Score Bar Component
interface ChalkScoreBarProps {
  leastChalky: number
  mostChalky: number
  groupAverage: number
  animated?: boolean
}

const ChalkScoreBar = ({
  leastChalky,
  mostChalky,
  groupAverage,
  animated = true,
}: ChalkScoreBarProps) => {
  if (!animated) {
    return (
      <div className='mt-6 mb-6'>
        <div className='h-6 w-full bg-gradient-to-r from-blue-700 to-madness-orange rounded-full relative'>
          {/* Group Average Marker */}
          <div
            className='absolute top-0 bottom-0 border-l border-white/40 border-dashed'
            style={{ left: `${groupAverage}%` }}
          />

          {/* Risk Taker Marker */}
          <div
            className='absolute top-0 h-6 bg-white border-r border-l border-white rounded-full'
            style={{ left: `${mostChalky}%` }}
          />
          <div
            className='absolute -top-6 transform -translate-x-[42%] text-orange-500'
            style={{ left: `${mostChalky}%` }}
          >
            ▼
          </div>

          {/* Safe Bet Marker */}
          <div
            className='absolute top-0 h-6 bg-white border-r border-l border-white rounded-full'
            style={{ left: `${leastChalky}%` }}
          />
          <div
            className='absolute -bottom-6 transform -translate-x-[42%] text-blue-500'
            style={{ left: `${leastChalky}%` }}
          >
            ▲
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className='mt-6 mb-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <motion.div
        className='h-6 w-full bg-gradient-to-r from-blue-700 to-madness-orange rounded-full  relative'
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        {/* Group Average Marker */}
        <motion.div
          className='absolute top-0 bottom-0 border-l border-white/40 border-dashed'
          style={{ left: `${groupAverage}%` }}
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />

        {/* Risk Taker Marker */}
        <motion.div
          className='absolute top-0 h-6 bg-white border-r border-l border-white rounded-full'
          style={{ left: `${mostChalky}%` }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
        <motion.div
          className='absolute -top-6 transform -translate-x-[42%] text-orange-500'
          style={{ left: `${mostChalky}%` }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          ▼
        </motion.div>

        {/* Safe Bet Marker */}
        <motion.div
          className='absolute top-0 h-6 bg-white border-r border-l border-white rounded-full'
          style={{ left: `${leastChalky}%` }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
        <motion.div
          className='absolute -bottom-6 transform -translate-x-[42%] text-blue-500'
          style={{ left: `${leastChalky}%` }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          ▲
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default GroupChalkScoreSlide
