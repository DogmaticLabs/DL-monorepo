import { motion } from 'motion/react'
import { ReactNode } from 'react'
import GroupSlideBanner from '../group/GroupSlideBanner'

interface StoryCardProps {
  children: ReactNode
  title?: ReactNode
  showBanner?: boolean
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
  showBanner = true,
  animated = true,
  className = '',
  cardRef,
}: StoryCardProps) => {
  const cardStyle = {
    boxShadow:
      '0 8px 32px rgba(0, 103, 177, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
    transform: 'translateZ(0)',
  }

  const cardContent = (
    <>
      {/* Subtle glow effect overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none' />
      <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-5 mix-blend-overlay pointer-events-none" />

      {/* Title area if provided */}
      {title}

      {/* Main content */}
      <div className='px-8'>{children}</div>

      {/* Group Banner */}
      {showBanner && (
        <motion.div
          className='scale-[80%] mt-2 border-t border-white/20 pt-4'
          initial={animated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GroupSlideBanner />
        </motion.div>
      )}
    </>
  )

  // If animated, wrap with motion.div, otherwise return static div
  if (animated) {
    return (
      <motion.div
        ref={cardRef}
        className={`w-full bg-gradient-to-br from-gray-950/80 to-gray-900/90 backdrop-blur-lg rounded-xl pb-2 pt-6 mb-4 border border-white/30 relative overflow-hidden ${className}`}
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
    <div
      ref={cardRef}
      className={`w-full bg-gradient-to-br from-gray-950/80 to-gray-900/90 backdrop-blur-lg rounded-xl pb-2 pt-6 mb-4 border border-white/30 relative overflow-hidden ${className}`}
      style={cardStyle}
    >
      {cardContent}
    </div>
  )
}

export default StoryCard
