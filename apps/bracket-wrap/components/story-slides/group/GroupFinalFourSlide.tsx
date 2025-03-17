import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import StorySlide from '../../StorySlide'
import GroupSlideBanner from './GroupSlideBanner'

interface GroupFinalFourSlideProps {
  groupId?: string
}

const GroupFinalFourSlide = ({ groupId }: GroupFinalFourSlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const finalFourData = [
    {
      team: 'UConn',
      seed: 1,
      region: 'East',
      percentage: 87.5,
      logoUrl: '/team-logos/1.png',
      color: 'from-blue-600 to-blue-800',
      textColor: 'text-blue-200',
    },
    {
      team: 'Houston',
      seed: 1,
      region: 'South',
      percentage: 75.0,
      logoUrl: '/team-logos/2.png',
      color: 'from-red-600 to-red-800',
      textColor: 'text-red-200',
    },
    {
      team: 'Purdue',
      seed: 1,
      region: 'Midwest',
      percentage: 62.5,
      logoUrl: '/team-logos/3.png',
      color: 'from-yellow-600 to-yellow-800',
      textColor: 'text-yellow-200',
    },
    {
      team: 'Arizona',
      seed: 2,
      region: 'West',
      percentage: 54.2,
      logoUrl: '/team-logos/4.png',
      color: 'from-red-500 to-blue-700',
      textColor: 'text-red-200',
    },
  ]

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
      bgColor='bg-gradient-to-br from-purple-900 to-blue-900'
      footer={<GroupSlideBanner />}
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
                The road to the championship...
              </motion.p>
              <motion.p
                className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Here's who your group picked to make the Final Four!
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
                🏆 Final Four Picks
              </motion.h2>

              {/* Final Four Court Graphic */}
              <motion.div
                className='relative w-full aspect-square mt-6 mb-4'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Court background */}
                <div className='absolute inset-0 bg-blue-900/30 rounded-full border-4 border-white/20'></div>

                {/* Center circle */}
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full border-2 border-white/40'></div>

                {/* Court dividing lines */}
                <div className='absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-white/40'></div>
                <div className='absolute top-1/2 left-0 transform -translate-y-1/2 h-0.5 w-full bg-white/40'></div>

                {/* Team positions */}
                {finalFourData.map((team, index) => {
                  // Position teams in each quadrant
                  const positions = [
                    { top: '15%', left: '15%' }, // Top left
                    { top: '15%', right: '15%' }, // Top right
                    { bottom: '15%', left: '15%' }, // Bottom left
                    { bottom: '15%', right: '15%' }, // Bottom right
                  ]

                  return (
                    <motion.div
                      key={team.team}
                      className='absolute'
                      style={positions[index]}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                    >
                      <div
                        className={`w-24 h-24 rounded-full bg-gradient-to-br ${team.color} p-1 shadow-lg flex items-center justify-center`}
                      >
                        <div className='w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden'>
                          {team.logoUrl ? (
                            <Image
                              src={team.logoUrl}
                              alt={team.team}
                              width={64}
                              height={64}
                              className='object-contain'
                            />
                          ) : (
                            <div className='text-2xl font-bold text-white'>
                              {team.team.substring(0, 3)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black/50 rounded-full px-2 py-0.5 text-xs text-white font-bold'>
                        {team.percentage}%
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Team Cards */}
              <div className='space-y-3 mt-8'>
                {finalFourData.map((team, index) => (
                  <motion.div
                    key={team.team}
                    className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20'
                    initial={{ x: index % 2 === 0 ? -40 : 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3'>
                          <span className='font-bold text-lg'>{team.seed}</span>
                        </div>
                        <div>
                          <h3 className='text-xl font-bold text-white'>{team.team}</h3>
                          <p className={`text-sm ${team.textColor}`}>{team.region} Region</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-2xl font-bold text-white'>{team.percentage}%</p>
                        <p className='text-xs text-white/70'>
                          {Math.round((team.percentage * groupInfo.memberCount) / 100)} brackets
                        </p>
                      </div>
                    </div>

                    {/* Percentage bar */}
                    <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2'>
                      <motion.div
                        className={`h-full bg-gradient-to-r ${team.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${team.percentage}%` }}
                        transition={{ duration: 1, delay: 1 + index * 0.15 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fun Fact */}
              {/* <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                <p className='text-center text-white'>
                  <span className='font-bold'>Fun fact:</span> Only{' '}
                  <span className='font-bold text-purple-300'>
                    {Math.round(
                      ((finalFourData[0]!.percentage *
                        finalFourData[1]!.percentage *
                        finalFourData[2]!.percentage *
                        finalFourData[3]!.percentage) /
                        1000000) *
                        groupInfo.memberCount,
                    )}
                  </span>{' '}
                  {Math.round(
                    ((finalFourData[0]!.percentage *
                      finalFourData[1]!.percentage *
                      finalFourData[2]!.percentage *
                      finalFourData[3]!.percentage) /
                      1000000) *
                      groupInfo.memberCount,
                  ) === 1
                    ? 'person'
                    : 'people'}{' '}
                  in your group picked this exact Final Four!
                </p>
              </motion.div> */}
            </motion.div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupFinalFourSlide
