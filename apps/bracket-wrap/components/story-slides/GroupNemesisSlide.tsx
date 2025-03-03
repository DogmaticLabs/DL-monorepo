import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import purdue from '../../public/purdue.png'
import StorySlide from '../StorySlide'

interface GroupNemesisSlideProps {
  bracketId?: string
}

const GroupNemesisSlide = ({ bracketId }: GroupNemesisSlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const nemesisName = 'Sarah Williams'
  const nemesisTeamName = 'Boilermaker Brigade'
  const differencePercentage = 82 // Example percentage of difference

  // State to control when to show the nemesis content
  const [showNemesisContent, setShowNemesisContent] = useState(false)

  // Automatically transition to nemesis content after the intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNemesisContent(true)
    }, 3500) // Show nemesis content after 3.5 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <StorySlide bgColor='bg-gradient-to-br from-red-900 to-orange-800'>
      <div className='flex flex-col items-center justify-center gap-8 px-4 py-6 max-w-md mx-auto'>
        {!showNemesisContent ? (
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
              In every bracket group, there are opposing views...
            </motion.p>
            <motion.p
              className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Meet the person who sees March Madness completely differently
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
              🥊 Your Bracket Nemesis
            </motion.h2>

            {/* Difference Percentage */}
            <motion.div
              className='flex items-center justify-center gap-2 bg-white/20 px-4 py-2 rounded-full mt-8'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className='text-xl text-white font-bold'>{differencePercentage}% Different</p>
            </motion.div>

            {/* Nemesis Name Card */}
            <motion.div
              className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 transition-all mt-8'
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className='text-sm uppercase tracking-wider text-orange-200 mb-1'>
                Your bracket nemesis
              </p>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-3xl font-bold text-white'>{nemesisName}</h3>
                  <h4 className='text-2xl font-semibold text-white'>{nemesisTeamName}</h4>
                </div>
                <Image src={purdue} alt='Purdue' className='w-20 h-20' />
              </div>
            </motion.div>

            {/* Key Differences */}
            <motion.div
              className='mt-6 bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20'
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className='text-sm uppercase tracking-wider text-orange-200 mb-2'>
                Biggest disagreements
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center justify-between'>
                  <span>Your Champion: UConn</span>
                  <span>Their Champion: Purdue</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span>You picked 6 upsets</span>
                  <span>They picked 12 upsets</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span>You: East region winner</span>
                  <span>Them: Midwest region winner</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </div>
    </StorySlide>
  )
}

export default GroupNemesisSlide
