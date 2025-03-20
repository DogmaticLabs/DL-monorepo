import { useBracketSlides } from '@/components/providers'
import { cn } from '@workspace/ui/lib/utils'
import Image from 'next/image'

interface GroupBannerProps {
  showGroup?: boolean
  showBracket?: boolean
  className?: string
}

const GroupSlideBanner = ({
  showGroup = true,
  showBracket = true,
  className = '',
}: GroupBannerProps) => {
  const [bracketSlidesData] = useBracketSlides()

  const groupName = bracketSlidesData?.info.group?.data.name
  const memberCount = bracketSlidesData?.info.group?.data.size

  const bracketName = bracketSlidesData?.info.bracket?.data.name
  const bracketMember = bracketSlidesData?.info.bracket?.data.member.displayName
  showBracket = showBracket || (showGroup && !groupName)

  return (
    <div className={cn('w-full flex justify-center opacity-100', className)}>
      {showGroup && (
        <div
          className={`${showBracket ? 'flex-1 max-w-[50%]' : ''} flex justify-center px-x py-2 flex items-center space-x-1 shadow-sm`}
        >
          <div className='w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4 h-4 text-white'
            >
              <path
                fillRule='evenodd'
                d='M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z'
                clipRule='evenodd'
              />
              <path d='M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z' />
            </svg>
          </div>

          <div className='justify-center overflow-hidden flex-col flex min-w-0'>
            <span className='font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis text-xs leading-4'>
              {groupName}
            </span>
            {memberCount && (
              <span className='text-[10px] text-white/80'>{memberCount} Members</span>
            )}
          </div>
        </div>
      )}
      {showBracket && (
        <div
          className={`${showGroup ? 'flex-1 max-w-[50%] border-l border-white/20' : ''} flex px-2 py-2 space-x-1 items-center justify-between`}
        >
          <div className='rounded-full shrink-0 size-6 flex items-center justify-center'>
            <Image src='/uconn.png' alt='Group Slide Banner Icon' width={20} height={20} />
          </div>
          <div className='flex flex-col flex-1 min-w-0'>
            <span className='text-white font-semibold text-xs leading-4 whitespace-nowrap overflow-hidden text-ellipsis'>
              {bracketName}
            </span>
            <span className='text-white/80 text-[10px] leading-4'>{bracketMember}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupSlideBanner
