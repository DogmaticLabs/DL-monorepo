import StorySlide from '@/components/StorySlide'

const GroupTopPicksSlide = () => {
  // Stub data for group's most popular champion picks
  const championPicks = [
    { team: 'UConn', seed: 1, region: 'East', groupPercentage: 41.8 },
    { team: 'Houston', seed: 1, region: 'South', groupPercentage: 23.6 },
    { team: 'Purdue', seed: 1, region: 'Midwest', groupPercentage: 15.2 },
  ]

  // Stub data for group info
  const groupInfo = {
    name: 'Office Pool',
    memberCount: 24,
  }

  return (
    <StorySlide bgColor='bg-gradient-to-br from-pink-800 to-orange-800'>
      <div className='flex flex-col items-center justify-center gap-6 w-full'>
        <h2 className='text-3xl font-bold'>Top Picks in {groupInfo.name}</h2>
        <p className='text-sm text-gray-300 mb-2'>Based on {groupInfo.memberCount} brackets</p>

        {/* Top champion picks section */}
        <div className='w-full mt-2'>
          <h3 className='text-xl font-semibold mb-3'>Most Popular Champions</h3>
          <div className='flex flex-col gap-2'>
            {championPicks.map((pick, idx) => (
              <div key={idx} className='flex items-center p-3 bg-white/10 rounded-lg'>
                <div className='w-8 h-8 rounded-full bg-yellow-500/80 flex items-center justify-center mr-3'>
                  <span className='font-bold text-sm'>{pick.seed}</span>
                </div>
                <div className='flex-1'>
                  <p className='font-bold'>{pick.team}</p>
                  <p className='text-xs'>{pick.region} Region</p>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold'>{pick.groupPercentage}%</p>
                  <p className='text-xs'>of group</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupTopPicksSlide
