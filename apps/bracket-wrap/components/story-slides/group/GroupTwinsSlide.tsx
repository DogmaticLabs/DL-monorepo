import { Team, TwinBracketData } from '@/app/api/bracket-data'
import { useBracketSlides, useStory } from '@/components/providers'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import StorySlide from '../../StorySlide'
import ShareButton from '../ShareButton'
import BracketOwnerCard from '../shared/BracketOwnerCard'
import TeamInfo from '../shared/TeamInfo'

const GroupTwinsSlide = () => {
  const [bracketSlidesData] = useBracketSlides()
  const { isExiting } = useStory()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  const { data, shareId } = bracketSlidesData!.wrapped.group!.twinBrackets

  // Animation states
  const [showContent, setShowContent] = useState(false)
  const [basketballExpanded, setBasketballExpanded] = useState(false)
  const { data: teams } = useTeams()

  const furthestSharedTeam = teams![data.furthestSharedPicks.teamIds![0]!]!

  // Handle animation sequence
  useEffect(() => {
    const handleCircleAnimationComplete = () => {
      setBasketballExpanded(true)
    }

    const timer = setTimeout(() => {
      handleCircleAnimationComplete()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

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
      title: `Bracket Twins: ${data.member.displayName} & ${data.twinMember.displayName}`,
      text: `Check out these bracket twins with a ${data.weightedSimilarityPercentage}% match! They have ${data.matchingPicks} identical picks out of 63.`,
      url: `https://bracketwrap.com/brackets/${data.bracketId}?shareId=${shareId}`,
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
        bgColor={
          basketballExpanded ? 'bg-[#FF6B00]' : 'bg-gradient-to-br from-indigo-900 to-violet-800'
        }
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
                  className='flex flex-col items-center justify-center h-full'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {/* First line with letter-by-letter reveal */}
                  <div className='overflow-hidden'>
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: 0 }}
                      className='flex items-center justify-center'
                    >
                      {'Some do their research...'.split('').map((letter, index) => (
                        <motion.span
                          key={`first-${index}`}
                          className='text-3xl font-black text-white tracking-wide inline-block'
                          initial={{ y: 100, opacity: 0, rotateY: 90 }}
                          animate={{ y: 0, opacity: 1, rotateY: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.1 + index * 0.03,
                            ease: 'backOut',
                          }}
                        >
                          {letter === ' ' ? '\u00A0' : letter}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>

                  {/* Second line with separate animations for text parts */}
                  <motion.div
                    className='text-3xl font-black text-center text-white leading-tight mt-4 tracking-wide perspective-[1000px]'
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.1,
                      ease: 'easeOut',
                    }}
                  >
                    {/* "Others just" animating from left */}
                    <motion.span
                      className='inline-block text-white'
                      initial={{ x: '-200vw' }}
                      animate={{ x: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 1.1,
                        ease: 'easeOut',
                      }}
                    >
                      Others just{' '}
                    </motion.span>

                    {/* "COPY" animating from right */}
                    <motion.span
                      className='relative inline-block px-2 bg-orange-500 rounded-lg ml-2'
                      initial={{ x: '200vw' }}
                      animate={{ x: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 1.1, // Slightly delayed after "Others just"
                        ease: 'easeOut',
                      }}
                      // Add the scale animation after both elements are in place
                      whileInView={{
                        scale: [1, 1.2, 1],
                        transition: {
                          duration: 0.6,
                          delay: 0.3,
                        },
                      }}
                    >
                      COPY
                    </motion.span>
                  </motion.div>

                  {/* Third line with bouncing entrance */}
                  <motion.div className='overflow-hidden mt-8'>
                    <motion.p
                      className='text-xl font-black text-center text-white tracking-wide'
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 2.4,
                        type: 'spring',
                        stiffness: 100,
                      }}
                    >
                      Here are your group twins 👯‍♀️
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
                      <StoryCard cardRef={cardRef} title={<GroupTwinsTitle />} showGroup>
                        <SimilaritySection twinsData={data} />
                        <div className='mt-5 mb-2'>
                          <BracketOwnerCard
                            name={data.member.displayName}
                            bracketName={data.bracketName}
                            teamLogo={teams?.[data.bracketWinnerId!]?.images.primary}
                            delay={0.4}
                            teamBackground={false}
                          />
                          <BracketOwnerCard
                            name={data.twinMember.displayName}
                            bracketName={data.twinBracketName}
                            teamLogo={teams?.[data.twinWinnerId!]?.images.primary}
                            delay={0.6}
                            teamBackground={false}
                          />
                        </div>
                        <FurthestSharedTeam
                          team={furthestSharedTeam}
                          round={data.furthestSharedPicks.round.name}
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
        backgroundGradient='linear-gradient(to bottom right, #5D3FD3, #FF6B00)'
      >
        <StoryCard title={<GroupTwinsTitle />} animated={false} showGroup>
          <SimilaritySection twinsData={data} />
          <div className='mt-5 mb-1'>
            <BracketOwnerCard
              name={data.member.displayName}
              bracketName={data.bracketName}
              teamLogo={teams?.[data.bracketWinnerId!]?.images.primary}
              delay={0.4}
              teamBackground={false}
            />
            <BracketOwnerCard
              name={data.twinMember.displayName}
              bracketName={data.twinBracketName}
              teamLogo={teams?.[data.twinWinnerId!]?.images.primary}
              delay={0.6}
              teamBackground={false}
            />
          </div>
          <FurthestSharedTeam
            team={furthestSharedTeam}
            round={data.furthestSharedPicks.round.name}
          />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Bracket Twins Title component
const GroupTwinsTitle = () => {
  return (
    <motion.div
      className='text-center'
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex justify-center gap-2'>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>Group Twins</h2>
        <span className='text-3xl' role='img' aria-label='twins'>
          👯
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
const SimilaritySection: React.FC<{ twinsData: TwinBracketData }> = ({ twinsData }) => {
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
                {Math.round(twinsData.weightedSimilarityPercentage)}
              </motion.div>
              <span className='text-3xl text-white font-extrabold'>%</span>
            </div>
            <p className='text-sm text-white/60 tracking-wide font-extrabold leading-4'>
              Similarity
            </p>
          </div>

          {/* Visual representation of matching picks */}
          <div className='w-full'>
            <div className='flex justify-between text-sm font-bold text-white/70 mb-1'>
              <span>Common Picks</span>
              <span>{twinsData.matchingPicks} of 63</span>
            </div>
            <div className='w-full bg-white/10 h-2 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-madness-orange'
                initial={{ width: 0 }}
                animate={{ width: `${(twinsData.matchingPicks * 100) / 63}%` }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// FurthestSharedTeam component showing the furthest team they both picked
const FurthestSharedTeam: React.FC<{ team: Team; round: string }> = ({ team, round }) => {
  return (
    <motion.div
      className='w-full rounded-lg py-4'
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <h4 className='text-sm font-extrabold text-white/60 tracking-wide mb-2'>
        Furthest Shared Team
      </h4>
      <TeamInfo team={team} tags={[round]} />
    </motion.div>
  )
}

export default GroupTwinsSlide
