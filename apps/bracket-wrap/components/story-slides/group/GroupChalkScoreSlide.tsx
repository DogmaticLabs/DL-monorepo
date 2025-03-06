import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import StorySlide from '../../StorySlide'
import GroupSlideBanner from './GroupSlideBanner'

interface GroupChalkScoreSlideProps {
  groupId?: string
}

const GroupChalkScoreSlide = ({ groupId }: GroupChalkScoreSlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const chalkData = {
    mostChalky: {
      name: 'David Wilson',
      bracketName: 'No Surprises Here',
      avatarUrl: '/team-logos/4.png',
      chalkScore: 92,
      upsetCount: 3,
      favoriteTeam: 'UConn',
      description: 'The Safe Bet',
    },
    leastChalky: {
      name: 'Sophia Martinez',
      bracketName: 'Chaos Theory',
      avatarUrl: '/team-logos/5.png',
      chalkScore: 28,
      upsetCount: 19,
      favoriteTeam: 'NC State',
      description: 'The Risk Taker',
    },
    groupAverage: 64,
  }

  // Stub data for group info
  const groupInfo = {
    name: 'Cantonsville',
    memberCount: 24,
  }

  // State to control when to show the content
  const [showContent, setShowContent] = useState(false)

  // Automatically transition to content after the intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 3500) // Show content after 3.5 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <StorySlide
      bgColor='bg-gradient-to-br from-slate-900 to-emerald-900'
      footer={<GroupSlideBanner groupName={groupInfo.name} memberCount={groupInfo.memberCount} />}
    >
      <div className='flex flex-col w-full h-full'>
        {/* Content container with padding */}
        <div className='flex flex-col items-center justify-center gap-6 w-full px-4 py-6 flex-1'>
          {!showContent ? (
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
                Some play it safe, others take risks...
              </motion.p>
              <motion.p
                className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Let's see who's who in your group!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              className='w-full max-w-md mx-auto'
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
                🎲 Risk vs. Reward
              </motion.h2>

              {/* Chalk Score Explanation */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-6'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className='text-center text-white text-sm'>
                  <span className='font-bold'>Chalk Score</span> measures how much your bracket
                  follows the expected outcomes. Higher scores mean more favorites picked, lower
                  scores mean more upsets!
                </p>
              </motion.div>

              {/* Chalk Score Meter */}
              <motion.div
                className='w-full mt-6 relative'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className='h-8 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full overflow-hidden relative'>
                  {/* Group Average Marker */}
                  <motion.div
                    className='absolute top-0 bottom-0 w-1 bg-white'
                    style={{ left: `${chalkData.groupAverage}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className='absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold whitespace-nowrap'>
                      Group Avg: {chalkData.groupAverage}
                    </div>
                  </motion.div>
                </div>

                {/* Risk Taker Marker */}
                <motion.div
                  className='absolute -bottom-12 flex flex-col items-center'
                  style={{ left: `${chalkData.leastChalky.chalkScore}%` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className='w-8 h-8 rounded-full bg-red-500 flex items-center justify-center'>
                    <span className='text-xs'>🔥</span>
                  </div>
                  <div className='text-xs text-white mt-1 font-bold'>Risk Taker</div>
                </motion.div>

                {/* Safe Bet Marker */}
                <motion.div
                  className='absolute -bottom-12 flex flex-col items-center'
                  style={{ left: `${chalkData.mostChalky.chalkScore}%` }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center'>
                    <span className='text-xs'>🧠</span>
                  </div>
                  <div className='text-xs text-white mt-1 font-bold'>Safe Bet</div>
                </motion.div>
              </motion.div>

              {/* Risk Taker Card */}
              <motion.div
                className='w-full bg-gradient-to-r from-red-900 to-red-700 rounded-xl p-5 shadow-lg border border-white/20 mt-16'
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div className='flex items-center gap-4'>
                  <div className='relative w-16 h-16 rounded-full overflow-hidden border-2 border-red-300'>
                    <Image
                      src={chalkData.leastChalky.avatarUrl}
                      alt={chalkData.leastChalky.name}
                      width={64}
                      height={64}
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <div className='flex items-center'>
                      <h3 className='text-xl font-bold text-white'>{chalkData.leastChalky.name}</h3>
                      <span className='ml-2 px-2 py-0.5 bg-red-600 rounded-full text-xs text-white font-bold'>
                        {chalkData.leastChalky.description}
                      </span>
                    </div>
                    <p className='text-red-200'>{chalkData.leastChalky.bracketName}</p>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 mt-4'>
                  <div className='bg-white/10 rounded-lg p-2 text-center'>
                    <p className='text-xs text-red-200'>Chalk Score</p>
                    <p className='text-xl font-bold text-white'>
                      {chalkData.leastChalky.chalkScore}
                    </p>
                  </div>
                  <div className='bg-white/10 rounded-lg p-2 text-center'>
                    <p className='text-xs text-red-200'>Upsets Picked</p>
                    <p className='text-xl font-bold text-white'>
                      {chalkData.leastChalky.upsetCount}
                    </p>
                  </div>
                  <div className='bg-white/10 rounded-lg p-2 text-center'>
                    <p className='text-xs text-red-200'>Champion</p>
                    <p className='text-xl font-bold text-white'>
                      {chalkData.leastChalky.favoriteTeam}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Safe Bet Card */}
              <motion.div
                className='w-full bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-5 shadow-lg border border-white/20 mt-4'
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <div className='flex items-center gap-4'>
                  <div className='relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-300'>
                    <Image
                      src={chalkData.mostChalky.avatarUrl}
                      alt={chalkData.mostChalky.name}
                      width={64}
                      height={64}
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <div className='flex items-center'>
                      <h3 className='text-xl font-bold text-white'>{chalkData.mostChalky.name}</h3>
                      <span className='ml-2 px-2 py-0.5 bg-green-600 rounded-full text-xs text-white font-bold'>
                        {chalkData.mostChalky.description}
                      </span>
                    </div>
                    <p className='text-green-200'>{chalkData.mostChalky.bracketName}</p>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 mt-4'>
                  <div className='bg-white/10 rounded-lg p-2 text-center'>
                    <p className='text-xs text-green-200'>Chalk Score</p>
                    <p className='text-xl font-bold text-white'>
                      {chalkData.mostChalky.chalkScore}
                    </p>
                  </div>
                  <div className='bg-white/10 rounded-lg p-2 text-center'>
                    <p className='text-xs text-green-200'>Upsets Picked</p>
                    <p className='text-xl font-bold text-white'>
                      {chalkData.mostChalky.upsetCount}
                    </p>
                  </div>
                  <div className='bg-white/10 rounded-lg p-2 text-center'>
                    <p className='text-xs text-green-200'>Champion</p>
                    <p className='text-xl font-bold text-white'>
                      {chalkData.mostChalky.favoriteTeam}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Fun Fact */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <p className='text-center text-white'>
                  <span className='font-bold'>Fun fact:</span> {chalkData.leastChalky.name} picked{' '}
                  <span className='font-bold text-red-300'>
                    {chalkData.leastChalky.upsetCount - chalkData.mostChalky.upsetCount}
                  </span>{' '}
                  more upsets than {chalkData.mostChalky.name}!
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupChalkScoreSlide
