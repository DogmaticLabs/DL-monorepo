import { motion } from 'motion/react'

interface GroupBannerProps {
  groupName: string
  memberCount?: number
  variant?: 'default' | 'compact'
  className?: string
}

const GroupBanner = ({
  groupName,
  memberCount,
  variant = 'default',
  className = '',
}: GroupBannerProps) => {
  return (
    <motion.div
      className={`sticky top-0 z-10 flex items-center justify-center w-full ${className}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-white/20 shadow-sm'>
        <div className='w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center'>
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

        {variant === 'default' ? (
          <>
            <span className='font-semibold text-white'>{groupName}</span>
            {memberCount && (
              <span className='text-xs text-white/80'>
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </span>
            )}
          </>
        ) : (
          <span className='font-semibold text-white text-sm'>{groupName}</span>
        )}
      </div>
    </motion.div>
  )
}

export default GroupBanner
