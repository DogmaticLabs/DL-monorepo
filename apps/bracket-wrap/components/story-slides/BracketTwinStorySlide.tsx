import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import uconn from '../../public/uconn.png'
import StorySlide from '../StorySlide'

interface BracketTwinStorySlideProps {
  bracketId?: string
}

const BracketTwinStorySlide = ({ bracketId }: BracketTwinStorySlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const twinName = 'Alex Johnson'
  const twinTeamName = 'Wildcats Fanatics'
  const similarityPercentage = 87 // Example percentage

  // State to control when to show the twin content
  const [showTwinContent, setShowTwinContent] = useState(false)

  // Automatically transition to twin content after the intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTwinContent(true)
    }, 3500) // Show twin content after 3.5 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <StorySlide bgColor='bg-gradient-to-br from-purple-900 to-pink-800'>
      <div className='flex flex-col items-center justify-center gap-8 px-4 py-6 max-w-md mx-auto'>
        {!showTwinContent ? (
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
              Although no two brackets are perfectly alike...
            </motion.p>
            <motion.p
              className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              You had a lot in common with one person
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
              👬Your Bracket Twin
            </motion.h2>

            {/* Similarity Percentage */}
            <motion.div
              className='flex items-center justify-center gap-2 bg-white/20 px-4 py-2 rounded-full mt-8'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* <PercentIcon className='w-5 h-5 text-green-300' /> */}
              <p className='text-xl text-white font-bold'>{similarityPercentage}% Match</p>
            </motion.div>

            {/* Twin Name Card */}
            <motion.div
              className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 transition-all mt-8'
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className='text-sm uppercase tracking-wider text-purple-200 mb-1'>
                Your bracket twin
              </p>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-3xl font-bold text-white'>{twinName}</h3>
                  <h4 className='text-2xl font-semibold text-white'>{twinTeamName}</h4>
                </div>
                <Image src={uconn} alt='UConn' className='w-20 h-20' />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </StorySlide>
  )
}

export default BracketTwinStorySlide
