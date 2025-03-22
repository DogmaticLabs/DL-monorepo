import { useBracketSlides, useStory } from '@/components/providers'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { cn } from '@workspace/ui/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'
import BracketOwnerCard from '../shared/BracketOwnerCard'
import ShareableContent from '../shared/ShareableContent'

const BracketChalkScoreSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  const { data, shareId } = bracketSlidesData!.wrapped.bracket.chalkScore
  const { data: championData } = bracketSlidesData!.wrapped.bracket.championPickNational
  const { data: teams } = useTeams()

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

  const isRisky = data.percentile > 50

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
                  {/* Dice rolling animation */}
                  <div className='absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none'>
                    <motion.div
                      className='absolute text-[100px] opacity-10'
                      initial={{ scale: 3, rotate: 0, y: -200, x: -100 }}
                      animate={{
                        scale: 1,
                        rotate: 360,
                        y: 100,
                        x: 100,
                      }}
                      transition={{
                        duration: 2.5,
                        delay: 0.3,
                        ease: 'easeInOut',
                      }}
                    >
                      🎲
                    </motion.div>
                    <motion.div
                      className='absolute text-[80px] opacity-10'
                      initial={{ scale: 2, rotate: 180, y: 200, x: 100 }}
                      animate={{
                        scale: 0.8,
                        rotate: -180,
                        y: -50,
                        x: -150,
                      }}
                      transition={{
                        duration: 2.8,
                        delay: 0.5,
                        ease: 'easeInOut',
                      }}
                    >
                      🎲
                    </motion.div>
                  </div>

                  <motion.div
                    className='mb-8'
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    <motion.p
                      className='text-3xl font-black text-center text-white leading-tight tracking-wide'
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      We checked your
                    </motion.p>
                    <motion.div
                      className='relative'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 1.0 }}
                    >
                      <motion.p
                        className='text-4xl font-black uppercase text-center text-white tracking-wide mt-2 bg-madness-orange rounded-lg px-3 py-1'
                        animate={{
                          x: [0, -4, 4, -4, 4, 0],
                          transition: {
                            duration: 0.5,
                            delay: 1.8,
                            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                          },
                        }}
                      >
                        Risk Tolerance
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  {/* Risk slider animation */}
                  <motion.div
                    className='relative w-[220px] h-12 mt-3 mb-6'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >
                    <motion.div
                      className='absolute w-full h-2 bg-gradient-to-r from-blue-600 to-madness-orange rounded-full'
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
                    />
                    <motion.div
                      className='absolute left-0 w-12 h-12 -top-5 flex items-center justify-center'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.7 }}
                    >
                      <span className='text-lg'>🧊</span>
                      <motion.p
                        className='text-xs font-bold absolute -bottom-6 text-blue-400'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.8 }}
                      >
                        SAFE
                      </motion.p>
                    </motion.div>
                    <motion.div
                      className='absolute right-0 w-12 h-12 -top-5 flex items-center justify-center'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.7 }}
                    >
                      <span className='text-lg'>🔥</span>
                      <motion.p
                        className='text-xs font-bold absolute -bottom-6 text-orange-400'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.8 }}
                      >
                        RISKY
                      </motion.p>
                    </motion.div>
                    <motion.div
                      className='absolute w-6 h-6 bg-white rounded-full -top-2'
                      initial={{ left: '0%', opacity: 0 }}
                      animate={{ left: '50%', opacity: 1 }}
                      transition={{
                        left: { duration: 1.5, delay: 2.0, ease: [0.34, 1.56, 0.64, 1] },
                        opacity: { duration: 0.3, delay: 1.9 },
                      }}
                      style={{ translateX: '-50%' }}
                    />
                  </motion.div>

                  <motion.p
                    className='text-xl font-bold text-center text-white leading-tight z-10 mt-6'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 2.8,
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
                    Let's see how you played it 🎲
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
                      <StoryCard cardRef={cardRef} title={<ChalkScoreTitle />} showBracket>
                        {/* Risk Taker (Low Chalk) */}
                        {isRisky ? (
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
                                <span className='text-sm font-bold text-orange-300'>
                                  RISK TAKER
                                </span>
                                <span className='text-xs font-bold text-white/60'>
                                  {data.upsetsCount} Upsets
                                </span>
                              </div>
                              <div className='text-xl font-bold text-white bg-madness-orange absolute top-0 right-0 rounded-lg rounded-tl-none rounded-br-none px-2 py-1'>
                                {Math.round(data.percentile)}
                              </div>
                            </div>
                            <BracketOwnerCard
                              name={bracketSlidesData!.info.bracket!.data.name}
                              bracketName={bracketSlidesData!.info.bracket.data.name}
                              teamLogo={teams?.[championData!.teamId!]?.images?.primary}
                              label=''
                              iconColor='text-orange-400'
                              delay={0.7}
                              teamBackground={false}
                            />
                          </motion.div>
                        ) : (
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
                                <span className='text-sm font-bold text-blue-300'>
                                  PLAYING IT SAFE
                                </span>
                                <span className='text-xs font-bold text-white/60'>
                                  {data.upsetsCount} Upsets
                                </span>
                              </div>
                              <div className='text-xl font-bold text-white bg-blue-600 absolute top-0 right-0 rounded-lg rounded-tl-none rounded-br-none px-2 py-1'>
                                {Math.round(data.percentile)}
                              </div>
                            </div>
                            <BracketOwnerCard
                              name={bracketSlidesData!.info.bracket!.data.name}
                              bracketName={bracketSlidesData!.info.bracket.data.name}
                              teamLogo={teams?.[championData!.teamId!]?.images?.primary}
                              label=''
                              iconColor='text-blue-400'
                              delay={1.3}
                              teamBackground={false}
                            />
                          </motion.div>
                        )}
                        {/* Chalk Score Visualization */}
                        <ChalkScoreBar
                          chalky={Math.round(data.percentile)}
                          isRisky={isRisky}
                          groupAverage={
                            bracketSlidesData!.wrapped.group?.chalkScores.data.averageChalk
                              .percentile
                          }
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

      {/* Shareable Content - Moved outside the main component flow */}
      <ShareableContent
        shareableRef={shareableRef}
        backgroundGradient='linear-gradient(to bottom right, #1f2937, #065f46)'
      >
        <StoryCard title={<ChalkScoreTitle animated={false} />} animated={false} showBracket>
          {/* Risk Taker (Low Chalk) */}
          {isRisky ? (
            <div className='mt-4 p-3 rounded-lg border border-white/20 relative'>
              <div className='flex justify-between items-center mb-1'>
                <div className='flex items-center gap-2'>
                  <span className='bg-madness-orange text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                    🔥
                  </span>
                  <span className='text-sm font-bold text-orange-300'>RISK TAKER</span>
                  <span className='text-xs font-bold text-white/60'>{data.upsetsCount} Upsets</span>
                </div>
                <div className='text-xl font-bold text-white bg-madness-orange absolute top-0 right-0 rounded-lg rounded-tl-none rounded-br-none px-2 py-1'>
                  {Math.round(data.percentile)}
                </div>
              </div>
              <BracketOwnerCard
                name={bracketSlidesData!.info.bracket!.data.name}
                bracketName={bracketSlidesData!.info.bracket.data.name}
                teamLogo={teams?.[championData!.teamId!]?.images?.primary}
                label=''
                iconColor='text-orange-400'
                teamBackground={false}
              />
            </div>
          ) : (
            <div className='pb-4 p-3 rounded-lg border border-white/20 relative'>
              <div className='flex justify-between items-center mb-1'>
                <div className='flex items-center gap-2'>
                  <span className='bg-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                    🧊
                  </span>
                  <span className='text-sm font-bold text-blue-300'>PLAYING IT SAFE</span>
                  <span className='text-xs font-bold text-white/60'>{data.upsetsCount} Upsets</span>
                </div>
                <div className='text-xl font-bold text-white bg-blue-600 absolute top-0 right-0 rounded-lg rounded-tl-none rounded-br-none px-2 py-1'>
                  {Math.round(data.percentile)}
                </div>
              </div>
              <BracketOwnerCard
                name={bracketSlidesData!.info.bracket!.data.name}
                bracketName={bracketSlidesData!.info.bracket.data.name}
                teamLogo={teams?.[championData!.teamId!]?.images?.primary}
                label=''
                iconColor='text-blue-400'
                teamBackground={false}
              />
            </div>
          )}
          {/* Static Bar */}
          <div className='mt-6 pb-6'>
            <div className='h-6 w-full bg-gradient-to-r from-blue-700 to-madness-orange rounded-full relative'>
              <div
                className='absolute top-0 h-6 bg-white border-r border-l border-white rounded-full'
                style={{ left: `${Math.round(data.percentile)}%` }}
              />
              <div
                className={
                  isRisky
                    ? 'absolute -top-6 transform -translate-x-[42%] text-orange-500'
                    : 'absolute -top-6 transform -translate-x-[42%] text-madness-blue'
                }
                style={{ left: `${Math.round(data.percentile)}%` }}
              >
                ▼
              </div>
            </div>
          </div>
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
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
          My Risk Index
        </h2>
        <span className='text-3xl' role='img' aria-label='dice'>
          🎲
        </span>
      </div>
      <motion.div
        className='h-1 bg-madness-orange mx-auto mt-4'
        initial={{ width: 0 }}
        animate={{ width: '16rem' }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  )
}

// Chalk Score Bar Component
interface ChalkScoreBarProps {
  chalky: number
  isRisky: boolean
  groupAverage?: number
}

const ChalkScoreBar = ({ chalky, isRisky, groupAverage }: ChalkScoreBarProps) => {
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
        {/* Risk Taker Marker */}
        <motion.div
          className='absolute top-0 h-6 bg-white border-r border-l border-white rounded-full'
          style={{ left: `${chalky}%` }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
        {/* Group Average Marker */}
        {groupAverage && (
          <div
            className='absolute top-0 bottom-0 border-l border-white/40 border-dashed'
            style={{ left: `${groupAverage}%` }}
          />
        )}
        <motion.div
          className={cn(
            'absolute -top-6 transform -translate-x-[42%]',
            isRisky ? 'text-orange-500' : 'text-madness-blue',
          )}
          style={{ left: `${chalky}%` }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: '100%' }}
          transition={{ duration: 0.3, delay: 1.2 }}
        >
          ▼
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default BracketChalkScoreSlide
