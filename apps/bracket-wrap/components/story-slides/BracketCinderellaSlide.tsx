import { motion } from 'motion/react'
import Image from 'next/image'
import saintPeters from '../../public/saint-peters.png' // You'll need to add this image
import StorySlide from '../StorySlide'

interface BracketCinderellaSlideProps {
  bracketId?: string
}

const BracketCinderellaSlide = ({ bracketId }: BracketCinderellaSlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const cinderellaData = {
    team: "Saint Peter's",
    seed: 15,
    roundReached: 'Elite Eight',
    nationalPercentage: 0.8, // Percentage of brackets nationally with this pick
    totalBrackets: 28500000, // Total number of brackets for calculation
  }

  // Calculate how many brackets nationally have this pick
  const numberOfBrackets = Math.round(
    (cinderellaData.nationalPercentage / 100) * cinderellaData.totalBrackets,
  )

  return (
    <StorySlide bgColor='bg-gradient-to-br from-blue-900 to-teal-800'>
      <div className='flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto'>
        <motion.h2
          className='text-4xl font-bold text-center text-white drop-shadow-lg'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🏰 Your Cinderella Pick
        </motion.h2>

        {/* Cinderella Team Card */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20'
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='w-12 h-12 rounded-full bg-teal-500/30 flex items-center justify-center mr-3'>
                <span className='font-bold text-xl'>{cinderellaData.seed}</span>
              </div>
              <div>
                <h3 className='text-3xl font-bold text-white'>{cinderellaData.team}</h3>
                <p className='text-lg text-teal-200'>
                  Making it to the <span className='font-bold'>{cinderellaData.roundReached}</span>
                </p>
              </div>
            </div>
            <Image src={saintPeters} alt={cinderellaData.team} className='w-20 h-20' />
          </div>
        </motion.div>

        {/* National Stats */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20'
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className='text-xl font-bold text-white mb-3'>How Rare Is Your Pick?</h4>

          <div className='flex flex-col gap-4'>
            <div>
              <p className='text-sm text-teal-200 mb-1'>Percentage of brackets nationally</p>
              <p className='text-3xl font-bold'>{cinderellaData.nationalPercentage}%</p>
            </div>

            <div>
              <p className='text-sm text-teal-200 mb-1'>Number of brackets with this pick</p>
              <p className='text-2xl font-bold'>{numberOfBrackets.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20'
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className='text-center text-white'>
            <span className='font-bold'>Fun fact:</span> Only{' '}
            <span className='font-bold text-teal-200'>1 in 125</span> brackets have{' '}
            {cinderellaData.team} making it this far!
          </p>
        </motion.div>
      </div>
    </StorySlide>
  )
}

export default BracketCinderellaSlide
