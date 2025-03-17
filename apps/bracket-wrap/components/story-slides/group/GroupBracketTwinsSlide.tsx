import { useBracketSlides, useStory } from '@/components/providers'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import StorySlide from '../../StorySlide'
import GroupSlideBanner from './GroupSlideBanner'

// Animated Basketball Circle component
const BasketballCircleExpansion = () => {
  return (
    <motion.div
      className='absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className='bg-madness-blue rounded-full flex items-center justify-center'
        initial={{ scale: 1 }}
        animate={{
          scale: 12,
        }}
        transition={{
          duration: 1.5,
          ease: [0.19, 1.0, 0.22, 1.0], // Expo ease out for smooth expansion
          delay: 0.2,
        }}
      >
        <div className='w-20 h-20 rounded-full' />
      </motion.div>
    </motion.div>
  )
}

// Animated Decorative Elements
const DecorativeElements = ({ isExiting = false }) => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none z-10'>
      {/* Basketballs */}
      <motion.div
        className='absolute top-[5%] right-[10%] text-5xl'
        initial={{ y: -100, opacity: 0, rotate: 0 }}
        animate={
          isExiting
            ? { y: -200, opacity: 0, rotate: 180 }
            : { y: 0, opacity: 0.7, rotate: [0, 360] }
        }
        transition={
          isExiting
            ? { duration: 0.5 }
            : {
                y: { duration: 0.7, ease: 'easeOut' },
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 0.5 },
              }
        }
      >
        <span role='img' aria-label='basketball' className='text-white'>
          🏀
        </span>
      </motion.div>

      <motion.div
        className='absolute bottom-[15%] left-[8%] text-4xl'
        initial={{ y: 100, opacity: 0, rotate: 0 }}
        animate={
          isExiting
            ? { y: 200, opacity: 0, rotate: -180 }
            : { y: 0, opacity: 0.6, rotate: [0, -360] }
        }
        transition={
          isExiting
            ? { duration: 0.5 }
            : {
                y: { duration: 0.7, ease: 'easeOut', delay: 0.2 },
                rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 0.5, delay: 0.2 },
              }
        }
      >
        <span role='img' aria-label='basketball' className='text-white'>
          🏀
        </span>
      </motion.div>

      {/* Brackets */}
      <motion.div
        className='absolute top-[20%] left-[10%] opacity-50 w-20 h-20'
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={
          isExiting
            ? { opacity: 0, scale: 0.2, x: -100 }
            : { opacity: 0.5, scale: 1, rotate: [-20, -15, -20] }
        }
        transition={
          isExiting
            ? { duration: 0.5 }
            : {
                opacity: { duration: 0.5, delay: 0.3 },
                scale: { duration: 0.5, delay: 0.3 },
                rotate: { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              }
        }
      >
        <Image
          src='/bracket.png'
          alt='Bracket'
          width={80}
          height={80}
          className='w-full h-full object-contain invert'
        />
      </motion.div>

      <motion.div
        className='absolute bottom-[25%] right-[12%] opacity-40 w-16 h-16'
        initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
        animate={
          isExiting
            ? { opacity: 0, scale: 0.2, x: 100 }
            : { opacity: 0.4, scale: 1, rotate: [20, 15, 20] }
        }
        transition={
          isExiting
            ? { duration: 0.5 }
            : {
                opacity: { duration: 0.5, delay: 0.4 },
                scale: { duration: 0.5, delay: 0.4 },
                rotate: {
                  duration: 3.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
              }
        }
      >
        <Image
          src='/bracket.png'
          alt='Bracket'
          width={64}
          height={64}
          className='w-full h-full object-contain invert'
          style={{ transform: 'scaleX(-1)' }} // Flip horizontally
        />
      </motion.div>

      {/* Subtle pattern overlay */}
      <div className='absolute inset-0 bg-gradient-radial from-transparent to-black/10 pointer-events-none' />
    </div>
  )
}

const GroupBracketTwinsSlide = () => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()

  // Animation states
  const [showIntroText, setShowIntroText] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [basketballExpanded, setBasketballExpanded] = useState(false)

  // Placeholder data - would be replaced with actual data in production
  const twinsData = {
    person1: {
      name: 'Michael Chen',
      bracketName: "Mike's Madness",
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      chosenWinner: 'UConn',
    },
    person2: {
      name: 'Jessica Rodriguez',
      bracketName: "Jess's Journey",
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      chosenWinner: 'UConn',
    },
    matchingPicks: 58,
    totalPicks: 63,
    similarityPercentage: 92.1,
  }

  // Stub data for group info
  const groupInfo = {
    name: 'Cantonsville',
    memberCount: 24,
  }

  // Handle animation sequence
  useEffect(() => {
    const handleCircleAnimationComplete = () => {
      setBasketballExpanded(true)
      setShowIntroText(true)
    }

    const timer = setTimeout(() => {
      handleCircleAnimationComplete()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Transition to content after the intro text
  useEffect(() => {
    if (showIntroText) {
      const timer = setTimeout(() => {
        setShowIntroText(false)
        setShowContent(true)
      }, 3500) // Show intro text for 3.5 seconds

      return () => clearTimeout(timer)
    }
  }, [showIntroText])

  return (
    <StorySlide
      bgColor={
        basketballExpanded ? 'bg-[#FF6B00]' : 'bg-gradient-to-br from-indigo-900 to-violet-800'
      }
      footer={<GroupSlideBanner />}
    >
      <div className='relative flex flex-col w-full h-full overflow-hidden'>
        {/* Basketball circle expansion animation - always visible during expansion phase */}
        <BasketballCircleExpansion />

        {/* Decorative background elements - only shown after expansion */}
        {basketballExpanded && <DecorativeElements isExiting={isExiting} />}

        {/* Content container with padding */}
        <div className='flex flex-col items-center justify-center gap-6 w-full px-4 py-6 flex-1 z-20'>
          <AnimatePresence mode='wait'>
            {showIntroText && (
              <motion.div
                key='intro'
                className='flex flex-col items-center justify-center h-full'
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                {/* First line with letter-by-letter reveal */}
                <div className='overflow-hidden'>
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 0 }}
                    className='flex items-center justify-center'
                  >
                    {'GREAT MINDS'.split('').map((letter, index) => (
                      <motion.span
                        key={`first-${index}`}
                        className='text-4xl font-black text-white uppercase tracking-wide inline-block'
                        initial={{ y: 100, opacity: 0, rotateY: 90 }}
                        animate={{ y: 0, opacity: 1, rotateY: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 + index * 0.07,
                          ease: 'backOut',
                        }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* Second line with 3D flip effect */}
                <motion.div
                  className='text-5xl font-black text-center text-white leading-tight mt-4 uppercase tracking-wide perspective-[1000px]'
                  initial={{ opacity: 0, scale: 0.3, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.1,
                    ease: 'easeOut',
                  }}
                >
                  <motion.span
                    className='inline-block text-white'
                    animate={{
                      scale: [1, 1.2, 1],
                      // textShadow: [
                      //   '0 0 0 rgba(255,255,255,0)',
                      //   '0 0 20px rgba(255,255,255,0.5)',
                      //   '0 0 0 rgba(255,255,255,0)',
                      // ],
                    }}
                    transition={{
                      duration: 1.8,
                      // repeat: Infinity,
                      // repeatDelay: 0.5,
                    }}
                  >
                    THINK ALIKE
                  </motion.span>
                </motion.div>

                {/* Third line with bouncing entrance */}
                <motion.div className='overflow-hidden mt-8'>
                  <motion.p
                    className='text-3xl font-black text-center text-white uppercase tracking-wide'
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 2.0,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <motion.span
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: 2,
                        repeatDelay: 0.1,
                        ease: 'easeOut',
                        delay: 2.5,
                      }}
                      className='inline-block'
                    >
                      Meet your bracket twins!
                    </motion.span>
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {showContent && !isExiting && (
              <motion.div
                key='content'
                className='w-full max-w-md mx-auto'
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                {/* Title with emoji animation */}
                <motion.div
                  className='mb-6 text-center'
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <motion.div
                    className='inline-block mb-3'
                    animate={{
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: [1, 1.3, 1.3, 1.2, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      ease: 'easeInOut',
                      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    }}
                  >
                    <span className='text-5xl' role='img' aria-label='twins'>
                      👯
                    </span>
                  </motion.div>
                  <h2 className='text-4xl font-black text-white uppercase tracking-tighter'>
                    BRACKET TWINS
                  </h2>
                  <div className='h-1 w-32 bg-white mx-auto mt-2'></div>
                </motion.div>

                {/* Similarity Percentage */}
                <motion.div
                  className='flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-full mt-6'
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className='text-xl text-[#FF6B00] font-bold'>
                    {twinsData.similarityPercentage}% Match
                  </p>
                </motion.div>

                {/* Person 1 Profile Card */}
                <motion.div
                  className='w-full bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border-l-4 border-white mt-6'
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, y: [-5, 5, -5, 5, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    y: {
                      duration: 0.5,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      ease: 'easeOut',
                      delay: 0.4,
                    },
                  }}
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex-shrink-0 flex flex-col items-center gap-2'>
                      <motion.div
                        className='w-20 h-20 rounded-md overflow-hidden border-2 border-white/70 bg-white flex items-center justify-center'
                        animate={{ rotate: [0, 2, 0, -2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Image
                          src='/team-logos/1.png'
                          alt={twinsData.person1.name}
                          width={80}
                          height={80}
                          className='w-16 h-16 object-contain'
                        />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className='text-2xl font-black text-white uppercase tracking-tight'>
                        {twinsData.person1.name}
                      </h3>
                      <p className='text-white/80 font-bold'>{twinsData.person1.bracketName}</p>
                      <div className='flex items-center mt-1'>
                        <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2'>
                          <span className='text-xs'>🏆</span>
                        </div>
                        <p className='text-sm text-white font-bold'>
                          {twinsData.person1.chosenWinner}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Person 2 Profile Card */}
                <motion.div
                  className='w-full bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg border-l-4 border-white mt-6'
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, y: [5, -5, 5, -5, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6,
                    y: {
                      duration: 0.5,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      ease: 'easeOut',
                      delay: 0.6,
                    },
                  }}
                >
                  <div className='flex items-center gap-4'>
                    <div className='flex-shrink-0 flex flex-col items-center gap-2'>
                      <motion.div
                        className='w-20 h-20 rounded-md overflow-hidden border-2 border-white/70 bg-white flex items-center justify-center'
                        animate={{ rotate: [0, -2, 0, 2, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Image
                          src='/team-logos/1.png'
                          alt={twinsData.person2.name}
                          width={80}
                          height={80}
                          className='w-16 h-16 object-contain'
                        />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className='text-2xl font-black text-white uppercase tracking-tight'>
                        {twinsData.person2.name}
                      </h3>
                      <p className='text-white/80 font-bold'>{twinsData.person2.bracketName}</p>
                      <div className='flex items-center mt-1'>
                        <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2'>
                          <span className='text-xs'>🏆</span>
                        </div>
                        <p className='text-sm text-white font-bold'>
                          {twinsData.person2.chosenWinner}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Matching Details */}
                <motion.div
                  className='w-full bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-lg border-l-4 border-white mt-6'
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h4 className='text-xl font-black text-white mb-3 uppercase tracking-wide'>
                    Matching Details
                  </h4>

                  <div className='space-y-4'>
                    <div>
                      <p className='text-sm text-white/80 font-bold'>Matching Picks</p>
                      <p className='text-xl font-black text-white'>
                        {twinsData.matchingPicks} of {twinsData.totalPicks}
                      </p>
                    </div>

                    {/* Visual representation of matching picks */}
                    <div className='w-full bg-white/10 h-6 rounded-full overflow-hidden'>
                      <motion.div
                        className='h-full bg-white'
                        initial={{ width: 0 }}
                        animate={{ width: `${twinsData.similarityPercentage}%` }}
                        transition={{ duration: 1.2, delay: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Fun Fact */}
                <motion.div
                  className='w-full bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border-l-4 border-white mt-6'
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <p className='text-center text-white font-bold'>
                    <span className='text-white uppercase'>Fun fact:</span> These brackets are so
                    similar, they
                    {twinsData.person1.chosenWinner === twinsData.person2.chosenWinner
                      ? ' both picked the same champion!'
                      : ' only differ on their champion pick!'}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupBracketTwinsSlide
