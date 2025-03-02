import Image from 'next/image'
import StorySlide from '../StorySlide'

interface GroupOverviewSlideProps {
  groupName?: string
  groupFavorite?: {
    name: string
    logo?: string
  }
  groupUnderdog?: {
    name: string
    logo?: string
  }
  similarBrackets?: {
    user1: string
    user2: string
    similarity: number
  }
  riskiestBracket?: {
    name: string
    riskPercentage: number
  }
  safestBracket?: {
    name: string
    safePercentage: number
  }
}

const GroupOverviewSlide = ({
  groupName = 'BRACKET TWINS',
  groupFavorite = { name: 'UCONN' },
  groupUnderdog = { name: 'NC STATE' },
  similarBrackets = { user1: 'RYAN', user2: 'STEF', similarity: 91 },
  riskiestBracket = { name: 'ALEX', riskPercentage: 85 },
  safestBracket = { name: 'JORDAN', safePercentage: 92 },
}: GroupOverviewSlideProps) => {
  return (
    <StorySlide bgColor='bg-gradient-to-br from-slate-900 to-slate-800'>
      <div className='flex flex-col items-center w-full max-w-md'>
        {/* Title */}
        <div className='w-full text-center mb-4'>
          <h1 className='text-4xl font-extrabold tracking-wider text-white'>
            <span className='text-sm font-medium block mb-1'>LEAGUE & SIMPLE</span>
            MARCH MADNESS
          </h1>
        </div>

        {/* Main bracket display */}
        <div className='w-full flex justify-between gap-2 relative'>
          {/* Left side - Group Favorite */}
          <div className='w-[48%] flex flex-col gap-2'>
            <div className='bg-blue-400 text-white text-center py-1 rounded-t-md'>
              <p className='text-sm font-bold'>LEAGUE CHAMPION</p>
            </div>
            <div className='bg-white/90 p-2 rounded-b-md text-center'>
              <p className='text-xs text-blue-500'>LEAGUE CHAMPION</p>
              <p className='text-2xl font-bold text-slate-900'>{groupFavorite.name}</p>
              <p className='text-sm text-blue-500'>{groupFavorite.name}</p>
            </div>

            {/* Team logo placeholder */}
            <div className='bg-white/90 p-3 rounded-md mt-2 flex justify-center'>
              {groupFavorite.logo ? (
                <Image src={groupFavorite.logo} alt={groupFavorite.name} width={80} height={80} />
              ) : (
                <div className='w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>LOGO</span>
                </div>
              )}
            </div>
          </div>

          {/* Center trophy and group name */}
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
            <div className='w-12 h-16 flex flex-col items-center'>
              <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
                <div className='w-6 h-6 rounded-full bg-red-500'></div>
              </div>
              <div className='w-4 h-6 bg-white'></div>
              <div className='w-8 h-2 bg-white'></div>
            </div>

            <div className='flex flex-col items-center mt-8'>
              <div className='w-6 h-6 rounded-full bg-blue-400 mb-1'></div>
              <p className='text-xs text-white font-bold'>{groupName}</p>
              <div className='w-6 h-6 rounded-full bg-red-500 mt-1'></div>
            </div>
          </div>

          {/* Right side - Group Underdog */}
          <div className='w-[48%] flex flex-col gap-2'>
            <div className='bg-red-500 text-white text-center py-1 rounded-t-md'>
              <p className='text-sm font-bold'>UNDERDOG PICK</p>
            </div>
            <div className='bg-white/90 p-2 rounded-b-md text-center'>
              <p className='text-xs text-red-500'>UNDERDOG PICK</p>
              <p className='text-2xl font-bold text-slate-900'>{groupUnderdog.name}</p>
              <p className='text-sm text-red-500'>{groupUnderdog.name}</p>
            </div>

            {/* Team logo placeholder */}
            <div className='bg-white/90 p-3 rounded-md mt-2 flex justify-center'>
              {groupUnderdog.logo ? (
                <Image src={groupUnderdog.logo} alt={groupUnderdog.name} width={80} height={80} />
              ) : (
                <div className='w-20 h-20 bg-red-900 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>LOGO</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section - Similar brackets */}
        <div className='w-full mt-4 bg-white/90 p-3 rounded-md text-center'>
          <p className='text-lg font-bold text-slate-900'>BRACKET TWINS</p>
          <p className='text-xl font-bold text-slate-900'>
            {similarBrackets.user1} & {similarBrackets.user2}
          </p>
          <p className='text-lg font-bold text-slate-900'>{similarBrackets.similarity}% SIMILAR</p>
        </div>

        {/* Risk vs Safe section */}
        <div className='w-full flex justify-between gap-2 mt-2'>
          <div className='w-[48%] bg-white/90 p-2 rounded-md text-center'>
            <p className='text-sm font-bold text-blue-500'>RISKIEST BRACKET</p>
            <p className='text-lg font-bold text-slate-900'>{riskiestBracket.name}</p>
            <p className='text-sm text-blue-500'>{riskiestBracket.riskPercentage}% RISK</p>
          </div>
          <div className='w-[48%] bg-white/90 p-2 rounded-md text-center'>
            <p className='text-sm font-bold text-red-500'>SAFEST BRACKET</p>
            <p className='text-lg font-bold text-slate-900'>{safestBracket.name}</p>
            <p className='text-sm text-red-500'>{safestBracket.safePercentage}% SAFE</p>
          </div>
        </div>
      </div>
    </StorySlide>
  )
}

export default GroupOverviewSlide
