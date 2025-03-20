import { FinalFourPickData, FinalFourPickGroupData } from '@/app/api/bracket-data'
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

const BracketFinalFourSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  const { data: finalFourGroupData, shareId: finalFourGroupShareId } =
    bracketSlidesData!.wrapped.bracket.finalFourPicksGroup!
  const { data: finalFourNationalData } = bracketSlidesData!.wrapped.bracket.finalFourPicksNational!

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
      title: 'My Final Four Picks',
      text: `Check out my Final Four picks for March Madness!`,
      url: `https://bracketwrap.com/share/${finalFourGroupShareId}`,
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
                  className='flex h-full relative items-center'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <motion.div className='flex flex-col items-center max-w-sm'>
                    {/* Title with simple fade-in */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className='mb-8'
                    >
                      <h2 className='text-5xl font-black text-white text-center tracking-tight'>
                        YOUR FINAL FOUR
                      </h2>
                    </motion.div>

                    {/* Simplified brackets animation */}
                    <div className='relative flex justify-center items-center w-full mb-6'>
                      <motion.div
                        className='text-7xl text-white/80 font-black absolute'
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: -20, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                        }}
                      >
                        [
                      </motion.div>

                      <motion.div
                        className='flex items-center justify-center size-20 bg-madness-orange rounded-full z-10'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.4,
                        }}
                      >
                        <span className='text-3xl'>4️⃣</span>
                      </motion.div>

                      <motion.div
                        className='text-7xl text-white/80 font-black absolute'
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 20, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                        }}
                      >
                        ]
                      </motion.div>
                    </div>

                    {/* Subtitle with simple fade-in */}
                    <motion.div
                      className='text-center mt-4'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <p className='text-xl text-white font-medium'>
                        Let's see how your picks compare
                      </p>
                      <p className='text-xl text-white font-medium mt-2'>
                        to your group and the nation
                      </p>
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
                      <StoryCard cardRef={cardRef} title={<FinalFourTitle />} showGroup showBracket>
                        <FinalFourGrid
                          groupData={finalFourGroupData}
                          nationalData={finalFourNationalData}
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
        backgroundGradient='linear-gradient(to bottom right, #FF7E5F, #FEB47B)'
      >
        <StoryCard animated={false} title={<FinalFourTitle />}>
          <FinalFourGrid groupData={finalFourGroupData} nationalData={finalFourNationalData} />
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
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
          My Final Four
        </h2>
        <span className='text-3xl' role='img' aria-label='basketball'>
          4️⃣
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

// 2x2 Grid component for Final Four teams
interface FinalFourGridProps {
  groupData: FinalFourPickGroupData[]
  nationalData: FinalFourPickData[]
}

const FinalFourGrid: React.FC<FinalFourGridProps> = ({
  groupData,
  nationalData,
}: FinalFourGridProps) => {
  const { data: teams } = useTeams()
  const [bracketSlidesData] = useBracketSlides()
  const groupMemberCount = bracketSlidesData?.info.group?.data.size ?? 1

  return (
    <motion.div
      className='mt-4 mb-4 flex flex-col'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Table header */}
      <motion.div
        className='grid grid-cols-5 gap-2 mb-3 items-end -mr-2'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className='text-white/60 text-sm font-bold align-bottom col-span-3'>Team</div>
        <div className='flex items-center gap-1 justify-center col-span-1'>
          <div className='w-6 h-6 rounded-full flex items-center justify-center bg-madness-orange'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4 h-4 text-white'
            >
              <path
                fillRule='evenodd'
                d='M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z'
                clipRule='evenodd'
              />
              <path d='M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z' />
            </svg>
          </div>
        </div>
        <div className='flex items-center gap-1 justify-center col-span-1'>
          <div className='w-6 h-6 rounded-full flex items-center justify-center bg-madness-blue mr-2'>
            <span role='img' aria-label='national' className='text-lg'>
              🌎
            </span>
          </div>
          {/* <div className='text-white/60 text-sm font-bold'>National %</div> */}
        </div>
      </motion.div>

      {/* Team rows */}
      {groupData?.map((team, index) => {
        const teamData = teams?.[team.teamId]
        return (
          <motion.div
            key={team.teamId}
            className='grid grid-cols-5 backdrop-blur-sm rounded-lg py-1 mb-1 -mr-2'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.2 + index * 0.1,
            }}
          >
            {/* Team info */}
            <div className='flex items-center gap-2 col-span-3'>
              <motion.div
                className='shrink-0 h-10 w-10 rounded-md flex items-center justify-center shadow-md overflow-hidden'
                style={{ backgroundColor: teamData?.colors?.primary }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <Image
                  src={teamData?.images?.secondary ?? ''}
                  alt={teamData?.name ?? ''}
                  width={28}
                  height={28}
                  className='object-contain'
                />
              </motion.div>
              <div className='flex flex-col'>
                <p className='text-white font-bold text-sm leading-tight truncate max-w-[130px]'>
                  {teamData?.name ?? ''}
                </p>
                <span className='text-white/60 text-xs font-bold flex-shrink-0'>
                  {teamData?.region?.name} ({teamData?.seed})
                </span>
              </div>
            </div>

            {/* Group percentage */}
            <motion.div
              className='flex flex-col justify-center items-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <div className='flex items-start justify-start'>
                <span className='text-white font-bold text-lg relative leading-4 '>
                  {Math.round((team.count / groupMemberCount) * 100)}
                </span>
                <span className='text-[10px] leading-3 font-semibold'>%</span>
              </div>
              <div className='text-white/60 font-bold text-xs relative'>
                <span className='leading-4'>1/{team.uniqueTeams}</span>
              </div>
            </motion.div>

            {/* National percentage */}
            <motion.div
              className='flex flex-col justify-center items-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <div className='flex items-start justify-start'>
                <span className='text-white font-bold text-lg relative leading-4 '>
                  {Math.round(
                    (nationalData[index]!.count / bracketSlidesData!.info.global.count!) * 100,
                  )}
                </span>
                <span className='text-[10px] leading-3 font-semibold'>%</span>
              </div>
              <div className='text-white/60 font-bold text-xs relative'>
                <span className='leading-4'>1/16</span>
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Legend for emoji explanations */}
      <motion.div
        className='mt-3 rounded-lg py-1 px-2 text-xs text-white/80'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <div className='flex flex-col space-y-1'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full flex items-center justify-center bg-madness-orange'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-4 h-4 text-white'
              >
                <path
                  fillRule='evenodd'
                  d='M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z'
                  clipRule='evenodd'
                />
                <path d='M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z' />
              </svg>
            </div>
            <span className='text-xs font-semibold'>
              % of brackets in your group with this team
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 rounded-full flex items-center justify-center bg-madness-blue'>
              <span role='img' aria-label='national' className='text-lg'>
                🌎
              </span>
            </div>
            <span className='text-xs font-semibold'>% of brackets globally with this team</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BracketFinalFourSlide
