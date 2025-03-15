import { useBracketSlides, useStory } from '@/components/providers'
import { CinderellaAnimatedBackground } from '@/components/story-slides/animations/CinderellaAnimatedElements'
import StorySlide from '@/components/StorySlide'
import { useTeams } from '@/hooks/useTeams'
import html2canvas from 'html2canvas'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import GroupSlideBanner from './GroupSlideBanner'

const GroupCinderellaSlide = () => {
  const [data] = useBracketSlides()
  const { isExiting } = useStory()
  const { data: teams } = useTeams()
  const [showShareButton, setShowShareButton] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isSharing, setIsSharing] = useState(false)

  // Placeholder data - would be replaced with actual data in production
  const cinderellaData = {
    team: "Saint Peter's",
    seed: 15,
    roundReached: 'Elite Eight',
    bracketCount: 12, // Number of brackets with this pick
    teamId: 'a47cb771-c12d-11ee-b568-d9cd047f74cf', // Placeholder ID
    bracketOwner: {
      name: 'Sarah Johnson',
      bracketName: 'March Madness Magic',
      avatarUrl: 'https://i.pravatar.cc/150?img=5', // Placeholder avatar URL
    },
  }

  // Log when isExiting changes
  useEffect(() => {
    console.log('isExiting changed:', isExiting)
  }, [isExiting])

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    if (!showContent) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 3500) // Show content after 3.5 seconds

      return () => clearTimeout(timer)
    }
  }, [showContent])

  // Show share button after content is displayed
  useEffect(() => {
    if (showContent) {
      const timer = setTimeout(() => {
        setShowShareButton(true)
      }, 2000) // Show share button 2 seconds after content appears

      return () => clearTimeout(timer)
    }
  }, [showContent])

  // Function to capture the card as an image
  const captureCardAsImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null

    try {
      // Set a flag to indicate sharing is in progress
      setIsSharing(true)

      // Capture the card element
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null, // Transparent background
        logging: false,
        useCORS: true, // Enable CORS for images
      })

      // Add watermark
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Save the current state
        ctx.save()

        // Add watermark text
        ctx.font = '14px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.textAlign = 'right'
        ctx.fillText('bracketwrap.com', canvas.width - 10, canvas.height - 10)

        // Restore the state
        ctx.restore()
      }

      // Convert canvas to blob
      return new Promise(resolve => {
        canvas.toBlob(
          blob => {
            resolve(blob)
          },
          'image/png',
          0.9,
        )
      })
    } catch (error) {
      console.error('Error capturing card:', error)
      return null
    }
  }

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default behavior and stop propagation to prevent slide navigation
    e.preventDefault()
    e.stopPropagation()

    try {
      // Set sharing state
      setIsSharing(true)

      // Capture the card as an image
      const imageBlob = await captureCardAsImage()

      // Create share data
      const shareData: ShareData = {
        title: `${cinderellaData.team} - The Cinderella Story`,
        text: `Check out ${cinderellaData.team}, the #${cinderellaData.seed} seed that made it to the ${cinderellaData.roundReached}!`,
        url: 'https://bracketwrap.com',
      }

      console.log('iamge blob vlid', imageBlob)

      // Add image file if available
      if (imageBlob) {
        const file = new File([imageBlob], 'cinderella-story.png', {
          type: 'image/png',
        })

        shareData.files = [file]
      }

      console.log('share data', shareData)

      // Check if Web Share API is supported and can share files
      if (
        navigator.share &&
        (!imageBlob || (navigator.canShare && navigator.canShare({ files: shareData.files })))
      ) {
        // Try to share with files if supported
        await navigator.share(shareData)
        console.log('Shared successfully with Web Share API')
      } else if (navigator.share) {
        // Fallback to sharing without files
        const textOnlyShareData = {
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        }
        await navigator.share(textOnlyShareData)
        console.log('Shared successfully without image')
      } else {
        // Fallback for browsers without Web Share API
        console.error('Web Share API not supported in this browser')

        // Create a fallback share mechanism - download image and copy text
        if (imageBlob) {
          // Create a download link for the image
          const url = URL.createObjectURL(imageBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'cinderella-story.png'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          // Copy text to clipboard
          await navigator.clipboard.writeText(
            `${shareData.title}\n${shareData.text}\n${shareData.url}`,
          )

          alert('Image downloaded and text copied to clipboard!')
        } else {
          // Just copy text to clipboard
          await navigator.clipboard.writeText(
            `${shareData.title}\n${shareData.text}\n${shareData.url}`,
          )
          alert('Text copied to clipboard!')
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      // If error is AbortError, user likely canceled the share
      if (error instanceof Error && error.name !== 'AbortError') {
        alert('There was an error sharing. Please try again.')
      }
    } finally {
      setIsSharing(false)
    }
  }

  // Animation elements configuration
  const animationElements = {
    slippers: [
      // Slipper 1 - Top right
      {
        top: '15%',
        right: '10%',
        size: '16',
        opacity: 0.8,
        rotateDirection: 'clockwise' as const,
      },
      // Slipper 2 - Bottom left
      {
        bottom: '20%',
        left: '8%',
        size: '12',
        opacity: 0.6,
        rotateDirection: 'counterclockwise' as const,
      },
    ],
    crowns: [
      // Crown 1 - Top left
      {
        top: '12%',
        left: '15%',
        size: '18',
        opacity: 0.7,
      },
      // Crown 2 - Bottom right
      {
        bottom: '15%',
        right: '12%',
        size: '14',
        opacity: 0.5,
      },
    ],
    stars: [
      // Star 1
      {
        top: '25%',
        right: '25%',
        size: 'lg',
        color: 'teal-200',
        opacity: 0.8,
        blinkSpeed: 'medium' as const,
      },
      // Star 2
      {
        top: '15%',
        left: '35%',
        size: 'md',
        color: 'teal-100',
        opacity: 0.6,
        blinkSpeed: 'slow' as const,
      },
      // Star 3
      {
        bottom: '30%',
        right: '30%',
        size: 'sm',
        color: 'teal-300',
        opacity: 0.7,
        blinkSpeed: 'fast' as const,
      },
      // Star 4
      {
        bottom: '20%',
        left: '25%',
        size: 'md',
        color: 'teal-200',
        opacity: 0.5,
        blinkSpeed: 'medium' as const,
      },
      // Star 5
      {
        top: '40%',
        right: '15%',
        size: 'sm',
        color: 'teal-100',
        opacity: 0.6,
        blinkSpeed: 'fast' as const,
      },
    ],
    sparkles: [
      // Random sparkles
      { top: '30%', left: '20%', size: '4', opacity: 0.7 },
      { top: '50%', right: '25%', size: '3', opacity: 0.5 },
      { bottom: '40%', left: '30%', size: '5', opacity: 0.6 },
      { bottom: '25%', right: '40%', size: '3', opacity: 0.7 },
      { top: '60%', left: '15%', size: '4', opacity: 0.5 },
      { top: '20%', right: '35%', size: '3', opacity: 0.6 },
      { bottom: '60%', left: '40%', size: '4', opacity: 0.7 },
      { bottom: '35%', right: '15%', size: '5', opacity: 0.5 },
    ],
  }

  // Define exit animations for content
  const contentExitAnimation = {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: { duration: 0.6, ease: 'easeOut' },
  }

  return (
    <StorySlide
      bgColor='bg-gradient-to-br from-blue-900 via-purple-900 to-teal-800'
      footer={<GroupSlideBanner />}
    >
      <div className='relative flex flex-col w-full h-full overflow-hidden'>
        {/* Decorative elements */}
        <CinderellaAnimatedBackground isExiting={isExiting} elements={animationElements} />

        {/* Radial gradient overlay for depth */}
        <div className='absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none' />

        {/* Content container with padding */}
        <div className='flex flex-col items-center justify-center gap-6 w-full px-4 py-6 flex-1'>
          <AnimatePresence mode='wait'>
            {!showContent ? (
              <motion.div
                key='intro'
                className='flex flex-col items-center justify-center h-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p
                  className='text-2xl font-medium text-center text-white leading-relaxed'
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Every tournament has its underdogs...
                </motion.p>
                <motion.p
                  className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  Here's your group's favorite Cinderella story
                </motion.p>
              </motion.div>
            ) : (
              <AnimatePresence mode='wait'>
                {!isExiting ? (
                  <motion.div
                    key='content'
                    className='w-full max-w-md mx-auto'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={contentExitAnimation}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Title with emoji and animation */}
                    <motion.div
                      className='mb-6 text-center'
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }}
                    >
                      <motion.div
                        className='inline-block mb-2'
                        animate={{
                          rotate: [0, -10, 10, -5, 5, 0],
                          scale: [1, 1.2, 1.2, 1.1, 1.1, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          ease: 'easeInOut',
                          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        }}
                      >
                        <span className='text-4xl'>👑</span>
                      </motion.div>
                      <h2 className='text-3xl font-bold text-white drop-shadow-lg'>
                        Your Group's Cinderella
                      </h2>
                    </motion.div>

                    {/* Team Card */}
                    <motion.div
                      ref={cardRef}
                      className='w-full bg-gradient-to-br from-teal-500/30 to-purple-600/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-4'
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: 0.2,
                      }}
                    >
                      {/* Team Information Section */}
                      <div className='flex items-center gap-4 mb-6'>
                        <div className='flex-shrink-0 flex flex-col items-center gap-2'>
                          {/* Seed */}
                          <motion.div
                            className='w-8 h-8 rounded-full bg-teal-500/50 flex items-center justify-center text-white font-bold text-sm border-2 border-white/50'
                            animate={{ rotate: [0, 5, 0, -5, 0] }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            {cinderellaData.seed}
                          </motion.div>

                          {/* Team Logo */}
                          <motion.div
                            className='w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center'
                            animate={{ rotate: [0, 2, 0, -2, 0] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <Image
                              src={
                                teams?.[cinderellaData.teamId]?.images.secondary ||
                                '/placeholder-team.png'
                              }
                              alt={cinderellaData.team}
                              width={32}
                              height={32}
                              className='w-8 h-8 object-contain'
                            />
                          </motion.div>
                        </div>

                        {/* Team Name and Round */}
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-3xl font-bold text-white truncate'>
                            {cinderellaData.team}
                          </h3>
                          <div className='flex items-center gap-2 mt-1'>
                            <span className='bg-teal-500/30 px-2 py-0.5 rounded-md text-white font-bold'>
                              {cinderellaData.roundReached}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bracket Owner Section */}
                      <div className='pt-4 border-t border-white/10'>
                        <h4 className='text-lg font-bold text-white/90 mb-3'>Bracket Owner</h4>
                        <div className='flex items-center gap-4'>
                          <motion.div
                            className='flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-teal-400 bg-white/10 flex items-center justify-center text-white'
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='w-8 h-8'
                            >
                              <path
                                fillRule='evenodd'
                                d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </motion.div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-bold text-xl text-white truncate'>
                              {cinderellaData.bracketOwner.name}
                            </p>
                            <p className='text-teal-200 truncate'>
                              {cinderellaData.bracketOwner.bracketName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Share Button */}
                    <AnimatePresence>
                      {showShareButton && !isExiting && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.5 }}
                          className='mt-6 flex justify-center'
                          onClick={e => e.stopPropagation()}
                          data-click='share-container'
                        >
                          <motion.button
                            onClick={handleShare}
                            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isSharing}
                            data-click='share-button'
                            aria-label='Share this story'
                          >
                            {/* Button background glow effect */}
                            <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-teal-300/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>

                            {isSharing ? (
                              <>
                                <svg
                                  className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                >
                                  <circle
                                    className='opacity-25'
                                    cx='12'
                                    cy='12'
                                    r='10'
                                    stroke='currentColor'
                                    strokeWidth='4'
                                  ></circle>
                                  <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                  ></path>
                                </svg>
                                <span className='relative z-10'>Preparing...</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 24 24'
                                  fill='currentColor'
                                  className='w-5 h-5 relative z-10'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                <span className='relative z-10'>Share This Story</span>
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key='content-exiting'
                    className='w-full'
                    initial={{ opacity: 1 }}
                    animate={contentExitAnimation}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
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
  )
}

export default GroupCinderellaSlide
