import { useBracketSlides } from '@/components/providers'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import StorySlide from '../../StorySlide'
import GroupSlideBanner from './GroupSlideBanner'

const GroupBracketTwinsSlide = () => {
  const [data] = useBracketSlides()

  // Placeholder data - would be replaced with actual data in production
  const twinsData = {
    person1: {
      name: 'Michael Chen',
      bracketName: "Mike's Madness",
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      chosenWinner: 'UConn',
    },
    person2: {
      name: 'Jessica Rodriguez',
      bracketName: "Jess's Journey",
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      chosenWinner: 'UConn',
    },
    matchingPicks: 58,
    totalPicks: 63,
    similarityPercentage: 92.1,
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
      bgColor='bg-gradient-to-br from-indigo-900 to-violet-800'
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
                Great minds think alike...
              </motion.p>
              <motion.p
                className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Meet your group's bracket twins!
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
                👯 Bracket Twins
              </motion.h2>

              {/* Similarity Percentage */}
              <motion.div
                className='flex items-center justify-center gap-2 bg-white/20 px-4 py-2 rounded-full mt-6'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className='text-xl text-white font-bold'>
                  {twinsData.similarityPercentage}% Match
                </p>
              </motion.div>

              {/* Person 1 Profile Card */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mt-6'
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className='flex items-center gap-4'>
                  <div className='relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-300'>
                    <Image
                      src='/team-logos/1.png'
                      alt={twinsData.person1.name}
                      width={80}
                      height={80}
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white'>{twinsData.person1.name}</h3>
                    <p className='text-indigo-200'>{twinsData.person1.bracketName}</p>
                    <div className='flex items-center mt-1'>
                      <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2'>
                        <span className='text-xs'>🏆</span>
                      </div>
                      <p className='text-sm text-white'>{twinsData.person1.chosenWinner}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Person 2 Profile Card */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mt-6'
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className='flex items-center gap-4'>
                  <div className='relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-300'>
                    <Image
                      src='/team-logos/1.png'
                      alt={twinsData.person2.name}
                      width={80}
                      height={80}
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white'>{twinsData.person2.name}</h3>
                    <p className='text-indigo-200'>{twinsData.person2.bracketName}</p>
                    <div className='flex items-center mt-1'>
                      <div className='w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-2'>
                        <span className='text-xs'>🏆</span>
                      </div>
                      <p className='text-sm text-white'>{twinsData.person2.chosenWinner}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Matching Details */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h4 className='text-lg font-bold text-white mb-3'>Matching Details</h4>

                <div className='space-y-4'>
                  <div>
                    <p className='text-sm text-indigo-200'>Matching Picks</p>
                    <p className='text-xl font-bold text-white'>
                      {twinsData.matchingPicks} of {twinsData.totalPicks}
                    </p>
                  </div>

                  {/* Visual representation of matching picks */}
                  <div className='w-full bg-white/10 h-6 rounded-full overflow-hidden'>
                    <motion.div
                      className='h-full bg-gradient-to-r from-indigo-500 to-violet-500'
                      initial={{ width: 0 }}
                      animate={{ width: `${twinsData.similarityPercentage}%` }}
                      transition={{ duration: 1.2, delay: 1 }}
                    />
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
                  <span className='font-bold'>Fun fact:</span> These brackets are so similar, they
                  {twinsData.person1.chosenWinner === twinsData.person2.chosenWinner
                    ? ' both picked the same champion!'
                    : ' only differ on their champion pick!'}
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupBracketTwinsSlide
