import { User } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import saintPeters from '../../../public/saint-peters.png' // You'll need to add this image
import StorySlide from '../../StorySlide'
import GroupSlideBanner from './GroupSlideBanner'

interface GroupCinderellaSlideProps {
  groupId?: string
}

const GroupCinderellaSlide = ({ groupId }: GroupCinderellaSlideProps) => {
  // Placeholder data - would be replaced with actual data in production
  const cinderellaData = {
    team: "Saint Peter's",
    seed: 15,
    roundReached: 'Elite Eight',
    groupPercentage: 4.2, // Percentage of brackets in the group with this pick
    bracketOwner: {
      name: 'Sarah Johnson',
      bracketName: 'March Madness Magic',
      avatarUrl: 'https://i.pravatar.cc/150?img=5', // Placeholder avatar URL
    },
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
      bgColor='bg-gradient-to-br from-blue-900 to-teal-800'
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
                Every tournament has its underdogs...
              </motion.p>
              <motion.p
                className='text-2xl font-medium text-center text-white leading-relaxed mt-4'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Here's your group's favorite Cinderella story
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
                🏰 Group's Cinderella Pick
              </motion.h2>

              {/* Cinderella Team Card */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mt-6'
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
                        Making it to the{' '}
                        <span className='font-bold'>{cinderellaData.roundReached}</span>
                      </p>
                    </div>
                  </div>
                  <Image src={saintPeters} alt={cinderellaData.team} className='w-20 h-20' />
                </div>
              </motion.div>

              {/* Bracket Owner Card */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className='text-xl font-bold text-white mb-3'>Bracket Owner</h4>

                <div className='flex items-center'>
                  {cinderellaData.bracketOwner.avatarUrl && (
                    <div className='mr-4'>
                      <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-teal-400'>
                        <User />
                        {/* <Image
                          src={cinderellaData.bracketOwner.avatarUrl}
                          alt={cinderellaData.bracketOwner.name}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        /> */}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className='font-bold text-xl text-white'>
                      {cinderellaData.bracketOwner.name}
                    </p>
                    <p className='text-teal-200'>{cinderellaData.bracketOwner.bracketName}</p>
                  </div>
                </div>
              </motion.div>

              {/* Group Stats */}
              <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className='flex flex-col gap-4'>
                  <div>
                    <p className='text-sm text-teal-200 mb-1'>Percentage in your group</p>
                    <div className='flex items-center'>
                      <p className='text-3xl font-bold'>{cinderellaData.groupPercentage}%</p>
                      <p className='text-sm ml-2 text-white/70'>
                        (
                        {Math.round((cinderellaData.groupPercentage * groupInfo.memberCount) / 100)}{' '}
                        brackets)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Fun Fact */}
              {/* <motion.div
                className='w-full bg-white/15 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 mt-6'
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className='text-center text-white'>
                  <span className='font-bold'>Fun fact:</span> Only{' '}
                  <span className='font-bold text-teal-200'>
                    {Math.round((cinderellaData.groupPercentage * groupInfo.memberCount) / 100)}
                  </span>{' '}
                  {Math.round((cinderellaData.groupPercentage * groupInfo.memberCount) / 100) === 1
                    ? 'person'
                    : 'people'}{' '}
                  in your group predicted this Cinderella run!
                </p>
              </motion.div> */}
            </motion.div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupCinderellaSlide
