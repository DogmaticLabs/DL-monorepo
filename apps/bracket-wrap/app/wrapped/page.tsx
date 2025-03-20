'use client'

import { SearchParamsProvider, StoryProvider, useBracketSlides } from '@/components/providers'
import BracketChalkScoreSlide from '@/components/story-slides/bracket/BracketChalkScoreSlide'
import BracketCinderellaSlide from '@/components/story-slides/bracket/BracketCinderellaSlide'
import BracketFinalFourSlide from '@/components/story-slides/bracket/BracketFinalFourSlide'
import BracketNemesisSlide from '@/components/story-slides/bracket/BracketNemesisSlide'
import BracketTwinSlide from '@/components/story-slides/bracket/BracketTwinSlide'
import CelebrityTwinSlide from '@/components/story-slides/bracket/CelebrityTwinSlide'
import GroupChalkScoreSlide from '@/components/story-slides/group/GroupChalkScoreSlide'
import GroupCinderellaSlide from '@/components/story-slides/group/GroupCinderellaSlide'
import GroupFinalFourSlide from '@/components/story-slides/group/GroupFinalFourSlide'
import GroupNemesesSlide from '@/components/story-slides/group/GroupNemesesSlide'
import GroupTopPicksSlide from '@/components/story-slides/group/GroupTopPicksSlide'
import GroupTwinsSlide from '@/components/story-slides/group/GroupTwinsSlide'
import StoryContainer from '@/components/StoryContainer'
import { use } from 'react'

export default function WrappedPage({ searchParams }: { searchParams: Promise<{ mode: string }> }) {
  const unwrappedParams = use(searchParams)

  const [bracketSlidesData] = useBracketSlides()

  if (!bracketSlidesData) {
    return <div>Loading...</div>
  }

  return (
    <SearchParamsProvider params={unwrappedParams}>
      <div id='app-content' className='relative w-full flex flex-col bg-[#1e293b]'>
        <StoryProvider>
          <StoryContainer>
            {/* Group Slides */}
            <GroupTopPicksSlide />

            <GroupCinderellaSlide />

            <GroupTwinsSlide />

            <GroupNemesesSlide />

            <GroupChalkScoreSlide />

            <GroupFinalFourSlide />

            {/* Bracket Slides */}

            <BracketFinalFourSlide />

            <BracketTwinSlide />

            <CelebrityTwinSlide />

            <BracketNemesisSlide />

            <BracketCinderellaSlide />

            <BracketChalkScoreSlide />
          </StoryContainer>
        </StoryProvider>
      </div>
    </SearchParamsProvider>
  )
}
