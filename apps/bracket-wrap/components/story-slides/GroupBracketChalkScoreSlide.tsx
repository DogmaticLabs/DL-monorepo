import StorySlide from '../StorySlide'

const GroupBracketChalkScoreSlide = () => {
  // Stub data for chalk score comparison
  const chalkScoreData = {
    userScore: 68,
    groupAverage: 52,
    groupMax: 87,
    groupMin: 23,
    userRank: 3,
    totalMembers: 24,
    riskLevel: 'High Risk Taker', // Could be: 'Extreme Chalk', 'Mostly Chalk', 'Balanced', 'Risk Taker', 'High Risk Taker'
  }

  // Stub data for group info
  const groupInfo = {
    name: 'Bracket Group',
  }

  // Stub data for notable upsets picked by user
  const upsetPicks = [
    { winner: 'Princeton', winnerSeed: 15, loser: 'Arizona', loserSeed: 2, round: 'First Round' },
    { winner: 'Furman', winnerSeed: 13, loser: 'Virginia', loserSeed: 4, round: 'First Round' },
    { winner: "Saint Peter's", winnerSeed: 11, loser: 'Kentucky', loserSeed: 6, round: 'Sweet 16' },
  ]

  return (
    <StorySlide bgColor='bg-gradient-to-br from-purple-800 to-indigo-900'>
      <div className='flex flex-col items-center justify-center gap-5 w-full'>
        <h2 className='text-3xl font-bold'>Your Bracket Risk in {groupInfo.name}</h2>

        {/* Chalk Score Visualization */}
        <div className='w-full p-4 bg-white/10 rounded-lg'>
          <div className='flex justify-between items-center mb-3'>
            <div>
              <p className='text-sm text-gray-300'>Your Chalk Score</p>
              <p className='text-4xl font-bold'>{chalkScoreData.userScore}</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-300'>Group Average</p>
              <p className='text-2xl'>{chalkScoreData.groupAverage}</p>
            </div>
          </div>

          {/* Progress bar visualization */}
          <div className='relative h-6 bg-white/20 rounded-full w-full mb-2'>
            <div
              className='absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'
              style={{
                width: `${((chalkScoreData.userScore - chalkScoreData.groupMin) / (chalkScoreData.groupMax - chalkScoreData.groupMin)) * 100}%`,
              }}
            ></div>
            <div
              className='absolute h-8 w-4 bg-yellow-400 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2'
              style={{
                left: `${((chalkScoreData.userScore - chalkScoreData.groupMin) / (chalkScoreData.groupMax - chalkScoreData.groupMin)) * 100}%`,
              }}
            ></div>
            <div
              className='absolute h-8 w-1 bg-white/50 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2'
              style={{
                left: `${((chalkScoreData.groupAverage - chalkScoreData.groupMin) / (chalkScoreData.groupMax - chalkScoreData.groupMin)) * 100}%`,
              }}
            ></div>
          </div>

          <div className='flex justify-between text-xs text-gray-300'>
            <span>Chalk</span>
            <span>Risk Taker</span>
          </div>

          <div className='mt-3 text-center'>
            <p className='text-sm'>
              You rank <span className='font-bold'>#{chalkScoreData.userRank}</span> out of{' '}
              {chalkScoreData.totalMembers} in risk level
            </p>
            <p className='text-lg font-bold mt-1'>{chalkScoreData.riskLevel}</p>
          </div>
        </div>

        {/* Notable Upsets Section */}
        <div className='w-full'>
          <h3 className='text-xl font-bold mb-2'>Your Bold Upset Picks</h3>
          <div className='space-y-2'>
            {upsetPicks.map((upset, idx) => (
              <div key={idx} className='flex items-center p-3 bg-white/10 rounded-lg'>
                <div className='flex-1 flex items-center'>
                  <div className='w-7 h-7 rounded-full bg-green-500/30 flex items-center justify-center mr-2'>
                    <span className='font-bold text-xs'>{upset.winnerSeed}</span>
                  </div>
                  <div>
                    <p className='font-bold text-sm'>{upset.winner}</p>
                    <p className='text-xs text-gray-300'>{upset.round}</p>
                  </div>
                </div>
                <div className='mx-2 text-xs'>over</div>
                <div className='flex items-center'>
                  <div className='w-7 h-7 rounded-full bg-red-500/30 flex items-center justify-center mr-2'>
                    <span className='font-bold text-xs'>{upset.loserSeed}</span>
                  </div>
                  <p className='font-bold text-sm'>{upset.loser}</p>
                </div>
              </div>
            ))}
          </div>

          {upsetPicks.length === 0 && (
            <div className='p-4 bg-white/10 rounded-lg text-center'>
              <p>You didn't pick any major upsets in your bracket.</p>
              <p className='text-sm text-gray-300 mt-1'>Playing it safe this year!</p>
            </div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupBracketChalkScoreSlide
