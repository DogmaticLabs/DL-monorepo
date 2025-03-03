import { motion } from 'motion/react'
import Image from 'next/image'
import uconn from '../../public/uconn.png'
import StorySlide from '../StorySlide'

interface BracketSummarySlideProps {
  bracketId?: string
}

const BracketSummarySlide = ({ bracketId }: BracketSummarySlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const summaryData = {
    bracketName: 'March Madness 2024',
    champion: {
      team: 'UConn',
      seed: 1,
      nationalPercentage: 32.5,
      popularityRank: 1,
    },
    chalkScore: 68, // Higher means more risk/upsets
    nationalChalkAverage: 52,
    upsetCount: 12,
    nationalUpsetAverage: 8,
    cinderella: {
      team: "Saint Peter's",
      seed: 15,
      roundReached: 'Elite Eight',
    },
    correctPicks: {
      firstRound: 22,
      totalPossible: 32,
    },
    bracketPercentile: 84, // Better than 84% of brackets nationally
  }

  return (
    <StorySlide bgColor='bg-gradient-to-br from-blue-900 to-purple-900'>
      <div className='flex flex-col items-center justify-center gap-5 w-full max-w-md mx-auto'>
        <motion.h2
          className='text-3xl font-bold text-center text-white drop-shadow-lg'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Your Bracket Wrapped
        </motion.h2>

        {/* Champion Card */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-sm text-purple-200 mb-1'>Your Champion</p>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-full bg-yellow-500/80 flex items-center justify-center'>
                  <span className='font-bold'>{summaryData.champion.seed}</span>
                </div>
                <h3 className='text-2xl font-bold text-white'>{summaryData.champion.team}</h3>
              </div>
              <p className='text-sm mt-1'>
                Picked by {summaryData.champion.nationalPercentage}% of brackets
              </p>
            </div>
            <Image src={uconn} alt={summaryData.champion.team} className='w-16 h-16' />
          </div>
        </motion.div>

        {/* Risk Profile */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className='text-sm text-purple-200 mb-1'>Your Risk Profile</p>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-xl font-bold text-white'>
                {summaryData.chalkScore > summaryData.nationalChalkAverage + 10
                  ? 'Risk Taker'
                  : summaryData.chalkScore < summaryData.nationalChalkAverage - 10
                    ? 'Playing it Safe'
                    : 'Balanced Approach'}
              </p>
              <p className='text-sm'>
                {summaryData.upsetCount} upsets (national avg: {summaryData.nationalUpsetAverage})
              </p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-purple-200'>Chalk Score</p>
              <p className='text-2xl font-bold text-white'>{summaryData.chalkScore}</p>
            </div>
          </div>
        </motion.div>

        {/* Cinderella Pick */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className='text-sm text-purple-200 mb-1'>Your Cinderella Pick</p>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-teal-500/30 flex items-center justify-center'>
              <span className='font-bold'>{summaryData.cinderella.seed}</span>
            </div>
            <div>
              <p className='text-xl font-bold text-white'>{summaryData.cinderella.team}</p>
              <p className='text-sm'>
                Making it to the{' '}
                <span className='font-semibold'>{summaryData.cinderella.roundReached}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className='text-sm text-purple-200 mb-1'>Your Performance</p>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-xl font-bold text-white'>
                Better than {summaryData.bracketPercentile}%
              </p>
              <p className='text-sm'>of all brackets nationally</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-purple-200'>First Round</p>
              <p className='text-xl font-bold text-white'>
                {summaryData.correctPicks.firstRound}/{summaryData.correctPicks.totalPossible}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-2'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className='text-center text-white'>Thanks for playing! See you next March Madness!</p>
        </motion.div>
      </div>
    </StorySlide>
  )
}

export default BracketSummarySlide
