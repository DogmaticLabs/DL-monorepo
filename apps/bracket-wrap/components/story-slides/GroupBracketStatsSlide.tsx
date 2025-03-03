import StorySlide from '../StorySlide'

const GroupBracketStatsSlide = () => {
  // Stub data for the user's Final Four picks and group statistics
  const finalFourData = [
    { team: 'UConn', seed: 1, groupPercentage: 65.4, region: 'East' },
    { team: 'Purdue', seed: 1, groupPercentage: 38.2, region: 'Midwest' },
    { team: 'Houston', seed: 1, groupPercentage: 54.1, region: 'South' },
    { team: 'Tennessee', seed: 2, groupPercentage: 22.7, region: 'West' },
  ]

  // Stub data for championship matchup
  const championshipMatchup = {
    winner: {
      team: 'UConn',
      seed: 1,
      groupPercentage: 41.8,
      popularityRank: 1,
    },
    runnerUp: {
      team: 'Purdue',
      seed: 1,
      groupPercentage: 23.6,
      popularityRank: 2,
    },
  }

  // Stub data for group info
  const groupInfo = {
    name: 'Office Pool',
    memberCount: 24,
  }

  return (
    <StorySlide bgColor='bg-gradient-to-br from-indigo-800 to-purple-900'>
      <div className='flex flex-col items-center justify-center gap-4 w-full'>
        <h2 className='text-3xl font-bold mb-1'>Your Final Four in {groupInfo.name}</h2>
        <p className='text-sm text-gray-300 mb-2'>
          Comparing with {groupInfo.memberCount} other brackets
        </p>

        {/* Bracket visualization */}
        <div className='w-full flex flex-col items-center'>
          {/* Semifinal matchups */}
          <div className='w-full flex justify-between mb-6'>
            <div className='w-[48%]'>
              <div className='text-xs text-center mb-1 text-gray-300'>Semifinal 1</div>
              <div className='flex flex-col gap-2'>
                {/* First semifinal teams */}
                {[finalFourData[0], finalFourData[1]].map((team, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center p-2 bg-white/10 rounded-lg ${
                      team?.team === championshipMatchup.winner.team ||
                      team?.team === championshipMatchup.runnerUp.team
                        ? 'border border-yellow-400'
                        : ''
                    }`}
                  >
                    <div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2'>
                      <span className='font-bold text-xs'>{team?.seed}</span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-bold'>{team?.team}</p>
                      <p className='text-xs'>{team?.region}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs'>
                        <span className='font-bold'>{team?.groupPercentage}%</span>
                      </p>
                      <p className='text-xs'>of group</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='w-[48%]'>
              <div className='text-xs text-center mb-1 text-gray-300'>Semifinal 2</div>
              <div className='flex flex-col gap-2'>
                {/* Second semifinal teams */}
                {[finalFourData[2], finalFourData[3]].map((team, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center p-2 bg-white/10 rounded-lg ${
                      team?.team === championshipMatchup.winner.team ||
                      team?.team === championshipMatchup.runnerUp.team
                        ? 'border border-yellow-400'
                        : ''
                    }`}
                  >
                    <div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2'>
                      <span className='font-bold text-xs'>{team?.seed}</span>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-bold'>{team?.team}</p>
                      <p className='text-xs'>{team?.region}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs'>
                        <span className='font-bold'>{team?.groupPercentage}%</span>
                      </p>
                      <p className='text-xs'>of group</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Championship */}
          <div className='w-3/4 mt-2'>
            <div className='text-xs text-center mb-1 text-gray-300'>Championship</div>
            <div className='flex flex-col gap-2'>
              {/* Championship teams */}
              {[championshipMatchup.winner, championshipMatchup.runnerUp].map((team, idx) => (
                <div
                  key={idx}
                  className={`flex items-center p-3 bg-white/10 rounded-lg ${
                    idx === 0 ? 'border-2 border-yellow-400' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full ${idx === 0 ? 'bg-yellow-500/80' : 'bg-white/20'} flex items-center justify-center mr-2`}
                  >
                    <span className='font-bold text-sm'>{team.seed}</span>
                  </div>
                  <div className='flex-1'>
                    <p className='font-bold'>{team.team}</p>
                    <p className='text-xs'>{idx === 0 ? 'Champion' : 'Runner-up'}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm'>
                      <span className='font-bold'>{team.groupPercentage}%</span>
                    </p>
                    <p className='text-xs'>of group</p>
                    <p className='text-xs mt-1'>#{team.popularityRank} in group</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupBracketStatsSlide
