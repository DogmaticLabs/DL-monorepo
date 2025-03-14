export type Group = {
  id: string
  name: string
  year: number
  creatorMember: {
    id: string
    displayName: string
  }
  public: boolean
  size: number
  brackets: Bracket[]
  logo?: string
}

export type Bracket = {
  id: string
  name: string
  member: {
    id: string
    displayName: string
  }
  winnerId: string
  groups: Group[]
}

export type BracketWithGroups = {
  id: string
  name: string
  year: number
  member: {
    id: string
    displayName: string
  }
  winnerId?: string
  groups: {
    id: string
    name: string
    creatorMemberId: string
    public: boolean
    size: number
  }[]
}

export type Team = {
  id: string
  name: string
  description: string
  abbreviation: string
  colors: {
    primary: string
    secondary: string
  }
  images: {
    primary: string
    secondary: string
  }
  seed: number
  regionId: number
}

export type TeamMap = Record<string, Team>

export const searchGroupsByQuery = async (query: string, year = 2025): Promise<Group[]> => {
  const response = await fetch(
    `https://bracket-wrap-git-main-ryan-marcus-projects.vercel.app/groups/search?q=${query}&year=${year}`,
  )
  const data = await response.json()
  return data
}

export const getBracketsForGroup = async (groupId: string, year = 2024): Promise<Group> => {
  const response = await fetch(
    `https://bracket-wrap-git-main-ryan-marcus-projects.vercel.app/groups/${groupId}?year=${year}`,
  )
  const data = await response.json()
  return data
}

export const getBracket = async (bracketId: string, year = 2024): Promise<Bracket> => {
  const response = await fetch(
    `https://bracket-wrap-git-main-ryan-marcus-projects.vercel.app/brackets/${bracketId}/groups`,
  )
  if (!response.ok) throw new Error('Failed to fetch bracket')

  const data = await response.json()
  return data
}

export const getTeams = async (year = 2024): Promise<TeamMap> => {
  const response = await fetch(
    `https://bracket-wrap-git-main-ryan-marcus-projects.vercel.app/teams?year=${year}`,
  )
  const data = await response.json()
  return data
}

export type Round = {
  id: number
  name: string
}

export type TeamWithSeed = {
  id: string
  seed: number
  regionId: number
}

export type ChampionPick = {
  teamId: string
  count: number
  percentage: number
}

export type CinderellaTeam = {
  id: string
  seed: number
  count: number
  percentage: number
}

export type BracketInfo = {
  id: string
  name: string
  member: {
    id: string
    displayName: string
    customDisplayName?: string
    description?: string
    logo?: string
  }
}

export type ChalkScore = {
  bracket: BracketInfo
  score: number
  rank: number
}

export type FinalFourTeam = {
  team: TeamWithSeed
  count: number
  percentage: number
  rank: number
  totalTeamsInRegion: number
}

export type BracketSlide = {
  slide: string
  order: number
  data: {
    // GROUP_OVERVIEW slide
    championPicks?: ChampionPick[]
    cinderella?: {
      teams: CinderellaTeam[]
      round: Round
    }
    mostSimilarGroupBracketTwins?: {
      brackets: BracketInfo[]
      weightedSimilarityPercentage: number
      year: number
      groupId: string
    }
    chalkScores?: {
      highestChalk: ChalkScore
      lowestChalk: ChalkScore
    }

    // BRACKET_TWIN slides
    weightedSimilarityPercentage?: number
    matchingPicks?: number
    finalPickWinnerId?: string
    furthestSharedPicks?: {
      round: Round
      teamIds: string[]
    }

    // SAME_CHAMPION slides
    teamId?: string
    count?: number
    percentage?: number
    rank?: number
    totalChampions?: number

    // SAME_FINAL_FOUR slides
    teams?: FinalFourTeam[]

    // BRACKET_CINDERELLA slide
    team?: TeamWithSeed
    round?: Round

    // CHALK_BRACKET slide
    score?: number
  }
}

export type Member = {
  id: string
  displayName: string
}

export type BracketSlidesData = {
  id: string
  name: string
  year: number
  member: Member
  finalPickWinnerId: string
  group: Group
  wrapped: {
    slides: BracketSlide[]
  }
}

export const getBracketSlides = async (
  bracketId: string,
  groupId?: string,
): Promise<BracketSlidesData> => {
  const url = groupId
    ? `https://bracket-wrap-qaj2wo7wh-ryan-marcus-projects.vercel.app/brackets/${bracketId}/wrapped/?groupId=${groupId}`
    : `https://bracket-wrap-qaj2wo7wh-ryan-marcus-projects.vercel.app/brackets/${bracketId}/wrapped/`
  const response = await fetch(url)
  const data = await response.json()
  return data
}
