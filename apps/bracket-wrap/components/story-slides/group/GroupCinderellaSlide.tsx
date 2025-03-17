import { Team } from '@/app/api/bracket-data'
import { useBracketSlides, useStory } from '@/components/providers'
import { CinderellaAnimatedBackground } from '@/components/story-slides/animations/CinderellaAnimatedElements'
import ShareableContent from '@/components/story-slides/shared/ShareableContent'
import StoryCard from '@/components/story-slides/shared/StoryCard'
import StorySlide from '@/components/StorySlide'
import { useShareContent } from '@/hooks/useShareContent'
import { useTeams } from '@/hooks/useTeams'
import { Trophy } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import ShareButton from '../ShareButton'

// Types for our components
type CinderellaData = Team & {
  roundReached: string
  bracketOwner: {
    name: string
    avatarUrl: string
    bracketName: string
  }
}

const GroupCinderellaSlide = () => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()
  const cardRef = useRef<HTMLDivElement>(null)
  const shareableRef = useRef<HTMLDivElement>(null)
  const { isSharing, shareContent } = useShareContent()

  const teamData =
    Object.values(teams ?? {})[Math.floor(Math.random() * Object.values(teams ?? {}).length)] ??
    ({} as Team)

  const team = {
    ...teamData,
    team: teamData.name,
    seed: teamData.seed,
    roundReached: 'Elite Eight',
    bracketOwner: {
      name: 'RyanMarcus',
      avatarUrl:
        Object.values(teams ?? {})[Math.floor(Math.random() * Object.values(teams ?? {}).length)]
          ?.images.primary ?? '',
      bracketName: "RyanMarcus's Pick's 1",
    },
    // bracketCount:  ,
    teamId: teamData.id,
  }

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 4000) // Show content after 4 seconds, matching the GroupTopPicksSlide timing

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
      title: `${team.name} - The Cinderella Story`,
      text: `Check out ${team.name}, the #${team.seed} seed that made it to the ${team?.roundReached}!`,
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
          {/* Decorative elements - now appearing first with their own animations */}
          <CinderellaAnimatedBackground isExiting={isExiting} elements={animationElements as any} />

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
                  <motion.p
                    className='text-2xl font-black uppercase text-center text-white leading-tight tracking-wide relative z-10'
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  >
                    Everyone loves an
                  </motion.p>

                  <motion.p
                    className='text-5xl font-black uppercase text-center text-white leading-tight tracking-wide rounded-lg bg-[#ff6b00] px-3 py-1 shadow-lg mt-4'
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    Underdog
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
                    Let's meet your group's craziest Cinderella Story 👸
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
                      <StoryCard cardRef={cardRef} title={<CinderellaTitle />}>
                        <TeamInfo cinderellaData={team} />
                        <BracketOwnerSection bracketOwner={team.bracketOwner} />
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

      <ShareableContent
        shareableRef={shareableRef}
        backgroundGradient='linear-gradient(to bottom right, #0067b1, #000000, #0067b1)'
      >
        <StoryCard title={<CinderellaTitle />}>
          <TeamInfo cinderellaData={team} />
          <BracketOwnerSection bracketOwner={team.bracketOwner} />
        </StoryCard>
      </ShareableContent>
    </div>
  )
}

// Animation elements configuration
const animationElements = {
  flashes: [
    // Flash effect 1
    { top: '15%', left: '20%', size: '100px', color: 'blue', opacity: 0.3, speed: 'medium' },
    { top: '10%', right: '10%', size: '80px', color: 'white', opacity: 0.2, speed: 'fast' },
    { bottom: '10%', left: '10%', size: '120px', color: 'blue', opacity: 0.3, speed: 'slow' },
    { bottom: '10%', right: '10%', size: '90px', color: 'white', opacity: 0.2, speed: 'medium' },
  ],
}

interface TeamInfoProps {
  cinderellaData: CinderellaData
  // teams: any
}

interface BracketOwnerSectionProps {
  bracketOwner: CinderellaData['bracketOwner']
}

// TeamInfo component
const TeamInfo: React.FC<TeamInfoProps> = ({ cinderellaData }) => {
  // Get the team's primary color or use a default color
  const primaryColor = cinderellaData.colors.primary
  const secondaryColor = cinderellaData.colors.secondary

  return (
    <motion.div
      className='flex items-center gap-4 mt-8 mb-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Team Logo with enhanced rotation and bounce animation */}
      <motion.div
        className='flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-white flex items-center justify-center border'
        initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          scale: { type: 'spring', stiffness: 300, damping: 15 },
          rotate: { type: 'spring', stiffness: 200, damping: 10 },
        }}
        style={{ backgroundColor: primaryColor, borderColor: 'white' }}
      >
        <Image
          src={cinderellaData.images.secondary || '/placeholder-team.png'}
          alt={cinderellaData.name}
          width={48}
          height={48}
          className='w-12 h-12 object-contain'
        />
      </motion.div>

      {/* Team Name and Details with staggered animations */}
      <div className='flex-1 min-w-0'>
        <motion.h3
          className='text-3xl font-black text-white tracking-tight'
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {cinderellaData.name}
        </motion.h3>
        <div className='flex items-center gap-2 mt-0'>
          {/* Region with seed in parentheses */}
          <motion.span
            className='bg-madness-blue px-3 py-1 rounded text-white font-black uppercase text-sm tracking-wide'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.7,
              type: 'spring',
              stiffness: 300,
            }}
            style={{ backgroundColor: primaryColor }}
          >
            {cinderellaData.seed} SEED
          </motion.span>

          {/* Round Reached with pulsing highlight */}
          <motion.span
            className='px-3 py-1 rounded font-black uppercase text-sm tracking-wide'
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              delay: 0.9,
              type: 'spring',
              stiffness: 300,
            }}
            style={{ backgroundColor: primaryColor }}
          >
            {cinderellaData.roundReached}
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

// Reusable BracketOwnerSection component
const BracketOwnerSection: React.FC<BracketOwnerSectionProps> = ({ bracketOwner }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className='pt-2 pb-2 border-white/20'>
        <h4 className='text-sm font-black text-white/60 mb-1 uppercase tracking-wide'>
          Selected By:
        </h4>
        <div className='flex items-center gap-4'>
          <div className='flex-1 flex items-center gap-x-2'>
            <Trophy className='h-5 w-5 text-madness-orange' />
            <div className='flex flex-col gap-x-2'>
              <p className='font-black text-lg text-white truncate'>{bracketOwner.bracketName}</p>
              <p className='text-white/60 truncate font-bold text-sm'>{bracketOwner.name}</p>
            </div>
          </div>
          <Image
            src={bracketOwner.avatarUrl}
            alt={bracketOwner.name}
            width={36}
            height={36}
            className='w-9 h-9 object-cover rounded-lg border bg-white p-[1px]'
          />
        </div>
      </div>
    </motion.div>
  )
}

// Reusable Title component
const CinderellaTitle: React.FC = () => {
  return (
    <motion.div
      className='text-center'
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex justify-center gap-2'>
        <h2 className='text-4xl font-black text-white tracking-tight leading-none'>
          Cinderella Story
        </h2>
        <span className='text-3xl' role='img' aria-label='trophy'>
          👸
        </span>
      </div>
      <motion.div
        className='h-1 bg-cinderella mx-auto mt-2 bg-madness-orange'
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

export default GroupCinderellaSlide
