import { cn } from '@workspace/ui/lib/utils'
import { motion } from 'motion/react'
import { ReactNode } from 'react'
import GroupSlideBanner from './GroupSlideBanner'

interface StoryCardProps {
  children: ReactNode
  title?: ReactNode
  showGroup?: boolean
  showBracket?: boolean
  animated?: boolean
  className?: string
  cardRef?: React.RefObject<HTMLDivElement>
}

/**
 * A reusable story card component with consistent styling for story slides
 */
const StoryCard = ({
  children,
  title,
  showGroup = false,
  showBracket = false,
  animated = true,
  className = '',
  cardRef,
}: StoryCardProps) => {
  const cardStyle = {
    boxShadow:
      '0 8px 32px rgba(0, 103, 177, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
    transform: 'translateZ(0)',
  }

  const baseCardClassName = cn(
    'flex-1 w-full max-w-sm min-w-[24rem] mx-auto bg-gradient-to-br from-gray-950/90 to-gray-900/80 backdrop-blur-lg rounded-xl pt-6 mb-4 border border-white relative overflow-hidden',
    className,
  )

  const cardContent = (
    <>
      {/* Subtle glow effect overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none' />

      {/* Title area if provided */}
      {title}

      {/* Main content */}
      <div className='px-8'>{children}</div>

      {/* Group Banner */}
      <motion.div
        className='mx-8 border-t border-white/20'
        initial={animated ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <GroupSlideBanner showGroup={showGroup} showBracket={showBracket} className='' />
      </motion.div>
    </>
  )

  // If animated, wrap with motion.div, otherwise return static div
  if (animated) {
    return (
      <motion.div
        ref={cardRef}
        className={baseCardClassName}
        style={cardStyle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: [-5, 5, -5, 5, 0] }}
        transition={{
          duration: 0.8,
          x: {
            duration: 0.5,
            times: [0, 0.25, 0.5, 0.75, 1],
            ease: 'easeOut',
            delay: 0.1,
          },
        }}
      >
        {cardContent}
      </motion.div>
    )
  }

  return (
    <div ref={cardRef} className={baseCardClassName} style={cardStyle}>
      {cardContent}
    </div>
  )
}

export default StoryCard
