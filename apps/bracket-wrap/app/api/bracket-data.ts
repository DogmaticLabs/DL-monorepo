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
