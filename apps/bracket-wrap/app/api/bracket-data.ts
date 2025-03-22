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
  const response = await fetch(`https://api.bracketwrap.com/groups/search?q=${query}&year=${year}`)
  const data = await response.json()
  return data
}

export const getBracketsForGroup = async (groupId: string, year = 2025): Promise<Group> => {
  const response = await fetch(`https://api.bracketwrap.com/groups/${groupId}?year=${year}`)
  const data = await response.json()
  return data
}

export const getBracket = async (bracketId: string, year = 2025): Promise<Bracket> => {
  const response = await fetch(
    `https://api.bracketwrap.com/brackets/${bracketId}/groups?year=${year}`,
  )
  if (!response.ok) throw new Error('Failed to fetch bracket')

  const data = await response.json()
  return data
}

export const getTeams = async (year = 2025): Promise<TeamMap> => {
  const response = await fetch(`https://api.bracketwrap.com/teams?year=${year}`)
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

// Updated types based on new JSON format
export type FinalFourPickData = {
  count: number
  rank: number
  teamId: string
}

export type FinalFourPickGroupData = {
  teamId: string
  count: number
  rank: number
  uniqueTeams: number
}

export type ChampionPickData = {
  teamId: string
  count?: number
  rank?: number
}

export type ChampionPickGroupData = {
  teamId: string
  count: number
  rank: number
}

export type ChampionStatsData = {
  teamId: string
  count: number
  rank: number
}

export type FinalFourStatsData = {
  teamId: string
  count: number
  uniqueTeams: number
  regionId: string
}

export type ChalkScoreData = {
  score: number
  percentile: number
  upsetsCount: number
  rank?: number
}

export type GroupChalkScoresData = {
  highestChalk: {
    bracket: {
      id: string
      name: string
      member: {
        id: string
        displayName: string
      }
      winnerId?: string
    }
    score: number
    percentile: number
    upsetsCount: number
    rank: number
  }
  lowestChalk: {
    bracket: {
      id: string
      name: string
      member: {
        id: string
        displayName: string
      }
      winnerId?: string
    }
    score: number
    percentile: number
    upsetsCount: number
    rank: number
  }
  averageChalk: {
    score: number
    percentile: number
  }
}

export type CelebrityTwinData = {
  id: string
  name: string
  member: {
    id: string
    displayName: string
    customDisplayName?: string
    description?: string
    logo?: string
  }
  weightedSimilarityPercentage: number
  matchingPicks: number
  winnerId?: string
  furthestSharedPicks: {
    round: Round
    teamIds: string[]
  }
}

export type TwinBracketData = {
  bracketId: string
  bracketName: string
  member: {
    id: string
    displayName: string
  }
  bracketWinnerId?: string
  twinBracketId: string
  twinBracketName: string
  twinMember: {
    id: string
    displayName: string
  }
  twinWinnerId?: string
  weightedSimilarityPercentage: number
  matchingPicks: number
  furthestSharedPicks: {
    round: Round
    teamIds: string[]
  }
}

export type BracketTwinData = {
  bracketWinnerId?: string
  weightedSimilarityPercentage: number
  matchingPicks: number
  furthestSharedPicks: {
    round: Round
    teamIds: string[]
  }
  bracketId: string
  bracketName: string
  member: {
    id: string
    displayName: string
  }
  winnerId?: string
}

export type NemesisBracketData = {
  bracketWinnerId?: string
  nemesisWinnerId?: string
  weightedSimilarityPercentage: number
  differentPicks: number
  bracketId: string
  bracketName: string
  member: {
    id: string
    displayName: string
  }
}

export type NemesisBracketsData = {
  bracketId: string
  bracketName: string
  member: {
    id: string
    displayName: string
  }
  bracketWinnerId?: string
  nemesisBracketId: string
  nemesisBracketName: string
  nemesisMember: {
    id: string
    displayName: string
  }
  nemesisWinnerId?: string
  weightedSimilarityPercentage: number
  differentPicks: number
}

export type CinderellaData = {
  teams: {
    teamId: string
    count?: number
    contributingBrackets?: {
      id: string
      name: string
      member?: {
        id: string
        displayName: string
      }
      winnerId?: string
    }[]
  }[]
  round: Round
}

export type ShareableSection<T> = {
  data: T
  shareId: string
}

export type BracketSlidesData = {
  wrapped: {
    group?: {
      championStats: ShareableSection<ChampionStatsData[]>
      finalFourStats: ShareableSection<FinalFourStatsData[]>
      twinBrackets: ShareableSection<TwinBracketData>
      chalkScores: ShareableSection<GroupChalkScoresData>
      cinderella: ShareableSection<CinderellaData>
      nemesisBrackets: ShareableSection<NemesisBracketsData>
    }
    bracket: {
      finalFourPicksNational: ShareableSection<FinalFourPickData[]>
      finalFourPicksGroup?: ShareableSection<FinalFourPickGroupData[]>
      championPickNational: ShareableSection<ChampionPickData>
      championPickGroup?: ShareableSection<ChampionPickGroupData>
      chalkScore: ShareableSection<ChalkScoreData>
      celebrityTwin: ShareableSection<CelebrityTwinData>
      twinBracket?: ShareableSection<BracketTwinData>
      nemesisBracket?: ShareableSection<NemesisBracketData>
      cinderella: ShareableSection<CinderellaData>
    }
  }
  info: {
    global: {
      count: number
    }
    group?: {
      data: {
        id: string
        name: string
        size: number
        uniqueChampions?: number
      }
      shareId: string
    }
    bracket: {
      data: {
        id: string
        name: string
        member: {
          id: string
          displayName: string
        }
      }
      shareId: string
    }
  }
}

export const getBracketSlides = async (
  bracketId: string,
  groupId?: string,
  year = 2025,
): Promise<BracketSlidesData> => {
  const url = `https://api.bracketwrap.com/brackets/${bracketId}/wrapped-v2?year=${year}${groupId ? `&group_id=${groupId}` : ''}`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export const bracketSlidesMockData = {
  wrapped: {
    group: {
      championStats: {
        data: [
          {
            teamId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
            count: 9,
            rank: 1,
          },
          {
            teamId: 'a483bc51-c12d-11ee-b568-d9cd047f74cf',
            count: 5,
            rank: 2,
          },
          {
            teamId: 'a47fc4b1-c12d-11ee-b568-d9cd047f74cf',
            count: 5,
            rank: 2,
          },
        ],
        shareId: 'HwJk63',
      },
      finalFourStats: {
        data: [
          {
            teamId: 'a47fc4b1-c12d-11ee-b568-d9cd047f74cf',
            count: 10,
            uniqueTeams: 6,
            regionId: '2',
          },
          {
            teamId: 'a48012d1-c12d-11ee-b568-d9cd047f74cf',
            count: 14,
            uniqueTeams: 4,
            regionId: '3',
          },
          {
            teamId: 'a483bc51-c12d-11ee-b568-d9cd047f74cf',
            count: 14,
            uniqueTeams: 6,
            regionId: '4',
          },
          {
            teamId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
            count: 19,
            uniqueTeams: 4,
            regionId: '1',
          },
        ],
        shareId: '3pzw2B',
      },
      twinBrackets: {
        data: {
          bracketId: '83c35140-e628-11ee-989f-0799037a5c4a',
          bracketName: 'I Know Zero College BBall',
          member: {
            id: 'C590A7D8-9FC9-42F3-966F-30E068F11936',
            displayName: 'Wyatt Ahern',
          },
          bracketWinnerId: 'a483bc51-c12d-11ee-b568-d9cd047f74cf',
          twinBracketId: '7e3f1590-e4ae-11ee-a25d-ffa44770e213',
          twinBracketName: 'Ben Corcoran',
          twinMember: {
            id: '6D64BD93-68F2-422F-A4BD-9368F2122F48',
            displayName: 'thebigbenito',
          },
          twinWinnerId: 'a483bc51-c12d-11ee-b568-d9cd047f74cf',
          weightedSimilarityPercentage: 89.0625,
          matchingPicks: 55,
          furthestSharedPicks: {
            round: {
              id: 6,
              name: 'Championship',
            },
            teamIds: ['a483bc51-c12d-11ee-b568-d9cd047f74cf'],
          },
        },
        shareId: 'DGAW6C',
      },
      chalkScores: {
        data: {
          highestChalk: {
            bracket: {
              id: '86001050-e674-11ee-b378-83dfaf2257b1',
              name: "If I dont win it's rigged",
              member: {
                id: 'D119A2CD-3DA7-41C3-98E3-465F0404F825',
                displayName: 'LiamLlorin',
              },
              winnerId: 'a47a1f61-c12d-11ee-b568-d9cd047f74cf',
            },
            score: 55.625,
            percentile: 95,
            upsetsCount: 27,
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
              winnerId: 'a483bc51-c12d-11ee-b568-d9cd047f74cf',
            },
            score: 2.5,
            percentile: 7,
            upsetsCount: 7,
            rank: 28,
          },
          averageChalk: {
            score: 14.59375,
            percentile: 47.892857142857146,
          },
        },
        shareId: 'e1DZjN',
      },
      cinderella: {
        data: {
          teams: [
            {
              teamId: 'a47c1b32-c12d-11ee-b568-d9cd047f74cf',
              count: 1,
              contributingBrackets: [
                {
                  id: '7b649040-e4ac-11ee-aac4-bff15ec54236',
                  name: 'Mark🪠',
                  member: {
                    id: 'B308F366-5560-4C12-81E1-569FE3BD955C',
                    displayName: 'espn10552692',
                  },
                  winnerId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
                },
              ],
            },
            {
              teamId: 'a482d1f2-c12d-11ee-b568-d9cd047f74cf',
              count: 1,
              contributingBrackets: [
                {
                  id: 'a5b9ac00-e613-11ee-9e22-95ed6c68037c',
                  name: 'rkidd',
                  member: {
                    id: '243E6BE8-B295-431A-81BA-461E99AD93F5',
                    displayName: 'ESPNFAN40762005',
                  },
                  winnerId: 'a47fc4b1-c12d-11ee-b568-d9cd047f74cf',
                },
              ],
            },
          ],
          round: {
            id: 4,
            name: 'Elite 8',
          },
        },
        shareId: 'qt1yer',
      },
      nemesisBrackets: {
        data: {
          bracketId: 'a5b9ac00-e613-11ee-9e22-95ed6c68037c',
          bracketName: 'rkidd',
          member: {
            id: '243E6BE8-B295-431A-81BA-461E99AD93F5',
            displayName: 'ESPNFAN40762005',
          },
          bracketWinnerId: 'a47fc4b1-c12d-11ee-b568-d9cd047f74cf',
          nemesisBracketId: '47eff380-e556-11ee-8a30-9354f5eec4fc',
          nemesisBracketName: "austinbrick9's Picks 1",
          nemesisMember: {
            id: '05FCC62B-6F45-42CD-BE80-4DF708CF1585',
            displayName: 'austinbrick9',
          },
          nemesisWinnerId: 'a483bc51-c12d-11ee-b568-d9cd047f74cf',
          weightedSimilarityPercentage: 19.270833333333336,
          differentPicks: 34,
        },
        shareId: 'je5sx0',
      },
    },
    bracket: {
      finalFourPicksGroup: {
        data: [
          {
            teamId: 'a47fc4b1-c12d-11ee-b568-d9cd047f74cf',
            count: 10,
            rank: 1,
            uniqueTeams: 6,
          },
          {
            teamId: 'a48012d1-c12d-11ee-b568-d9cd047f74cf',
            count: 14,
            rank: 1,
            uniqueTeams: 4,
          },
          {
            teamId: 'a4867b71-c12d-11ee-b568-d9cd047f74cf',
            count: 5,
            rank: 3,
            uniqueTeams: 6,
          },
          {
            teamId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
            count: 19,
            rank: 1,
            uniqueTeams: 4,
          },
        ],
        shareId: 'LZvcnm',
      },
      finalFourPicksNational: {
        data: [
          {
            count: 5880435,
            rank: 2,
            teamId: 'a47fc4b1-c12d-11ee-b568-d9cd047f74cf',
          },
          {
            count: 8728711,
            rank: 1,
            teamId: 'a48012d1-c12d-11ee-b568-d9cd047f74cf',
          },
          {
            count: 3043295,
            rank: 3,
            teamId: 'a4867b71-c12d-11ee-b568-d9cd047f74cf',
          },
          {
            count: 11124054,
            rank: 1,
            teamId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
          },
        ],
        shareId: '7qU0oD',
      },
      twinBracket: {
        data: {
          bracketWinnerId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
          weightedSimilarityPercentage: 85.41666666666666,
          matchingPicks: 50,
          furthestSharedPicks: {
            round: {
              id: 6,
              name: 'Championship',
            },
            teamIds: ['a4784aa1-c12d-11ee-b568-d9cd047f74cf'],
          },
          bracketId: '86af8090-e72c-11ee-81c4-7bef04977ba4',
          bracketName: 'stef',
          member: {
            id: 'DADEF768-5E93-4433-B81E-BFE95DEAFA93',
            displayName: 'sma4050',
          },
          winnerId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
        },
        shareId: 'aIs2lr',
      },
      nemesisBracket: {
        data: {
          bracketWinnerId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
          nemesisWinnerId: 'a47a1f61-c12d-11ee-b568-d9cd047f74cf',
          weightedSimilarityPercentage: 26.041666666666668,
          differentPicks: 30,
          bracketId: '86001050-e674-11ee-b378-83dfaf2257b1',
          bracketName: "If I dont win it's rigged",
          member: {
            id: 'D119A2CD-3DA7-41C3-98E3-465F0404F825',
            displayName: 'LiamLlorin',
          },
        },
        shareId: 'K3JhE2',
      },
      championPickNational: {
        data: {
          teamId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
        },
        shareId: 'o0TzLt',
      },
      championPickGroup: {
        data: {
          teamId: 'a4784aa1-c12d-11ee-b568-d9cd047f74cf',
          count: 9,
          rank: 1,
        },
        shareId: 'gAJ9Yz',
      },
      chalkScore: {
        data: {
          score: 3.375,
          percentile: 10,
          upsetsCount: 8,
        },
        shareId: 'Z2341U',
      },
      celebrityTwin: {
        data: {
          id: '0b3247e0-e236-11ee-971f-d540e0f2e3f3',
          name: "Molly Qerim's Bracket",
          member: {
            id: 'C9C8411D-96EC-4BC9-A06F-5AECCAE30ED3',
            displayName: 'Molly Qerim 2023',
            customDisplayName: 'Molly Qerim',
            description: 'Host, First Take',
            logo: 'https://chui-assets-cdn.espn.com/a47bb42d-8035-45dd-963c-eb8ecd8edb78.jpeg',
          },
          weightedSimilarityPercentage: 86.45833333333334,
          matchingPicks: 48,
          winnerId: 'a497b981-c12d-11ee-b568-d9cd047f74cf',
          furthestSharedPicks: {
            round: {
              id: 6,
              name: 'Championship',
            },
            teamIds: ['a497b981-c12d-11ee-b568-d9cd047f74cf'],
          },
        },
        shareId: '0qHpfG',
      },
      cinderella: {
        data: {
          teams: [
            {
              teamId: 'a47e8c32-c12d-11ee-b568-d9cd047f74cf',
            },
          ],
          round: {
            id: 2,
            name: 'Round of 32',
          },
        },
        shareId: '8lB7VS',
      },
    },
  },
  info: {
    global: {
      count: 20000000,
    },
    group: {
      data: {
        id: '234323db-d93f-3c92-9f0b-84e347b27209',
        name: 'Catonsville',
        size: 28,
        uniqueChampions: 9,
      },
      shareId: 'MwCTKa',
    },
    bracket: {
      data: {
        id: '32c47540-e61d-11ee-8330-41bccba46367',
        name: "RyanMarcus's Picks 1",
        member: {
          id: '3E307157-31E1-4F82-A450-9936ADEA7623',
          displayName: 'RyanMarcus',
        },
      },
      shareId: 'Lv4Gaa',
    },
  },
}
