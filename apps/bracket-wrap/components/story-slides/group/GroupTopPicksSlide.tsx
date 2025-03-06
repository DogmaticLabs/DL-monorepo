import StorySlide from '@/components/StorySlide'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import GroupBanner from './GroupBanner'

const GroupTopPicksSlide = () => {
  // Stub data for group's most popular champion picks
  const championPicks = [
    { team: 'UConn', rank: 1, region: 'East', groupPercentage: 41.8 },
    { team: 'Houston', rank: 2, region: 'South', groupPercentage: 23.6 },
    { team: 'Purdue', rank: 3, region: 'Midwest', groupPercentage: 15.2 },
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

  // Find the highest percentage for scaling
  const maxPercentage = Math.max(...championPicks.map(pick => pick.groupPercentage))

  return (
    <StorySlide
      bgColor='bg-gradient-to-br from-pink-800 to-orange-800'
      footer={<GroupBanner groupName={groupInfo.name} memberCount={groupInfo.memberCount} />}
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
                Every group has its favorites...
              </motion.p>
              <motion.p
                className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Here's who your group is backing to win it all
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
                className='text-3xl font-bold text-center'
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Top Picks
              </motion.h2>

              {/* Top champion picks section */}
              <motion.div
                className='w-full mt-6'
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className='flex flex-col gap-4'>
                  {championPicks.map((pick, idx) => (
                    <motion.div
                      key={idx}
                      className='relative'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + idx * 0.2 }}
                    >
                      {/* Team info and percentage */}
                      <div className='flex items-center mb-1'>
                        <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3'>
                          <span className='font-bold text-sm'>{pick.rank}</span>
                        </div>
                        <div className='flex-1'>
                          <p className='font-bold'>{pick.team}</p>
                          <p className='text-xs text-white/70'>{pick.region} Region</p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-lg'>{pick.groupPercentage}%</p>
                        </div>
                      </div>

                      {/* Percentage bar background */}
                      <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                        {/* Animated percentage bar */}
                        <motion.div
                          className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full'
                          initial={{ width: 0 }}
                          animate={{ width: `${(pick.groupPercentage / maxPercentage) * 100}%` }}
                          transition={{
                            duration: 1.2,
                            delay: 0.8 + idx * 0.2,
                            ease: 'easeOut',
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Additional context */}
              <motion.p
                className='text-sm text-center text-white/70 mt-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                Based on champion picks from all {groupInfo.memberCount} brackets
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupTopPicksSlide
