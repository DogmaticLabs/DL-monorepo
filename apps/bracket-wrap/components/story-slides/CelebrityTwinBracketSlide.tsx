import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import StorySlide from '../StorySlide'

interface CelebrityTwinBracketSlideProps {
  bracketId?: string
}

const CelebrityTwinBracketSlide = ({ bracketId }: CelebrityTwinBracketSlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const celebrityData = {
    bracketName: "Barack's Bracket Bonanza",
    displayName: 'Barack Obama',
    chosenWinner: 'UConn',
    profession: 'Former U.S. President',
    avatar: '/obama-avatar.jpg', // You'll need to add this image
    matchingPicks: 42,
    totalPicks: 63,
    similarityPercentage: 76.4,
  }

  // State to control when to show the celebrity content
  const [showCelebrityContent, setShowCelebrityContent] = useState(false)

  // Automatically transition to celebrity content after the intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebrityContent(true)
    }, 3000) // Show celebrity content after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <StorySlide bgColor='bg-gradient-to-br from-indigo-900 to-purple-800'>
      <div className='flex flex-col items-center justify-center gap-8 px-4 py-6 max-w-md mx-auto'>
        {!showCelebrityContent ? (
          <motion.div
            className='flex flex-col items-center justify-center h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className='text-2xl font-medium text-center text-white leading-relaxed'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Your bracket has a famous doppelgänger...
            </motion.p>
            <motion.p
              className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Someone in the spotlight thinks like you do!
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className='w-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className='text-4xl font-bold text-center text-white drop-shadow-lg'
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              🌟 Your Celebrity Twin
            </motion.h2>

            {/* Similarity Percentage */}
            <motion.div
              className='flex items-center justify-center gap-2 bg-white/20 px-4 py-2 rounded-full mt-6'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className='text-xl text-white font-bold'>
                {celebrityData.similarityPercentage}% Match
              </p>
            </motion.div>

            {/* Celebrity Profile Card */}
            <motion.div
              className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 transition-all mt-6'
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className='flex items-center gap-4'>
                <div className='relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-300'>
                  <Image
                    src={celebrityData.avatar}
                    alt={celebrityData.displayName}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-white'>{celebrityData.displayName}</h3>
                  <p className='text-purple-200'>{celebrityData.profession}</p>
                  <p className='text-sm text-white/70 mt-1'>{celebrityData.bracketName}</p>
                </div>
              </div>
            </motion.div>

            {/* Bracket Details */}
            <motion.div
              className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-6'
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h4 className='text-lg font-bold text-white mb-3'>Bracket Details</h4>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-purple-200'>Champion Pick</p>
                  <p className='text-xl font-bold text-white'>{celebrityData.chosenWinner}</p>
                </div>

                <div>
                  <p className='text-sm text-purple-200'>Matching Picks</p>
                  <p className='text-xl font-bold text-white'>
                    {celebrityData.matchingPicks} of {celebrityData.totalPicks}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Fun Fact */}
            <motion.div
              className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-6'
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className='text-center text-white'>
                <span className='font-bold'>Fun fact:</span> You and {celebrityData.displayName}{' '}
                both correctly predicted {Math.floor(celebrityData.matchingPicks * 0.6)} upsets!
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </StorySlide>
  )
}

export default CelebrityTwinBracketSlide
