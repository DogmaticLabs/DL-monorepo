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
  region: {
    id: number
    name: string
  }
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
  return Promise.resolve(bracketSlidesMockData)
  // const url = `https://bracket-wrap-qaj2wo7wh-ryan-marcus-projects.vercel.app/brackets/${bracketId}/wrapped/${groupId ? `?groupId=${groupId}` : ''}`
  // const response = await fetch(url)
  // const data = await response.json()
  // return data
}

export const bracketSlidesMockData = {
  id: '7b07ffd0-e545-11ee-b28c-c51af1c3e59d',
  name: 'Dilly ',
  year: 2024,
  member: {
    id: 'C13DE71F-1CF9-42FF-A498-790AFEF98DC3',
    displayName: 'ESPNFAN1726500265',
  },
  finalPickWinnerId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
  group: {
    id: '234323db-d93f-3c92-9f0b-84e347b27209',
    name: 'Catonsville',
    creatorMemberId: 'E6910EEE-C3D1-4D4E-95FA-5BF2FDA5D135',
    public: false,
    size: 28,
  },
  wrapped: {
    slides: [
      {
        slide: 'GROUP_OVERVIEW',
        order: 1,
        data: {
          championPicks: [
            {
              teamId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
              count: 9,
              percentage: 32.142857142857146,
            },
            {
              teamId: 'a497b9b1-c12d-11ee-b568-d9cd047f74cf',
              count: 5,
              percentage: 17.857142857142858,
            },
            {
              teamId: 'a497b99f-c12d-11ee-b568-d9cd047f74cf',
              count: 5,
              percentage: 17.857142857142858,
            },
          ],
          cinderella: {
            teams: [
              {
                id: 'a48fa336-c12d-11ee-b568-d9cd047f74cf',
                seed: 10,
                count: 1,
                percentage: 3.571428571428571,
              },
              {
                id: 'a4928966-c12d-11ee-b568-d9cd047f74cf',
                seed: 10,
                count: 1,
                percentage: 3.571428571428571,
              },
            ],
            round: {
              id: 4,
              name: 'Elite Eight',
            },
          },
          mostSimilarGroupBracketTwins: {
            brackets: [
              {
                id: '83c35140-e628-11ee-989f-0799037a5c4a',
                name: 'I Know Zero College BBall',
                member: {
                  displayName: 'Wyatt Ahern',
                  id: 'C590A7D8-9FC9-42F3-966F-30E068F11936',
                },
              },
              {
                id: '7e3f1590-e4ae-11ee-a25d-ffa44770e213',
                name: 'Ben Corcoran',
                member: {
                  displayName: 'thebigbenito',
                  id: '6D64BD93-68F2-422F-A4BD-9368F2122F48',
                },
              },
            ],
            weightedSimilarityPercentage: 89.0625,
            year: 2024,
            groupId: '234323db-d93f-3c92-9f0b-84e347b27209',
          },
          chalkScores: {
            highestChalk: {
              bracket: {
                id: '86001050-e674-11ee-b378-83dfaf2257b1',
                name: "If I dont win it's rigged",
                member: {
                  id: 'D119A2CD-3DA7-41C3-98E3-465F0404F825',
                  displayName: 'LiamLlorin',
                },
              },
              score: 294.5,
              rank: 1,
            },
            lowestChalk: {
              bracket: {
                id: '83c35140-e628-11ee-989f-0799037a5c4a',
                name: 'I Know Zero College BBall',
                member: {
                  id: 'C590A7D8-9FC9-42F3-966F-30E068F11936',
                  displayName: 'Wyatt Ahern',
                },
              },
              score: 232.5,
              rank: 28,
            },
          },
        },
      },
      {
        slide: 'BRACKET_TWIN_GROUP',
        order: 2,
        data: {
          id: '32c47540-e61d-11ee-8330-41bccba46367',
          name: "RyanMarcus's Picks 1",
          member: {
            id: '3E307157-31E1-4F82-A450-9936ADEA7623',
            displayName: 'RyanMarcus',
          },
          weightedSimilarityPercentage: 78.64583333333334,
          matchingPicks: 49,
          finalPickWinnerId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
          furthestSharedPicks: {
            round: {
              id: 6,
              name: 'Championship',
            },
            teamIds: ['a497b981-c12d-11ee-b568-d9cd047f74cf'],
          },
        },
      },
      {
        slide: 'BRACKET_TWIN_CELEBRITY',
        order: 3,
        data: {
          id: '4f2f1730-e302-11ee-bdd6-79c97aab67f6',
          name: "Greg Wyshynski's Bracket",
          member: {
            id: '8368B8DB-479F-417A-AA94-DBB2690359D7',
            displayName: 'UConnBuffalo',
            customDisplayName: 'Greg Wyshynski',
            description: 'Senior NHL Writer',
            logo: 'https://chui-assets-cdn.espn.com/b9b87ec8-5d0f-480b-9076-65d4cb1ffa44.jpeg',
          },
          weightedSimilarityPercentage: 76.04166666666666,
          matchingPicks: 44,
          finalPickWinnerId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
          furthestSharedPicks: {
            round: {
              id: 6,
              name: 'Championship',
            },
            teamIds: ['a497b981-c12d-11ee-b568-d9cd047f74cf'],
          },
        },
      },
      {
        slide: 'SAME_CHAMPION_NATIONAL',
        order: 4,
        data: {
          teamId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
          count: 4992408,
          percentage: 24.71260211492292,
          rank: 1,
          totalChampions: 64,
        },
      },
      {
        slide: 'SAME_CHAMPION_GROUP',
        order: 5,
        data: {
          teamId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
          count: 9,
          percentage: 32.142857142857146,
          rank: 1,
          totalChampions: 9,
        },
      },
      {
        slide: 'SAME_FINAL_FOUR_NATIONAL',
        order: 6,
        data: {
          teams: [
            {
              team: {
                id: 'a4943711-c12d-11ee-b568-d9cd047f74cf',
                seed: 1,
                regionId: 1,
              },
              count: 11124054,
              percentage: 55.0641032843915,
              rank: 1,
              totalTeamsInRegion: 16,
            },
            {
              team: {
                id: 'a494d357-c12d-11ee-b568-d9cd047f74cf',
                seed: 4,
                regionId: 2,
              },
              count: 1321841,
              percentage: 6.542880798774939,
              rank: 4,
              totalTeamsInRegion: 16,
            },
            {
              team: {
                id: 'a4952171-c12d-11ee-b568-d9cd047f74cf',
                seed: 1,
                regionId: 3,
              },
              count: 8728711,
              percentage: 43.206843984766174,
              rank: 1,
              totalTeamsInRegion: 16,
            },
            {
              team: {
                id: 'a4956f91-c12d-11ee-b568-d9cd047f74cf',
                seed: 1,
                regionId: 4,
              },
              count: 7606352,
              percentage: 37.651770798744906,
              rank: 1,
              totalTeamsInRegion: 16,
            },
          ],
        },
      },
      {
        slide: 'SAME_FINAL_FOUR_GROUP',
        order: 7,
        data: {
          teams: [
            {
              team: {
                id: 'a4943711-c12d-11ee-b568-d9cd047f74cf',
                seed: 1,
                regionId: 1,
              },
              count: 19,
              percentage: 67.85714285714286,
              rank: 1,
              totalTeamsInRegion: 4,
            },
            {
              team: {
                id: 'a494d357-c12d-11ee-b568-d9cd047f74cf',
                seed: 4,
                regionId: 2,
              },
              count: 1,
              percentage: 3.571428571428571,
              rank: 4,
              totalTeamsInRegion: 6,
            },
            {
              team: {
                id: 'a4952171-c12d-11ee-b568-d9cd047f74cf',
                seed: 1,
                regionId: 3,
              },
              count: 14,
              percentage: 50,
              rank: 1,
              totalTeamsInRegion: 4,
            },
            {
              team: {
                id: 'a4956f91-c12d-11ee-b568-d9cd047f74cf',
                seed: 1,
                regionId: 4,
              },
              count: 14,
              percentage: 50,
              rank: 1,
              totalTeamsInRegion: 6,
            },
          ],
        },
      },
      {
        slide: 'BRACKET_CINDERELLA',
        order: 8,
        data: {
          team: {
            id: 'a47a1f62-c12d-11ee-b568-d9cd047f74cf',
            seed: 12,
            regionId: 1,
          },
          round: {
            id: 2,
            name: 'Round of 32',
          },
        },
      },
      {
        slide: 'CHALK_BRACKET',
        order: 9,
        data: {
          score: 242.5,
          rank: 23,
        },
      },
    ],
  },
} as unknown as BracketSlidesData
