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
import { useTeams } from '@/hooks/useTeams'
import { useUrlParam } from '@/hooks/useUrlParams'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import { getBracketSlides } from '../api/bracket-data'

export default function WrappedPage({ searchParams }: { searchParams: Promise<{ mode: string }> }) {
  const unwrappedParams = use(searchParams)

  return (
    <SearchParamsProvider params={unwrappedParams}>
      <div id='app-content' className='relative w-full flex flex-col bg-[#1e293b]'>
        <RequireBracketSlides>
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
        </RequireBracketSlides>
      </div>
    </SearchParamsProvider>
  )
}

const RequireBracketSlides = ({ children }: { children: React.ReactNode }) => {
  const [bracketSlidesData, setBracketSlidesData] = useBracketSlides()
  const queryClient = useQueryClient()
  const [groupId, setGroupId] = useUrlParam<string>('group_id')
  const [bracketId, setBracketId] = useUrlParam<string>('bracket_id')
  const teamsData = useTeams()
  const router = useRouter()

  useEffect(() => {
    const fetchBracketSlides = async () => {
      try {
        if (!bracketId) return router.push('/')

        const res = await queryClient.fetchQuery({
          queryKey: ['bracketSlidesData', bracketId],
          queryFn: () => getBracketSlides(bracketId, groupId),
        })
        setBracketSlidesData(res)
      } catch (error) {
        console.log(error)
        router.push('/')
      }
    }

    fetchBracketSlides()
  }, [])

  if (!bracketSlidesData || !teamsData) {
    return null
  }

  return children
}
