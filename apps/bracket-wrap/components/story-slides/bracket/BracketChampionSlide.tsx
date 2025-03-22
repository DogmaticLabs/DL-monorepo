import { useBracketSlides, useStory } from '@/components/providers'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'
import ShareableContent from '../shared/ShareableContent'

// Helper function to format numbers in a compact way (e.g. 1.2m)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return Math.floor(num / 1000000) + 'M'
  }
  if (num >= 1000) {
    return Math.floor(num / 1000) + 'K'
  }
  return num.toString()
}

const BracketChampionSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  // Get the required data
  const { data: championData, shareId } = bracketSlidesData!.wrapped.bracket.championPickNational
  const groupData = bracketSlidesData!.wrapped.bracket.championPickGroup?.data
  const { data: teams } = useTeams()
  const championTeam = teams?.[championData.teamId]

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro animation
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 3500) // Show content after 3.5 seconds

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
        bgColor='bg-gradient-to-br from-slate-900 to-blue-900'
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
                  {/* Trophy animations in background */}
                  {/* <div className='absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none'>
                    <motion.div
                      className='absolute text-[120px] opacity-20'
                      initial={{ scale: 0.3, rotate: -20, y: 200, x: 100 }}
                      animate={{
                        scale: 1.2,
                        rotate: 10,
                        y: -20,
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.3,
                        ease: 'easeOut',
                      }}
                    >
                      🏆
                    </motion.div>
                    <motion.div
                      className='absolute text-[80px] opacity-10 left-1/4 top-1/4'
                      initial={{ scale: 0.2, rotate: 20, y: -100, x: -100 }}
                      animate={{
                        scale: 0.8,
                        rotate: -10,
                        y: 50,
                        x: -50,
                      }}
                      transition={{
                        duration: 1.8,
                        delay: 0.5,
                        ease: 'easeOut',
                      }}
                    >
                      🏆
                    </motion.div>
                  </div> */}

                  <motion.div
                    className='mb-8 z-10'
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    {/* First text - 63 losing teams */}
                    <motion.p
                      className='text-3xl font-black text-center text-white leading-tight tracking-wide'
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      63 losing teams
                    </motion.p>

                    {/* Second text - 1 champion */}
                    <motion.div
                      className='relative mt-4'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 1.0 }}
                    >
                      <motion.p
                        className='text-4xl font-black uppercase text-center text-white tracking-wide bg-madness-orange rounded-lg px-5 py-2 mx-auto'
                        animate={{
                          scale: [1, 1.08, 1],
                          transition: {
                            duration: 0.8,
                            delay: 1.2,
                            repeat: 1,
                            repeatType: 'reverse',
                          },
                        }}
                      >
                        1 CHAMPION
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  {/* Crown animation */}
                  <motion.div
                    className='relative w-[150px] h-[150px] -mt-00 mb-2 flex items-center justify-center'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >
                    <motion.div
                      className='text-[100px]'
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: [20, 0, 10, 0],
                        opacity: 1,
                        rotateY: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        delay: 1.6,
                        // times: [0, 0.6, 0.8, 1],
                        ease: 'easeOut',
                      }}
                    >
                      👑
                    </motion.div>
                  </motion.div>

                  {/* Final text - Who did you have winning it all */}
                  <motion.p
                    className='text-2xl font-bold text-center text-white leading-tight z-10 mt-4'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 2.5,
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
                    Who did you have winning it all?
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
                      <StoryCard cardRef={cardRef} title={<ChampionTitle />} showBracket showGroup>
                        {/* Team logo and name */}
                        <motion.div
                          className='flex flex-col items-center mt-6 mb-6'
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          {/* Team logo with crown */}
                          <motion.div className='relative'>
                            <motion.div
                              className='w-32 h-32 rounded-full overflow-hidden border-4 border-madness-orange shadow-xl flex items-center justify-center'
                              style={{
                                background: `linear-gradient(135deg, ${championTeam?.colors?.primary} 30%, #000 100%)`,
                              }}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 15,
                                delay: 0.5,
                              }}
                            >
                              {championTeam?.id ? (
                                <Image
                                  src={`/team-logos/${championTeam.id}-secondary.png`}
                                  alt={championTeam.name}
                                  width={100}
                                  height={100}
                                  className='w-[80%] h-[80%] object-contain'
                                  unoptimized
                                  priority
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center bg-slate-700'>
                                  <span className='text-4xl'>🏀</span>
                                </div>
                              )}
                            </motion.div>

                            {/* Crown on top */}
                            <motion.div
                              className='absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl'
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.8, duration: 0.5 }}
                            >
                              👑
                            </motion.div>
                          </motion.div>

                          {/* Team name and seed */}
                          <motion.div
                            className='mt-4 text-center'
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                          >
                            <h3 className='text-3xl font-black text-white mb-2'>
                              {championTeam?.name || 'Team'}
                            </h3>
                            <div className='flex justify-center items-center gap-2'>
                              <div
                                className='bg-madness-orange text-white text-sm font-bold rounded-lg px-3 py-0.5 inline-flex items-center gap-1'
                                style={{
                                  background: championTeam?.colors?.primary,
                                }}
                              >
                                <span className='text-xs'>#{championTeam?.seed || '?'}</span>
                                <span>Seed</span>
                              </div>
                              {championTeam?.region?.name && (
                                <div
                                  className='bg-slate-700 text-white text-sm font-bold rounded-lg px-3 py-0.5'
                                  style={{
                                    background: championTeam?.colors?.primary,
                                  }}
                                >
                                  {championTeam.region.name}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Combined stats section (National + Group) */}
                        {championData.count && championData.rank && (
                          <motion.div
                            className='mt-3 relative'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                          >
                            {/* <div className='h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent w-full absolute top-0' /> */}

                            <div className='pb-4 pt-2'>
                              {/* Combined stats - National + Group side by side */}
                              <div className='flex justify-center max-w-full'>
                                {/* National stats */}
                                <div className={`flex flex-col ${groupData ? 'pr-1 w-1/2' : ''}`}>
                                  <h4 className='text-white/70 text-xs font-bold text-center mb-2 uppercase tracking-wider'>
                                    global
                                  </h4>

                                  <div className='flex justify-center gap-x-5'>
                                    <motion.div
                                      className='flex flex-col items-center'
                                      initial={{ y: 10, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 1.1 }}
                                    >
                                      <div className='flex items-baseline'>
                                        <span className='text-lg text-white font-bold'>#</span>
                                        <span className='text-2xl font-black text-white'>
                                          {championData.rank}
                                        </span>
                                      </div>
                                      <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                                        RANK
                                      </div>
                                    </motion.div>

                                    <motion.div
                                      className='flex flex-col items-center'
                                      initial={{ y: 10, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 1.2 }}
                                    >
                                      <div className='text-2xl font-black text-white'>
                                        {formatNumber(championData.count || 0)}
                                      </div>
                                      <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                                        BRACKETS
                                      </div>
                                    </motion.div>
                                  </div>
                                </div>

                                {/* Group stats if available - with divider */}
                                {groupData && (
                                  <>
                                    {/* Vertical divider */}
                                    <div className='mx-1 my-1'>
                                      <div className='h-full w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent' />
                                    </div>

                                    <div className='flex flex-col pl-2 w-1/2'>
                                      <h4 className='text-white/70 text-xs font-bold text-center mb-2 uppercase tracking-wider'>
                                        group
                                      </h4>

                                      <div className='flex justify-center gap-x-5'>
                                        {groupData.rank && (
                                          <motion.div
                                            className='flex flex-col items-center'
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 1.3 }}
                                          >
                                            <div className='flex items-baseline'>
                                              <span className='text-lg text-white font-bold'>
                                                #
                                              </span>
                                              <span className='text-2xl font-black text-white'>
                                                {groupData.rank}
                                              </span>
                                            </div>
                                            <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                                              RANK
                                            </div>
                                          </motion.div>
                                        )}

                                        <motion.div
                                          className='flex flex-col items-center'
                                          initial={{ y: 10, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{ duration: 0.3, delay: 1.4 }}
                                        >
                                          <div className='text-2xl font-black text-white'>
                                            {groupData.count}
                                          </div>
                                          <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                                            BRACKET{groupData.count !== 1 ? 'S' : ''}
                                          </div>
                                        </motion.div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
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
        backgroundGradient={`linear-gradient(to bottom right, ${championTeam?.colors?.primary || '#2c3e50'}, ${championTeam?.colors?.secondary || '#4ca1af'})`}
      >
        <StoryCard
          title={<ChampionTitle animated={false} />}
          animated={false}
          showBracket
          showGroup
        >
          {/* Team logo and name */}
          <div className='flex flex-col items-center mt-6 mb-6'>
            {/* Team logo with crown */}
            <div className='relative'>
              <div
                className='w-32 h-32 rounded-full overflow-hidden border-4 border-madness-orange shadow-xl flex items-center justify-center'
                style={{
                  background: `linear-gradient(135deg, ${championTeam?.colors?.primary} 30%, #000 100%)`,
                }}
              >
                {championTeam?.id ? (
                  <Image
                    src={`/team-logos/${championTeam.id}-secondary.png`}
                    alt={championTeam.name}
                    width={100}
                    height={100}
                    className='w-[80%] h-[80%] object-contain'
                    unoptimized
                    priority
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-slate-700'>
                    <span className='text-4xl'>🏀</span>
                  </div>
                )}
              </div>

              {/* Crown on top */}
              <div className='absolute -top-6 left-1/2 transform -translate-x-1/2 text-3xl'>👑</div>
            </div>

            {/* Team name and seed */}
            <div className='mt-4 text-center'>
              <h3 className='text-3xl font-black text-white mb-2'>
                {championTeam?.name || 'Team'}
              </h3>
              <div className='flex justify-center items-center gap-2'>
                <div
                  className='bg-madness-orange text-white text-sm font-bold rounded-lg px-3 py-0.5 inline-flex items-center gap-1'
                  style={{
                    background: championTeam?.colors?.primary,
                  }}
                >
                  <span className='text-xs'>#{championTeam?.seed || '?'}</span>
                  <span>Seed</span>
                </div>
                {championTeam?.region?.name && (
                  <div
                    className='bg-slate-700 text-white text-sm font-bold rounded-lg px-3 py-0.5'
                    style={{
                      background: championTeam?.colors?.primary,
                    }}
                  >
                    {championTeam.region.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Combined stats section (National + Group) */}
          {championData.count && championData.rank && (
            <div className='mt-3 relative'>
              {/* <div className='h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent w-full absolute top-0' /> */}

              <div className='py-4'>
                {/* Combined stats - National + Group side by side */}
                <div className='flex justify-center max-w-full'>
                  {/* National stats */}
                  <div className={`flex flex-col ${groupData ? 'pr-1 w-1/2' : ''}`}>
                    <h4 className='text-white/70 text-xs font-bold text-center mb-2 uppercase tracking-wider'>
                      global
                    </h4>

                    <div className='flex justify-center gap-x-4'>
                      <div className='flex flex-col items-center'>
                        <div className='flex items-baseline'>
                          <span className='text-lg text-white font-bold'>#</span>
                          <span className='text-2xl font-black text-white'>
                            {championData.rank}
                          </span>
                        </div>
                        <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                          RANK
                        </div>
                      </div>

                      <div className='flex flex-col items-center'>
                        <div className='text-2xl font-black text-white'>
                          {formatNumber(championData.count || 0)}
                        </div>
                        <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                          BRACKETS
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group stats if available - with divider */}
                  {groupData && (
                    <>
                      {/* Vertical divider */}
                      <div className='mx-1 my-1'>
                        <div className='h-full w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent' />
                      </div>

                      <div className='flex flex-col pl-2 w-1/2'>
                        <h4 className='text-white/70 text-xs font-bold text-center mb-2 uppercase tracking-wider'>
                          group
                        </h4>

                        <div className='flex justify-center gap-2'>
                          {groupData.rank && (
                            <div className='flex flex-col items-center'>
                              <div className='flex items-baseline'>
                                <span className='text-lg text-white font-bold'>#</span>
                                <span className='text-2xl font-black text-white'>
                                  {groupData.rank}
                                </span>
                              </div>
                              <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                                RANK
                              </div>
                            </div>
                          )}

                          <div className='flex flex-col items-center'>
                            <div className='text-2xl font-black text-white'>{groupData.count}</div>
                            <div className='text-white/60 text-[10px] mt-0 uppercase h-4 flex items-center justify-center'>
                              BRACKET{groupData.count !== 1 ? 'S' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Title component
interface ChampionTitleProps {
  animated?: boolean
}

const ChampionTitle = ({ animated = true }: ChampionTitleProps) => {
  if (!animated) {
    return (
      <div className='text-center mb-3'>
        <div className='flex justify-center gap-2'>
          <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
            Champion Pick
          </h2>
          <span className='text-3xl' role='img' aria-label='trophy'>
            🏆
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
          Champion Pick
        </h2>
        <span className='text-3xl' role='img' aria-label='trophy'>
          🏆
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

export default BracketChampionSlide
