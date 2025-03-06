import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import StorySlide from '../../StorySlide'
import GroupSlideBanner from './GroupSlideBanner'

interface GroupBracketNemesisProps {
  groupId?: string
}

const GroupBracketNemesisSlide = ({ groupId }: GroupBracketNemesisProps) => {
  // Placeholder data - would be replaced with actual data in production
  const nemesisData = {
    person1: {
      name: 'Alex Thompson',
      bracketName: 'Chalk City',
      avatarUrl: '/team-logos/2.png',
      chosenWinner: 'UConn',
    },
    person2: {
      name: 'Taylor Wilson',
      bracketName: 'Upset Special',
      avatarUrl: '/team-logos/3.png',
      chosenWinner: 'NC State',
    },
    matchingPicks: 19,
    totalPicks: 63,
    differencePercentage: 69.8, // 100 - (matchingPicks/totalPicks*100)
    differentRegions: ['South', 'Midwest'],
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
      bgColor='bg-gradient-to-br from-red-900 to-orange-800'
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
                Opposites don't always attract...
              </motion.p>
              <motion.p
                className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Meet your group's bracket nemeses!
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
                ⚔️ Bracket Nemeses
              </motion.h2>

              {/* Difference Percentage */}
              <motion.div
                className='flex items-center justify-center gap-2 bg-white/20 px-4 py-2 rounded-full mt-6'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className='text-xl text-white font-bold'>
                  {nemesisData.differencePercentage}% Different
                </p>
              </motion.div>

              {/* VS Section */}
              <motion.div
                className='relative flex justify-between items-center mt-8 mb-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className='w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm border-2 border-red-300 overflow-hidden'>
                  <Image
                    src='/team-logos/1.png'
                    alt={nemesisData.person1.name}
                    width={96}
                    height={96}
                    className='object-cover'
                  />
                </div>

                <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center z-10'>
                  <span className='text-xl font-bold text-white'>VS</span>
                </div>

                <div className='w-24 h-24 rounded-full bg-white/15 backdrop-blur-sm border-2 border-orange-300 overflow-hidden'>
                  <Image
                    src='/team-logos/1.png'
                    alt={nemesisData.person2.name}
                    width={96}
                    height={96}
                    className='object-cover'
                  />
                </div>
              </motion.div>

              {/* Person 1 Profile Card */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-6'
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div>
                  <h3 className='text-xl font-bold text-white'>{nemesisData.person1.name}</h3>
                  <p className='text-red-200'>{nemesisData.person1.bracketName}</p>
                  <div className='flex items-center mt-2'>
                    <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2'>
                      <span className='text-xs'>🏆</span>
                    </div>
                    <p className='text-sm text-white'>
                      Champion: {nemesisData.person1.chosenWinner}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Person 2 Profile Card */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-4'
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div>
                  <h3 className='text-xl font-bold text-white'>{nemesisData.person2.name}</h3>
                  <p className='text-orange-200'>{nemesisData.person2.bracketName}</p>
                  <div className='flex items-center mt-2'>
                    <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2'>
                      <span className='text-xs'>🏆</span>
                    </div>
                    <p className='text-sm text-white'>
                      Champion: {nemesisData.person2.chosenWinner}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Difference Details */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h4 className='text-lg font-bold text-white mb-3'>Bracket Differences</h4>

                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-red-200'>Different Picks</p>
                    <p className='text-xl font-bold text-white'>
                      {nemesisData.totalPicks - nemesisData.matchingPicks} of{' '}
                      {nemesisData.totalPicks}
                    </p>
                  </div>

                  {/* Visual representation of different picks */}
                  <div className='w-full bg-white/10 h-6 rounded-full overflow-hidden'>
                    <motion.div
                      className='h-full bg-gradient-to-r from-red-500 to-orange-500'
                      initial={{ width: 0 }}
                      animate={{ width: `${nemesisData.differencePercentage}%` }}
                      transition={{ duration: 1.2, delay: 1 }}
                    />
                  </div>

                  {/* Most different regions */}
                  <div>
                    <p className='text-sm text-red-200 mb-1'>Most Different Regions</p>
                    <div className='flex flex-wrap gap-2'>
                      {nemesisData.differentRegions.map((region, idx) => (
                        <span
                          key={idx}
                          className='px-3 py-1 bg-white/10 rounded-full text-sm text-white'
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Fun Fact */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <p className='text-center text-white'>
                  <span className='font-bold'>Fun fact:</span> These two brackets only agree on{' '}
                  <span className='font-bold text-orange-200'>
                    {Math.round((nemesisData.matchingPicks / nemesisData.totalPicks) * 100)}%
                  </span>{' '}
                  of all picks!
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupBracketNemesisSlide
