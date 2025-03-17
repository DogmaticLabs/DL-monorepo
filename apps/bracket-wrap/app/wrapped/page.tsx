'use client'

import { SearchParamsProvider, StoryProvider } from '@/components/providers'
import BracketCinderellaSlide from '@/components/story-slides/BracketCinderellaSlide'
import BracketSummarySlide from '@/components/story-slides/BracketSummarySlide'
import BracketTwinSlide from '@/components/story-slides/BracketTwinSlide'
import CelebrityTwinBracketSlide from '@/components/story-slides/CelebrityTwinBracketSlide'
import GroupBracketNemesisSlide from '@/components/story-slides/group/GroupBracketNemesisSlide'
import GroupBracketTwinsSlide from '@/components/story-slides/group/GroupBracketTwinsSlide'
import GroupChalkScoreSlide from '@/components/story-slides/group/GroupChalkScoreSlide'
import GroupCinderellaSlide from '@/components/story-slides/group/GroupCinderellaSlide'
import GroupFinalFourSlide from '@/components/story-slides/group/GroupFinalFourSlide'
import GroupTopPicksSlide from '@/components/story-slides/group/GroupTopPicksSlide'
import GroupBracketChalkScoreSlide from '@/components/story-slides/GroupBracketChalkScoreSlide'
import GroupBracketStatsSlide from '@/components/story-slides/GroupBracketStatsSlide'
import GroupNemesisSlide from '@/components/story-slides/GroupNemesisSlide'
import NationalBracketStatsSlide from '@/components/story-slides/NationalBracketStatsSlide'
import StoryContainer from '@/components/StoryContainer'
import StorySlide from '@/components/StorySlide'
import { Button } from '@workspace/ui/components/button'
import { motion } from 'motion/react'
import { use } from 'react'

export default function WrappedPage({ searchParams }: { searchParams: Promise<{ mode: string }> }) {
  const unwrappedParams = use(searchParams)

  return (
    <SearchParamsProvider params={unwrappedParams}>
      <div id='app-content' className='relative w-full flex flex-col bg-[#1e293b]'>
        <motion.div
          key='story-content'
          className='flex-1'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StoryProvider>
            <div className='flex-1 flex'>
              <StoryContainer>
                {/* <GroupOverviewSlide /> */}

                <GroupTopPicksSlide />

                <GroupCinderellaSlide />

                <GroupBracketTwinsSlide />

                <GroupBracketNemesisSlide />

                <GroupFinalFourSlide />

                <GroupChalkScoreSlide />

                <BracketTwinSlide />

                <NationalBracketStatsSlide />

                <GroupBracketStatsSlide />

                <GroupBracketChalkScoreSlide />

                <GroupNemesisSlide />

                <BracketCinderellaSlide />

                <CelebrityTwinBracketSlide />

                <BracketSummarySlide />

                <StorySlide bgColor='bg-gradient-to-br from-pink-800 to-orange-800'>
                  <div className='flex flex-col items-center justify-center gap-6'>
                    <h2 className='text-3xl font-bold'>Your Biggest Upset Pick</h2>
                    <div className='flex items-center justify-between w-full p-4 bg-white/10 rounded-lg'>
                      <div className='text-center'>
                        <p className='text-sm'>Seed</p>
                        <p className='text-2xl font-bold'>#12</p>
                      </div>
                      <div className='text-center flex-1'>
                        <p className='text-xl font-bold'>Team Name</p>
                        <p>defeated</p>
                        <p className='text-xl font-bold'>Opponent</p>
                      </div>
                      <div className='text-center'>
                        <p className='text-sm'>Seed</p>
                        <p className='text-2xl font-bold'>#5</p>
                      </div>
                    </div>
                  </div>
                </StorySlide>

                <StorySlide bgColor='bg-gradient-to-br from-orange-800 to-yellow-700'>
                  <div className='flex flex-col items-center justify-center gap-6'>
                    <h2 className='text-3xl font-bold'>Your Final Four</h2>
                    <div className='grid grid-cols-2 gap-4 w-full'>
                      {[1, 2, 3, 4].map(team => (
                        <div key={team} className='bg-white/10 p-4 rounded-lg text-center'>
                          <p className='font-bold'>Team {team}</p>
                          <p className='text-sm'>Seed #{Math.floor(Math.random() * 8) + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </StorySlide>

                <StorySlide bgColor='bg-gradient-to-br from-yellow-700 to-green-800'>
                  <div className='flex flex-col items-center justify-center gap-6 text-center'>
                    <h2 className='text-3xl font-bold'>Share Your Results!</h2>
                    <p className='text-xl'>How did your bracket compare to your friends?</p>
                    <div className='flex gap-4'>
                      <Button variant='outline' className='bg-white/10 hover:bg-white/20'>
                        Share
                      </Button>
                      <Button variant='outline' className='bg-white/10 hover:bg-white/20'>
                        Play Again
                      </Button>
                    </div>
                  </div>
                </StorySlide>
              </StoryContainer>
            </div>
          </StoryProvider>
        </motion.div>
      </div>
    </SearchParamsProvider>
  )
}
