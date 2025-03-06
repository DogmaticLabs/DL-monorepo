'use client'

import LandingPage2 from '@/components/LandingPage2'
import BracketCinderellaSlide from '@/components/story-slides/BracketCinderellaSlide'
import BracketSummarySlide from '@/components/story-slides/BracketSummarySlide'
import BracketTwinSlide from '@/components/story-slides/BracketTwinSlide'
import CelebrityTwinBracketSlide from '@/components/story-slides/CelebrityTwinBracketSlide'
import GroupTopPicksSlide from '@/components/story-slides/group/GroupTopPicksSlide'
import GroupBracketChalkScoreSlide from '@/components/story-slides/GroupBracketChalkScoreSlide'
import GroupBracketStatsSlide from '@/components/story-slides/GroupBracketStatsSlide'
import GroupNemesisSlide from '@/components/story-slides/GroupNemesisSlide'
import NationalBracketStatsSlide from '@/components/story-slides/NationalBracketStatsSlide'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { Button } from '@workspace/ui/components/button'
import { memo, useEffect, useState } from 'react'
import { StoryProvider } from '../components/providers'
import StoryContainer from '../components/StoryContainer'
import StorySlide from '../components/StorySlide'
import './globals.css'

export default function Page() {
  // Define your slides here - we'll create 4 example slides (excluding the landing page)
  const totalSlides = 9

  const [init, setInit] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const [bracketId, setBracketId] = useState('')

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const handleBracketSubmit = (id: string) => {
    setBracketId(id)
    setShowStory(true)
  }

  if (!init) return null

  return (
    <div className='relative w-full min-h-svh flex flex-col bg-[#1e293b]'>
      {/* Particles background */}
      {/* <CoolParticles /> */}

      {showStory ? (
        // Landing page with MainStorySlide
        <div className='flex-1 flex items-center justify-center z-10'>
          <LandingPage2
            // bracketId={bracketId}
            // setBracketId={setBracketId}
            onSubmit={handleBracketSubmit}
          />
        </div>
      ) : (
        // Story sequence starts after the landing page
        <StoryProvider totalSlides={totalSlides}>
          <div className='flex-1 flex'>
            <StoryContainer>
              {/* <GroupOverviewSlide /> */}

              <GroupTopPicksSlide />

              <BracketTwinSlide bracketId={bracketId} />

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
      )}
    </div>
  )
}

const CoolParticles = memo(() => (
  <Particles
    id='tsparticles'
    className='absolute inset-0'
    options={{
      background: {
        opacity: 0,
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: '#ffffff',
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out',
          },
          random: true,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            // area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 0.5, max: 2 },
        },
      },
      detectRetina: true,
    }}
  />
))

// Add a display name for debugging purposes
CoolParticles.displayName = 'CoolParticles'
