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
                  className='flex flex-col items-center justify-center h-full relative'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {/* First line with unique mirror effect suitable for twins */}
                  <div className=''>
                    <motion.div
                      className='flex flex-col items-center justify-center'
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      {/* Great minds think alike phrase with animation */}
                      <motion.div className='flex flex-col items-center justify-center'>
                        <motion.div
                          className='bg-[#ff6b00] px-4 py-2 rounded-lg shadow-lg mb-3 text-4xl font-black text-white tracking-wide'
                          initial={{ opacity: 0, y: -30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileInView={{
                            scale: [1, 1.05, 1],
                            transition: {
                              duration: 0.6,
                              delay: 1.0,
                            },
                          }}
                        >
                          GREAT MINDS
                        </motion.div>

                        <motion.div
                          className='text-4xl font-black text-white tracking-wide'
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                        >
                          THINK ALIKE
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Final call to action with twin emoji */}
                  <motion.div
                    className='mt-10'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.8, type: 'spring', stiffness: 120 }}
                  >
                    <motion.div
                      className='text-xl font-bold text-center text-white flex items-center justify-center'
                      animate={{
                        textShadow: [
                          '0px 0px 0px rgba(255,255,255,0)',
                          '0px 0px 10px rgba(255,255,255,0.7)',
                          '0px 0px 0px rgba(255,255,255,0)',
                        ],
                      }}
                      transition={{ duration: 0.8, delay: 2.2, repeat: 0 }}
                    >
                      Let's meet your group's bracket twins 👯‍♀️
                    </motion.div>
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
                            teamLogo={
                              teams?.[data.bracketWinnerId!]?.id
                                ? `/team-logos/${teams?.[data.bracketWinnerId!]?.id}-primary.png`
                                : '/placeholder-team.png'
                            }
                            delay={0.4}
                            teamBackground={false}
                          />
                          <BracketOwnerCard
                            name={data.twinMember.displayName}
                            bracketName={data.twinBracketName}
                            teamLogo={
                              teams?.[data.twinWinnerId!]?.id
                                ? `/team-logos/${teams?.[data.twinWinnerId!]?.id}-primary.png`
                                : '/placeholder-team.png'
                            }
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
              teamLogo={
                teams?.[data.bracketWinnerId!]?.id
                  ? `/team-logos/${teams?.[data.bracketWinnerId!]?.id}-primary.png`
                  : '/placeholder-team.png'
              }
              delay={0.4}
              teamBackground={false}
            />
            <BracketOwnerCard
              name={data.twinMember.displayName}
              bracketName={data.twinBracketName}
              teamLogo={
                teams?.[data.twinWinnerId!]?.id
                  ? `/team-logos/${teams?.[data.twinWinnerId!]?.id}-primary.png`
                  : '/placeholder-team.png'
              }
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
